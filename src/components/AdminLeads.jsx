import { useState, useMemo, useEffect, useCallback, useRef } from "react";

/* ============================================================
   🎯 ADMIN LEADS — v2
   Modern CRM-style table with:
     • Light + Dark themes (auto + toggle)
     • CSV import (file picker → preview → column mapping)
     • CSV export of filtered view
     • Lead claiming / locking (multi-user safe)
     • Real-time sync via polling
     • Bulk select + bulk actions
     • Filters: country, industry, status, score, follow-up, owner
     • Pagination
     • Activity log per lead
   ============================================================
   📡 BACKEND CONTRACT — endpoints your backend should expose:

   GET    /leads                       → list (with optional ?page=&limit=&since=)
   POST   /leads                       → create one
   PATCH  /leads/:id                   → update
   DELETE /leads/:id                   → delete
   POST   /leads/bulk-import           → { leads: [...] }, returns { imported, errors }
   POST   /leads/bulk-update           → { ids:[], updates:{} }
   POST   /leads/bulk-delete           → { ids:[] }
   POST   /leads/:id/claim             → atomic; returns 409 if already claimed
   POST   /leads/:id/release           → release current user's claim
   GET    /leads/:id/activity          → returns activity log entries
   GET    /auth/me                     → current user { id, name, email }

   Lead schema (all fields are strings/numbers, dealCategories is string[]):
     id, leadName, companyName, jobTitle, industry, country, city,
     score, email, phone, linkedin, website, notes, followUpDate,
     followUpNotes, contactMethod, dealSize, dealCategories[], status,
     relatedLeadId, leadContact, claimedBy, claimedByName, claimedAt,
     lastContactedAt, lastContactedBy, createdAt, updatedAt
   ============================================================ */

const API_BASE = "https://techfest-canada-backend.onrender.com/api";
const SYNC_INTERVAL_MS = 30000;

/* ----------------------------------------------------------
   Constants
---------------------------------------------------------- */
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
  "Email", "Phone Call", "LinkedIn", "Cold Outreach",
  "Referral", "Event / In-Person", "Inbound Form", "Other",
];

const DEAL_CATEGORIES = [
  "Sponsorship", "Booth", "Tickets", "Speaking Slot",
  "Workshop", "Branding", "Media", "Partnership",
];

const PAGE_SIZE_OPTIONS = [25, 50, 100, 200];

/* CSV column auto-mapping aliases (lowercase, trimmed) */
const CSV_FIELD_ALIASES = {
  leadName:     ["name", "full name", "lead name", "contact name", "first name", "person"],
  companyName:  ["company", "company name", "organization", "org", "account"],
  jobTitle:     ["title", "job title", "position", "role"],
  industry:     ["industry", "sector"],
  country:      ["country", "country code"],
  city:         ["city", "location"],
  email:        ["email", "email address", "e-mail", "work email"],
  phone:        ["phone", "phone number", "mobile", "cell", "telephone", "direct dial"],
  linkedin:     ["linkedin", "linkedin url", "linkedin profile"],
  website:      ["website", "url", "company url", "domain"],
  notes:        ["notes", "comments", "description"],
  score:        ["score", "lead score", "rating"],
  dealSize:     ["deal size", "amount", "value", "potential value"],
};

const ALL_LEAD_FIELDS = [
  { key: "skip",          label: "— Skip this column —" },
  { key: "leadName",      label: "Lead Name" },
  { key: "companyName",   label: "Company Name" },
  { key: "jobTitle",      label: "Job Title" },
  { key: "industry",      label: "Industry" },
  { key: "country",       label: "Country" },
  { key: "city",          label: "City" },
  { key: "email",         label: "Email" },
  { key: "phone",         label: "Phone" },
  { key: "linkedin",      label: "LinkedIn" },
  { key: "website",       label: "Website" },
  { key: "notes",         label: "Notes" },
  { key: "score",         label: "Lead Score" },
  { key: "dealSize",      label: "Deal Size" },
  { key: "leadContact",   label: "Lead Contact (Rep)" },
];

/* ----------------------------------------------------------
   Utilities
---------------------------------------------------------- */
const initialsOf = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || "").join("") || "?";

const fmtMoney = (n) => {
  if (n === null || n === undefined || n === "") return "—";
  const num = Number(n);
  if (Number.isNaN(num)) return "—";
  return num.toLocaleString("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  });
};

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  } catch { return "—"; }
};

const fmtRelative = (d) => {
  if (!d) return "never";
  const diff = (Date.now() - new Date(d).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return fmtDate(d);
};

const isOverdue = (d) => {
  if (!d) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return new Date(d) < today;
};

const scoreColor = (s) => {
  const n = Number(s) || 0;
  if (n >= 80) return "#22c55e";
  if (n >= 60) return "#10b981";
  if (n >= 40) return "#f59e0b";
  return "#94a3b8";
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

const blankLead = () => ({
  id: null,
  leadName: "", companyName: "", jobTitle: "",
  industry: "", country: "", city: "",
  score: 50,
  email: "", phone: "", linkedin: "", website: "",
  notes: "",
  followUpDate: "", followUpNotes: "",
  contactMethod: CONTACT_METHODS[0],
  dealSize: "", dealCategories: [],
  status: "new",
  relatedLeadId: "",
  leadContact: "",
  claimedBy: null, claimedByName: null, claimedAt: null,
  lastContactedAt: null, lastContactedBy: null,
});

/* ----------------------------------------------------------
   Auth header helper
---------------------------------------------------------- */
const authHeaders = () => {
  const token = typeof localStorage !== "undefined"
    ? localStorage.getItem("token") : null;
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
};

/* ----------------------------------------------------------
   Simple, RFC-4180-ish CSV parser (handles quoted fields,
   embedded commas, escaped quotes "")
---------------------------------------------------------- */
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false, i = 0;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i += 2; continue; }
      if (c === '"') { inQuotes = false; i++; continue; }
      field += c; i++; continue;
    }
    if (c === '"') { inQuotes = true; i++; continue; }
    if (c === ",") { row.push(field); field = ""; i++; continue; }
    if (c === "\r") { i++; continue; }
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
    field += c; i++;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

/* Auto-map a CSV header to a lead field by alias matching */
function autoMapHeader(header) {
  const h = header.trim().toLowerCase();
  for (const [field, aliases] of Object.entries(CSV_FIELD_ALIASES)) {
    if (aliases.includes(h)) return field;
  }
  return "skip";
}

/* Convert array of leads → CSV text */
function leadsToCSV(leads, fields) {
  const headers = fields.map((f) => f.label);
  const lines = [headers.map(csvEscape).join(",")];
  for (const lead of leads) {
    const row = fields.map((f) => {
      let v = lead[f.key];
      if (Array.isArray(v)) v = v.join("; ");
      if (v === null || v === undefined) v = "";
      return csvEscape(String(v));
    });
    lines.push(row.join(","));
  }
  return lines.join("\n");
}

