import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import RegisterForm from "../components/register-form/register-form";

export default function Register() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container">
      <RegisterForm />
    </div>
  );
}
