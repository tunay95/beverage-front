import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./recommended.css";
import { Heart } from "lucide-react";

import {
  getUserCart,
  setUserCart,
  getUserFavorites,
  setUserFavorites,
  getAdminProducts,
} from "../../utils/adminStorage";
import baseProducts from "../../data/products";

export default function Recommended() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("currentUser")
  );

  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const syncLogin = () => {
      setIsLoggedIn(!!localStorage.getItem("currentUser"));
    };
    window.addEventListener("storage", syncLogin);
    return () => window.removeEventListener("storage", syncLogin);
  }, []);

  const requireLogin = () => {
    if (!isLoggedIn) {
      navigate("/auth/login");
      return false;
    }
    return true;
  };

  const normalizedCategory = category === "home" ? "wine" : category;

  // Məhsulları admin-dən oxuyuruq (fallback: baseProducts)
  const recommendedProducts = useMemo(() => {
    const admin = getAdminProducts();
    const source = admin && admin.length > 0 ? admin : baseProducts;

    return source
      .filter(
        (p) =>
          p.category === normalizedCategory &&
          !p.isDeleted
      )
      .slice(0, 12);
  }, [normalizedCategory]);

  // ekran ölçüsünə görə neçə kart
  useEffect(() => {
    const update = () => {
      if (window.innerWidth <= 550) setItemsPerPage(1);
      else if (window.innerWidth <= 1250) setItemsPerPage(2);
      else if (window.innerWidth >= 1600) setItemsPerPage(4);
      else setItemsPerPage(3);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleAddToFavorite = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!requireLogin()) return;

    const favorites = getUserFavorites();

    if (!favorites.find((x) => x.id === product.id)) {
      const updated = [...favorites, product];
      setUserFavorites(updated);
      setMessage(`${product.name} added to favorites!`);
    } else {
      setMessage(`${product.name} is already in favorites`);
    }

    setTimeout(() => setMessage(""), 2000);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!requireLogin()) return;

    let cart = getUserCart();
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    setUserCart(cart);
    window.dispatchEvent(new Event("cartUpdated"));

    setMessage(`${product.name} added to cart!`);
    setTimeout(() => setMessage(""), 2000);
  };

  const handleViewAll = () => {
    if (!normalizedCategory) {
      navigate("/");
    } else {
      navigate(`/${normalizedCategory}`);
    }
  };

  if (!recommendedProducts.length) return null;

  const totalPages = Math.ceil(recommendedProducts.length / itemsPerPage);
  const start = currentPage * itemsPerPage;
  const visible = recommendedProducts.slice(start, start + itemsPerPage);

  const next = () => setCurrentPage((p) => (p + 1) % totalPages);
  const prev = () => setCurrentPage((p) => (p - 1 + totalPages) % totalPages);

  return (
    <div className="recommended-section">
      <h2 className="recommended-title">You may also like ...</h2>

      {message && <div className="fav-message">{message}</div>}

      <div className="slider-wrapper">
        {totalPages > 1 && (
          <button className="arrow left" onClick={prev}>
            ❮
          </button>
        )}

        <div className="slider-track">
          {visible.map((p) => {
            const hasDiscount =
              p.discountPrice &&
              typeof p.discountPrice === "number" &&
              p.discountPrice < p.price;

            return (
              <div
                key={p.id}
                className="recommended-card"
                onClick={() => navigate(`/${p.category}/${p.id}`)}
              >
                <div className="image-wrapper">
                  <img src={p.imageUrl} alt={p.name} />
                </div>

                <div className="rec-name">{p.name}</div>

                <div className="rec-meta">
                  {p.year} / {p.volume || "0.75 L"} • {p.country || "ФРАНЦИЯ"}
                </div>

                <div className="price-row">
                  <div className="rec-price">
                    {hasDiscount ? (
                      <>
                        <span className="old-price">
                          {p.price.toLocaleString("ru-RU")} Р
                        </span>
                        <span className="discount-price">
                          {p.discountPrice.toLocaleString("ru-RU")} Р
                        </span>
                      </>
                    ) : (
                      <span>{p.price.toLocaleString("ru-RU")} Р</span>
                    )}
                  </div>
                  <div className="buttons">
                    <button
                      className="product-heart"
                      onClick={(e) => handleAddToFavorite(e, p)}
                    >
                      <Heart className="heart-icon" />
                    </button>

                    <button
                      className="to-cart"
                      onClick={(e) => handleAddToCart(e, p)}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <button className="arrow right" onClick={next}>
            ❯
          </button>
        )}
      </div>

      <div className="rec-view-all-wrapper">
        <button className="rec-view-all-btn" onClick={handleViewAll}>
          VIEW ALL ...
        </button>
      </div>
    </div>
  );
}
