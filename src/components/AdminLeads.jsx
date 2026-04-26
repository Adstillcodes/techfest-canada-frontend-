import { useState, useMemo, useEffect, useCallback, useRef } from "react";

/* ============================================================
   🎯 PROSPECT CRM — Admin Assignment + Employee View
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
  "Phone Call", "Email", "Meeting", "Instant Messaging"
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
  contactLog: [],
  dealSize: "", dealCategories: [],
  status: "new",
  relatedLeadId: "",
  leadContact: "",
  assignedTo: null, assignedToName: null, assignedAt: null,
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

const DUMMY_USERS = [
  { id: "user-1", name: "Alice Johnson", email: "alice@techfest.com", role: "employee" },
  { id: "user-2", name: "Bob Smith", email: "bob@techfest.com", role: "employee" },
  { id: "user-3", name: "Carol White", email: "carol@techfest.com", role: "employee" },
  { id: "user-4", name: "David Lee", email: "david@techfest.com", role: "employee" },
];

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
    contactLog: [
      { date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], method: "Meeting", notes: "Discovery call" },
      { date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], method: "Email", notes: "Sent intro deck" }
    ],
    dealSize: 15000,
    dealCategories: ["Sponsorship", "Branding"],
    status: "qualified",
    assignedTo: "user-1",
    assignedToName: "Alice Johnson",
    assignedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    lastContactedAt: new Date().toISOString(),
    lastContactedBy: "Alice Johnson",
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
    contactMethod: "Phone Call",
    contactLog: [
      { date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0], method: "Phone Call", notes: "Cold outreach" }
    ],
    dealSize: 50000,
    dealCategories: ["Partnership", "Speaking Slot"],
    status: "contacted",
    assignedTo: null,
    assignedToName: null,
    assignedAt: null,
    lastContactedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    lastContactedBy: "System",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    email_status: "validated",
    company_size: "501-1000",
    company_annual_revenue_clean: 50000000,
    company_total_funding_clean: 75000000,
    company_founded_year: "2015",
  },
  {
    id: "demo-3",
    leadName: "Priya Sharma",
    companyName: "EcomGlobal",
    jobTitle: "Senior Product Manager",
    industry: "E-commerce",
    country: "India",
    city: "Mumbai",
    score: 91,
    email: "priya.s@ecomglobal.in",
    phone: "+91 98765 43210",
    linkedin: "https://linkedin.com/in/priyasharma",
    website: "ecomglobal.in",
    notes: "High intent. Wants booth + speaking slot combo.",
    followUpDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
    followUpNotes: "Send contract",
    reminderDate: "",
    reminderNotes: "",
    meetingHeldDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    meetingNotes: "Great call. Ready to sign.",
    contactMethod: "Meeting",
    contactLog: [
      { date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], method: "Email", notes: "Intro" },
      { date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], method: "Meeting", notes: "Negotiation" }
    ],
    dealSize: 75000,
    dealCategories: ["Booth", "Speaking Slot"],
    status: "negotiation",
    assignedTo: "user-2",
    assignedToName: "Bob Smith",
    assignedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    lastContactedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    lastContactedBy: "Bob Smith",
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    email_status: "validated",
    company_size: "1001-2000",
    company_annual_revenue_clean: 120000000,
    company_total_funding_clean: 200000000,
    company_founded_year: "2012",
  },
  {
    id: "demo-4",
    leadName: "James Wilson",
    companyName: "GrowthRocket",
    jobTitle: "VP of Marketing",
    industry: "SaaS",
    country: "United Kingdom",
    city: "London",
    score: 45,
    email: "james@growthrocket.io",
    phone: "+44 20 7946 0958",
    linkedin: "https://linkedin.com/in/jameswilson",
    website: "growthrocket.io",
    notes: "Cold lead. Low engagement so far.",
    followUpDate: "",
    followUpNotes: "",
    reminderDate: "",
    reminderNotes: "",
    meetingHeldDate: "",
    meetingNotes: "",
    contactMethod: "Email",
    contactLog: [],
    dealSize: 5000,
    dealCategories: ["Tickets"],
    status: "new",
    assignedTo: null,
    assignedToName: null,
    assignedAt: null,
    lastContactedAt: null,
    lastContactedBy: null,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    email_status: "unknown",
    company_size: "51-200",
    company_annual_revenue_clean: 3000000,
    company_total_funding_clean: 5000000,
    company_founded_year: "2021",
  },
  {
    id: "demo-5",
    leadName: "Emily Rodriguez",
    companyName: "CloudNine",
    jobTitle: "VP Marketing",
    industry: "Cloud Infrastructure",
    country: "United States",
    city: "Austin",
    score: 68,
    email: "emily.r@cloudnine.com",
    phone: "+1 512 555 0199",
    linkedin: "https://linkedin.com/in/emilyrodriguez",
    website: "cloudnine.com",
    notes: "Interested in workshop sponsorship.",
    followUpDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    followUpNotes: "Send workshop details",
    reminderDate: "",
    reminderNotes: "",
    meetingHeldDate: "",
    meetingNotes: "",
    contactMethod: "Phone Call",
    contactLog: [
      { date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0], method: "Phone Call", notes: "Initial contact" }
    ],
    dealSize: 12000,
    dealCategories: ["Workshop"],
    status: "contacted",
    assignedTo: "user-3",
    assignedToName: "Carol White",
    assignedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    lastContactedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    lastContactedBy: "Carol White",
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    email_status: "validated",
    company_size: "501-1000",
    company_annual_revenue_clean: 45000000,
    company_total_funding_clean: 8000000,
    company_founded_year: "2018",
  },
];

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
export default function ProspectCRM() {
  /* ---- Theme ---- */
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("crm_theme") || "dark";
  });
  useEffect(() => { localStorage.setItem("crm_theme", theme); }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  /* ---- Role & View Mode ---- */
  const [userRole, setUserRole] = useState("admin");
  const [previewAsEmployee, setPreviewAsEmployee] = useState(false);
  const isAdmin = userRole === "admin" && !previewAsEmployee;
  const effectiveRole = isAdmin ? "admin" : "employee";

  /* ---- Users (employees) ---- */
  const [users] = useState(() => [...DUMMY_USERS]);

  /* ---- View switcher ---- */
  const [currentView, setCurrentView] = useState("search");

  /* ---- Current user ---- */
  const [currentUser, setCurrentUser] = useState({
    id: "admin-1", name: "Admin", email: "admin@techfest.com", role: "admin"
  });

  /* ---- Core data ---- */
  const [leads, setLeads] = useState(() => [...DUMMY_PROSPECTS]);
  const [loading, setLoading] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [syncing, setSyncing] = useState(false);

  /* ---- UI state ---- */
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "all", score: "all", followUp: "all",
    country: "all", industry: "all", company: "all",
    assigned: "all", jobTitle: "", functionalLevel: [], emailStatus: [], size: "all"
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
      const res = await fetch(`${API_BASE}/auth/me`, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token") || ""}` } });
      if (!res.ok) throw new Error("auth failed");
      const data = await res.json();
      setCurrentUser({ id: data.id, name: data.name || "Admin", email: data.email || "", role: data.role || "admin" });
      setUserRole(data.role || "admin");
    } catch {
      setCurrentUser({ id: "admin-1", name: "Admin", email: "", role: "admin" });
    }
  }, []);

  const fetchLeads = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setSyncing(true);
    try {
      const res = await fetch(`${API_BASE}/leads`, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token") || ""}` } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.data || data.leads || []);
      setLeads(list);
      setLastSynced(new Date());
    } catch {
      // keep local
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  const createLead = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const newLead = await res.json();
      setLeads((prev) => [newLead, ...prev]);
      pushToast("Prospect created", "success");
      return newLead;
    } catch {
      const local = { ...payload, id: `local-${Date.now()}`, createdAt: new Date().toISOString() };
      setLeads((prev) => [local, ...prev]);
      pushToast("Saved locally", "warning");
      return local;
    }
  };

  const updateLead = async (id, payload) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...payload } : l)));
    try {
      await fetch(`${API_BASE}/leads/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
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
        method: "DELETE", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
    } catch {
      pushToast("Could not delete on server", "error");
    }
  };

  const bulkImport = async (newLeads) => {
    try {
      const res = await fetch(`${API_BASE}/leads/bulk-import`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
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

  /* ---- Assignment ---- */
  const assignLead = async (id, userId, userName) => {
    const payload = { assignedTo: userId, assignedToName: userName, assignedAt: new Date().toISOString() };
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...payload } : l)));
    try {
      await fetch(`${API_BASE}/leads/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        body: JSON.stringify(payload),
      });
      pushToast(`Assigned to ${userName}`, "success");
    } catch {
      pushToast("Assigned locally", "warning");
    }
  };

  const unassignLead = async (id) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, assignedTo: null, assignedToName: null, assignedAt: null } : l)));
    try {
      await fetch(`${API_BASE}/leads/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        body: JSON.stringify({ assignedTo: null, assignedToName: null, assignedAt: null }),
      });
      pushToast("Unassigned", "success");
    } catch {}
  };

  const bulkAssign = async (ids, userId, userName) => {
    const idsArr = Array.from(ids);
    const payload = { assignedTo: userId, assignedToName: userName, assignedAt: new Date().toISOString() };
    setLeads((prev) => prev.map((l) => ids.has(l.id) ? { ...l, ...payload } : l));
    try {
      await fetch(`${API_BASE}/leads/bulk-update`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        body: JSON.stringify({ ids: idsArr, updates: payload }),
      });
    } catch {}
    pushToast(`Assigned ${idsArr.length} prospects to ${userName}`, "success");
    setSelectedIds(new Set());
  };

  /* ---- Initial load ---- */
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

  /* ---- Derived data ---- */
  const uniqueCountries = useMemo(() => [...new Set(leads.map((l) => l.country).filter(Boolean))].sort(), [leads]);
  const uniqueIndustries = useMemo(() => [...new Set(leads.map((l) => l.industry).filter(Boolean))].sort(), [leads]);
  const uniqueCompanies = useMemo(() => [...new Set(leads.map((l) => l.companyName).filter(Boolean))].sort(), [leads]);

  /* ---- Filter + sort ---- */
  const filteredLeads = useMemo(() => {
    let out = [...leads];

    // Employee view: only see assigned to them OR unassigned
    if (!isAdmin) {
      out = out.filter((l) => !l.assignedTo || l.assignedTo === currentUser.id);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((l) =>
        [l.leadName, l.companyName, l.email, l.phone, l.jobTitle, l.leadContact, l.country, l.city, l.company_domain, l.industry]
          .some((v) => (v || "").toLowerCase().includes(q))
      );
    }

    if (filters.status !== "all") out = out.filter((l) => l.status === filters.status);
    if (filters.country !== "all") out = out.filter((l) => l.country === filters.country);
    if (filters.industry !== "all") out = out.filter((l) => l.industry === filters.industry);
    if (filters.company !== "all") out = out.filter((l) => l.companyName === filters.company);
    if (filters.assigned !== "all") {
      if (filters.assigned === "unassigned") out = out.filter((l) => !l.assignedTo);
      else out = out.filter((l) => l.assignedTo === filters.assigned);
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
      } else if (field === "followUpDate" || field === "createdAt" || field === "assignedAt") {
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
  }, [leads, search, filters, sortBy, contactLocation, contactCity, companyDomain, isAdmin, currentUser.id]);

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
    const unassigned = leads.filter((l) => !l.assignedTo).length;
    const myAssigned = leads.filter((l) => l.assignedTo === currentUser.id).length;
    const pipeline = leads
      .filter((l) => !["won", "lost"].includes(l.status))
      .reduce((sum, l) => sum + (Number(l.dealSize) || 0), 0);
    return { total, hot, overdue, unassigned, myAssigned, pipeline };
  }, [leads, currentUser.id]);

  /* ---- Selection ---- */
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

  /* ---- Form ---- */
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

  const addContactLog = () => {
    setFormData((prev) => ({
      ...prev,
      contactLog: [...prev.contactLog, { date: new Date().toISOString().split('T')[0], method: CONTACT_METHODS[0], notes: "" }]
    }));
  };

  const updateContactLog = (idx, key, value) => {
    setFormData((prev) => {
      const next = [...prev.contactLog];
      next[idx] = { ...next[idx], [key]: value };
      return { ...prev, contactLog: next };
    });
  };

  const removeContactLog = (idx) => {
    setFormData((prev) => ({
      ...prev,
      contactLog: prev.contactLog.filter((_, i) => i !== idx)
    }));
  };

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
      assigned: "all", jobTitle: "", functionalLevel: [], emailStatus: [], size: "all"
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
    <div className="crm-root" data-theme={theme}>
      <CRMStyles />

      {/* ===== TOP NAVIGATION ===== */}
      <nav className="crm-nav">
        <div className="crm-nav-left">
          <div className="crm-nav-brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            <span>Prospect CRM</span>
          </div>
          <div className="crm-nav-tabs">
            {[
              { key: "search", label: "Database" },
              { key: "lists", label: "Lists" },
              { key: "analytics", label: "Analytics" },
            ].map((tab) => (
              <button key={tab.key} className={currentView === tab.key ? "active" : ""} onClick={() => setCurrentView(tab.key)}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="crm-nav-right">
          {isAdmin && (
            <button
              className={`crm-preview-toggle ${previewAsEmployee ? "active" : ""}`}
              onClick={() => setPreviewAsEmployee((p) => !p)}
              title="Preview employee view"
            >
              {previewAsEmployee ? "👁 Exit Preview" : "👁 Preview Employee"}
            </button>
          )}
          {!isAdmin && (
            <span className="crm-role-badge employee">Employee View</span>
          )}
          {isAdmin && (
            <span className="crm-role-badge admin">Admin</span>
          )}
          <span className="crm-contacts-badge">
            <span className="crm-live-dot" /> {stats.total} prospects
          </span>
          <button className="crm-nav-icon" title="Refresh" onClick={() => fetchLeads()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          </button>
          <button className="crm-nav-icon" title="Toggle theme" onClick={toggleTheme}>
            {theme === "dark" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          <div className="crm-avatar-sm" style={{ background: avatarColor(currentUser.name) }}>
            {initialsOf(currentUser.name)}
          </div>
        </div>
      </nav>

      {/* ===== VIEW: DATABASE ===== */}
      {currentView === "search" && (
        <div className="crm-layout">
          {/* Sidebar */}
          <aside className="crm-sidebar">
            <div className="crm-sidebar-header">
              <h3>Search Filters</h3>
              {activeFilterCount > 0 && (
                <button className="crm-clear-all" onClick={resetFilters}>Clear all</button>
              )}
            </div>

            <SidebarSection title="Quick Search" defaultOpen>
              <SidebarInput label="Name / Company / Domain" placeholder="e.g. TechFlow or Sarah" value={search} onChange={setSearch} />
              <SidebarInput label="Job Title" placeholder='e.g. "Head of Marketing"' value={filters.jobTitle} onChange={(v) => setFilters((f) => ({ ...f, jobTitle: v }))} />
            </SidebarSection>

            <SidebarSection title="Industry & Company" defaultOpen>
              <SidebarSelect label="Industry" value={filters.industry} onChange={(v) => setFilters((f) => ({ ...f, industry: v }))}
                options={[{ value: "all", label: "All industries" }, ...uniqueIndustries.map((c) => ({ value: c, label: c }))]} />
              <SidebarSelect label="Company" value={filters.company} onChange={(v) => setFilters((f) => ({ ...f, company: v }))}
                options={[{ value: "all", label: "All companies" }, ...uniqueCompanies.map((c) => ({ value: c, label: c }))]} />
              <SidebarInput label="Company Domain" placeholder="e.g. google.com" value={companyDomain} onChange={setCompanyDomain} />
              <SidebarSelect label="Company Size" value={filters.size} onChange={(v) => setFilters((f) => ({ ...f, size: v }))}
                options={[{ value: "all", label: "Any size" }, ...SIZE_OPTIONS.map((s) => ({ value: s, label: s }))]} />
            </SidebarSection>

            <SidebarSection title="People Targeting">
              <div className="crm-filter-group">
                <div className="crm-filter-label">Functional Level</div>
                <div className="crm-checkbox-grid">
                  {FUNCTIONAL_LEVELS.map((level) => (
                    <label key={level} className="crm-checkbox-label">
                      <input type="checkbox" checked={filters.functionalLevel.includes(level)} onChange={() => toggleFunctionalLevel(level)} />
                      <span>{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </SidebarSection>

            <SidebarSection title="Location">
              <SidebarInput label="Region / Country / State" placeholder="e.g. United States, EMEA" value={contactLocation} onChange={setContactLocation} />
              <SidebarInput label="City" placeholder="e.g. San Francisco" value={contactCity} onChange={setContactCity} />
            </SidebarSection>

            <SidebarSection title="Email Quality">
              <div className="crm-checkbox-group">
                {EMAIL_STATUS_OPTIONS.map((s) => (
                  <label key={s.value} className="crm-checkbox-label">
                    <input type="checkbox" checked={filters.emailStatus.includes(s.value)} onChange={() => toggleEmailStatus(s.value)} />
                    <span>{s.label}</span>
                  </label>
                ))}
              </div>
            </SidebarSection>

            {isAdmin && (
              <SidebarSection title="Assignment">
                <SidebarSelect label="Assigned To" value={filters.assigned} onChange={(v) => setFilters((f) => ({ ...f, assigned: v }))}
                  options={[
                    { value: "all", label: "All prospects" },
                    { value: "unassigned", label: "🔘 Unassigned" },
                    ...users.map((u) => ({ value: u.id, label: `👤 ${u.name}` })),
                  ]} />
              </SidebarSection>
            )}

            <div className="crm-sidebar-actions">
              <button className="crm-btn-primary crm-btn-run" onClick={() => fetchLeads()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Run Search
              </button>
            </div>
          </aside>

          {/* Main */}
          <main className="crm-main">
            <div className="crm-main-header">
              <div className="crm-search-bar">
                <svg className="crm-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" placeholder="Search by name, company, industry, or domain…" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="crm-export-group">
                <button className="crm-btn-primary" onClick={openCreate}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  New Prospect
                </button>
                {isAdmin && (
                  <button className="crm-btn-secondary" onClick={() => setShowImportModal(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Import
                  </button>
                )}
                <button className="crm-btn-secondary" onClick={handleExportCSV}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Export</button>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="crm-active-bar">
                <span className="crm-active-label">Active filters:</span>
                {search && <FilterPill label={`Search: "${search}"`} onRemove={() => removeFilter("search")} />}
                {filters.jobTitle && <FilterPill label={`Title: ${filters.jobTitle}`} onRemove={() => removeFilter("jobTitle")} />}
                {filters.industry !== "all" && <FilterPill label={filters.industry} onRemove={() => removeFilter("industry")} />}
                {filters.company !== "all" && <FilterPill label={filters.company} onRemove={() => removeFilter("company")} />}
                {filters.assigned !== "all" && <FilterPill label={`Assigned: ${filters.assigned === "unassigned" ? "Unassigned" : users.find((u) => u.id === filters.assigned)?.name || filters.assigned}`} onRemove={() => removeFilter("assigned")} />}
                {filters.functionalLevel.map((l) => <FilterPill key={l} label={l} onRemove={() => toggleFunctionalLevel(l)} />)}
                {filters.emailStatus.map((s) => {
                  const meta = EMAIL_STATUS_OPTIONS.find((o) => o.value === s);
                  return <FilterPill key={s} label={meta?.label || s} onRemove={() => toggleEmailStatus(s)} />;
                })}
                {contactLocation && <FilterPill label={`Loc: ${contactLocation}`} onRemove={() => removeFilter("contactLocation")} />}
                {contactCity && <FilterPill label={`City: ${contactCity}`} onRemove={() => removeFilter("contactCity")} />}
                {companyDomain && <FilterPill label={`Domain: ${companyDomain}`} onRemove={() => removeFilter("companyDomain")} />}
                {filters.size !== "all" && <FilterPill label={`Size: ${filters.size}`} onRemove={() => removeFilter("size")} />}
                {filters.status !== "all" && <FilterPill label={statusMeta(filters.status).label} onRemove={() => removeFilter("status")} />}
                {filters.score !== "all" && <FilterPill label={`Score: ${filters.score}`} onRemove={() => removeFilter("score")} />}
              </div>
            )}

            <div className="crm-results-header">
              <div className="crm-results-title">
                <h2>Prospect Database</h2>
                <span className="crm-count-badge">{filteredLeads.length} prospects</span>
              </div>
              <div className="crm-sort">
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

            <div className="crm-table-card">
              {loading ? (
                <EmptyState icon={<Spinner />} title="Loading prospects…" text="Fetching from your backend." />
              ) : filteredLeads.length === 0 ? (
                leads.length === 0 ? (
                  <EmptyState icon="📭" title="No prospects yet" text="Import a CSV or add one manually to get started." cta={{ label: "Add your first prospect", onClick: openCreate }} secondaryCta={isAdmin ? { label: "Import CSV", onClick: () => setShowImportModal(true) } : undefined} />
                ) : (
                  <EmptyState icon="🔍" title="No matches" text="Try clearing a filter or adjusting your search." />
                )
              ) : (
                <>
                  <div className="crm-table-scroll">
                    <table className="crm-table">
                      <thead>
                        <tr>
                          <th className="th-checkbox"><input type="checkbox" className="crm-checkbox" checked={allSelected} ref={(el) => { if (el) el.indeterminate = !allSelected && someSelected; }} onChange={toggleSelectAll} /></th>
                          <th>Person</th>
                          <th>Company</th>
                          <th>Title</th>
                          <th>Industry</th>
                          <th>Location</th>
                          <th>Score</th>
                          <th>Status</th>
                          <th>Assigned</th>
                          <th>Deal</th>
                          <th className="th-actions">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagedLeads.map((lead) => (
                          <ProspectRow
                            key={lead.id}
                            lead={lead}
                            selected={selectedIds.has(lead.id)}
                            isAdmin={isAdmin}
                            users={users}
                            currentUserId={currentUser.id}
                            onToggleSelect={() => toggleSelect(lead.id)}
                            onOpen={() => setDrawerLead(lead)}
                            onEdit={() => openEdit(lead)}
                            onDelete={() => setConfirmDelete(lead.id)}
                            onAssign={(userId, userName) => assignLead(lead.id, userId, userName)}
                            onUnassign={() => unassignLead(lead.id)}
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
        <ListsView leads={leads} users={users} currentUserId={currentUser.id} isAdmin={isAdmin} onOpen={(lead) => setDrawerLead(lead)} />
      )}

      {/* ===== VIEW: ANALYTICS ===== */}
      {currentView === "analytics" && (
        <AnalyticsView leads={leads} stats={stats} users={users} />
      )}

      {/* ===== BULK ACTION BAR ===== */}
      {selectedIds.size > 0 && (
        <BulkActionBar
          isAdmin={isAdmin}
          users={users}
          count={selectedIds.size}
          onClear={() => setSelectedIds(new Set())}
          onChangeStatus={(status) => {
            setLeads((prev) => prev.map((l) => selectedIds.has(l.id) ? { ...l, status } : l));
            setSelectedIds(new Set());
            pushToast(`Updated ${selectedIds.size} prospects`, "success");
          }}
          onAssign={(userId, userName) => bulkAssign(selectedIds, userId, userName)}
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
        <ProspectDrawer
          lead={leads.find((l) => l.id === drawerLead.id) || drawerLead}
          allLeads={leads}
          users={users}
          isAdmin={isAdmin}
          currentUserId={currentUser.id}
          onClose={() => setDrawerLead(null)}
          onEdit={() => openEdit(drawerLead)}
          onDelete={() => setConfirmDelete(drawerLead.id)}
          onAssign={(userId, userName) => assignLead(drawerLead.id, userId, userName)}
          onUnassign={() => unassignLead(drawerLead.id)}
          onStatusChange={(s) => updateLead(drawerLead.id, { status: s })}
        />
      )}

      {/* ===== FORM MODAL ===== */}
      {showFormModal && (
        <ProspectFormModal
          mode={formMode}
          data={formData}
          allLeads={leads}
          users={users}
          isAdmin={isAdmin}
          onChange={handleFormChange}
          onToggleCategory={toggleDealCategory}
          onAddContactLog={addContactLog}
          onUpdateContactLog={updateContactLog}
          onRemoveContactLog={removeContactLog}
          onSave={handleSave}
          onClose={() => setShowFormModal(false)}
        />
      )}

      {/* ===== CSV IMPORT MODAL ===== */}
      {showImportModal && isAdmin && (
        <CSVImportModal
          onClose={() => setShowImportModal(false)}
          onImport={async (rows) => { await bulkImport(rows); setShowImportModal(false); }}
        />
      )}

      {/* ===== DELETE CONFIRM ===== */}
      {confirmDelete && isAdmin && (
        <ConfirmModal
          title={confirmDelete === "bulk" ? `Delete ${selectedIds.size} prospects?` : "Delete this prospect?"}
          message="This action cannot be undone."
          confirmLabel="Delete"
          danger
          onConfirm={async () => {
            if (confirmDelete === "bulk") {
              const idsArr = Array.from(selectedIds);
              setLeads((prev) => prev.filter((l) => !selectedIds.has(l.id)));
              try { await fetch(`${API_BASE}/leads/bulk-delete`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token") || ""}` }, body: JSON.stringify({ ids: idsArr }) }); } catch {}
              pushToast(`Deleted ${idsArr.length} prospects`, "success");
              setSelectedIds(new Set());
            } else await deleteLead(confirmDelete);
            setConfirmDelete(null); setDrawerLead(null);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* ===== TOASTS ===== */}
      <div className="crm-toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`crm-toast crm-toast-${t.type}`}>{t.message}</div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   VIEWS
