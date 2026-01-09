import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import * as wishlistApi from "../../data/wishlistApi";

import {
  getUserCart,
  setUserCart,
} from "../../utils/adminStorage";

import "./favourite.css";

export default function Favourite() {
  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }
    loadWishlist();
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistApi.getMyWishlist();
      console.log("Wishlist data:", data); // Debug
      setWishlist(data || []);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
      if (err.response?.status === 401) {
        navigate("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (wishlistId) => {
    try {
      await wishlistApi.removeFromWishlist(wishlistId);
      setWishlist((prev) => prev.filter((item) => item.id !== wishlistId));
      window.dispatchEvent(new Event("wishlistUpdated"));

      setMessage("Product removed from wishlist");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
      setMessage("Failed to remove. Please try again.");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const addToCart = async (item) => {
    let cart = getUserCart();

    const existing = cart.find((x) => x.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ 
        id: item.id,
        name: item.title,
        title: item.title,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: 1 
      });
    }

    setUserCart(cart);
    window.dispatchEvent(new Event("cartUpdated"));

    // Remove from wishlist after adding to cart
    try {
      await wishlistApi.removeFromWishlist(item.id);
      setWishlist((prev) => prev.filter((f) => f.id !== item.id));
      window.dispatchEvent(new Event("wishlistUpdated"));

      setMessage(`${item.title} added to cart`);
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  if (loading) {
    return (
      <div className="favourite-page">
        <h2 className="favourite-title">Wishlist</h2>
        <p className="favourite-empty">Loading...</p>
      </div>
    );
  }

  return (
    <div className="favourite-page">
      <h2 className="favourite-title">Wishlist</h2>

      {message && <div className="favourite-message">{message}</div>}

      {wishlist.length === 0 ? (
        <p className="favourite-empty">Wishlist is empty...</p>
      ) : (
        <div className="favourite-list">
          {wishlist.map((item) => {
            const price = item.price || 0;
            const discountPrice = item.discountPrice;
            const hasDiscount =
              discountPrice &&
              typeof discountPrice === "number" &&
              discountPrice > 0 &&
              discountPrice < price;

            const year = item.prodDate ? new Date(item.prodDate).getFullYear() : "";
            const addedDate = item.addedToWishlistOn 
              ? new Date(item.addedToWishlistOn).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })
              : "";

            return (
              <div key={item.id} className="favourite-item">
                <div className="favourite-left">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    onClick={() => navigate(`/wine/${item.id}`)}
                    style={{ cursor: "pointer" }}
                  />

                  <div className="favourite-info">
                    <div className="fav-details">
                      <div className="fav-name">{item.title}</div>
                      <div className="fav-meta">
                        {year && <span>{year}</span>}
                        {item.liter && <span>{item.liter} L</span>}
                        {item.location && <span>{item.location}</span>}
                      </div>
                      {item.subCategoryName && (
                        <div className="fav-category">{item.subCategoryName}</div>
                      )}
                      {addedDate && (
                        <div className="fav-added">Added: {addedDate}</div>
                      )}
                    </div>

                    <div className="fav-price">
                      {hasDiscount ? (
                        <>
                          <span className="old-price">
                            {price.toLocaleString("ru-RU")} ₼
                          </span>
                          <span className="discount-price">
                            {discountPrice.toLocaleString("ru-RU")} ₼
                          </span>
                        </>
                      ) : (
                        <span>{price.toLocaleString("ru-RU")} ₼</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="favourite-actions">
                  <button
                    className="favourite-cart"
                    onClick={() => addToCart(item)}
                  >
                    ADD TO CART
                  </button>

                  <button
                    className="favourite-remove"
                    onClick={() => removeFavorite(item.id)}
                  >
                    ✖
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
