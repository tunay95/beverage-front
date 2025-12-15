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

    const trimmedEmail = email.trim().toLowerCase();

    // 🔴 ADMIN LOGIN
    if (trimmedEmail === "admin@gmail.com" && password === "Admin") {
      localStorage.setItem("isAdmin", "true");
      localStorage.removeItem("currentUser");

      setSuccessMessage("Admin kimi daxil oldunuz!");
      setError("");

      setTimeout(() => navigate("/admin"), 1500);
      return;
    }

    // 🔹 İstifadəçi siyahısını oxu (array şəklində)
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    if (!storedUsers.length) {
      setError("İstifadəçi tapılmadı. Qeydiyyatdan keçin!");
      setSuccessMessage("");

      setTimeout(() => navigate("/auth/register"), 2000);
      return;
    }

    // 🔹 Email + şifrə ilə uyğun user tap
    const user = storedUsers.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
    );

    if (user) {
      const loginData = {
        name: user.name,
        email: user.email,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem("currentUser", JSON.stringify(loginData));
      localStorage.removeItem("isAdmin");

      setSuccessMessage("Uğurla daxil oldunuz!");
      setError("");

      setTimeout(() => navigate("/"), 1500);
    } else {
      setError("Email və ya şifrə yanlışdır!");
      setSuccessMessage("");
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

        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
            color: "#fff",
          }}
        >
          Hesabınız yoxdur?{" "}
          <Link to="/auth/register" style={{ color: "#aa0707ff" }}>
            Qeydiyyatdan keç
          </Link>
        </div>
      </form>
    </div>
  );
}
