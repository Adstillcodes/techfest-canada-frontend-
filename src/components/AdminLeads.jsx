import { useState, useMemo, useEffect } from "react";

/* =========================================================
   🎯 ADMIN LEADS — UI ONLY (no backend, no sample data)
   Plug your API into:
     - fetchLeads()      → load leads
     - createLead(payload)
     - updateLead(id, payload)
     - deleteLead(id)
========================================================= */

// ---- Config (edit freely) ----------------------------------
const STATUS_OPTIONS = [
  { value: "new",         label: "New",            color: "#3b82f6" },
  { value: "contacted",   label: "Contacted",      color: "#8b5cf6" },
  { value: "qualified",   label: "Qualified",      color: "#10b981" },
  { value: "proposal",    label: "Proposal Sent",  color: "#f59e0b" },
  { value: "negotiation", label: "Negotiation",    color: "#f97316" },
  { value: "won",         label: "Closed Won",     color: "#22c55e" },
  { value: "lost",        label: "Closed Lost",    color: "#ef4444" },
  { value: "nurture",     label: "Nurturing",      color: "#64748b" },
];

const CONTACT_METHODS = [
  "Email",
  "Phone Call",
  "LinkedIn",
  "Cold Outreach",
  "Referral",
  "Event / In-Person",
  "Inbound Form",
  "Other",
];

const DEAL_CATEGORIES = [
  "Sponsorship",
  "Booth",
  "Tickets",
  "Speaking Slot",
  "Workshop",
  "Branding",
  "Media",
  "Partnership",
];

// ---- Utilities ---------------------------------------------
const initialsOf = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || "")
    .join("") || "?";

const fmtMoney = (n) => {
  if (n === null || n === undefined || n === "") return "—";
  const num = Number(n);
  if (Number.isNaN(num)) return "—";
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
};

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const isOverdue = (d) => {
  if (!d) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(d) < today;
};

const scoreColor = (s) => {
  const n = Number(s) || 0;
  if (n >= 80) return "#22c55e";  // hot
  if (n >= 60) return "#10b981";  // warm
  if (n >= 40) return "#f59e0b";  // lukewarm
  return "#94a3b8";               // cold
};

const scoreLabel = (s) => {
  const n = Number(s) || 0;
  if (n >= 80) return "Hot";
  if (n >= 60) return "Warm";
  if (n >= 40) return "Lukewarm";
  return "Cold";
};

const statusMeta = (v) =>
  STATUS_OPTIONS.find((s) => s.value === v) || STATUS_OPTIONS[0];

// ---- Empty form template -----------------------------------
const blankLead = () => ({
  id: null,
  leadName: "",
  companyName: "",
  score: 50,
  email: "",
  phone: "",
  linkedin: "",
  notes: "",
  followUpDate: "",
  followUpNotes: "",
  contactMethod: CONTACT_METHODS[0],
  dealSize: "",
  dealCategories: [],
  status: "new",
  relatedLeadId: "",
  leadContact: "",
});

