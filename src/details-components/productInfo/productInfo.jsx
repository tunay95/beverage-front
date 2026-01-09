import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./productInfo.css";

import { getProductDetailed } from "../../data/productApi";
import { getUserCart, setUserCart } from "../../utils/adminStorage";

export default function ProductInfo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [message, setMessage] = useState("");

  const containerRef = useRef(null);
  const leftRef = useRef(null);
  // Fetch product data from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductDetailed(id);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);
  const isLoggedIn = !!localStorage.getItem("currentUser");

  const requireLogin = () => {
    if (!isLoggedIn) {
      navigate("/auth/login");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (product && product.price) {
      setTotalPrice(product.price * quantity);
    }
  }, [quantity, product]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!requireLogin()) return;

    let cart = getUserCart();
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    setUserCart(cart);
    window.dispatchEvent(new Event("cartUpdated"));

    setMessage(`${product.title} added to cart!`);
    setTimeout(() => setMessage(""), 2000);
  };

  useEffect(() => {
    const container = containerRef.current;
    const left = leftRef.current;
    if (!container || !left) return;

    const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 0;
    const EASE = 0.08;
    let startY = 0,
      maxTranslate = 0,
      raf;
    const current = { y: 0 },
      target = { y: 0 };

    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    const measure = () => {
      const info = container.querySelector(".product-info");
      const containerTop = container.offsetTop - navbarHeight;
      const leftH = left.offsetHeight;
      const infoBottom = info.offsetTop + info.scrollHeight;
      const leftBottom = left.offsetTop + leftH;

      startY = containerTop;
      // Allow scrolling with page but stop at the end of product-info height
      maxTranslate = Math.max(infoBottom - leftBottom, 0);
      updateTarget();
    };

    const updateTarget = () => {
      const scrollY = window.scrollY;
      target.y = clamp(scrollY - startY, 0, maxTranslate);
    };

    const animate = () => {
      current.y += (target.y - current.y) * EASE;
      left.style.transform = `translateY(${current.y.toFixed(2)}px)`;
      raf = requestAnimationFrame(animate);
    };

    measure();
    animate();
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", measure);
    left.querySelector("img")?.addEventListener("load", measure);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", measure);
    };
  }, [product]);

  if (loading) {
    return (
      <div style={{ color: "white", padding: "100px", textAlign: "center" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!product)
    return (
      <h2 style={{ color: "white", padding: "100px" }}>
        Product not found.
      </h2>
    );

  const detailItems = product.details || [];
  const fieldItems = product.fields || [];
  
  // Only use fields from API
  const topKeyValues = fieldItems.filter(
    (item) => item && item.key
  );
  // Bottom sections: use detail title/description (fallback to key/value)
  const detailSections = detailItems.filter(
    (item) => item && (item.title || item.description || item.key || item.value)
  );

  const apiBase =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.REACT_APP_API_BASE_URL ||
    "http://localhost:5034";

  const resolvedImageUrl = product?.imageUrl
    ? product.imageUrl.startsWith("http")
      ? product.imageUrl
      : `${apiBase}${product.imageUrl}`
    : "";

  return (
    <>
      {message && <div className="fav-message">{message}</div>}

      <div className="product-details" ref={containerRef}>
        <div className="product-left" ref={leftRef}>
          <img src={resolvedImageUrl} alt={product.title} />
        </div>

        <div className="product-info">
          <div className="product-header">
            <div className="title-block">
              <h1 className="product-title">{product.title}</h1>
              <div className="title-underline" />
              <div className="product-meta">
                <div className="meta-line meta-primary">
                  {product.prodDate ? new Date(product.prodDate).getFullYear() : ""} / {product.liter || "0.75"} L
                </div>
                <div className="meta-line meta-secondary">
                  {product.location || "FRANCE"} / {product.categoryName}
                </div>
              </div>
            </div>

            <div className="price-block">
              <div className="product-price">
                <span>{totalPrice.toLocaleString("ru-RU")} ₼</span>
              </div>

              <div className="buy-row">
                <div className="qty-box">
                  <button
                    className="qty-btn"
                    aria-label="decrease"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input
                    className="qty-input"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Number(e.target.value)))
                    }
                  />
                  <button
                    className="qty-btn"
                    aria-label="increase"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button className="buy-btn" onClick={handleAddToCart}>
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>

          {topKeyValues.length > 0 && (
            <div
              className="product-stats"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "12px",
                marginTop: "18px",
              }}
            >
              {topKeyValues.map((item, index) => (
                <div key={`${item.key}-${index}`}>
                  <strong>{item.key}:</strong> {item.value}
                </div>
              ))}
            </div>
          )}

          {detailSections.length > 0 && detailSections.map((detail, index) => (
            <div key={index} className="product-section">
              <h3>{detail.title || detail.key}</h3>
              <p>{detail.description || detail.value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
