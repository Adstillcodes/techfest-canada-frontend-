import { useEffect, useState } from "react";

const API = "https://techfest-canada-backend.onrender.com/api";

export default function AdminInventory() {

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  /* ================= LOAD ================= */

  const loadInventory = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/admin/inventory`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      setInventory(Array.isArray(data) ? data : []);

    } catch (err) {

      console.error("Inventory load failed:", err);

    }

  };

  /* ================= UPDATE PRICE ================= */

  const updatePrice = async (tier, price) => {

    try {

      const token = localStorage.getItem("token");

      await fetch(`${API}/admin/inventory/${tier}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ price: Number(price) })
      });

      loadInventory();

    } catch (err) {

      console.error("Price update failed");

    }

  };

  /* ================= UPDATE TOTAL ================= */

  const updateTotal = async (tier, total) => {

    try {

      const token = localStorage.getItem("token");

      await fetch(`${API}/admin/inventory/${tier}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ total: Number(total) })
      });

      loadInventory();

    } catch (err) {

      console.error("Total update failed");

    }

  };

  /* ================= CALCULATIONS ================= */

  const totalRevenue = inventory.reduce(
    (sum, i) => sum + (i.sold * (i.price || 0)),
    0
  );

  const totalSold = inventory.reduce(
    (sum, i) => sum + i.sold,
    0
  );

  const totalRemaining = inventory.reduce(
    (sum, i) => sum + (i.total - i.sold),
    0
  );

  return (
    <div className="admin-card">

      <h2>Ticket Inventory</h2>

      {/* ===== DASHBOARD STATS ===== */}

     <div className="inventory-stats">

  <div className="stat-card">
    <p>Total Revenue</p>
    <h2>${totalRevenue.toLocaleString()}</h2>
  </div>

  <div className="stat-card">
    <p>Tickets Sold</p>
    <h2>{totalSold}</h2>
  </div>

  <div className="stat-card">
    <p>Tickets Remaining</p>
    <h2>{totalRemaining}</h2>
  </div>

</div>

      {/* ===== TABLE ===== */}

      <div className="table-wrapper">

        <table className="admin-table">

          <thead>
            <tr>
              <th>Tier</th>
              <th>Price</th>
              <th>Total</th>
              <th>Sold</th>
              <th>Remaining</th>
              <th>Revenue</th>
              <th>Progress</th>
            </tr>
          </thead>

          <tbody>

            {inventory.map((item) => {

              const remaining = item.total - item.sold;
              const revenue = item.sold * (item.price || 0);
              const percent = (item.sold / item.total) * 100;

              return (
                <tr key={item.tier}>

                  <td>{item.tier.toUpperCase()}</td>

                  {/* PRICE */}

                  <td>
                    <input
  type="number"
  className="inventory-input"
  defaultValue={item.price}
  onBlur={(e) =>
    updatePrice(item.tier, e.target.value)
  }
/>
                  </td>

                  {/* TOTAL */}

                  <td>
                    <input
                      type="number"
                      className="inventory-input"
                      
                     defaultValue={item.total}
                      onBlur={(e) =>
                        updateTotal(item.tier, e.target.value)
                      }
                    />
                  </td>

                  <td>{item.sold}</td>

                  {/* REMAINING */}

                  <td
                    className={
                      remaining <= 10
                        ? "remaining-low"
                        : "remaining-ok"
                    }
                  >
                    {remaining}
                  </td>

                  {/* REVENUE */}

                  <td>${revenue}</td>

                  {/* PROGRESS BAR */}

                  <td>

                    <div className="progress-bar">

                      <div
                        className="progress-fill"
                        style={{
                          width: `${percent}%`
                        }}
                      />

                    </div>

                    <small>{Math.round(percent)}%</small>

                  </td>

                </tr>
              );

            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}
