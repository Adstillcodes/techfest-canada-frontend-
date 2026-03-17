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

      // 🔥 Handle API errors safely
      if (!res.ok) {
        console.error("API ERROR:", json);
        setError(json.error || "Failed to load KYC data");
        setData([]);
        setFiltered([]);
        return;
      }

      // ✅ Ensure array
      const safeData = Array.isArray(json) ? json : [];

      setData(safeData);
      setFiltered(safeData);

    } catch (err) {
      console.error("Fetch error:", err);
      setError("Network error");
      setData([]);
      setFiltered([]);
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

  const exportCSV = () => {

    if (filtered.length === 0) return;

    const headers = [
      "Company",
      "Email",
      "Country",
      "Industry",
      "Date"
    ];

    const rows = filtered.map(item => [
      item.company_name || "",
      item.primary_email || "",
      item.country_hq || "",
      item.primary_industry || "",
      item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""
    ]);

    const csv =
      [headers, ...rows]
        .map(row => row.join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "kyc_submissions.csv";
    a.click();
  };

  const uniqueCountries = [...new Set(data.map(d => d.country_hq).filter(Boolean))];
  const uniqueIndustries = [...new Set(data.map(d => d.primary_industry).filter(Boolean))];

  return (
    <div className="admin-card">

      <h2>KYC Submissions</h2>

      {/* 🔥 Loading State */}
      {loading && <p>Loading KYC data...</p>}

      {/* 🔥 Error State */}
      {error && (
        <p style={{ color: "red", marginBottom: 16 }}>
          {error}
        </p>
      )}

      {/* Filters */}
      {!loading && !error && (
        <>
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

          {/* Table */}
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
                    <tr key={item._id}>
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

    </div>
  );
}