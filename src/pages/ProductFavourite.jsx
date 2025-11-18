import React from "react";
import Favourite from "../favourite-components/favourite/favourite";
import DetailsSommelier from "../details-components/details-sommelier/details-sommelier";
import AboutSommelier from "../components/sommelier-section/aboutSommelier";

export default function ProductFavourite() {
  return (
    <>
      <Favourite />
      <DetailsSommelier />
      <AboutSommelier />
    </>
  );
}
