import React, { useEffect, useState } from "react";
import * as slidesApi from "../../../data/slidesApi";
import "./Slides.css";

export default function AdminSlides() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await slidesApi.getAllSlides();
      setSlides(data || []);
    } catch (err) {
      console.error("Failed to load slides:", err);
      setError(err.response?.data?.message || "Failed to load slides");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditMode(false);
    setCurrentSlide(null);
    setFile(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file && !editMode) {
      setError("Image file is required");
      return;
    }

    try {
      setError("");
      const formData = new FormData();
      if (file) formData.append("image", file);

      if (editMode && currentSlide) {
        await slidesApi.updateSlide(currentSlide.id, formData);
      } else {
        await slidesApi.createSlide(formData);
      }

      await loadSlides();
      resetForm();
    } catch (err) {
      console.error("Failed to save slide:", err);
      setError(err.response?.data?.message || "Failed to save slide");
    }
  };

  const handleEdit = (slide) => {
    setEditMode(true);
    setCurrentSlide(slide);
    setShowForm(true);
    setFile(null);
  };

  const handleSoftDelete = async (id) => {
    if (!window.confirm("Soft delete this slide?")) return;
    try {
      setError("");
      await slidesApi.softDeleteSlide(id);
      await loadSlides();
    } catch (err) {
      console.error("Failed to soft delete slide:", err);
      setError(err.response?.data?.message || "Failed to soft delete slide");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this slide?")) return;
    try {
      setError("");
      await slidesApi.deleteSlide(id);
      await loadSlides();
    } catch (err) {
      console.error("Failed to delete slide:", err);
      setError(err.response?.data?.message || "Failed to delete slide");
    }
  };

  const handleRecover = async (id) => {
    try {
      setError("");
      await slidesApi.recoverSlide(id);
      await loadSlides();
    } catch (err) {
      console.error("Failed to recover slide:", err);
      setError(err.response?.data?.message || "Failed to recover slide");
    }
  };

  const handleToggleActive = async (slide) => {
    try {
      setError("");
      if (slide.isActive) {
        await slidesApi.deactivateSlide(slide.id);
      } else {
        await slidesApi.activateSlide(slide.id);
      }
      await loadSlides();
    } catch (err) {
      console.error("Failed to toggle slide status:", err);
      setError(err.response?.data?.message || "Failed to toggle slide status");
    }
  };

  const renderThumb = (url) => {
    if (!url) return "-";
    return <img className="slide-thumb" src={url} alt="Slide" />;
  };

  if (loading) {
    return <div className="cat-page"><p>Loading slides...</p></div>;
  }

  return (
    <div className="cat-page">
      <div className="cat-header">
        <div>
          <h2 className="cat-title">Slides</h2>
          <p className="cat-note">Manage homepage slider images.</p>
        </div>
        {!showForm && (
          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Add Slide
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="add-cat-box">
          <h3>{editMode ? "Edit Slide" : "Add Slide"}</h3>

          <form onSubmit={handleSubmit}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {editMode && currentSlide && currentSlide.imageUrl && (
              <div className="current-thumb">
                <span>Current:</span> {renderThumb(currentSlide.imageUrl)}
              </div>
            )}

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
          <h3>All Slides ({slides.length})</h3>
        </div>

        {slides.length === 0 && <p className="no-data">No slides found.</p>}

        {slides.length > 0 && (
          <table className="category-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slides.map((slide) => (
                <tr
                  key={slide.id}
                  className={`${slide.isDeleted ? 'deleted-row' : ''} ${!slide.isActive && !slide.isDeleted ? 'inactive-row' : ''}`}
                >
                  <td>{slide.id}</td>
                  <td>{renderThumb(slide.imageUrl)}</td>
                  <td>
                    {slide.isDeleted && <span className="badge badge-deleted">Deleted</span>}
                    {!slide.isActive && !slide.isDeleted && <span className="badge badge-inactive">Inactive</span>}
                    {slide.isActive && !slide.isDeleted && <span className="badge badge-active">Active</span>}
                  </td>
                  <td className="action-cell">
                    {!slide.isDeleted && (
                      <>
                        <button className="btn-edit" onClick={() => handleEdit(slide)} title="Edit">
                          Edit
                        </button>
                        <button
                          className={slide.isActive ? "btn-deactivate" : "btn-activate"}
                          onClick={() => handleToggleActive(slide)}
                          title={slide.isActive ? "Deactivate" : "Activate"}
                        >
                          {slide.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button className="btn-soft-delete" onClick={() => handleSoftDelete(slide.id)} title="Soft Delete">
                          Soft Delete
                        </button>
                      </>
                    )}

                    {slide.isDeleted && (
                      <>
                        <button className="btn-recover" onClick={() => handleRecover(slide.id)} title="Recover">
                          Recover
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(slide.id)} title="Delete Permanently">
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