function csvEscape(s) {
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadFile(name, text, type = "text/csv") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ============================================================
   MAIN COMPONENT
============================================================ */
export default function AdminLeads() {
  /* ---- Theme ---- */
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("leads_theme") ||
      (window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark");
  });
  useEffect(() => { localStorage.setItem("leads_theme", theme); }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  /* ---- Current user ---- */
  const [currentUser, setCurrentUser] = useState({
    id: null, name: "You", email: "",
  });

  /* ---- Core data ---- */
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  /* ---- UI state ---- */
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "all", score: "all", followUp: "all",
    country: "all", industry: "all", company: "all",
    owner: "all", claim: "all",
  });
  const [sortBy, setSortBy] = useState({ field: "score", direction: "desc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [drawerLead, setDrawerLead] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [formData, setFormData] = useState(blankLead());
  const [formMode, setFormMode] = useState("create");
  const [confirmDelete, setConfirmDelete] = useState(null); // id | "bulk"
  const [toasts, setToasts] = useState([]);

  /* ============================================================
     🔌 BACKEND HOOKS — wire up to your API
  ============================================================ */
  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() });
      if (!res.ok) throw new Error("auth failed");
      const data = await res.json();
      setCurrentUser({ id: data.id, name: data.name || "You", email: data.email || "" });
    } catch {
      // Fallback to localStorage placeholder so claim UI still works
      setCurrentUser({ id: "me", name: "You", email: "" });
    }
  }, []);

  const fetchLeads = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch(`${API_BASE}/leads`, { headers: authHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // Accept either array or { data: [] } shape
      const list = Array.isArray(data) ? data : (data.data || data.leads || []);
      setLeads(list);
      setLastSynced(new Date());
    } catch (err) {
      setSyncError(err.message || "Sync failed");
      // No leads yet? leave list empty for now
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  const createLead = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: "POST", headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const newLead = await res.json();
      setLeads((prev) => [newLead, ...prev]);
      pushToast("Lead created", "success");
      return newLead;
    } catch (err) {
      // Optimistic local fallback so UI works without backend
      const local = { ...payload, id: `local-${Date.now()}`, createdAt: new Date().toISOString() };
      setLeads((prev) => [local, ...prev]);
      pushToast("Saved locally (no backend)", "warning");
      return local;
    }
  };

  const updateLead = async (id, payload) => {
    // optimistic
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...payload } : l)));
    try {
      await fetch(`${API_BASE}/leads/${id}`, {
        method: "PATCH", headers: authHeaders(),
        body: JSON.stringify(payload),
      });
    } catch {
      pushToast("Could not save change", "error");
    }
  };

  const deleteLead = async (id) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    try {
      await fetch(`${API_BASE}/leads/${id}`, {
        method: "DELETE", headers: authHeaders(),
      });
    } catch {
      pushToast("Could not delete on server", "error");
    }
  };

  const bulkImport = async (newLeads) => {
    try {
      const res = await fetch(`${API_BASE}/leads/bulk-import`, {
        method: "POST", headers: authHeaders(),
        body: JSON.stringify({ leads: newLeads }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      pushToast(`Imported ${data.imported || newLeads.length} leads`, "success");
      await fetchLeads({ silent: true });
    } catch {
      // fallback: add locally
      const local = newLeads.map((l) => ({
        ...l, id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        createdAt: new Date().toISOString(),
      }));
      setLeads((prev) => [...local, ...prev]);
      pushToast(`Imported ${local.length} leads (local only)`, "warning");
    }
  };

  const claimLead = async (id) => {
    const optimistic = {
      claimedBy: currentUser.id, claimedByName: currentUser.name,
      claimedAt: new Date().toISOString(),
    };
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...optimistic } : l)));
    try {
      const res = await fetch(`${API_BASE}/leads/${id}/claim`, {
        method: "POST", headers: authHeaders(),
      });
      if (res.status === 409) {
        const data = await res.json().catch(() => ({}));
        pushToast(`Already claimed by ${data.claimedByName || "someone else"}`, "error");
        await fetchLeads({ silent: true });
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updated } : l)));
      pushToast("Lead claimed — others can't reach out now", "success");
    } catch {
      pushToast("Could not claim on server (saved locally)", "warning");
    }
  };

  const releaseLead = async (id) => {
    setLeads((prev) => prev.map((l) =>
      l.id === id ? { ...l, claimedBy: null, claimedByName: null, claimedAt: null } : l
    ));
    try {
      await fetch(`${API_BASE}/leads/${id}/release`, {
        method: "POST", headers: authHeaders(),
      });
      pushToast("Released — back in the pool", "success");
    } catch { /* optimistic */ }
  };

  const bulkAction = async (action, ids, payload) => {
    const idsArr = Array.from(ids);
    if (action === "delete") {
      setLeads((prev) => prev.filter((l) => !ids.has(l.id)));
      try {
        await fetch(`${API_BASE}/leads/bulk-delete`, {
          method: "POST", headers: authHeaders(),
          body: JSON.stringify({ ids: idsArr }),
        });
      } catch { /* ignore */ }
      pushToast(`Deleted ${idsArr.length} leads`, "success");
    } else if (action === "update") {
      setLeads((prev) => prev.map((l) =>
        ids.has(l.id) ? { ...l, ...payload } : l
      ));
      try {
        await fetch(`${API_BASE}/leads/bulk-update`, {
          method: "POST", headers: authHeaders(),
          body: JSON.stringify({ ids: idsArr, updates: payload }),
        });
      } catch { /* ignore */ }
      pushToast(`Updated ${idsArr.length} leads`, "success");
    } else if (action === "claim") {
      const stamp = {
        claimedBy: currentUser.id, claimedByName: currentUser.name,
        claimedAt: new Date().toISOString(),
      };
      setLeads((prev) => prev.map((l) =>
        ids.has(l.id) && !l.claimedBy ? { ...l, ...stamp } : l
      ));
      try {
        await Promise.all(idsArr.map((id) =>
          fetch(`${API_BASE}/leads/${id}/claim`, {
            method: "POST", headers: authHeaders(),
          })
        ));
      } catch { /* ignore */ }
      pushToast(`Claimed ${idsArr.length} leads`, "success");
    } else if (action === "release") {
      setLeads((prev) => prev.map((l) =>
        ids.has(l.id) ? { ...l, claimedBy: null, claimedByName: null, claimedAt: null } : l
      ));
      try {
        await Promise.all(idsArr.map((id) =>
          fetch(`${API_BASE}/leads/${id}/release`, {
            method: "POST", headers: authHeaders(),
          })
        ));
      } catch { /* ignore */ }
      pushToast(`Released ${idsArr.length} leads`, "success");
    }
    setSelectedIds(new Set());
  };

  /* ---- Initial load + polling ---- */
  useEffect(() => { fetchCurrentUser(); fetchLeads(); }, [fetchCurrentUser, fetchLeads]);

  useEffect(() => {
    const id = setInterval(() => { fetchLeads({ silent: true }); }, SYNC_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchLeads]);

  /* ---- Toast helper ---- */
  const pushToast = (message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  /* ---- Derived data: unique values for filters ---- */
  const uniqueCountries = useMemo(() =>
    [...new Set(leads.map((l) => l.country).filter(Boolean))].sort(), [leads]);
  const uniqueIndustries = useMemo(() =>
    [...new Set(leads.map((l) => l.industry).filter(Boolean))].sort(), [leads]);
  const uniqueCompanies = useMemo(() =>
    [...new Set(leads.map((l) => l.companyName).filter(Boolean))].sort(), [leads]);
  const uniqueOwners = useMemo(() =>
    [...new Set(leads.map((l) => l.claimedByName).filter(Boolean))].sort(), [leads]);

  /* ---- Filter + sort ---- */
  const filteredLeads = useMemo(() => {
    let out = [...leads];

    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((l) =>
        [l.leadName, l.companyName, l.email, l.phone, l.jobTitle, l.leadContact, l.country, l.city]
          .some((v) => (v || "").toLowerCase().includes(q))
      );
    }

    if (filters.status !== "all") out = out.filter((l) => l.status === filters.status);
    if (filters.country !== "all") out = out.filter((l) => l.country === filters.country);
    if (filters.industry !== "all") out = out.filter((l) => l.industry === filters.industry);
    if (filters.company !== "all") out = out.filter((l) => l.companyName === filters.company);
    if (filters.owner !== "all") {
      out = filters.owner === "unclaimed"
        ? out.filter((l) => !l.claimedBy)
        : out.filter((l) => l.claimedByName === filters.owner);
    }
    if (filters.claim !== "all") {
      if (filters.claim === "available") out = out.filter((l) => !l.claimedBy);
      if (filters.claim === "mine") out = out.filter((l) => l.claimedBy === currentUser.id);
      if (filters.claim === "others") out = out.filter((l) => l.claimedBy && l.claimedBy !== currentUser.id);
    }
    if (filters.score !== "all") {
      out = out.filter((l) => {
        const s = Number(l.score) || 0;
        if (filters.score === "hot") return s >= 80;
        if (filters.score === "warm") return s >= 60 && s < 80;
        if (filters.score === "cold") return s < 60;
        return true;
      });
    }
    if (filters.followUp !== "all") {
      out = out.filter((l) => {
        if (!l.followUpDate) return false;
        const overdue = isOverdue(l.followUpDate);
        return filters.followUp === "overdue" ? overdue : !overdue;
      });
    }

    out.sort((a, b) => {
      const { field, direction } = sortBy;
      let av = a[field], bv = b[field];
      if (field === "dealSize" || field === "score") {
        av = Number(av) || 0; bv = Number(bv) || 0;
      } else if (field === "followUpDate" || field === "createdAt" || field === "claimedAt") {
        av = av ? new Date(av).getTime() : 0;
        bv = bv ? new Date(bv).getTime() : 0;
      } else {
        av = (av || "").toString().toLowerCase();
        bv = (bv || "").toString().toLowerCase();
      }
      if (av < bv) return direction === "asc" ? -1 : 1;
      if (av > bv) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return out;
  }, [leads, search, filters, sortBy, currentUser.id]);

  /* ---- Pagination ---- */
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const pagedLeads = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, page, pageSize]);

  useEffect(() => { if (page > totalPages) setPage(1); }, [page, totalPages]);

  /* ---- Stats ---- */
  const stats = useMemo(() => {
    const total = leads.length;
    const hot = leads.filter((l) => (Number(l.score) || 0) >= 80).length;
    const overdue = leads.filter((l) => isOverdue(l.followUpDate)).length;
    const claimedByMe = leads.filter((l) => l.claimedBy === currentUser.id).length;
    const pipeline = leads
      .filter((l) => !["won", "lost"].includes(l.status))
      .reduce((sum, l) => sum + (Number(l.dealSize) || 0), 0);
    return { total, hot, overdue, claimedByMe, pipeline };
  }, [leads, currentUser.id]);

  /* ---- Selection helpers ---- */
  const allSelected = pagedLeads.length > 0 && pagedLeads.every((l) => selectedIds.has(l.id));
  const someSelected = pagedLeads.some((l) => selectedIds.has(l.id));

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) pagedLeads.forEach((l) => next.delete(l.id));
      else pagedLeads.forEach((l) => next.add(l.id));
      return next;
    });
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  /* ---- Form handlers ---- */
  const openCreate = () => {
    setFormMode("create"); setFormData(blankLead()); setShowFormModal(true);
  };
  const openEdit = (lead) => {
    setFormMode("edit"); setFormData({ ...blankLead(), ...lead });
    setShowFormModal(true); setDrawerLead(null);
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
      pushToast("Lead name is required", "error"); return;
    }
    if (formMode === "create") await createLead(formData);
    else await updateLead(formData.id, formData);
    setShowFormModal(false);
  };

  const handleExportCSV = () => {
    const fields = ALL_LEAD_FIELDS.filter((f) => f.key !== "skip");
    const csv = leadsToCSV(filteredLeads, fields);
    downloadFile(`leads-${new Date().toISOString().slice(0, 10)}.csv`, csv);
    pushToast(`Exported ${filteredLeads.length} leads`, "success");
  };

  const toggleSort = (field) =>
    setSortBy((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { field, direction: "desc" }
    );

  const resetFilters = () => {
    setFilters({
      status: "all", score: "all", followUp: "all",
      country: "all", industry: "all", company: "all",
      owner: "all", claim: "all",
    });
    setSearch("");
  };

  const activeFilterCount =
    Object.values(filters).filter((v) => v !== "all").length + (search ? 1 : 0);

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <div className="leads-root" data-theme={theme}>
      <LeadsStyles />

      {/* ===== HEADER ===== */}
      <div className="leads-header">
        <div>
          <h2 className="leads-title">Leads</h2>
          <p className="leads-subtitle">
            Manage your sales pipeline · {currentUser.name}
            {lastSynced && (
              <>
                {" · "}
                <span className="leads-sync-pill">
                  <span className={`leads-sync-dot ${syncing ? "syncing" : syncError ? "error" : ""}`} />
                  {syncError ? "Sync error" : `Synced ${fmtRelative(lastSynced)}`}
                </span>
              </>
            )}
          </p>
        </div>
        <div className="leads-header-actions">
          <button className="leads-btn-icon" onClick={toggleTheme} title="Toggle theme">
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <button className="leads-btn-icon" onClick={() => fetchLeads()} title="Refresh">
            ↻
          </button>
          <button className="leads-btn-secondary" onClick={() => setShowImportModal(true)}>
            ⬆ Import CSV
          </button>
          <button className="leads-btn-secondary" onClick={handleExportCSV} disabled={!filteredLeads.length}>
            ⬇ Export
          </button>
          <button className="leads-btn-primary" onClick={openCreate}>
            + New Lead
          </button>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="leads-stats">
        <StatCard label="Total Leads" value={stats.total} accent="#3b82f6" />
        <StatCard label="Hot Leads" value={stats.hot} accent="#22c55e" sub="Score ≥ 80" />
        <StatCard label="Claimed by you" value={stats.claimedByMe} accent="#8b5cf6" />
        <StatCard label="Overdue Follow-ups" value={stats.overdue} accent="#ef4444" />
        <StatCard label="Open Pipeline" value={fmtMoney(stats.pipeline)} accent="#f59e0b" isText />
      </div>

      {/* ===== TOOLBAR ===== */}
      <div className="leads-toolbar">
        <div className="leads-search">
          <span className="leads-search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search by name, company, email, phone, title, country…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <FilterSelect
          value={filters.claim}
          onChange={(v) => setFilters({ ...filters, claim: v })}
          options={[
            { value: "all", label: "All claim states" },
            { value: "available", label: "🟢 Available" },
            { value: "mine", label: "🔵 Claimed by me" },
            { value: "others", label: "🔒 Claimed by others" },
          ]}
        />

        <FilterSelect
          value={filters.status}
          onChange={(v) => setFilters({ ...filters, status: v })}
          options={[
            { value: "all", label: "All statuses" },
            ...STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label })),
          ]}
        />

        <FilterSelect
          value={filters.score}
          onChange={(v) => setFilters({ ...filters, score: v })}
          options={[
            { value: "all", label: "All scores" },
            { value: "hot", label: "🔥 Hot (80+)" },
            { value: "warm", label: "Warm (60–79)" },
            { value: "cold", label: "Cold (<60)" },
          ]}
        />

        <FilterSelect
          value={filters.country}
          onChange={(v) => setFilters({ ...filters, country: v })}
          options={[
            { value: "all", label: "All countries" },
            ...uniqueCountries.map((c) => ({ value: c, label: c })),
          ]}
        />

        <FilterSelect
          value={filters.industry}
          onChange={(v) => setFilters({ ...filters, industry: v })}
          options={[
            { value: "all", label: "All industries" },
            ...uniqueIndustries.map((c) => ({ value: c, label: c })),
          ]}
        />

        <FilterSelect
          value={filters.company}
          onChange={(v) => setFilters({ ...filters, company: v })}
          options={[
            { value: "all", label: "All companies" },
            ...uniqueCompanies.slice(0, 200).map((c) => ({ value: c, label: c })),
          ]}
        />

        <FilterSelect
          value={filters.owner}
          onChange={(v) => setFilters({ ...filters, owner: v })}
          options={[
            { value: "all", label: "All owners" },
            { value: "unclaimed", label: "Unclaimed" },
            ...uniqueOwners.map((o) => ({ value: o, label: o })),
          ]}
        />

        <FilterSelect
          value={filters.followUp}
          onChange={(v) => setFilters({ ...filters, followUp: v })}
          options={[
            { value: "all", label: "All follow-ups" },
            { value: "overdue", label: "Overdue" },
            { value: "upcoming", label: "Upcoming" },
          ]}
        />

        {activeFilterCount > 0 && (
          <button className="leads-btn-text" onClick={resetFilters}>
            Clear ({activeFilterCount})
          </button>
        )}
      </div>

      {/* ===== TABLE ===== */}
      <div className="leads-table-wrap">
        {loading ? (
          <EmptyState icon="⏳" title="Loading leads…" text="Fetching from your backend." />
        ) : filteredLeads.length === 0 ? (
          leads.length === 0 ? (
            <EmptyState
              icon="📭"
              title="No leads yet"
              text="Import a CSV or add one manually to get started."
              cta={{ label: "+ Add your first lead", onClick: openCreate }}
              secondaryCta={{ label: "⬆ Import CSV", onClick: () => setShowImportModal(true) }}
            />
          ) : (
            <EmptyState icon="🔍" title="No matches" text="Try clearing a filter or adjusting your search." />
          )
        ) : (
          <>
            <table className="leads-table">
              <thead>
                <tr>
                  <th style={{ width: 40, paddingRight: 0 }}>
                    <input
                      type="checkbox"
                      className="leads-checkbox"
                      checked={allSelected}
                      ref={(el) => { if (el) el.indeterminate = !allSelected && someSelected; }}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <SortableTh field="leadName" sortBy={sortBy} onSort={toggleSort}>Lead</SortableTh>
                  <th>Contact</th>
                  <SortableTh field="score" sortBy={sortBy} onSort={toggleSort}>Score</SortableTh>
                  <SortableTh field="status" sortBy={sortBy} onSort={toggleSort}>Status</SortableTh>
                  <th>Claim</th>
                  <SortableTh field="dealSize" sortBy={sortBy} onSort={toggleSort}>Deal Size</SortableTh>
                  <SortableTh field="country" sortBy={sortBy} onSort={toggleSort}>Country</SortableTh>
                  <SortableTh field="followUpDate" sortBy={sortBy} onSort={toggleSort}>Follow-up</SortableTh>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedLeads.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    selected={selectedIds.has(lead.id)}
                    currentUserId={currentUser.id}
                    onToggleSelect={() => toggleSelect(lead.id)}
                    onOpen={() => setDrawerLead(lead)}
                    onClaim={() => claimLead(lead.id)}
                    onRelease={() => releaseLead(lead.id)}
                    onEdit={() => openEdit(lead)}
                    onDelete={() => setConfirmDelete(lead.id)}
                  />
                ))}
              </tbody>
            </table>

            <Pagination
              page={page} totalPages={totalPages}
              pageSize={pageSize} totalItems={filteredLeads.length}
              onPage={setPage} onPageSize={setPageSize}
            />
          </>
        )}
      </div>

      {/* ===== BULK ACTION BAR ===== */}
      {selectedIds.size > 0 && (
        <BulkActionBar
          count={selectedIds.size}
          onClear={() => setSelectedIds(new Set())}
          onClaim={() => bulkAction("claim", selectedIds)}
          onRelease={() => bulkAction("release", selectedIds)}
          onChangeStatus={(status) => bulkAction("update", selectedIds, { status })}
          onDelete={() => setConfirmDelete("bulk")}
          onExport={() => {
            const selected = leads.filter((l) => selectedIds.has(l.id));
            const fields = ALL_LEAD_FIELDS.filter((f) => f.key !== "skip");
            downloadFile(`selected-leads.csv`, leadsToCSV(selected, fields));
            pushToast(`Exported ${selected.length} leads`, "success");
          }}
        />
      )}

      {/* ===== DRAWER ===== */}
      {drawerLead && (
        <LeadDrawer
          lead={leads.find((l) => l.id === drawerLead.id) || drawerLead}
          allLeads={leads}
          currentUserId={currentUser.id}
          onClose={() => setDrawerLead(null)}
          onEdit={() => openEdit(drawerLead)}
          onDelete={() => setConfirmDelete(drawerLead.id)}
          onClaim={() => claimLead(drawerLead.id)}
          onRelease={() => releaseLead(drawerLead.id)}
          onStatusChange={(s) => updateLead(drawerLead.id, { status: s })}
        />
      )}

      {/* ===== FORM MODAL ===== */}
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

      {/* ===== CSV IMPORT MODAL ===== */}
      {showImportModal && (
        <CSVImportModal
          onClose={() => setShowImportModal(false)}
          onImport={async (rows) => {
            await bulkImport(rows);
            setShowImportModal(false);
          }}
        />
      )}

      {/* ===== DELETE CONFIRM ===== */}
      {confirmDelete && (
        <ConfirmModal
          title={confirmDelete === "bulk" ? `Delete ${selectedIds.size} leads?` : "Delete this lead?"}
          message="This can't be undone."
          confirmLabel="Delete"
          danger
          onConfirm={async () => {
            if (confirmDelete === "bulk") await bulkAction("delete", selectedIds);
            else await deleteLead(confirmDelete);
            setConfirmDelete(null);
            setDrawerLead(null);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* ===== TOASTS ===== */}
      <div className="leads-toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`leads-toast leads-toast-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SUB-COMPONENTS
============================================================ */

function StatCard({ label, value, accent, sub, isText }) {
  return (
    <div className="leads-stat-card">
      <div className="leads-stat-bar" style={{ background: accent }} />
      <div style={{ padding: "14px 16px" }}>
        <div className="leads-stat-label">{label}</div>
        <div className="leads-stat-value" style={{ fontSize: isText ? 20 : 26 }}>{value}</div>
        {sub && <div className="leads-stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

function FilterSelect({ value, onChange, options }) {
  return (
    <select className="leads-select" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function SortableTh({ field, sortBy, onSort, children }) {
  const active = sortBy.field === field;
  return (
    <th onClick={() => onSort(field)} style={{ cursor: "pointer", userSelect: "none" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        {children}
        <span style={{ fontSize: 9, opacity: active ? 1 : 0.3 }}>
          {active ? (sortBy.direction === "asc" ? "▲" : "▼") : "▼"}
        </span>
      </span>
    </th>
  );
}

function LeadRow({ lead, selected, currentUserId, onToggleSelect, onOpen, onClaim, onRelease, onEdit, onDelete }) {
  const overdue = isOverdue(lead.followUpDate);
  const claimedByMe = lead.claimedBy === currentUserId;
  const claimedByOther = lead.claimedBy && !claimedByMe;

  return (
    <tr
      className={`leads-row ${selected ? "selected" : ""} ${claimedByOther ? "locked" : ""}`}
      onClick={onOpen}
    >
      <td onClick={(e) => e.stopPropagation()} style={{ paddingRight: 0 }}>
        <input
          type="checkbox"
          className="leads-checkbox"
          checked={selected}
          onChange={onToggleSelect}
        />
      </td>

      <td>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="leads-avatar" style={{ background: scoreColor(lead.score) }}>
            {initialsOf(lead.leadName)}
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="leads-name">{lead.leadName || "(unnamed)"}</div>
            <div className="leads-sub">
              {lead.jobTitle ? `${lead.jobTitle} · ` : ""}{lead.companyName || "—"}
            </div>
          </div>
        </div>
      </td>

      <td>
        <div className="leads-contact-cell">
          {lead.email && <div>✉ {lead.email}</div>}
          {lead.phone && <div>☎ {lead.phone}</div>}
          {!lead.email && !lead.phone && <div style={{ opacity: 0.5 }}>—</div>}
        </div>
      </td>

      <td><ScorePill score={lead.score} /></td>
      <td><StatusBadge status={lead.status} /></td>

      <td onClick={(e) => e.stopPropagation()}>
        <ClaimCell
          lead={lead}
          claimedByMe={claimedByMe}
          claimedByOther={claimedByOther}
          onClaim={onClaim}
          onRelease={onRelease}
        />
      </td>

      <td className="leads-money">{fmtMoney(lead.dealSize)}</td>

      <td className="leads-cell-text">{lead.country || "—"}</td>

      <td>
        <span className={`leads-followup ${overdue ? "overdue" : ""}`}>
          {fmtDate(lead.followUpDate)}
          {overdue && <span style={{ marginLeft: 6 }}>⚠</span>}
        </span>
      </td>

      <td onClick={(e) => e.stopPropagation()} style={{ textAlign: "right", whiteSpace: "nowrap" }}>
        <button className="leads-icon-btn" title="Edit" onClick={onEdit}>✎</button>
        <button className="leads-icon-btn leads-icon-btn-danger" title="Delete" onClick={onDelete}>🗑</button>
      </td>
    </tr>
  );
}

function ClaimCell({ lead, claimedByMe, claimedByOther, onClaim, onRelease }) {
  if (claimedByMe) {
    return (
      <div className="leads-claim leads-claim-me">
        <span>✓ Yours</span>
        <button className="leads-mini-btn" onClick={onRelease}>Release</button>
      </div>
    );
  }
  if (claimedByOther) {
    return (
      <div className="leads-claim leads-claim-locked" title={`Claimed ${fmtRelative(lead.claimedAt)}`}>
        🔒 {lead.claimedByName || "Locked"}
      </div>
    );
  }
  return (
    <button className="leads-claim-btn" onClick={onClaim}>
      Claim
    </button>
  );
}

function ScorePill({ score }) {
  const c = scoreColor(score);
  const n = Number(score) || 0;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <div className="leads-score-circle" style={{ borderColor: c, color: c, background: `${c}1a` }}>
        {n}
      </div>
      <span style={{ fontSize: 11, color: c, fontWeight: 700 }}>{scoreLabel(n)}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const sm = statusMeta(status);
  return (
    <span
      className="leads-badge"
      style={{ background: `${sm.color}1a`, color: sm.color, borderColor: `${sm.color}55` }}
    >
      {sm.label}
    </span>
  );
}

function EmptyState({ icon, title, text, cta, secondaryCta }) {
  return (
    <div className="leads-empty">
      <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
      <div className="leads-empty-title">{title}</div>
      <div className="leads-empty-text">{text}</div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 18 }}>
        {cta && <button className="leads-btn-primary" onClick={cta.onClick}>{cta.label}</button>}
        {secondaryCta && <button className="leads-btn-secondary" onClick={secondaryCta.onClick}>{secondaryCta.label}</button>}
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, pageSize, totalItems, onPage, onPageSize }) {
  return (
    <div className="leads-pagination">
      <div className="leads-pagination-info">
        {totalItems === 0 ? "No leads" : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, totalItems)} of ${totalItems}`}
      </div>
      <div className="leads-pagination-controls">
        <select
          className="leads-select"
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
          style={{ padding: "6px 10px" }}
        >
          {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s} / page</option>)}
        </select>
        <button className="leads-pg-btn" onClick={() => onPage(1)} disabled={page === 1}>«</button>
        <button className="leads-pg-btn" onClick={() => onPage(page - 1)} disabled={page === 1}>‹</button>
        <span className="leads-pagination-info">{page} / {totalPages}</span>
        <button className="leads-pg-btn" onClick={() => onPage(page + 1)} disabled={page === totalPages}>›</button>
        <button className="leads-pg-btn" onClick={() => onPage(totalPages)} disabled={page === totalPages}>»</button>
      </div>
    </div>
  );
}

function BulkActionBar({ count, onClear, onClaim, onRelease, onChangeStatus, onDelete, onExport }) {
  return (
    <div className="leads-bulk-bar">
      <div className="leads-bulk-count">
        <span className="leads-bulk-num">{count}</span> selected
        <button className="leads-btn-text" onClick={onClear} style={{ marginLeft: 12 }}>Clear</button>
      </div>
      <div className="leads-bulk-actions">
        <button className="leads-btn-secondary" onClick={onClaim}>Claim all</button>
        <button className="leads-btn-secondary" onClick={onRelease}>Release all</button>
        <select
          className="leads-select"
          onChange={(e) => { if (e.target.value) { onChangeStatus(e.target.value); e.target.value = ""; } }}
          defaultValue=""
        >
          <option value="">Set status…</option>
          {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <button className="leads-btn-secondary" onClick={onExport}>Export</button>
        <button className="leads-btn-danger" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

/* ============================================================
   DRAWER
============================================================ */
function LeadDrawer({ lead, allLeads, currentUserId, onClose, onEdit, onDelete, onClaim, onRelease, onStatusChange }) {
  const claimedByMe = lead.claimedBy === currentUserId;
  const claimedByOther = lead.claimedBy && !claimedByMe;
  const related = allLeads.find((l) => l.id === lead.relatedLeadId);

  return (
    <>
      <div className="leads-backdrop" onClick={onClose} />
      <aside className="leads-drawer">
        <div className="leads-drawer-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
            <div className="leads-avatar" style={{ width: 52, height: 52, fontSize: 18, background: scoreColor(lead.score) }}>
              {initialsOf(lead.leadName)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="leads-drawer-name">{lead.leadName || "(unnamed)"}</div>
              <div className="leads-drawer-sub">
                {lead.jobTitle ? `${lead.jobTitle} · ` : ""}{lead.companyName || "—"}
              </div>
            </div>
          </div>
          <button className="leads-icon-btn" onClick={onClose}>✕</button>
        </div>

        {/* Claim banner */}
        {claimedByOther && (
          <div className="leads-claim-banner locked">
            🔒 Claimed by <b>{lead.claimedByName}</b> {fmtRelative(lead.claimedAt)} — don't double-touch.
          </div>
        )}
        {claimedByMe && (
          <div className="leads-claim-banner mine">
            ✓ You claimed this {fmtRelative(lead.claimedAt)}.
            <button className="leads-mini-btn" onClick={onRelease} style={{ marginLeft: 10 }}>Release</button>
          </div>
        )}
        {!lead.claimedBy && (
          <div className="leads-claim-banner available">
            🟢 Available — claim before reaching out so others know.
            <button className="leads-mini-btn primary" onClick={onClaim} style={{ marginLeft: 10 }}>Claim</button>
          </div>
        )}

        {/* Quick status row */}
        <div className="leads-drawer-section">
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
            <ScorePill score={lead.score} />
            <StatusBadge status={lead.status} />
          </div>
          <div className="leads-section-label">Quick status update</div>
          <div className="leads-chip-row">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => onStatusChange(s.value)}
                className="leads-chip"
                style={{
                  background: lead.status === s.value ? `${s.color}33` : "transparent",
                  borderColor: lead.status === s.value ? s.color : "var(--leads-border)",
                  color: lead.status === s.value ? s.color : "var(--leads-text-muted)",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="leads-drawer-body">
          <Field label="Email" value={lead.email} />
          <Field label="Phone" value={lead.phone} />
          <Field label="LinkedIn" value={lead.linkedin} />
          <Field label="Website" value={lead.website} />
          <Field label="Country / City" value={[lead.country, lead.city].filter(Boolean).join(", ") || "—"} />
          <Field label="Industry" value={lead.industry} />
          <Field label="Lead Contact (rep)" value={lead.leadContact} />
          <Field label="Method of Contact" value={lead.contactMethod} />
          <Field label="Deal Size" value={fmtMoney(lead.dealSize)} />
          <Field
            label="Deal Categories"
            value={lead.dealCategories?.length
              ? <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {lead.dealCategories.map((c) => <span key={c} className="leads-pill">{c}</span>)}
                </div>
              : "—"}
          />
          <Field label="Follow-up Date" value={fmtDate(lead.followUpDate)} />
          <Field label="Follow-up Notes" value={lead.followUpNotes} multiline />
          <Field label="Lead Notes" value={lead.notes} multiline />
          <Field label="Related Lead" value={related ? `${related.leadName} (${related.companyName || "—"})` : "—"} />
          {lead.lastContactedAt && (
            <Field label="Last Contacted" value={`${fmtDate(lead.lastContactedAt)} by ${lead.lastContactedBy || "—"}`} />
          )}
        </div>

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
    <div style={{ marginBottom: 14 }}>
      <div className="leads-field-label">{label}</div>
      <div
        className={`leads-field-value ${isEmpty ? "empty" : ""}`}
        style={{ whiteSpace: multiline ? "pre-wrap" : "normal" }}
      >
        {value || "—"}
      </div>
    </div>
  );
}

/* ============================================================
   FORM MODAL
============================================================ */
function LeadFormModal({ mode, data, allLeads, onChange, onToggleCategory, onSave, onClose }) {
  return (
    <>
      <div className="leads-backdrop" onClick={onClose} />
      <div className="leads-modal">
        <div className="leads-modal-header">
          <div>
            <div className="leads-modal-title">{mode === "create" ? "New Lead" : "Edit Lead"}</div>
            <div className="leads-modal-sub">
              {mode === "create" ? "Add a lead manually. Required fields are marked *" : "Update lead information."}
            </div>
          </div>
          <button className="leads-icon-btn" onClick={onClose}>✕</button>
        </div>

        <div className="leads-modal-body">
          <FormSection title="Identity">
            <FormRow>
              <FormInput label="Lead Name *" value={data.leadName} onChange={(v) => onChange("leadName", v)} placeholder="Jane Doe" />
              <FormInput label="Job Title" value={data.jobTitle} onChange={(v) => onChange("jobTitle", v)} placeholder="VP Marketing" />
            </FormRow>
            <FormRow>
              <FormInput label="Company Name" value={data.companyName} onChange={(v) => onChange("companyName", v)} placeholder="Acme Corp" />
              <FormInput label="Industry" value={data.industry} onChange={(v) => onChange("industry", v)} placeholder="SaaS" />
            </FormRow>
            <FormRow>
              <FormInput label="Country" value={data.country} onChange={(v) => onChange("country", v)} placeholder="Canada" />
              <FormInput label="City" value={data.city} onChange={(v) => onChange("city", v)} placeholder="Toronto" />
            </FormRow>
            <FormRow>
              <FormInput label="Lead Contact (rep)" value={data.leadContact} onChange={(v) => onChange("leadContact", v)} placeholder="Salesperson handling" />
              <FormInput label="Lead Score (0–100)" type="number" min={0} max={100} value={data.score} onChange={(v) => onChange("score", v)} />
            </FormRow>
          </FormSection>

          <FormSection title="Contact Details">
            <FormRow>
              <FormInput label="Email" type="email" value={data.email} onChange={(v) => onChange("email", v)} placeholder="jane@acme.com" />
              <FormInput label="Phone" value={data.phone} onChange={(v) => onChange("phone", v)} placeholder="+1 555 123 4567" />
            </FormRow>
            <FormRow>
              <FormInput label="LinkedIn" value={data.linkedin} onChange={(v) => onChange("linkedin", v)} placeholder="https://linkedin.com/in/..." />
              <FormInput label="Website" value={data.website} onChange={(v) => onChange("website", v)} placeholder="acme.com" />
            </FormRow>
            <FormSelect label="Method of Contact" value={data.contactMethod} onChange={(v) => onChange("contactMethod", v)}
              options={CONTACT_METHODS.map((m) => ({ value: m, label: m }))} />
          </FormSection>

          <FormSection title="Deal">
            <FormRow>
              <FormInput label="Deal Size (USD)" type="number" min={0} value={data.dealSize} onChange={(v) => onChange("dealSize", v)} placeholder="5000" />
              <FormSelect label="Status" value={data.status} onChange={(v) => onChange("status", v)} options={STATUS_OPTIONS} />
            </FormRow>
            <div>
              <FormLabel>Deal Categories (multi-select)</FormLabel>
              <div className="leads-chip-row" style={{ marginTop: 6 }}>
                {DEAL_CATEGORIES.map((c) => {
                  const selected = data.dealCategories.includes(c);
                  return (
                    <button
                      key={c} type="button" onClick={() => onToggleCategory(c)} className="leads-chip"
                      style={{
                        background: selected ? "var(--leads-accent-soft)" : "transparent",
                        borderColor: selected ? "var(--leads-accent)" : "var(--leads-border)",
                        color: selected ? "var(--leads-accent)" : "var(--leads-text-muted)",
                      }}
                    >
                      {selected ? "✓ " : ""}{c}
                    </button>
                  );
                })}
              </div>
            </div>
          </FormSection>

          <FormSection title="Follow-up">
            <FormInput label="Follow-up Date" type="date" value={data.followUpDate} onChange={(v) => onChange("followUpDate", v)} />
            <FormTextarea label="Follow-up Notes" value={data.followUpNotes} onChange={(v) => onChange("followUpNotes", v)} placeholder="Reminders, what to bring up next..." />
          </FormSection>

          <FormSection title="Notes & Relations">
            <FormTextarea label="Lead Notes" value={data.notes} onChange={(v) => onChange("notes", v)} placeholder="Background, pain points, conversation history..." rows={5} />
            <FormSelect
              label="Related Lead"
              value={data.relatedLeadId}
              onChange={(v) => onChange("relatedLeadId", v)}
              options={[
                { value: "", label: "— None —" },
                ...allLeads.filter((l) => l.id !== data.id).map((l) => ({
                  value: l.id, label: `${l.leadName}${l.companyName ? ` (${l.companyName})` : ""}`,
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
    <div style={{ marginBottom: 22 }}>
      <div className="leads-form-section-title">{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );
}
function FormRow({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{children}</div>;
}
function FormLabel({ children }) {
  return <label className="leads-form-label">{children}</label>;
}
function FormInput({ label, value, onChange, ...rest }) {
  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <input className="leads-input" value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest} />
    </div>
  );
}
function FormTextarea({ label, value, onChange, rows = 3, ...rest }) {
  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <textarea className="leads-input" rows={rows} value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        style={{ resize: "vertical", fontFamily: "inherit" }} {...rest} />
    </div>
  );
}
function FormSelect({ label, value, onChange, options }) {
  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <select className="leads-input" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

/* ============================================================
   CSV IMPORT MODAL
============================================================ */
function CSVImportModal({ onClose, onImport }) {
  const [step, setStep] = useState("upload"); // upload | mapping | done
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [mapping, setMapping] = useState({}); // headerIndex → fieldKey
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    const text = await file.text();
    const parsed = parseCSV(text);
    if (!parsed.length) { alert("CSV looks empty."); return; }
    const [hdrs, ...dataRows] = parsed;
    const initialMapping = {};
    hdrs.forEach((h, i) => { initialMapping[i] = autoMapHeader(h); });
    setHeaders(hdrs);
    setRows(dataRows);
    setMapping(initialMapping);
    setStep("mapping");
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const buildLeads = () => {
    return rows.map((row) => {
      const lead = blankLead();
      headers.forEach((_, i) => {
        const key = mapping[i];
        if (!key || key === "skip") return;
        let v = (row[i] ?? "").trim();
        if (key === "score" || key === "dealSize") {
          const num = Number(v.replace(/[^\d.-]/g, ""));
          v = Number.isNaN(num) ? (key === "score" ? 50 : "") : num;
        }
        lead[key] = v;
      });
      return lead;
    }).filter((l) => l.leadName || l.email);
  };

  const previewLeads = useMemo(() => buildLeads().slice(0, 5), [rows, mapping, headers]);
  const totalToImport = useMemo(() => buildLeads().length, [rows, mapping, headers]);

  const mappedCount = Object.values(mapping).filter((v) => v && v !== "skip").length;

  return (
    <>
      <div className="leads-backdrop" onClick={onClose} />
      <div className="leads-modal" style={{ width: 760 }}>
        <div className="leads-modal-header">
          <div>
            <div className="leads-modal-title">Import Leads from CSV</div>
            <div className="leads-modal-sub">
              {step === "upload" && "Upload a CSV file to get started."}
              {step === "mapping" && `${headers.length} columns detected from ${fileName}. Map each column to a lead field.`}
            </div>
          </div>
          <button className="leads-icon-btn" onClick={onClose}>✕</button>
        </div>

        <div className="leads-modal-body">
          {step === "upload" && (
            <div
              className={`leads-dropzone ${dragOver ? "drag" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
                Drop your CSV here or click to browse
              </div>
              <div style={{ fontSize: 13, color: "var(--leads-text-muted)" }}>
                We'll auto-detect columns like Name, Email, Phone, Company.
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          )}

          {step === "mapping" && (
            <>
              <div style={{ marginBottom: 16, padding: "10px 14px", background: "var(--leads-accent-soft)",
                borderRadius: 8, fontSize: 13, color: "var(--leads-accent)" }}>
                ✓ {mappedCount} of {headers.length} columns mapped · {totalToImport} leads ready to import
              </div>

              <div className="leads-form-section-title">Column mapping</div>
              <div className="leads-mapping-grid">
                <div className="leads-mapping-head">CSV Column</div>
                <div className="leads-mapping-head">Sample</div>
                <div className="leads-mapping-head">Maps to</div>
                {headers.map((h, i) => (
                  <React.Fragment key={i}>
                    <div className="leads-mapping-csv">{h || `(column ${i + 1})`}</div>
                    <div className="leads-mapping-sample">{rows[0]?.[i] || "—"}</div>
                    <div>
                      <select
                        className="leads-input"
                        value={mapping[i] || "skip"}
                        onChange={(e) => setMapping({ ...mapping, [i]: e.target.value })}
                      >
                        {ALL_LEAD_FIELDS.map((f) => (
                          <option key={f.key} value={f.key}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {previewLeads.length > 0 && (
                <>
                  <div className="leads-form-section-title" style={{ marginTop: 24 }}>Preview (first 5)</div>
                  <div style={{ overflowX: "auto" }}>
                    <table className="leads-preview-table">
                      <thead>
                        <tr>
                          {ALL_LEAD_FIELDS.filter((f) => f.key !== "skip" && Object.values(mapping).includes(f.key))
                            .map((f) => <th key={f.key}>{f.label}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {previewLeads.map((l, i) => (
                          <tr key={i}>
                            {ALL_LEAD_FIELDS.filter((f) => f.key !== "skip" && Object.values(mapping).includes(f.key))
                              .map((f) => <td key={f.key}>{String(l[f.key] || "—")}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="leads-modal-footer">
          {step === "mapping" && (
            <button className="leads-btn-secondary" onClick={() => setStep("upload")} style={{ marginRight: "auto" }}>
              ← Back
            </button>
          )}
          <button className="leads-btn-secondary" onClick={onClose}>Cancel</button>
          {step === "mapping" && (
            <button
              className="leads-btn-primary"
              onClick={() => onImport(buildLeads())}
              disabled={totalToImport === 0}
            >
              Import {totalToImport} leads
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function ConfirmModal({ title, message, confirmLabel = "Confirm", danger, onConfirm, onCancel }) {
  return (
    <>
      <div className="leads-backdrop" onClick={onCancel} />
      <div className="leads-modal" style={{ width: 420 }}>
        <div style={{ padding: 24 }}>
          <div className="leads-modal-title" style={{ marginBottom: 8 }}>{title}</div>
          <div className="leads-modal-sub" style={{ marginBottom: 22 }}>{message}</div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button className="leads-btn-secondary" onClick={onCancel}>Cancel</button>
            <button
              className={danger ? "leads-btn-danger" : "leads-btn-primary"}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* Tiny shim so we don't need to import React.Fragment by name in JSX */
const React = { Fragment: ({ children }) => <>{children}</> };

/* ============================================================
   STYLES — light + dark theme via CSS variables
============================================================ */
function LeadsStyles() {
  return (
    <style>{`
      .leads-root {
        /* ===== LIGHT THEME (default) ===== */
        --leads-bg: #f8fafc;
        --leads-bg-elevated: #ffffff;
        --leads-bg-hover: #f1f5f9;
        --leads-bg-row-hover: #eff6ff;
        --leads-text: #0f172a;
        --leads-text-muted: #64748b;
        --leads-text-subtle: #94a3b8;
        --leads-border: #e2e8f0;
        --leads-border-strong: #cbd5e1;
        --leads-accent: #2563eb;
        --leads-accent-hover: #1d4ed8;
        --leads-accent-soft: rgba(37,99,235,0.08);
        --leads-shadow-sm: 0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06);
        --leads-shadow-md: 0 4px 6px rgba(15,23,42,0.04), 0 10px 15px rgba(15,23,42,0.08);
        --leads-shadow-lg: 0 20px 50px rgba(15,23,42,0.15);
        --leads-success: #16a34a;
        --leads-warning: #f59e0b;
        --leads-danger: #dc2626;
        --leads-input-bg: #ffffff;
        --leads-locked-bg: #fef2f2;
        --leads-locked-text: #b91c1c;
        --leads-mine-bg: #eff6ff;
        --leads-mine-text: #1d4ed8;
        --leads-available-bg: #f0fdf4;
        --leads-available-text: #15803d;

        color: var(--leads-text);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }

      .leads-root[data-theme="dark"] {
        --leads-bg: #0b1220;
        --leads-bg-elevated: #111a2e;
        --leads-bg-hover: rgba(255,255,255,0.04);
        --leads-bg-row-hover: rgba(59,130,246,0.08);
        --leads-text: #f8fafc;
        --leads-text-muted: #94a3b8;
        --leads-text-subtle: #64748b;
        --leads-border: rgba(255,255,255,0.08);
        --leads-border-strong: rgba(255,255,255,0.16);
        --leads-accent: #3b82f6;
        --leads-accent-hover: #60a5fa;
        --leads-accent-soft: rgba(59,130,246,0.15);
        --leads-shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
        --leads-shadow-md: 0 4px 12px rgba(0,0,0,0.4);
        --leads-shadow-lg: 0 20px 50px rgba(0,0,0,0.6);
        --leads-input-bg: rgba(0,0,0,0.3);
        --leads-locked-bg: rgba(220,38,38,0.12);
        --leads-locked-text: #fca5a5;
        --leads-mine-bg: rgba(59,130,246,0.15);
        --leads-mine-text: #93c5fd;
        --leads-available-bg: rgba(34,197,94,0.12);
        --leads-available-text: #86efac;
      }

      /* ===== HEADER ===== */
      .leads-header {
        display: flex; justify-content: space-between; align-items: flex-start;
        margin-bottom: 22px; flex-wrap: wrap; gap: 12px;
      }
      .leads-title {
        margin: 0; font-size: 26px; font-weight: 800; color: var(--leads-text);
        letter-spacing: -0.02em;
      }
      .leads-subtitle {
        margin: 4px 0 0; color: var(--leads-text-muted); font-size: 13px;
        display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
      }
      .leads-header-actions {
        display: flex; gap: 8px; flex-wrap: wrap;
      }
      .leads-sync-pill {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 12px; padding: 2px 8px; border-radius: 999px;
        background: var(--leads-bg-hover);
      }
      .leads-sync-dot {
        width: 7px; height: 7px; border-radius: 50%; background: var(--leads-success);
      }
      .leads-sync-dot.syncing {
        background: var(--leads-warning);
        animation: leadsPulse 1s ease-in-out infinite;
      }
      .leads-sync-dot.error { background: var(--leads-danger); }
      @keyframes leadsPulse {
        0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
      }

      /* ===== BUTTONS ===== */
      .leads-btn-primary {
        background: var(--leads-accent); color: #fff;
        border: none; padding: 9px 18px; border-radius: 8px;
        font-weight: 600; font-size: 14px; cursor: pointer;
        transition: all 0.12s ease; box-shadow: var(--leads-shadow-sm);
      }
      .leads-btn-primary:hover { background: var(--leads-accent-hover); transform: translateY(-1px); }
      .leads-btn-primary:active { transform: translateY(0); }
      .leads-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

      .leads-btn-secondary {
        background: var(--leads-bg-elevated); color: var(--leads-text);
        border: 1px solid var(--leads-border); padding: 9px 16px; border-radius: 8px;
        font-weight: 600; font-size: 14px; cursor: pointer;
        transition: all 0.12s ease;
      }
      .leads-btn-secondary:hover {
        background: var(--leads-bg-hover); border-color: var(--leads-border-strong);
      }
      .leads-btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }

      .leads-btn-danger {
        background: var(--leads-danger); color: #fff; border: none;
        padding: 9px 16px; border-radius: 8px; font-weight: 600; font-size: 14px;
        cursor: pointer; transition: all 0.12s ease;
      }
      .leads-btn-danger:hover { background: #b91c1c; }

      .leads-btn-icon {
        background: var(--leads-bg-elevated); color: var(--leads-text);
        border: 1px solid var(--leads-border);
        width: 38px; height: 38px; border-radius: 8px;
        cursor: pointer; font-size: 16px;
        display: inline-flex; align-items: center; justify-content: center;
        transition: all 0.12s ease;
      }
      .leads-btn-icon:hover {
        background: var(--leads-bg-hover); border-color: var(--leads-border-strong);
      }

      .leads-btn-text {
        background: transparent; border: none; color: var(--leads-accent);
        font-weight: 600; font-size: 13px; cursor: pointer; padding: 4px 8px;
      }
      .leads-btn-text:hover { text-decoration: underline; }

      /* ===== STATS ===== */
      .leads-stats {
        display: grid; grid-template-columns: repeat(5, 1fr);
        gap: 12px; margin-bottom: 18px;
      }
      .leads-stat-card {
        background: var(--leads-bg-elevated);
        border: 1px solid var(--leads-border);
        border-radius: 12px; overflow: hidden;
        box-shadow: var(--leads-shadow-sm);
      }
      .leads-stat-bar { height: 3px; }
      .leads-stat-label {
        font-size: 11px; color: var(--leads-text-muted);
        font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
      }
      .leads-stat-value {
        font-weight: 800; color: var(--leads-text); margin-top: 6px;
        letter-spacing: -0.02em;
      }
      .leads-stat-sub {
        font-size: 11px; color: var(--leads-text-subtle); margin-top: 4px;
      }
      @media (max-width: 1100px) { .leads-stats { grid-template-columns: repeat(3, 1fr); } }
      @media (max-width: 700px) { .leads-stats { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 460px) { .leads-stats { grid-template-columns: 1fr; } }

      /* ===== TOOLBAR ===== */
      .leads-toolbar {
        display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap;
        align-items: center;
      }
      .leads-search {
        flex: 1; min-width: 280px; position: relative;
        display: flex; align-items: center;
      }
      .leads-search-icon {
        position: absolute; left: 12px; color: var(--leads-text-subtle);
        font-size: 16px; pointer-events: none;
      }
      .leads-search input {
        width: 100%; padding: 9px 14px 9px 34px;
        background: var(--leads-bg-elevated);
        border: 1px solid var(--leads-border); border-radius: 8px;
        color: var(--leads-text); font-size: 14px; outline: none;
        transition: all 0.12s ease;
      }
      .leads-search input:focus {
        border-color: var(--leads-accent);
        box-shadow: 0 0 0 3px var(--leads-accent-soft);
      }
      .leads-search input::placeholder { color: var(--leads-text-subtle); }

      .leads-select {
        padding: 9px 12px; background: var(--leads-bg-elevated);
        border: 1px solid var(--leads-border); border-radius: 8px;
        color: var(--leads-text); font-size: 13px; cursor: pointer;
        outline: none; font-weight: 500;
        transition: all 0.12s ease;
      }
      .leads-select:hover { border-color: var(--leads-border-strong); }
      .leads-select:focus {
        border-color: var(--leads-accent);
        box-shadow: 0 0 0 3px var(--leads-accent-soft);
      }

      /* ===== TABLE ===== */
      .leads-table-wrap {
        background: var(--leads-bg-elevated);
        border: 1px solid var(--leads-border);
        border-radius: 12px; overflow: hidden;
        box-shadow: var(--leads-shadow-sm);
      }
      .leads-table { width: 100%; border-collapse: collapse; font-size: 14px; }
      .leads-table th {
        text-align: left; padding: 12px 14px;
        font-size: 11px; font-weight: 700; color: var(--leads-text-muted);
        text-transform: uppercase; letter-spacing: 0.5px;
        background: var(--leads-bg-hover);
        border-bottom: 1px solid var(--leads-border);
        white-space: nowrap;
      }
      .leads-table td {
        padding: 12px 14px;
        border-bottom: 1px solid var(--leads-border);
        vertical-align: middle;
      }
      .leads-row { cursor: pointer; transition: background 0.1s ease; }
      .leads-row:hover { background: var(--leads-bg-row-hover); }
      .leads-row.selected { background: var(--leads-accent-soft); }
      .leads-row.locked { opacity: 0.7; }
      .leads-row:last-child td { border-bottom: none; }

      .leads-checkbox {
        width: 16px; height: 16px; cursor: pointer; accent-color: var(--leads-accent);
      }

      .leads-avatar {
        width: 36px; height: 36px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-weight: 800; font-size: 12px; color: #fff; flex-shrink: 0;
        text-shadow: 0 1px 2px rgba(0,0,0,0.2);
      }
      .leads-name { font-weight: 600; color: var(--leads-text); }
      .leads-sub { font-size: 12px; color: var(--leads-text-muted); margin-top: 2px; }

      .leads-contact-cell { display: flex; flex-direction: column; gap: 2px; font-size: 13px; color: var(--leads-text-muted); }
      .leads-cell-text { font-size: 13px; color: var(--leads-text-muted); }
      .leads-money { font-weight: 600; color: var(--leads-text); }

      .leads-followup { font-size: 13px; color: var(--leads-text-muted); }
      .leads-followup.overdue { color: var(--leads-danger); font-weight: 700; }

      .leads-icon-btn {
        background: transparent; border: 1px solid var(--leads-border);
        color: var(--leads-text-muted);
        width: 30px; height: 30px; border-radius: 6px;
        cursor: pointer; font-size: 13px; margin-left: 4px;
        transition: all 0.12s ease;
        display: inline-flex; align-items: center; justify-content: center;
      }
      .leads-icon-btn:hover {
        background: var(--leads-accent-soft); border-color: var(--leads-accent); color: var(--leads-accent);
      }
      .leads-icon-btn-danger:hover {
        background: rgba(220,38,38,0.1); border-color: var(--leads-danger); color: var(--leads-danger);
      }

      .leads-score-circle {
        width: 32px; height: 32px; border-radius: 50%;
        border: 2px solid; display: flex; align-items: center; justify-content: center;
        font-weight: 800; font-size: 12px;
      }

      .leads-badge {
        display: inline-flex; align-items: center;
        padding: 3px 10px; border-radius: 999px;
        font-size: 11px; font-weight: 700;
        border: 1px solid;
      }

      .leads-pill {
        background: var(--leads-accent-soft); color: var(--leads-accent);
        padding: 3px 10px; border-radius: 999px;
        font-size: 11px; font-weight: 700;
        border: 1px solid var(--leads-accent);
      }

      /* ===== CLAIM CELL ===== */
      .leads-claim {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 4px 10px; border-radius: 6px;
        font-size: 12px; font-weight: 700;
      }
      .leads-claim-me {
        background: var(--leads-mine-bg); color: var(--leads-mine-text);
      }
      .leads-claim-locked {
        background: var(--leads-locked-bg); color: var(--leads-locked-text);
      }
      .leads-claim-btn {
        background: var(--leads-available-bg); color: var(--leads-available-text);
        border: 1px solid currentColor; opacity: 0.9;
        padding: 4px 12px; border-radius: 6px;
        font-size: 12px; font-weight: 700; cursor: pointer;
        transition: all 0.12s ease;
      }
      .leads-claim-btn:hover { opacity: 1; transform: translateY(-1px); }

      .leads-mini-btn {
        background: transparent; border: 1px solid currentColor;
        padding: 2px 8px; border-radius: 5px;
        font-size: 11px; font-weight: 700; cursor: pointer;
        color: inherit;
      }
      .leads-mini-btn:hover { background: rgba(0,0,0,0.05); }
      .leads-root[data-theme="dark"] .leads-mini-btn:hover { background: rgba(255,255,255,0.05); }
      .leads-mini-btn.primary {
        background: var(--leads-accent); color: #fff; border-color: var(--leads-accent);
      }

      /* ===== EMPTY STATE ===== */
      .leads-empty { text-align: center; padding: 60px 20px; color: var(--leads-text-muted); }
      .leads-empty-title { font-size: 18px; font-weight: 700; color: var(--leads-text); margin-bottom: 6px; }
      .leads-empty-text { font-size: 14px; max-width: 380px; margin: 0 auto; }

      /* ===== PAGINATION ===== */
      .leads-pagination {
        display: flex; justify-content: space-between; align-items: center;
        padding: 14px 16px; border-top: 1px solid var(--leads-border);
        background: var(--leads-bg-hover); flex-wrap: wrap; gap: 12px;
      }
      .leads-pagination-info {
        font-size: 13px; color: var(--leads-text-muted); font-weight: 500;
      }
      .leads-pagination-controls { display: flex; gap: 6px; align-items: center; }
      .leads-pg-btn {
        background: var(--leads-bg-elevated); border: 1px solid var(--leads-border);
        color: var(--leads-text); width: 32px; height: 32px;
        border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 700;
      }
      .leads-pg-btn:hover:not(:disabled) {
        background: var(--leads-accent-soft); border-color: var(--leads-accent); color: var(--leads-accent);
      }
      .leads-pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }

      /* ===== BULK BAR ===== */
      .leads-bulk-bar {
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
        background: var(--leads-bg-elevated); border: 1px solid var(--leads-border-strong);
        border-radius: 14px; padding: 12px 18px;
        display: flex; gap: 18px; align-items: center;
        box-shadow: var(--leads-shadow-lg); z-index: 50;
        animation: leadsSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .leads-bulk-count { font-size: 14px; font-weight: 600; color: var(--leads-text); white-space: nowrap; }
      .leads-bulk-num {
        background: var(--leads-accent); color: #fff;
        padding: 2px 10px; border-radius: 999px; font-weight: 800;
        margin-right: 6px;
      }
      .leads-bulk-actions { display: flex; gap: 8px; flex-wrap: wrap; }

      /* ===== DRAWER & MODAL ===== */
      .leads-backdrop {
        position: fixed; inset: 0; background: rgba(15,23,42,0.5);
        backdrop-filter: blur(4px); z-index: 998;
        animation: leadsFadeIn 0.2s ease;
      }
      .leads-root[data-theme="light"] .leads-backdrop { background: rgba(15,23,42,0.4); }

      .leads-drawer {
        position: fixed; top: 0; right: 0; bottom: 0;
        width: 500px; max-width: 100vw;
        background: var(--leads-bg-elevated);
        border-left: 1px solid var(--leads-border);
        box-shadow: var(--leads-shadow-lg);
        z-index: 999;
        display: flex; flex-direction: column;
        animation: leadsSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .leads-drawer-header {
        padding: 20px; border-bottom: 1px solid var(--leads-border);
        display: flex; justify-content: space-between; align-items: center;
      }
      .leads-drawer-name {
        font-size: 18px; font-weight: 800; color: var(--leads-text);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .leads-drawer-sub { font-size: 13px; color: var(--leads-text-muted); margin-top: 2px; }
      .leads-drawer-section {
        padding: 16px 20px; border-bottom: 1px solid var(--leads-border);
      }
      .leads-drawer-body {
        padding: 18px 20px; overflow-y: auto; flex: 1;
      }
      .leads-drawer-footer {
        padding: 14px 20px; border-top: 1px solid var(--leads-border);
        display: flex; justify-content: flex-end; gap: 10px;
        background: var(--leads-bg-hover);
      }

      .leads-claim-banner {
        padding: 12px 20px; font-size: 13px; font-weight: 600;
        display: flex; align-items: center; flex-wrap: wrap; gap: 4px;
        border-bottom: 1px solid var(--leads-border);
      }
      .leads-claim-banner.locked { background: var(--leads-locked-bg); color: var(--leads-locked-text); }
      .leads-claim-banner.mine { background: var(--leads-mine-bg); color: var(--leads-mine-text); }
      .leads-claim-banner.available { background: var(--leads-available-bg); color: var(--leads-available-text); }

      .leads-section-label {
        font-size: 11px; color: var(--leads-text-muted); font-weight: 700;
        text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;
      }
      .leads-chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
      .leads-chip {
        background: transparent; border: 1px solid var(--leads-border);
        color: var(--leads-text-muted);
        padding: 5px 12px; border-radius: 999px;
        font-size: 12px; font-weight: 600; cursor: pointer;
        transition: all 0.12s ease;
      }
      .leads-chip:hover { border-color: var(--leads-border-strong); }

      .leads-field-label {
        font-size: 11px; color: var(--leads-text-muted); font-weight: 700;
        text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px;
      }
      .leads-field-value { font-size: 14px; color: var(--leads-text); line-height: 1.5; word-break: break-word; }
      .leads-field-value.empty { color: var(--leads-text-subtle); }

      .leads-modal {
        position: fixed; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 640px; max-width: 95vw; max-height: 90vh;
        background: var(--leads-bg-elevated);
        border: 1px solid var(--leads-border);
        border-radius: 14px;
        box-shadow: var(--leads-shadow-lg);
        z-index: 999;
        display: flex; flex-direction: column;
        animation: leadsModalIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .leads-modal-header {
        padding: 20px; border-bottom: 1px solid var(--leads-border);
        display: flex; justify-content: space-between; align-items: flex-start;
      }
      .leads-modal-title { font-size: 18px; font-weight: 800; color: var(--leads-text); }
      .leads-modal-sub { font-size: 13px; color: var(--leads-text-muted); margin-top: 2px; }
      .leads-modal-body { padding: 20px; overflow-y: auto; flex: 1; }
      .leads-modal-footer {
        padding: 14px 20px; border-top: 1px solid var(--leads-border);
        display: flex; justify-content: flex-end; gap: 10px;
        background: var(--leads-bg-hover);
      }

      .leads-form-section-title {
        font-size: 11px; font-weight: 800; color: var(--leads-text-muted);
        text-transform: uppercase; letter-spacing: 0.8px;
        margin-bottom: 12px; padding-bottom: 8px;
        border-bottom: 1px solid var(--leads-border);
      }
      .leads-form-label {
        font-size: 12px; font-weight: 600; color: var(--leads-text);
        display: block; margin-bottom: 4px;
      }
      .leads-input {
        width: 100%; padding: 9px 12px;
        background: var(--leads-input-bg);
        border: 1px solid var(--leads-border); border-radius: 8px;
        color: var(--leads-text); font-size: 14px; outline: none;
        transition: all 0.12s ease;
        box-sizing: border-box;
      }
      .leads-input:focus {
        border-color: var(--leads-accent);
        box-shadow: 0 0 0 3px var(--leads-accent-soft);
      }
      .leads-input::placeholder { color: var(--leads-text-subtle); }

      /* ===== CSV IMPORT ===== */
      .leads-dropzone {
        border: 2px dashed var(--leads-border-strong); border-radius: 12px;
        padding: 50px 20px; text-align: center; cursor: pointer;
        transition: all 0.15s ease; background: var(--leads-bg-hover);
      }
      .leads-dropzone:hover, .leads-dropzone.drag {
        border-color: var(--leads-accent);
        background: var(--leads-accent-soft);
      }

      .leads-mapping-grid {
        display: grid; grid-template-columns: 1fr 1fr 1.2fr;
        gap: 8px; align-items: center;
      }
      .leads-mapping-head {
        font-size: 11px; font-weight: 700; color: var(--leads-text-muted);
        text-transform: uppercase; letter-spacing: 0.5px;
        padding-bottom: 6px; border-bottom: 1px solid var(--leads-border);
      }
      .leads-mapping-csv { font-weight: 600; color: var(--leads-text); font-size: 14px; }
      .leads-mapping-sample {
        font-size: 13px; color: var(--leads-text-muted);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }

      .leads-preview-table {
        width: 100%; border-collapse: collapse; font-size: 12px;
        border: 1px solid var(--leads-border); border-radius: 8px;
      }
      .leads-preview-table th, .leads-preview-table td {
        padding: 8px 10px; text-align: left;
        border-bottom: 1px solid var(--leads-border);
      }
      .leads-preview-table th {
        background: var(--leads-bg-hover); font-weight: 700; color: var(--leads-text-muted);
        text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px;
      }

      /* ===== TOASTS ===== */
      .leads-toasts {
        position: fixed; top: 24px; right: 24px;
        display: flex; flex-direction: column; gap: 10px;
        z-index: 1000; pointer-events: none;
      }
      .leads-toast {
        padding: 12px 18px; border-radius: 10px;
        background: var(--leads-bg-elevated); color: var(--leads-text);
        border: 1px solid var(--leads-border);
        box-shadow: var(--leads-shadow-md);
        font-size: 14px; font-weight: 500;
        animation: leadsToastIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: auto;
      }
      .leads-toast-success { border-left: 3px solid var(--leads-success); }
      .leads-toast-error   { border-left: 3px solid var(--leads-danger); }
      .leads-toast-warning { border-left: 3px solid var(--leads-warning); }
      .leads-toast-info    { border-left: 3px solid var(--leads-accent); }

      /* ===== ANIMATIONS ===== */
      @keyframes leadsFadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes leadsSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      @keyframes leadsSlideUp { from { transform: translate(-50%, 24px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
      @keyframes leadsModalIn {
        from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
      @keyframes leadsToastIn {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }

      @media (max-width: 700px) {
        .leads-table { font-size: 12px; }
        .leads-table th, .leads-table td { padding: 8px 6px; }
        .leads-bulk-bar { left: 12px; right: 12px; transform: none; bottom: 12px; }
      }
    `}</style>
  );
}
