import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  ListChecks,
  Images,
  FolderKanban,
  GitBranch,
} from "lucide-react";
import "./admin.css";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-logo">ADMIN PANEL</h2>

      <nav className="admin-nav">
        <NavLink to="/admin" end>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/products">
          <Package size={18} />
          <span>Products</span>
        </NavLink>
        <NavLink to="/admin/product-details">
          <FileText size={18} />
          <span>Product Details</span>
        </NavLink>
        <NavLink to="/admin/product-fields">
          <ListChecks size={18} />
          <span>Product Fields</span>
        </NavLink>
        <NavLink to="/admin/slides">
          <Images size={18} />
          <span>Slides</span>
        </NavLink>
        <NavLink to="/admin/categories">
          <FolderKanban size={18} />
          <span>Categories</span>
        </NavLink>
        <NavLink to="/admin/subcategories">
          <GitBranch size={18} />
          <span>Subcategories</span>
        </NavLink>
      </nav>
    </aside>
  );
}
