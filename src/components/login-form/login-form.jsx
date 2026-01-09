import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./login-form.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    const trimmedEmail = email.trim().toLowerCase();

    try {
      const loginDto = {
        usernameOrEmail: trimmedEmail,
        password: password,
      };

      await auth.login(loginDto);

      setSuccessMessage("Logged in successfully!");
      
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      
      if (err.response?.status === 400) {
        // FluentValidation errors
        const errors = err.response?.data?.errors || err.response?.data;
        if (Array.isArray(errors)) {
          setError(errors.map(e => e.errorMessage || e).join(", "));
        } else if (typeof errors === 'object') {
          const messages = Object.values(errors).flat();
          setError(messages.join(", "));
        } else {
          setError(err.response?.data?.message || "Email or password is incorrect!");
        }
      } else if (err.response?.status === 401) {
        setError("Email or password is incorrect!");
      } else if (err.code === 'ERR_NETWORK') {
        setError("Network error. Please try again.");
      } else {
        setError(err.response?.data?.message || "Login failed!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit} className="login-form-container">
        <div className="login">Login</div>

        {error && <div className="login-form-error-message">{error}</div>}
        {successMessage && (
          <div className="login-form-success-message">{successMessage}</div>
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
          disabled={isLoading}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
          disabled={isLoading}
        />

        <button 
          type="submit" 
          className="login-btn-white"
          disabled={isLoading}
        >
          {isLoading ? 'Please wait...' : 'Log in'}
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
            color: "#fff",
          }}
        >
          Don't have an account?{" "}
          <Link to="/auth/register" style={{ color: "#aa0707ff" }}>
            Register
          </Link>
          <div style={{ marginTop: "8px" }}>
            <Link to="/" style={{ color: "#ccc", textDecoration: "underline" }}>
              Return to home page
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
