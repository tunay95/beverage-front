import { useNavigate } from "react-router-dom";
import "./admin.css";

export default function AdminHeader() {
    const navigate = useNavigate();

    const logoutAdmin = () => {
        localStorage.removeItem("isAdmin");
        navigate("/");
    };

    return (
        <header className="admin-header">
            <div className="admin-header-right">
                <button className="admin-logout" onClick={logoutAdmin}>
                    Logout
                </button>
            </div>
        </header>
    );
}
