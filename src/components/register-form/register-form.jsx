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

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!name || !email || !password) {
      setError("Bütün xanaları doldurun!");
      setSuccessMessage("");
      return;
    }

    // Mövcud istifadəçilər (array)
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Eyni email varsa — error
    const exists = users.find((u) => u.email.toLowerCase() === email);
    if (exists) {
      setError("Bu email ilə istifadəçi artıq mövcuddur!");
      setSuccessMessage("");
      return;
    }

    const newUser = { name, email, password };
    const updatedUsers = [...users, newUser];

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setError("");
    setSuccessMessage("Qeydiyyat uğurla tamamlandı!");

    setTimeout(() => navigate("/auth/login"), 2000);
  };

  return (
    <div className="register-form">
      <form onSubmit={handleSubmit} className="register-form-container">
        <div className="register">Register</div>

        {error && <div className="register-form-error-message">{error}</div>}
        {successMessage && (
          <div className="register-form-success-message">
            {successMessage}
          </div>
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
