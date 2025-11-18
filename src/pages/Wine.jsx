import { useState } from "react";
import Slider from "../components/slider/slider";
import ProductList from "../components/products/List/productList";
import WineSommelier from "../wine-components/wine-sommelier/wine-sommelier";
import AboutSommelier from "../components/sommelier-section/aboutSommelier";
import products from "../data/products";

export default function Wine() {
  const [searchTerm, setSearchTerm] = useState("");

  const wineProducts = products.filter((p) => p.category === "wine");

  return (
    <>
      <Slider />

      <ProductList
        searchTerm={searchTerm}
        products={wineProducts}
        title="Wine"
        showFields={{ color: true, sweetness: true, price: true }} // ⭐ ONLY PRICE
      />

      <WineSommelier />
      <AboutSommelier />
    </>
  );
}
