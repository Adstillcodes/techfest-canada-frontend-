import { useEffect, useState } from "react";

const API = "https://techfest-canada-backend.onrender.com/api";

export default function AdminKyc() {

  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 NEW: modal state
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, country, industry, data]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not logged in as admin");
        setData([]);
        return;
      }

      const res = await fetch(`${API}/kyc`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to load KYC data");
        setData([]);
        setFiltered([]);
        return;
      }

      const safeData = Array.isArray(json) ? json : [];

      setData(safeData);
      setFiltered(safeData);

    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let temp = [...data];

    if (search) {
      temp = temp.filter(item =>
        item.company_name?.toLowerCase().includes(search.toLowerCase()) ||
        item.primary_email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (country) {
      temp = temp.filter(item => item.country_hq === country);
    }

    if (industry) {
      temp = temp.filter(item => item.primary_industry === industry);
    }

    setFiltered(temp);
  };

  // 🔥 FULL EXPORT (ALL FIELDS)
  const exportCSV = () => {

    if (!filtered.length) return;

    const keys = Array.from(
      new Set(filtered.flatMap(obj => Object.keys(obj)))
    );

    const rows = filtered.map(item =>
      keys.map(key => {
        const val = item[key];

        if (Array.isArray(val)) return `"${val.join(", ")}"`;
        if (typeof val === "object" && val !== null) return `"${JSON.stringify(val)}"`;

        return `"${val ?? ""}"`;
      })
    );

    const csv =
      [keys, ...rows]
        .map(row => row.join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "kyc_full_export.csv";
    a.click();
  };

  const uniqueCountries = [...new Set(data.map(d => d.country_hq).filter(Boolean))];
  const uniqueIndustries = [...new Set(data.map(d => d.primary_industry).filter(Boolean))];

  return (
    <div className="admin-card">

      <h2>KYC Submissions</h2>

      {loading && <p>Loading KYC data...</p>}

      {error && (
        <p style={{ color: "red", marginBottom: 16 }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          {/* FILTERS */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>

            <input
              placeholder="Search company or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="admin-input"
            />

            <select value={country} onChange={e => setCountry(e.target.value)} className="admin-input">
              <option value="">All Countries</option>
              {uniqueCountries.map(c => <option key={c}>{c}</option>)}
            </select>

            <select value={industry} onChange={e => setIndustry(e.target.value)} className="admin-input">
              <option value="">All Industries</option>
              {uniqueIndustries.map(i => <option key={i}>{i}</option>)}
            </select>

            <button className="btn-primary" onClick={exportCSV}>
              Export CSV
            </button>

          </div>

          {/* TABLE */}
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Country</th>
                  <th>Industry</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No submissions found
                    </td>
                  </tr>
                ) : (
                  filtered.map(item => (
                    <tr
                      key={item._id}
                      onClick={() => setSelected(item)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{item.company_name}</td>
                      <td>{item.primary_email}</td>
                      <td>{item.country_hq}</td>
                      <td>{item.primary_industry}</td>
                      <td>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "-"
                        }
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 🔥 MODAL */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: 20
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0a0518",
              borderRadius: 16,
              padding: 24,
              maxWidth: 800,
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
              color: "#fff"
            }}
          >
            <h2 style={{ marginBottom: 20 }}>
              {selected.company_name}
            </h2>

            {Object.entries(selected).map(([key, value]) => (
              <div key={key} style={{ marginBottom: 10 }}>
                <strong>{key}:</strong>{" "}
                {Array.isArray(value)
                  ? value.join(", ")
                  : typeof value === "object" && value !== null
                  ? JSON.stringify(value)
                  : String(value)}
              </div>
            ))}

            <button
              onClick={() => setSelected(null)}
              style={{
                marginTop: 20,
                padding: "10px 20px",
                borderRadius: 8,
                background: "#7a3fd1",
                border: "none",
                color: "#fff",
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}