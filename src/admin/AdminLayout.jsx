import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import "./admin.css";

export default function AdminLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="admin-layout">
            <AdminSidebar 
                isMobileOpen={isMobileMenuOpen} 
                onClose={closeMobileMenu}
            />
            <div className="admin-main">
                <AdminHeader onMenuToggle={toggleMobileMenu} />
                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
