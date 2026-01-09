import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import "./productCard.css";
import { useAuth } from "../../../hooks/useAuth";
import * as wishlistApi from "../../../data/wishlistApi";
import * as orderApi from "../../../data/orderApi";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [message, setMessage] = useState("");
  const [isInWishlist, setIsInWishlist] = useState(product?.isInWishlist || false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && product?.id) {
      checkWishlistStatus();
    }
  }, [isAuthenticated, product?.id]);

  const checkWishlistStatus = async () => {
    try {
      const status = await wishlistApi.isInWishlist(product.id);
      setIsInWishlist(status);
    } catch (err) {
      console.error("Failed to check wishlist status:", err);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    if (cartLoading) return;

    try {
      setCartLoading(true);
      await orderApi.addToCart(product.id, 1);
      window.dispatchEvent(new Event("cartUpdated"));

      setMessage(`${product.name || product.title} added to cart!`);
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

  const handleAddToFavorite = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    if (wishlistLoading) return;

    try {
      setWishlistLoading(true);

      if (isInWishlist) {
        await wishlistApi.removeByProductId(product.id);
        setIsInWishlist(false);
        setMessage(`${product.name || product.title} removed from wishlist!`);
      } else {
        await wishlistApi.addToWishlist(product.id);
        setIsInWishlist(true);
        setMessage(`${product.name || product.title} added to wishlist!`);
      }

      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.error("Wishlist error:", err);
      if (err.response?.status === 401) {
        navigate("/auth/login");
      } else {
        setMessage("Failed to update wishlist. Please try again.");
      }
    } finally {
      setWishlistLoading(false);
      setTimeout(() => setMessage(""), 2000);
    }
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
                  {product.price.toLocaleString("ru-RU")} ₼
                </span>
                <span className="discount-price">
                  {product.discountPrice.toLocaleString("ru-RU")} ₼
                </span>
              </>
            ) : product.price ? (
              `${product.price.toLocaleString("ru-RU")} ₼`
            ) : (
              "—"
            )}
          </div>

          <div className="buttons">
            <button 
              className={`product-heart ${isInWishlist ? "in-wishlist" : ""}`}
              onClick={handleAddToFavorite}
              disabled={wishlistLoading}
            >
              <Heart 
                className="heart-icon" 
                fill={isInWishlist ? "currentColor" : "none"}
              />
            </button>

            <button className="to-cart" onClick={handleAddToCart} disabled={cartLoading}>
              {cartLoading ? "ADDING..." : "ADD TO CART"}
            </button>
          </div>
        </div>
      </Link>
    </>
  );
}
