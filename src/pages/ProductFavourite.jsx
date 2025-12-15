import React from "react";
import Favourite from "../favourite-components/favourite/favourite";
import FavRecommend from "../favourite-components/fav-recommend/fav-recommend";
import DetailsSommelier from "../details-components/details-sommelier/details-sommelier";
import AboutSommelier from "../components/sommelier-section/aboutSommelier";

export default function ProductFavourite() {
  return (
    <>
      <Favourite />
      <FavRecommend />
      <DetailsSommelier />
      <AboutSommelier />
    </>
  );
}
