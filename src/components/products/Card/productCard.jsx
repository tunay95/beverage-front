import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import "./productCard.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("currentUser")
  );

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

  const handleAddToCart = (e) => {
    e.preventDefault();

    if (!requireLogin()) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.id === product.id);

    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  const handleAddToFavorite = (e) => {
    e.preventDefault();

    if (!requireLogin()) return;

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.find((x) => x.id === product.id)) {
      favorites.push(product);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    alert(`${product.name} added to favorites!`);
  };

  return (
    <Link to={`/${product.category}/${product.id}`} className="product-card">
      <div className="img">
        <img src={product.imageUrl} alt={product.name} />
      </div>

      <div className="title">{product.name}</div>

      <div className="meta">
        {product.year} / {product.volume || "0.75 L"} •{" "}
        {product.country || "ФРАНЦИЯ"}
      </div>

      <div className="price-row">

        <div className="price">
          {product.price
            ? product.price.toLocaleString("ru-RU") + " Р"
            : "—"}
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
  );
}
