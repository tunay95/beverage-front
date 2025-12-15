import Slider from "../components/slider/slider";
import FeaturesSection from "../components/features-section/featuresSection";
import ProductList from "../components/products/List/productList";
import SommelierSection from "../components/sommelier-section/sommelierSection";
import AboutSommelier from "../components/sommelier-section/aboutSommelier";
import { useOutletContext } from "react-router-dom";

import { getAdminProducts } from "../utils/adminStorage";
import baseProducts from "../data/products";

export default function Home() {
  const { searchTerm } = useOutletContext();

  const adminProducts = getAdminProducts();
  const source =
    adminProducts && adminProducts.length > 0 ? adminProducts : baseProducts;

  const wineProducts = source.filter(
    (p) => p.category === "wine" && !p.isDeleted
  );

  return (
    <>
      <Slider />
      <FeaturesSection />

      <ProductList
        searchTerm={searchTerm}
        products={wineProducts}
        title="" // title boş qalır
      />

      <SommelierSection />
      <AboutSommelier />
    </>
  );
}