/* =========================================================
   MAIN COMPONENT
========================================================= */
export default function AdminLeads() {
  // ---- State ----
  const [leads, setLeads] = useState([]);          // ← plug API here
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all"); // all | hot | warm | cold
  const [followUpFilter, setFollowUpFilter] = useState("all"); // all | overdue | upcoming
  const [sortBy, setSortBy] = useState({ field: "score", direction: "desc" });

  const [drawerLead, setDrawerLead] = useState(null);     // lead being viewed
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState(blankLead());
  const [formMode, setFormMode] = useState("create");     // "create" | "edit"
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  /* ===========================================================
     🔌 BACKEND HOOKS — replace these with your real API calls
  =========================================================== */
  const fetchLeads = async () => {
    setLoading(true);
    try {
      // const token = localStorage.getItem("token");
      // const res = await fetch(`${API}/leads`, { headers: { Authorization: `Bearer ${token}` }});
      // const data = await res.json();
      // setLeads(data);
    } catch (err) {
      console.error("fetchLeads failed", err);
    } finally {
      setLoading(false);
    }
  };

  const createLead = async (payload) => {
    // const res = await fetch(`${API}/leads`, { method: "POST", body: JSON.stringify(payload), ... });
    // const data = await res.json();
    // setLeads(prev => [data, ...prev]);
    // --- temporary local-only behavior so the UI works without backend:
    const newLead = { ...payload, id: `local-${Date.now()}` };
    setLeads((prev) => [newLead, ...prev]);
    return newLead;
  };

  const updateLead = async (id, payload) => {
    // const res = await fetch(`${API}/leads/${id}`, { method: "PATCH", body: JSON.stringify(payload), ... });
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...payload } : l)));
  };

  const deleteLead = async (id) => {
    // await fetch(`${API}/leads/${id}`, { method: "DELETE", ... });
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ===========================================================
     Derived data: filtering + sorting
  =========================================================== */
  const filteredLeads = useMemo(() => {
    let out = [...leads];

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (l) =>
          (l.leadName || "").toLowerCase().includes(q) ||
          (l.companyName || "").toLowerCase().includes(q) ||
          (l.email || "").toLowerCase().includes(q) ||
          (l.leadContact || "").toLowerCase().includes(q)
      );
    }

    // status filter
    if (statusFilter !== "all") {
      out = out.filter((l) => l.status === statusFilter);
    }

    // score filter
    if (scoreFilter !== "all") {
      out = out.filter((l) => {
        const s = Number(l.score) || 0;
        if (scoreFilter === "hot") return s >= 80;
        if (scoreFilter === "warm") return s >= 60 && s < 80;
        if (scoreFilter === "cold") return s < 60;
        return true;
      });
    }

    // follow-up filter
    if (followUpFilter !== "all") {
      out = out.filter((l) => {
        if (!l.followUpDate) return false;
        const overdue = isOverdue(l.followUpDate);
        if (followUpFilter === "overdue") return overdue;
        if (followUpFilter === "upcoming") return !overdue;
        return true;
      });
    }

    // sort
    out.sort((a, b) => {
      const { field, direction } = sortBy;
      let av = a[field];
      let bv = b[field];
      if (field === "dealSize" || field === "score") {
        av = Number(av) || 0;
        bv = Number(bv) || 0;
      }
      if (field === "followUpDate") {
        av = av ? new Date(av).getTime() : 0;
        bv = bv ? new Date(bv).getTime() : 0;
      }
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return direction === "asc" ? -1 : 1;
      if (av > bv) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return out;
  }, [leads, search, statusFilter, scoreFilter, followUpFilter, sortBy]);

  /* ===========================================================
     Stats cards
  =========================================================== */
  const stats = useMemo(() => {
    const total = leads.length;
    const hot = leads.filter((l) => (Number(l.score) || 0) >= 80).length;
    const overdue = leads.filter((l) => isOverdue(l.followUpDate)).length;
    const pipeline = leads
      .filter((l) => !["won", "lost"].includes(l.status))
      .reduce((sum, l) => sum + (Number(l.dealSize) || 0), 0);
    return { total, hot, overdue, pipeline };
  }, [leads]);

  /* ===========================================================
     Handlers
  =========================================================== */
  const openCreate = () => {
    setFormMode("create");
    setFormData(blankLead());
    setShowFormModal(true);
  };

  const openEdit = (lead) => {
    setFormMode("edit");
    setFormData({ ...blankLead(), ...lead });
    setShowFormModal(true);
    setDrawerLead(null);
  };

  const handleFormChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleDealCategory = (cat) =>
    setFormData((prev) => ({
      ...prev,
      dealCategories: prev.dealCategories.includes(cat)
        ? prev.dealCategories.filter((c) => c !== cat)
        : [...prev.dealCategories, cat],
    }));

  const handleSave = async () => {
    if (!formData.leadName.trim()) {
      alert("Lead name is required");
      return;
    }
    if (formMode === "create") {
      await createLead(formData);
    } else {
      await updateLead(formData.id, formData);
    }
    setShowFormModal(false);
  };

  const handleDelete = async (id) => {
    await deleteLead(id);
    setConfirmDeleteId(null);
    setDrawerLead(null);
  };

  const toggleSort = (field) => {
    setSortBy((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { field, direction: "desc" }
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <div className="leads-root">
      <LeadsStyles />

      {/* HEADER */}
      <div className="leads-header">
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Leads</h2>
          <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: 14 }}>
            Manage your sales pipeline and follow-ups
          </p>
        </div>
        <button className="leads-btn-primary" onClick={openCreate}>
          + New Lead
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="leads-stats">
        <StatCard label="Total Leads" value={stats.total} accent="#3b82f6" />
        <StatCard label="Hot Leads" value={stats.hot} accent="#22c55e" sub="Score ≥ 80" />
        <StatCard
          label="Follow-ups Overdue"
          value={stats.overdue}
          accent="#ef4444"
        />
        <StatCard
          label="Open Pipeline"
          value={fmtMoney(stats.pipeline)}
          accent="#f59e0b"
          isText
        />
      </div>

      {/* TOOLBAR */}
      <div className="leads-toolbar">
        <div className="leads-search">
          <span className="leads-search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search by name, company, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="leads-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <select
          className="leads-select"
          value={scoreFilter}
          onChange={(e) => setScoreFilter(e.target.value)}
        >
          <option value="all">All scores</option>
          <option value="hot">🔥 Hot (80+)</option>
          <option value="warm">Warm (60–79)</option>
          <option value="cold">Cold (&lt;60)</option>
        </select>

        <select
          className="leads-select"
          value={followUpFilter}
          onChange={(e) => setFollowUpFilter(e.target.value)}
        >
          <option value="all">All follow-ups</option>
          <option value="overdue">Overdue</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="leads-table-wrap">
        {loading ? (
          <EmptyState
            icon="⏳"
            title="Loading leads…"
            text="Hang tight — pulling from the backend."
          />
        ) : filteredLeads.length === 0 ? (
          leads.length === 0 ? (
            <EmptyState
              icon="📭"
              title="No leads yet"
              text="Once your backend syncs leads, they'll appear here. You can also add one manually."
              cta={{ label: "+ Add your first lead", onClick: openCreate }}
            />
          ) : (
            <EmptyState
              icon="🔍"
              title="No matches"
              text="Try clearing a filter or tweaking your search."
            />
          )
        ) : (
          <table className="leads-table">
            <thead>
              <tr>
                <SortableTh field="leadName" sortBy={sortBy} onSort={toggleSort}>
                  Lead
                </SortableTh>
                <th>Contact</th>
                <SortableTh field="score" sortBy={sortBy} onSort={toggleSort}>
                  Score
                </SortableTh>
                <SortableTh field="status" sortBy={sortBy} onSort={toggleSort}>
                  Status
                </SortableTh>
                <SortableTh field="dealSize" sortBy={sortBy} onSort={toggleSort}>
                  Deal Size
                </SortableTh>
                <SortableTh field="followUpDate" sortBy={sortBy} onSort={toggleSort}>
                  Follow-up
                </SortableTh>
                <th>Method</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => {
                const sm = statusMeta(lead.status);
                const overdue = isOverdue(lead.followUpDate);
                return (
                  <tr
                    key={lead.id}
                    className="leads-row"
                    onClick={() => setDrawerLead(lead)}
                  >
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          className="leads-avatar"
                          style={{ background: scoreColor(lead.score) }}
                        >
                          {initialsOf(lead.leadName)}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, color: "#f8fafc" }}>
                            {lead.leadName || "(unnamed)"}
                          </div>
                          <div style={{ fontSize: 12, color: "#94a3b8" }}>
                            {lead.companyName || "—"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {lead.email && (
                          <span style={{ fontSize: 13, color: "#cbd5e1" }}>
                            ✉ {lead.email}
                          </span>
                        )}
                        {lead.phone && (
                          <span style={{ fontSize: 13, color: "#cbd5e1" }}>
                            ☎ {lead.phone}
                          </span>
                        )}
                        {!lead.email && !lead.phone && (
                          <span style={{ fontSize: 13, color: "#64748b" }}>—</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <ScorePill score={lead.score} />
                    </td>

                    <td>
                      <StatusBadge status={lead.status} />
                    </td>

                    <td style={{ fontWeight: 600, color: "#e2e8f0" }}>
                      {fmtMoney(lead.dealSize)}
                    </td>

                    <td>
                      <span
                        style={{
                          color: overdue ? "#fca5a5" : "#cbd5e1",
                          fontWeight: overdue ? 700 : 500,
                          fontSize: 13,
                        }}
                      >
                        {fmtDate(lead.followUpDate)}
                        {overdue && (
                          <span style={{ marginLeft: 6, fontSize: 11 }}>⚠</span>
                        )}
                      </span>
                    </td>

                    <td style={{ fontSize: 13, color: "#cbd5e1" }}>
                      {lead.contactMethod || "—"}
                    </td>

                    <td onClick={(e) => e.stopPropagation()} style={{ textAlign: "right" }}>
                      <button
                        className="leads-icon-btn"
                        title="Edit"
                        onClick={() => openEdit(lead)}
                      >
                        ✎
                      </button>
                      <button
                        className="leads-icon-btn leads-icon-btn-danger"
                        title="Delete"
                        onClick={() => setConfirmDeleteId(lead.id)}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* DETAIL DRAWER */}
      {drawerLead && (
        <LeadDrawer
          lead={drawerLead}
          allLeads={leads}
          onClose={() => setDrawerLead(null)}
          onEdit={() => openEdit(drawerLead)}
          onDelete={() => setConfirmDeleteId(drawerLead.id)}
          onStatusChange={(newStatus) => {
            updateLead(drawerLead.id, { status: newStatus });
            setDrawerLead({ ...drawerLead, status: newStatus });
          }}
        />
      )}

      {/* CREATE / EDIT MODAL */}
      {showFormModal && (
        <LeadFormModal
          mode={formMode}
          data={formData}
          allLeads={leads}
          onChange={handleFormChange}
          onToggleCategory={toggleDealCategory}
          onSave={handleSave}
          onClose={() => setShowFormModal(false)}
        />
      )}

      {/* DELETE CONFIRM */}
      {confirmDeleteId && (
        <ConfirmModal
          title="Delete this lead?"
          message="This can't be undone. The lead will be removed permanently."
          onConfirm={() => handleDelete(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}

/* =========================================================
   SUB-COMPONENTS
========================================================= */

function StatCard({ label, value, accent, sub, isText }) {
  return (
    <div className="leads-stat-card">
      <div className="leads-stat-bar" style={{ background: accent }} />
      <div style={{ padding: "16px 18px" }}>
        <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {label}
        </div>
        <div style={{ fontSize: isText ? 22 : 28, fontWeight: 800, color: "#f8fafc", marginTop: 6 }}>
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{sub}</div>
        )}
      </div>
    </div>
  );
}

function SortableTh({ field, sortBy, onSort, children }) {
  const active = sortBy.field === field;
  return (
    <th
      onClick={() => onSort(field)}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        {children}
        <span style={{ fontSize: 10, opacity: active ? 1 : 0.3 }}>
          {active ? (sortBy.direction === "asc" ? "▲" : "▼") : "▼"}
        </span>
      </span>
    </th>
  );
}

function ScorePill({ score }) {
  const c = scoreColor(score);
  const n = Number(score) || 0;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: `${c}22`,
          border: `2px solid ${c}`,
          color: c,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: 13,
        }}
      >
        {n}
      </div>
      <span style={{ fontSize: 11, color: c, fontWeight: 700 }}>
        {scoreLabel(n)}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  const sm = statusMeta(status);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 999,
        background: `${sm.color}22`,
        color: sm.color,
        fontSize: 12,
        fontWeight: 700,
        border: `1px solid ${sm.color}55`,
      }}
    >
      {sm.label}
    </span>
  );
}

function EmptyState({ icon, title, text, cta }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: 14, marginBottom: cta ? 18 : 0, maxWidth: 380, margin: "0 auto" }}>
        {text}
      </div>
      {cta && (
        <button
          className="leads-btn-primary"
          style={{ marginTop: 18 }}
          onClick={cta.onClick}
        >
          {cta.label}
        </button>
      )}
    </div>
  );
}

