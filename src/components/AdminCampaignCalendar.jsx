import { useEffect, useState } from "react";
import axios from "axios";

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
  const [calendar, setCalendar] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [seedStatus, setSeedStatus] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [activeTab, setActiveTab] = useState("calendar");
  const [editingCampaign, setEditingCampaign] = useState(null);

  useEffect(() => {
    fetchCalendar();
    fetchUpcoming();
  }, []);

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
    if (!confirm("Send this campaign to all contacts in the audience?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/campaigns/automation/templates/${templateId}/send`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Campaign sent!");
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

  return (
    <div className="admin-card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Campaign Calendar</h2>
          <p className="text-gray-400 text-sm mt-1">
            {totalCampaigns} campaigns across 5 phases • {upcoming.length} upcoming
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSeed} className="btn-secondary text-sm">
            {seedStatus ? "Re-seed (done)" : "Initialize 54 Campaigns"}
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-700 pb-4">
        {["calendar", "upcoming", "by-audience"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-purple-600 text-white"
                : "bg-[#1a1035] text-gray-300 hover:bg-[#2a1850]"
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
                <span className="text-gray-500 text-xs">
                  {Object.values(calendar[phase] || {}).flat().length} campaigns
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {AUDIENCES.map((audience) => {
                  const campaigns = calendar[phase]?.[audience] || [];
                  return (
                    <div key={audience} className="bg-[#0a0515] rounded-lg p-3 border border-gray-800">
                      <div className="text-xs text-gray-400 uppercase mb-2">{audience}</div>
                      {campaigns.length === 0 ? (
                        <div className="text-gray-600 text-xs italic">No campaigns</div>
                      ) : (
                        <div className="space-y-2">
                          {campaigns.slice(0, 3).map((c) => (
                            <CampaignCard
                              key={c.id}
                              campaign={c}
                              onClick={() => setSelectedCampaign(c)}
                            />
                          ))}
                          {campaigns.length > 3 && (
                            <div className="text-gray-500 text-xs text-center">
                              +{campaigns.length - 3} more
                            </div>
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
          onClose={() => setSelectedCampaign(null)}
          onSend={() => {
            sendCampaign(selectedCampaign._id || selectedCampaign.id);
            setSelectedCampaign(null);
          }}
          onEdit={() => {
            setEditingCampaign(selectedCampaign);
            setSelectedCampaign(null);
          }}
        />
      )}

      {editingCampaign && (
        <EmailEditorModal
          campaign={editingCampaign}
          onClose={() => setEditingCampaign(null)}
          onSend={() => {
            fetchCalendar();
            fetchUpcoming();
            setEditingCampaign(null);
          }}
        />
      )}
    </div>
  );
}

function CampaignCard({ campaign, onClick }) {
  const statusStyle = STATUS_BADGE[campaign.status] || STATUS_BADGE.pending;

  return (
    <div
      onClick={onClick}
      className="bg-[#1a1035] rounded p-2 border border-gray-700 hover:border-purple-500 cursor-pointer transition-colors"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">
          {formatDate(campaign.sendDate)}
        </span>
        <span className={`text-xs px-1.5 py-0.5 rounded ${statusStyle.bg} ${statusStyle.color}`}>
          {statusStyle.label}
        </span>
      </div>
      <div className="text-xs text-white line-clamp-2">{campaign.subject}</div>
    </div>
  );
}

function CampaignDetailModal({ campaign, onClose, onSend, onEdit }) {
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
              <p className="text-white">{formatDate(campaign.sendDate)}</p>
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

        <div className="p-6 border-t border-gray-700 flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
          {campaign.status === "pending" && (
            <>
              <button onClick={onEdit} className="btn-secondary">
                Edit & Preview
              </button>
              <button onClick={onSend} className="btn-primary bg-green-600 hover:bg-green-700">
                Send Campaign
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EmailEditorModal({ campaign, onClose, onSend }) {
  const [subject, setSubject] = useState(campaign.subject || "");
  const [body, setBody] = useState(campaign.body || campaign.bodySummary || "");
  const [isHtml, setIsHtml] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSend = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API}/campaigns/automation/templates/${campaign._id || campaign.id}/send`,
        { subject, body, isHtml },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Campaign sent!");
      onSend();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1035] rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-700 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white">Review & Edit Email</h3>
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

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isHtml}
                onChange={(e) => setIsHtml(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-[#0a0515] text-purple-500"
              />
              <span className="text-gray-400 text-sm">HTML Content</span>
            </label>
            <span className="text-gray-500 text-xs">
              {isHtml ? "Use HTML tags for formatting" : "Plain text email"}
            </span>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">
              {isHtml ? "HTML Body" : "Email Body"}
            </label>
            {isHtml ? (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-[#0a0515] border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-purple-500 focus:outline-none h-64"
                placeholder="<h1>Your HTML content here...</h1>"
              />
            ) : (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-[#0a0515] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none h-64"
                placeholder="Enter your email content..."
              />
            )}
          </div>

          <div className="bg-[#0a0515] border border-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2">Preview</div>
            <div className="bg-white text-black rounded p-4 max-h-48 overflow-y-auto">
              {isHtml ? (
                <div dangerouslySetInnerHTML={{ __html: body }} />
              ) : (
                <pre className="whitespace-pre-wrap font-sans">{body}</pre>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={saving}
            className="btn-primary bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
}
