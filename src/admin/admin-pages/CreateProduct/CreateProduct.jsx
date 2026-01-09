import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as productApi from "../../../data/productApi";
import * as subCategoryApi from "../../../data/subCategoryApi";
import "./CreateProduct.css";

export default function CreateProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    price: "",
    liter: "",
    prodDate: "",
    location: "",
    subCategoryId: "",
    imageFile: null,
  });
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSubs = async () => {
      try {
        setError("");
        const data = await subCategoryApi.getAllActiveSubCategories();
        setSubCategories(data || []);
      } catch (err) {
        console.error("Failed to load subcategories", err);
        setError(err.response?.data?.message || "Failed to load subcategories");
      } finally {
        setLoading(false);
      }
    };
    loadSubs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, imageFile: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required");
    if (!form.price) return setError("Price is required");
    if (!form.subCategoryId) return setError("Please select a subcategory");
    if (!form.prodDate) return setError("Production date is required");

    const fd = new FormData();
    fd.append("Title", form.title.trim());
    fd.append("Price", form.price);
    fd.append("Liter", form.liter || 0);
    fd.append("ProdDate", new Date(form.prodDate).toISOString());
    fd.append("Location", form.location || "");
    fd.append("SubCategoryId", form.subCategoryId);
    if (form.imageFile) {
      fd.append("Image", form.imageFile);
    }

    try {
      setSaving(true);
      setError("");
      await productApi.createProduct(fd);
      navigate("/admin/products");
    } catch (err) {
      console.error("Failed to create product", err);
      setError(err.response?.data?.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="create-product-page">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="create-product-page">
      <div className="form-card">
        <h2>Create Product</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="product-form-simple">
          <div className="form-grid">
            <label>
              Title*
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Price*
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </label>

            <label>
              Liter
              <input
                type="number"
                name="liter"
                value={form.liter}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </label>

            <label>
              Production Date*
              <input
                type="datetime-local"
                name="prodDate"
                value={form.prodDate}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Location
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </label>

            <label>
              Subcategory*
              <select
                name="subCategoryId"
                value={form.subCategoryId}
                onChange={handleChange}
                required
                className="select-input"
              >
                <option value="">Select subcategory</option>
                {subCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Image
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="add-btn" disabled={saving}>
              {saving ? "Saving..." : "Create"}
            </button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/admin/products")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
