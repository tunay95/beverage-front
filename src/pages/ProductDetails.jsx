import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductInfo from "../details-components/productInfo/productInfo";
import Recommended from "../details-components/recommended/recommended";
import DetailsSommelier from "../details-components/details-sommelier/details-sommelier";
import AboutSommelier from "../components/sommelier-section/aboutSommelier";
import { getProductDetailed } from "../data/productApi";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductDetailed(id);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return (
    <>
      <ProductInfo />
      {!loading && product && (
        <Recommended 
          subCategoryId={product.subCategoryId} 
          currentProductId={product.id}
        />
      )}
      <DetailsSommelier />
      <AboutSommelier />
    </>
  );
}
