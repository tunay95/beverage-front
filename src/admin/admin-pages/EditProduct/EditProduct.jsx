import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../admin-components/ProductForm";
import "./EditProduct.css";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("admin_products")) || [];
    const found = stored.find((p) => String(p.id) === String(id));
    if (found) {
      setProduct(found);
    } else {
      alert("Product not found");
      navigate("/admin/products");
    }
  }, [id, navigate]);

  const handleSave = (updatedProduct) => {
    const stored =
      JSON.parse(localStorage.getItem("admin_products")) || [];

    const newList = stored.map((p) =>
      String(p.id) === String(id) ? updatedProduct : p
    );

    localStorage.setItem("admin_products", JSON.stringify(newList));
    navigate("/admin/products");
  };

  if (!product) return null;

  return (
    <div className="edit-product-page">
      <ProductForm
        initialProduct={product}
        onSave={handleSave}
        onCancel={() => navigate("/admin/products")}
      />
    </div>
  );
}

