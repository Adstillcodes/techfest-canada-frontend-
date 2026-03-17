import { useEffect, useState } from "react";

const API = "https://techfest-canada-backend.onrender.com/api";

export default function AdminKyc() {

  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, country, industry, data]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/kyc`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const json = await res.json();
      setData(json);
      setFiltered(json);

    } catch (err) {
      console.error("Failed to load KYC");
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

    const headers = [
      "Company",
      "Email",
      "Country",
      "Industry",
      "Date"
    ];

    const rows = filtered.map(item => [
      item.company_name,
      item.primary_email,
      item.country_hq,
      item.primary_industry,
      new Date(item.createdAt).toLocaleDateString()
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

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>

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
            {filtered.map(item => (
              <tr key={item._id}>
                <td>{item.company_name}</td>
                <td>{item.primary_email}</td>
                <td>{item.country_hq}</td>
                <td>{item.primary_industry}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}