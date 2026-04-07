import { useEffect, useState, useRef } from "react";
import axios from "axios";
import TiptapEditor, { insertText } from "./ui/TiptapEditor";

const API = "https://techfest-canada-backend.onrender.com/api";

const PHASES = ["Phase 1", "Phase 2", "Phase 3", "Phase 4", "Phase 5"];
const AUDIENCES = ["Sponsors", "Exhibitors", "Delegates", "Visitors"];

const PHASE_COLORS = {
  "Phase 1": "#8b5cf6",
  "Phase 2": "#3b82f6",
  "Phase 3": "#f59e0b",
  "Phase 4": "#ef4444",
  "Phase 5": "#22c55e",
};

const PERSONALIZATION_TOKENS = [
  { key: "firstname", label: "First Name" },
  { key: "lastname", label: "Last Name" },
  { key: "company", label: "Company" },
  { key: "title", label: "Job Title" },
  { key: "location", label: "Location" },
];

const EMAIL_TEMPLATES = [
  {
    id: "default",
    name: "Default Template",
    getHtml: (campaign) => generateDefaultHtml(campaign),
  },
  {
    id: "simple",
    name: "Simple & Clean",
    getHtml: (campaign) => generateSimpleTemplate(campaign),
  },
  {
    id: "bold",
    name: "Bold Header",
    getHtml: (campaign) => generateBoldTemplate(campaign),
  },
  {
    id: "minimal",
    name: "Minimalist",
    getHtml: (campaign) => generateMinimalTemplate(campaign),
  },
  {
    id: "corporate",
    name: "Corporate",
    getHtml: (campaign) => generateCorporateTemplate(campaign),
  },
];

