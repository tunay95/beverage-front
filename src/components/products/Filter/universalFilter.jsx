import React, { useState, useEffect } from "react";
import "./universalFilter.css";

export default function UniversalFilter({ title, onFilterChange, showFields = {} }) {
  const {
    color = true,
    sweetness = true,
    price = true,
  } = showFields;

  const [filters, setFilters] = useState({
    color: "",
    sweetness: "",
    minPrice: "",
    maxPrice: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRadioToggle = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category] === value ? "" : value,
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  return (
    <div className="universal-filters-container">

      {title && <p className="universal-title">{title}</p>}

      {isMobile && (
        <button
          className="universal-filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters ✖" : "Show Filters ☰"}
        </button>
      )}

      <div className={`universal-filters ${!isMobile || showFilters ? "show" : ""}`}>

        {color && (
          <div className="universal-filter-block">
            <h3>Color</h3>
            <ul>
              {["White", "Red", "Pink", "Other"].map((colorOption) => (
                <li key={colorOption}>
                  <label>
                    <input
                      type="radio"
                      name="color"
                      checked={filters.color === colorOption}
                      onClick={() => handleRadioToggle("color", colorOption)}
                      readOnly
                    />
                    {colorOption}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {sweetness && (
          <div className="universal-filter-block">
            <h3>Sweetness</h3>
            <ul>
              {["Dry", "Sweet", "Dessert", "Fortified"].map((sweet) => (
                <li key={sweet}>
                  <label>
                    <input
                      type="radio"
                      name="sweetness"
                      checked={filters.sweetness === sweet}
                      onClick={() => handleRadioToggle("sweetness", sweet)}
                      readOnly
                    />
                    {sweet}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {price && (
          <div className="universal-filter-block">
            <h3>Price</h3>
            <div className="universal-price-filter">
              <input
                type="number"
                name="minPrice"
                placeholder="min"
                value={filters.minPrice}
                onChange={handlePriceChange}
                min="0"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="max"
                value={filters.maxPrice}
                onChange={handlePriceChange}
                min="0"
              />
              <button className="universal-price-ok">OK</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
