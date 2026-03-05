import { useState, useEffect, useRef } from "react";
import { getPendingPurchase, clearPendingPurchase } from "../utils/purchase";

const API = "https://techfest-canada-backend.onrender.com/api/auth";

const GOOGLE_CLIENT_ID =
  "676399067827-8rri9ibgjqonjfs5ov6laul096rj1m7o.apps.googleusercontent.com";

/* ================= ICONS ================= */

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

/* ================= BUTTON STYLE ================= */

const socialBtnStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  width: "100%",
  padding: "13px",
  borderRadius: "8px",
  border: "1px solid var(--border-main)",
  background: "transparent",
  color: "var(--text-main)",
  fontWeight: 700,
  fontSize: "0.95rem",
  cursor: "pointer",
  marginBottom: "12px",
  fontFamily: "'Montserrat', sans-serif",
};

/* ================= COMPONENT ================= */

export default function AuthModal({ isOpen, onClose }) {
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const googleBtnRef = useRef(null);

  /* ================= GOOGLE INIT ================= */

  useEffect(() => {
    if (!isOpen) return;

    const initGoogle = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        googleBtnRef.current,
        {
          theme: "outline",
          size: "large",
          width: 1,
        }
      );
    };

    if (window.google) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initGoogle();
          clearInterval(interval);
        }
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= FINISH AUTH ================= */

  const finishAuth = (token) => {
    localStorage.setItem("token", token);

    const pending = getPendingPurchase();

    onClose();

    if (pending) {
      clearPendingPurchase();

      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("resumePurchase", {
            detail: pending,
          })
        );
      }, 300);
    } else {
      window.location.reload();
    }
  };

  /* ================= GOOGLE LOGIN ================= */

  const handleGoogleResponse = async (response) => {
    try {
      const res = await fetch(`${API}/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      finishAuth(data.token);
    } catch (err) {
      alert("Google sign-in failed");
    }
  };

  const handleGoogleClick = () => {
    const btn =
      googleBtnRef.current &&
      googleBtnRef.current.querySelector("div[role=button]");

    if (btn) {
      btn.click();
    } else {
      alert("Google sign-in unavailable. Please try again.");
    }
  };

  /* ================= LINKEDIN LOGIN ================= */

  const handleLinkedIn = () => {
    window.location.href = `${API}/linkedin`;
  };

  /* ================= EMAIL LOGIN ================= */

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      finishAuth(data.token);
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EMAIL SIGNUP ================= */

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      finishAuth(data.token);
    } catch (err) {
      alert(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "2rem",
          borderRadius: "16px",
          background: "var(--bg-modal)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          ✖
        </button>

        <h2
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "1.4rem",
          }}
        >
          {view === "login" && "Welcome Back"}
          {view === "signup" && "Create Account"}
        </h2>

        {/* hidden Google button */}
        <div
          ref={googleBtnRef}
          style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
          }}
        />

        {/* GOOGLE BUTTON */}
        <button style={socialBtnStyle} onClick={handleGoogleClick}>
          <GoogleIcon />
          Continue with Google
        </button>

        {/* LINKEDIN BUTTON */}
        <button style={socialBtnStyle} onClick={handleLinkedIn}>
          <LinkedInIcon />
          Continue with LinkedIn
        </button>

        <div
          style={{
            textAlign: "center",
            margin: "1rem 0",
            color: "var(--text-muted)",
            fontSize: "0.8rem",
            fontWeight: 700,
          }}
        >
          — or —
        </div>

        {view === "login" && (
          <form onSubmit={handleLogin}>
            <input
              className="form-input"
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              className="form-input"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p style={{ textAlign: "center", marginTop: 12 }}>
              Don't have an account?{" "}
              <span
                style={{
                  color: "var(--brand-orange)",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onClick={() => setView("signup")}
              >
                Sign up
              </span>
            </p>
          </form>
        )}

        {view === "signup" && (
          <form onSubmit={handleSignup}>
            <input
              className="form-input"
              name="name"
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              className="form-input"
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              className="form-input"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p style={{ textAlign: "center", marginTop: 12 }}>
              Already have an account?{" "}
              <span
                style={{
                  color: "var(--brand-orange)",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onClick={() => setView("login")}
              >
                Sign in
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
