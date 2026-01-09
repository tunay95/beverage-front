import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./register-form.css";

export default function RegisterForm() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field error when user starts typing
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setFieldErrors({});
    setIsLoading(true);

    const fullName = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const phoneNumber = formData.phoneNumber.trim();

    if (!fullName || !email || !password) {
      setError("Please enter full name, email and password!");
      setIsLoading(false);
      return;
    }

    try {
      const registerDto = {
        fullName,
        email,
        password,
        phoneNumber: phoneNumber || undefined,
      };

      await auth.register(registerDto);

      setSuccessMessage("Registration completed successfully!");
      
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      
      if (err.response?.status === 400) {
        // FluentValidation errors
        const errors = err.response?.data?.errors || err.response?.data;
        
        if (Array.isArray(errors)) {
          // Backend returns array of error objects with propertyName and errorMessage
          const fieldErrs = {};
          errors.forEach(e => {
            const field = e.propertyName?.toLowerCase() || 'general';
            if (!fieldErrs[field]) {
              fieldErrs[field] = [];
            }
            fieldErrs[field].push(e.errorMessage || e);
          });
          
          setFieldErrors(fieldErrs);
          
          // Also set a general error message
          const allMessages = errors.map(e => e.errorMessage || e).join(", ");
          setError(allMessages);
        } else if (typeof errors === 'object') {
          // Handle object format errors
          const messages = Object.values(errors).flat();
          setError(messages.join(", "));
        } else {
          setError(err.response?.data?.message || "Registration failed!");
        }
      } else if (err.code === 'ERR_NETWORK') {
        setError("Network error. Please try again.");
      } else {
        setError(err.response?.data?.message || "Registration failed!");
      }
    } finally {
      setIsLoading(false);
    }
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
          name="fullName"
          type="text"
          placeholder="Full Name"
          onChange={handleChange}
          disabled={isLoading}
          style={fieldErrors.fullname ? { borderColor: 'red' } : {}}
        />
        {fieldErrors.fullname && (
          <div style={{ color: 'red', fontSize: '12px', marginTop: '-10px' }}>
            {fieldErrors.fullname.join(', ')}
          </div>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          disabled={isLoading}
          style={fieldErrors.email ? { borderColor: 'red' } : {}}
        />
        {fieldErrors.email && (
          <div style={{ color: 'red', fontSize: '12px', marginTop: '-10px' }}>
            {fieldErrors.email.join(', ')}
          </div>
        )}

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          disabled={isLoading}
          style={fieldErrors.password ? { borderColor: 'red' } : {}}
        />
        {fieldErrors.password && (
          <div style={{ color: 'red', fontSize: '12px', marginTop: '-10px' }}>
            {fieldErrors.password.join(', ')}
          </div>
        )}

        <input
          name="phoneNumber"
          type="tel"
          placeholder="Phone Number (optional)"
          onChange={handleChange}
          disabled={isLoading}
          style={fieldErrors.phonenumber ? { borderColor: 'red' } : {}}
        />
        {fieldErrors.phonenumber && (
          <div style={{ color: 'red', fontSize: '12px', marginTop: '-10px' }}>
            {fieldErrors.phonenumber.join(', ')}
          </div>
        )}

        <button 
          type="submit" 
          className="register-btn-white"
          disabled={isLoading}
        >
          {isLoading ? 'Please wait...' : 'Register'}
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: "12px",
            color: "#fff",
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <span style={{ color: '#ccc' }}>
            Already have an account?{' '}
            <Link to="/auth/login" style={{ color: "#aa0707ff" }}>
              Login
            </Link>
          </span>
          <Link to="/" style={{ color: "#ccc", textDecoration: "underline" }}>
            Return to home page
          </Link>
        </div>
      </form>
    </div>
  );
}