const STATUS_BADGE = {
  pending: { bg: "bg-gray-600/20", color: "text-gray-300", label: "Pending" },
  draft: { bg: "bg-yellow-600/20", color: "text-yellow-300", label: "Draft" },
  sent: { bg: "bg-green-600/20", color: "text-green-300", label: "Sent" },
  skipped: { bg: "bg-red-600/20", color: "text-red-300", label: "Skipped" },
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function AdminCampaignCalendar() {
  const [isDark, setIsDark] = useState(true);
  const [calendar, setCalendar] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [seedStatus, setSeedStatus] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [activeTab, setActiveTab] = useState("calendar");
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [addingCampaign, setAddingCampaign] = useState(null);
  const [expandedCells, setExpandedCells] = useState({});
  const [audiences, setAudiences] = useState([]);
  const [sendingAudience, setSendingAudience] = useState("");

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
    fetchCalendar();
    fetchUpcoming();
    fetchAudiences();
  }, []);

  const fetchAudiences = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/campaigns/audiences`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAudiences(res.data);
    } catch (err) {
      console.error("Failed to fetch audiences:", err);
    }
  };

  const fetchCalendar = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/campaigns/automation/calendar`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCalendar(res.data.calendar);
    } catch (err) {
      console.error("Failed to fetch calendar:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcoming = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/campaigns/automation/upcoming?days=30`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUpcoming(res.data);
    } catch (err) {
      console.error("Failed to fetch upcoming:", err);
    }
  };

  const handleSeed = async () => {
    if (!confirm("This will create all 54 campaign templates. Continue?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API}/campaigns/automation/seed`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSeedStatus(res.data);
      fetchCalendar();
    } catch (err) {
      console.error("Seed failed:", err);
    }
  };

  const sendCampaign = async (templateId) => {
    if (!sendingAudience) {
      alert("Please select an audience to send to");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/campaigns/automation/templates/${templateId}/send`, 
        { audienceId: sendingAudience },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Campaign sent!");
      setSendingAudience("");
      fetchCalendar();
      fetchUpcoming();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send");
    }
  };

  const daysUntil = (dateStr) => {
    const now = new Date();
    const target = new Date(dateStr);
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "Past";
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return `${diff} days`;
  };

  const toggleCell = (phase, audience) => {
    const key = `${phase}-${audience}`;
    setExpandedCells((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  const totalCampaigns = Object.values(calendar).reduce((sum, phase) => {
    return sum + Object.values(phase).reduce((s, aud) => s + aud.length, 0);
  }, 0);

  const textMain = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-700";
  const cardBg = isDark ? "bg-[#0a0515]" : "bg-white";
  const cardBorder = isDark ? "border-gray-800" : "border-gray-200";
  const tabBg = isDark ? "bg-[#1a1035]" : "bg-gray-100";
  const tabHover = isDark ? "hover:bg-[#2a1850]" : "hover:bg-gray-200";
  const headerBorder = isDark ? "border-gray-700" : "border-gray-200";

  return (
    <div className="admin-card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-xl font-bold ${textMain}`}>Campaign Calendar</h2>
          <p className={`${textMuted} text-sm mt-1`}>
            {totalCampaigns} campaigns across 5 phases • {upcoming.length} upcoming
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSeed} className="btn-secondary text-sm">
            {seedStatus ? "Re-seed (done)" : "Initialize 54 Campaigns"}
          </button>
        </div>
      </div>

      <div className={`flex gap-2 mb-6 border-b ${headerBorder} pb-4`}>
        {["calendar", "upcoming", "by-audience"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-purple-600 text-white"
                : `${tabBg} ${textSecondary} ${tabHover}`
            }`}
          >
            {tab === "calendar" ? "📅 Calendar" : tab === "upcoming" ? "⏰ Upcoming" : "👥 By Audience"}
          </button>
        ))}
      </div>

      {activeTab === "calendar" && (
        <div className="space-y-6">
          {PHASES.map((phase) => (
            <div key={phase}>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="px-3 py-1 rounded text-xs font-bold uppercase"
                  style={{ backgroundColor: `${PHASE_COLORS[phase]}20`, color: PHASE_COLORS[phase] }}
                >
                  {phase}
                </span>
                <span className={textMuted + " text-xs"}>
                  {Object.values(calendar[phase] || {}).flat().length} campaigns
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {AUDIENCES.map((audience) => {
                  const campaigns = calendar[phase]?.[audience] || [];
                  return (
                    <div key={audience} className={`${cardBg} rounded-lg p-3 border ${cardBorder}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-xs ${textMuted} uppercase`}>{audience}</span>
                        <button
                          onClick={() => setAddingCampaign({ phase, audience })}
                          className="text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-600/20 px-2 py-1 rounded transition-colors"
                        >
                          + Add
                        </button>
                      </div>
                      {campaigns.length === 0 ? (
                        <div className="text-gray-500 text-xs italic">No campaigns</div>
                      ) : (
                        <div className="space-y-2">
                          {(expandedCells[`${phase}-${audience}`] ? campaigns : campaigns.slice(0, 3)).map((c) => (
                            <CampaignCard
                              key={c.id}
                              campaign={c}
                              onClick={() => setSelectedCampaign(c)}
                              isDark={isDark}
                            />
                          ))}
                          {campaigns.length > 3 && (
                            <button
                              onClick={() => toggleCell(phase, audience)}
                              className="text-gray-500 text-xs text-center w-full hover:text-purple-400 transition-colors"
                            >
                              {expandedCells[`${phase}-${audience}`]
                                ? "Show less"
                                : `+${campaigns.length - 3} more`}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "upcoming" && (
        <div>
          {upcoming.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No upcoming campaigns in the next 30 days
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((c) => (
                <div
                  key={c._id}
                  className="bg-[#1a1035] border border-gray-700 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {new Date(c.sendDate).getDate()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(c.sendDate).toLocaleString("en-US", { month: "short" })}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded bg-purple-600/20 text-purple-300">
                          {c.audience}
                        </span>
                        <span className="text-xs text-gray-500">{daysUntil(c.sendDate)}</span>
                      </div>
                      <div className="text-white font-medium">{c.subject}</div>
                      <div className="text-xs text-gray-400 mt-1">{c.purpose}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCampaign(c)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium"
                    >
                      Review & Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "by-audience" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AUDIENCES.map((audience) => (
            <div key={audience} className="bg-[#1a1035] rounded-xl p-5 border border-gray-700">
              <h3 className="text-white font-semibold mb-4">{audience}</h3>
              <div className="space-y-2">
                {PHASES.map((phase) => {
                  const campaigns = calendar[phase]?.[audience] || [];
                  const sent = campaigns.filter((c) => c.status === "sent").length;
                  const pending = campaigns.filter((c) => c.status === "pending").length;

                  return (
                    <div key={phase} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{phase}</span>
                      <div className="flex items-center gap-3">
                        {sent > 0 && (
                          <span className="text-green-400">{sent} sent</span>
                        )}
                        {pending > 0 && (
                          <span className="text-gray-500">{pending} pending</span>
                        )}
                        {!sent && !pending && (
                          <span className="text-gray-600">-</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-500">
                  Total: {Object.values(calendar).reduce((sum, phase) => sum + (phase[audience]?.length || 0), 0)} campaigns
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCampaign && (
        <CampaignDetailModal
          campaign={selectedCampaign}
          audiences={audiences}
          sendingAudience={sendingAudience}
          setSendingAudience={setSendingAudience}
          onClose={() => setSelectedCampaign(null)}
          onSend={async () => {
            await sendCampaign(selectedCampaign._id || selectedCampaign.id);
            setSelectedCampaign(null);
          }}
          onEdit={() => {
            setEditingCampaign(selectedCampaign);
            setSelectedCampaign(null);
          }}
          onUpdateDate={(updated) => {
            setSelectedCampaign((prev) => ({ ...prev, sendDate: updated.sendDate }));
            fetchCalendar();
          }}
          onDelete={() => {
            setSelectedCampaign(null);
            fetchCalendar();
          }}
        />
      )}

      {editingCampaign && (
        <EmailEditorModal
          campaign={editingCampaign}
          onClose={() => setEditingCampaign(null)}
          onSave={() => {
            fetchCalendar();
          }}
          onSend={() => {
            fetchCalendar();
            fetchUpcoming();
            setEditingCampaign(null);
          }}
        />
      )}

      {addingCampaign && (
        <AddCampaignModal
          phase={addingCampaign.phase}
          audience={addingCampaign.audience}
          onClose={() => setAddingCampaign(null)}
          onCreated={() => {
            fetchCalendar();
            setAddingCampaign(null);
          }}
        />
      )}
    </div>
  );
}

function CampaignCard({ campaign, onClick, isDark = true }) {
  const statusStyle = STATUS_BADGE[campaign.status] || STATUS_BADGE.pending;
  const cardBg = isDark ? "bg-[#1a1035]" : "bg-gray-50";
  const cardBorder = isDark ? "border-gray-700" : "border-gray-200";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-500" : "text-gray-500";

  return (
    <div
      onClick={onClick}
      className={`${cardBg} rounded p-2 border ${cardBorder} hover:border-purple-500 cursor-pointer transition-colors`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs ${textMuted}`}>
          {formatDate(campaign.sendDate)}
        </span>
        <span className={`text-xs px-1.5 py-0.5 rounded ${statusStyle.bg} ${statusStyle.color}`}>
          {statusStyle.label}
        </span>
      </div>
      <div className={`text-xs ${textMain} line-clamp-2`}>{campaign.subject}</div>
    </div>
  );
}

