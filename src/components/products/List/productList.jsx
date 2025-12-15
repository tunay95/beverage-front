import React, { useMemo, useState, useEffect } from "react";
import UniversalFilter from "../Filter/universalFilter";
import ProductCard from "../Card/productCard";
import ProductSort from "../Sort/productSort";
import Pagination from "../Pagination/pagination";
import "./productList.css";

export default function ProductList({
  searchTerm = "",
  products = [],
  title = "",
  showFields = { color: true, sweetness: true, price: true },
}) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("name");
  const [filters, setFilters] = useState({});
  const [pageSize, setPageSize] = useState(9);

  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth < 900 ? 8 : 9);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filters, sort, products]);

  const searchedProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return products;

    return products.filter((p) =>
      (p.name || "").toLowerCase().includes(term)
    );
  }, [searchTerm, products]);

  const filteredProducts = useMemo(() => {
    return searchedProducts.filter((p) => {
      const byColor = !filters.color || p.color === filters.color;
      const bySweetness = !filters.sweetness || p.sweetness === filters.sweetness;

      const priceValue =
        typeof p.discountPrice === "number" && p.discountPrice < p.price
          ? p.discountPrice
          : p.price;

      const byPrice =
        (!filters.minPrice || priceValue >= Number(filters.minPrice)) &&
        (!filters.maxPrice || priceValue <= Number(filters.maxPrice));

      return byColor && bySweetness && byPrice;
    });
  }, [searchedProducts, filters]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sort === "name") return (a.name || "").localeCompare(b.name || "");
      if (sort === "newest") return (b.year || 0) - (a.year || 0);
      return 0;
    });
  }, [filteredProducts, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));

  // page həddən çıxsa düzəlt
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedProducts = sortedProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const isEmpty = sortedProducts.length === 0; 

  return (
    <div className="products-section">
      <div className="filters-wrapper">
        <UniversalFilter
          title={title}
          onFilterChange={setFilters}
          showFields={showFields}
        />
      </div>

      <div className="products-content">
        <div className="sort-container">
          <ProductSort onSortChange={setSort} />
        </div>

        {isEmpty ? (
          <div className="no-products">No products found.</div>
        ) : (
          <>
            <div className="products-grid">
              {pagedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
