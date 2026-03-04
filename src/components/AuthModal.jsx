import { useState, useEffect } from "react";
import {
  getPendingPurchase,
  clearPendingPurchase,
} from "../utils/purchase";

const API = "https://techfest-canada-backend.onrender.com/api";

// ⚠️ PUT YOUR REAL GOOGLE CLIENT ID HERE
const GOOGLE_CLIENT_ID = "676399067827-8rri9ibgjqonjfs5ov6laul096rj1m7o.apps.googleusercontent.com";

export default function AuthModal({ isOpen, onClose }) {
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ================= GOOGLE INIT =================
  useEffect(() => {
    if (!isOpen) return;
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-btn"),
      {
        theme: "outline",
        size: "large",
        width: 260,
      }
    );
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= FINISH AUTH =================
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
      // optional refresh so navbar updates instantly
      window.location.reload();
    }
  };

  // ================= GOOGLE HANDLER =================
  const handleGoogleResponse = async (response) => {
    try {
      const res = await fetch(`${API}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      finishAuth(data.token);
      alert("Signed in with Google!");
    } catch (err) {
      console.error(err);
      alert("Google sign-in failed");
    }
  };

  // ================= SIGNUP =================
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      finishAuth(data.token);
      alert("Account created!");
    } catch (err) {
      alert(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      finishAuth(data.token);
      alert("Logged in!");
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* CLOSE */}
        <button className="close-modal" onClick={onClose}>
          ✖
        </button>

        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          {view === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        {/* 🔥 GOOGLE BUTTON */}
        <div
          id="google-btn"
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        />

        <div style={{ textAlign: "center", margin: "1rem 0" }}>
          — or —
        </div>

        {/* ================= LOGIN ================= */}
        {view === "login" ? (
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
              Don’t have an account?{" "}
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
        ) : (
          /* ================= SIGNUP ================= */
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
