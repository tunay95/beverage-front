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
import PaymentCallback from "./pages/PaymentCallback.jsx";
import AdminLayout from "./admin/AdminLayout";
import AdminProtectedRoute from "./admin/admin-components/AdminProtectedRoute";
import Dashboard from "./admin/admin-pages/Dashboard/Dashboard";
import Categories from "./admin/admin-pages/Categories/Categories";
import SubCategories from "./admin/admin-pages/SubCategories/SubCategories";
import ManageCategory from "./admin/admin-pages/ManageCategory/ManageCategory";
import CreateProduct from "./admin/admin-pages/CreateProduct/CreateProduct";
import EditProduct from "./admin/admin-pages/EditProduct/EditProduct";
import Products from "./admin/admin-pages/Products/Products";
import AdminProductDetails from "./admin/admin-pages/ProductDetails/ProductDetails";
import AdminProductFields from "./admin/admin-pages/ProductFields/ProductFields";
import AdminSlides from "./admin/admin-pages/Slides/Slides";
import CreateFilter from "./admin/admin-pages/CreateFilter/CreateFilter";
import NotAuthorized from "./admin/admin-pages/NotAuthorized/NotAuthorized";
import Subscribers from "./admin/admin-pages/Subscribers/Subscribers";
import Transactions from "./admin/admin-pages/Transactions/Transactions";

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
        <Route path="/payment/callback" element={<PaymentCallback />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="categories" element={<Categories />} />
          <Route path="subcategories" element={<SubCategories />} />
          <Route path="manage-category/:id" element={<ManageCategory />} />

          <Route path="products" element={<Products />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="create-product" element={<CreateProduct />} />
          <Route path="product-details" element={<AdminProductDetails />} />
          <Route path="product-fields" element={<AdminProductFields />} />
          <Route path="slides" element={<AdminSlides />} />

          <Route path="create-filter" element={<CreateFilter />} />

          <Route path="subscribers" element={<Subscribers />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>
      </Route>

      <Route path="/not-authorized" element={<NotAuthorized />} />
    </Routes>
  );
}
