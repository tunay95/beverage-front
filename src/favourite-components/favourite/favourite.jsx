import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getUserFavorites,
  setUserFavorites,
  getUserCart,
  setUserCart,
} from "../../utils/adminStorage";

import "./favourite.css";

export default function Favourite() {
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setFavorites(getUserFavorites());
  }, []);

  const removeFavorite = (id) => {
    const updated = favorites.filter((item) => item.id !== id);
    setFavorites(updated);
    setUserFavorites(updated);

    setMessage("Product removed from favourites");
    setTimeout(() => setMessage(""), 2000);
  };

  const addToCart = (item) => {
    let cart = getUserCart();

    const existing = cart.find((x) => x.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    setUserCart(cart);
    window.dispatchEvent(new Event("cartUpdated"));

    // FAVOURITE-DƏN AVTOMATİK SİLMƏ
    const updated = favorites.filter((f) => f.id !== item.id);
    setFavorites(updated);
    setUserFavorites(updated);

    // MESAJ
    setMessage(`${item.name} added to cart`);
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="favourite-page">
      <h2 className="favourite-title">Favourite</h2>

      {/* 🔴 MESAJ BURADA OLMALIDIR – səhifənin yuxarısında */}
      {message && <div className="favourite-message">{message}</div>}

      {favorites.length === 0 ? (
        <p className="favourite-empty">Favourite list is empty...</p>
      ) : (
        <div className="favourite-list">
          {favorites.map((item) => {
            const hasDiscount =
              item.discountPrice &&
              typeof item.discountPrice === "number" &&
              item.discountPrice < item.price;

            return (
              <div key={item.id} className="favourite-item">
                <div className="favourite-left">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    onClick={() => navigate(`/${item.category}/${item.id}`)}
                    style={{ cursor: "pointer" }}
                  />

                  <div className="favourite-info">
                    <div>
                      <div className="fav-name">{item.name}</div>
                      <div className="fav-country">
                        {item.year} / {item.volume || "0.75 L"} •{" "}
                        {item.country || "FRANCE"}
                      </div>
                    </div>

                    <div></div>

                    <div className="fav-price">
                      {hasDiscount ? (
                        <>
                          <span className="old-price">
                            {item.price.toLocaleString("ru-RU")} Р
                          </span>
                          <span className="discount-price">
                            {item.discountPrice.toLocaleString("ru-RU")} Р
                          </span>
                        </>
                      ) : (
                        <span>{item.price.toLocaleString("ru-RU")} Р</span>
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
