import React, { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./productInfo.css";

import { getAdminProducts } from "../../utils/adminStorage";
import baseProducts from "../../data/products";
import { getUserCart, setUserCart } from "../../utils/adminStorage";

export default function ProductInfo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = useMemo(() => {
    const admin = getAdminProducts();
    const source = admin && admin.length > 0 ? admin : baseProducts;
    return source.find((p) => p.id === Number(id));
  }, [id]);

  const unitPrice = product
    ? product.discountPrice ?? product.price
    : 0;

  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(unitPrice);
  const [message, setMessage] = useState("");

  const containerRef = useRef(null);
  const leftRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem("currentUser");

  const requireLogin = () => {
    if (!isLoggedIn) {
      navigate("/auth/login");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (product) {
      const up = product.discountPrice ?? product.price;
      setTotalPrice(up * quantity);
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

    setMessage(`${product.name} added to cart!`);
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
  }, []);

  if (!product)
    return (
      <h2 style={{ color: "white", padding: "100px" }}>
        Product not found.
      </h2>
    );

  const hasDiscount =
    product.discountPrice &&
    typeof product.discountPrice === "number" &&
    product.discountPrice < product.price;

  return (
    <>
      {message && <div className="fav-message">{message}</div>}

      <div className="product-details" ref={containerRef}>
        <div className="product-left" ref={leftRef}>
          <img src={product.imageUrl} alt={product.name} />
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-meta">
            {product.year} / {product.volume || "0.75 L"} •{" "}
            {product.country || "FRANCE"}
          </div>

          <div className="product-price">
            {hasDiscount ? (
              <>
                <span className="old-price">
                  {(product.price * quantity).toLocaleString("ru-RU")} Р
                </span>
                <span className="discount-price">
                  {totalPrice.toLocaleString("ru-RU")} Р
                </span>
              </>
            ) : (
              <span>{totalPrice.toLocaleString("ru-RU")} Р</span>
            )}
          </div>

          <div className="buy-row">
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Number(e.target.value)))
              }
            />
            <button className="buy-btn" onClick={handleAddToCart}>
              ADD TO CART
            </button>
          </div>

          <div className="product-stats">
            <div>
              <strong>GEOGRAPHY:</strong> {product.region}
            </div>
            <div>
              <strong>CLASSIFICATION:</strong> {product.classification}
            </div>
            <div>
              <strong>FORTRESS:</strong> {product.strength}
            </div>
            <div>
              <strong>SUGAR:</strong> {product.sugar}
            </div>
            <div>
              <strong>IMPORTER:</strong> {product.importer}
            </div>
            <div>
              <strong>RATING:</strong> {product.rating}
            </div>
            <div>
              <strong>VARIETAL COMPOSITION:</strong> {product.composition}
            </div>
          </div>

          <div className="product-section">
            <h3>COLOR, TASTE, AROMA</h3>
            <p>{product.description}</p>
          </div>
          <div className="product-section">
            <h3>LEGEND</h3>
            <p>{product.legend}</p>
          </div>
          <div className="product-section">
            <h3>VINIFICATION</h3>
            <p>{product.vinification}</p>
          </div>
        </div>
      </div>
    </>
  );
}
