import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./fav-recommend.css";
import { Heart } from "lucide-react";
import * as orderApi from "../../data/orderApi";
import { useAuth } from "../../hooks/useAuth";

import {
  getUserFavorites,
  setUserFavorites,
  getAdminProducts,
} from "../../utils/adminStorage";
import baseProducts from "../../data/products";

export default function FavRecommend() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [message, setMessage] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [mainCategory, setMainCategory] = useState("wine");
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    try {
      const favourites = getUserFavorites();

      const admin = getAdminProducts();
      const source = admin && admin.length > 0 ? admin : baseProducts;

      if (!favourites.length) {
        const rec = source
          .filter((p) => p.category === "wine" && !p.isDeleted)
          .slice(0, 12);

        setRecommendedProducts(rec);
        setMainCategory("wine");
        return;
      }

      const favIds = new Set(favourites.map((f) => f.id));
      const categories = [...new Set(favourites.map((f) => f.category))];
      const detectedMainCategory = categories[0] || "wine";
      setMainCategory(detectedMainCategory);

      const rec = source
        .filter(
          (p) =>
            p.category === detectedMainCategory &&
            !favIds.has(p.id) &&
            !p.isDeleted
        )
        .slice(0, 12);

      setRecommendedProducts(rec);
    } catch (err) {
      console.error("FavRecommend error:", err);
      setRecommendedProducts([]);
    }
  }, []);

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

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    if (cartLoading) return;

    try {
      setCartLoading(true);
      await orderApi.addToCart(product.id, 1);
      window.dispatchEvent(new Event("cartUpdated"));

      setMessage(`${product.name} added to cart!`);
    } catch (err) {
      console.error("Cart error:", err);
      if (err.response?.status === 401) {
        navigate("/auth/login");
      } else {
        setMessage("Failed to add to cart. Please try again.");
      }
    } finally {
      setCartLoading(false);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleViewAll = () => {
    if (!mainCategory) {
      navigate("/");
    } else {
      navigate(`/${mainCategory}`);
    }
  };

  if (!recommendedProducts.length) return null;

  const totalPages = Math.ceil(recommendedProducts.length / itemsPerPage);
  const start = currentPage * itemsPerPage;
  const visible = recommendedProducts.slice(start, start + itemsPerPage);

  const next = () => setCurrentPage((p) => (p + 1) % totalPages);
  const prev = () => setCurrentPage((p) => (p - 1 + totalPages) % totalPages);

  return (
    <div className="favrec-section">
      <h2 className="favrec-title">You may also like ...</h2>

      {message && <div className="favrec-message">{message}</div>}

      <div className="favrec-slider-wrapper">
        {totalPages > 1 && (
          <button className="favrec-arrow favrec-arrow-left" onClick={prev}>
            ❮
          </button>
        )}

        <div className="favrec-slider-track">
          {visible.map((p) => {
            const hasDiscount =
              p.discountPrice &&
              typeof p.discountPrice === "number" &&
              p.discountPrice < p.price;

            return (
              <div
                key={p.id}
                className="favrec-card"
                onClick={() => navigate(`/${p.category}/${p.id}`)}
              >
                <div className="favrec-image-wrapper">
                  <img src={p.imageUrl || "/placeholder.png"} alt={p.name} />
                </div>

                <div className="favrec-name">{p.name}</div>

                <div className="favrec-meta">
                  {p.year} / {p.volume || "0.75 L"} • {p.country || "ФРАНЦИЯ"}
                </div>

                <div className="favrec-price-row">
                  <div className="favrec-price">
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
                  <div className="favrec-buttons">
                    <button
                      className="favrec-heart-btn"
                      onClick={(e) => handleAddToFavorite(e, p)}
                    >
                      <Heart className="favrec-heart-icon" />
                    </button>

                    <button
                      className="favrec-to-cart"
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
          <button className="favrec-arrow favrec-arrow-right" onClick={next}>
            ❯
          </button>
        )}
      </div>

      <div className="favrec-view-all-wrapper">
        <button className="favrec-view-all-btn" onClick={handleViewAll}>
          VIEW ALL ...
        </button>
      </div>
    </div>
  );
}
