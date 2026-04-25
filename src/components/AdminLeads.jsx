import { useState, useMemo, useEffect, useCallback, useRef } from "react";

/* ============================================================
   🎯 ADMIN PROSPECTS — Full-width Apollo-style UI
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

const EMAIL_STATUS_OPTIONS = [
  { value: "validated",      label: "Validated",      color: "#22c55e" },
  { value: "not_validated",  label: "Not Validated",  color: "#f59e0b" },
  { value: "unknown",        label: "Unknown",        color: "#64748b" },
];

const FUNCTIONAL_LEVELS = [
  "C-Level","Finance","Product","Engineering","Design",
  "HR","IT","Legal","Marketing","Operations","Sales","Trainee"
];

const SIZE_OPTIONS = [
  "0–1","2–10","11–20","21–50","51–100","101–200",
  "201–500","501–1000","1001–2000","2001–5000","10000+"
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
  { key: "leadName",      label: "Prospect Name" },
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
  { key: "score",         label: "Prospect Score" },
  { key: "dealSize",      label: "Deal Size" },
  { key: "leadContact",   label: "Prospect Contact (Rep)" },
];

/* ----------------------------------------------------------
   Utilities
---------------------------------------------------------- */
const initialsOf = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || "").join("") || "?";

const avatarColor = (name = "") => {
  const colors = ["#ef4444","#f97316","#f59e0b","#84cc16","#10b981","#06b6d4","#3b82f6","#6366f1","#8b5cf6","#d946ef","#f43f5e"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const fmtMoney = (n) => {
  if (n === null || n === undefined || n === "") return "—";
  const num = Number(n);
  if (Number.isNaN(num)) return "—";
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(0)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return num.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
};

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
  reminderDate: "", reminderNotes: "",
  meetingHeldDate: "", meetingNotes: "",
  contactMethod: CONTACT_METHODS[0],
  dealSize: "", dealCategories: [],
  status: "new",
  relatedLeadId: "",
  leadContact: "",
  claimedBy: null, claimedByName: null, claimedAt: null,
  lastContactedAt: null, lastContactedBy: null,
  email_status: "unknown",
  functionalLevel: "",
  company_domain: "",
  company_size: "",
  company_annual_revenue_clean: "",
  company_total_funding_clean: "",
  company_founded_year: "",
  company_linkedin: "",
  company_phone: "",
  company_full_address: "",
  company_description: "",
});

const DUMMY_PROSPECTS = [
  {
    id: "demo-1",
    leadName: "Sarah Chen",
    companyName: "TechFlow AI",
    jobTitle: "Head of Marketing",
    industry: "SaaS",
    country: "United States",
    city: "San Francisco",
    score: 85,
    email: "s.chen@techflow.ai",
    phone: "+1 415 555 0123",
    linkedin: "https://linkedin.com/in/sarahchen",
    website: "techflow.ai",
    notes: "Interested in sponsorship package. Follow up next week.",
    followUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    followUpNotes: "Send pricing deck",
    reminderDate: "",
    reminderNotes: "",
    meetingHeldDate: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    meetingNotes: "Initial discovery call. Very interested.",
    contactMethod: "Email",
    dealSize: 15000,
    dealCategories: ["Sponsorship", "Branding"],
    status: "qualified",
    claimedBy: "me",
    claimedByName: "You",
    claimedAt: new Date().toISOString(),
    lastContactedAt: new Date().toISOString(),
    lastContactedBy: "You",
    createdAt: new Date().toISOString(),
    email_status: "validated",
    company_size: "201-500",
    company_annual_revenue_clean: 15000000,
    company_total_funding_clean: 25000000,
    company_founded_year: "2019",
  },
  {
    id: "demo-2",
    leadName: "Marcus Johnson",
    companyName: "DataSphere Inc",
    jobTitle: "Chief Technology Officer",
    industry: "Data Analytics",
    country: "United States",
    city: "New York",
    score: 72,
    email: "mjohnson@datasphere.io",
    phone: "+1 212 555 0456",
    linkedin: "https://linkedin.com/in/marcusjohnson",
    website: "datasphere.io",
    notes: "Looking for partnership opportunities. Met at TechFest 2025.",
    followUpDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    followUpNotes: "Schedule demo call",
    reminderDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
    reminderNotes: "Send reminder about demo",
    meetingHeldDate: "",
    meetingNotes: "",
    contactMethod: "LinkedIn",
    dealSize: 50000,
    dealCategories: ["Partnership", "Speaking Slot"],
    status: "contacted",
    claimedBy: null,
    claimedByName: null,
    claimedAt: null,
    lastContactedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    lastContactedBy: "System",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    email_status: "validated",
    company_size: "501-1000",
    company_annual_revenue_clean: 50000000,
    company_total_funding_clean: 75000000,
    company_founded_year: "2015",
  }
];

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

/* ---------------------------------------------------------- */
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

function autoMapHeader(header) {
  const h = header.trim().toLowerCase();
  for (const [field, aliases] of Object.entries(CSV_FIELD_ALIASES)) {
    if (aliases.includes(h)) return field;
  }
  return "skip";
}

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

function copyToClipboard(text) {
  if (!text) return;
  navigator.clipboard?.writeText(text);
}