/* =========================================================
   DRAWER (Lead detail / quick view)
========================================================= */
function LeadDrawer({ lead, allLeads, onClose, onEdit, onDelete, onStatusChange }) {
  const sm = statusMeta(lead.status);
  const related = allLeads.find((l) => l.id === lead.relatedLeadId);

  return (
    <>
      <div className="leads-drawer-backdrop" onClick={onClose} />
      <aside className="leads-drawer">
        {/* header */}
        <div className="leads-drawer-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              className="leads-avatar"
              style={{
                width: 52, height: 52, fontSize: 18,
                background: scoreColor(lead.score),
              }}
            >
              {initialsOf(lead.leadName)}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#f8fafc" }}>
                {lead.leadName || "(unnamed)"}
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>
                {lead.companyName || "—"}
              </div>
            </div>
          </div>
          <button className="leads-icon-btn" onClick={onClose} title="Close">✕</button>
        </div>

        {/* quick stats row */}
        <div style={{ display: "flex", gap: 10, padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <ScorePill score={lead.score} />
          <StatusBadge status={lead.status} />
        </div>

        {/* status quick-change */}
        <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
            Quick status update
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => onStatusChange(s.value)}
                className="leads-status-chip"
                style={{
                  background: lead.status === s.value ? `${s.color}33` : "transparent",
                  borderColor: lead.status === s.value ? s.color : "rgba(255,255,255,0.12)",
                  color: lead.status === s.value ? s.color : "#cbd5e1",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* details */}
        <div className="leads-drawer-body">
          <Field label="Email" value={lead.email} />
          <Field label="Phone" value={lead.phone} />
          <Field label="LinkedIn" value={lead.linkedin} />
          <Field label="Lead Contact (rep)" value={lead.leadContact} />
          <Field label="Method of Contact" value={lead.contactMethod} />
          <Field label="Deal Size" value={fmtMoney(lead.dealSize)} />
          <Field
            label="Deal Categories"
            value={
              lead.dealCategories?.length ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {lead.dealCategories.map((c) => (
                    <span key={c} className="leads-pill">{c}</span>
                  ))}
                </div>
              ) : "—"
            }
          />
          <Field label="Follow-up Date" value={fmtDate(lead.followUpDate)} />
          <Field label="Follow-up Notes" value={lead.followUpNotes} multiline />
          <Field label="Lead Notes" value={lead.notes} multiline />
          <Field
            label="Related Lead"
            value={related ? `${related.leadName} (${related.companyName || "—"})` : "—"}
          />
        </div>

        {/* actions */}
        <div className="leads-drawer-footer">
          <button className="leads-btn-secondary" onClick={onDelete}>Delete</button>
          <button className="leads-btn-primary" onClick={onEdit}>Edit Lead</button>
        </div>
      </aside>
    </>
  );
}

function Field({ label, value, multiline }) {
  const isEmpty = !value || value === "—";
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 4, letterSpacing: 0.5 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          color: isEmpty ? "#64748b" : "#e2e8f0",
          whiteSpace: multiline ? "pre-wrap" : "normal",
          lineHeight: 1.5,
        }}
      >
        {value || "—"}
      </div>
    </div>
  );
}

