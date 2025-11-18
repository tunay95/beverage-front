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

  const searchedProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);

  const filteredProducts = useMemo(() => {
    return searchedProducts.filter((p) => {
      const byColor = !filters.color || p.color === filters.color;
      const bySweetness = !filters.sweetness || p.sweetness === filters.sweetness;
      const byPrice =
        (!filters.minPrice || p.price >= Number(filters.minPrice)) &&
        (!filters.maxPrice || p.price <= Number(filters.maxPrice));

      return byColor && bySweetness && byPrice;
    });
  }, [searchedProducts, filters]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "newest") return b.year - a.year;
      return 0;
    });
  }, [filteredProducts, sort]);

  const totalPages = Math.ceil(sortedProducts.length / pageSize);
  const pagedProducts = sortedProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

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
      </div>
    </div>
  );
}