/* ============================================================
   MAIN COMPONENT
============================================================ */
export default function AdminLeads() {
  /* ---- Theme ---- */
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("leads_theme") || "dark";
  });
  useEffect(() => { localStorage.setItem("leads_theme", theme); }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  /* ---- View switcher ---- */
  const [currentView, setCurrentView] = useState("search");

  /* ---- Current user ---- */
  const [currentUser, setCurrentUser] = useState({
    id: null, name: "You", email: "",
  });

  /* ---- Core data ---- */
  const [leads, setLeads] = useState(() => [...DUMMY_PROSPECTS]);
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
    jobTitle: "", functionalLevel: [], emailStatus: [], size: "all"
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
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toasts, setToasts] = useState([]);

  /* ---- Sidebar inputs ---- */
  const [fileName, setFileName] = useState("");
  const [fetchCount, setFetchCount] = useState(5000);
  const [contactLocation, setContactLocation] = useState("");
  const [contactCity, setContactCity] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");

  /* ============================================================
     🔌 BACKEND HOOKS
  ============================================================ */
  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() });
      if (!res.ok) throw new Error("auth failed");
      const data = await res.json();
      setCurrentUser({ id: data.id, name: data.name || "You", email: data.email || "" });
    } catch {
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
      const list = Array.isArray(data) ? data : (data.data || data.leads || []);
      setLeads(list);
      setLastSynced(new Date());
    } catch (err) {
      setSyncError(err.message || "Sync failed");
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
      pushToast("Prospect created", "success");
      return newLead;
    } catch (err) {
      const local = { ...payload, id: `local-${Date.now()}`, createdAt: new Date().toISOString() };
      setLeads((prev) => [local, ...prev]);
      pushToast("Saved locally (no backend)", "warning");
      return local;
    }
  };

  const updateLead = async (id, payload) => {
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
      pushToast(`Imported ${data.imported || newLeads.length} prospects`, "success");
      await fetchLeads({ silent: true });
    } catch {
      const local = newLeads.map((l) => ({
        ...l, id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        createdAt: new Date().toISOString(),
      }));
      setLeads((prev) => [...local, ...prev]);
      pushToast(`Imported ${local.length} prospects (local only)`, "warning");
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
      pushToast("Prospect claimed — others can't reach out now", "success");
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
    } catch { }
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
      } catch { }
      pushToast(`Deleted ${idsArr.length} prospects`, "success");
    } else if (action === "update") {
      setLeads((prev) => prev.map((l) =>
        ids.has(l.id) ? { ...l, ...payload } : l
      ));
      try {
        await fetch(`${API_BASE}/leads/bulk-update`, {
          method: "POST", headers: authHeaders(),
          body: JSON.stringify({ ids: idsArr, updates: payload }),
        });
      } catch { }
      pushToast(`Updated ${idsArr.length} prospects`, "success");
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
      } catch { }
      pushToast(`Claimed ${idsArr.length} prospects`, "success");
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
      } catch { }
      pushToast(`Released ${idsArr.length} prospects`, "success");
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
        [l.leadName, l.companyName, l.email, l.phone, l.jobTitle, l.leadContact, l.country, l.city, l.company_domain]
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
    if (filters.jobTitle?.trim()) {
      const q = filters.jobTitle.toLowerCase();
      out = out.filter((l) => (l.jobTitle || "").toLowerCase().includes(q));
    }
    if (filters.functionalLevel?.length) {
      out = out.filter((l) => filters.functionalLevel.some((lvl) =>
        (l.jobTitle || "").toLowerCase().includes(lvl.toLowerCase()) ||
        (l.functionalLevel || "").toLowerCase() === lvl.toLowerCase()
      ));
    }
    if (filters.emailStatus?.length) {
      out = out.filter((l) => filters.emailStatus.includes(l.email_status || "unknown"));
    }
    if (filters.size !== "all") {
      out = out.filter((l) => (l.company_size || l.size || "") === filters.size);
    }
    if (contactLocation.trim()) {
      const q = contactLocation.toLowerCase();
      out = out.filter((l) =>
        (l.country || "").toLowerCase().includes(q) ||
        (l.state || "").toLowerCase().includes(q)
      );
    }
    if (contactCity.trim()) {
      const q = contactCity.toLowerCase();
      out = out.filter((l) => (l.city || "").toLowerCase().includes(q));
    }
    if (companyDomain.trim()) {
      const q = companyDomain.toLowerCase();
      out = out.filter((l) =>
        (l.company_domain || l.website || "").toLowerCase().includes(q)
      );
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
  }, [leads, search, filters, sortBy, currentUser.id, contactLocation, contactCity, companyDomain]);

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
      pushToast("Prospect name is required", "error"); return;
    }
    if (formMode === "create") await createLead(formData);
    else await updateLead(formData.id, formData);
    setShowFormModal(false);
  };

  const handleExportCSV = () => {
    const fields = ALL_LEAD_FIELDS.filter((f) => f.key !== "skip");
    const csv = leadsToCSV(filteredLeads, fields);
    downloadFile(`prospects-${new Date().toISOString().slice(0, 10)}.csv`, csv);
    pushToast(`Exported ${filteredLeads.length} prospects`, "success");
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
      jobTitle: "", functionalLevel: [], emailStatus: [], size: "all"
    });
    setSearch("");
    setContactLocation("");
    setContactCity("");
    setCompanyDomain("");
  };

  const activeFilterCount = useMemo(() => {
    let count = Object.values(filters).filter((v) => {
      if (Array.isArray(v)) return v.length > 0;
      return v !== "all" && v !== "";
    }).length;
    if (search) count++;
    if (contactLocation) count++;
    if (contactCity) count++;
    if (companyDomain) count++;
    return count;
  }, [filters, search, contactLocation, contactCity, companyDomain]);

  const removeFilter = (key) => {
    if (key === "search") setSearch("");
    else if (key === "contactLocation") setContactLocation("");
    else if (key === "contactCity") setContactCity("");
    else if (key === "companyDomain") setCompanyDomain("");
    else if (key === "jobTitle") setFilters((f) => ({ ...f, jobTitle: "" }));
    else if (key === "functionalLevel") setFilters((f) => ({ ...f, functionalLevel: [] }));
    else if (key === "emailStatus") setFilters((f) => ({ ...f, emailStatus: [] }));
    else setFilters((f) => ({ ...f, [key]: Array.isArray(f[key]) ? [] : "all" }));
  };

  const toggleFunctionalLevel = (lvl) => {
    setFilters((prev) => {
      const arr = prev.functionalLevel || [];
      const next = arr.includes(lvl) ? arr.filter((x) => x !== lvl) : [...arr, lvl];
      return { ...prev, functionalLevel: next };
    });
  };

  const toggleEmailStatus = (st) => {
    setFilters((prev) => {
      const arr = prev.emailStatus || [];
      const next = arr.includes(st) ? arr.filter((x) => x !== st) : [...arr, st];
      return { ...prev, emailStatus: next };
    });
  };

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <div className="leads-root" data-theme={theme}>
      <LeadsStyles />

      {/* ===== TOP NAVIGATION ===== */}
      <nav className="leads-nav">
        <div className="leads-nav-left">
          <div className="leads-nav-brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            <span>Prospects</span>
          </div>
          <div className="leads-nav-tabs">
            {[
              { key: "search", label: "Prospect Search" },
              { key: "lists", label: "Lists" },
              { key: "enrichment", label: "Enrichment" },
              { key: "analytics", label: "Analytics" },
            ].map((tab) => (
              <button
                key={tab.key}
                className={currentView === tab.key ? "active" : ""}
                onClick={() => setCurrentView(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="leads-nav-right">
          <span className="leads-contacts-badge">
            <span className="leads-live-dot" /> {stats.total} prospects
          </span>
          <button className="leads-nav-icon" title="Refresh" onClick={() => fetchLeads()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          </button>
          <button className="leads-nav-icon" title="Toggle theme" onClick={toggleTheme}>
            {theme === "dark" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          <div className="leads-avatar-sm" style={{ background: avatarColor(currentUser.name) }}>
            {initialsOf(currentUser.name)}
          </div>
        </div>
      </nav>

      {/* ===== VIEW: PROSPECT SEARCH ===== */}
      {currentView === "search" && (
        <div className="leads-layout">
          {/* Sidebar */}
          <aside className="leads-sidebar">
            <div className="leads-sidebar-header">
              <h3>Search Filters</h3>
              {activeFilterCount > 0 && (
                <button className="leads-clear-all" onClick={resetFilters}>Clear all</button>
              )}
            </div>

            <SidebarSection title="General Settings" defaultOpen>
              <SidebarInput label="File Name / Run Label" placeholder="e.g. US-SaaS-Marketing-Q2" value={fileName} onChange={setFileName} />
              <SidebarInput label="Fetch Count (Max Prospects)" type="number" placeholder="5000" value={fetchCount} onChange={(v) => setFetchCount(Number(v))} helper="Leave empty to fetch all matches" />
            </SidebarSection>

            <SidebarSection title="People Targeting" defaultOpen>
              <SidebarInput label="Job Title" placeholder='e.g. "Head of Marketing","VP Marketing"' value={filters.jobTitle} onChange={(v) => setFilters((f) => ({ ...f, jobTitle: v }))} />
              <div className="leads-filter-group">
                <div className="leads-filter-label">Functional Level</div>
                <div className="leads-checkbox-grid">
                  {FUNCTIONAL_LEVELS.map((level) => (
                    <label key={level} className="leads-checkbox-label">
                      <input type="checkbox" checked={filters.functionalLevel.includes(level)} onChange={() => toggleFunctionalLevel(level)} />
                      <span>{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </SidebarSection>

            <SidebarSection title="Location (Include)" defaultOpen>
              <SidebarInput label="Region / Country / State" placeholder="e.g. United States, EMEA" value={contactLocation} onChange={setContactLocation} />
              <SidebarInput label="City" placeholder="e.g. San Francisco" value={contactCity} onChange={setContactCity} />
            </SidebarSection>

            <SidebarSection title="Email Quality" defaultOpen>
              <div className="leads-checkbox-group">
                {EMAIL_STATUS_OPTIONS.map((s) => (
                  <label key={s.value} className="leads-checkbox-label">
                    <input type="checkbox" checked={filters.emailStatus.includes(s.value)} onChange={() => toggleEmailStatus(s.value)} />
                    <span>{s.label}</span>
                  </label>
                ))}
              </div>
            </SidebarSection>

            <SidebarSection title="Company Targeting">
              <SidebarInput label="Company Domain" placeholder="e.g. google.com" value={companyDomain} onChange={setCompanyDomain} />
              <SidebarSelect label="Company Size" value={filters.size} onChange={(v) => setFilters((f) => ({ ...f, size: v }))}
                options={[{ value: "all", label: "Any size" }, ...SIZE_OPTIONS.map((s) => ({ value: s, label: s }))]} />
              <SidebarSelect label="Industry" value={filters.industry} onChange={(v) => setFilters((f) => ({ ...f, industry: v }))}
                options={[{ value: "all", label: "All industries" }, ...uniqueIndustries.map((c) => ({ value: c, label: c }))]} />
            </SidebarSection>

            <div className="leads-sidebar-actions">
              <button className="leads-btn-primary leads-btn-run" onClick={() => fetchLeads()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Run Search
              </button>
              <button className="leads-btn-secondary leads-btn-save" onClick={() => pushToast("Search config saved", "success")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Save Search Config
              </button>
            </div>
          </aside>

          {/* Main */}
          <main className="leads-main">
            <div className="leads-main-header">
              <div className="leads-search-bar">
                <svg className="leads-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" placeholder="Search results by name, company, or domain…" value={search} onChange={(e) => setSearch(e.target.value)} />
                <kbd className="leads-kbd">⌘K</kbd>
              </div>
              <div className="leads-export-group">
                <button className="leads-btn-primary" onClick={openCreate}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  New Prospect
                </button>
                <button className="leads-btn-secondary" onClick={() => setShowImportModal(true)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Import
                </button>
                <button className="leads-btn-secondary" onClick={handleExportCSV}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Export CSV</button>
                <button className="leads-btn-secondary" onClick={handleExportCSV}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Export XLSX</button>
                <button className="leads-btn-secondary" onClick={handleExportCSV}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Export JSON</button>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="leads-active-bar">
                <span className="leads-active-label">Active filters:</span>
                {search && <FilterPill label={`Search: "${search}"`} onRemove={() => removeFilter("search")} />}
                {filters.jobTitle && <FilterPill label={`Title: ${filters.jobTitle}`} onRemove={() => removeFilter("jobTitle")} />}
                {filters.functionalLevel.map((l) => <FilterPill key={l} label={l} onRemove={() => toggleFunctionalLevel(l)} />)}
                {filters.emailStatus.map((s) => {
                  const meta = EMAIL_STATUS_OPTIONS.find((o) => o.value === s);
                  return <FilterPill key={s} label={meta?.label || s} onRemove={() => toggleEmailStatus(s)} />;
                })}
                {contactLocation && <FilterPill label={`Loc: ${contactLocation}`} onRemove={() => removeFilter("contactLocation")} />}
                {contactCity && <FilterPill label={`City: ${contactCity}`} onRemove={() => removeFilter("contactCity")} />}
                {companyDomain && <FilterPill label={`Domain: ${companyDomain}`} onRemove={() => removeFilter("companyDomain")} />}
                {filters.size !== "all" && <FilterPill label={`Size: ${filters.size}`} onRemove={() => removeFilter("size")} />}
                {filters.industry !== "all" && <FilterPill label={filters.industry} onRemove={() => removeFilter("industry")} />}
                {filters.country !== "all" && <FilterPill label={filters.country} onRemove={() => removeFilter("country")} />}
                {filters.status !== "all" && <FilterPill label={statusMeta(filters.status).label} onRemove={() => removeFilter("status")} />}
                {filters.score !== "all" && <FilterPill label={`Score: ${filters.score}`} onRemove={() => removeFilter("score")} />}
                {filters.claim !== "all" && <FilterPill label={`Claim: ${filters.claim}`} onRemove={() => removeFilter("claim")} />}
              </div>
            )}

            <div className="leads-results-header">
              <div className="leads-results-title">
                <h2>Search Results</h2>
                <span className="leads-count-badge">{filteredLeads.length} prospects</span>
              </div>
              <div className="leads-sort">
                <span>Sort by:</span>
                <select value={`${sortBy.field}-${sortBy.direction}`} onChange={(e) => {
                  const [field, direction] = e.target.value.split("-");
                  setSortBy({ field, direction });
                }}>
                  <option value="score-desc">Relevance</option>
                  <option value="leadName-asc">Name A-Z</option>
                  <option value="leadName-desc">Name Z-A</option>
                  <option value="companyName-asc">Company A-Z</option>
                  <option value="dealSize-desc">Deal Size ↓</option>
                  <option value="createdAt-desc">Newest</option>
                </select>
              </div>
            </div>

            <div className="leads-table-card">
              {loading ? (
                <EmptyState icon={<Spinner />} title="Loading prospects…" text="Fetching from your backend." />
              ) : filteredLeads.length === 0 ? (
                leads.length === 0 ? (
                  <EmptyState icon="📭" title="No prospects yet" text="Import a CSV or add one manually to get started." cta={{ label: "Add your first prospect", onClick: openCreate }} secondaryCta={{ label: "Import CSV", onClick: () => setShowImportModal(true) }} />
                ) : (
                  <EmptyState icon="🔍" title="No matches" text="Try clearing a filter or adjusting your search." />
                )
              ) : (
                <>
                  <div className="leads-table-scroll">
                    <table className="leads-table">
                      <thead>
                        <tr>
                          <th className="th-checkbox"><input type="checkbox" className="leads-checkbox" checked={allSelected} ref={(el) => { if (el) el.indeterminate = !allSelected && someSelected; }} onChange={toggleSelectAll} /></th>
                          <th>Person</th>
                          <th>Company</th>
                          <th>Title</th>
                          <th>Location</th>
                          <th>Email Status</th>
                          <th>Company Size</th>
                          <th>Revenue / Funding</th>
                          <th className="th-actions">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagedLeads.map((lead) => (
                          <ApolloLeadRow
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
                  </div>
                  <Pagination page={page} totalPages={totalPages} pageSize={pageSize} totalItems={filteredLeads.length} onPage={setPage} onPageSize={setPageSize} />
                </>
              )}
            </div>
          </main>
        </div>
      )}

      {/* ===== VIEW: LISTS ===== */}
      {currentView === "lists" && (
        <ListsView leads={leads} currentUserId={currentUser.id} onOpen={(lead) => setDrawerLead(lead)} />
      )}

      {/* ===== VIEW: ENRICHMENT ===== */}
      {currentView === "enrichment" && (
        <EnrichmentView leads={leads} onImport={() => setShowImportModal(true)} onExport={handleExportCSV} />
      )}

      {/* ===== VIEW: ANALYTICS ===== */}
      {currentView === "analytics" && (
        <AnalyticsView leads={leads} stats={stats} />
      )}

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
            downloadFile(`selected-prospects.csv`, leadsToCSV(selected, fields));
            pushToast(`Exported ${selected.length} prospects`, "success");
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
          onImport={async (rows) => { await bulkImport(rows); setShowImportModal(false); }}
        />
      )}

      {/* ===== DELETE CONFIRM ===== */}
      {confirmDelete && (
        <ConfirmModal
          title={confirmDelete === "bulk" ? `Delete ${selectedIds.size} prospects?` : "Delete this prospect?"}
          message="This action cannot be undone."
          confirmLabel="Delete"
          danger
          onConfirm={async () => {
            if (confirmDelete === "bulk") await bulkAction("delete", selectedIds);
            else await deleteLead(confirmDelete);
            setConfirmDelete(null); setDrawerLead(null);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* ===== TOASTS ===== */}
      <div className="leads-toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`leads-toast leads-toast-${t.type}`}>{t.message}</div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   VIEWS
============================================================ */

function ListsView({ leads, currentUserId, onOpen }) {
  const lists = [
    { key: "mine", label: "My Prospects", filter: (l) => l.claimedBy === currentUserId },
    { key: "hot", label: "Hot Prospects", filter: (l) => (Number(l.score) || 0) >= 80 },
    { key: "new", label: "New This Week", filter: (l) => l.createdAt && (Date.now() - new Date(l.createdAt).getTime()) < 7 * 86400000 },
    { key: "overdue", label: "Overdue Follow-ups", filter: (l) => isOverdue(l.followUpDate) },
    { key: "unclaimed", label: "Unclaimed", filter: (l) => !l.claimedBy },
    { key: "validated", label: "Validated Emails", filter: (l) => l.email_status === "validated" },
  ];

  const [activeList, setActiveList] = useState("mine");

  const active = lists.find((l) => l.key === activeList);
  const listLeads = active ? leads.filter(active.filter) : [];

  return (
    <div className="leads-view-page">
      <div className="leads-view-header">
        <h2>Lists</h2>
        <p>Organize and access your saved prospect segments.</p>
      </div>
      <div className="leads-lists-layout">
        <div className="leads-lists-sidebar">
          {lists.map((list) => {
            const count = leads.filter(list.filter).length;
            return (
              <button
                key={list.key}
                className={`leads-list-item ${activeList === list.key ? "active" : ""}`}
                onClick={() => setActiveList(list.key)}
              >
                <span className="leads-list-name">{list.label}</span>
                <span className="leads-list-count">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="leads-lists-content">
          <div className="leads-results-header" style={{ padding: "0 0 12px" }}>
            <div className="leads-results-title">
              <h3>{active?.label}</h3>
              <span className="leads-count-badge">{listLeads.length} prospects</span>
            </div>
          </div>
          {listLeads.length === 0 ? (
            <EmptyState icon="📂" title="No prospects in this list" text="This list is empty right now." />
          ) : (
            <div className="leads-table-card" style={{ margin: 0 }}>
              <div className="leads-table-scroll">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Person</th><th>Company</th><th>Title</th><th>Location</th><th>Email Status</th><th>Company Size</th><th>Revenue / Funding</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listLeads.slice(0, 50).map((lead) => (
                      <ApolloLeadRow
                        key={lead.id}
                        lead={lead}
                        selected={false}
                        currentUserId={currentUserId}
                        onToggleSelect={() => {}}
                        onOpen={() => onOpen(lead)}
                        onClaim={() => {}}
                        onRelease={() => {}}
                        onEdit={() => {}}
                        onDelete={() => {}}
                        hideCheckbox
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EnrichmentView({ leads, onImport, onExport }) {
  const enriched = leads.filter((l) => l.email_status === "validated").length;
  const withPhone = leads.filter((l) => l.phone).length;
  const withLinkedIn = leads.filter((l) => l.linkedin).length;
  const withCompanyData = leads.filter((l) => l.company_size || l.company_annual_revenue_clean).length;

  return (
    <div className="leads-view-page">
      <div className="leads-view-header">
        <h2>Enrichment</h2>
        <p>Bulk enrich and verify your prospect data.</p>
      </div>
      <div className="leads-enrich-grid">
        <div className="leads-enrich-card">
          <div className="leads-enrich-icon" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>✉</div>
          <div className="leads-enrich-value">{enriched} <span>/ {leads.length}</span></div>
          <div className="leads-enrich-label">Emails Validated</div>
        </div>
        <div className="leads-enrich-card">
          <div className="leads-enrich-icon" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>☎</div>
          <div className="leads-enrich-value">{withPhone} <span>/ {leads.length}</span></div>
          <div className="leads-enrich-label">Phones Enriched</div>
        </div>
        <div className="leads-enrich-card">
          <div className="leads-enrich-icon" style={{ background: "rgba(139,92,246,0.12)", color: "#8b5cf6" }}>in</div>
          <div className="leads-enrich-value">{withLinkedIn} <span>/ {leads.length}</span></div>
          <div className="leads-enrich-label">LinkedIn Profiles</div>
        </div>
        <div className="leads-enrich-card">
          <div className="leads-enrich-icon" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>🏢</div>
          <div className="leads-enrich-value">{withCompanyData} <span>/ {leads.length}</span></div>
          <div className="leads-enrich-label">Company Data</div>
        </div>
      </div>
      <div className="leads-enrich-actions">
        <button className="leads-btn-primary" onClick={onImport}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Import Prospects to Enrich
        </button>
        <button className="leads-btn-secondary" onClick={onExport}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export Enriched Data
        </button>
      </div>
    </div>
  );
}

function AnalyticsView({ leads, stats }) {
  const statusCounts = useMemo(() => {
    const counts = {};
    STATUS_OPTIONS.forEach((s) => counts[s.value] = 0);
    leads.forEach((l) => { if (counts[l.status] !== undefined) counts[l.status]++; });
    return STATUS_OPTIONS.map((s) => ({ ...s, count: counts[s.value] }));
  }, [leads]);

  const countryCounts = useMemo(() => {
    const counts = {};
    leads.forEach((l) => { if (l.country) counts[l.country] = (counts[l.country] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [leads]);

  const scoreDistribution = useMemo(() => {
    return [
      { label: "Hot (80+)", count: leads.filter((l) => (Number(l.score) || 0) >= 80).length, color: "#22c55e" },
      { label: "Warm (60-79)", count: leads.filter((l) => { const s = Number(l.score) || 0; return s >= 60 && s < 80; }).length, color: "#10b981" },
      { label: "Lukewarm (40-59)", count: leads.filter((l) => { const s = Number(l.score) || 0; return s >= 40 && s < 60; }).length, color: "#f59e0b" },
      { label: "Cold (<40)", count: leads.filter((l) => (Number(l.score) || 0) < 40).length, color: "#94a3b8" },
    ];
  }, [leads]);

  const maxStatus = Math.max(...statusCounts.map((s) => s.count), 1);
  const maxCountry = Math.max(...countryCounts.map((c) => c[1]), 1);
  const maxScore = Math.max(...scoreDistribution.map((s) => s.count), 1);

  return (
    <div className="leads-view-page">
      <div className="leads-view-header">
        <h2>Analytics</h2>
        <p>Insights and performance metrics from your prospect pipeline.</p>
      </div>

      <div className="leads-stats-row">
        <StatCard label="Total Prospects" value={stats.total} icon="👥" accent="#6366f1" />
        <StatCard label="Hot Prospects" value={stats.hot} icon="🔥" accent="#22c55e" />
        <StatCard label="Claimed by You" value={stats.claimedByMe} icon="✓" accent="#8b5cf6" />
        <StatCard label="Overdue" value={stats.overdue} icon="⏰" accent="#ef4444" />
        <StatCard label="Open Pipeline" value={fmtMoney(stats.pipeline)} icon="💰" accent="#f59e0b" isText />
      </div>

      <div className="leads-analytics-grid">
        <div className="leads-analytics-card">
          <h3>Pipeline by Status</h3>
          <div className="leads-chart">
            {statusCounts.map((s) => (
              <div key={s.value} className="leads-chart-row">
                <span className="leads-chart-label">{s.label}</span>
                <div className="leads-chart-bar-bg">
                  <div className="leads-chart-bar-fill" style={{ width: `${(s.count / maxStatus) * 100}%`, background: s.color }} />
                </div>
                <span className="leads-chart-value">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="leads-analytics-card">
          <h3>Prospects by Country</h3>
          <div className="leads-chart">
            {countryCounts.map(([country, count]) => (
              <div key={country} className="leads-chart-row">
                <span className="leads-chart-label">{country}</span>
                <div className="leads-chart-bar-bg">
                  <div className="leads-chart-bar-fill" style={{ width: `${(count / maxCountry) * 100}%`, background: "var(--leads-accent)" }} />
                </div>
                <span className="leads-chart-value">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="leads-analytics-card">
          <h3>Score Distribution</h3>
          <div className="leads-chart">
            {scoreDistribution.map((s) => (
              <div key={s.label} className="leads-chart-row">
                <span className="leads-chart-label">{s.label}</span>
                <div className="leads-chart-bar-bg">
                  <div className="leads-chart-bar-fill" style={{ width: `${(s.count / maxScore) * 100}%`, background: s.color }} />
                </div>
                <span className="leads-chart-value">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SUB-COMPONENTS
============================================================ */

function Spinner() { return <div className="leads-spinner" />; }

function StatCard({ label, value, icon, accent, sub, isText }) {
  return (
    <div className="leads-stat-card">
      <div className="leads-stat-icon" style={{ background: `${accent}18`, color: accent }}>{icon}</div>
      <div className="leads-stat-body">
        <div className="leads-stat-label">{label}</div>
        <div className="leads-stat-value" style={{ fontSize: isText ? 18 : 24, color: accent }}>{value}</div>
        {sub && <div className="leads-stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

function SidebarSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="leads-sidebar-section">
      <button className="leads-sidebar-section-title" onClick={() => setOpen(!open)}>
        {title}
        <span className={`leads-chevron ${open ? "open" : ""}`}>▼</span>
      </button>
      {open && <div className="leads-sidebar-section-body">{children}</div>}
    </div>
  );
}

function SidebarInput({ label, value, onChange, type = "text", placeholder, helper }) {
  return (
    <div className="leads-sidebar-field">
      <label className="leads-sidebar-label">{label}</label>
      <input className="leads-sidebar-input" type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)} />
      {helper && <div className="leads-sidebar-helper">{helper}</div>}
    </div>
  );
}

function SidebarSelect({ label, value, onChange, options }) {
  return (
    <div className="leads-sidebar-field">
      <label className="leads-sidebar-label">{label}</label>
      <select className="leads-sidebar-input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function FilterPill({ label, onRemove }) {
  return (
    <span className="leads-filter-pill">
      {label}
      <button onClick={onRemove} className="leads-filter-pill-remove">✕</button>
    </span>
  );
}

function ApolloLeadRow({ lead, selected, currentUserId, onToggleSelect, onOpen, onClaim, onRelease, onEdit, onDelete, hideCheckbox }) {
  const overdue = isOverdue(lead.followUpDate);
  const claimedByMe = lead.claimedBy === currentUserId;
  const claimedByOther = lead.claimedBy && !claimedByMe;
  const loc = [lead.city, lead.country].filter(Boolean).join(", ") || "—";

  return (
    <tr className={`leads-row ${selected ? "selected" : ""} ${claimedByOther ? "locked" : ""}`} onClick={onOpen}>
      {!hideCheckbox && (
        <td onClick={(e) => e.stopPropagation()} className="td-checkbox">
          <input type="checkbox" className="leads-checkbox" checked={selected} onChange={onToggleSelect} />
        </td>
      )}
      {hideCheckbox && <td />}
      <td>
        <div className="leads-person-cell">
          <div className="leads-avatar" style={{ background: avatarColor(lead.leadName) }}>{initialsOf(lead.leadName)}</div>
          <div className="leads-person-info">
            <div className="leads-person-name">{lead.leadName || "(unnamed)"}</div>
            <div className="leads-person-email">{lead.email || <span style={{ color: "var(--leads-text-subtle)" }}>No email</span>}</div>
          </div>
        </div>
      </td>
      <td>
        <div className="leads-company-cell">
          <div className="leads-company-name">{lead.companyName || "—"}</div>
          <div className="leads-company-domain">{lead.company_domain || lead.website || "—"}</div>
        </div>
      </td>
      <td className="leads-title-cell">{lead.jobTitle || "—"}</td>
      <td className="leads-location-cell">
        <span className="leads-pin">📍</span> {loc}
      </td>
      <td><EmailStatusBadge status={lead.email_status} /></td>
      <td className="leads-size-cell">{lead.company_size || "—"}</td>
      <td>
        <div className="leads-revenue-cell">
          <div className="leads-revenue-main">
            {lead.company_annual_revenue_clean ? fmtMoney(lead.company_annual_revenue_clean) : (lead.dealSize ? fmtMoney(lead.dealSize) : "—")}
          </div>
          {lead.company_total_funding_clean && (
            <div className="leads-revenue-sub">{lead.company_total_funding_clean}</div>
          )}
        </div>
      </td>
      <td onClick={(e) => e.stopPropagation()} className="td-actions">
        {claimedByMe ? (
          <button className="leads-action-btn claimed" onClick={onRelease}>Release</button>
        ) : claimedByOther ? (
          <span className="leads-locked-text">🔒 {lead.claimedByName}</span>
        ) : (
          <button className="leads-action-btn" onClick={onClaim}>Claim</button>
        )}
        <button className="leads-icon-btn" title="Edit" onClick={onEdit}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button className="leads-icon-btn leads-icon-btn-danger" title="Delete" onClick={onDelete}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </td>
    </tr>
  );
}

function EmailStatusBadge({ status }) {
  const meta = EMAIL_STATUS_OPTIONS.find((s) => s.value === status) || EMAIL_STATUS_OPTIONS[2];
  return (
    <span className="email-badge" style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}40` }}>
      <span className="email-badge-dot" style={{ background: meta.color }} />
      {meta.label}
    </span>
  );
}

function EmptyState({ icon, title, text, cta, secondaryCta }) {
  return (
    <div className="leads-empty">
      <div className="leads-empty-icon">{icon}</div>
      <div className="leads-empty-title">{title}</div>
      <div className="leads-empty-text">{text}</div>
      <div className="leads-empty-actions">
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
        {totalItems === 0 ? "No prospects" : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, totalItems)} of ${totalItems}`}
      </div>
      <div className="leads-pagination-controls">
        <select className="leads-select" value={pageSize} onChange={(e) => onPageSize(Number(e.target.value))} style={{ padding: "6px 10px" }}>
          {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s} / page</option>)}
        </select>
        <button className="leads-pg-btn" onClick={() => onPage(1)} disabled={page === 1}>«</button>
        <button className="leads-pg-btn" onClick={() => onPage(page - 1)} disabled={page === 1}>‹</button>
        <span className="leads-pagination-current">{page} / {totalPages}</span>
        <button className="leads-pg-btn" onClick={() => onPage(page + 1)} disabled={page === totalPages}>›</button>
        <button className="leads-pg-btn" onClick={() => onPage(totalPages)} disabled={page === totalPages}>»</button>
      </div>
    </div>
  );
}

function BulkActionBar({ count, onClear, onClaim, onRelease, onChangeStatus, onDelete, onExport }) {
  return (
    <div className="leads-bulk-bar">
      <div className="leads-bulk-count"><span className="leads-bulk-num">{count}</span> selected<button className="leads-btn-text" onClick={onClear} style={{ marginLeft: 12 }}>Clear</button></div>
      <div className="leads-bulk-actions">
        <button className="leads-btn-secondary" onClick={onClaim}>Claim</button>
        <button className="leads-btn-secondary" onClick={onRelease}>Release</button>
        <select className="leads-select" onChange={(e) => { if (e.target.value) { onChangeStatus(e.target.value); e.target.value = ""; } }} defaultValue="">
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

  const companySize = lead.company_size || lead.companySize || "—";
  const companyRevenue = lead.company_annual_revenue_clean || lead.company_annual_revenue || lead.companyRevenue;
  const companyFunding = lead.company_total_funding_clean || lead.company_total_funding || lead.companyFunding;
  const companyFounded = lead.company_founded_year || lead.companyFounded || "—";
  const companyLinkedIn = lead.company_linkedin || lead.companyLinkedin;
  const companyPhone = lead.company_phone || lead.companyPhone;
  const companyAddress = lead.company_full_address || lead.companyAddress;
  const companyDesc = lead.company_description || lead.companyDesc;

  return (
    <>
      <div className="leads-backdrop" onClick={onClose} />
      <aside className="leads-drawer">
        <div className="leads-drawer-header">
          <div className="leads-drawer-header-main">
            <div className="leads-avatar leads-avatar-lg" style={{ background: avatarColor(lead.leadName) }}>{initialsOf(lead.leadName)}</div>
            <div className="leads-drawer-titles">
              <div className="leads-drawer-name">{lead.leadName || "(unnamed)"}</div>
              <div className="leads-drawer-sub">{lead.jobTitle}{lead.jobTitle && lead.companyName ? " · " : ""}{lead.companyName}</div>
              <div className="leads-drawer-meta">{lead.city && lead.country ? `${lead.city}, ${lead.country}` : lead.country || lead.city || ""}</div>
            </div>
          </div>
          <button className="leads-icon-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {claimedByOther && (
          <div className="leads-claim-banner locked">
            <span className="leads-claim-banner-icon">🔒</span>
            Claimed by <b>{lead.claimedByName}</b> · {fmtRelative(lead.claimedAt)}
          </div>
        )}
        {claimedByMe && (
          <div className="leads-claim-banner mine">
            <span className="leads-claim-banner-icon">✓</span>
            You claimed this {fmtRelative(lead.claimedAt)}.
            <button className="leads-mini-btn" onClick={onRelease}>Release</button>
          </div>
        )}
        {!lead.claimedBy && (
          <div className="leads-claim-banner available">
            <span className="leads-claim-banner-icon">🟢</span>
            Available — claim before reaching out
            <button className="leads-mini-btn primary" onClick={onClaim}>Claim</button>
          </div>
        )}

        <div className="leads-drawer-quick">
          <button className="leads-quick-btn" onClick={onEdit}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
          {lead.email && <a className="leads-quick-btn" href={`mailto:${lead.email}`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>Email</a>}
          {lead.phone && <a className="leads-quick-btn" href={`tel:${lead.phone}`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>Call</a>}
          {lead.linkedin && <a className="leads-quick-btn" href={lead.linkedin} target="_blank" rel="noreferrer"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>LinkedIn</a>}
          <button className="leads-quick-btn leads-quick-btn-danger" onClick={onDelete}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>Delete</button>
        </div>

        <div className="leads-drawer-section">
          <div className="leads-section-label">Pipeline Status</div>
          <div className="leads-chip-row">
            {STATUS_OPTIONS.map((s) => (
              <button key={s.value} onClick={() => onStatusChange(s.value)} className="leads-chip"
                style={{ background: lead.status === s.value ? `${s.color}18` : "transparent", borderColor: lead.status === s.value ? s.color : "var(--leads-border)", color: lead.status === s.value ? s.color : "var(--leads-text-muted)" }}>
                {lead.status === s.value && <span style={{ marginRight: 4 }}>✓</span>}{s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="leads-drawer-body">
          <DrawerSection title="Contact Information">
            <div className="leads-drawer-grid">
              <DrawerField label="Email" value={lead.email} copyable />
              <DrawerField label="Phone" value={lead.phone} />
              <DrawerField label="LinkedIn" value={lead.linkedin} link />
              <DrawerField label="Website" value={lead.website} link />
            </div>
          </DrawerSection>

          <DrawerSection title="Company Profile">
            <div className="leads-drawer-grid">
              <DrawerField label="Company" value={lead.companyName} />
              <DrawerField label="Industry" value={lead.industry} />
              <DrawerField label="Size" value={companySize} />
              <DrawerField label="Annual Revenue" value={companyRevenue ? fmtMoney(companyRevenue) : "—"} />
              <DrawerField label="Total Funding" value={companyFunding ? fmtMoney(companyFunding) : "—"} />
              <DrawerField label="Founded" value={companyFounded} />
              {companyPhone && <DrawerField label="Company Phone" value={companyPhone} />}
              {companyLinkedIn && <DrawerField label="Company LinkedIn" value={companyLinkedIn} link />}
            </div>
            {companyDesc && <div className="leads-drawer-desc">{companyDesc}</div>}
            {companyAddress && <DrawerField label="Address" value={companyAddress} />}
          </DrawerSection>

          <DrawerSection title="Ownership & Contact History">
            <div className="leads-drawer-grid">
              <DrawerField label="Claimed By" value={lead.claimedByName ? `${lead.claimedByName} (${fmtRelative(lead.claimedAt)})` : "Unclaimed"} />
              <DrawerField label="Last Contacted By" value={lead.lastContactedBy ? `${lead.lastContactedBy} (${fmtRelative(lead.lastContactedAt)})` : "—"} />
            </div>
          </DrawerSection>

          <DrawerSection title="Deal">
            <div className="leads-drawer-grid">
              <DrawerField label="Deal Size" value={fmtMoney(lead.dealSize)} />
              <DrawerField label="Contact Method" value={lead.contactMethod} />
              <DrawerField label="Prospect Contact (Rep)" value={lead.leadContact} />
            </div>
            {lead.dealCategories?.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {lead.dealCategories.map((c) => <span key={c} className="leads-pill">{c}</span>)}
              </div>
            )}
          </DrawerSection>

          <DrawerSection title="Follow-up">
            <DrawerField label="Follow-up Date" value={fmtDate(lead.followUpDate)} />
            <DrawerField label="Follow-up Notes" value={lead.followUpNotes} multiline />
          </DrawerSection>

          <DrawerSection title="Reminder">
            <DrawerField label="Reminder Date" value={fmtDate(lead.reminderDate)} />
            <DrawerField label="Reminder Notes" value={lead.reminderNotes} multiline />
          </DrawerSection>

          <DrawerSection title="Meeting Held">
            <DrawerField label="Meeting Date" value={fmtDate(lead.meetingHeldDate)} />
            <DrawerField label="Meeting Notes" value={lead.meetingNotes} multiline />
          </DrawerSection>

          <DrawerSection title="Notes">
            <DrawerField label="Prospect Notes" value={lead.notes} multiline />
            {related && <DrawerField label="Related Prospect" value={`${related.leadName} (${related.companyName || "—"})`} />}
            {lead.lastContactedAt && <DrawerField label="Last Contacted" value={`${fmtDate(lead.lastContactedAt)} by ${lead.lastContactedBy || "—"}`} />}
          </DrawerSection>
        </div>
      </aside>
    </>
  );
}

function DrawerSection({ title, children }) {
  return (
    <div className="leads-drawer-section-block">
      <div className="leads-drawer-section-title">{title}</div>
      {children}
    </div>
  );
}

function DrawerField({ label, value, multiline, copyable, link }) {
  const isEmpty = !value || value === "—";
  const display = isEmpty ? "—" : value;
  return (
    <div className="leads-drawer-field">
      <div className="leads-field-label">{label}</div>
      <div className={`leads-field-value ${isEmpty ? "empty" : ""}`} style={{ whiteSpace: multiline ? "pre-wrap" : "nowrap" }}>
        {link && !isEmpty ? <a href={display} target="_blank" rel="noreferrer" className="leads-field-link">{display}</a> : display}
        {copyable && !isEmpty && <button className="leads-field-copy" onClick={() => copyToClipboard(display)} title="Copy">📋</button>}
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
            <div className="leads-modal-title">{mode === "create" ? "New Prospect" : "Edit Prospect"}</div>
            <div className="leads-modal-sub">{mode === "create" ? "Add a prospect manually. Required fields are marked *" : "Update prospect information."}</div>
          </div>
          <button className="leads-icon-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="leads-modal-body">
          <FormSection title="Identity">
            <FormRow>
              <FormInput label="Prospect Name *" value={data.leadName} onChange={(v) => onChange("leadName", v)} placeholder="Jane Doe" />
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
              <FormInput label="Prospect Contact (rep)" value={data.leadContact} onChange={(v) => onChange("leadContact", v)} placeholder="Salesperson handling" />
              <FormInput label="Prospect Score (0–100)" type="number" min={0} max={100} value={data.score} onChange={(v) => onChange("score", v)} />
            </FormRow>
          </FormSection>

          <FormSection title="Contact Details">
            <FormRow>
              <FormInput label="Email" type="email" value={data.email} onChange={(v) => onChange("email", v)} placeholder="jane@acme.com" />
              <FormInput label="Phone" value={data.phone} onChange={(v) => onChange("phone", v)} placeholder="+1 555 123 4567" />
            </FormRow>
            <FormRow>
              <FormInput label="LinkedIn" value={data.linkedin} onChange={(v) => onChange("linkedin", v)} placeholder="https://linkedin.com/in/ ..." />
              <FormInput label="Website" value={data.website} onChange={(v) => onChange("website", v)} placeholder="acme.com" />
            </FormRow>
            <FormSelect label="Method of Contact" value={data.contactMethod} onChange={(v) => onChange("contactMethod", v)} options={CONTACT_METHODS.map((m) => ({ value: m, label: m }))} />
          </FormSection>

          <FormSection title="Ownership & History">
            <FormRow>
              <div>
                <FormLabel>Claimed By</FormLabel>
                <div className="leads-input" style={{ display: "flex", alignItems: "center", color: "var(--leads-text-muted)" }}>
                  {data.claimedByName ? `${data.claimedByName} (${fmtRelative(data.claimedAt)})` : "Unclaimed"}
                </div>
              </div>
              <div>
                <FormLabel>Last Contacted By</FormLabel>
                <div className="leads-input" style={{ display: "flex", alignItems: "center", color: "var(--leads-text-muted)" }}>
                  {data.lastContactedBy ? `${data.lastContactedBy} (${fmtRelative(data.lastContactedAt)})` : "—"}
                </div>
              </div>
            </FormRow>
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
                    <button key={c} type="button" onClick={() => onToggleCategory(c)} className="leads-chip"
                      style={{ background: selected ? "var(--leads-accent-soft)" : "transparent", borderColor: selected ? "var(--leads-accent)" : "var(--leads-border)", color: selected ? "var(--leads-accent)" : "var(--leads-text-muted)" }}>
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

          <FormSection title="Reminder">
            <FormInput label="Reminder Date" type="date" value={data.reminderDate} onChange={(v) => onChange("reminderDate", v)} />
            <FormTextarea label="Reminder Notes" value={data.reminderNotes} onChange={(v) => onChange("reminderNotes", v)} placeholder="Set a reminder note..." />
          </FormSection>

          <FormSection title="Meeting Held">
            <FormInput label="Meeting Date" type="date" value={data.meetingHeldDate} onChange={(v) => onChange("meetingHeldDate", v)} />
            <FormTextarea label="Meeting Notes" value={data.meetingNotes} onChange={(v) => onChange("meetingNotes", v)} placeholder="Notes from the meeting..." />
          </FormSection>

          <FormSection title="Notes & Relations">
            <FormTextarea label="Prospect Notes" value={data.notes} onChange={(v) => onChange("notes", v)} placeholder="Background, pain points, conversation history..." rows={5} />
            <FormSelect label="Related Prospect" value={data.relatedLeadId} onChange={(v) => onChange("relatedLeadId", v)}
              options={[{ value: "", label: "— None —" }, ...allLeads.filter((l) => l.id !== data.id).map((l) => ({ value: l.id, label: `${l.leadName}${l.companyName ? ` (${l.companyName})` : ""}` }))]} />
          </FormSection>
        </div>

        <div className="leads-modal-footer">
          <button className="leads-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="leads-btn-primary" onClick={onSave}>{mode === "create" ? "Create Prospect" : "Save Changes"}</button>
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
function FormRow({ children }) { return <div className="leads-form-row">{children}</div>; }
function FormLabel({ children }) { return <label className="leads-form-label">{children}</label>; }
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
      <textarea className="leads-input" rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} style={{ resize: "vertical", fontFamily: "inherit" }} {...rest} />
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
  const [step, setStep] = useState("upload");
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [mapping, setMapping] = useState({});
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
      <div className="leads-modal" style={{ width: 800 }}>
        <div className="leads-modal-header">
          <div>
            <div className="leads-modal-title">Import Prospects from CSV</div>
            <div className="leads-modal-sub">
              {step === "upload" && "Upload a CSV file to get started."}
              {step === "mapping" && `${headers.length} columns detected from ${fileName}. Map each column to a prospect field.`}
            </div>
          </div>
          <button className="leads-icon-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="leads-modal-body">
          {step === "upload" && (
            <div className={`leads-dropzone ${dragOver ? "drag" : ""}`} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} onClick={() => fileRef.current?.click()}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Drop your CSV here or click to browse</div>
              <div style={{ fontSize: 13, color: "var(--leads-text-muted)" }}>We'll auto-detect columns like Name, Email, Phone, Company.</div>
              <input ref={fileRef} type="file" accept=".csv,text/csv" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files?.[0])} />
            </div>
          )}

          {step === "mapping" && (
            <>
              <div className="leads-import-status">✓ {mappedCount} of {headers.length} columns mapped · {totalToImport} prospects ready to import</div>
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
                      <select className="leads-input" value={mapping[i] || "skip"} onChange={(e) => setMapping({ ...mapping, [i]: e.target.value })}>
                        {ALL_LEAD_FIELDS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
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
                          {ALL_LEAD_FIELDS.filter((f) => f.key !== "skip" && Object.values(mapping).includes(f.key)).map((f) => <th key={f.key}>{f.label}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {previewLeads.map((l, i) => (
                          <tr key={i}>
                            {ALL_LEAD_FIELDS.filter((f) => f.key !== "skip" && Object.values(mapping).includes(f.key)).map((f) => <td key={f.key}>{String(l[f.key] || "—")}</td>)}
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
          {step === "mapping" && <button className="leads-btn-secondary" onClick={() => setStep("upload")} style={{ marginRight: "auto" }}>← Back</button>}
          <button className="leads-btn-secondary" onClick={onClose}>Cancel</button>
          {step === "mapping" && <button className="leads-btn-primary" onClick={() => onImport(buildLeads())} disabled={totalToImport === 0}>Import {totalToImport} prospects</button>}
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
            <button className={danger ? "leads-btn-danger" : "leads-btn-primary"} onClick={onConfirm}>{confirmLabel}</button>
          </div>
        </div>
      </div>
    </>
  );
}

const React = { Fragment: ({ children }) => <>{children}</> };

/* ============================================================
   STYLES
============================================================ */
function LeadsStyles() {
  return (
    <style>{`
      .leads-root {
        /* === DARK === */
        --leads-bg: #080b12;
        --leads-surface: #0f131f;
        --leads-surface-hover: #161d2e;
        --leads-elevated: #1a2235;
        --leads-text: #f1f5f9;
        --leads-text-secondary: #cbd5e1;
        --leads-text-muted: #64748b;
        --leads-text-subtle: #475569;
        --leads-border: rgba(255,255,255,0.06);
        --leads-border-strong: rgba(255,255,255,0.1);
        --leads-accent: #6366f1;
        --leads-accent-hover: #818cf8;
        --leads-accent-soft: rgba(99,102,241,0.12);
        --leads-accent-soft-hover: rgba(99,102,241,0.2);
        --leads-shadow-sm: 0 1px 2px rgba(0,0,0,0.4);
        --leads-shadow-md: 0 4px 6px rgba(0,0,0,0.4);
        --leads-shadow-lg: 0 10px 15px rgba(0,0,0,0.5);
        --leads-shadow-xl: 0 20px 25px rgba(0,0,0,0.6);
        --leads-success: #22c55e;
        --leads-warning: #f59e0b;
        --leads-danger: #ef4444;
        --leads-input-bg: rgba(255,255,255,0.03);

        color: var(--leads-text);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        background: var(--leads-bg);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        line-height: 1.5;
      }

      .leads-root[data-theme="light"] {
        --leads-bg: #f8fafc;
        --leads-surface: #ffffff;
        --leads-surface-hover: #f1f5f9;
        --leads-elevated: #ffffff;
        --leads-text: #0f172a;
        --leads-text-secondary: #334155;
        --leads-text-muted: #64748b;
        --leads-text-subtle: #94a3b8;
        --leads-border: #e2e8f0;
        --leads-border-strong: #cbd5e1;
        --leads-accent: #4f46e5;
        --leads-accent-hover: #4338ca;
        --leads-accent-soft: rgba(79,70,229,0.08);
        --leads-accent-soft-hover: rgba(79,70,229,0.14);
        --leads-shadow-sm: 0 1px 2px rgba(15,23,42,0.04);
        --leads-shadow-md: 0 4px 6px rgba(15,23,42,0.04);
        --leads-shadow-lg: 0 10px 15px rgba(15,23,42,0.08);
        --leads-shadow-xl: 0 20px 25px rgba(15,23,42,0.1);
        --leads-input-bg: #ffffff;
      }

      /* ===== NAV ===== */
      .leads-nav {
        height: 56px; background: var(--leads-surface); border-bottom: 1px solid var(--leads-border);
        display: flex; align-items: center; justify-content: space-between; padding: 0 24px;
        flex-shrink: 0;
      }
      .leads-nav-left { display: flex; align-items: center; gap: 32px; }
      .leads-nav-brand {
        display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 800; color: var(--leads-text);
      }
      .leads-nav-brand svg { color: var(--leads-accent); }
      .leads-nav-tabs { display: flex; gap: 4px; }
      .leads-nav-tabs button {
        background: transparent; border: none; color: var(--leads-text-muted);
        padding: 6px 16px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;
        transition: all 0.15s ease;
      }
      .leads-nav-tabs button:hover { color: var(--leads-text-secondary); background: var(--leads-bg); }
      .leads-nav-tabs button.active { color: var(--leads-text); background: var(--leads-bg); }
      .leads-nav-right { display: flex; align-items: center; gap: 12px; }
      .leads-contacts-badge {
        display: inline-flex; align-items: center; gap: 6px;
        background: var(--leads-bg); color: var(--leads-text-muted);
        padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 600;
        border: 1px solid var(--leads-border);
      }
      .leads-live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--leads-success); }
      .leads-nav-icon {
        background: transparent; border: none; color: var(--leads-text-muted);
        width: 36px; height: 36px; border-radius: 8px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
      }
      .leads-nav-icon:hover { background: var(--leads-bg); color: var(--leads-text); }
      .leads-avatar-sm {
        width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-weight: 700; font-size: 11px; color: #fff;
      }

      /* ===== LAYOUT ===== */
      .leads-layout { display: flex; flex: 1; overflow: hidden; }
      .leads-sidebar {
        width: 300px; background: var(--leads-surface); border-right: 1px solid var(--leads-border);
        display: flex; flex-direction: column; overflow-y: auto; flex-shrink: 0;
      }
      .leads-sidebar-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 16px 20px; border-bottom: 1px solid var(--leads-border);
      }
      .leads-sidebar-header h3 { margin: 0; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
      .leads-clear-all { background: none; border: none; color: var(--leads-accent); font-size: 12px; font-weight: 700; cursor: pointer; }
      .leads-clear-all:hover { text-decoration: underline; }

      .leads-sidebar-section { border-bottom: 1px solid var(--leads-border); }
      .leads-sidebar-section-title {
        width: 100%; display: flex; justify-content: space-between; align-items: center;
        padding: 12px 20px; background: none; border: none; color: var(--leads-text);
        font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px;
        cursor: pointer;
      }
      .leads-chevron { font-size: 10px; transition: transform 0.2s ease; color: var(--leads-text-muted); }
      .leads-chevron.open { transform: rotate(180deg); }
      .leads-sidebar-section-body { padding: 0 20px 16px; display: flex; flex-direction: column; gap: 12px; }

      .leads-sidebar-field { display: flex; flex-direction: column; gap: 4px; }
      .leads-sidebar-label { font-size: 12px; font-weight: 600; color: var(--leads-text-secondary); }
      .leads-sidebar-input {
        width: 100%; padding: 8px 10px; background: var(--leads-input-bg);
        border: 1px solid var(--leads-border); border-radius: 8px;
        color: var(--leads-text); font-size: 13px; outline: none;
        transition: all 0.15s ease; box-sizing: border-box;
      }
      .leads-sidebar-input:focus { border-color: var(--leads-accent); box-shadow: 0 0 0 3px var(--leads-accent-soft); }
      .leads-sidebar-input::placeholder { color: var(--leads-text-subtle); }
      .leads-sidebar-helper { font-size: 11px; color: var(--leads-text-subtle); }

      .leads-filter-group { display: flex; flex-direction: column; gap: 8px; }
      .leads-filter-label { font-size: 12px; font-weight: 600; color: var(--leads-text-secondary); margin-bottom: 4px; }
      .leads-checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
      .leads-checkbox-group { display: flex; flex-direction: column; gap: 6px; }
      .leads-checkbox-label {
        display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--leads-text-muted);
        cursor: pointer; padding: 3px 0;
      }
      .leads-checkbox-label input { accent-color: var(--leads-accent); cursor: pointer; }
      .leads-checkbox-label:hover { color: var(--leads-text-secondary); }

      .leads-sidebar-actions {
        padding: 16px 20px; display: flex; flex-direction: column; gap: 10px;
        border-top: 1px solid var(--leads-border); margin-top: auto;
      }
      .leads-btn-run { width: 100%; justify-content: center; }
      .leads-btn-save { width: 100%; justify-content: center; }

      /* ===== MAIN ===== */
      .leads-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
      .leads-main-header {
        display: flex; gap: 12px; padding: 16px 24px; align-items: center; flex-wrap: wrap;
        border-bottom: 1px solid var(--leads-border);
      }
      .leads-search-bar {
        flex: 1; min-width: 300px; position: relative; display: flex; align-items: center;
      }
      .leads-search-bar input {
        width: 100%; padding: 10px 14px 10px 36px;
        background: var(--leads-surface); border: 1px solid var(--leads-border);
        border-radius: 10px; color: var(--leads-text); font-size: 14px; outline: none;
        transition: all 0.15s ease;
      }
      .leads-search-bar input:focus { border-color: var(--leads-accent); box-shadow: 0 0 0 3px var(--leads-accent-soft); }
      .leads-search-bar input::placeholder { color: var(--leads-text-subtle); }
      .leads-search-icon { position: absolute; left: 12px; color: var(--leads-text-subtle); pointer-events: none; }
      .leads-kbd {
        position: absolute; right: 10px; background: var(--leads-bg); color: var(--leads-text-subtle);
        border: 1px solid var(--leads-border); padding: 2px 6px; border-radius: 5px; font-size: 11px; font-family: inherit;
      }

      .leads-export-group { display: flex; gap: 8px; }

      /* ===== ACTIVE FILTERS ===== */
      .leads-active-bar {
        display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
        padding: 10px 24px; border-bottom: 1px solid var(--leads-border);
      }
      .leads-active-label { font-size: 12px; color: var(--leads-text-muted); font-weight: 600; }
      .leads-filter-pill {
        display: inline-flex; align-items: center; gap: 6px;
        background: rgba(245,158,11,0.12); color: #fbbf24;
        padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;
        border: 1px solid rgba(245,158,11,0.25);
      }
      .leads-filter-pill-remove {
        background: none; border: none; color: inherit; cursor: pointer; font-size: 10px; padding: 0;
        width: 14px; height: 14px; display: flex; align-items: center; justify-content: center;
      }

      /* ===== RESULTS HEADER ===== */
      .leads-results-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 14px 24px; flex-wrap: wrap; gap: 12px;
      }
      .leads-results-title { display: flex; align-items: center; gap: 10px; }
      .leads-results-title h2, .leads-results-title h3 { margin: 0; font-size: 16px; font-weight: 800; }
      .leads-count-badge {
        background: var(--leads-elevated); color: var(--leads-text-muted);
        padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 700;
        border: 1px solid var(--leads-border);
      }
      .leads-sort { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--leads-text-muted); }
      .leads-sort select {
        padding: 6px 24px 6px 10px; background: var(--leads-surface); border: 1px solid var(--leads-border);
        border-radius: 8px; color: var(--leads-text); font-size: 13px; outline: none; cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat; background-position: right 8px center;
      }

      /* ===== TABLE ===== */
      .leads-table-card {
        flex: 1; overflow: hidden; display: flex; flex-direction: column;
        margin: 0 24px 24px; background: var(--leads-surface);
        border: 1px solid var(--leads-border); border-radius: 12px;
      }
      .leads-table-scroll { overflow: auto; flex: 1; }
      .leads-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 13px; }
      .leads-table th {
        text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 700;
        color: var(--leads-text-muted); text-transform: uppercase; letter-spacing: 0.5px;
        background: var(--leads-bg); border-bottom: 1px solid var(--leads-border);
        white-space: nowrap; position: sticky; top: 0; z-index: 2;
      }
      .leads-table td { padding: 12px; border-bottom: 1px solid var(--leads-border); vertical-align: middle; background: var(--leads-surface); }
      .th-checkbox, .td-checkbox { width: 44px; text-align: center; padding-right: 0; }
      .th-actions, .td-actions { text-align: right; white-space: nowrap; }

      .leads-row { cursor: pointer; transition: background 0.1s ease; }
      .leads-row:hover td { background: var(--leads-surface-hover); }
      .leads-row.selected td { background: var(--leads-accent-soft); }
      .leads-row.locked td { opacity: 0.6; }
      .leads-row:last-child td { border-bottom: none; }

      .leads-checkbox { width: 16px; height: 16px; cursor: pointer; accent-color: var(--leads-accent); }

      .leads-avatar {
        width: 36px; height: 36px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-weight: 700; font-size: 12px; color: #fff; flex-shrink: 0;
        text-shadow: 0 1px 2px rgba(0,0,0,0.2);
      }
      .leads-avatar-lg { width: 48px; height: 48px; font-size: 16px; }

      .leads-person-cell { display: flex; align-items: center; gap: 12px; }
      .leads-person-info { min-width: 0; }
      .leads-person-name { font-weight: 700; color: var(--leads-text); font-size: 13.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .leads-person-email { font-size: 12px; color: var(--leads-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

      .leads-company-cell { min-width: 0; }
      .leads-company-name { font-weight: 600; color: var(--leads-text); font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .leads-company-domain { font-size: 12px; color: var(--leads-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

      .leads-title-cell { font-size: 13px; color: var(--leads-text-secondary); max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .leads-location-cell { font-size: 12px; color: var(--leads-text-muted); white-space: nowrap; }
      .leads-pin { opacity: 0.5; margin-right: 4px; }

      .email-badge {
        display: inline-flex; align-items: center; gap: 5px;
        padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700;
        border: 1px solid; white-space: nowrap;
      }
      .email-badge-dot { width: 6px; height: 6px; border-radius: 50%; }

      .leads-size-cell { font-size: 13px; color: var(--leads-text-secondary); }

      .leads-revenue-cell { min-width: 0; }
      .leads-revenue-main { font-weight: 600; color: var(--leads-text); font-size: 13px; }
      .leads-revenue-sub { font-size: 11px; color: var(--leads-text-muted); margin-top: 1px; }

      .leads-action-btn {
        background: var(--leads-accent-soft); color: var(--leads-accent);
        border: 1px solid var(--leads-accent-soft-hover);
        padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 700;
        cursor: pointer; transition: all 0.15s ease;
      }
      .leads-action-btn:hover { background: var(--leads-accent-soft-hover); }
      .leads-action-btn.claimed { background: rgba(34,197,94,0.12); color: var(--leads-success); border-color: rgba(34,197,94,0.25); }
      .leads-locked-text { font-size: 12px; color: var(--leads-danger); font-weight: 700; }

      .leads-icon-btn {
        background: transparent; border: 1px solid var(--leads-border);
        color: var(--leads-text-muted); width: 28px; height: 28px;
        border-radius: 6px; cursor: pointer; display: inline-flex;
        align-items: center; justify-content: center; transition: all 0.15s ease;
        margin-left: 4px;
      }
      .leads-icon-btn:hover { background: var(--leads-accent-soft); border-color: var(--leads-accent); color: var(--leads-accent); }
      .leads-icon-btn-danger:hover { background: rgba(239,68,68,0.1); border-color: var(--leads-danger); color: var(--leads-danger); }

      .leads-pill {
        background: var(--leads-accent-soft); color: var(--leads-accent);
        padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700;
        border: 1px solid var(--leads-accent-soft-hover);
      }

      /* ===== EMPTY STATE ===== */
      .leads-empty { text-align: center; padding: 60px 20px; color: var(--leads-text-muted); }
      .leads-empty-icon { font-size: 40px; margin-bottom: 12px; }
      .leads-empty-title { font-size: 16px; font-weight: 800; color: var(--leads-text); margin-bottom: 4px; }
      .leads-empty-text { font-size: 14px; max-width: 360px; margin: 0 auto; }
      .leads-empty-actions { display: flex; gap: 10px; justify-content: center; margin-top: 18px; }

      /* ===== PAGINATION ===== */
      .leads-pagination {
        display: flex; justify-content: space-between; align-items: center;
        padding: 12px 16px; border-top: 1px solid var(--leads-border);
        background: var(--leads-bg); flex-wrap: wrap; gap: 12px;
      }
      .leads-pagination-info { font-size: 13px; color: var(--leads-text-muted); font-weight: 500; }
      .leads-pagination-current { font-size: 13px; color: var(--leads-text); font-weight: 700; padding: 0 8px; }
      .leads-pagination-controls { display: flex; gap: 6px; align-items: center; }
      .leads-pg-btn {
        background: var(--leads-surface); border: 1px solid var(--leads-border);
        color: var(--leads-text); width: 32px; height: 32px;
        border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 700;
        transition: all 0.15s ease;
      }
      .leads-pg-btn:hover:not(:disabled) { background: var(--leads-accent-soft); border-color: var(--leads-accent); color: var(--leads-accent); }
      .leads-pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }

      /* ===== BULK BAR ===== */
      .leads-bulk-bar {
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
        background: var(--leads-surface); border: 1px solid var(--leads-border-strong);
        border-radius: 14px; padding: 12px 18px;
        display: flex; gap: 18px; align-items: center;
        box-shadow: var(--leads-shadow-xl); z-index: 50;
        animation: leadsSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .leads-bulk-count { font-size: 14px; font-weight: 600; color: var(--leads-text); white-space: nowrap; }
      .leads-bulk-num { background: var(--leads-accent); color: #fff; padding: 2px 10px; border-radius: 999px; font-weight: 800; margin-right: 6px; }
      .leads-bulk-actions { display: flex; gap: 8px; flex-wrap: wrap; }

      /* ===== VIEWS ===== */
      .leads-view-page { flex: 1; padding: 24px; overflow-y: auto; }
      .leads-view-header { margin-bottom: 24px; }
      .leads-view-header h2 { margin: 0 0 4px; font-size: 22px; font-weight: 800; }
      .leads-view-header p { margin: 0; color: var(--leads-text-muted); font-size: 14px; }

      .leads-stats-row {
        display: grid; grid-template-columns: repeat(5, 1fr);
        gap: 16px; margin-bottom: 24px;
      }
      .leads-stat-card {
        background: var(--leads-surface); border: 1px solid var(--leads-border);
        border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px;
        box-shadow: var(--leads-shadow-sm);
      }
      .leads-stat-icon {
        width: 44px; height: 44px; border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        font-size: 20px; flex-shrink: 0;
      }
      .leads-stat-body { min-width: 0; }
      .leads-stat-label { font-size: 12px; font-weight: 700; color: var(--leads-text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
      .leads-stat-value { font-weight: 800; margin-top: 4px; letter-spacing: -0.02em; }
      .leads-stat-sub { font-size: 11px; color: var(--leads-text-subtle); margin-top: 2px; }

      .leads-analytics-grid {
        display: grid; grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }
      .leads-analytics-card {
        background: var(--leads-surface); border: 1px solid var(--leads-border);
        border-radius: 12px; padding: 20px;
        box-shadow: var(--leads-shadow-sm);
      }
      .leads-analytics-card h3 { margin: 0 0 16px; font-size: 14px; font-weight: 700; color: var(--leads-text-secondary); }

      .leads-chart { display: flex; flex-direction: column; gap: 12px; }
      .leads-chart-row { display: grid; grid-template-columns: 110px 1fr 40px; align-items: center; gap: 10px; }
      .leads-chart-label { font-size: 12px; color: var(--leads-text-muted); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .leads-chart-bar-bg { height: 8px; background: var(--leads-bg); border-radius: 4px; overflow: hidden; }
      .leads-chart-bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
      .leads-chart-value { font-size: 12px; font-weight: 700; color: var(--leads-text); text-align: right; }

      .leads-enrich-grid {
        display: grid; grid-template-columns: repeat(4, 1fr);
        gap: 16px; margin-bottom: 24px;
      }
      .leads-enrich-card {
        background: var(--leads-surface); border: 1px solid var(--leads-border);
        border-radius: 12px; padding: 24px; text-align: center;
        box-shadow: var(--leads-shadow-sm);
      }
      .leads-enrich-icon {
        width: 48px; height: 48px; border-radius: 12px;
        display: flex; align-items: center; justify-content: center;
        font-size: 24px; margin: 0 auto 12px;
      }
      .leads-enrich-value { font-size: 28px; font-weight: 800; color: var(--leads-text); }
      .leads-enrich-value span { font-size: 16px; color: var(--leads-text-muted); font-weight: 600; }
      .leads-enrich-label { font-size: 13px; color: var(--leads-text-muted); margin-top: 4px; font-weight: 600; }

      .leads-enrich-actions { display: flex; gap: 12px; }

      .leads-lists-layout { display: flex; gap: 20px; height: calc(100vh - 180px); }
      .leads-lists-sidebar {
        width: 260px; background: var(--leads-surface); border: 1px solid var(--leads-border);
        border-radius: 12px; overflow: hidden; display: flex; flex-direction: column;
      }
      .leads-list-item {
        width: 100%; display: flex; justify-content: space-between; align-items: center;
        padding: 12px 16px; background: none; border: none; border-bottom: 1px solid var(--leads-border);
        color: var(--leads-text); font-size: 13px; font-weight: 600; cursor: pointer;
        transition: all 0.15s ease;
      }
      .leads-list-item:hover { background: var(--leads-surface-hover); }
      .leads-list-item.active { background: var(--leads-accent-soft); color: var(--leads-accent); }
      .leads-list-count {
        background: var(--leads-bg); color: var(--leads-text-muted);
        padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700;
      }
      .leads-lists-content { flex: 1; min-width: 0; display: flex; flex-direction: column; }

      /* ===== DRAWER & MODAL ===== */
      .leads-backdrop {
        position: fixed; inset: 0; background: rgba(2,6,23,0.6);
        backdrop-filter: blur(4px); z-index: 99999;
        animation: leadsFadeIn 0.2s ease;
      }
      .leads-drawer {
        position: fixed; top: 0; right: 0; bottom: 0;
        width: 520px; max-width: 100vw;
        background: var(--leads-surface);
        border-left: 1px solid var(--leads-border);
        box-shadow: var(--leads-shadow-xl);
        z-index: 100000; display: flex; flex-direction: column;
        animation: leadsSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .leads-drawer-header {
        padding: 20px; border-bottom: 1px solid var(--leads-border);
        display: flex; justify-content: space-between; align-items: flex-start;
      }
      .leads-drawer-header-main { display: flex; align-items: center; gap: 14px; min-width: 0; }
      .leads-drawer-titles { min-width: 0; }
      .leads-drawer-name { font-size: 18px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .leads-drawer-sub { font-size: 13px; color: var(--leads-text-muted); margin-top: 2px; }
      .leads-drawer-meta { font-size: 12px; color: var(--leads-text-subtle); margin-top: 2px; }

      .leads-claim-banner {
        padding: 12px 20px; font-size: 13px; font-weight: 600;
        display: flex; align-items: center; flex-wrap: wrap; gap: 8px;
        border-bottom: 1px solid var(--leads-border);
      }
      .leads-claim-banner-icon { font-size: 14px; }
      .leads-claim-banner.locked { background: rgba(239,68,68,0.08); color: var(--leads-danger); }
      .leads-claim-banner.mine { background: var(--leads-accent-soft); color: var(--leads-accent); }
      .leads-claim-banner.available { background: rgba(34,197,94,0.08); color: var(--leads-success); }

      .leads-drawer-quick {
        display: flex; gap: 8px; padding: 14px 20px; border-bottom: 1px solid var(--leads-border); flex-wrap: wrap;
      }
      .leads-quick-btn {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;
        background: var(--leads-bg); color: var(--leads-text-secondary);
        border: 1px solid var(--leads-border); cursor: pointer; text-decoration: none;
        transition: all 0.15s ease;
      }
      .leads-quick-btn:hover { background: var(--leads-surface-hover); border-color: var(--leads-border-strong); }
      .leads-quick-btn-danger { color: var(--leads-danger); }
      .leads-quick-btn-danger:hover { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.2); }

      .leads-drawer-section { padding: 16px 20px; border-bottom: 1px solid var(--leads-border); }
      .leads-drawer-section-block { padding: 18px 20px; border-bottom: 1px solid var(--leads-border); }
      .leads-drawer-section-title {
        font-size: 11px; font-weight: 800; color: var(--leads-text-muted);
        text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 12px;
      }
      .leads-drawer-body { overflow-y: auto; flex: 1; }
      .leads-drawer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      .leads-drawer-field { min-width: 0; }
      .leads-drawer-desc {
        margin-top: 12px; padding: 12px; background: var(--leads-bg);
        border-radius: 8px; font-size: 13px; color: var(--leads-text-secondary); line-height: 1.6;
      }

      .leads-section-label {
        font-size: 11px; font-weight: 800; color: var(--leads-text-muted);
        text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 10px;
      }
      .leads-chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
      .leads-chip {
        background: transparent; border: 1px solid var(--leads-border);
        color: var(--leads-text-muted); padding: 5px 12px; border-radius: 999px;
        font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s ease;
      }
      .leads-chip:hover { border-color: var(--leads-border-strong); }

      .leads-field-label { font-size: 11px; color: var(--leads-text-muted); font-weight: 700; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.4px; }
      .leads-field-value { font-size: 13.5px; color: var(--leads-text); line-height: 1.5; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 6px; }
      .leads-field-value.empty { color: var(--leads-text-subtle); }
      .leads-field-link { color: var(--leads-accent); text-decoration: none; font-weight: 600; }
      .leads-field-link:hover { text-decoration: underline; }
      .leads-field-copy { opacity: 0.4; background: none; border: none; cursor: pointer; font-size: 11px; padding: 0; }
      .leads-field-copy:hover { opacity: 1; }

      .leads-mini-btn {
        background: transparent; border: 1px solid currentColor;
        padding: 2px 10px; border-radius: 5px; font-size: 11px; font-weight: 700;
        cursor: pointer; color: inherit; transition: all 0.15s ease;
      }
      .leads-mini-btn:hover { background: rgba(255,255,255,0.06); }
      .leads-mini-btn.primary { background: var(--leads-accent); color: #fff; border-color: var(--leads-accent); }
      .leads-mini-btn.primary:hover { background: var(--leads-accent-hover); }

      .leads-modal {
        position: fixed; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 720px; max-width: 95vw; max-height: 92vh;
        background: var(--leads-surface);
        border: 1px solid var(--leads-border);
        border-radius: 14px;
        box-shadow: var(--leads-shadow-xl);
        z-index: 100001;
        display: flex; flex-direction: column;
        animation: leadsModalIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .leads-modal-header {
        padding: 20px; border-bottom: 1px solid var(--leads-border);
        display: flex; justify-content: space-between; align-items: flex-start;
      }
      .leads-modal-title { font-size: 18px; font-weight: 800; }
      .leads-modal-sub { font-size: 13px; color: var(--leads-text-muted); margin-top: 2px; }
      .leads-modal-body { padding: 20px; overflow-y: auto; flex: 1; }
      .leads-modal-footer {
        padding: 14px 20px; border-top: 1px solid var(--leads-border);
        display: flex; justify-content: flex-end; gap: 10px;
        background: var(--leads-bg);
      }

      .leads-form-section-title {
        font-size: 11px; font-weight: 800; color: var(--leads-text-muted);
        text-transform: uppercase; letter-spacing: 0.8px;
        margin-bottom: 12px; padding-bottom: 8px;
        border-bottom: 1px solid var(--leads-border);
      }
      .leads-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .leads-form-label { font-size: 12px; font-weight: 600; color: var(--leads-text); display: block; margin-bottom: 4px; }
      .leads-input {
        width: 100%; padding: 9px 12px; background: var(--leads-input-bg);
        border: 1px solid var(--leads-border); border-radius: 8px;
        color: var(--leads-text); font-size: 14px; outline: none;
        transition: all 0.15s ease; box-sizing: border-box;
      }
      .leads-input:focus { border-color: var(--leads-accent); box-shadow: 0 0 0 3px var(--leads-accent-soft); }
      .leads-input::placeholder { color: var(--leads-text-subtle); }

      /* ===== CSV IMPORT ===== */
      .leads-dropzone {
        border: 2px dashed var(--leads-border-strong); border-radius: 12px;
        padding: 50px 20px; text-align: center; cursor: pointer;
        transition: all 0.15s ease; background: var(--leads-bg);
      }
      .leads-dropzone:hover, .leads-dropzone.drag {
        border-color: var(--leads-accent); background: var(--leads-accent-soft);
      }
      .leads-import-status {
        margin-bottom: 16px; padding: 10px 14px;
        background: var(--leads-accent-soft); border-radius: 8px;
        font-size: 13px; color: var(--leads-accent); font-weight: 600;
      }
      .leads-mapping-grid { display: grid; grid-template-columns: 1fr 1fr 1.2fr; gap: 8px; align-items: center; }
      .leads-mapping-head {
        font-size: 11px; font-weight: 700; color: var(--leads-text-muted);
        text-transform: uppercase; letter-spacing: 0.5px;
        padding-bottom: 6px; border-bottom: 1px solid var(--leads-border);
      }
      .leads-mapping-csv { font-weight: 600; font-size: 14px; }
      .leads-mapping-sample { font-size: 13px; color: var(--leads-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .leads-preview-table {
        width: 100%; border-collapse: collapse; font-size: 12px;
        border: 1px solid var(--leads-border); border-radius: 8px; overflow: hidden;
      }
      .leads-preview-table th, .leads-preview-table td {
        padding: 8px 10px; text-align: left; border-bottom: 1px solid var(--leads-border);
      }
      .leads-preview-table th {
        background: var(--leads-bg); font-weight: 700; color: var(--leads-text-muted);
        text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px;
      }

      /* ===== TOASTS ===== */
      .leads-toasts {
        position: fixed; top: 24px; right: 24px;
        display: flex; flex-direction: column; gap: 10px;
        z-index: 100002; pointer-events: none;
      }
      .leads-toast {
        padding: 12px 18px; border-radius: 10px;
        background: var(--leads-surface); color: var(--leads-text);
        border: 1px solid var(--leads-border);
        box-shadow: var(--leads-shadow-lg);
        font-size: 14px; font-weight: 500;
        animation: leadsToastIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: auto;
      }
      .leads-toast-success { border-left: 3px solid var(--leads-success); }
      .leads-toast-error   { border-left: 3px solid var(--leads-danger); }
      .leads-toast-warning { border-left: 3px solid var(--leads-warning); }
      .leads-toast-info    { border-left: 3px solid var(--leads-accent); }

      /* ===== SPINNER ===== */
      .leads-spinner {
        width: 32px; height: 32px; border: 3px solid var(--leads-border);
        border-top-color: var(--leads-accent); border-radius: 50%;
        animation: leadsSpin 0.8s linear infinite; margin: 0 auto 12px;
      }

      /* ===== BUTTONS ===== */
      .leads-btn-primary {
        background: var(--leads-accent); color: #fff; border: none;
        padding: 9px 18px; border-radius: 8px; font-weight: 600; font-size: 14px;
        cursor: pointer; transition: all 0.15s ease;
        display: inline-flex; align-items: center; gap: 6px;
        box-shadow: var(--leads-shadow-sm);
      }
      .leads-btn-primary:hover { background: var(--leads-accent-hover); transform: translateY(-1px); box-shadow: var(--leads-shadow-md); }
      .leads-btn-primary:active { transform: translateY(0); }
      .leads-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

      .leads-btn-secondary {
        background: var(--leads-surface); color: var(--leads-text-secondary);
        border: 1px solid var(--leads-border); padding: 9px 16px; border-radius: 8px;
        font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.15s ease;
        display: inline-flex; align-items: center; gap: 6px;
      }
      .leads-btn-secondary:hover { background: var(--leads-surface-hover); border-color: var(--leads-border-strong); }
      .leads-btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }

      .leads-btn-danger {
        background: var(--leads-danger); color: #fff; border: none;
        padding: 9px 16px; border-radius: 8px; font-weight: 600; font-size: 14px;
        cursor: pointer; transition: all 0.15s ease;
      }
      .leads-btn-danger:hover { filter: brightness(0.92); }

      .leads-btn-text {
        background: transparent; border: none; color: var(--leads-accent);
        font-weight: 600; font-size: 13px; cursor: pointer; padding: 4px 8px;
      }
      .leads-btn-text:hover { text-decoration: underline; }

      /* ===== ANIMATIONS ===== */
      @keyframes leadsPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
      @keyframes leadsSpin { to { transform: rotate(360deg); } }
      @keyframes leadsFadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes leadsSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      @keyframes leadsSlideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
      @keyframes leadsModalIn {
        from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
      @keyframes leadsToastIn {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }

      @media (max-width: 1100px) {
        .leads-stats-row { grid-template-columns: repeat(3, 1fr); }
        .leads-analytics-grid { grid-template-columns: 1fr; }
        .leads-enrich-grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 900px) {
        .leads-sidebar { display: none; }
        .leads-layout { flex-direction: column; }
        .leads-drawer { width: 100vw; }
        .leads-drawer-grid { grid-template-columns: 1fr; }
        .leads-form-row { grid-template-columns: 1fr; }
        .leads-table { font-size: 12px; }
        .leads-table th, .leads-table td { padding: 8px; }
        .leads-bulk-bar { left: 12px; right: 12px; transform: none; bottom: 12px; }
        .leads-stats-row { grid-template-columns: repeat(2, 1fr); }
        .leads-enrich-grid { grid-template-columns: 1fr; }
        .leads-lists-layout { flex-direction: column; height: auto; }
        .leads-lists-sidebar { width: 100%; }
      }
    `}</style>
  );
}
