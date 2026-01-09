import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import "./admin.css";

export default function AdminHeader() {
    const { userSummary, logout } = useAuth();

    const handleLogout = () => {
        logout(true);
    };

    return (
        <header className="admin-header">
            <div className="admin-header-left">
                <Link 
                    className="admin-home-link" 
                    to="/"
                    onClick={() => console.log('Back to Home clicked')}
                >
                    <Home size={18} />
                    <span>Back to Home</span>
                </Link>
            </div>

            <div className="admin-header-right">
                {userSummary && (
                    <div className="admin-user-info">
                        {userSummary.imageUrl ? (
                            <img
                                src={userSummary.imageUrl}
                                alt={userSummary.username || "User"}
                                className="admin-user-avatar"
                            />
                        ) : (
                            <div className="admin-user-avatar" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(135deg, #7A0000 0%, #a80000 100%)',
                                color: '#fff',
                                fontWeight: '800'
                            }}>
                                {(userSummary.username || userSummary.fullName || 'U').charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="admin-user-text">
                            <span className="admin-user-name">{userSummary.fullName || userSummary.username || "User"}</span>
                            {userSummary.role && (
                                <span className="admin-user-role">{userSummary.role}</span>
                            )}
                        </div>
                    </div>
                )}
                <button className="admin-logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </header>
    );
}
