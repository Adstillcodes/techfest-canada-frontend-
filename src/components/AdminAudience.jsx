import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://techfest-canada-backend.onrender.com/api";

export default function AdminAudience() {
  const [audiences, setAudiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState(null);
  const [audienceStats, setAudienceStats] = useState(null);

  useEffect(() => {
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
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setImporting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API}/campaigns/audiences/import`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        fetchAudiences();
      }
    } catch (err) {
      console.error("Import failed:", err);
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  const deleteAudience = async (id) => {
    if (!confirm("Are you sure you want to delete this audience?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/campaigns/audiences/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAudiences();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const viewAudienceDetails = async (audience) => {
    setSelectedAudience(audience);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/campaigns/audiences/${audience._id}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAudienceStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setAudienceStats(null);
    }
  };

  return (
    <div className="admin-card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Audience Management</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your email contact lists</p>
        </div>

        <div className="flex gap-3">
          <label className="btn-primary cursor-pointer">
            {importing ? "Importing..." : "Import CSV"}
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={importing}
              className="hidden"
            />
          </label>
          <button onClick={() => setShowModal(true)} className="btn-secondary">
            Add Manually
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
        </div>
      ) : audiences.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-xl">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-white font-semibold mb-2">No Audiences Yet</h3>
          <p className="text-gray-400 text-sm mb-4">Import a CSV file or add contacts manually</p>
          <p className="text-xs text-gray-500">CSV should have columns: email, name (optional)</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contacts</th>
                <th>Created</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {audiences.map((audience) => (
                <tr key={audience._id}>
                  <td className="font-medium">{audience.name}</td>
                  <td>
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-sm">
                      {audience.contactCount || 0} contacts
                    </span>
                  </td>
                  <td className="text-gray-400 text-sm">
                    {new Date(audience.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-gray-400 text-sm">
                    {audience.updatedAt ? new Date(audience.updatedAt).toLocaleDateString() : "-"}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewAudienceDetails(audience)}
                        className="text-xs px-2 py-1 bg-blue-600/20 text-blue-300 rounded hover:bg-blue-600/30"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteAudience(audience._id)}
                        className="text-xs px-2 py-1 bg-red-600/20 text-red-300 rounded hover:bg-red-600/30"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedAudience && (
        <AudienceDetailModal
          audience={selectedAudience}
          stats={audienceStats}
          onClose={() => {
            setSelectedAudience(null);
            setAudienceStats(null);
          }}
        />
      )}

      {showModal && (
        <AddAudienceModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchAudiences();
          }}
        />
      )}
    </div>
  );
}

function AudienceDetailModal({ audience, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1035] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white">{audience.name}</h3>
            <p className="text-gray-400 text-sm">{audience.contactCount || 0} contacts</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            ×
          </button>
        </div>

        <div className="flex border-b border-gray-700">
          {["overview", "contacts"].map((tab) => (
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === "overview" && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#2a1850] p-4 rounded-xl border border-purple-700">
                <p className="text-gray-400 text-sm">Total Contacts</p>
                <p className="text-2xl font-bold text-white">{audience.contactCount || 0}</p>
              </div>
              <div className="bg-[#2a1850] p-4 rounded-xl border border-purple-700">
                <p className="text-gray-400 text-sm">Created</p>
                <p className="text-lg font-bold text-white">
                  {new Date(audience.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-[#2a1850] p-4 rounded-xl border border-purple-700">
                <p className="text-gray-400 text-sm">Last Updated</p>
                <p className="text-lg font-bold text-white">
                  {audience.updatedAt ? new Date(audience.updatedAt).toLocaleDateString() : "-"}
                </p>
              </div>
            </div>
          )}

          {activeTab === "contacts" && (
            <div className="text-center py-8 text-gray-400">
              Contact list view - integrate with backend to display contacts
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddAudienceModal({ onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [emails, setEmails] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !emails.trim()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const emailList = emails
        .split("\n")
        .map((e) => e.trim())
        .filter((e) => e.includes("@"));

      await axios.post(
        `${API}/campaigns/audiences`,
        { name, emails: emailList },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
    } catch (err) {
      console.error("Failed to create audience:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1035] rounded-2xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Add Audience</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Audience Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Marketing Leads"
              className="w-full bg-[#0a0515] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Email Addresses (one per line)
            </label>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="email@example.com&#10;another@example.com"
              rows={8}
              className="w-full bg-[#0a0515] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none font-mono text-sm"
            />
          </div>

          <p className="text-xs text-gray-500">
            {emails.split("\n").filter((e) => e.trim().includes("@")).length} valid emails
          </p>
        </div>

        <div className="p-6 border-t border-gray-700 flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving || !name || !emails} className="btn-primary">
            {saving ? "Creating..." : "Create Audience"}
          </button>
        </div>
      </div>
    </div>
  );
}
