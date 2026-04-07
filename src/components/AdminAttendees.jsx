import { useEffect, useState } from "react";

const API = "https://techfest-canada-backend.onrender.com/api";

export default function AdminAttendees() {
  const [isDark, setIsDark] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.body.classList.contains("dark-mode"));
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    
    return () => observer.disconnect();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/admin/attendees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load attendees");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const textMain = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <div className="admin-card">
      <h2 className={textMain}>Ticket Holders</h2>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Ticket Type</th>
              <th>Ticket ID</th>
              <th>Status</th>
              <th>Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id || user.id || user.email}>
                <td className={textMain}>{user.name}</td>
                <td className={textMuted}>{user.email}</td>
                <td className={textMain}>{user.ticketType}</td>
                <td className={textMuted}>{user.ticketId}</td>
                <td>
                  <span className={`ticket-badge ${user.checkedIn ? "active" : ""}`}>
                    {user.checkedIn ? "Checked In" : "Not Checked In"}
                  </span>
                </td>
                <td className={textMuted}>
                  {user.purchaseDate
                    ? new Date(user.purchaseDate).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
