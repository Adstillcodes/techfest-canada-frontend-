export async function fetchMe() {
  const token = localStorage.getItem("token");

  const res = await fetch("https://techfest-canada-frontend.vercel.app/api/auth", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user");

  return res.json();
}
