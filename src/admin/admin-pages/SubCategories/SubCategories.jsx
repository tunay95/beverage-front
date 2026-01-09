import React, { useEffect, useState } from "react";
import * as subCategoryApi from "../../../data/subCategoryApi";
import { getAllActiveCategories } from "../../../data/categoryApi";
import "./SubCategories.css";

export default function SubCategories() {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSubCategory, setCurrentSubCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", categoryId: "" });

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        setError("");
        const [fetchedSubs, fetchedCats] = await Promise.all([
          subCategoryApi.getAllSubCategories(),
          getAllActiveCategories(),
        ]);
        setSubCategories(fetchedSubs || []);
        setCategories(fetchedCats || []);
      } catch (err) {
        console.error("Failed to load subcategories:", err);
        setError(err.response?.data?.message || "Failed to load subcategories");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  const refreshSubCategories = async () => {
    try {
      setError("");
      const data = await subCategoryApi.getAllSubCategories();
      setSubCategories(data || []);
    } catch (err) {
      console.error("Failed to refresh subcategories:", err);
      setError(err.response?.data?.message || "Failed to refresh subcategories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Subcategory name is required");
      return;
    }
    if (!formData.categoryId) {
      setError("Please select a category");
      return;
    }

    const dto = {
      name: formData.name.trim(),
      categoryId: Number(formData.categoryId),
    };

    try {
      setError("");
      if (editMode && currentSubCategory) {
        await subCategoryApi.updateSubCategory(currentSubCategory.id, dto);
      } else {
        await subCategoryApi.createSubCategory(dto);
      }
      resetForm();
      refreshSubCategories();
    } catch (err) {
      console.error("Failed to save subcategory:", err);
      setError(err.response?.data?.message || "Failed to save subcategory");
    }
  };

  const handleEdit = (sub) => {
    setEditMode(true);
    setCurrentSubCategory(sub);
    setFormData({
      name: sub.name || "",
      categoryId: sub.categoryId?.toString() || "",
    });
    setShowForm(true);
  };

  const handleToggleActive = async (sub) => {
    try {
      setError("");
      if (sub.isActive) {
        await subCategoryApi.deactivateSubCategory(sub.id);
      } else {
        await subCategoryApi.activateSubCategory(sub.id);
      }
      refreshSubCategories();
    } catch (err) {
      console.error("Failed to toggle subcategory status:", err);
      setError(err.response?.data?.message || "Failed to toggle status");
    }
  };

  const handleSoftDelete = async (id) => {
    if (!window.confirm("Soft delete this subcategory?")) return;
    try {
      setError("");
      await subCategoryApi.softDeleteSubCategory(id);
      refreshSubCategories();
    } catch (err) {
      console.error("Failed to soft delete:", err);
      setError(err.response?.data?.message || "Failed to soft delete subcategory");
    }
  };

  const handleRecover = async (id) => {
    try {
      setError("");
      await subCategoryApi.recoverSubCategory(id);
      refreshSubCategories();
    } catch (err) {
      console.error("Failed to recover:", err);
      setError(err.response?.data?.message || "Failed to recover subcategory");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this subcategory?")) return;
    try {
      setError("");
      await subCategoryApi.deleteSubCategory(id);
      refreshSubCategories();
    } catch (err) {
      console.error("Failed to delete:", err);
      setError(err.response?.data?.message || "Failed to delete subcategory");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditMode(false);
    setCurrentSubCategory(null);
    setFormData({ name: "", categoryId: "" });
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "-";
  };

  if (loading) {
    return (
      <div className="cat-page">
        <p>Loading subcategories...</p>
      </div>
    );
  }

  return (
    <div className="cat-page">
      <div className="cat-header">
        <h2 className="cat-title">Manage Subcategories</h2>
        {!showForm && (
          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Add Subcategory
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="add-cat-box">
          <h3>{editMode ? "Edit Subcategory" : "Add New Subcategory"}</h3>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Subcategory name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="select-input"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

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
          <h3>All Subcategories ({subCategories.length})</h3>
        </div>

        {subCategories.length === 0 && <p className="no-data">No subcategories found.</p>}

        {subCategories.length > 0 && (
          <table className="category-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subCategories.map((sub) => (
                <tr
                  key={sub.id}
                  className={`${sub.isDeleted ? "deleted-row" : ""} ${!sub.isActive && !sub.isDeleted ? "inactive-row" : ""}`}
                >
                  <td>{sub.id}</td>
                  <td className="category-name">{sub.name}</td>
                  <td className="category-description">{getCategoryName(sub.categoryId)}</td>
                  <td>
                    {sub.isDeleted && <span className="badge badge-deleted">Deleted</span>}
                    {!sub.isActive && !sub.isDeleted && <span className="badge badge-inactive">Inactive</span>}
                    {sub.isActive && !sub.isDeleted && <span className="badge badge-active">Active</span>}
                  </td>
                  <td className="action-cell">
                    {!sub.isDeleted && (
                      <>
                        <button className="btn-edit" onClick={() => handleEdit(sub)} title="Edit">
                          Edit
                        </button>
                        <button
                          className={sub.isActive ? "btn-deactivate" : "btn-activate"}
                          onClick={() => handleToggleActive(sub)}
                          title={sub.isActive ? "Deactivate" : "Activate"}
                        >
                          {sub.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button className="btn-soft-delete" onClick={() => handleSoftDelete(sub.id)} title="Soft Delete">
                          Soft Delete
                        </button>
                      </>
                    )}

                    {sub.isDeleted && (
                      <>
                        <button className="btn-recover" onClick={() => handleRecover(sub.id)} title="Recover">
                          Recover
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(sub.id)} title="Delete Permanently">
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
