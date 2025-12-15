import { useEffect, useState } from "react";
import baseProducts from "../data/products";

export default function useProducts() {
  const [products, setProducts] = useState(baseProducts);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("admin_products");
      if (!stored) return;

      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setProducts(parsed);
      }
    } catch (err) {
      console.error("Failed to read admin_products from localStorage", err);
    }
  }, []);

  return products;
}
