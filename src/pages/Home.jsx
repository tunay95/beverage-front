import Slider from "../components/slider/slider";
import FeaturesSection from "../components/features-section/featuresSection";
import ProductList from "../components/products/List/productList";
import SommelierSection from "../components/sommelier-section/sommelierSection";
import AboutSommelier from "../components/sommelier-section/aboutSommelier";
import { useOutletContext } from "react-router-dom";
import products from "../data/products";

export default function Home() {
  const { searchTerm } = useOutletContext();

  // Home-da yalnız wine məhsulları göstərilir
  const wineProducts = products.filter((p) => p.category === "wine");

  return (
    <>
      <Slider />
      <FeaturesSection />

      {/* Filter görünür, title göstərilmir */}
      <ProductList
        searchTerm={searchTerm}
        products={wineProducts}
        title=""  // ⭐ boş qoy → universal-title görünməsin
      />

      <SommelierSection />
      <AboutSommelier />
    </>
  );
}
