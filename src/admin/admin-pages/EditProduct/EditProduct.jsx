import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as productApi from "../../../data/productApi";
import * as subCategoryApi from "../../../data/subCategoryApi";
import "./EditProduct.css";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    price: "",
    liter: "",
    prodDate: "",
    location: "",
    subCategoryId: "",
    imageFile: null,
    existingImageUrl: "",
  });
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const [product, subs] = await Promise.all([
          productApi.getProductById(id),
          subCategoryApi.getAllActiveSubCategories(),
        ]);

        setSubCategories(subs || []);

        const parsedDate = product?.prodDate ? formatForInput(product.prodDate) : "";

        setForm((prev) => ({
          ...prev,
          title: product?.title || "",
          price: product?.price ?? "",
          liter: product?.liter ?? "",
          prodDate: parsedDate,
          location: product?.location || "",
          subCategoryId: product?.subCategoryId || "",
          existingImageUrl: product?.imageUrl || "",
        }));
      } catch (err) {
        console.error("Failed to load product", err);
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const formatForInput = (value) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

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
    if (!form.prodDate) return setError("Production date is required");

    const fd = new FormData();
    fd.append("Title", form.title.trim());
    fd.append("Price", form.price);
    fd.append("Liter", form.liter || 0);
    fd.append("ProdDate", new Date(form.prodDate).toISOString());
    fd.append("Location", form.location || "");
    fd.append("SubCategoryId", form.subCategoryId || "");
    if (form.imageFile) fd.append("Image", form.imageFile);

    try {
      setSaving(true);
      setError("");
      await productApi.updateProduct(id, fd);
      navigate("/admin/products");
    } catch (err) {
      console.error("Failed to update product", err);
      setError(err.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-product-page">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="edit-product-page">
      <div className="form-card">
        <h2>Edit Product</h2>
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
              Subcategory
              <select
                name="subCategoryId"
                value={form.subCategoryId}
                onChange={handleChange}
                className="select-input"
              >
                <option value="">Not set</option>
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
              {form.existingImageUrl && (
                <div className="thumb">
                  <img src={form.existingImageUrl} alt="product" />
                </div>
              )}
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="add-btn" disabled={saving}>
              {saving ? "Saving..." : "Update"}
            </button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/admin/products")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