/* =========================================================
   FORM MODAL (Create / Edit)
========================================================= */
function LeadFormModal({ mode, data, allLeads, onChange, onToggleCategory, onSave, onClose }) {
  return (
    <>
      <div className="leads-drawer-backdrop" onClick={onClose} />
      <div className="leads-modal">
        <div className="leads-modal-header">
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#f8fafc" }}>
              {mode === "create" ? "New Lead" : "Edit Lead"}
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>
              {mode === "create"
                ? "Add a lead manually. Required fields are marked *"
                : "Update lead information."}
            </div>
          </div>
          <button className="leads-icon-btn" onClick={onClose}>✕</button>
        </div>

        <div className="leads-modal-body">
          {/* SECTION: identity */}
          <FormSection title="Identity">
            <FormRow>
              <FormInput
                label="Lead Name *"
                value={data.leadName}
                onChange={(v) => onChange("leadName", v)}
                placeholder="Jane Doe"
              />
              <FormInput
                label="Company Name"
                value={data.companyName}
                onChange={(v) => onChange("companyName", v)}
                placeholder="Acme Corp"
              />
            </FormRow>

            <FormRow>
              <FormInput
                label="Lead Contact (your rep)"
                value={data.leadContact}
                onChange={(v) => onChange("leadContact", v)}
                placeholder="e.g. Sales rep handling this lead"
              />
              <FormInput
                label="Lead Score (0–100)"
                type="number"
                min={0}
                max={100}
                value={data.score}
                onChange={(v) => onChange("score", v)}
              />
            </FormRow>
          </FormSection>

          {/* SECTION: contact */}
          <FormSection title="Contact Details">
            <FormRow>
              <FormInput
                label="Email"
                type="email"
                value={data.email}
                onChange={(v) => onChange("email", v)}
                placeholder="jane@acme.com"
              />
              <FormInput
                label="Phone"
                value={data.phone}
                onChange={(v) => onChange("phone", v)}
                placeholder="+1 555 123 4567"
              />
            </FormRow>

            <FormInput
              label="LinkedIn"
              value={data.linkedin}
              onChange={(v) => onChange("linkedin", v)}
              placeholder="https://linkedin.com/in/..."
            />

            <FormSelect
              label="Method of Contact"
              value={data.contactMethod}
              onChange={(v) => onChange("contactMethod", v)}
              options={CONTACT_METHODS.map((m) => ({ value: m, label: m }))}
            />
          </FormSection>

          {/* SECTION: deal */}
          <FormSection title="Deal">
            <FormRow>
              <FormInput
                label="Deal Size (USD)"
                type="number"
                min={0}
                value={data.dealSize}
                onChange={(v) => onChange("dealSize", v)}
                placeholder="5000"
              />
              <FormSelect
                label="Status"
                value={data.status}
                onChange={(v) => onChange("status", v)}
                options={STATUS_OPTIONS}
              />
            </FormRow>

            <div>
              <FormLabel>Deal Categories (multi-select)</FormLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                {DEAL_CATEGORIES.map((c) => {
                  const selected = data.dealCategories.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => onToggleCategory(c)}
                      className="leads-status-chip"
                      style={{
                        background: selected ? "rgba(59,130,246,0.2)" : "transparent",
                        borderColor: selected ? "#3b82f6" : "rgba(255,255,255,0.12)",
                        color: selected ? "#60a5fa" : "#cbd5e1",
                      }}
                    >
                      {selected ? "✓ " : ""}{c}
                    </button>
                  );
                })}
              </div>
            </div>
          </FormSection>

          {/* SECTION: follow-up */}
          <FormSection title="Follow-up">
            <FormInput
              label="Follow-up Date"
              type="date"
              value={data.followUpDate}
              onChange={(v) => onChange("followUpDate", v)}
            />
            <FormTextarea
              label="Follow-up Notes"
              value={data.followUpNotes}
              onChange={(v) => onChange("followUpNotes", v)}
              placeholder="Reminders, what to bring up next..."
            />
          </FormSection>

          {/* SECTION: notes + relations */}
          <FormSection title="Notes & Relations">
            <FormTextarea
              label="Lead Notes"
              value={data.notes}
              onChange={(v) => onChange("notes", v)}
              placeholder="Background, pain points, conversation history..."
              rows={5}
            />
            <FormSelect
              label="Related Lead"
              value={data.relatedLeadId}
              onChange={(v) => onChange("relatedLeadId", v)}
              options={[
                { value: "", label: "— None —" },
                ...allLeads
                  .filter((l) => l.id !== data.id)
                  .map((l) => ({
                    value: l.id,
                    label: `${l.leadName}${l.companyName ? ` (${l.companyName})` : ""}`,
                  })),
              ]}
            />
          </FormSection>
        </div>

        <div className="leads-modal-footer">
          <button className="leads-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="leads-btn-primary" onClick={onSave}>
            {mode === "create" ? "Create Lead" : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}