============================================================ */

function ListsView({ leads, users, currentUserId, isAdmin, onOpen }) {
  const lists = [
    { key: "mine", label: "My Prospects", filter: (l) => l.assignedTo === currentUserId },
    { key: "hot", label: "Hot Prospects", filter: (l) => (Number(l.score) || 0) >= 80 },
    { key: "unassigned", label: "Unassigned", filter: (l) => !l.assignedTo },
    { key: "new", label: "New This Week", filter: (l) => l.createdAt && (Date.now() - new Date(l.createdAt).getTime()) < 7 * 86400000 },
    { key: "overdue", label: "Overdue Follow-ups", filter: (l) => isOverdue(l.followUpDate) },
    { key: "validated", label: "Validated Emails", filter: (l) => l.email_status === "validated" },
  ];

  const [activeList, setActiveList] = useState(isAdmin ? "unassigned" : "mine");

  const active = lists.find((l) => l.key === activeList);
  const listLeads = active ? leads.filter(active.filter) : [];

  return (
    <div className="crm-view-page">
      <div className="crm-view-header">
        <h2>Lists</h2>
        <p>Organize and access your saved prospect segments.</p>
      </div>
      <div className="crm-lists-layout">
        <div className="crm-lists-sidebar">
          {lists.map((list) => {
            const count = leads.filter(list.filter).length;
            return (
              <button key={list.key} className={`crm-list-item ${activeList === list.key ? "active" : ""}`} onClick={() => setActiveList(list.key)}>
                <span className="crm-list-name">{list.label}</span>
                <span className="crm-list-count">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="crm-lists-content">
          <div className="crm-results-header" style={{ padding: "0 0 12px" }}>
            <div className="crm-results-title">
              <h3>{active?.label}</h3>
              <span className="crm-count-badge">{listLeads.length} prospects</span>
            </div>
          </div>
          {listLeads.length === 0 ? (
            <EmptyState icon="📂" title="No prospects in this list" text="This list is empty right now." />
          ) : (
            <div className="crm-table-card" style={{ margin: 0 }}>
              <div className="crm-table-scroll">
                <table className="crm-table">
                  <thead>
                    <tr>
                      <th>Person</th><th>Company</th><th>Title</th><th>Industry</th><th>Location</th><th>Score</th><th>Status</th><th>Assigned</th><th>Deal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listLeads.slice(0, 50).map((lead) => (
                      <ProspectRow key={lead.id} lead={lead} selected={false} isAdmin={isAdmin} users={users} currentUserId={currentUserId} onToggleSelect={() => {}} onOpen={() => onOpen(lead)} onEdit={() => {}} onDelete={() => {}} onAssign={() => {}} onUnassign={() => {}} hideCheckbox />
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

function AnalyticsView({ leads, stats, users }) {
  const statusCounts = useMemo(() => {
    const counts = {};
    STATUS_OPTIONS.forEach((s) => counts[s.value] = 0);
    leads.forEach((l) => { if (counts[l.status] !== undefined) counts[l.status]++; });
    return STATUS_OPTIONS.map((s) => ({ ...s, count: counts[s.value] }));
  }, [leads]);

  const assignedCounts = useMemo(() => {
    const counts = { unassigned: leads.filter((l) => !l.assignedTo).length };
    users.forEach((u) => { counts[u.id] = leads.filter((l) => l.assignedTo === u.id).length; });
    return counts;
  }, [leads, users]);

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
    <div className="crm-view-page">
      <div className="crm-view-header">
        <h2>Analytics</h2>
        <p>Insights and performance metrics from your prospect pipeline.</p>
      </div>

      <div className="crm-stats-row">
        <StatCard label="Total Prospects" value={stats.total} icon="👥" accent="#6366f1" />
        <StatCard label="Hot Prospects" value={stats.hot} icon="🔥" accent="#22c55e" />
        <StatCard label="Unassigned" value={stats.unassigned} icon="🔘" accent="#f59e0b" />
        <StatCard label="My Assigned" value={stats.myAssigned} icon="✓" accent="#8b5cf6" />
        <StatCard label="Open Pipeline" value={fmtMoney(stats.pipeline)} icon="💰" accent="#f59e0b" isText />
      </div>

      <div className="crm-analytics-grid">
        <div className="crm-analytics-card">
          <h3>Pipeline by Status</h3>
          <div className="crm-chart">
            {statusCounts.map((s) => (
              <div key={s.value} className="crm-chart-row">
                <span className="crm-chart-label">{s.label}</span>
                <div className="crm-chart-bar-bg">
                  <div className="crm-chart-bar-fill" style={{ width: `${(s.count / maxStatus) * 100}%`, background: s.color }} />
                </div>
                <span className="crm-chart-value">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-analytics-card">
          <h3>Assignment Distribution</h3>
          <div className="crm-chart">
            <div className="crm-chart-row">
              <span className="crm-chart-label">Unassigned</span>
              <div className="crm-chart-bar-bg">
                <div className="crm-chart-bar-fill" style={{ width: `${(assignedCounts.unassigned / Math.max(stats.total, 1)) * 100}%`, background: "#94a3b8" }} />
              </div>
              <span className="crm-chart-value">{assignedCounts.unassigned}</span>
            </div>
            {users.map((u) => (
              <div key={u.id} className="crm-chart-row">
                <span className="crm-chart-label">{u.name}</span>
                <div className="crm-chart-bar-bg">
                  <div className="crm-chart-bar-fill" style={{ width: `${(assignedCounts[u.id] / Math.max(stats.total, 1)) * 100}%`, background: avatarColor(u.name) }} />
                </div>
                <span className="crm-chart-value">{assignedCounts[u.id]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-analytics-card">
          <h3>Prospects by Country</h3>
          <div className="crm-chart">
            {countryCounts.map(([country, count]) => (
              <div key={country} className="crm-chart-row">
                <span className="crm-chart-label">{country}</span>
                <div className="crm-chart-bar-bg">
                  <div className="crm-chart-bar-fill" style={{ width: `${(count / maxCountry) * 100}%`, background: "var(--crm-accent)" }} />
                </div>
                <span className="crm-chart-value">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-analytics-card">
          <h3>Score Distribution</h3>
          <div className="crm-chart">
            {scoreDistribution.map((s) => (
              <div key={s.label} className="crm-chart-row">
                <span className="crm-chart-label">{s.label}</span>
                <div className="crm-chart-bar-bg">
                  <div className="crm-chart-bar-fill" style={{ width: `${(s.count / maxScore) * 100}%`, background: s.color }} />
                </div>
                <span className="crm-chart-value">{s.count}</span>
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

function Spinner() { return <div className="crm-spinner" />; }

function StatCard({ label, value, icon, accent, sub, isText }) {
  return (
    <div className="crm-stat-card">
      <div className="crm-stat-icon" style={{ background: `${accent}18`, color: accent }}>{icon}</div>
      <div className="crm-stat-body">
        <div className="crm-stat-label">{label}</div>
        <div className="crm-stat-value" style={{ fontSize: isText ? 18 : 24, color: accent }}>{value}</div>
        {sub && <div className="crm-stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

function SidebarSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="crm-sidebar-section">
      <button className="crm-sidebar-section-title" onClick={() => setOpen(!open)}>
        {title}
        <span className={`crm-chevron ${open ? "open" : ""}`}>▼</span>
      </button>
      {open && <div className="crm-sidebar-section-body">{children}</div>}
    </div>
  );
}

function SidebarInput({ label, value, onChange, type = "text", placeholder, helper }) {
  return (
    <div className="crm-sidebar-field">
      <label className="crm-sidebar-label">{label}</label>
      <input className="crm-sidebar-input" type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)} />
      {helper && <div className="crm-sidebar-helper">{helper}</div>}
    </div>
  );
}

function SidebarSelect({ label, value, onChange, options }) {
  return (
    <div className="crm-sidebar-field">
      <label className="crm-sidebar-label">{label}</label>
      <select className="crm-sidebar-input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function FilterPill({ label, onRemove }) {
  return (
    <span className="crm-filter-pill">
      {label}
      <button onClick={onRemove} className="crm-filter-pill-remove">✕</button>
    </span>
  );
}

function ProspectRow({ lead, selected, isAdmin, users, currentUserId, onToggleSelect, onOpen, onEdit, onDelete, onAssign, onUnassign, hideCheckbox }) {
  const isTaken = !!lead.assignedTo && lead.assignedTo !== currentUserId;
  const assignedUser = users.find((u) => u.id === lead.assignedTo);

  return (
    <tr className={`crm-row ${selected ? "selected" : ""} ${isTaken ? "taken" : ""}`} onClick={onOpen}>
      {!hideCheckbox && (
        <td onClick={(e) => e.stopPropagation()} className="td-checkbox">
          <input type="checkbox" className="crm-checkbox" checked={selected} onChange={onToggleSelect} />
        </td>
      )}
      {hideCheckbox && <td />}
      <td>
        <div className="crm-person-cell">
          <div className="crm-avatar" style={{ background: avatarColor(lead.leadName), opacity: isTaken ? 0.5 : 1 }}>{initialsOf(lead.leadName)}</div>
          <div className="crm-person-info">
            <div className="crm-person-name" style={{ opacity: isTaken ? 0.5 : 1 }}>{lead.leadName || "(unnamed)"}</div>
            <div className="crm-person-email" style={{ opacity: isTaken ? 0.4 : 1 }}>{lead.email || <span style={{ color: "var(--crm-text-subtle)" }}>No email</span>}</div>
          </div>
        </div>
      </td>
      <td>
        <div className="crm-company-cell" style={{ opacity: isTaken ? 0.5 : 1 }}>
          <div className="crm-company-name">{lead.companyName || "—"}</div>
          <div className="crm-company-domain">{lead.company_domain || lead.website || "—"}</div>
        </div>
      </td>
      <td className="crm-title-cell" style={{ opacity: isTaken ? 0.5 : 1 }}>{lead.jobTitle || "—"}</td>
      <td className="crm-industry-cell" style={{ opacity: isTaken ? 0.5 : 1 }}>{lead.industry || "—"}</td>
      <td className="crm-location-cell" style={{ opacity: isTaken ? 0.5 : 1 }}>
        <span className="crm-pin">📍</span> {[lead.city, lead.country].filter(Boolean).join(", ") || "—"}
      </td>
      <td>
        <div className="crm-score-wrap" style={{ opacity: isTaken ? 0.5 : 1 }}>
          <div className="crm-score-num" style={{ color: scoreColor(lead.score) }}>{lead.score || 0}</div>
          <div className="crm-score-bar-bg">
            <div className="crm-score-bar-fill" style={{ width: `${Math.min(100, Math.max(0, Number(lead.score) || 0))}%`, background: scoreColor(lead.score) }} />
          </div>
        </div>
      </td>
      <td style={{ opacity: isTaken ? 0.5 : 1 }}><StatusBadge status={lead.status} /></td>
      <td>
        {lead.assignedTo ? (
          <div className="crm-assigned-pill" style={{ opacity: isTaken ? 0.5 : 1, background: `${avatarColor(lead.assignedToName)}22`, color: avatarColor(lead.assignedToName), border: `1px solid ${avatarColor(lead.assignedToName)}44` }}>
            <span className="crm-assigned-dot" style={{ background: avatarColor(lead.assignedToName) }} />
            {lead.assignedToName}
          </div>
        ) : (
          <span className="crm-unassigned-label">Unassigned</span>
        )}
      </td>
      <td className="crm-money" style={{ opacity: isTaken ? 0.5 : 1 }}>{fmtMoney(lead.dealSize)}</td>
      <td onClick={(e) => e.stopPropagation()} className="td-actions">
        {isAdmin && (
          <>
            {lead.assignedTo ? (
              <button className="crm-action-btn assigned" onClick={onUnassign}>Unassign</button>
            ) : (
              <div className="crm-assign-dropdown-wrap">
                <button className="crm-action-btn" onClick={(e) => { e.stopPropagation(); }}>Assign ▾</button>
                <div className="crm-assign-dropdown">
                  {users.map((u) => (
                    <button key={u.id} className="crm-assign-option" onClick={() => onAssign(u.id, u.name)}>
                      <span className="crm-assign-dot" style={{ background: avatarColor(u.name) }} />
                      {u.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button className="crm-icon-btn" title="Edit" onClick={onEdit}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button className="crm-icon-btn crm-icon-btn-danger" title="Delete" onClick={onDelete}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </>
        )}
        {!isAdmin && (
          <button className="crm-icon-btn" title="View" onClick={onOpen}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        )}
      </td>
    </tr>
  );
}

function StatusBadge({ status }) {
  const sm = statusMeta(status);
  return (
    <span className="crm-status-badge" style={{ background: `${sm.color}18`, color: sm.color, border: `1px solid ${sm.color}40` }}>
      <span className="crm-status-dot" style={{ background: sm.color }} />
      {sm.label}
    </span>
  );
}

function EmptyState({ icon, title, text, cta, secondaryCta }) {
  return (
    <div className="crm-empty">
      <div className="crm-empty-icon">{icon}</div>
      <div className="crm-empty-title">{title}</div>
      <div className="crm-empty-text">{text}</div>
      <div className="crm-empty-actions">
        {cta && <button className="crm-btn-primary" onClick={cta.onClick}>{cta.label}</button>}
        {secondaryCta && <button className="crm-btn-secondary" onClick={secondaryCta.onClick}>{secondaryCta.label}</button>}
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, pageSize, totalItems, onPage, onPageSize }) {
  return (
    <div className="crm-pagination">
      <div className="crm-pagination-info">
        {totalItems === 0 ? "No prospects" : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, totalItems)} of ${totalItems}`}
      </div>
      <div className="crm-pagination-controls">
        <select className="crm-select" value={pageSize} onChange={(e) => onPageSize(Number(e.target.value))} style={{ padding: "6px 10px" }}>
          {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s} / page</option>)}
        </select>
        <button className="crm-pg-btn" onClick={() => onPage(1)} disabled={page === 1}>«</button>
        <button className="crm-pg-btn" onClick={() => onPage(page - 1)} disabled={page === 1}>‹</button>
        <span className="crm-pagination-current">{page} / {totalPages}</span>
        <button className="crm-pg-btn" onClick={() => onPage(page + 1)} disabled={page === totalPages}>›</button>
        <button className="crm-pg-btn" onClick={() => onPage(totalPages)} disabled={page === totalPages}>»</button>
      </div>
    </div>
  );
}

function BulkActionBar({ isAdmin, users, count, onClear, onChangeStatus, onAssign, onDelete, onExport }) {
  return (
    <div className="crm-bulk-bar">
      <div className="crm-bulk-count"><span className="crm-bulk-num">{count}</span> selected<button className="crm-btn-text" onClick={onClear} style={{ marginLeft: 12 }}>Clear</button></div>
      <div className="crm-bulk-actions">
        <select className="crm-select" onChange={(e) => { if (e.target.value) { onChangeStatus(e.target.value); e.target.value = ""; } }} defaultValue="">
          <option value="">Set status…</option>
          {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        {isAdmin && (
          <div className="crm-assign-dropdown-wrap" style={{ display: "inline-block" }}>
            <select className="crm-select" onChange={(e) => { if (e.target.value) { const u = users.find((x) => x.id === e.target.value); if (u) onAssign(u.id, u.name); e.target.value = ""; } }} defaultValue="">
              <option value="">Assign to…</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        )}
        <button className="crm-btn-secondary" onClick={onExport}>Export</button>
        {isAdmin && <button className="crm-btn-danger" onClick={onDelete}>Delete</button>}
      </div>
    </div>
  );
}

/* ============================================================
   DRAWER
============================================================ */
function ProspectDrawer({ lead, allLeads, users, isAdmin, currentUserId, onClose, onEdit, onDelete, onAssign, onUnassign, onStatusChange }) {
  const related = allLeads.find((l) => l.id === lead.relatedLeadId);
  const isTaken = !!lead.assignedTo && lead.assignedTo !== currentUserId;

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
      <div className="crm-backdrop" onClick={onClose} />
      <aside className="crm-drawer">
        <div className="crm-drawer-header">
          <div className="crm-drawer-header-main">
            <div className="crm-avatar crm-avatar-lg" style={{ background: avatarColor(lead.leadName), opacity: isTaken ? 0.5 : 1 }}>{initialsOf(lead.leadName)}</div>
            <div className="crm-drawer-titles">
              <div className="crm-drawer-name" style={{ opacity: isTaken ? 0.6 : 1 }}>{lead.leadName || "(unnamed)"}</div>
              <div className="crm-drawer-sub" style={{ opacity: isTaken ? 0.5 : 1 }}>{lead.jobTitle}{lead.jobTitle && lead.companyName ? " · " : ""}{lead.companyName}</div>
              <div className="crm-drawer-meta">{lead.city && lead.country ? `${lead.city}, ${lead.country}` : lead.country || lead.city || ""}</div>
            </div>
          </div>
          <button className="crm-icon-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {isTaken && (
          <div className="crm-taken-banner">
            <span>🔒</span> Assigned to <b>{lead.assignedToName}</b> · {fmtRelative(lead.assignedAt)}
          </div>
        )}

        <div className="crm-drawer-quick">
          <button className="crm-quick-btn" onClick={onEdit}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
          {lead.email && <a className="crm-quick-btn" href={`mailto:${lead.email}`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>Email</a>}
          {lead.phone && <a className="crm-quick-btn" href={`tel:${lead.phone}`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>Call</a>}
          {lead.linkedin && <a className="crm-quick-btn" href={lead.linkedin} target="_blank" rel="noreferrer"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>LinkedIn</a>}
          {isAdmin && <button className="crm-quick-btn crm-quick-btn-danger" onClick={onDelete}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>Delete</button>}
        </div>

        {isAdmin && (
          <div className="crm-drawer-section" style={{ background: "var(--crm-bg)", borderBottom: "1px solid var(--crm-border)" }}>
            <div className="crm-section-label">Assignment</div>
            {lead.assignedTo ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span className="crm-assigned-pill" style={{ background: `${avatarColor(lead.assignedToName)}22`, color: avatarColor(lead.assignedToName), border: `1px solid ${avatarColor(lead.assignedToName)}44` }}>
                  <span className="crm-assigned-dot" style={{ background: avatarColor(lead.assignedToName) }} />
                  {lead.assignedToName}
                </span>
                <button className="crm-mini-btn" onClick={onUnassign}>Unassign</button>
              </div>
            ) : (
              <div className="crm-chip-row">
                {users.map((u) => (
                  <button key={u.id} className="crm-chip" onClick={() => onAssign(u.id, u.name)} style={{ background: `${avatarColor(u.name)}18`, borderColor: `${avatarColor(u.name)}44`, color: avatarColor(u.name) }}>
                    <span className="crm-assign-dot" style={{ background: avatarColor(u.name), marginRight: 6 }} />
                    Assign to {u.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="crm-drawer-section">
          <div className="crm-section-label">Pipeline Status</div>
          <div className="crm-chip-row">
            {STATUS_OPTIONS.map((s) => (
              <button key={s.value} onClick={() => onStatusChange(s.value)} className="crm-chip"
                style={{ background: lead.status === s.value ? `${s.color}18` : "transparent", borderColor: lead.status === s.value ? s.color : "var(--crm-border)", color: lead.status === s.value ? s.color : "var(--crm-text-muted)" }}>
                {lead.status === s.value && <span style={{ marginRight: 4 }}>✓</span>}{s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="crm-drawer-body">
          <DrawerSection title="Contact Information">
            <div className="crm-drawer-grid">
              <DrawerField label="Email" value={lead.email} copyable />
              <DrawerField label="Phone" value={lead.phone} />
              <DrawerField label="LinkedIn" value={lead.linkedin} link />
              <DrawerField label="Website" value={lead.website} link />
            </div>
          </DrawerSection>

          <DrawerSection title="Company Profile">
            <div className="crm-drawer-grid">
              <DrawerField label="Company" value={lead.companyName} />
              <DrawerField label="Industry" value={lead.industry} />
              <DrawerField label="Size" value={companySize} />
              <DrawerField label="Annual Revenue" value={companyRevenue ? fmtMoney(companyRevenue) : "—"} />
              <DrawerField label="Total Funding" value={companyFunding ? fmtMoney(companyFunding) : "—"} />
              <DrawerField label="Founded" value={companyFounded} />
              {companyPhone && <DrawerField label="Company Phone" value={companyPhone} />}
              {companyLinkedIn && <DrawerField label="Company LinkedIn" value={companyLinkedIn} link />}
            </div>
            {companyDesc && <div className="crm-drawer-desc">{companyDesc}</div>}
            {companyAddress && <DrawerField label="Address" value={companyAddress} />}
          </DrawerSection>

          <DrawerSection title="Contact Log">
            {lead.contactLog?.length > 0 ? (
              <div className="crm-contact-log-list">
                {lead.contactLog.map((log, i) => (
                  <div key={i} className="crm-contact-log-item">
                    <div className="crm-contact-log-meta">
                      <span className="crm-contact-log-date">{fmtDate(log.date)}</span>
                      <span className="crm-contact-log-method">{log.method}</span>
                    </div>
                    <div className="crm-contact-log-notes">{log.notes || "—"}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="crm-field-value empty">No contact history logged yet.</div>
            )}
          </DrawerSection>

          <DrawerSection title="Assignment History">
            <div className="crm-drawer-grid">
              <DrawerField label="Assigned To" value={lead.assignedToName ? `${lead.assignedToName} (${fmtRelative(lead.assignedAt)})` : "Unassigned"} />
              <DrawerField label="Last Contacted By" value={lead.lastContactedBy ? `${lead.lastContactedBy} (${fmtRelative(lead.lastContactedAt)})` : "—"} />
            </div>
          </DrawerSection>

          <DrawerSection title="Deal">
            <div className="crm-drawer-grid">
              <DrawerField label="Deal Size" value={fmtMoney(lead.dealSize)} />
              <DrawerField label="Preferred Contact" value={lead.contactMethod} />
              <DrawerField label="Prospect Contact (Rep)" value={lead.leadContact} />
            </div>
            {lead.dealCategories?.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {lead.dealCategories.map((c) => <span key={c} className="crm-pill">{c}</span>)}
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
    <div className="crm-drawer-section-block">
      <div className="crm-drawer-section-title">{title}</div>
      {children}
    </div>
  );
}

function DrawerField({ label, value, multiline, copyable, link }) {
  const isEmpty = !value || value === "—";
  const display = isEmpty ? "—" : value;
  return (
    <div className="crm-drawer-field">
      <div className="crm-field-label">{label}</div>
      <div className={`crm-field-value ${isEmpty ? "empty" : ""}`} style={{ whiteSpace: multiline ? "pre-wrap" : "nowrap" }}>
        {link && !isEmpty ? <a href={display} target="_blank" rel="noreferrer" className="crm-field-link">{display}</a> : display}
        {copyable && !isEmpty && <button className="crm-field-copy" onClick={() => copyToClipboard(display)} title="Copy">📋</button>}
      </div>
    </div>
  );
}

/* ============================================================
   FORM MODAL
============================================================ */
function ProspectFormModal({ mode, data, allLeads, users, isAdmin, onChange, onToggleCategory, onAddContactLog, onUpdateContactLog, onRemoveContactLog, onSave, onClose }) {
  return (
    <>
      <div className="crm-backdrop" onClick={onClose} />
      <div className="crm-modal">
        <div className="crm-modal-header">
          <div>
            <div className="crm-modal-title">{mode === "create" ? "New Prospect" : "Edit Prospect"}</div>
            <div className="crm-modal-sub">{mode === "create" ? "Add a prospect manually. Required fields are marked *" : "Update prospect information."}</div>
          </div>
          <button className="crm-icon-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="crm-modal-body">
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
            <FormSelect label="Preferred Contact Method" value={data.contactMethod} onChange={(v) => onChange("contactMethod", v)} options={CONTACT_METHODS.map((m) => ({ value: m, label: m }))} />
          </FormSection>

          {isAdmin && (
            <FormSection title="Assignment">
              <FormSelect label="Assign To" value={data.assignedTo || ""} onChange={(v) => {
                const u = users.find((x) => x.id === v);
                onChange("assignedTo", v || null);
                onChange("assignedToName", u?.name || null);
                if (v && !data.assignedAt) onChange("assignedAt", new Date().toISOString());
              }} options={[{ value: "", label: "— Unassigned —" }, ...users.map((u) => ({ value: u.id, label: u.name }))]} />
            </FormSection>
          )}

          <FormSection title="Contact Log">
            <div className="crm-contact-log-editor">
              {data.contactLog.map((log, idx) => (
                <div key={idx} className="crm-contact-log-row">
                  <input className="crm-input" type="date" value={log.date} onChange={(e) => onUpdateContactLog(idx, "date", e.target.value)} />
                  <select className="crm-input" value={log.method} onChange={(e) => onUpdateContactLog(idx, "method", e.target.value)}>
                    {CONTACT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <input className="crm-input" value={log.notes} placeholder="Notes..." onChange={(e) => onUpdateContactLog(idx, "notes", e.target.value)} />
                  <button className="crm-contact-log-remove" onClick={() => onRemoveContactLog(idx)} title="Remove">✕</button>
                </div>
              ))}
              <button className="crm-contact-log-add" onClick={onAddContactLog}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Contact Entry
              </button>
            </div>
          </FormSection>

          <FormSection title="Deal">
            <FormRow>
              <FormInput label="Deal Size (USD)" type="number" min={0} value={data.dealSize} onChange={(v) => onChange("dealSize", v)} placeholder="5000" />
              <FormSelect label="Status" value={data.status} onChange={(v) => onChange("status", v)} options={STATUS_OPTIONS} />
            </FormRow>
            <div>
              <FormLabel>Deal Categories (multi-select)</FormLabel>
              <div className="crm-chip-row" style={{ marginTop: 6 }}>
                {DEAL_CATEGORIES.map((c) => {
                  const selected = data.dealCategories.includes(c);
                  return (
                    <button key={c} type="button" onClick={() => onToggleCategory(c)} className="crm-chip"
                      style={{ background: selected ? "var(--crm-accent-soft)" : "transparent", borderColor: selected ? "var(--crm-accent)" : "var(--crm-border)", color: selected ? "var(--crm-accent)" : "var(--crm-text-muted)" }}>
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

        <div className="crm-modal-footer">
          <button className="crm-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="crm-btn-primary" onClick={onSave}>{mode === "create" ? "Create Prospect" : "Save Changes"}</button>
        </div>
      </div>
    </>
  );
}

function FormSection({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div className="crm-form-section-title">{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );
}
function FormRow({ children }) { return <div className="crm-form-row">{children}</div>; }
function FormLabel({ children }) { return <label className="crm-form-label">{children}</label>; }
function FormInput({ label, value, onChange, ...rest }) {
  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <input className="crm-input" value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest} />
    </div>
  );
}
function FormTextarea({ label, value, onChange, rows = 3, ...rest }) {
  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <textarea className="crm-input" rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} style={{ resize: "vertical", fontFamily: "inherit" }} {...rest} />
    </div>
  );
}
function FormSelect({ label, value, onChange, options }) {
  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <select className="crm-input" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
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
      <div className="crm-backdrop" onClick={onClose} />
      <div className="crm-modal" style={{ width: 800 }}>
        <div className="crm-modal-header">
          <div>
            <div className="crm-modal-title">Import Prospects from CSV</div>
            <div className="crm-modal-sub">
              {step === "upload" && "Upload a CSV file to get started."}
              {step === "mapping" && `${headers.length} columns detected from ${fileName}. Map each column to a prospect field.`}
            </div>
          </div>
          <button className="crm-icon-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="crm-modal-body">
          {step === "upload" && (
            <div className={`crm-dropzone ${dragOver ? "drag" : ""}`} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} onClick={() => fileRef.current?.click()}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Drop your CSV here or click to browse</div>
              <div style={{ fontSize: 13, color: "var(--crm-text-muted)" }}>We'll auto-detect columns like Name, Email, Phone, Company.</div>
              <input ref={fileRef} type="file" accept=".csv,text/csv" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files?.[0])} />
            </div>
          )}

          {step === "mapping" && (
            <>
              <div className="crm-import-status">✓ {mappedCount} of {headers.length} columns mapped · {totalToImport} prospects ready to import</div>
              <div className="crm-form-section-title">Column mapping</div>
              <div className="crm-mapping-grid">
                <div className="crm-mapping-head">CSV Column</div>
                <div className="crm-mapping-head">Sample</div>
                <div className="crm-mapping-head">Maps to</div>
                {headers.map((h, i) => (
                  <React.Fragment key={i}>
                    <div className="crm-mapping-csv">{h || `(column ${i + 1})`}</div>
                    <div className="crm-mapping-sample">{rows[0]?.[i] || "—"}</div>
                    <div>
                      <select className="crm-input" value={mapping[i] || "skip"} onChange={(e) => setMapping({ ...mapping, [i]: e.target.value })}>
                        {ALL_LEAD_FIELDS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
                      </select>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {previewLeads.length > 0 && (
                <>
                  <div className="crm-form-section-title" style={{ marginTop: 24 }}>Preview (first 5)</div>
                  <div style={{ overflowX: "auto" }}>
                    <table className="crm-preview-table">
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

        <div className="crm-modal-footer">
          {step === "mapping" && <button className="crm-btn-secondary" onClick={() => setStep("upload")} style={{ marginRight: "auto" }}>← Back</button>}
          <button className="crm-btn-secondary" onClick={onClose}>Cancel</button>
          {step === "mapping" && <button className="crm-btn-primary" onClick={() => onImport(buildLeads())} disabled={totalToImport === 0}>Import {totalToImport} prospects</button>}
        </div>
      </div>
    </>
  );
}

function ConfirmModal({ title, message, confirmLabel = "Confirm", danger, onConfirm, onCancel }) {
  return (
    <>
      <div className="crm-backdrop" onClick={onCancel} />
      <div className="crm-modal" style={{ width: 420 }}>
        <div style={{ padding: 24 }}>
          <div className="crm-modal-title" style={{ marginBottom: 8 }}>{title}</div>
          <div className="crm-modal-sub" style={{ marginBottom: 22 }}>{message}</div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button className="crm-btn-secondary" onClick={onCancel}>Cancel</button>
            <button className={danger ? "crm-btn-danger" : "crm-btn-primary"} onClick={onConfirm}>{confirmLabel}</button>
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
function CRMStyles() {
  return (
    <style>{`
      .crm-root {
        /* === DARK === */
        --crm-bg: #080b12;
        --crm-surface: #0f131f;
        --crm-surface-hover: #161d2e;
        --crm-elevated: #1a2235;
        --crm-text: #f1f5f9;
        --crm-text-secondary: #cbd5e1;
        --crm-text-muted: #64748b;
        --crm-text-subtle: #475569;
        --crm-border: rgba(255,255,255,0.06);
        --crm-border-strong: rgba(255,255,255,0.1);
        --crm-accent: #6366f1;
        --crm-accent-hover: #818cf8;
        --crm-accent-soft: rgba(99,102,241,0.12);
        --crm-accent-soft-hover: rgba(99,102,241,0.2);
        --crm-shadow-sm: 0 1px 2px rgba(0,0,0,0.4);
        --crm-shadow-md: 0 4px 6px rgba(0,0,0,0.4);
        --crm-shadow-lg: 0 10px 15px rgba(0,0,0,0.5);
        --crm-shadow-xl: 0 20px 25px rgba(0,0,0,0.6);
        --crm-success: #22c55e;
        --crm-warning: #f59e0b;
        --crm-danger: #ef4444;
        --crm-input-bg: rgba(255,255,255,0.03);

        color: var(--crm-text);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        background: var(--crm-bg);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        line-height: 1.5;
      }

      .crm-root[data-theme="light"] {
        --crm-bg: #f8fafc;
        --crm-surface: #ffffff;
        --crm-surface-hover: #f1f5f9;
        --crm-elevated: #ffffff;
        --crm-text: #0f172a;
        --crm-text-secondary: #334155;
        --crm-text-muted: #64748b;
        --crm-text-subtle: #94a3b8;
        --crm-border: #e2e8f0;
        --crm-border-strong: #cbd5e1;
        --crm-accent: #4f46e5;
        --crm-accent-hover: #4338ca;
        --crm-accent-soft: rgba(79,70,229,0.08);
        --crm-accent-soft-hover: rgba(79,70,229,0.14);
        --crm-shadow-sm: 0 1px 2px rgba(15,23,42,0.04);
        --crm-shadow-md: 0 4px 6px rgba(15,23,42,0.04);
        --crm-shadow-lg: 0 10px 15px rgba(15,23,42,0.08);
        --crm-shadow-xl: 0 20px 25px rgba(15,23,42,0.1);
        --crm-input-bg: #ffffff;
      }

      /* ===== NAV ===== */
      .crm-nav {
        height: 56px; background: var(--crm-surface); border-bottom: 1px solid var(--crm-border);
        display: flex; align-items: center; justify-content: space-between; padding: 0 24px;
        flex-shrink: 0;
      }
      .crm-nav-left { display: flex; align-items: center; gap: 32px; }
      .crm-nav-brand {
        display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 800; color: var(--crm-text);
      }
      .crm-nav-brand svg { color: var(--crm-accent); }
      .crm-nav-tabs { display: flex; gap: 4px; }
      .crm-nav-tabs button {
        background: transparent; border: none; color: var(--crm-text-muted);
        padding: 6px 16px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;
        transition: all 0.15s ease;
      }
      .crm-nav-tabs button:hover { color: var(--crm-text-secondary); background: var(--crm-bg); }
      .crm-nav-tabs button.active { color: var(--crm-text); background: var(--crm-bg); }
      .crm-nav-right { display: flex; align-items: center; gap: 12px; }
      .crm-preview-toggle {
        display: inline-flex; align-items: center; gap: 6px;
        background: var(--crm-bg); color: var(--crm-text-muted);
        padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 600;
        border: 1px solid var(--crm-border); cursor: pointer;
      }
      .crm-preview-toggle.active { background: var(--crm-accent-soft); color: var(--crm-accent); border-color: var(--crm-accent); }
      .crm-role-badge {
        padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
      }
      .crm-role-badge.admin { background: rgba(34,197,94,0.12); color: var(--crm-success); }
      .crm-role-badge.employee { background: rgba(245,158,11,0.12); color: var(--crm-warning); }
      .crm-contacts-badge {
        display: inline-flex; align-items: center; gap: 6px;
        background: var(--crm-bg); color: var(--crm-text-muted);
        padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 600;
        border: 1px solid var(--crm-border);
      }
      .crm-live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--crm-success); }
      .crm-nav-icon {
        background: transparent; border: none; color: var(--crm-text-muted);
        width: 36px; height: 36px; border-radius: 8px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
      }
      .crm-nav-icon:hover { background: var(--crm-bg); color: var(--crm-text); }
      .crm-avatar-sm {
        width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-weight: 700; font-size: 11px; color: #fff;
      }

      /* ===== LAYOUT ===== */
      .crm-layout { display: flex; flex: 1; overflow: hidden; }
      .crm-sidebar {
        width: 300px; background: var(--crm-surface); border-right: 1px solid var(--crm-border);
        display: flex; flex-direction: column; overflow-y: auto; flex-shrink: 0;
      }
      .crm-sidebar-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 16px 20px; border-bottom: 1px solid var(--crm-border);
      }
      .crm-sidebar-header h3 { margin: 0; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
      .crm-clear-all { background: none; border: none; color: var(--crm-accent); font-size: 12px; font-weight: 700; cursor: pointer; }
      .crm-clear-all:hover { text-decoration: underline; }

      .crm-sidebar-section { border-bottom: 1px solid var(--crm-border); }
      .crm-sidebar-section-title {
        width: 100%; display: flex; justify-content: space-between; align-items: center;
        padding: 12px 20px; background: none; border: none; color: var(--crm-text);
        font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px;
        cursor: pointer;
      }
      .crm-chevron { font-size: 10px; transition: transform 0.2s ease; color: var(--crm-text-muted); }
      .crm-chevron.open { transform: rotate(180deg); }
      .crm-sidebar-section-body { padding: 0 20px 16px; display: flex; flex-direction: column; gap: 12px; }

      .crm-sidebar-field { display: flex; flex-direction: column; gap: 4px; }
      .crm-sidebar-label { font-size: 12px; font-weight: 600; color: var(--crm-text-secondary); }
      .crm-sidebar-input {
        width: 100%; padding: 8px 10px; background: var(--crm-input-bg);
        border: 1px solid var(--crm-border); border-radius: 8px;
        color: var(--crm-text); font-size: 13px; outline: none;
        transition: all 0.15s ease; box-sizing: border-box;
      }
      .crm-sidebar-input:focus { border-color: var(--crm-accent); box-shadow: 0 0 0 3px var(--crm-accent-soft); }
      .crm-sidebar-input::placeholder { color: var(--crm-text-subtle); }
      .crm-sidebar-helper { font-size: 11px; color: var(--crm-text-subtle); }

      .crm-filter-group { display: flex; flex-direction: column; gap: 8px; }
      .crm-filter-label { font-size: 12px; font-weight: 600; color: var(--crm-text-secondary); margin-bottom: 4px; }
      .crm-checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
      .crm-checkbox-group { display: flex; flex-direction: column; gap: 6px; }
      .crm-checkbox-label {
        display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--crm-text-muted);
        cursor: pointer; padding: 3px 0;
      }
      .crm-checkbox-label input { accent-color: var(--crm-accent); cursor: pointer; }
      .crm-checkbox-label:hover { color: var(--crm-text-secondary); }

      .crm-sidebar-actions {
        padding: 16px 20px; display: flex; flex-direction: column; gap: 10px;
        border-top: 1px solid var(--crm-border); margin-top: auto;
      }
      .crm-btn-run { width: 100%; justify-content: center; }

      /* ===== MAIN ===== */
      .crm-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
      .crm-main-header {
        display: flex; gap: 12px; padding: 16px 24px; align-items: center; flex-wrap: wrap;
        border-bottom: 1px solid var(--crm-border);
      }
      .crm-search-bar {
        flex: 1; min-width: 300px; position: relative; display: flex; align-items: center;
      }
      .crm-search-bar input {
        width: 100%; padding: 10px 14px 10px 36px;
        background: var(--crm-surface); border: 1px solid var(--crm-border);
        border-radius: 10px; color: var(--crm-text); font-size: 14px; outline: none;
        transition: all 0.15s ease;
      }
      .crm-search-bar input:focus { border-color: var(--crm-accent); box-shadow: 0 0 0 3px var(--crm-accent-soft); }
      .crm-search-bar input::placeholder { color: var(--crm-text-subtle); }
      .crm-search-icon { position: absolute; left: 12px; color: var(--crm-text-subtle); pointer-events: none; }

      .crm-export-group { display: flex; gap: 8px; }

      /* ===== ACTIVE FILTERS ===== */
      .crm-active-bar {
        display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
        padding: 10px 24px; border-bottom: 1px solid var(--crm-border);
      }
      .crm-active-label { font-size: 12px; color: var(--crm-text-muted); font-weight: 600; }
      .crm-filter-pill {
        display: inline-flex; align-items: center; gap: 6px;
        background: rgba(245,158,11,0.12); color: #fbbf24;
        padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;
        border: 1px solid rgba(245,158,11,0.25);
      }
      .crm-filter-pill-remove {
        background: none; border: none; color: inherit; cursor: pointer; font-size: 10px; padding: 0;
        width: 14px; height: 14px; display: flex; align-items: center; justify-content: center;
      }

      /* ===== RESULTS HEADER ===== */
      .crm-results-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 14px 24px; flex-wrap: wrap; gap: 12px;
      }
      .crm-results-title { display: flex; align-items: center; gap: 10px; }
      .crm-results-title h2, .crm-results-title h3 { margin: 0; font-size: 16px; font-weight: 800; }
      .crm-count-badge {
        background: var(--crm-elevated); color: var(--crm-text-muted);
        padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 700;
        border: 1px solid var(--crm-border);
      }
      .crm-sort { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--crm-text-muted); }
      .crm-sort select {
        padding: 6px 24px 6px 10px; background: var(--crm-surface); border: 1px solid var(--crm-border);
        border-radius: 8px; color: var(--crm-text); font-size: 13px; outline: none; cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat; background-position: right 8px center;
      }

      /* ===== TABLE ===== */
      .crm-table-card {
        flex: 1; overflow: hidden; display: flex; flex-direction: column;
        margin: 0 24px 24px; background: var(--crm-surface);
        border: 1px solid var(--crm-border); border-radius: 12px;
      }
      .crm-table-scroll { overflow: auto; flex: 1; }
      .crm-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 13px; }
      .crm-table th {
        text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 700;
        color: var(--crm-text-muted); text-transform: uppercase; letter-spacing: 0.5px;
        background: var(--crm-bg); border-bottom: 1px solid var(--crm-border);
        white-space: nowrap; position: sticky; top: 0; z-index: 2;
      }
      .crm-table td { padding: 12px; border-bottom: 1px solid var(--crm-border); vertical-align: middle; background: var(--crm-surface); }
      .th-checkbox, .td-checkbox { width: 44px; text-align: center; padding-right: 0; }
      .th-actions, .td-actions { text-align: right; white-space: nowrap; }

      .crm-row { cursor: pointer; transition: background 0.1s ease; }
      .crm-row:hover td { background: var(--crm-surface-hover); }
      .crm-row.selected td { background: var(--crm-accent-soft); }
      .crm-row.taken td { background: var(--crm-bg); }
      .crm-row.taken { opacity: 0.55; }
      .crm-row.taken:hover { opacity: 0.7; }
      .crm-row:last-child td { border-bottom: none; }

      .crm-checkbox { width: 16px; height: 16px; cursor: pointer; accent-color: var(--crm-accent); }

      .crm-avatar {
        width: 36px; height: 36px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-weight: 700; font-size: 12px; color: #fff; flex-shrink: 0;
        text-shadow: 0 1px 2px rgba(0,0,0,0.2);
      }
      .crm-avatar-lg { width: 48px; height: 48px; font-size: 16px; }

      .crm-person-cell { display: flex; align-items: center; gap: 12px; }
      .crm-person-info { min-width: 0; }
      .crm-person-name { font-weight: 700; color: var(--crm-text); font-size: 13.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .crm-person-email { font-size: 12px; color: var(--crm-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

      .crm-company-cell { min-width: 0; }
      .crm-company-name { font-weight: 600; color: var(--crm-text); font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .crm-company-domain { font-size: 12px; color: var(--crm-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

      .crm-title-cell { font-size: 13px; color: var(--crm-text-secondary); max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .crm-industry-cell { font-size: 12px; color: var(--crm-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px; }
      .crm-location-cell { font-size: 12px; color: var(--crm-text-muted); white-space: nowrap; }
      .crm-pin { opacity: 0.5; margin-right: 4px; }

      .crm-score-wrap { display: inline-flex; flex-direction: column; gap: 3px; min-width: 50px; }
      .crm-score-num { font-weight: 800; font-size: 13px; }
      .crm-score-bar-bg { width: 36px; height: 4px; background: var(--crm-border); border-radius: 2px; overflow: hidden; }
      .crm-score-bar-fill { height: 100%; border-radius: 2px; transition: width 0.3s ease; }

      .crm-status-badge {
        display: inline-flex; align-items: center; gap: 5px;
        padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700;
        border: 1px solid; white-space: nowrap;
      }
      .crm-status-dot { width: 6px; height: 6px; border-radius: 50%; }

      .crm-assigned-pill {
        display: inline-flex; align-items: center; gap: 5px;
        padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700;
        border: 1px solid; white-space: nowrap;
      }
      .crm-assigned-dot { width: 6px; height: 6px; border-radius: 50%; }
      .crm-unassigned-label { font-size: 12px; color: var(--crm-text-subtle); font-style: italic; }

      .crm-money { font-weight: 600; color: var(--crm-text); font-size: 13px; }

      .crm-action-btn {
        background: var(--crm-accent-soft); color: var(--crm-accent);
        border: 1px solid var(--crm-accent-soft-hover);
        padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 700;
        cursor: pointer; transition: all 0.15s ease;
      }
      .crm-action-btn:hover { background: var(--crm-accent-soft-hover); }
      .crm-action-btn.assigned { background: rgba(239,68,68,0.1); color: var(--crm-danger); border-color: rgba(239,68,68,0.25); }

      .crm-assign-dropdown-wrap { position: relative; display: inline-block; }
      .crm-assign-dropdown {
        position: absolute; top: calc(100% + 4px); right: 0;
        background: var(--crm-surface); border: 1px solid var(--crm-border-strong);
        border-radius: 10px; box-shadow: var(--crm-shadow-xl);
        display: none; flex-direction: column; min-width: 160px; z-index: 10;
        overflow: hidden;
      }
      .crm-assign-dropdown-wrap:hover .crm-assign-dropdown,
      .crm-assign-dropdown-wrap:focus-within .crm-assign-dropdown { display: flex; }
      .crm-assign-option {
        display: flex; align-items: center; gap: 8px;
        padding: 8px 12px; background: none; border: none;
        color: var(--crm-text); font-size: 13px; font-weight: 600;
        cursor: pointer; text-align: left;
      }
      .crm-assign-option:hover { background: var(--crm-accent-soft); color: var(--crm-accent); }
      .crm-assign-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

      .crm-icon-btn {
        background: transparent; border: 1px solid var(--crm-border);
        color: var(--crm-text-muted); width: 28px; height: 28px;
        border-radius: 6px; cursor: pointer; display: inline-flex;
        align-items: center; justify-content: center; transition: all 0.15s ease;
        margin-left: 4px;
      }
      .crm-icon-btn:hover { background: var(--crm-accent-soft); border-color: var(--crm-accent); color: var(--crm-accent); }
      .crm-icon-btn-danger:hover { background: rgba(239,68,68,0.1); border-color: var(--crm-danger); color: var(--crm-danger); }

      .crm-pill {
        background: var(--crm-accent-soft); color: var(--crm-accent);
        padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700;
        border: 1px solid var(--crm-accent-soft-hover);
      }

      /* ===== EMPTY STATE ===== */
      .crm-empty { text-align: center; padding: 60px 20px; color: var(--crm-text-muted); }
      .crm-empty-icon { font-size: 40px; margin-bottom: 12px; }
      .crm-empty-title { font-size: 16px; font-weight: 800; color: var(--crm-text); margin-bottom: 4px; }
      .crm-empty-text { font-size: 14px; max-width: 360px; margin: 0 auto; }
      .crm-empty-actions { display: flex; gap: 10px; justify-content: center; margin-top: 18px; }

      /* ===== PAGINATION ===== */
      .crm-pagination {
        display: flex; justify-content: space-between; align-items: center;
        padding: 12px 16px; border-top: 1px solid var(--crm-border);
        background: var(--crm-bg); flex-wrap: wrap; gap: 12px;
      }
      .crm-pagination-info { font-size: 13px; color: var(--crm-text-muted); font-weight: 500; }
      .crm-pagination-current { font-size: 13px; color: var(--crm-text); font-weight: 700; padding: 0 8px; }
      .crm-pagination-controls { display: flex; gap: 6px; align-items: center; }
      .crm-pg-btn {
        background: var(--crm-surface); border: 1px solid var(--crm-border);
        color: var(--crm-text); width: 32px; height: 32px;
        border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 700;
        transition: all 0.15s ease;
      }
      .crm-pg-btn:hover:not(:disabled) { background: var(--crm-accent-soft); border-color: var(--crm-accent); color: var(--crm-accent); }
      .crm-pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }

      /* ===== BULK BAR ===== */
      .crm-bulk-bar {
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
        background: var(--crm-surface); border: 1px solid var(--crm-border-strong);
        border-radius: 14px; padding: 12px 18px;
        display: flex; gap: 18px; align-items: center;
        box-shadow: var(--crm-shadow-xl); z-index: 50;
        animation: crmSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .crm-bulk-count { font-size: 14px; font-weight: 600; color: var(--crm-text); white-space: nowrap; }
      .crm-bulk-num { background: var(--crm-accent); color: #fff; padding: 2px 10px; border-radius: 999px; font-weight: 800; margin-right: 6px; }
      .crm-bulk-actions { display: flex; gap: 8px; flex-wrap: wrap; }

      /* ===== VIEWS ===== */
      .crm-view-page { flex: 1; padding: 24px; overflow-y: auto; }
      .crm-view-header { margin-bottom: 24px; }
      .crm-view-header h2 { margin: 0 0 4px; font-size: 22px; font-weight: 800; }
      .crm-view-header p { margin: 0; color: var(--crm-text-muted); font-size: 14px; }

      .crm-stats-row {
        display: grid; grid-template-columns: repeat(5, 1fr);
        gap: 16px; margin-bottom: 24px;
      }
      .crm-stat-card {
        background: var(--crm-surface); border: 1px solid var(--crm-border);
        border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px;
        box-shadow: var(--crm-shadow-sm);
      }
      .crm-stat-icon {
        width: 44px; height: 44px; border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        font-size: 20px; flex-shrink: 0;
      }
      .crm-stat-body { min-width: 0; }
      .crm-stat-label { font-size: 12px; font-weight: 700; color: var(--crm-text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
      .crm-stat-value { font-weight: 800; margin-top: 4px; letter-spacing: -0.02em; }
      .crm-stat-sub { font-size: 11px; color: var(--crm-text-subtle); margin-top: 2px; }

      .crm-analytics-grid {
        display: grid; grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }
      .crm-analytics-card {
        background: var(--crm-surface); border: 1px solid var(--crm-border);
        border-radius: 12px; padding: 20px;
        box-shadow: var(--crm-shadow-sm);
      }
      .crm-analytics-card h3 { margin: 0 0 16px; font-size: 14px; font-weight: 700; color: var(--crm-text-secondary); }

      .crm-chart { display: flex; flex-direction: column; gap: 12px; }
      .crm-chart-row { display: grid; grid-template-columns: 130px 1fr 40px; align-items: center; gap: 10px; }
      .crm-chart-label { font-size: 12px; color: var(--crm-text-muted); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .crm-chart-bar-bg { height: 8px; background: var(--crm-bg); border-radius: 4px; overflow: hidden; }
      .crm-chart-bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
      .crm-chart-value { font-size: 12px; font-weight: 700; color: var(--crm-text); text-align: right; }

      .crm-lists-layout { display: flex; gap: 20px; height: calc(100vh - 180px); }
      .crm-lists-sidebar {
        width: 260px; background: var(--crm-surface); border: 1px solid var(--crm-border);
        border-radius: 12px; overflow: hidden; display: flex; flex-direction: column;
      }
      .crm-list-item {
        width: 100%; display: flex; justify-content: space-between; align-items: center;
        padding: 12px 16px; background: none; border: none; border-bottom: 1px solid var(--crm-border);
        color: var(--crm-text); font-size: 13px; font-weight: 600; cursor: pointer;
        transition: all 0.15s ease;
      }
      .crm-list-item:hover { background: var(--crm-surface-hover); }
      .crm-list-item.active { background: var(--crm-accent-soft); color: var(--crm-accent); }
      .crm-list-count {
        background: var(--crm-bg); color: var(--crm-text-muted);
        padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700;
      }
      .crm-lists-content { flex: 1; min-width: 0; display: flex; flex-direction: column; }

      /* ===== DRAWER & MODAL ===== */
      .crm-backdrop {
        position: fixed; inset: 0; background: rgba(2,6,23,0.6);
        backdrop-filter: blur(4px); z-index: 99999;
        animation: crmFadeIn 0.2s ease;
      }
      .crm-drawer {
        position: fixed; top: 0; right: 0; bottom: 0;
        width: 520px; max-width: 100vw;
        background: var(--crm-surface);
        border-left: 1px solid var(--crm-border);
        box-shadow: var(--crm-shadow-xl);
        z-index: 100000; display: flex; flex-direction: column;
        animation: crmSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .crm-drawer-header {
        padding: 20px; border-bottom: 1px solid var(--crm-border);
        display: flex; justify-content: space-between; align-items: flex-start;
      }
      .crm-drawer-header-main { display: flex; align-items: center; gap: 14px; min-width: 0; }
      .crm-drawer-titles { min-width: 0; }
      .crm-drawer-name { font-size: 18px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .crm-drawer-sub { font-size: 13px; color: var(--crm-text-muted); margin-top: 2px; }
      .crm-drawer-meta { font-size: 12px; color: var(--crm-text-subtle); margin-top: 2px; }

      .crm-taken-banner {
        padding: 12px 20px; font-size: 13px; font-weight: 600;
        display: flex; align-items: center; flex-wrap: wrap; gap: 8px;
        border-bottom: 1px solid var(--crm-border);
        background: rgba(239,68,68,0.08); color: var(--crm-danger);
      }

      .crm-drawer-quick {
        display: flex; gap: 8px; padding: 14px 20px; border-bottom: 1px solid var(--crm-border); flex-wrap: wrap;
      }
      .crm-quick-btn {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;
        background: var(--crm-bg); color: var(--crm-text-secondary);
        border: 1px solid var(--crm-border); cursor: pointer; text-decoration: none;
        transition: all 0.15s ease;
      }
      .crm-quick-btn:hover { background: var(--crm-surface-hover); border-color: var(--crm-border-strong); }
      .crm-quick-btn-danger { color: var(--crm-danger); }
      .crm-quick-btn-danger:hover { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.2); }

      .crm-drawer-section { padding: 16px 20px; border-bottom: 1px solid var(--crm-border); }
      .crm-drawer-section-block { padding: 18px 20px; border-bottom: 1px solid var(--crm-border); }
      .crm-drawer-section-title {
        font-size: 11px; font-weight: 800; color: var(--crm-text-muted);
        text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 12px;
      }
      .crm-drawer-body { overflow-y: auto; flex: 1; }
      .crm-drawer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      .crm-drawer-field { min-width: 0; }
      .crm-drawer-desc {
        margin-top: 12px; padding: 12px; background: var(--crm-bg);
        border-radius: 8px; font-size: 13px; color: var(--crm-text-secondary); line-height: 1.6;
      }

      .crm-contact-log-list { display: flex; flex-direction: column; gap: 10px; }
      .crm-contact-log-item {
        background: var(--crm-bg); border: 1px solid var(--crm-border);
        border-radius: 8px; padding: 10px 12px;
      }
      .crm-contact-log-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
      .crm-contact-log-date { font-size: 12px; font-weight: 700; color: var(--crm-text); }
      .crm-contact-log-method {
        font-size: 11px; font-weight: 700; color: var(--crm-accent);
        background: var(--crm-accent-soft); padding: 2px 8px; border-radius: 999px;
      }
      .crm-contact-log-notes { font-size: 13px; color: var(--crm-text-secondary); }

      .crm-section-label {
        font-size: 11px; font-weight: 800; color: var(--crm-text-muted);
        text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 10px;
      }
      .crm-chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
      .crm-chip {
        background: transparent; border: 1px solid var(--crm-border);
        color: var(--crm-text-muted); padding: 5px 12px; border-radius: 999px;
        font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s ease;
      }
      .crm-chip:hover { border-color: var(--crm-border-strong); }

      .crm-field-label { font-size: 11px; color: var(--crm-text-muted); font-weight: 700; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.4px; }
      .crm-field-value { font-size: 13.5px; color: var(--crm-text); line-height: 1.5; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 6px; }
      .crm-field-value.empty { color: var(--crm-text-subtle); }
      .crm-field-link { color: var(--crm-accent); text-decoration: none; font-weight: 600; }
      .crm-field-link:hover { text-decoration: underline; }
      .crm-field-copy { opacity: 0.4; background: none; border: none; cursor: pointer; font-size: 11px; padding: 0; }
      .crm-field-copy:hover { opacity: 1; }

      .crm-mini-btn {
        background: transparent; border: 1px solid currentColor;
        padding: 2px 10px; border-radius: 5px; font-size: 11px; font-weight: 700;
        cursor: pointer; color: inherit; transition: all 0.15s ease;
      }
      .crm-mini-btn:hover { background: rgba(255,255,255,0.06); }
      .crm-mini-btn.primary { background: var(--crm-accent); color: #fff; border-color: var(--crm-accent); }
      .crm-mini-btn.primary:hover { background: var(--crm-accent-hover); }

      .crm-modal {
        position: fixed; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 720px; max-width: 95vw; max-height: 92vh;
        background: var(--crm-surface);
        border: 1px solid var(--crm-border);
        border-radius: 14px;
        box-shadow: var(--crm-shadow-xl);
        z-index: 100001;
        display: flex; flex-direction: column;
        animation: crmModalIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .crm-modal-header {
        padding: 20px; border-bottom: 1px solid var(--crm-border);
        display: flex; justify-content: space-between; align-items: flex-start;
      }
      .crm-modal-title { font-size: 18px; font-weight: 800; }
      .crm-modal-sub { font-size: 13px; color: var(--crm-text-muted); margin-top: 2px; }
      .crm-modal-body { padding: 20px; overflow-y: auto; flex: 1; }
      .crm-modal-footer {
        padding: 14px 20px; border-top: 1px solid var(--crm-border);
        display: flex; justify-content: flex-end; gap: 10px;
        background: var(--crm-bg);
      }

      .crm-form-section-title {
        font-size: 11px; font-weight: 800; color: var(--crm-text-muted);
        text-transform: uppercase; letter-spacing: 0.8px;
        margin-bottom: 12px; padding-bottom: 8px;
        border-bottom: 1px solid var(--crm-border);
      }
      .crm-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .crm-form-label { font-size: 12px; font-weight: 600; color: var(--crm-text); display: block; margin-bottom: 4px; }
      .crm-input {
        width: 100%; padding: 9px 12px; background: var(--crm-input-bg);
        border: 1px solid var(--crm-border); border-radius: 8px;
        color: var(--crm-text); font-size: 14px; outline: none;
        transition: all 0.15s ease; box-sizing: border-box;
      }
      .crm-input:focus { border-color: var(--crm-accent); box-shadow: 0 0 0 3px var(--crm-accent-soft); }
      .crm-input::placeholder { color: var(--crm-text-subtle); }

      .crm-contact-log-editor { display: flex; flex-direction: column; gap: 10px; }
      .crm-contact-log-row {
        display: grid; grid-template-columns: 130px 130px 1fr 32px;
        gap: 8px; align-items: center;
      }
      .crm-contact-log-remove {
        background: transparent; border: 1px solid var(--crm-border);
        color: var(--crm-text-muted); width: 28px; height: 28px;
        border-radius: 6px; cursor: pointer; display: flex;
        align-items: center; justify-content: center; font-size: 12px;
      }
      .crm-contact-log-remove:hover { background: rgba(239,68,68,0.1); border-color: var(--crm-danger); color: var(--crm-danger); }
      .crm-contact-log-add {
        display: inline-flex; align-items: center; gap: 6px;
        background: var(--crm-accent-soft); color: var(--crm-accent);
        border: 1px solid var(--crm-accent-soft-hover);
        padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;
        cursor: pointer; width: fit-content;
      }
      .crm-contact-log-add:hover { background: var(--crm-accent-soft-hover); }

      /* ===== CSV IMPORT ===== */
      .crm-dropzone {
        border: 2px dashed var(--crm-border-strong); border-radius: 12px;
        padding: 50px 20px; text-align: center; cursor: pointer;
        transition: all 0.15s ease; background: var(--crm-bg);
      }
      .crm-dropzone:hover, .crm-dropzone.drag {
        border-color: var(--crm-accent); background: var(--crm-accent-soft);
      }
      .crm-import-status {
        margin-bottom: 16px; padding: 10px 14px;
        background: var(--crm-accent-soft); border-radius: 8px;
        font-size: 13px; color: var(--crm-accent); font-weight: 600;
      }
      .crm-mapping-grid { display: grid; grid-template-columns: 1fr 1fr 1.2fr; gap: 8px; align-items: center; }
      .crm-mapping-head {
        font-size: 11px; font-weight: 700; color: var(--crm-text-muted);
        text-transform: uppercase; letter-spacing: 0.5px;
        padding-bottom: 6px; border-bottom: 1px solid var(--crm-border);
      }
      .crm-mapping-csv { font-weight: 600; font-size: 14px; }
      .crm-mapping-sample { font-size: 13px; color: var(--crm-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .crm-preview-table {
        width: 100%; border-collapse: collapse; font-size: 12px;
        border: 1px solid var(--crm-border); border-radius: 8px; overflow: hidden;
      }
      .crm-preview-table th, .crm-preview-table td {
        padding: 8px 10px; text-align: left; border-bottom: 1px solid var(--crm-border);
      }
      .crm-preview-table th {
        background: var(--crm-bg); font-weight: 700; color: var(--crm-text-muted);
        text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px;
      }

      /* ===== TOASTS ===== */
      .crm-toasts {
        position: fixed; top: 24px; right: 24px;
        display: flex; flex-direction: column; gap: 10px;
        z-index: 100002; pointer-events: none;
      }
      .crm-toast {
        padding: 12px 18px; border-radius: 10px;
        background: var(--crm-surface); color: var(--crm-text);
        border: 1px solid var(--crm-border);
        box-shadow: var(--crm-shadow-lg);
        font-size: 14px; font-weight: 500;
        animation: crmToastIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: auto;
      }
      .crm-toast-success { border-left: 3px solid var(--crm-success); }
      .crm-toast-error   { border-left: 3px solid var(--crm-danger); }
      .crm-toast-warning { border-left: 3px solid var(--crm-warning); }
      .crm-toast-info    { border-left: 3px solid var(--crm-accent); }

      /* ===== SPINNER ===== */
      .crm-spinner {
        width: 32px; height: 32px; border: 3px solid var(--crm-border);
        border-top-color: var(--crm-accent); border-radius: 50%;
        animation: crmSpin 0.8s linear infinite; margin: 0 auto 12px;
      }

      /* ===== BUTTONS ===== */
      .crm-btn-primary {
        background: var(--crm-accent); color: #fff; border: none;
        padding: 9px 18px; border-radius: 8px; font-weight: 600; font-size: 14px;
        cursor: pointer; transition: all 0.15s ease;
        display: inline-flex; align-items: center; gap: 6px;
        box-shadow: var(--crm-shadow-sm);
      }
      .crm-btn-primary:hover { background: var(--crm-accent-hover); transform: translateY(-1px); box-shadow: var(--crm-shadow-md); }
      .crm-btn-primary:active { transform: translateY(0); }
      .crm-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

      .crm-btn-secondary {
        background: var(--crm-surface); color: var(--crm-text-secondary);
        border: 1px solid var(--crm-border); padding: 9px 16px; border-radius: 8px;
        font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.15s ease;
        display: inline-flex; align-items: center; gap: 6px;
      }
      .crm-btn-secondary:hover { background: var(--crm-surface-hover); border-color: var(--crm-border-strong); }
      .crm-btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }

      .crm-btn-danger {
        background: var(--crm-danger); color: #fff; border: none;
        padding: 9px 16px; border-radius: 8px; font-weight: 600; font-size: 14px;
        cursor: pointer; transition: all 0.15s ease;
      }
      .crm-btn-danger:hover { filter: brightness(0.92); }

      .crm-btn-text {
        background: transparent; border: none; color: var(--crm-accent);
        font-weight: 600; font-size: 13px; cursor: pointer; padding: 4px 8px;
      }
      .crm-btn-text:hover { text-decoration: underline; }

      /* ===== ANIMATIONS ===== */
      @keyframes crmPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
      @keyframes crmSpin { to { transform: rotate(360deg); } }
      @keyframes crmFadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes crmSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      @keyframes crmSlideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
      @keyframes crmModalIn {
        from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
      @keyframes crmToastIn {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }

      @media (max-width: 1100px) {
        .crm-stats-row { grid-template-columns: repeat(3, 1fr); }
        .crm-analytics-grid { grid-template-columns: 1fr; }
      }
      @media (max-width: 900px) {
        .crm-sidebar { display: none; }
        .crm-layout { flex-direction: column; }
        .crm-drawer { width: 100vw; }
        .crm-drawer-grid { grid-template-columns: 1fr; }
        .crm-form-row { grid-template-columns: 1fr; }
        .crm-contact-log-row { grid-template-columns: 1fr 1fr 1fr 32px; }
        .crm-table { font-size: 12px; }
        .crm-table th, .crm-table td { padding: 8px; }
        .crm-bulk-bar { left: 12px; right: 12px; transform: none; bottom: 12px; }
        .crm-stats-row { grid-template-columns: repeat(2, 1fr); }
        .crm-lists-layout { flex-direction: column; height: auto; }
        .crm-lists-sidebar { width: 100%; }
      }
    `}</style>
  );
}
