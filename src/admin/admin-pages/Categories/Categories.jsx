import React, { useState, useEffect } from "react";
import "./Categories.css";

const DEFAULT_CATEGORIES = [
  { id: "wine", name: "Wine", filters: ["Price", "Color", "Sweetness"] },
  { id: "whiskey", name: "Whiskey", filters: ["Price"] },
  { id: "vodka", name: "Vodka", filters: ["Price"] },
  { id: "cognac", name: "Cognac", filters: ["Price"] }
];

const DEFAULT_FILTERS = ["Price"];

export default function Categories() {
  const [customCategories, setCustomCategories] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    let savedCat = JSON.parse(localStorage.getItem("admin_categories")) || [];

    savedCat = savedCat.map((cat) => ({
      ...cat,
      filters: Array.isArray(cat.filters)
        ? cat.filters
        : typeof cat.filters === "string"
          ? [cat.filters]
          : [...DEFAULT_FILTERS]
    }));

    setCustomCategories(savedCat);

    const savedFilters =
      JSON.parse(localStorage.getItem("admin_filters")) || [];

    setCustomFilters(savedFilters);
  }, []);

  const saveCategories = (updated) => {
    localStorage.setItem("admin_categories", JSON.stringify(updated));
    setCustomCategories(updated);
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCat = {
      id: Date.now(),
      name: newCategoryName,
      filters: ["Price", ...selectedFilters]
    };

    const updated = [...customCategories, newCat];
    saveCategories(updated);

    setNewCategoryName("");
    setSelectedFilters([]);
  };

  const deleteCategory = (id) => {
    const updated = customCategories.filter((c) => c.id !== id);
    saveCategories(updated);
  };

  const toggleFilterSelect = (filterName) => {
    if (selectedFilters.includes(filterName)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filterName));
    } else {
      setSelectedFilters([...selectedFilters, filterName]);
    }
  };

  return (
    <div className="cat-page">
      <h2 className="cat-title">Manage Categories</h2>

      <div className="add-cat-box">
        <h3>Add New Category</h3>

        <input
          type="text"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />

        <p>Select filters for this category:</p>

        <div className="filter-checkboxes">

          <label className="disabled-checkbox">
            <input type="checkbox" checked disabled />
            Price (required)
          </label>

          {customFilters.map((filter) => (
            <label key={filter.name}>
              <input
                type="checkbox"
                checked={selectedFilters.includes(filter.name)}
                onChange={() => toggleFilterSelect(filter.name)}
              />
              {filter.name}
            </label>
          ))}

        </div>

        <button className="add-btn" onClick={addCategory}>
          Add Category
        </button>
      </div>

      <div className="cat-list">
        <h3>Default Categories</h3>

        {DEFAULT_CATEGORIES.map((c) => (
          <div key={c.id} className="filter-item-default">
            <span>{c.name}</span>
            <span className="filters">{c.filters.join(" • ")}</span>
            <span className="lock">(cannot delete)</span>
          </div>
        ))}

        <h3>Custom Categories</h3>

        {customCategories.length === 0 && <p>No custom categories yet.</p>}

        {customCategories.map((cat) => (
          <div key={cat.id} className="filter-item-default">
            <span>{cat.name}</span>
            <span className="filters">{cat.filters.join(" • ")}</span>

            <button className="del-btn" onClick={() => deleteCategory(cat.id)}>
              Delete
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}