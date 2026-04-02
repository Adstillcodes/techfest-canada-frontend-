import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import EmailEditorModal from "./EmailEditorModal";
import TiptapEditor, { insertText } from "./ui/TiptapEditor";

const API = "https://techfest-canada-backend.onrender.com/api";

const STATUS_COLORS = {
  draft: "#6b7280",
  scheduled: "#f59e0b",
  sending: "#3b82f6",
  sent: "#22c55e",
  failed: "#ef4444",
};

const COLORS = ["#a855f7", "#f59e0b", "#22c55e", "#3b82f6"];

export default function AdminEmailCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/campaigns`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns(res.data);
    } catch {
      console.error("Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async (campaignId) => {
    const testEmail = prompt("Enter test email address:");
    if (!testEmail) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API}/campaigns/${campaignId}/test`,
        { email: testEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Test email sent successfully!");
    } catch {
      alert("Failed to send test email");
    }
  };

  const deleteCampaign = async (id) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/campaigns/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCampaigns();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="admin-card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Email Campaigns</h2>
          <p className="text-gray-400 text-sm mt-1">
            Create and manage your email marketing campaigns
          </p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          + New Campaign
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-700 rounded-xl">
          <div className="text-5xl mb-4">📧</div>
          <h3 className="text-white font-semibold text-lg mb-2">No Campaigns Yet</h3>
          <p className="text-gray-400 mb-6">Create your first email campaign to get started</p>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            Create Campaign
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="bg-[#1a1035] border border-gray-700 rounded-xl p-5 hover:border-purple-600 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-semibold text-lg">{campaign.name}</h3>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium uppercase"
                      style={{
                        backgroundColor: `${STATUS_COLORS[campaign.status]}20`,
                        color: STATUS_COLORS[campaign.status],
                      }}
                    >
                      {campaign.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{campaign.subject}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCampaign(campaign)}
                    className="text-xs px-3 py-1.5 bg-purple-600/20 text-purple-300 rounded hover:bg-purple-600/30"
                  >
                    View Stats
                  </button>
                  <button
                    onClick={() => setEditingCampaign(campaign)}
                    className="text-xs px-3 py-1.5 bg-yellow-600/20 text-yellow-300 rounded hover:bg-yellow-600/30"
                  >
                    Edit Email
                  </button>
                  <button
                    onClick={() => sendTestEmail(campaign._id)}
                    className="text-xs px-3 py-1.5 bg-blue-600/20 text-blue-300 rounded hover:bg-blue-600/30"
                  >
                    Send Test
                  </button>
                  {campaign.status === "draft" && (
                    <button
                      onClick={() => setSelectedCampaign({ ...campaign, editing: true })}
                      className="text-xs px-3 py-1.5 bg-green-600/20 text-green-300 rounded hover:bg-green-600/30"
                    >
                      Launch
                    </button>
                  )}
                  <button
                    onClick={() => deleteCampaign(campaign._id)}
                    className="text-xs px-3 py-1.5 bg-red-600/20 text-red-300 rounded hover:bg-red-600/30"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4">
                <div>
                  <p className="text-gray-500 text-xs uppercase mb-1">Sent</p>
                  <p className="text-white font-semibold">{campaign.stats?.sent || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase mb-1">Opens</p>
                  <p className="text-white font-semibold">
                    {campaign.stats?.uniqueOpens || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase mb-1">Clicks</p>
                  <p className="text-white font-semibold">
                    {campaign.stats?.uniqueClicks || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase mb-1">Bounces</p>
                  <p className="text-white font-semibold">
                    {campaign.stats?.bounces || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase mb-1">Created</p>
                  <p className="text-white text-sm">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {(campaign.stats?.sent > 0 || 0) > 0 && (
                <div className="mt-4">
                  <div className="flex gap-2">
                    <div
                      className="h-2 rounded-l"
                      style={{
                        width: `${Math.min(
                          ((campaign.stats?.uniqueOpens || 0) /
                            (campaign.stats?.sent || 1)) *
                            100,
                          100
                        )}%`,
                        background: "#a855f7",
                      }}
                    />
                    <div
                      className="h-2"
                      style={{
                        width: `${Math.min(
                          ((campaign.stats?.uniqueClicks || 0) /
                            (campaign.stats?.sent || 1)) *
                            100,
                          100
                        )}%`,
                        background: "#f59e0b",
                      }}
                    />
                    <div
                      className="h-2 rounded-r"
                      style={{
                        width: `${Math.min(
                          ((campaign.stats?.bounces || 0) /
                            (campaign.stats?.sent || 1)) *
                            100,
                          100
                        )}%`,
                        background: "#ef4444",
                      }}
                    />
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-500" /> Opens
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" /> Clicks
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500" /> Bounces
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateCampaignModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchCampaigns();
          }}
        />
      )}

      {selectedCampaign && !selectedCampaign.editing && (
        <CampaignStatsModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}

      {selectedCampaign?.editing && (
        <CreateCampaignModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onSuccess={() => {
            setSelectedCampaign(null);
            fetchCampaigns();
          }}
        />
      )}

      {editingCampaign && (
        <EmailEditorModal
          campaign={editingCampaign}
          onClose={() => setEditingCampaign(null)}
          onSave={() => {
            setEditingCampaign(null);
            fetchCampaigns();
          }}
          mode="campaigns"
        />
      )}
    </div>
  );
}

function CreateCampaignModal({ campaign, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: campaign?.name || "",
    subject: campaign?.subject || "",
    audienceId: campaign?.audienceId || "",
    template: campaign?.template || "",
  });
  const [audiences, setAudiences] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editorTab, setEditorTab] = useState("visual");
  const editorRef = useRef(null);
  const codeEditorRef = useRef(null);

  useEffect(() => {
    fetchAudiences();
  }, []);

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name || "",
        subject: campaign.subject || "",
        audienceId: campaign.audienceId || "",
        template: campaign.template || "",
      });
    }
  }, [campaign]);

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

  const insertImageToCodeEditor = (imgTag) => {
    const textarea = codeEditorRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.template;
    const newText = text.substring(0, start) + imgTag + text.substring(end);
    setFormData({ ...formData, template: newText });
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
    const text = formData.template;
    const newText = text.substring(0, start) + `/${token}` + text.substring(start);
    setFormData({ ...formData, template: newText });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + token.length + 1, start + token.length + 1);
    }, 0);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.subject) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (campaign?._id) {
        await axios.put(`${API}/campaigns/${campaign._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Campaign saved!");
      } else {
        await axios.post(`${API}/campaigns`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Campaign created!");
      }
      onSuccess();
    } catch (err) {
      console.error("Failed to save campaign:", err);
      alert(err.response?.data?.error || "Failed to save campaign");
    } finally {
      setSaving(false);
    }
  };

  const handleLaunch = async () => {
    if (!campaign?._id) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API}/campaigns/${campaign._id}/launch`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
    } catch (err) {
      console.error("Launch failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1035] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">
            {campaign ? "Edit Campaign" : "Create Campaign"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            ×
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Campaign Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Summer Promo 2026"
              className="w-full bg-[#0a0515] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Email Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g., Exclusive offer just for you!"
              className="w-full bg-[#0a0515] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Select Audience</label>
            <select
              value={formData.audienceId}
              onChange={(e) => setFormData({ ...formData, audienceId: e.target.value })}
              className="w-full bg-[#0a0515] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="">Select an audience...</option>
              {audiences.map((aud) => (
                <option key={aud._id} value={aud._id}>
                  {aud.name} ({aud.contactCount || 0} contacts)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Email Content</label>
            
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setEditorTab("visual")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  editorTab === "visual"
                    ? "bg-purple-600 text-white"
                    : "bg-[#0a0515] text-gray-300 hover:bg-[#1a1035]"
                }`}
              >
                Visual Editor
              </button>
              <button
                type="button"
                onClick={() => setEditorTab("code")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  editorTab === "code"
                    ? "bg-purple-600 text-white"
                    : "bg-[#0a0515] text-gray-300 hover:bg-[#1a1035]"
                }`}
              >
                HTML Code
              </button>
              <button
                type="button"
                onClick={() => setEditorTab("preview")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  editorTab === "preview"
                    ? "bg-purple-600 text-white"
                    : "bg-[#0a0515] text-gray-300 hover:bg-[#1a1035]"
                }`}
              >
                Preview
              </button>
            </div>

            {editorTab === "visual" && (
              <>
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="text-gray-400 text-xs">Insert:</span>
                  {["firstname", "lastname", "company", "title", "location"].map((token) => (
                    <button
                      key={token}
                      type="button"
                      onClick={() => {
                        if (editorRef.current) {
                          insertText(editorRef.current, `/${token}`);
                        }
                      }}
                      className="px-2 py-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-xs rounded transition-colors border border-purple-600/30"
                    >
                      /{token}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      if (editorRef.current) {
                        editorRef.current.commands.clearContent();
                      }
                    }}
                    className="ml-auto px-2 py-1 bg-gray-600/20 hover:bg-gray-600/40 text-gray-400 text-xs rounded transition-colors border border-gray-600/30"
                  >
                    Clear
                  </button>
                </div>

                <TiptapEditor
                  ref={editorRef}
                  value={formData.template}
                  onChange={(html) => setFormData({ ...formData, template: html })}
                  placeholder="Start writing your email..."
                  minHeight="250px"
                  darkMode={true}
                />
              </>
            )}

            {editorTab === "code" && (
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
                  value={formData.template}
                  onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                  placeholder="<html><body><h1>Hello!</h1>...</body></html>"
                  rows={12}
                  className="w-full bg-[#0a0515] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none font-mono text-sm"
                />
              </>
            )}

            {editorTab === "preview" && (
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-white rounded-t-lg p-3 border-b">
                  <div className="border-b pb-2 mb-2">
                    <p className="text-gray-500 text-xs">Subject:</p>
                    <p className="text-black font-semibold">{formData.subject || "No subject"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">From:</p>
                    <p className="text-black text-sm">The Tech Festival Canada &lt;hello@thetechfestival.com&gt;</p>
                  </div>
                </div>
                <div className="bg-white rounded-b-lg p-4 min-h-[300px]">
                  <div dangerouslySetInnerHTML={{ __html: formData.template || "<p className='text-gray-400'>No content</p>" }} />
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Tip: Use personalization tokens above or {"{{name}}"} for dynamic content. Tracking pixel and links are automatically added.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          {campaign?.status === "draft" && (
            <button onClick={handleLaunch} disabled={saving} className="btn-primary bg-green-600 hover:bg-green-700">
              {saving ? "Launching..." : "Save & Launch"}
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={saving || !formData.name || !formData.subject || !formData.audienceId || !formData.template}
            className="btn-primary"
          >
            {saving ? "Saving..." : campaign ? "Save Changes" : "Create Draft"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CampaignStatsModal({ campaign, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/campaigns/${campaign._id}/tracking`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrackingData(res.data);
      } catch {
        console.error("Failed to fetch tracking");
      } finally {
        setLoading(false);
      }
    };
    fetchTrackingData();
  }, [campaign._id]);

  const stats = campaign.stats || {};
  const sent = stats.sent || 0;
  const uniqueOpens = stats.uniqueOpens || 0;
  const uniqueClicks = stats.uniqueClicks || 0;
  const bounces = stats.bounces || 0;
  const openRate = sent > 0 ? ((uniqueOpens / sent) * 100).toFixed(1) : 0;
  const clickRate = sent > 0 ? ((uniqueClicks / sent) * 100).toFixed(1) : 0;
  const bounceRate = sent > 0 ? ((bounces / sent) * 100).toFixed(1) : 0;

  const pieData = [
    { name: "Opened", value: uniqueOpens },
    { name: "Clicked", value: uniqueClicks - (trackingData?.clickedWithoutOpen || 0) },
    { name: "No Engagement", value: sent - uniqueOpens - bounces },
    { name: "Bounced", value: bounces },
  ].filter((d) => d.value > 0);

  const timelineData =
    trackingData?.timeline?.map((t) => ({
      date: new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      opens: t.opens || 0,
      clicks: t.clicks || 0,
    })) || [];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1035] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white">{campaign.name}</h3>
              <p className="text-gray-400 text-sm">{campaign.subject}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
              ×
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-700">
          {["overview", "preview", "timeline", "recipients"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize ${
                activeTab === tab
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)]">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
            </div>
          ) : activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#2a1850] p-4 rounded-xl border border-purple-700">
                  <p className="text-gray-400 text-sm">Total Sent</p>
                  <p className="text-2xl font-bold text-white">{sent}</p>
                </div>
                <div className="bg-[#2a1850] p-4 rounded-xl border border-purple-700">
                  <p className="text-gray-400 text-sm">Open Rate</p>
                  <p className="text-2xl font-bold text-purple-400">{openRate}%</p>
                </div>
                <div className="bg-[#2a1850] p-4 rounded-xl border border-purple-700">
                  <p className="text-gray-400 text-sm">Click Rate</p>
                  <p className="text-2xl font-bold text-amber-400">{clickRate}%</p>
                </div>
                <div className="bg-[#2a1850] p-4 rounded-xl border border-purple-700">
                  <p className="text-gray-400 text-sm">Bounce Rate</p>
                  <p className="text-2xl font-bold text-red-400">{bounceRate}%</p>
                </div>
              </div>

              {pieData.length > 0 && (
                <div className="bg-[#2a1850] p-6 rounded-xl border border-gray-700">
                  <h4 className="text-white font-semibold mb-4">Engagement Breakdown</h4>
                  <div className="flex items-center gap-8">
                    <ResponsiveContainer width={200} height={200}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {pieData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-gray-300 text-sm">{entry.name}</span>
                          <span className="text-white font-semibold ml-2">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-[#2a1850] p-6 rounded-xl border border-gray-700">
                <h4 className="text-white font-semibold mb-4">Detailed Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Unique Opens</span>
                    <span className="text-white font-semibold">{uniqueOpens}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Opens</span>
                    <span className="text-white font-semibold">{stats.totalOpens || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Unique Clicks</span>
                    <span className="text-white font-semibold">{uniqueClicks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Clicks</span>
                    <span className="text-white font-semibold">{stats.totalClicks || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hard Bounces</span>
                    <span className="text-white font-semibold">
                      {stats.hardBounces || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Soft Bounces</span>
                    <span className="text-white font-semibold">
                      {stats.softBounces || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div>
              {timelineData.length > 0 ? (
                <div className="bg-[#2a1850] p-6 rounded-xl border border-gray-700">
                  <h4 className="text-white font-semibold mb-4">Engagement Over Time</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={timelineData}>
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1035",
                          border: "1px solid #6b7280",
                          borderRadius: 8,
                        }}
                      />
                      <Bar dataKey="opens" fill="#a855f7" name="Opens" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="clicks" fill="#f59e0b" name="Clicks" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  No timeline data available yet
                </div>
              )}
            </div>
          )}

          {activeTab === "preview" && (
            <div>
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="border-b pb-3 mb-3">
                  <p className="text-gray-500 text-sm">Subject:</p>
                  <p className="text-black font-semibold">{campaign.subject}</p>
                </div>
                <div className="border-b pb-3 mb-3">
                  <p className="text-gray-500 text-sm">From:</p>
                  <p className="text-black">The Tech Festival Canada &lt;hello@thetechfestival.com&gt;</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 min-h-[400px]">
                <div dangerouslySetInnerHTML={{ __html: campaign.template || "<p>No email content</p>" }} />
              </div>
            </div>
          )}

          {activeTab === "recipients" && (
            <div>
              {trackingData?.recipients ? (
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Opened</th>
                        <th>Clicked</th>
                        <th>Last Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trackingData.recipients.slice(0, 50).map((r, i) => (
                        <tr key={i}>
                          <td className="font-mono text-sm">{r.email}</td>
                          <td>
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
                                r.status === "delivered"
                                  ? "bg-green-600/20 text-green-300"
                                  : r.status === "bounced"
                                  ? "bg-red-600/20 text-red-300"
                                  : "bg-gray-600/20 text-gray-300"
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td>{r.opened ? "Yes" : "No"}</td>
                          <td>{r.clicked ? "Yes" : "No"}</td>
                          <td className="text-sm text-gray-400">
                            {r.lastActivity
                              ? new Date(r.lastActivity).toLocaleString()
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {trackingData.recipients.length > 50 && (
                    <p className="text-center text-gray-500 text-sm mt-4">
                      Showing 50 of {trackingData.recipients.length} recipients
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  Recipient data will appear here after sending
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
