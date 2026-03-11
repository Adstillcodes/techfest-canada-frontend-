import { useState, useEffect, useRef } from "react";
import { getPendingPurchase, clearPendingPurchase } from "../utils/purchase";

const API = "https://techfest-canada-backend.onrender.com/api/auth";
const GOOGLE_CLIENT_ID = "676399067827-8rri9ibgjqonjfs5ov6laul096rj1m7o.apps.googleusercontent.com";

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
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065z"/>
    </svg>
  );
}

export default function AuthModal({ isOpen, onClose, onSurvey }) {
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const googleBtnRef = useRef(null);

  // Detect dark mode
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && document.body.classList.contains("dark-mode")
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains("dark-mode"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => { setForm({ name: "", email: "", password: "" }); }, [view]);

  useEffect(() => {
    if (!isOpen) return;
    const initGoogle = () => {
      if (!window.google) return;
      window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleResponse });
      window.google.accounts.id.renderButton(googleBtnRef.current, { theme: "outline", size: "large", width: 1 });
    };
    if (window.google) initGoogle();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const finishAuth = (token, isNew = false, name = "") => {
    localStorage.setItem("token", token);
    const pending = getPendingPurchase();
    onClose();
    // Dispatch auth event so Navbar/App updates without full reload
    window.dispatchEvent(new CustomEvent("authStateChanged", { detail: { token, name } }));
    if (pending) {
      clearPendingPurchase();
      window.dispatchEvent(new CustomEvent("resumePurchase", { detail: pending }));
    } else if (isNew) {
      // Small delay so modal closes first, then survey appears
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("showSurvey", { detail: { name } }));
      }, 350);
    } else {
      // Soft reload — only reload if not already on dashboard
      const path = window.location.pathname;
      if (path === "/dashboard") {
        window.dispatchEvent(new CustomEvent("dashboardRefresh"));
      } else {
        window.location.reload();
      }
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      const res = await fetch(`${API}/google`, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ credential: response.credential }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      finishAuth(data.token);
    } catch { alert("Google sign-in failed"); }
  };

  const handleGoogleClick = () => {
    const btn = googleBtnRef.current?.querySelector("div[role=button]");
    if (btn) btn.click();
  };

  const handleLinkedIn = () => { window.location.href = `${API}/linkedin`; };

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch(`${API}/login`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ email:form.email, password:form.password }) });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error);
      finishAuth(data.token);
    } catch(err) { alert(err.message); } finally { setLoading(false); }
  };

  const handleSignup = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch(`${API}/register`,{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error);
      finishAuth(data.token, true, form.name);
    } catch(err){ alert(err.message); } finally{ setLoading(false); }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch(`${API}/forgot-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.email }) });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error("Server error. Please try again."); }
      if (!res.ok) throw new Error(data.error || "Request failed");
      alert("Password reset email sent.");
      setView("login");
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  // Theme-aware colors
  const bg        = isDark ? "#0f0720"         : "#ffffff";
  const cardBg    = isDark ? "#160c2c"         : "#f8f6ff";
  const border    = isDark ? "rgba(122,63,209,0.30)" : "rgba(122,63,209,0.20)";
  const textMain  = isDark ? "#ffffff"         : "#1a0a40";
  const textMuted = isDark ? "rgba(200,180,240,0.7)" : "rgba(80,60,120,0.7)";
  const inputBg   = isDark ? "#1e1040"         : "#ede8ff";
  const inputBorder = isDark ? "rgba(122,63,209,0.35)" : "rgba(122,63,209,0.25)";
  const socialBg  = isDark ? "#1e1040"         : "#ede8ff";
  const socialBorder = isDark ? "rgba(122,63,209,0.35)" : "rgba(122,63,209,0.20)";

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "13px 16px",
    borderRadius: 12,
    border: `1.5px solid ${inputBorder}`,
    background: inputBg,
    color: textMain,
    fontSize: "0.92rem",
    fontFamily: "inherit",
    marginBottom: 12,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const socialBtnStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    padding: "13px",
    borderRadius: 12,
    border: `1.5px solid ${socialBorder}`,
    background: socialBg,
    color: textMain,
    fontWeight: 700,
    fontSize: "0.92rem",
    cursor: "pointer",
    marginBottom: 12,
    transition: "background 0.2s, border-color 0.2s",
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: isDark ? "rgba(0,0,0,0.75)" : "rgba(20,10,50,0.45)",
      backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, zIndex: 9999,
    }}>
      <div style={{
        width: "100%", maxWidth: 420,
        padding: "36px 32px",
        borderRadius: 20,
        background: cardBg,
        border: `1.5px solid ${border}`,
        boxShadow: isDark
          ? "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(122,63,209,0.15)"
          : "0 20px 60px rgba(122,63,209,0.15), 0 0 0 1px rgba(122,63,209,0.12)",
        position: "relative",
      }}>

        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: isDark ? "rgba(122,63,209,0.15)" : "rgba(122,63,209,0.10)",
          border: `1px solid ${border}`,
          borderRadius: "50%", width: 32, height: 32,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: textMuted, cursor: "pointer", fontSize: 14,
        }}>✕</button>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: isDark ? "rgba(122,63,209,0.15)" : "rgba(122,63,209,0.10)",
            border: `1px solid ${border}`,
            borderRadius: 999, padding: "4px 14px",
            fontSize: "0.65rem", fontWeight: 700,
            letterSpacing: "1.2px", textTransform: "uppercase",
            color: isDark ? "#c4a8ff" : "#7a3fd1", marginBottom: 12,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#f5a623", boxShadow: "0 0 5px #f5a623", display: "inline-block" }} />
            TFC 2026
          </div>
          <h2 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "1.5rem", fontWeight: 900,
            color: textMain, margin: 0,
          }}>
            {view === "login"  && <>Welcome <span style={{ color: "#f5a623" }}>Back</span></>}
            {view === "signup" && <>Create <span style={{ color: "#f5a623" }}>Account</span></>}
            {view === "forgot" && <>Reset <span style={{ color: "#f5a623" }}>Password</span></>}
          </h2>
        </div>

        {/* Social buttons */}
        {view !== "forgot" && (
          <>
            <div ref={googleBtnRef} style={{ display: "none" }} />
            <button style={socialBtnStyle} onClick={handleGoogleClick}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? "#2a1560" : "#e0d8ff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = socialBg; }}>
              <GoogleIcon /> Continue with Google
            </button>
            <button style={socialBtnStyle} onClick={handleLinkedIn}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? "#2a1560" : "#e0d8ff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = socialBg; }}>
              <LinkedInIcon /> Continue with LinkedIn
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
              <div style={{ flex: 1, height: 1, background: border }} />
              <span style={{ fontSize: "0.8rem", color: textMuted, fontWeight: 600 }}>or</span>
              <div style={{ flex: 1, height: 1, background: border }} />
            </div>
          </>
        )}

        {/* LOGIN */}
        {view === "login" && (
          <form onSubmit={handleLogin}>
            <input style={inputStyle} name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
            <input style={inputStyle} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <div style={{ textAlign: "right", marginBottom: 16 }}>
              <span style={{ color: "#f5a623", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 }} onClick={() => setView("forgot")}>
                Forgot password?
              </span>
            </div>
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px",
              background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
              border: "none", borderRadius: 12,
              color: "white", fontWeight: 800, fontSize: "0.88rem",
              fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.5px",
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
              transition: "opacity 0.2s, transform 0.2s",
            }}>
              {loading ? "Signing in..." : "SIGN IN"}
            </button>
            <p style={{ textAlign: "center", marginTop: 16, color: textMuted, fontSize: "0.88rem" }}>
              Don't have an account?{" "}
              <span style={{ color: "#f5a623", cursor: "pointer", fontWeight: 700 }} onClick={() => setView("signup")}>Sign up</span>
            </p>
          </form>
        )}

        {/* SIGNUP */}
        {view === "signup" && (
          <form onSubmit={handleSignup}>
            <input style={inputStyle} name="name" type="text" placeholder="Full name" value={form.name} onChange={handleChange} required />
            <input style={inputStyle} name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
            <input style={inputStyle} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px",
              background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
              border: "none", borderRadius: 12,
              color: "white", fontWeight: 800, fontSize: "0.88rem",
              fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.5px",
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "Creating account..." : "CREATE ACCOUNT"}
            </button>
            <p style={{ textAlign: "center", marginTop: 16, color: textMuted, fontSize: "0.88rem" }}>
              Already have an account?{" "}
              <span style={{ color: "#f5a623", cursor: "pointer", fontWeight: 700 }} onClick={() => setView("login")}>Sign in</span>
            </p>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {view === "forgot" && (
          <form onSubmit={handleForgotPassword}>
            <input style={inputStyle} name="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px",
              background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
              border: "none", borderRadius: 12,
              color: "white", fontWeight: 800, fontSize: "0.88rem",
              fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.5px",
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "Sending..." : "SEND RESET LINK"}
            </button>
            <p style={{ textAlign: "center", marginTop: 16 }}>
              <span style={{ color: "#f5a623", cursor: "pointer", fontWeight: 700, fontSize: "0.88rem" }} onClick={() => setView("login")}>← Back to login</span>
            </p>
          </form>
        )}

      </div>
    </div>
  );
}
