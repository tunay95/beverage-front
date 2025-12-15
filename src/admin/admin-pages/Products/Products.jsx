import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import baseProducts from "../../../data/products";
import { getAdminProducts, setAdminProducts } from "../../../utils/adminStorage";

import "./Products.css";

function normalizeProduct(p, index) {
  return {
    ...p,
    id: p.id ?? index + 1,
    quantity:
      typeof p.quantity === "number"
        ? p.quantity
        : p.quantity
        ? Number(p.quantity)
        : 0,
    isDeleted: !!p.isDeleted,
    discountPercent: p.discountPercent ?? null,
    discountPrice: p.discountPrice ?? null,
  };
}

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // pagination
  const [page, setPage] = useState(1);
  const perPage = 10;

  // İlk açılışda: əgər localStorage-də məhsul yoxdursa, data/products-dan kopyalayırıq
  useEffect(() => {
    const saved = getAdminProducts();

    if (saved && saved.length > 0) {
      const normalized = saved.map((p, idx) => normalizeProduct(p, idx));
      setProducts(normalized);
      setAdminProducts(normalized);
    } else {
      const normalized = baseProducts.map((p, idx) => normalizeProduct(p, idx));
      setProducts(normalized);
      setAdminProducts(normalized);
    }
  }, []);

  const saveProducts = (updated) => {
    setProducts(updated);
    setAdminProducts(updated);
  };

  // məhsul sayı dəyişəndə, səhifə limitdən böyükdürsə geri çək
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(products.length / perPage));
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [products, page]);

  const handleDelete = (id) => {
    if (!window.confirm("Bu məhsulu silmək istəyirsiniz?")) return;
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
  };

  const handleSoftToggle = (id) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, isDeleted: !p.isDeleted } : p
    );
    saveProducts(updated);
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  const handleCreate = () => {
    navigate("/admin/create-product");
  };

  // pagination üçün hesablamalar
  const totalPages = Math.max(1, Math.ceil(products.length / perPage));
  const startIndex = (page - 1) * perPage;
  const visibleProducts = products.slice(startIndex, startIndex + perPage);

  return (
    <div className="admin-products-page">
      <div className="admin-products-header">
        <h2>Products ({products.length})</h2>
        <button className="admin-products-add-btn" onClick={handleCreate}>
          + Add New Product
        </button>
      </div>

      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <>
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Discount %</th>
                <th>Qty</th>
                <th>Year</th>
                <th>Country</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((p) => (
                <tr
                  key={p.id}
                  className={p.isDeleted ? "soft-deleted-row" : ""}
                >
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>

                  {/* PRICE + ENDİRİM GÖSTƏRİLİR */}
                  <td>
                    {p.discountPrice ? (
                      <>
                        <span className="admin-old-price">
                          {p.price?.toLocaleString("ru-RU")} ₽
                        </span>
                        <span className="admin-new-price">
                          {p.discountPrice?.toLocaleString("ru-RU")} ₽
                        </span>
                      </>
                    ) : (
                      <span>
                        {p.price?.toLocaleString("ru-RU")} ₽
                      </span>
                    )}
                  </td>

                  <td>{p.discountPercent ?? 0}</td>
                  <td>{p.quantity ?? 0}</td>
                  <td>{p.year}</td>
                  <td>{p.country}</td>
                  <td>{p.isDeleted ? "Soft deleted" : "Active"}</td>

                  <td className="admin-products-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(p.id)}
                    >
                      Edit
                    </button>

                    <button
                      className={p.isDeleted ? "revoc-btn" : "soft-del-btn"}
                      onClick={() => handleSoftToggle(p.id)}
                    >
                      {p.isDeleted ? "Revoc" : "Soft delete"}
                    </button>

                    <button
                      className="del-btn"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="admin-products-pagination">
              <button
                type="button"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    type="button"
                    className={p === page ? "active" : ""}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
