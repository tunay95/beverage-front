import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wine from "./pages/Wine";
import Whiskey from "./pages/Whiskey";
import Vodka from "./pages/Vodka";
import Cognac from "./pages/Cognac";
import ProductDetails from "./pages/ProductDetails";
import ProductCart from "./pages/ProductCart.jsx";
import ProductFavourite from "./pages/ProductFavourite.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/wine" element={<Wine />} />
        <Route path="/whiskey" element={<Whiskey />} />
        <Route path="/vodka" element={<Vodka />} />
        <Route path="/cognac" element={<Cognac />} />

        <Route path="/:category/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<ProductCart />} />
        <Route path="/favourite" element={<ProductFavourite />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}
