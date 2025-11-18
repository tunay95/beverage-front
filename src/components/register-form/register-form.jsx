import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register-form.css";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError("Bütün xanaları doldurun!");
      return;
    }

    localStorage.setItem("userData", JSON.stringify(formData));
    setSuccessMessage("Qeydiyyat uğurla tamamlandı!");
    setTimeout(() => navigate("/auth/login"), 2000);
  };

  return (
    <div className="register-form">
      <form onSubmit={handleSubmit} className="register-form-container">
        <div className="register">Register</div>
        {error && <div className="register-form-error-message">{error}</div>}
        {successMessage && (
          <div className="register-form-success-message">{successMessage}</div>
        )}

        <input
          name="name"
          type="text"
          placeholder="Ad"
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Şifrə"
          onChange={handleChange}
        />
        <button type="submit" className="register-btn-white">
          Qeydiyyat
        </button>
      </form>
    </div>
  );
}
