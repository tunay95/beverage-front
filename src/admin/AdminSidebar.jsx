import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  ListChecks,
  Images,
  FolderKanban,
  GitBranch,
  CreditCard,
  X,
} from "lucide-react";
import "./admin.css";

export default function AdminSidebar({ isMobileOpen, onClose }) {
  return (
    <>
      {isMobileOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: window.innerWidth <= 768 ? 'block' : 'none'
          }}
        />
      )}
      <aside className={`admin-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h2 className="admin-logo" style={{ margin: 0 }}>ADMIN PANEL</h2>
          {isMobileOpen && (
            <button 
              className="mobile-close-btn"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

      <nav className="admin-nav">
        <NavLink to="/admin" end onClick={onClose}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/products" onClick={onClose}>
          <Package size={18} />
          <span>Products</span>
        </NavLink>
        <NavLink to="/admin/product-details" onClick={onClose}>
          <FileText size={18} />
          <span>Product Details</span>
        </NavLink>
        <NavLink to="/admin/product-fields" onClick={onClose}>
          <ListChecks size={18} />
          <span>Product Fields</span>
        </NavLink>
        <NavLink to="/admin/slides" onClick={onClose}>
          <Images size={18} />
          <span>Slides</span>
        </NavLink>
        <NavLink to="/admin/categories" onClick={onClose}>
          <FolderKanban size={18} />
          <span>Categories</span>
        </NavLink>
        <NavLink to="/admin/subcategories" onClick={onClose}>
          <GitBranch size={18} />
          <span>Subcategories</span>
        </NavLink>
        <NavLink to="/admin/transactions" onClick={onClose}>
          <CreditCard size={18} />
          <span>Transactions</span>
        </NavLink>
      </nav>
    </aside>
    </>
  );
}
