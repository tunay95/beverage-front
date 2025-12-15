import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import "./productCard.css";

import {
  getUserCart,
  setUserCart,
  getUserFavorites,
  setUserFavorites,
} from "../../../utils/adminStorage";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("currentUser")
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const syncLogin = () => setIsLoggedIn(!!localStorage.getItem("currentUser"));
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

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!requireLogin()) return;

    let cart = getUserCart();
    const existing = cart.find((item) => item.id === product.id);

    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    setUserCart(cart);
    window.dispatchEvent(new Event("cartUpdated")); // ✅ NAVBAR üçün

    setMessage(`${product.name} added to cart!`);
    setTimeout(() => setMessage(""), 2000);
  };

  const handleAddToFavorite = (e) => {
    e.preventDefault();
    if (!requireLogin()) return;

    let favorites = getUserFavorites();

    if (!favorites.find((x) => x.id === product.id)) {
      favorites.push(product);
      setUserFavorites(favorites);
      setMessage(`${product.name} added to favorites!`);
    } else {
      setMessage(`${product.name} is already in favorites`);
    }

    setTimeout(() => setMessage(""), 2000);
  };

  const hasDiscount =
    product?.discountPrice &&
    typeof product.discountPrice === "number" &&
    product.discountPrice < product.price;

  return (
    <>
      {message && <div className="product-toast">{message}</div>}

      <Link to={`/${product.category}/${product.id}`} className="product-card">
        <div className="img">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : null}
        </div>

        <div className="title">{product.name}</div>

        <div className="meta">
          {product.year} / {product.volume || "0.75 L"} •{" "}
          {product.country || "ФРАНЦИЯ"}
        </div>

        <div className="price-row">
          <div className="price">
            {hasDiscount ? (
              <>
                <span className="old-price">
                  {product.price.toLocaleString("ru-RU")} Р
                </span>
                <span className="discount-price">
                  {product.discountPrice.toLocaleString("ru-RU")} Р
                </span>
              </>
            ) : product.price ? (
              `${product.price.toLocaleString("ru-RU")} Р`
            ) : (
              "—"
            )}
          </div>

          <div className="buttons">
            <button className="product-heart" onClick={handleAddToFavorite}>
              <Heart className="heart-icon" />
            </button>

            <button className="to-cart" onClick={handleAddToCart}>
              ADD TO CART
            </button>
          </div>
        </div>
      </Link>
    </>
  );
}
