import React, { useEffect, useState } from "react";
import "./ProductForm.css";

/**
 * Reusable form for CREATE + EDIT product
 *
 * Props:
 * - initialProduct: product object or null
 * - onSave(product): called when form submitted
 * - onCancel(): optional, called when cancel button pressed
 */
export default function ProductForm({ initialProduct, onSave, onCancel }) {
  const [categoriesOptions, setCategoriesOptions] = useState([
    "wine",
    "whiskey",
    "vodka",
    "cognac",
  ]);

  const [form, setForm] = useState({
    id: null,
    name: "",
    category: "wine",
    price: "",
    quantity: "",
    discountPercent: "",
    color: "",
    sweetness: "",
    imageUrl: "",
    year: "",
    country: "",
    region: "",
    classification: "",
    volume: "",
    strength: "",
    sugar: "",
    importer: "",
    rating: "",
    composition: "",
    taste: "",
    aroma: "",
    gastronomy: "",
    vinification: "",
  });

  // kateqoriya options-ı admin_categories-dən oxuyaq (əgər varsa)
  useEffect(() => {
    try {
      const savedCats = JSON.parse(localStorage.getItem("admin_categories")) || [];

      const customNames = savedCats.map((c) => c.name.toLowerCase());
      setCategoriesOptions(() => {
        const base = ["wine", "whiskey", "vodka", "cognac"];
        const merged = [...base];

        customNames.forEach((n) => {
          if (!merged.includes(n)) merged.push(n);
        });

        return merged;
      });
    } catch {
      // ignore parse errors
    }
  }, []);

  // fill form when editing
  useEffect(() => {
    if (initialProduct) {
      setForm((prev) => ({
        ...prev,
        ...initialProduct,
        price: initialProduct.price ?? "",
        quantity:
          typeof initialProduct.quantity === "number"
            ? String(initialProduct.quantity)
            : initialProduct.quantity ?? "",
        discountPercent:
          typeof initialProduct.discountPercent === "number"
            ? String(initialProduct.discountPercent)
            : initialProduct.discountPercent ?? "",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = {
        ...prev,
        [name]:
          ["price", "year", "quantity", "discountPercent"].includes(name)
            ? value.replace(/[^\d]/g, "")
            : value,
      };

      // ✅ category wine deyilsə color və sweetness sıfırlansın + gizlənsin
      if (name === "category" && String(value).toLowerCase() !== "wine") {
        next.color = "";
        next.sweetness = "";
      }

      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Product name is required");
      return;
    }

    if (!form.price) {
      alert("Price is required");
      return;
    }

    const price = Number(form.price);
    const quantity = form.quantity ? Number(form.quantity) : 0;

    const discountPercent = form.discountPercent ? Number(form.discountPercent) : 0;

    const discountPrice =
      discountPercent > 0 ? Math.round(price * (1 - discountPercent / 100)) : null;

    // ✅ wine deyilsə color/sweetness boş getsin
    const isWine = String(form.category).toLowerCase() === "wine";

    const result = {
      ...form,
      price,
      quantity,
      discountPercent: discountPercent || null,
      discountPrice,
      year: form.year ? Number(form.year) : undefined,
      color: isWine ? form.color : "",
      sweetness: isWine ? form.sweetness : "",
    };

    onSave(result);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2 className="product-form-title">
        {form.id ? "Edit Product" : "Create Product"}
      </h2>

      <div className="product-form-grid">
        {/* LEFT COLUMN */}
        <div className="product-form-col">
          <label>
            Name*
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Category*
            <select name="category" value={form.category} onChange={handleChange}>
              {categoriesOptions.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </label>

          <label>
            Price* (RUB)
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              required
            />
          </label>

          <label>
            Quantity*
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              min="0"
              required
            />
          </label>

          <label>
            Discount %
            <input
              type="number"
              name="discountPercent"
              value={form.discountPercent}
              onChange={handleChange}
              min="0"
              max="100"
              placeholder="0"
            />
          </label>

          {/* ✅ ONLY FOR WINE */}
          {String(form.category).toLowerCase() === "wine" && (
            <>
              <label>
                Color
                <input
                  type="text"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                />
              </label>

              <label>
                Sweetness
                <input
                  type="text"
                  name="sweetness"
                  value={form.sweetness}
                  onChange={handleChange}
                />
              </label>
            </>
          )}

          <label>
            Image URL
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </label>

          {form.imageUrl && (
            <div className="product-form-image-preview">
              <img src={form.imageUrl} alt={form.name || "Product"} />
            </div>
          )}

          <label>
            Year
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              min="1900"
              max="2100"
            />
          </label>

          <label>
            Country
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="ФРАНЦИЯ / ..."
            />
          </label>

          <label>
            Region
            <input
              type="text"
              name="region"
              value={form.region}
              onChange={handleChange}
              placeholder="ДОЛИНА РОНЫ / ..."
            />
          </label>

          <label>
            Classification
            <input
              type="text"
              name="classification"
              value={form.classification}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* RIGHT COLUMN */}
        <div className="product-form-col">
          <label>
            Volume
            <input
              type="text"
              name="volume"
              value={form.volume}
              onChange={handleChange}
              placeholder="0,75 л"
            />
          </label>

          <label>
            Strength
            <input
              type="text"
              name="strength"
              value={form.strength}
              onChange={handleChange}
              placeholder="14.5%"
            />
          </label>

          <label>
            Sugar
            <input
              type="text"
              name="sugar"
              value={form.sugar}
              onChange={handleChange}
            />
          </label>

          <label>
            Importer
            <input
              type="text"
              name="importer"
              value={form.importer}
              onChange={handleChange}
            />
          </label>

          <label>
            Rating
            <input
              type="text"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              placeholder="RP 95"
            />
          </label>

          <label>
            Composition
            <textarea
              name="composition"
              value={form.composition}
              onChange={handleChange}
              rows={3}
            />
          </label>

          <label>
            Taste
            <textarea name="taste" value={form.taste} onChange={handleChange} rows={3} />
          </label>

          <label>
            Aroma
            <textarea name="aroma" value={form.aroma} onChange={handleChange} rows={3} />
          </label>

          <label>
            Gastronomy
            <textarea
              name="gastronomy"
              value={form.gastronomy}
              onChange={handleChange}
              rows={3}
            />
          </label>

          <label>
            Vinification
            <textarea
              name="vinification"
              value={form.vinification}
              onChange={handleChange}
              rows={4}
            />
          </label>
        </div>
      </div>

      <div className="product-form-actions">
        {onCancel && (
          <button
            type="button"
            className="product-form-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button type="submit" className="product-form-save">
          {form.id ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
  );
}
