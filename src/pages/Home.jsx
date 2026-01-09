import Slider from "../components/slider/slider";
import FeaturesSection from "../components/features-section/featuresSection";
import ProductList from "../components/products/List/productList";
import SommelierSection from "../components/sommelier-section/sommelierSection";
import AboutSommelier from "../components/sommelier-section/aboutSommelier";
import { useOutletContext } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import * as productApi from "../data/productApi";
import * as categoryApi from "../data/categoryApi";

export default function Home() {
  const { searchTerm } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const [productsRes, optionsRes, categoriesRes] = await Promise.all([
          productApi.getShopProducts({}),
          productApi.getFilterOptions(),
          categoryApi.getAllActiveCategories(),
        ]);

        // ProductShopResponseDTO has { products: [], totalCount, totalPages, currentPage, pageSize }
        const productsList = productsRes?.products || [];

        // map products to UI shape
        const mapped = productsList.map((p) => {
          return {
            ...p,
            id: p.id,
            name: p.title,
            title: p.title,
            category: p.categoryName?.toLowerCase() || "wine",
            categoryId: p.categoryId || p.subCategoryId,
            subCategoryId: p.subCategoryId,
            subCategoryName: p.subCategoryName,
            categoryName: p.categoryName,
            imageUrl: p.imageUrl,
            price: p.price,
            discountPrice: p.discountPrice,
            year: p.prodDate ? new Date(p.prodDate).getFullYear() : null,
            volume: p.liter ? `${p.liter} L` : null,
            liter: p.liter,
            country: p.location,
            location: p.location,
            prodDate: p.prodDate,
            isInWishlist: p.isInWishlist || false,
          };
        });

        setProducts(mapped);

        const mergedOptions = {
          ...optionsRes,
          categories: optionsRes?.categories || categoriesRes || [],
        };
        setFilterOptions(mergedOptions);
      } catch (err) {
        console.error("Failed to load home data:", err);
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <>
      <Slider />
      <FeaturesSection />

      {error && <div style={{ color: "#ff6b6b", padding: "16px" }}>{error}</div>}

      {loading ? (
        <div style={{ color: "#fff", padding: "24px" }}>Loading products...</div>
      ) : (
        <ProductList
          searchTerm={searchTerm}
          products={products}
          title=""
          filterOptions={filterOptions}
          showFields={{ color: false, sweetness: false, price: true, categories: true }}
        />
      )}

      <SommelierSection />
      <AboutSommelier />
    </>
  );
}
