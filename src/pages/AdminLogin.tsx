import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://techfest-canada-backend.onrender.com/api/auth";

export default function AdminLogin() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e:any) => {

    e.preventDefault();
    setLoading(true);

    try {

      const res = await fetch(`${API}/login`,{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ email,password })
      });

      const data = await res.json();

      if(!res.ok) throw new Error(data.error);

      localStorage.setItem("token",data.token);

      window.dispatchEvent(new Event("authChanged"));

      navigate("/admin");

    } catch(err:any) {

      alert(err.message);

    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      background:"#0a0518"
    }}>
      <form onSubmit={handleLogin}
        style={{
          width:340,
          padding:40,
          borderRadius:16,
          background:"#160c2c"
        }}
      >

        <h2 style={{
          textAlign:"center",
          marginBottom:20,
          fontFamily:"Orbitron"
        }}>
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={e=>setEmail(e.target.value)}
          style={{width:"100%",padding:12,marginBottom:12}}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={e=>setPassword(e.target.value)}
          style={{width:"100%",padding:12,marginBottom:20}}
        />

        <button
          disabled={loading}
          style={{
            width:"100%",
            padding:14,
            background:"linear-gradient(135deg,#7a3fd1,#f5a623)",
            border:"none",
            color:"#fff",
            fontWeight:800,
            fontFamily:"Orbitron"
          }}
        >
          {loading ? "Signing in..." : "SIGN IN"}
        </button>

      </form>
    </div>
  );
}
