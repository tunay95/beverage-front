import React, { useMemo } from "react";
import Slider from "../components/slider/slider";
import ProductList from "../components/products/List/productList";
import WineSommelier from "../wine-sommelier/wine-sommelier";
import AboutSommelier from "../components/sommelier-section/aboutSommelier";

import { getAdminProducts } from "../utils/adminStorage";
import baseProducts from "../data/products";

export default function Wine() {
  const products = useMemo(() => {
    const admin = getAdminProducts();
    const source = admin && admin.length > 0 ? admin : baseProducts;
    return source.filter(
      (p) => p.category === "wine" && !p.isDeleted
    );
  }, []);

  return (
    <>
      <Slider />
      <ProductList
        products={products}
        title="Wine"
        showFields={{ color: true, sweetness: true, price: true }}
      />
      <WineSommelier />
      <AboutSommelier />
    </>
  );
}
