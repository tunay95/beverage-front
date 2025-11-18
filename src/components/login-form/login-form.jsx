import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login-form.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedData = localStorage.getItem("userData");

    if (!storedData) {
      setError("İstifadəçi tapılmadı. Qeydiyyatdan keçin!");
      setTimeout(() => navigate("/auth/register"), 3000);
      return;
    }

    const userData = JSON.parse(storedData);

    if (userData.email === email && userData.password === password) {
      const loginData = {
        name: userData.name,
        email: userData.email,
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem("currentUser", JSON.stringify(loginData));
      setSuccessMessage("Uğurla daxil oldunuz!");
      setTimeout(() => navigate("/"), 1500);
    } else {
      setError("Email və ya şifrə yanlışdır!");
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
          placeholder="Email daxil edin"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifrə daxil edin"
          required
        />

        <button type="submit" className="login-btn-white">
          Daxil ol
        </button>

        <div className="register-text">
          Hesabın yoxdur?{" "}
          <Link to="/auth/register" className="register-link">
            Qeydiyyatdan keç
          </Link>
        </div>
      </form>
    </div>
  );
}
