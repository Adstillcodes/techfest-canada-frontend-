import { useEffect, useState } from "react";

const API = "https://techfest-canada-backend.onrender.com/api";

export default function AdminAttendees() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
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

  return (
    <div className="admin-card">
      <h2>Ticket Holders</h2>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Ticket Type</th>
              <th>Ticket ID</th>
              <th>Purchase Date</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) =>
              user.tickets?.map((ticket, idx) => (
                <tr key={user._id + idx}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className="ticket-type">{ticket.type}</td>
                  <td className="ticket-id">{ticket.ticketId}</td>
                  <td>
                    {new Date(ticket.purchaseDate).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
