import React from "react";
import Cart from "../cart-components/productCart/Cart";
import CartRecommended from "../cart-components/recomment-cart/recomment-cart";
import DetailsSommelier from "../details-components/details-sommelier/details-sommelier";
import AboutSommelier from "../components/sommelier-section/aboutSommelier";

export default function ProductCart() {
  return (
    <>
      <Cart />
      <CartRecommended />
      <DetailsSommelier />
      <AboutSommelier />
    </>
  );
}
