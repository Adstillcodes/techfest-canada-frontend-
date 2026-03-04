import { useEffect, useState } from "react";

const API = "https://techfest-canada-backend.onrender.com/api";

export default function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tier, setTier] = useState("festival");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  // ================= LOAD =================
 const loadInventory = async () => {
  try {
    const token = localStorage.getItem("token"); // ⭐ REQUIRED

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const res = await fetch(`${API}/admin/inventory`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Inventory error:", data);
      throw new Error(data.error || "Failed to load inventory");
    }

    setInventory(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Inventory load failed:", err);
  }
};

  // ================= ADD STOCK =================
  const handleAddTickets = async () => {
    if (!amount || amount <= 0) {
      alert("Enter valid ticket amount");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const item = inventory.find((i) => i.tier === tier);

      const newTotal = (item?.total || 0) + Number(amount);

  await fetch(`${API}/admin/inventory/${tier}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ total: newTotal }),
});

      setShowModal(false);
      setAmount("");
      loadInventory();

      // 🔥 notify other pages (tickets page live update)
      window.dispatchEvent(new Event("inventoryUpdated"));
    } catch (err) {
      alert("Failed to add tickets");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <div className="inventory-header">
        <h2>Ticket Inventory</h2>

        <button
          className="btn-gradient"
          onClick={() => setShowModal(true)}
        >
          + Add Tickets
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tier</th>
              <th>Total</th>
              <th>Sold</th>
              <th>Remaining</th>
            </tr>
          </thead>

          <tbody>
            {inventory.map((item) => {
              const remaining = item.total - item.sold;

              return (
                <tr key={item.tier}>
                  <td className="ticket-type">
                    {item.tier.toUpperCase()}
                  </td>
                  <td>{item.total}</td>
                  <td>{item.sold}</td>
                  <td
                    className={
                      remaining <= 10
                        ? "remaining-low"
                        : "remaining-ok"
                    }
                  >
                    {remaining}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="admin-modal">
            <h3>Add Ticket Stock</h3>

            <label>Ticket Tier</label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
            >
              <option value="early">Early Adopter</option>
              <option value="festival">Festival Pass</option>
              <option value="vip">VIP Experience</option>
            </select>

            <label>Number of tickets to add</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />

            <div className="modal-actions">
              <button
                className="btn-outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn-primary"
                onClick={handleAddTickets}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Tickets"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
