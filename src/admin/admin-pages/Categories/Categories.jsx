import React, { useState, useEffect } from "react";
import * as categoryApi from "../../../data/categoryApi";
import * as subCategoryApi from "../../../data/subCategoryApi";
import "./Categories.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [subcategoriesByCategory, setSubcategoriesByCategory] = useState({});
  
  const [formData, setFormData] = useState({
    name: ""
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await categoryApi.getAllCategories();
      setCategories(data);
      await loadSubCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const loadSubCategories = async (cats) => {
    if (!Array.isArray(cats) || cats.length === 0) {
      setSubcategoriesByCategory({});
      return;
    }

    try {
      const entries = await Promise.all(
        cats.map(async (cat) => {
          try {
            const subs = await subCategoryApi.getSubCategoriesByCategory(cat.id);
            return [cat.id, subs];
          } catch (err) {
            console.error(`Failed to load subcategories for category ${cat.id}:`, err);
            return [cat.id, []];
          }
        })
      );

      setSubcategoriesByCategory(Object.fromEntries(entries));
    } catch (err) {
      console.error("Failed to load subcategories:", err);
      setError((prev) => prev || "Failed to load subcategories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setError("");
      
      if (editMode && currentCategory) {
        await categoryApi.updateCategory(currentCategory.id, formData);
      } else {
        await categoryApi.createCategory(formData);
      }
      
      setShowForm(false);
      setEditMode(false);
      setCurrentCategory(null);
      setFormData({ name: "" });
      loadCategories();
    } catch (err) {
      console.error("Failed to save category:", err);
      setError(err.response?.data?.message || "Failed to save category");
    }
  };

  const handleEdit = (category) => {
    setEditMode(true);
    setCurrentCategory(category);
    setFormData({
      name: category.name || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this category?")) {
      return;
    }

    try {
      setError("");
      await categoryApi.deleteCategory(id);
      loadCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
      setError(err.response?.data?.message || "Failed to delete category");
    }
  };

  const handleSoftDelete = async (id) => {
    if (!window.confirm("Are you sure you want to soft delete this category?")) {
      return;
    }

    try {
      setError("");
      await categoryApi.softDeleteCategory(id);
      loadCategories();
    } catch (err) {
      console.error("Failed to soft delete category:", err);
      setError(err.response?.data?.message || "Failed to soft delete category");
    }
  };

  const handleRecover = async (id) => {
    try {
      setError("");
      await categoryApi.recoverCategory(id);
      loadCategories();
    } catch (err) {
      console.error("Failed to recover category:", err);
      setError(err.response?.data?.message || "Failed to recover category");
    }
  };

  const handleToggleActive = async (category) => {
    try {
      setError("");
      if (category.isActive) {
        await categoryApi.deactivateCategory(category.id);
      } else {
        await categoryApi.activateCategory(category.id);
      }
      loadCategories();
    } catch (err) {
      console.error("Failed to toggle category status:", err);
      setError(err.response?.data?.message || "Failed to toggle category status");
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditMode(false);
    setCurrentCategory(null);
    setFormData({ name: "" });
    setError("");
  };

  const getSubcategoryNames = (cat) => {
    const subs = subcategoriesByCategory[cat.id] || cat.subCategories || cat.subcategories;
    if (!Array.isArray(subs) || subs.length === 0) return "-";
    return subs.map((s) => s?.name || s?.title || s).join(", ");
  };

  if (loading) {
    return <div className="cat-page"><p>Loading categories...</p></div>;
  }

  return (
    <div className="cat-page">
      <div className="cat-header">
        <h2 className="cat-title">Manage Categories</h2>
        <p className="cat-note">Each category can have its own subcategories.</p>
        {!showForm && (
          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Add Category
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showForm && (
        <div className="add-cat-box">
          <h3>{editMode ? "Edit Category" : "Add New Category"}</h3>
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Category name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div className="form-actions">
              <button type="submit" className="add-btn">
                {editMode ? "Update" : "Create"}
              </button>
              <button type="button" className="cancel-btn" onClick={cancelForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="cat-list">
        <div className="table-header">
          <h3>All Categories ({categories.length})</h3>
        </div>

        {categories.length === 0 && <p className="no-data">No categories found.</p>}

        {categories.length > 0 && (
          <table className="category-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Subcategories</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className={`${cat.isDeleted ? 'deleted-row' : ''} ${!cat.isActive && !cat.isDeleted ? 'inactive-row' : ''}`}>
                  <td>{cat.id}</td>
                  <td className="category-name">{cat.name}</td>
                  <td className="category-description">{getSubcategoryNames(cat)}</td>
                  <td>
                    {cat.isDeleted && <span className="badge badge-deleted">Deleted</span>}
                    {!cat.isActive && !cat.isDeleted && <span className="badge badge-inactive">Inactive</span>}
                    {cat.isActive && !cat.isDeleted && <span className="badge badge-active">Active</span>}
                  </td>
                  <td className="action-cell">
                    {!cat.isDeleted && (
                      <>
                        <button className="btn-edit" onClick={() => handleEdit(cat)} title="Edit">
                          Edit
                        </button>
                        <button 
                          className={cat.isActive ? "btn-deactivate" : "btn-activate"}
                          onClick={() => handleToggleActive(cat)}
                          title={cat.isActive ? "Deactivate" : "Activate"}
                        >
                          {cat.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button className="btn-soft-delete" onClick={() => handleSoftDelete(cat.id)} title="Soft Delete">
                          Soft Delete
                        </button>
                      </>
                    )}
                    
                    {cat.isDeleted && (
                      <>
                        <button className="btn-recover" onClick={() => handleRecover(cat.id)} title="Recover">
                          Recover
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(cat.id)} title="Delete Permanently">
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