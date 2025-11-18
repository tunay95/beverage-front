import React from "react";
import { useParams } from "react-router-dom";
import ProductInfo from "../details-components/productInfo/productInfo";
import Recommended from "../details-components/recommended/recommended";
import DetailsSommelier from "../details-components/details-sommelier/details-sommelier";
import AboutSommelier from "../components/sommelier-section/aboutSommelier";

export default function ProductDetails() {
  const { category, id } = useParams();

  return (
    <>
      <ProductInfo />
      <Recommended category={category} />
      <DetailsSommelier />
      <AboutSommelier />
    </>
  );
}
