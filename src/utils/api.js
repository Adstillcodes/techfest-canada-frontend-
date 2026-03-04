const API =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000/api"
    : "https://techfest-api.onrender.com/api");

// ================= GET CURRENT USER =================

export async function fetchMe() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const res = await fetch(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error("User fetch failed:", res.status);
    return null;
  }

  return res.json();
}
