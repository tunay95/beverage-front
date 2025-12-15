import React, { useState, useEffect } from "react";
import "./CreateFilter.css";

const DEFAULT_FILTERS = ["Price"];

export default function CreateFilter() {
  const [customFilters, setCustomFilters] = useState([]);
  const [newFilter, setNewFilter] = useState("");
  const [optionInputs, setOptionInputs] = useState({});
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("admin_filters")) || [];

    const migrated = saved.map((item) =>
      typeof item === "string"
        ? { name: item, options: [] }
        : item
    );

    localStorage.setItem("admin_filters", JSON.stringify(migrated));
    setCustomFilters(migrated);
  }, []);
  const saveFilters = (updated) => {
    localStorage.setItem("admin_filters", JSON.stringify(updated));
    setCustomFilters(updated);
  };

  const addFilter = () => {
    if (!newFilter.trim()) return;

    if (
      DEFAULT_FILTERS.includes(newFilter) ||
      customFilters.some((f) => f.name === newFilter)
    ) {
      alert("Bu filter artıq mövcuddur!");
      return;
    }

    const updated = [...customFilters, { name: newFilter, options: [] }];
    saveFilters(updated);
    setNewFilter("");
  };

  const deleteFilter = (name) => {
    const updated = customFilters.filter((f) => f.name !== name);
    saveFilters(updated);
  };

  const addOption = (filterName) => {
    const value = optionInputs[filterName]?.trim();
    if (!value) return;

    const updated = customFilters.map((f) =>
      f.name === filterName
        ? { ...f, options: [...f.options, value] }
        : f
    );

    saveFilters(updated);

    setOptionInputs({ ...optionInputs, [filterName]: "" });
  };

  const deleteOption = (filterName, option) => {
    const updated = customFilters.map((f) =>
      f.name === filterName
        ? { ...f, options: f.options.filter((o) => o !== option) }
        : f
    );
    saveFilters(updated);
  };

  return (
    <div className="filter-page">

      <h2 className="filter-title">Manage Filters</h2>

      <div className="add-filter-box">
        <h3>Add New Filter</h3>

        <input
          type="text"
          placeholder="Filter name"
          value={newFilter}
          onChange={(e) => setNewFilter(e.target.value)}
        />

        <button className="add-filter-btn" onClick={addFilter}>
          Add Filter
        </button>
      </div>

      <div className="filter-list">
        <h3>Default Filters</h3>
        {DEFAULT_FILTERS.map((f) => (
          <div key={f} className="filter-item-default">
            <span>{f}</span>
            <span className="lock">(cannot delete)</span>
          </div>
        ))}

        <h3>Custom Filters</h3>

        {customFilters.length === 0 && <p>No custom filters yet.</p>}

        {customFilters.map((f) => (
          <div key={f.name} className="filter-item">

            <div>
              <strong>{f.name}</strong>

              <div className="option-list">
                {f.options.map((opt) => (
                  <div className="option-item" key={opt}>
                    {opt}
                    <button
                      className="del-btn small"
                      onClick={() => deleteOption(f.name, opt)}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              <div className="option-add-row">
                <input
                  type="text"
                  placeholder="Add option"
                  value={optionInputs[f.name] || ""}
                  onChange={(e) =>
                    setOptionInputs({ ...optionInputs, [f.name]: e.target.value })
                  }
                />
                <button className="add-option" onClick={() => addOption(f.name)}>Add</button>
              </div>
            </div>

            <button className="del-btn" onClick={() => deleteFilter(f.name)}>
              Delete
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}