import React, { useEffect, useMemo, useState } from "react";
import * as productDetailsApi from "../../../data/productDetailsApi";
import * as productApi from "../../../data/productApi";
import "./ProductDetails.css";

export default function AdminProductDetails() {
  const [details, setDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDetail, setCurrentDetail] = useState(null);

  const [formData, setFormData] = useState({
    productId: "",
    title: "",
    description: ""
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");
        const [detailsRes, productsRes] = await Promise.all([
          productDetailsApi.getAllProductDetails(),
          productApi.getAllActiveProducts(),
        ]);

        setDetails(detailsRes || []);
        setProducts(productsRes || []);
      } catch (err) {
        console.error("Failed to load product details:", err);
        setError(err.response?.data?.message || "Failed to load product details");
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
    setFormData({ productId: "", title: "", description: "" });
    setEditMode(false);
    setCurrentDetail(null);
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productId || !formData.title.trim()) {
      setError("Product and title are required");
      return;
    }

    try {
      setError("");

      if (editMode && currentDetail) {
        await productDetailsApi.updateProductDetails(currentDetail.id, formData);
      } else {
        await productDetailsApi.createProductDetails(formData);
      }

      const refreshed = await productDetailsApi.getAllProductDetails();
      setDetails(refreshed || []);
      resetForm();
    } catch (err) {
      console.error("Failed to save product details:", err);
      setError(err.response?.data?.message || "Failed to save product details");
    }
  };

  const handleEdit = (detail) => {
    setEditMode(true);
    setCurrentDetail(detail);
    setFormData({
      productId: detail.productId || "",
      title: detail.title || "",
      description: detail.description || "",
    });
    setShowForm(true);
  };

  const handleSoftDelete = async (id) => {
    if (!window.confirm("Soft delete this record?")) return;
    try {
      setError("");
      await productDetailsApi.softDeleteProductDetails(id);
      const refreshed = await productDetailsApi.getAllProductDetails();
      setDetails(refreshed || []);
    } catch (err) {
      console.error("Failed to soft delete:", err);
      setError(err.response?.data?.message || "Failed to soft delete");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this record?")) return;
    try {
      setError("");
      await productDetailsApi.deleteProductDetails(id);
      const refreshed = await productDetailsApi.getAllProductDetails();
      setDetails(refreshed || []);
    } catch (err) {
      console.error("Failed to delete:", err);
      setError(err.response?.data?.message || "Failed to delete");
    }
  };

  const handleRecover = async (id) => {
    try {
      setError("");
      await productDetailsApi.recoverProductDetails(id);
      const refreshed = await productDetailsApi.getAllProductDetails();
      setDetails(refreshed || []);
    } catch (err) {
      console.error("Failed to recover:", err);
      setError(err.response?.data?.message || "Failed to recover");
    }
  };

  const handleToggleActive = async (detail) => {
    try {
      setError("");
      if (detail.isActive) {
        await productDetailsApi.deactivateProductDetails(detail.id);
      } else {
        await productDetailsApi.activateProductDetails(detail.id);
      }
      const refreshed = await productDetailsApi.getAllProductDetails();
      setDetails(refreshed || []);
    } catch (err) {
      console.error("Failed to toggle status:", err);
      setError(err.response?.data?.message || "Failed to toggle status");
    }
  };

  if (loading) {
    return <div className="cat-page"><p>Loading product details...</p></div>;
  }

  return (
    <div className="cat-page">
      <div className="cat-header">
        <div>
          <h2 className="cat-title">Product Details</h2>
          <p className="cat-note">Manage per-product content (title + description).</p>
        </div>
        {!showForm && (
          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Add Details
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="add-cat-box">
          <h3>{editMode ? "Edit Details" : "Add Details"}</h3>

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
              placeholder="Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
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
          <h3>All Product Details ({details.length})</h3>
        </div>

        {details.length === 0 && <p className="no-data">No product details found.</p>}

        {details.length > 0 && (
          <div className="table-wrapper">
            <table className="category-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {details.map((detail) => (
                  <tr
                    key={detail.id}
                    className={`${detail.isDeleted ? 'deleted-row' : ''} ${!detail.isActive && !detail.isDeleted ? 'inactive-row' : ''}`}
                  >
                    <td>{detail.id}</td>
                    <td className="category-name">
                      {detail.productTitle || productMap[detail.productId] || `#${detail.productId}`}
                    </td>
                    <td className="category-name">{detail.title}</td>
                    <td className="category-description">{detail.description || '-'}</td>
                    <td>
                      {detail.isDeleted && <span className="badge badge-deleted">Deleted</span>}
                      {!detail.isActive && !detail.isDeleted && <span className="badge badge-inactive">Inactive</span>}
                      {detail.isActive && !detail.isDeleted && <span className="badge badge-active">Active</span>}
                    </td>
                    <td className="action-cell">
                      {!detail.isDeleted && (
                        <>
                          <button className="btn-edit" onClick={() => handleEdit(detail)} title="Edit">
                            Edit
                          </button>
                          <button
                            className={detail.isActive ? "btn-deactivate" : "btn-activate"}
                            onClick={() => handleToggleActive(detail)}
                            title={detail.isActive ? "Deactivate" : "Activate"}
                          >
                            {detail.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button className="btn-soft-delete" onClick={() => handleSoftDelete(detail.id)} title="Soft Delete">
                            Soft Delete
                          </button>
                        </>
                      )}

                      {detail.isDeleted && (
                        <>
                          <button className="btn-recover" onClick={() => handleRecover(detail.id)} title="Recover">
                            Recover
                          </button>
                          <button className="btn-delete" onClick={() => handleDelete(detail.id)} title="Delete Permanently">
                            Delete Permanently
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}