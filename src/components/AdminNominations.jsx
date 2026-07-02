import { useEffect, useState } from "react";

const API = "https://techfest-canada-backend.onrender.com/api";

const STATUSES = [
  { key: "all", label: "All", color: "#7a3fd1" },
  { key: "pending", label: "Pending", color: "#f5a623" },
  { key: "shortlisted", label: "Shortlisted", color: "#56b3f5" },
  { key: "winner", label: "Winner", color: "#3fd19c" },
  { key: "rejected", label: "Rejected", color: "#e05555" },
];

const SPECIAL_LABELS = {
  lifetime: "Lifetime Achievement",
  rising: "Rising Innovator",
  crossborder: "Cross-Border Impact",
};

export default function AdminNominations() {
  const [isDark, setIsDark] = useState(true);
  const [nominations, setNominations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const check = () => setIsDark(document.body.classList.contains("dark-mode"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => { loadNominations(); }, [filter]);

  const loadNominations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = filter === "all"
        ? `${API}/admin/nominations`
        : `${API}/admin/nominations?status=${filter}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setNominations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/admin/nominations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      loadNominations();
      if (selectedId === id) {
        const updated = await (await fetch(`${API}/admin/nominations/${id}`, { headers: { Authorization: `Bearer ${token}` } })).json();
        // Refresh notes if the row is open
        setNotes(updated.adminNotes || "");
      }
    } catch (err) { console.error("Status update failed:", err); }
  };

  const saveNotes = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/admin/nominations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ adminNotes: notes }),
      });
      loadNominations();
    } catch (err) { console.error("Notes save failed:", err); }
  };

  const deleteNomination = async (id) => {
    if (!window.confirm("Delete this nomination? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/admin/nominations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedId(null);
      loadNominations();
    } catch (err) { console.error("Delete failed:", err); }
  };

  const exportCSV = () => {
    const headers = [
      "Submitted", "Status", "Category", "Nominee", "Nominee Org", "Nominee Email",
      "Nominator", "Nominator Org", "Nominator Email", "Relationship",
      "Location", "Website", "LinkedIn", "Overview", "Impact", "Achievements",
    ];
    const rows = nominations.map((n) => {
      const cat = n.categoryType === "matrix"
        ? `${n.pillar} × ${n.sector}`
        : SPECIAL_LABELS[n.specialAward] || "Special Recognition";
      return [
        new Date(n.submittedAt || n.createdAt).toISOString(),
        n.status,
        cat,
        n.nomineeName,
        n.nomineeOrganisation,
        n.nomineeEmail,
        n.nominatorName,
        n.nominatorOrganisation,
        n.nominatorEmail,
        n.nominatorRelationship,
        n.nomineeLocation,
        n.nomineeWebsite || "",
        n.nomineeLinkedIn || "",
        (n.statementOverview || "").replace(/\n/g, " "),
        (n.statementImpact || "").replace(/\n/g, " "),
        (n.statementAchievements || "").replace(/\n/g, " "),
      ];
    });

    const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `catalyst-nominations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selected = nominations.find((n) => n._id === selectedId);
  useEffect(() => {
    if (selected) setNotes(selected.adminNotes || "");
  }, [selectedId]);

  // Counts per status for the filter tabs
  const counts = STATUSES.reduce((acc, s) => {
    acc[s.key] = s.key === "all" ? nominations.length : nominations.filter((n) => n.status === s.key).length;
    return acc;
  }, {});

  // Theme
  const t = {
    text: isDark ? "#ffffff" : "#0d0520",
    muted: isDark ? "rgba(255,255,255,0.55)" : "rgba(13,5,32,0.55)",
    dim: isDark ? "rgba(255,255,255,0.35)" : "rgba(13,5,32,0.35)",
    panel: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
    border: isDark ? "rgba(255,255,255,0.10)" : "rgba(122,63,209,0.14)",
    row: isDark ? "rgba(255,255,255,0.02)" : "rgba(122,63,209,0.02)",
    rowHover: isDark ? "rgba(122,63,209,0.10)" : "rgba(122,63,209,0.05)",
  };

  return (
    <div className="admin-card">

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
        <div>
          <h2 className={isDark ? "text-white" : "text-gray-900"} style={{ margin: 0 }}>Catalyst Nominations</h2>
          <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: t.muted }}>
            {counts.all} total submissions · {counts.pending} pending review
          </p>
        </div>
        <button onClick={exportCSV}
          style={{
            padding: "10px 20px", borderRadius: 10,
            border: "1px solid " + t.border, background: "transparent",
            color: t.text, fontWeight: 700, fontSize: "0.78rem",
            letterSpacing: "0.3px", cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </button>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: "flex", gap: 6, marginTop: 20, flexWrap: "wrap" }}>
        {STATUSES.map((s) => {
          const active = filter === s.key;
          return (
            <button key={s.key} onClick={() => { setFilter(s.key); setSelectedId(null); }}
              style={{
                padding: "9px 16px", borderRadius: 999,
                border: "1px solid " + (active ? s.color : t.border),
                background: active ? s.color + "22" : "transparent",
                color: active ? s.color : t.muted,
                fontWeight: 700, fontSize: "0.72rem",
                letterSpacing: "0.4px", textTransform: "uppercase",
                cursor: "pointer", transition: "all 0.15s",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}>
              {s.label}
              <span style={{
                padding: "1px 8px", borderRadius: 999,
                background: active ? s.color + "44" : t.border,
                fontSize: "0.68rem", fontWeight: 800, minWidth: 20, textAlign: "center",
              }}>{counts[s.key] || 0}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="table-wrapper" style={{ marginTop: 20 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Nominee</th>
              <th>Category</th>
              <th>Nominator</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: t.muted }}>Loading nominations…</td></tr>
            )}
            {!loading && nominations.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: t.muted }}>No nominations yet.</td></tr>
            )}
            {!loading && nominations.map((n) => {
              const cat = n.categoryType === "matrix"
                ? `${n.pillar} × ${n.sector}`
                : SPECIAL_LABELS[n.specialAward] || "Special Recognition";
              const statusMeta = STATUSES.find((s) => s.key === n.status) || STATUSES[1];
              const isOpen = selectedId === n._id;

              return (
                <tr key={n._id} style={{ background: isOpen ? t.rowHover : "transparent" }}>
                  <td className={isDark ? "text-white" : "text-gray-900"} style={{ fontSize: "0.82rem", whiteSpace: "nowrap" }}>
                    {new Date(n.submittedAt || n.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className={isDark ? "text-white" : "text-gray-900"}>
                    <div style={{ fontWeight: 700 }}>{n.nomineeName}</div>
                    <div style={{ fontSize: "0.76rem", color: t.muted }}>{n.nomineeOrganisation}</div>
                  </td>
                  <td className={isDark ? "text-white" : "text-gray-900"} style={{ fontSize: "0.82rem", maxWidth: 200 }}>{cat}</td>
                  <td className={isDark ? "text-white" : "text-gray-900"}>
                    <div style={{ fontSize: "0.82rem" }}>{n.nominatorName}</div>
                    <div style={{ fontSize: "0.72rem", color: t.muted }}>{n.selfNomination ? "(Self)" : n.nominatorRelationship}</div>
                  </td>
                  <td>
                    <span style={{
                      padding: "3px 10px", borderRadius: 999,
                      background: statusMeta.color + "22", color: statusMeta.color,
                      fontWeight: 800, fontSize: "0.66rem",
                      letterSpacing: "0.5px", textTransform: "uppercase",
                    }}>{statusMeta.label}</span>
                  </td>
                  <td>
                    <button onClick={() => setSelectedId(isOpen ? null : n._id)}
                      style={{
                        padding: "6px 14px", borderRadius: 8,
                        border: "1px solid " + t.border, background: "transparent",
                        color: t.text, fontWeight: 700, fontSize: "0.7rem",
                        cursor: "pointer",
                      }}>
                      {isOpen ? "Close" : "View"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{
          marginTop: 24, padding: 24, borderRadius: 14,
          background: isDark ? "rgba(122,63,209,0.06)" : "rgba(122,63,209,0.03)",
          border: "1px solid " + t.border,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
            <div>
              <p style={{ margin: 0, fontSize: "0.68rem", letterSpacing: "1.5px", textTransform: "uppercase", color: t.dim, fontWeight: 700 }}>
                {selected.categoryType === "matrix"
                  ? "Pillar × Sector"
                  : "Special Recognition"}
              </p>
              <h3 className={isDark ? "text-white" : "text-gray-900"} style={{ margin: "6px 0 2px", fontSize: "1.1rem" }}>
                {selected.categoryType === "matrix"
                  ? `The Catalyst Award for ${selected.pillar} in ${selected.sector}`
                  : SPECIAL_LABELS[selected.specialAward] || "Special Recognition"}
              </h3>
              <p style={{ margin: 0, fontSize: "0.8rem", color: t.muted }}>
                Submitted {new Date(selected.submittedAt || selected.createdAt).toLocaleString("en-CA", { dateStyle: "full", timeStyle: "short" })}
              </p>
            </div>

            {/* Status change buttons */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {STATUSES.filter((s) => s.key !== "all").map((s) => {
                const active = selected.status === s.key;
                return (
                  <button key={s.key} onClick={() => updateStatus(selected._id, s.key)}
                    style={{
                      padding: "7px 14px", borderRadius: 8,
                      border: "1px solid " + (active ? s.color : t.border),
                      background: active ? s.color : "transparent",
                      color: active ? "#fff" : t.text,
                      fontWeight: 700, fontSize: "0.66rem",
                      letterSpacing: "0.4px", textTransform: "uppercase",
                      cursor: "pointer",
                    }}>
                    Mark {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nominee + Nominator side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            <DetailBlock title="Nominee" isDark={isDark} t={t}>
              <DetailRow label="Name" value={selected.nomineeName} isDark={isDark} t={t} />
              {selected.nomineeTitle && <DetailRow label="Title" value={selected.nomineeTitle} isDark={isDark} t={t} />}
              <DetailRow label="Organisation" value={selected.nomineeOrganisation} isDark={isDark} t={t} />
              <DetailRow label="Type" value={selected.nomineeType} isDark={isDark} t={t} />
              <DetailRow label="Location" value={selected.nomineeLocation} isDark={isDark} t={t} />
              {selected.nomineeSector && <DetailRow label="Sector" value={selected.nomineeSector} isDark={isDark} t={t} />}
              <DetailRow label="Email" value={<a href={`mailto:${selected.nomineeEmail}`} style={{ color: "#f5a623" }}>{selected.nomineeEmail}</a>} isDark={isDark} t={t} />
              {selected.nomineePhone && <DetailRow label="Phone" value={selected.nomineePhone} isDark={isDark} t={t} />}
              {selected.nomineeWebsite && <DetailRow label="Website" value={<a href={selected.nomineeWebsite} target="_blank" rel="noopener noreferrer" style={{ color: "#f5a623" }}>{selected.nomineeWebsite}</a>} isDark={isDark} t={t} />}
              {selected.nomineeLinkedIn && <DetailRow label="LinkedIn" value={<a href={selected.nomineeLinkedIn} target="_blank" rel="noopener noreferrer" style={{ color: "#f5a623" }}>{selected.nomineeLinkedIn}</a>} isDark={isDark} t={t} />}
            </DetailBlock>

            <DetailBlock title={selected.selfNomination ? "Nominator (Self-nomination)" : "Nominator"} isDark={isDark} t={t}>
              <DetailRow label="Name" value={selected.nominatorName} isDark={isDark} t={t} />
              {selected.nominatorTitle && <DetailRow label="Title" value={selected.nominatorTitle} isDark={isDark} t={t} />}
              <DetailRow label="Organisation" value={selected.nominatorOrganisation} isDark={isDark} t={t} />
              <DetailRow label="Relationship" value={selected.nominatorRelationship} isDark={isDark} t={t} />
              <DetailRow label="Email" value={<a href={`mailto:${selected.nominatorEmail}`} style={{ color: "#f5a623" }}>{selected.nominatorEmail}</a>} isDark={isDark} t={t} />
              {selected.nominatorPhone && <DetailRow label="Phone" value={selected.nominatorPhone} isDark={isDark} t={t} />}
              <DetailRow label="Signed as" value={selected.signatureName} isDark={isDark} t={t} />
            </DetailBlock>
          </div>

          {/* Statement */}
          <DetailBlock title="Nomination Statement" isDark={isDark} t={t}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#7a3fd1", margin: "0 0 6px" }}>Overview</p>
              <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.6, color: t.text, whiteSpace: "pre-wrap" }}>{selected.statementOverview}</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#7a3fd1", margin: "0 0 6px" }}>Innovation & Impact</p>
              <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.6, color: t.text, whiteSpace: "pre-wrap" }}>{selected.statementImpact}</p>
            </div>
            <div style={{ marginBottom: selected.statementEvidence ? 16 : 0 }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#7a3fd1", margin: "0 0 6px" }}>Key Achievements</p>
              <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.6, color: t.text, whiteSpace: "pre-wrap" }}>{selected.statementAchievements}</p>
            </div>
            {selected.statementEvidence && (
              <div>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#7a3fd1", margin: "0 0 6px" }}>Supporting Evidence</p>
                <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.6, color: t.text, whiteSpace: "pre-wrap" }}>{selected.statementEvidence}</p>
              </div>
            )}
          </DetailBlock>

          {/* Admin notes */}
          <div style={{ marginTop: 20 }}>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: t.muted, marginBottom: 8 }}>Jury / Admin Notes (private)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal notes for the jury and admin team…"
              style={{
                width: "100%", minHeight: 100, padding: "12px 14px",
                borderRadius: 10, border: "1px solid " + t.border,
                background: t.panel, color: t.text,
                fontFamily: "inherit", fontSize: "0.88rem", lineHeight: 1.5,
                outline: "none", resize: "vertical", boxSizing: "border-box",
              }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <button onClick={() => deleteNomination(selected._id)}
                style={{
                  padding: "8px 16px", borderRadius: 8,
                  border: "1px solid rgba(224,85,85,0.4)",
                  background: "transparent", color: "#e05555",
                  fontWeight: 700, fontSize: "0.7rem",
                  letterSpacing: "0.4px", cursor: "pointer",
                }}>Delete Nomination</button>
              <button onClick={() => saveNotes(selected._id)}
                style={{
                  padding: "9px 22px", borderRadius: 8, border: "none",
                  background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
                  color: "#fff", fontWeight: 800, fontSize: "0.7rem",
                  letterSpacing: "0.4px", cursor: "pointer",
                }}>Save Notes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Small presentational sub-components ─── */
function DetailBlock({ title, children, isDark, t }) {
  return (
    <div style={{
      background: t.panel, border: "1px solid " + t.border,
      borderRadius: 12, padding: 18,
    }}>
      <p style={{ margin: "0 0 12px", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "#f5a623" }}>{title}</p>
      {children}
    </div>
  );
}

function DetailRow({ label, value, isDark, t }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "5px 0", fontSize: "0.85rem" }}>
      <span style={{ width: 100, color: t.muted, flexShrink: 0 }}>{label}</span>
      <span style={{ color: t.text, wordBreak: "break-word", overflow: "hidden" }}>{value}</span>
    </div>
  );
}
