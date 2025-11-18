import React, { useEffect, useState } from "react";
import "./favourite.css";

export default function Favorite() {
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  const removeFavorite = (id) => {
    const updated = favorites.filter((item) => item.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.id === product.id);

    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));

    removeFavorite(product.id);

    setMessage(`${product.name} added to cart!`);
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="fav-page">
      <h1 className="fav-title">Избранное</h1>

      {message && <div className="fav-message">{message}</div>}

      <div className="fav-list">
        {favorites.length === 0 ? (
          <p className="empty">Нет избранных товаров...</p>
        ) : (
          favorites.map((item) => (
            <div key={item.id} className="fav-item">
              <img src={item.imageUrl} alt={item.name} />

              <div className="fav-info">
                <h3>{item.name}</h3>
                <p>{item.country}</p>
                <div className="fav-price">
                  {item.price.toLocaleString("ru-RU")} Р
                </div>
              </div>

              <div className="fav-actions">
                <button className="fav-cart" onClick={() => addToCart(item)}>
                  ADD TO CART
                </button>
                <button
                  className="fav-remove"
                  onClick={() => removeFavorite(item.id)}
                >
                  ✖
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
