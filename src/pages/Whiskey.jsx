import Slider from "../components/slider/slider";
import ProductList from "../components/products/List/productList";
import products from "../data/products";
import WineSommelier from "../wine-components/wine-sommelier/wine-sommelier";
import AboutSommelier from "../components/sommelier-section/aboutSommelier";

import { useOutletContext } from "react-router-dom";

export default function Whiskey() {
    const { searchTerm } = useOutletContext();

    const whiskeyProducts = products.filter((p) => p.category === "whiskey");

    return (
        <>
            <Slider />
            <ProductList
                searchTerm={searchTerm}
                products={whiskeyProducts}
                title="Whiskey"
                showFields={{ color: false, sweetness: false, price: true }} // ⭐ ONLY PRICE
            />
            <WineSommelier />
            <AboutSommelier />
        </>
    );
}
