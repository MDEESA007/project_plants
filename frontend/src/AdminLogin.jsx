import { useState } from "react";
import "./AdminLogin.css";

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================================================
     LOGIN
  ========================================================= */

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    /* Required field validation */
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);

    /* Login check */
    setTimeout(() => {
      if (
        username.trim() === "admin" &&
        password === "admin123"
      ) {
        localStorage.setItem(
          "adminLoggedIn",
          "true"
        );

        onLogin();
      } else {
        setError(
          "Invalid username or password."
        );

        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="admin-login-page">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        className="login-background-shape shape-one"
        aria-hidden="true"
      />

      <div
        className="login-background-shape shape-two"
        aria-hidden="true"
      />


      {/* =====================================================
          LOGIN CARD
      ===================================================== */}

      <div className="admin-login-box">

        {/* ===================================================
            COMPANY BRAND
        =================================================== */}

        <div className="login-brand">

          <div
            className="login-logo"
            aria-hidden="true"
          >
            🌱
          </div>

          <h1>
            SARAGEN BIOTECH
          </h1>

          <p>
            Administration Portal
          </p>

        </div>


        {/* ===================================================
            DIVIDER
        =================================================== */}

        <div className="login-divider" />


        {/* ===================================================
            LOGIN HEADING
        =================================================== */}

        <div className="login-heading">

          <h2>
            Welcome Back
          </h2>

          <p>
            Sign in to manage your
            SARAGEN BIOTECH administration
            dashboard.
          </p>

        </div>


        {/* ===================================================
            LOGIN FORM
        =================================================== */}

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          {/* =================================================
              USERNAME
          ================================================= */}

          <div className="input-group">

            <label htmlFor="admin-username">
              Username
            </label>

            <div className="login-input-wrapper">

              <span aria-hidden="true">
                👤
              </span>

              <input
                id="admin-username"
                type="text"
                placeholder="Enter username"
                value={username}
                autoComplete="username"
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
              />

            </div>

          </div>


          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="input-group">

            <label htmlFor="admin-password">
              Password
            </label>

            <div className="login-input-wrapper">

              <span aria-hidden="true">
                🔒
              </span>

              <input
                id="admin-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />

              <button
                type="button"
                className="password-toggle"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
              >
                {showPassword
                  ? "🙈"
                  : "👁️"}
              </button>

            </div>

          </div>


          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {error && (
            <div
              className="login-error"
              role="alert"
            >
              ⚠️ {error}
            </div>
          )}


          {/* =================================================
              LOGIN BUTTON
          ================================================= */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In →"}
          </button>

        </form>


        {/* ===================================================
            FOOTER
        =================================================== */}

        <div className="login-footer">

          <a href="/">
            ← Back to SARAGEN BIOTECH
          </a>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;