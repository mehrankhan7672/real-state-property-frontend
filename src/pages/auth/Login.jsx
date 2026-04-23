import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./css/login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (message.text) setMessage({ text: "", type: "" });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validateForm = () => {
    if (!formData.email.trim()) {
      setMessage({ text: "Please enter your email address", type: "error" });
      return false;
    }
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      setMessage({
        text: "Enter a valid email (e.g., name@example.com)",
        type: "error",
      });
      return false;
    }
    if (!formData.password.trim()) {
      setMessage({ text: "Please enter your password", type: "error" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await axios.post(
        "https://real-state-property-backend.vercel.app/login",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      // ✅ FIX 1: Store both token and role properly
      const { token, user } = response.data;
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("userName", response.data.user.name);
      localStorage.setItem("userEmail", response.data.user.email);
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role.toLowerCase()); // Store role in lowercase

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("userEmail", formData.email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("userEmail");
      }

      setMessage({ text: "Login successful! Redirecting...", type: "success" });

      // ✅ FIX 2: Add a small delay to ensure localStorage is set and message is shown
      setTimeout(() => {
        const role = user.role.toLowerCase();
        console.log("Role:", role);
        console.log("Token:", token);

        // ✅ FIX 3: Navigate based on role
        if (role === "customer") {
          navigate("/customerDashboard");
        } else if (role === "agent") {
          navigate("/agentDashboard");
        } else if (role === "admin") {
          navigate("/adminDashboard");
        } else {
          navigate("/login");
        }
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      setMessage({
        text:
          error.response?.data?.message || "Login failed. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setMessage({
      text: "Password reset link sent to your email! (Demo)",
      type: "info",
    });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  return (
    <div className="login-container">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="login-wrapper">
        <div className="login-brand">
          <div className="brand-logo">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1>FlowSpace</h1>
          <p>Modern workspace for creative minds</p>
        </div>

        <div className="login-card">
          <div className="card-header">
            <h2>Welcome back</h2>
            <p>Sign in to access your account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-field">
              <label htmlFor="email">Email address</label>
              <div className="input-wrapper">
                <svg
                  className="input-svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 6L12 13L2 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="input-field">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <svg
                  className="input-svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 8H19C20.1 8 21 8.9 21 10V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V10C3 8.9 3.9 8 5 8H6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 8V6C8 3.79 9.79 2 12 2C14.21 2 16 3.79 16 6V8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 14V16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 2L22 22"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5 20 12 20C13.7205 20 15.1841 19.491 16.4019 18.7116M9.88488 9.87892C9.32719 10.4366 9 11.1888 9 12C9 13.6569 10.3431 15 12 15C12.8112 15 13.5634 14.6728 14.1211 14.1151"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M16.8246 13.1142C17.0772 12.4284 17.2078 11.7022 17.2 10.9778C17.1922 10.2534 17.0478 9.52712 16.7822 8.84133C16.5166 8.15553 16.1342 7.52163 15.6539 6.96934C15.1736 6.41705 14.6035 5.95532 13.9677 5.60594"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="checkbox-text">Remember me</span>
              </label>
              <a
                href="#"
                className="forgot-link"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </a>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          {message.text && (
            <div className={`message-alert message-${message.type}`}>
              <span>{message.text}</span>
            </div>
          )}

          <div className="card-footer">
            <p>
              Don't have an account? <Link to="/register">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
