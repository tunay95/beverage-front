import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as productApi from "../../../data/productApi";

import "./Products.css";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productApi.getAllProducts();
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (product) => {
    try {
      setError("");
      if (product.isActive) {
        await productApi.deactivateProduct(product.id);
      } else {
        await productApi.activateProduct(product.id);
      }
      loadProducts();
    } catch (err) {
      console.error("Failed to toggle status:", err);
      setError(err.response?.data?.message || "Failed to toggle status");
    }
  };

  const handleSoftDelete = async (id) => {
    if (!window.confirm("Soft delete this product?")) return;
    try {
      setError("");
      await productApi.softDeleteProduct(id);
      loadProducts();
    } catch (err) {
      console.error("Failed to soft delete product:", err);
      setError(err.response?.data?.message || "Failed to soft delete product");
    }
  };

  const handleRecover = async (id) => {
    try {
      setError("");
      await productApi.recoverProduct(id);
      loadProducts();
    } catch (err) {
      console.error("Failed to recover product:", err);
      setError(err.response?.data?.message || "Failed to recover product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this product?")) return;
    try {
      setError("");
      await productApi.deleteProduct(id);
      loadProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  const handleCreate = () => {
    navigate("/admin/create-product");
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
  };

  const getSubCategoryName = (p) => {
    return p.subCategoryName || p.subCategory?.name || "-";
  };

  if (loading) {
    return (
      <div className="admin-products-page">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="admin-products-page">
      <div className="admin-products-header">
        <h2>Products ({products.length})</h2>
        <button className="admin-products-add-btn" onClick={handleCreate}>
          + Add New Product
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {products.length === 0 ? (
        <p className="no-data">No products found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Price</th>
                <th>Subcategory</th>
                <th>Image</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className={`${p.isDeleted ? "soft-deleted-row" : ""} ${!p.isActive && !p.isDeleted ? "inactive-row" : ""}`}
                >
                  <td>{p.id}</td>
                  <td className="title-cell">{p.title}</td>
                  <td>{p.price}</td>
                  <td>{getSubCategoryName(p)}</td>
                  <td>
                    {p.imageUrl ? (
                      <div className="thumb inline-thumb">
                        <img src={p.imageUrl} alt={p.title} />
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {p.isDeleted && <span className="badge badge-deleted">Deleted</span>}
                    {!p.isActive && !p.isDeleted && <span className="badge badge-inactive">Inactive</span>}
                    {p.isActive && !p.isDeleted && <span className="badge badge-active">Active</span>}
                  </td>
                  <td className="admin-products-actions">
                    {!p.isDeleted && (
                      <>
                        <button className="edit-btn" onClick={() => handleEdit(p.id)} title="Edit">
                          Edit
                        </button>
                        <button
                          className={p.isActive ? "deactivate-btn" : "activate-btn"}
                          onClick={() => handleToggleActive(p)}
                          title={p.isActive ? "Deactivate" : "Activate"}
                        >
                          {p.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button className="soft-del-btn" onClick={() => handleSoftDelete(p.id)} title="Soft Delete">
                          Soft Delete
                        </button>
                      </>
                    )}

                    {p.isDeleted && (
                      <>
                        <button className="recover-btn" onClick={() => handleRecover(p.id)} title="Recover">
                          Recover
                        </button>
                        <button className="del-btn" onClick={() => handleDelete(p.id)} title="Delete Permanently">
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
  );
}