function FormSection({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontSize: 11,
        fontWeight: 800,
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        marginBottom: 12,
        paddingBottom: 8,
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

function FormRow({ children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {children}
    </div>
  );
}

function FormLabel({ children }) {
  return (
    <label style={{
      fontSize: 12,
      fontWeight: 700,
      color: "#cbd5e1",
      display: "block",
      marginBottom: 4
    }}>
      {children}
    </label>
  );
}

function FormInput({ label, value, onChange, ...rest }) {
  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <input
        className="leads-form-input"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
    </div>
  );
}

function FormTextarea({ label, value, onChange, rows = 3, ...rest }) {
  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <textarea
        className="leads-form-input"
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        style={{ resize: "vertical", fontFamily: "inherit" }}
        {...rest}
      />
    </div>
  );
}

function FormSelect({ label, value, onChange, options }) {
  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <select
        className="leads-form-input"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <>
      <div className="leads-drawer-backdrop" onClick={onCancel} />
      <div
        className="leads-modal"
        style={{ width: 420, maxHeight: "auto" }}
      >
        <div style={{ padding: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#f8fafc", marginBottom: 8 }}>
            {title}
          </div>
          <div style={{ fontSize: 14, color: "#cbd5e1", marginBottom: 22 }}>
            {message}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button className="leads-btn-secondary" onClick={onCancel}>Cancel</button>
            <button
              className="leads-btn-primary"
              style={{ background: "#ef4444" }}
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   STYLES (scoped via class prefix `leads-`)
========================================================= */
function LeadsStyles() {
  return (
    <style>{`
      .leads-root {
        color: #e2e8f0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }

      .leads-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 12px;
      }

      .leads-btn-primary {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 10px;
        font-weight: 700;
        font-size: 14px;
        cursor: pointer;
        transition: transform 0.12s ease, box-shadow 0.2s ease;
        box-shadow: 0 2px 8px rgba(59,130,246,0.3);
      }
      .leads-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 14px rgba(59,130,246,0.45);
      }
      .leads-btn-primary:active { transform: translateY(0); }

      .leads-btn-secondary {
        background: transparent;
        color: #cbd5e1;
        border: 1.5px solid rgba(255,255,255,0.12);
        padding: 10px 18px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .leads-btn-secondary:hover {
        background: rgba(255,255,255,0.05);
        border-color: rgba(255,255,255,0.2);
      }

      /* STATS */
      .leads-stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 14px;
        margin-bottom: 22px;
      }
      .leads-stat-card {
        background: rgba(15,23,42,0.6);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 14px;
        overflow: hidden;
        position: relative;
        backdrop-filter: blur(8px);
      }
      .leads-stat-bar {
        height: 3px;
        width: 100%;
      }
      @media (max-width: 900px) {
        .leads-stats { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 500px) {
        .leads-stats { grid-template-columns: 1fr; }
      }

      /* TOOLBAR */
      .leads-toolbar {
        display: flex;
        gap: 10px;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }
      .leads-search {
        flex: 1;
        min-width: 240px;
        position: relative;
        display: flex;
        align-items: center;
      }
      .leads-search-icon {
        position: absolute;
        left: 14px;
        color: #64748b;
        font-size: 18px;
        pointer-events: none;
      }
      .leads-search input {
        width: 100%;
        padding: 10px 14px 10px 38px;
        background: rgba(15,23,42,0.7);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 10px;
        color: #f1f5f9;
        font-size: 14px;
        outline: none;
        transition: border-color 0.15s ease, background 0.15s ease;
      }
      .leads-search input:focus {
        border-color: #3b82f6;
        background: rgba(15,23,42,0.9);
      }
      .leads-search input::placeholder { color: #64748b; }

      .leads-select {
        padding: 10px 14px;
        background: rgba(15,23,42,0.7);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 10px;
        color: #f1f5f9;
        font-size: 14px;
        cursor: pointer;
        outline: none;
        font-weight: 500;
      }
      .leads-select:focus { border-color: #3b82f6; }

      /* TABLE */
      .leads-table-wrap {
        background: rgba(15,23,42,0.6);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 14px;
        overflow: hidden;
        backdrop-filter: blur(8px);
      }
      .leads-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
      }
      .leads-table th {
        text-align: left;
        padding: 14px 16px;
        font-size: 11px;
        font-weight: 700;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        background: rgba(0,0,0,0.2);
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }
      .leads-table td {
        padding: 14px 16px;
        border-bottom: 1px solid rgba(255,255,255,0.04);
        vertical-align: middle;
      }
      .leads-row {
        cursor: pointer;
        transition: background 0.12s ease;
      }
      .leads-row:hover { background: rgba(59,130,246,0.06); }
      .leads-row:last-child td { border-bottom: none; }

      .leads-avatar {
        width: 38px; height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 13px;
        color: #fff;
        flex-shrink: 0;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      }

      .leads-icon-btn {
        background: transparent;
        border: 1px solid rgba(255,255,255,0.08);
        color: #cbd5e1;
        width: 32px; height: 32px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        margin-left: 4px;
        transition: all 0.15s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .leads-icon-btn:hover {
        background: rgba(59,130,246,0.15);
        border-color: #3b82f6;
        color: #60a5fa;
      }
      .leads-icon-btn-danger:hover {
        background: rgba(239,68,68,0.15);
        border-color: #ef4444;
        color: #f87171;
      }

      .leads-pill {
        background: rgba(59,130,246,0.15);
        color: #60a5fa;
        padding: 3px 10px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 700;
        border: 1px solid rgba(59,130,246,0.3);
      }

      .leads-status-chip {
        background: transparent;
        border: 1px solid rgba(255,255,255,0.12);
        color: #cbd5e1;
        padding: 6px 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.12s ease;
      }
      .leads-status-chip:hover { background: rgba(255,255,255,0.06); }

      /* DRAWER */
      .leads-drawer-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.55);
        backdrop-filter: blur(4px);
        z-index: 998;
        animation: leadsFadeIn 0.2s ease;
      }
      .leads-drawer {
        position: fixed;
        top: 0; right: 0; bottom: 0;
        width: 480px;
        max-width: 100vw;
        background: #0f172a;
        border-left: 1px solid rgba(255,255,255,0.08);
        box-shadow: -8px 0 30px rgba(0,0,0,0.5);
        z-index: 999;
        display: flex;
        flex-direction: column;
        animation: leadsSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .leads-drawer-header {
        padding: 22px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .leads-drawer-body {
        padding: 22px;
        overflow-y: auto;
        flex: 1;
      }
      .leads-drawer-footer {
        padding: 16px 22px;
        border-top: 1px solid rgba(255,255,255,0.06);
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        background: rgba(0,0,0,0.2);
      }

      /* MODAL */
      .leads-modal {
        position: fixed;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 640px;
        max-width: 95vw;
        max-height: 90vh;
        background: #0f172a;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        z-index: 999;
        display: flex;
        flex-direction: column;
        animation: leadsModalIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .leads-modal-header {
        padding: 22px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .leads-modal-body {
        padding: 22px;
        overflow-y: auto;
        flex: 1;
      }
      .leads-modal-footer {
        padding: 16px 22px;
        border-top: 1px solid rgba(255,255,255,0.06);
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        background: rgba(0,0,0,0.2);
      }

      .leads-form-input {
        width: 100%;
        padding: 10px 12px;
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 8px;
        color: #f1f5f9;
        font-size: 14px;
        outline: none;
        transition: border-color 0.15s ease;
        box-sizing: border-box;
      }
      .leads-form-input:focus {
        border-color: #3b82f6;
        background: rgba(0,0,0,0.4);
      }
      .leads-form-input::placeholder { color: #64748b; }

      @keyframes leadsFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes leadsSlideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
      @keyframes leadsModalIn {
        from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }

      @media (max-width: 700px) {
        .leads-table { font-size: 12px; }
        .leads-table th, .leads-table td { padding: 10px 8px; }
      }
    `}</style>
  );
}
