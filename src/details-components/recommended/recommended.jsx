import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./recommended.css";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import * as orderApi from "../../data/orderApi";
import * as productApi from "../../data/productApi";
import * as wishlistApi from "../../data/wishlistApi";
import { useAuth } from "../../hooks/useAuth";

export default function Recommended({ subCategoryId, currentProductId }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const sliderRef = useRef(null);

  const [message, setMessage] = useState("");
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false);

  // Handle responsive card count
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setCardsPerView(1);
      } else if (width < 1000) {
        setCardsPerView(2);
      } else if (width < 1400) {
        setCardsPerView(3);
      } else {
        setCardsPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update showArrows when cardsPerView or products change
  useEffect(() => {
    setShowArrows(cardsPerView < recommendedProducts.length);
  }, [cardsPerView, recommendedProducts.length]);

  // Fetch products from backend API filtered by subcategory
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await productApi.getAllActiveProducts();
        
        // Filter by same subcategory, exclude current product, max 4 products
        const filtered = allProducts
          .filter(p => 
            p.subCategoryId === subCategoryId && 
            p.id !== currentProductId
          )
          .slice(0, 4);
        
        setRecommendedProducts(filtered);
      } catch (err) {
        console.error("Failed to fetch recommended products:", err);
      } finally {
        setLoading(false);
      }
    };

    if (subCategoryId) {
      fetchRecommendedProducts();
    }
  }, [subCategoryId, currentProductId]);

  // Slider navigation functions
  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleNext = () => {
    const maxIndex = recommendedProducts.length - cardsPerView;
    if (activeIndex < maxIndex) {
      setActiveIndex(activeIndex + 1);
    }
  };

  // Reset activeIndex when cards per view changes
  useEffect(() => {
    setActiveIndex(0);
  }, [cardsPerView]);

  const handleAddToFavorite = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    try {
      await wishlistApi.addToWishlist(product.id);
      window.dispatchEvent(new Event("wishlistUpdated"));
      setMessage(`${product.title || product.name} added to wishlist!`);
    } catch (err) {
      console.error("Wishlist error:", err);
      setMessage("Failed to add to wishlist.");
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
    navigate("/");
  };

  if (loading) return null;
  if (!recommendedProducts.length) return null;

  return (
    <div className="recommended-section">
      <h2 className="recommended-title">You may also like ...</h2>

      {message && <div className="fav-message">{message}</div>}

      <div className="slider-container">
        {showArrows && (
          <button
            className="arrow arrow-left"
            onClick={handlePrevious}
            disabled={activeIndex === 0}
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="slider-wrapper">
          <div 
            className="slider-track" 
            ref={sliderRef}
            style={{
              transform: `translateX(calc(-${activeIndex * (100 / cardsPerView)}% - ${activeIndex * 35}px))`,
              transition: 'transform 0.5s ease'
            }}
          >
            {recommendedProducts.map((p) => {
            const hasDiscount =
              p.discountPrice &&
              typeof p.discountPrice === "number" &&
              p.discountPrice < p.price;

            return (
              <div
                key={p.id}
                className="recommended-card"
                onClick={() => navigate(`/wine/${p.id}`)}
              >
                <div className="image-wrapper">
                  <img src={p.imageUrl} alt={p.title || p.name} />
                </div>

                <div className="rec-name">{p.title || p.name}</div>

                <div className="rec-meta">
                  {p.prodDate ? new Date(p.prodDate).getFullYear() : ''} / {p.liter || "0.75"} L • {p.location || ""}
                </div>

                <div className="price-row">
                  <div className="rec-price">
                    {hasDiscount ? (
                      <>
                        <span className="old-price">
                          {p.price.toLocaleString("ru-RU")} ₼
                        </span>
                        <span className="discount-price">
                          {p.discountPrice.toLocaleString("ru-RU")} ₼
                        </span>
                      </>
                    ) : (
                      <span>{p.price ? p.price.toLocaleString("ru-RU") : "—"} ₼</span>
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
                      disabled={cartLoading}
                    >
                      {cartLoading ? "ADDING..." : "ADD TO CART"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {showArrows && (
          <button
            className="arrow arrow-right"
            onClick={handleNext}
            disabled={activeIndex >= recommendedProducts.length - cardsPerView}
            aria-label="Next"
          >
            <ChevronRight size={24} />
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
