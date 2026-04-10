import { useEffect, useState } from "react";
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
  const [isDark, setIsDark] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showMailerLite, setShowMailerLite] = useState(false);

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
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/mailerlite/campaigns`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const campaignsData = res.data?.data || res.data || [];
      setCampaigns(campaignsData);
    } catch {
      console.error("Failed to fetch campaigns");
      setCampaigns([]);
    } finally {
      setLoading(false);
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

  const textMain = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const cardBg = isDark ? "bg-[#1a1035]" : "bg-white";
  const cardBorder = isDark ? "border-gray-700" : "border-gray-200";
  const statBg = isDark ? "bg-[#2a1850]" : "bg-gray-50";

  if (showMailerLite) {
    return (
      <div className="admin-card">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setShowMailerLite(false)} className="btn-secondary">
            ← Back to Campaigns
          </button>
          <span className={textMuted}>MailerLite Campaign Editor</span>
        </div>
        <div className="border border-gray-700 rounded-lg overflow-hidden" style={{ height: "calc(100vh - 300px)" }}>
          <iframe
            src="https://dashboard.mailerlite.com/campaigns"
            className="w-full h-full"
            title="MailerLite Campaign Editor"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-xl font-bold ${textMain}`}>Email Campaigns</h2>
          <p className={`${textMuted} text-sm mt-1`}>
            Manage your email marketing campaigns via MailerLite
          </p>
        </div>
        <button onClick={() => setShowMailerLite(true)} className="btn-primary">
          + Create Campaign in MailerLite
        </button>
      </div>

      <div className={`${statBg} p-4 rounded-lg mb-6`}>
        <p className={`${textMuted} text-sm mb-2`}>Quick Actions</p>
        <div className="flex gap-3">
          <a
            href="https://dashboard.mailerlite.com/campaigns"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition"
          >
            Open MailerLite Dashboard
          </a>
          <button
            onClick={() => setShowMailerLite(true)}
            className="text-sm px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
          >
            Create Embedded Campaign
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className={`text-center py-16 border-2 border-dashed ${isDark ? "border-gray-700" : "border-gray-300"} rounded-xl`}>
          <div className="text-5xl mb-4">📧</div>
          <h3 className={`${textMain} font-semibold text-lg mb-2`}>No Campaigns Yet</h3>
          <p className={`${textMuted} mb-6`}>Create your first email campaign in MailerLite</p>
          <button onClick={() => setShowMailerLite(true)} className="btn-primary">
            Create Campaign in MailerLite
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign) => {
            const stats = campaign.stats || {};
            const sent = stats.emails_sent || 0;
            const uniqueOpens = stats.unique_opens || 0;
            const uniqueClicks = stats.unique_clicks || 0;
            const bounces = stats.bounces || 0;
            
            return (
              <div
                key={campaign.id}
                className={`${cardBg} border ${cardBorder} rounded-xl p-5 hover:border-purple-600 transition-colors`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`${textMain} font-semibold text-lg`}>{campaign.name}</h3>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium uppercase"
                        style={{
                          backgroundColor: `${STATUS_COLORS[campaign.status] || '#6b7280'}20`,
                          color: STATUS_COLORS[campaign.status] || '#6b7280',
                        }}
                      >
                        {campaign.status}
                      </span>
                    </div>
                    <p className={`${textMuted} text-sm`}>{campaign.subject}</p>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">Sent</p>
                    <p className={`${textMain} font-semibold`}>{sent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">Opens</p>
                    <p className={`${textMain} font-semibold`}>{uniqueOpens.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">Clicks</p>
                    <p className={`${textMain} font-semibold`}>{uniqueClicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">Bounces</p>
                    <p className={`${textMain} font-semibold`}>{bounces.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">Created</p>
                    <p className={`${textMain} text-sm`}>
                      {campaign.created_at ? new Date(campaign.created_at).toLocaleDateString() : '-'}
                    </p>
                  </div>
                </div>

                {sent > 0 && (
                  <div className="mt-4">
                    <div className="flex gap-2">
                      <div
                        className="h-2 rounded-l"
                        style={{
                          width: `${Math.min(((uniqueOpens / sent) * 100), 100)}%`,
                          background: "#a855f7",
                        }}
                      />
                      <div
                        className="h-2"
                        style={{
                          width: `${Math.min(((uniqueClicks / sent) * 100), 100)}%`,
                          background: "#f59e0b",
                        }}
                      />
                      <div
                        className="h-2 rounded-r"
                        style={{
                          width: `${Math.min(((bounces / sent) * 100), 100)}%`,
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
            );
          })}
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => fetchCampaigns()}
          className={`text-sm ${textMuted} hover:${textMain} transition`}
        >
          Refresh Campaigns
        </button>
      </div>
    </div>
  );
}