import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import products from "../../data/products";
import "./recomment-cart.css";

export default function CartRecommended() {
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const categories = [...new Set(cart.map((item) => item.category))];

  const mainCategory = categories[0] || "wine";

  const recommendedProducts = products
    .filter((p) => p.category === mainCategory)
    .slice(0, 12);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

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

  const totalPages = Math.ceil(recommendedProducts.length / itemsPerPage);
  const start = currentPage * itemsPerPage;
  const visible = recommendedProducts.slice(start, start + itemsPerPage);

  const next = () => setCurrentPage((p) => (p + 1) % totalPages);
  const prev = () => setCurrentPage((p) => (p - 1 + totalPages) % totalPages);

  return (
    <div className="recommended-section">
      <h2 className="recommended-title">You may also like</h2>

      <div className="slider-wrapper">
        <button className="arrow left" onClick={prev}>❮</button>

        <div className="slider-track">
          {visible.map((p) => (
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
                {p.year} / {p.volume} • {p.country}
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

        <button className="arrow right" onClick={next}>❯</button>
      </div>
    </div>
  );
}
