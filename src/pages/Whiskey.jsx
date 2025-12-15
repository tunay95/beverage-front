import Slider from "../components/slider/slider";
import ProductList from "../components/products/List/productList";
import WineSommelier from "../wine-components/wine-sommelier/wine-sommelier";
import AboutSommelier from "../components/sommelier-section/aboutSommelier";

import { useOutletContext } from "react-router-dom";
import { getAdminProducts } from "../utils/adminStorage";
import baseProducts from "../data/products";

export default function Whiskey() {
  const { searchTerm } = useOutletContext();

  const adminProducts = getAdminProducts();
  const source =
    adminProducts && adminProducts.length > 0 ? adminProducts : baseProducts;

  const whiskeyProducts = source.filter(
    (p) => p.category === "whiskey" && !p.isDeleted
  );

  return (
    <>
      <Slider />
      <ProductList
        searchTerm={searchTerm}
        products={whiskeyProducts}
        title="Whiskey"
        showFields={{ color: false, sweetness: false, price: true }}
      />
      <WineSommelier />
      <AboutSommelier />
    </>
  );
}
