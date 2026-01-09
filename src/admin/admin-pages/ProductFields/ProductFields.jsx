import React, { useEffect, useMemo, useState } from "react";
import * as productFieldsApi from "../../../data/productFieldsApi";
import * as productApi from "../../../data/productApi";
import "./ProductFields.css";

export default function AdminProductFields() {
  const [fields, setFields] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentField, setCurrentField] = useState(null);

  const [formData, setFormData] = useState({
    productId: "",
    key: "",
    value: ""
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");
        const [fieldsRes, productsRes] = await Promise.all([
          productFieldsApi.getAllProductFields(),
          productApi.getAllActiveProducts(),
        ]);

        setFields(fieldsRes || []);
        setProducts(productsRes || []);
      } catch (err) {
        console.error("Failed to load product fields:", err);
        setError(err.response?.data?.message || "Failed to load product fields");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const productMap = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p.id] = p.title || p.name;
    });
    return map;
  }, [products]);

  const resetForm = () => {
    setFormData({ productId: "", key: "", value: "" });
    setEditMode(false);
    setCurrentField(null);
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productId || !formData.key.trim() || !formData.value.trim()) {
      setError("Product, key, and value are required");
      return;
    }

    try {
      setError("");

      if (editMode && currentField) {
        await productFieldsApi.updateProductField(currentField.id, formData);
      } else {
        await productFieldsApi.createProductField(formData);
      }

      const refreshed = await productFieldsApi.getAllProductFields();
      setFields(refreshed || []);
      resetForm();
    } catch (err) {
      console.error("Failed to save product field:", err);
      setError(err.response?.data?.message || "Failed to save product field");
    }
  };

  const handleEdit = (field) => {
    setEditMode(true);
    setCurrentField(field);
    setFormData({
      productId: field.productId || "",
      key: field.key || "",
      value: field.value || "",
    });
    setShowForm(true);
  };

  const handleSoftDelete = async (id) => {
    if (!window.confirm("Soft delete this record?")) return;
    try {
      setError("");
      await productFieldsApi.softDeleteProductField(id);
      const refreshed = await productFieldsApi.getAllProductFields();
      setFields(refreshed || []);
    } catch (err) {
      console.error("Failed to soft delete:", err);
      setError(err.response?.data?.message || "Failed to soft delete");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this record?")) return;
    try {
      setError("");
      await productFieldsApi.deleteProductField(id);
      const refreshed = await productFieldsApi.getAllProductFields();
      setFields(refreshed || []);
    } catch (err) {
      console.error("Failed to delete:", err);
      setError(err.response?.data?.message || "Failed to delete");
    }
  };

  const handleRecover = async (id) => {
    try {
      setError("");
      await productFieldsApi.recoverProductField(id);
      const refreshed = await productFieldsApi.getAllProductFields();
      setFields(refreshed || []);
    } catch (err) {
      console.error("Failed to recover:", err);
      setError(err.response?.data?.message || "Failed to recover");
    }
  };

  const handleToggleActive = async (field) => {
    try {
      setError("");
      if (field.isActive) {
        await productFieldsApi.deactivateProductField(field.id);
      } else {
        await productFieldsApi.activateProductField(field.id);
      }
      const refreshed = await productFieldsApi.getAllProductFields();
      setFields(refreshed || []);
    } catch (err) {
      console.error("Failed to toggle status:", err);
      setError(err.response?.data?.message || "Failed to toggle status");
    }
  };

  if (loading) {
    return <div className="cat-page"><p>Loading product fields...</p></div>;
  }

  return (
    <div className="cat-page">
      <div className="cat-header">
        <div>
          <h2 className="cat-title">Product Fields</h2>
          <p className="cat-note">Key/value attributes per product.</p>
        </div>
        {!showForm && (
          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Add Field
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="add-cat-box">
          <h3>{editMode ? "Edit Field" : "Add Field"}</h3>

          <form onSubmit={handleSubmit}>
            <select
              className="select-input"
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              required
            >
              <option value="">Select product *</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title || p.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Key *"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              required
            />

            <input
              type="text"
              placeholder="Value *"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              required
            />

            <div className="form-actions">
              <button type="submit" className="add-btn">
                {editMode ? "Update" : "Create"}
              </button>
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="cat-list">
        <div className="table-header">
          <h3>All Product Fields ({fields.length})</h3>
        </div>

        {fields.length === 0 && <p className="no-data">No product fields found.</p>}

        {fields.length > 0 && (
          <table className="category-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Key</th>
                <th>Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr
                  key={field.id}
                  className={`${field.isDeleted ? 'deleted-row' : ''} ${!field.isActive && !field.isDeleted ? 'inactive-row' : ''}`}
                >
                  <td>{field.id}</td>
                  <td className="category-name">
                    {field.productTitle || productMap[field.productId] || `#${field.productId}`}
                  </td>
                  <td className="category-name">{field.key}</td>
                  <td className="category-description">{field.value}</td>
                  <td>
                    {field.isDeleted && <span className="badge badge-deleted">Deleted</span>}
                    {!field.isActive && !field.isDeleted && <span className="badge badge-inactive">Inactive</span>}
                    {field.isActive && !field.isDeleted && <span className="badge badge-active">Active</span>}
                  </td>
                  <td className="action-cell">
                    {!field.isDeleted && (
                      <>
                        <button className="btn-edit" onClick={() => handleEdit(field)} title="Edit">
                          Edit
                        </button>
                        <button
                          className={field.isActive ? "btn-deactivate" : "btn-activate"}
                          onClick={() => handleToggleActive(field)}
                          title={field.isActive ? "Deactivate" : "Activate"}
                        >
                          {field.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button className="btn-soft-delete" onClick={() => handleSoftDelete(field.id)} title="Soft Delete">
                          Soft Delete
                        </button>
                      </>
                    )}

                    {field.isDeleted && (
                      <>
                        <button className="btn-recover" onClick={() => handleRecover(field.id)} title="Recover">
                          Recover
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(field.id)} title="Delete Permanently">
                          Delete Permanently
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}