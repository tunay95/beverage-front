import { NavLink } from "react-router-dom";
import "./admin.css";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-logo">ADMIN PANEL</h2>

      <nav className="admin-nav">
        <NavLink to="/admin" end> Dashboard </NavLink>
        <NavLink to="/admin/products">Products</NavLink>
        <NavLink to="/admin/create-filter">Filter</NavLink>
        <NavLink to="/admin/subscribers">Subscribers</NavLink>
      </nav>
    </aside>
  );
}
