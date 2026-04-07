import { useEffect, useState } from "react";

const API = "https://techfest-canada-backend.onrender.com/api";

export default function AdminInventory() {

  const [isDark, setIsDark] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.body.classList.contains("dark-mode"));
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    
    return () => observer.disconnect();
  }, []);

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

  const cardClass = isDark ? "stat-card" : "stat-card stat-card-light";

  return (
    <div className="admin-card">

      <h2 className={isDark ? "text-white" : "text-gray-900"}>Ticket Inventory</h2>

      {/* ===== DASHBOARD STATS ===== */}

     <div className="inventory-stats">

  <div className={cardClass}>
    <p className={isDark ? "text-gray-400" : "text-gray-600"}>Total Revenue</p>
    <h2 className={isDark ? "text-white" : "text-gray-900"}>${totalRevenue.toLocaleString()}</h2>
  </div>

  <div className={cardClass}>
    <p className={isDark ? "text-gray-400" : "text-gray-600"}>Tickets Sold</p>
    <h2 className={isDark ? "text-white" : "text-gray-900"}>{totalSold}</h2>
  </div>

  <div className={cardClass}>
    <p className={isDark ? "text-gray-400" : "text-gray-600"}>Tickets Remaining</p>
    <h2 className={isDark ? "text-white" : "text-gray-900"}>{totalRemaining}</h2>
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

                  <td className={isDark ? "text-white" : "text-gray-900"}>{item.tier.toUpperCase()}</td>

                  {/* PRICE */}

                  <td>
                    <input
  type="number"
  className={isDark ? "inventory-input" : "inventory-input inventory-input-light"}
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
                      className={isDark ? "inventory-input" : "inventory-input inventory-input-light"}
                      
                     defaultValue={item.total}
                      onBlur={(e) =>
                        updateTotal(item.tier, e.target.value)
                      }
                    />
                  </td>

                  <td className={isDark ? "text-white" : "text-gray-900"}>{item.sold}</td>

                  {/* REMAINING */}

                  <td
                    className={
                      remaining <= 10
                        ? "remaining-low"
                        : isDark ? "remaining-ok" : "remaining-ok-light"
                    }
                  >
                    {remaining}
                  </td>

                  {/* REVENUE */}

                  <td className={isDark ? "text-white" : "text-gray-900"}>${revenue}</td>

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

                    <small className={isDark ? "text-gray-400" : "text-gray-600"}>{Math.round(percent)}%</small>

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