function CampaignDetailModal({ campaign, onClose, onSend, onEdit, onUpdateDate, onDelete, audiences, sendingAudience, setSendingAudience }) {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [savingDate, setSavingDate] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
      return;
    }
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/campaigns/automation/templates/${campaign.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete campaign");
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveDate = async () => {
    if (!newDate) return;
    setSavingDate(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API}/campaigns/automation/templates/${campaign.id}`,
        { sendDate: newDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditingDate(false);
      if (onUpdateDate) onUpdateDate(res.data);
    } catch {
      alert("Failed to update date");
    } finally {
      setSavingDate(false);
    }
  };

  const formatDateForInput = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1035] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-1 rounded bg-purple-600/20 text-purple-300">
                {campaign.audience || campaign.phase}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${STATUS_BADGE[campaign.status]?.bg} ${STATUS_BADGE[campaign.status]?.color}`}>
                {STATUS_BADGE[campaign.status]?.label}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">{campaign.subject}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            ×
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Send Date</span>
              {isEditingDate ? (
                <div className="flex gap-2 mt-1">
                  <input
                    type="date"
                    value={newDate || formatDateForInput(campaign.sendDate)}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="bg-[#0a0515] border border-gray-700 rounded px-3 py-1.5 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    onClick={handleSaveDate}
                    disabled={savingDate}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded disabled:opacity-50"
                  >
                    {savingDate ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setIsEditingDate(false)}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-white">{formatDate(campaign.sendDate)}</p>
                  <button
                    onClick={() => {
                      setIsEditingDate(true);
                      setNewDate(formatDateForInput(campaign.sendDate));
                    }}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
            <div>
              <span className="text-gray-500">Purpose</span>
              <p className="text-white">{campaign.purpose}</p>
            </div>
            <div>
              <span className="text-gray-500">Segment</span>
              <p className="text-white">{campaign.segment || "All contacts"}</p>
            </div>
            <div>
              <span className="text-gray-500">CTA</span>
              <p className="text-white">{campaign.ctaText}</p>
            </div>
          </div>

          <div>
            <span className="text-gray-500 text-sm">Body Summary</span>
            <p className="text-white mt-1">{campaign.bodySummary}</p>
          </div>

          <div>
            <span className="text-gray-500 text-sm">CTA Link</span>
            <p className="text-purple-400 mt-1">{campaign.ctaLink}</p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex gap-3 justify-between">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn-secondary bg-red-600/20 border-red-600/50 text-red-400 hover:bg-red-600/30 hover:border-red-500"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
          <div className="flex gap-3 items-center">
            {campaign.status === "pending" && (
              <>
                <select
                  value={sendingAudience}
                  onChange={(e) => setSendingAudience(e.target.value)}
                  className="bg-[#0a0515] border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select Audience...</option>
                  {audiences?.map((aud) => (
                    <option key={aud._id} value={aud._id}>
                      {aud.name} ({aud.contactCount || 0})
                    </option>
                  ))}
                </select>
                <button onClick={onEdit} className="btn-secondary">
                  Edit & Preview
                </button>
                <button 
                  onClick={onSend} 
                  disabled={!sendingAudience}
                  className="btn-primary bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Campaign
                </button>
              </>
            )}
            {campaign.status !== "pending" && (
              <button onClick={onClose} className="btn-secondary">
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailEditorModal({ campaign, onClose, onSend, onSave }) {
  const [subject, setSubject] = useState(campaign.subject || "");
  const [htmlBody, setHtmlBody] = useState(campaign.htmlBody || campaign.template || generateDefaultHtml(campaign));
  const [textBody, setTextBody] = useState(campaign.textBody || campaign.bodySummary || "");
  const [activeTab, setActiveTab] = useState("editor");
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const editorRef = useRef(null);
  const codeEditorRef = useRef(null);

  useEffect(() => {
    setSubject(campaign.subject || "");
    setHtmlBody(campaign.htmlBody || campaign.template || generateDefaultHtml(campaign));
    setTextBody(campaign.textBody || campaign.bodySummary || "");
  }, [campaign]);

  const insertToken = (token) => {
    if (editorRef.current) {
      insertText(editorRef.current, `/${token}`);
    }
  };

  const insertImageToCodeEditor = (imgTag) => {
    const textarea = codeEditorRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = htmlBody;
    const newText = text.substring(0, start) + imgTag + text.substring(end);
    setHtmlBody(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + imgTag.length, start + imgTag.length);
    }, 0);
  };

  const handleCodeImageUrl = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      insertImageToCodeEditor(`<img src="${url}" alt="Image" style="max-width:100%;height:auto;" />`);
    }
  };

  const handleCodeImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        insertImageToCodeEditor(`<img src="${base64}" alt="Image" style="max-width:100%;height:auto;" />`);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const insertTokenToCodeEditor = (token) => {
    const textarea = codeEditorRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const text = htmlBody;
    const newText = text.substring(0, start) + `/${token}` + text.substring(start);
    setHtmlBody(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + token.length + 1, start + token.length + 1);
    }, 0);
  };

  const handleTemplateSelect = (template) => {
    const newHtml = template.getHtml(campaign);
    setHtmlBody(newHtml);
    setShowTemplateSelector(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API}/campaigns/automation/templates/${campaign.id || campaign._id}`,
        { subject, htmlBody, textBody },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Template saved!");
      onSave?.();
    } catch (err) {
      console.error("Save error:", err);
      alert(err.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    setSending(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API}/campaigns/automation/templates/${campaign.id || campaign._id}/send`,
        { subject, htmlBody, textBody },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Campaign sent!");
      onSend();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1035] rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-700 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white">Edit Email Content</h3>
            <p className="text-gray-400 text-sm mt-1">
              {campaign.audience} • {campaign.purpose}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            ×
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#0a0515] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
              placeholder="Enter email subject..."
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-400 text-sm">Personalization:</span>
            {PERSONALIZATION_TOKENS.map((token) => (
              <button
                key={token.key}
                onClick={() => insertToken(token.key)}
                className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-sm rounded-full transition-colors border border-purple-600/30"
              >
                /{token.key}
              </button>
            ))}
            <button
              onClick={() => setShowTemplateSelector(!showTemplateSelector)}
              className="ml-auto px-3 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-sm rounded-full transition-colors border border-blue-600/30 flex items-center gap-1"
            >
              <span>📄</span> Templates
            </button>
          </div>

          {showTemplateSelector && (
            <div className="bg-[#0a0515] border border-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-3">Select a template:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {EMAIL_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className="p-3 bg-[#1a1035] hover:bg-[#2a1a45] border border-gray-600 hover:border-purple-500 rounded-lg text-left transition-colors"
                  >
                    <span className="text-white text-sm font-medium">{template.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setActiveTab("editor")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "editor"
                  ? "bg-purple-600 text-white"
                  : "bg-[#0a0515] text-gray-300 hover:bg-[#1a1035]"
              }`}
            >
              Visual Editor
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "code"
                  ? "bg-purple-600 text-white"
                  : "bg-[#0a0515] text-gray-300 hover:bg-[#1a1035]"
              }`}
            >
              HTML Code
            </button>
            <button
              onClick={() => setActiveTab("text")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "text"
                  ? "bg-purple-600 text-white"
                  : "bg-[#0a0515] text-gray-300 hover:bg-[#1a1035]"
              }`}
            >
              Plain Text
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "preview"
                  ? "bg-purple-600 text-white"
                  : "bg-[#0a0515] text-gray-300 hover:bg-[#1a1035]"
              }`}
            >
              Preview
            </button>
          </div>

          {activeTab === "editor" && (
            <TiptapEditor
              ref={editorRef}
              value={htmlBody}
              onChange={setHtmlBody}
              placeholder="Start writing your email..."
              minHeight="300px"
              darkMode={true}
            />
          )}

          {activeTab === "code" && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-gray-400 text-xs">Insert:</span>
                {["firstname", "lastname", "company", "title", "location"].map((token) => (
                  <button
                    key={token}
                    type="button"
                    onClick={() => insertTokenToCodeEditor(token)}
                    className="px-2 py-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-xs rounded transition-colors border border-purple-600/30"
                  >
                    /{token}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={handleCodeImageUrl}
                  className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-sm rounded transition-colors border border-purple-600/30 flex items-center gap-1"
                >
                  🔗 Add Image from URL
                </button>
                <label className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-sm rounded transition-colors border border-purple-600/30 flex items-center gap-1 cursor-pointer">
                  📁 Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCodeImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <textarea
                ref={codeEditorRef}
                value={htmlBody}
                onChange={(e) => setHtmlBody(e.target.value)}
                placeholder="<html><body><h1>Hello!</h1>...</body></html>"
                rows={15}
                className="w-full bg-[#0a0515] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none font-mono text-sm"
              />
            </>
          )}

          {activeTab === "text" && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-400 text-sm">Plain Text Body</label>
                <span className="text-xs text-gray-500">Text-only version for email clients</span>
              </div>
              <textarea
                value={textBody}
                onChange={(e) => setTextBody(e.target.value)}
                className="w-full bg-[#0a0515] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none h-80"
                placeholder="Enter your plain text email content..."
              />
            </div>
          )}

          {activeTab === "preview" && (
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">HTML Preview</label>
                <div className="bg-white text-black rounded-lg p-4 max-h-80 overflow-y-auto border border-gray-700">
                  <div dangerouslySetInnerHTML={{ __html: htmlBody || "<p>No HTML content</p>" }} />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Text Preview</label>
                <div className="bg-[#0a0515] border border-gray-700 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-gray-300 font-sans text-sm">{textBody || "No text content"}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-700 flex gap-3 justify-end">
          <button onClick={handleSave} disabled={saving} className="btn-secondary">
            {saving ? "Saving..." : "Save Template"}
          </button>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="btn-primary bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
}

function generateDefaultHtml(campaign) {
  const ctaFullLink = campaign.ctaLink?.startsWith("http") 
    ? campaign.ctaLink 
    : `https://${campaign.ctaLink}`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f0ff;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
      <div style="background:linear-gradient(135deg,#7a3fd1,#f5a623);padding:40px 30px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;">The Tech Festival Canada 2026</h1>
        <p style="color:rgba(255,255,255,0.9);margin:10px 0 0;font-size:14px;">October 26-27, 2026 • Toronto, ON</p>
      </div>
      
      <div style="padding:40px 30px;">
        <p style="color:#333;font-size:16px;line-height:1.6;">
          ${campaign.bodySummary || "Your email content here..."}
        </p>
        
        <div style="text-align:center;margin:30px 0;">
          <a href="${ctaFullLink}" style="display:inline-block;background:linear-gradient(135deg,#7a3fd1,#f5a623);color:white;padding:16px 32px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:16px;">
            ${campaign.ctaText} →
          </a>
        </div>
        
        <div style="background:#f9f5ff;border-radius:8px;padding:20px;margin-top:30px;">
          <p style="margin:0;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Campaign Info</p>
          <p style="margin:5px 0 0;color:#333;font-size:14px;">
            <strong>Phase:</strong> ${campaign.phase} | 
            <strong>Audience:</strong> ${campaign.audience} | 
            <strong>Purpose:</strong> ${campaign.purpose}
          </p>
        </div>
      </div>
      
      <div style="background:#1a1035;padding:30px;text-align:center;">
        <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0;">
          The Tech Festival Canada • Toronto, Ontario
        </p>
        <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:10px 0 0;">
          <a href="#" style="color:rgba(255,255,255,0.5);">Unsubscribe</a> | 
          <a href="#" style="color:rgba(255,255,255,0.5);">View in browser</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generateSimpleTemplate(campaign) {
  const ctaFullLink = campaign.ctaLink?.startsWith("http") ? campaign.ctaLink : `https://${campaign.ctaLink}`;
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:40px;">
      <h1 style="color:#1a1035;margin:0;font-size:28px;font-weight:bold;">The Tech Festival Canada</h1>
      <p style="color:#666;margin:10px 0 0;font-size:14px;">October 26-27, 2026 • Toronto, ON</p>
    </div>
    
    <div style="background:#fafafa;border-radius:8px;padding:40px 30px;">
      <p style="color:#333;font-size:16px;line-height:1.6;margin:0 0 20px;">
        ${campaign.bodySummary || "Your email content here..."}
      </p>
      
      <div style="text-align:center;margin:30px 0;">
        <a href="${ctaFullLink}" style="display:inline-block;background:#1a1035;color:white;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">
          ${campaign.ctaText || "Learn More"} →
        </a>
      </div>
    </div>
    
    <div style="text-align:center;padding:30px 0;">
      <p style="color:#999;font-size:12px;margin:0;">
        The Tech Festival Canada • Toronto, Ontario
      </p>
      <p style="color:#ccc;font-size:11px;margin:10px 0 0;">
        <a href="#" style="color:#999;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

function generateBoldTemplate(campaign) {
  const ctaFullLink = campaign.ctaLink?.startsWith("http") ? campaign.ctaLink : `https://${campaign.ctaLink}`;
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#fafafa;font-family:Georgia,serif;">
  <div style="background:#1a1035;padding:50px 30px;text-align:center;">
    <h1 style="color:white;margin:0;font-size:32px;font-weight:bold;letter-spacing:-1px;">The Tech Festival Canada</h1>
    <p style="color:rgba(255,255,255,0.8);margin:15px 0 0;font-size:16px;font-style:italic;">October 26-27, 2026 • Toronto, ON</p>
  </div>
  
  <div style="max-width:600px;margin:-30px auto 0;padding:0 20px;">
    <div style="background:white;border-radius:12px;padding:50px 40px;box-shadow:0 10px 40px rgba(0,0,0,0.08);">
      <p style="color:#222;font-size:18px;line-height:1.7;margin:0 0 25px;font-family:Helvetica,Arial,sans-serif;">
        ${campaign.bodySummary || "Your email content here..."}
      </p>
      
      <div style="text-align:center;margin:40px 0;">
        <a href="${ctaFullLink}" style="display:inline-block;background:#f59e0b;color:#1a1035;padding:18px 40px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;text-transform:uppercase;letter-spacing:1px;">
          ${campaign.ctaText || "Get Tickets"} →
        </a>
      </div>
    </div>
  </div>
  
  <div style="max-width:600px;margin:0 auto;padding:30px 20px;text-align:center;">
    <p style="color:#888;font-size:12px;margin:0;">
      The Tech Festival Canada • Toronto, Ontario
    </p>
    <p style="color:#ccc;font-size:11px;margin:10px 0 0;">
      <a href="#" style="color:#999;">Unsubscribe</a> | <a href="#" style="color:#999;">View in browser</a>
    </p>
  </div>
</body>
</html>`;
}

function generateMinimalTemplate(campaign) {
  const ctaFullLink = campaign.ctaLink?.startsWith("http") ? campaign.ctaLink : `https://${campaign.ctaLink}`;
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
  <div style="max-width:500px;margin:0 auto;padding:60px 20px;">
    <div style="margin-bottom:50px;">
      <h2 style="color:#000;margin:0;font-size:24px;font-weight:normal;">The Tech Festival Canada</h2>
      <p style="color:#888;margin:10px 0 0;font-size:13px;">October 26-27, 2026 • Toronto</p>
    </div>
    
    <div style="margin-bottom:40px;">
      <p style="color:#333;font-size:15px;line-height:1.7;margin:0;">
        ${campaign.bodySummary || "Your email content here..."}
      </p>
    </div>
    
    <div style="margin-bottom:60px;">
      <a href="${ctaFullLink}" style="color:#0066cc;text-decoration:none;font-size:14px;">
        ${campaign.ctaText || "Learn More"} →
      </a>
    </div>
    
    <div style="border-top:1px solid #eee;padding-top:30px;">
      <p style="color:#aaa;font-size:11px;margin:0;">
        <a href="#" style="color:#aaa;text-decoration:underline;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

function generateCorporateTemplate(campaign) {
  const ctaFullLink = campaign.ctaLink?.startsWith("http") ? campaign.ctaLink : `https://${campaign.ctaLink}`;
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background:#0a2540;padding:30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:bold;">The Tech Festival Canada</h1>
              <p style="color:rgba(255,255,255,0.7);margin:10px 0 0;font-size:13px;">October 26-27, 2026 • Toronto, ON</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 30px;">
              <p style="color:#334155;font-size:15px;line-height:1.6;margin:0 0 20px;">
                ${campaign.bodySummary || "Your email content here..."}
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:25px 0;">
                    <a href="${ctaFullLink}" style="background:#0a2540;color:#ffffff;padding:14px 32px;border-radius:4px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block;">
                      ${campaign.ctaText || "Register Now"}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#f1f5f9;padding:25px 30px;text-align:center;">
              <p style="color:#64748b;font-size:12px;margin:0;">
                The Tech Festival Canada • Toronto, Ontario
              </p>
              <p style="color:#94a3b8;font-size:11px;margin:10px 0 0;">
                <a href="#" style="color:#64748b;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function AddCampaignModal({ phase, audience, onClose, onCreated }) {
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [sendDate, setSendDate] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !purpose || !sendDate) {
      alert("Please fill in all fields");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API}/campaigns/automation/templates`,
        { phase, audience, subject, purpose, sendDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onCreated();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create campaign");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1035] rounded-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-700 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white">Add Campaign</h3>
            <p className="text-gray-400 text-sm mt-1">
              {phase} • {audience}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#0a0515] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
              placeholder="Enter email subject..."
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Purpose *</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full bg-[#0a0515] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
              placeholder="e.g., Early Bird Registration, Sponsor Spotlight..."
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Send Date *</label>
            <input
              type="date"
              value={sendDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSendDate(e.target.value)}
              className="w-full bg-[#0a0515] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 btn-primary">
              {saving ? "Creating..." : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
