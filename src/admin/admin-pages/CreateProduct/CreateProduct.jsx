import React from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../admin-components/ProductForm";
import "./CreateProduct.css";

export default function CreateProduct() {
  const navigate = useNavigate();

  const handleSave = (productData) => {
    const stored = JSON.parse(localStorage.getItem("admin_products")) || [];

    const newProduct = {
      ...productData,
      id: Date.now(),

      // defaults (problem çıxmasın)
      isDeleted:
        typeof productData?.isDeleted === "boolean" ? productData.isDeleted : false,

      // number sahələr
      price: Number(productData?.price || 0),
      quantity: Number(productData?.quantity || 0),

      discountPercent:
        productData?.discountPercent === null || productData?.discountPercent === undefined
          ? null
          : Number(productData.discountPercent),

      discountPrice:
        productData?.discountPrice === null || productData?.discountPrice === undefined
          ? null
          : Number(productData.discountPrice),
    };

    const updated = [...stored, newProduct];
    localStorage.setItem("admin_products", JSON.stringify(updated));

    navigate("/admin/products");
  };

  return (
    <div className="create-product-page">
      <ProductForm
        initialProduct={null}
        onSave={handleSave}
        onCancel={() => navigate("/admin/products")}
      />
    </div>
  );
}
