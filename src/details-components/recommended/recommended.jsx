import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import products from "../../data/products";
import "./recommended.css";

export default function Recommended() {
  const { category } = useParams();
  const navigate = useNavigate();

  const normalizedCategory = category === "home" ? "wine" : category;

  const recommendedProducts = products.filter(
    (p) => p.category === normalizedCategory
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3); 

useEffect(() => {
  const updateItemsPerPage = () => {
    if (window.innerWidth <= 550) {
      setItemsPerPage(1);   
    } else if (window.innerWidth <= 1250) {
      setItemsPerPage(2);   
    } else if (window.innerWidth >= 1600) {
      setItemsPerPage(4);   
    } else {
      setItemsPerPage(3);   
    }
  };

  updateItemsPerPage(); 
  window.addEventListener("resize", updateItemsPerPage);

  return () => window.removeEventListener("resize", updateItemsPerPage);
}, []);


  const totalPages = Math.ceil(recommendedProducts.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleProducts = recommendedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const nextSlide = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevSlide = () =>
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  const handleViewAll = () => {
    if (category === "wine" || category === "home") navigate("/wine");
    else navigate(`/${category}`);
  };

  return (
    <div className="recommended-section">
      <h2 className="recommended-title">You will also like...</h2>

      <div className="slider-wrapper">
        <button className="arrow left" onClick={prevSlide}>❮</button>

        <div className="slider-track">
          {visibleProducts.map((p) => (
            <div
              key={p.id}
              className="recommended-card"
              onClick={() => navigate(`/${normalizedCategory}/${p.id}`)}
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
                  {p.price.toLocaleString("ru-RU")} Р
                </div>
                <button className="rec-btn">ADD TO CART</button>
              </div>
            </div>
          ))}
        </div>

        <button className="arrow right" onClick={nextSlide}>❯</button>
      </div>

      <div className="pagination-dots">
        {Array.from({ length: totalPages }).map((_, i) => (
          <span
            key={i}
            className={`dot ${i === currentPage ? "active" : ""}`}
            onClick={() => setCurrentPage(i)}
          ></span>
        ))}
      </div>

      <button className="view-all-btn" onClick={handleViewAll}>
        VIEW ALL ...
      </button>
    </div>
  );
}
