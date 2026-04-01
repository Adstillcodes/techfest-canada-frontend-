import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://techfest-canada-backend.onrender.com/api";

export default function AdminAudience() {
  const [audiences, setAudiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAudience, setEditingAudience] = useState(null);
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
                        onClick={() => setEditingAudience(audience)}
                        className="text-xs px-2 py-1 bg-purple-600/20 text-purple-300 rounded hover:bg-purple-600/30"
                      >
                        Edit
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

      {editingAudience && (
        <EditAudienceModal
          audience={editingAudience}
          onClose={() => setEditingAudience(null)}
          onSuccess={() => {
            setEditingAudience(null);
            fetchAudiences();
          }}
        />
      )}
    </div>
  );
}

function AudienceDetailModal({ audience, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  useEffect(() => {
    if (activeTab === "contacts" && contacts.length === 0) {
      fetchContacts();
    }
  }, [activeTab]);

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching contacts for audience:", audience._id);
      const res = await axios.get(`${API}/campaigns/audiences/${audience._id}/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Contacts response:", res.data);
      setContacts(res.data.contacts || []);
    } catch (err) {
      console.error("Failed to fetch contacts:", err.response || err);
    } finally {
      setLoadingContacts(false);
    }
  };

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
            <div>
              {loadingContacts ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No contacts in this audience
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="admin-table text-sm">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Company</th>
                        <th>Title</th>
                        <th>Location</th>
                        <th>Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact, idx) => (
                        <tr key={idx}>
                          <td className="text-white">{contact.email}</td>
                          <td className="text-gray-300">{contact.firstName || "-"}</td>
                          <td className="text-gray-300">{contact.lastName || "-"}</td>
                          <td className="text-gray-300">{contact.company || "-"}</td>
                          <td className="text-gray-300">{contact.title || "-"}</td>
                          <td className="text-gray-300">{contact.location || "-"}</td>
                          <td className="text-gray-400 text-xs">
                            {contact.addedAt ? new Date(contact.addedAt).toLocaleDateString() : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    title: "",
    location: ""
  });

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

  const handleAddSingleContact = async () => {
    if (!name.trim()) {
      alert("Please enter an audience name first");
      return;
    }
    if (!newContact.email.trim() || !newContact.email.includes("@")) {
      alert("Valid email is required");
      return;
    }
    
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      // First create the audience
      const res = await axios.post(
        `${API}/campaigns/audiences`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Then add the contact with full details
      await axios.post(
        `${API}/campaigns/audiences/${res.data._id}/contacts`,
        { contacts: [newContact] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
    } catch (err) {
      console.error("Failed to create audience with contact:", err);
      alert("Failed to create audience with contact");
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
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-300 text-sm">
                Add Single Contact with Details
              </label>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs text-purple-400 hover:text-purple-300"
              >
                {showAddForm ? "Cancel" : "Add New"}
              </button>
            </div>
            
            {showAddForm && (
              <div className="bg-[#0a0515] border border-gray-700 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    placeholder="Email *"
                    className="bg-[#0a0515] border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none text-sm"
                  />
                  <input
                    type="text"
                    value={newContact.firstName}
                    onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                    placeholder="First Name"
                    className="bg-[#0a0515] border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none text-sm"
                  />
                  <input
                    type="text"
                    value={newContact.lastName}
                    onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                    placeholder="Last Name"
                    className="bg-[#0a0515] border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none text-sm"
                  />
                  <input
                    type="text"
                    value={newContact.company}
                    onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                    placeholder="Company"
                    className="bg-[#0a0515] border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none text-sm"
                  />
                  <input
                    type="text"
                    value={newContact.title}
                    onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
                    placeholder="Job Title"
                    className="bg-[#0a0515] border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none text-sm"
                  />
                  <input
                    type="text"
                    value={newContact.location}
                    onChange={(e) => setNewContact({ ...newContact, location: e.target.value })}
                    placeholder="Location"
                    className="bg-[#0a0515] border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none text-sm"
                  />
                </div>
                <button
                  onClick={handleAddSingleContact}
                  disabled={saving || !name.trim() || !newContact.email.trim()}
                  className="btn-primary text-sm w-full"
                >
                  {saving ? "Creating..." : "Create Audience with Contact"}
                </button>
              </div>
            )}
          </div>

          {!showAddForm && (
            <>
              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-700" />
                <span className="px-4 text-gray-500 text-sm">or</span>
                <div className="flex-1 border-t border-gray-700" />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Add Multiple Emails (one per line)
                </label>
                <textarea
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  placeholder="email@example.com"
                  rows={8}
                  className="w-full bg-[#0a0515] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none font-mono text-sm"
                />
              </div>

              <p className="text-xs text-gray-500">
                {emails.split("\n").filter((e) => e.trim().includes("@")).length} valid emails
              </p>
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-700 flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          {!showAddForm && (
            <button onClick={handleSubmit} disabled={saving || !name || !emails} className="btn-primary">
              {saving ? "Creating..." : "Create Audience"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EditAudienceModal({ audience, onClose, onSuccess }) {
  const [name, setName] = useState(audience.name);
  const [additionalEmails, setAdditionalEmails] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [importingCsv, setImportingCsv] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    title: "",
    location: ""
  });

  useEffect(() => {
    if (activeTab === "contacts") {
      fetchContacts();
    }
  }, [activeTab]);

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/campaigns/audiences/${audience._id}/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data.contacts || []);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleUpdateName = async () => {
    if (!name.trim() || name === audience.name) return;
    setSaving(true);
    setFeedback(null);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API}/campaigns/audiences/${audience._id}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedback({ type: "success", message: "Name updated successfully" });
      onSuccess();
    } catch (err) {
      console.error("Failed to update audience:", err);
      setFeedback({ type: "error", message: "Failed to update name" });
    } finally {
      setSaving(false);
    }
  };

  const handleAddEmails = async () => {
    if (!additionalEmails.trim()) return;
    setSaving(true);
    setFeedback(null);
    try {
      const token = localStorage.getItem("token");
      const emailList = additionalEmails
        .split("\n")
        .map((e) => e.trim())
        .filter((e) => e.includes("@"));

      const res = await axios.post(
        `${API}/campaigns/audiences/${audience._id}/contacts`,
        { emails: emailList },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdditionalEmails("");
      setFeedback({ type: "success", message: `Added ${res.data.addedCount} contacts (${res.data.skippedCount} duplicates skipped)` });
      onSuccess();
    } catch (err) {
      console.error("Failed to add contacts:", err);
      setFeedback({ type: "error", message: "Failed to add contacts" });
    } finally {
      setSaving(false);
    }
  };

  const handleAddSingleContact = async () => {
    if (!newContact.email.trim() || !newContact.email.includes("@")) {
      setFeedback({ type: "error", message: "Valid email is required" });
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API}/campaigns/audiences/${audience._id}/contacts`,
        { contacts: [newContact] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewContact({ email: "", firstName: "", lastName: "", company: "", title: "", location: "" });
      setShowAddForm(false);
      setFeedback({ type: "success", message: "Contact added successfully!" });
      onSuccess();
    } catch (err) {
      console.error("Failed to add contact:", err);
      setFeedback({ type: "error", message: "Failed to add contact" });
    } finally {
      setSaving(false);
    }
  };

  const handleCsvImport = async () => {
    if (!csvFile) return;
    setImportingCsv(true);
    setFeedback(null);
    try {
      const formData = new FormData();
      formData.append("file", csvFile);

      const token = localStorage.getItem("token");
      const res = await axios.post(`${API}/campaigns/audiences/${audience._id}/import`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setCsvFile(null);
      setFeedback({ type: "success", message: `Imported ${res.data.addedCount} contacts` });
      onSuccess();
    } catch (err) {
      console.error("Failed to import CSV:", err);
      setFeedback({ type: "error", message: "Failed to import CSV" });
    } finally {
      setImportingCsv(false);
    }
  };

  const emailCount = additionalEmails.split("\n").filter((e) => e.trim().includes("@")).length;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1035] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white">Edit Audience</h3>
            <p className="text-gray-400 text-sm">{audience.contactCount || 0} current contacts</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex gap-4 border-b border-gray-700 pb-4">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "details"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "contacts"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Contacts ({audience.contactCount || 0})
            </button>
          </div>

          {activeTab === "details" && (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Audience Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-[#0a0515] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    onClick={handleUpdateName}
                    disabled={saving || !name.trim() || name === audience.name}
                    className="btn-primary whitespace-nowrap"
                  >
                    {saving ? "Saving..." : "Save Name"}
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h4 className="text-white font-medium mb-4">Add Contacts</h4>

                {feedback && (
                  <div className={`mb-4 p-3 rounded-lg text-sm ${feedback.type === "success" ? "bg-green-600/20 text-green-300" : "bg-red-600/20 text-red-300"}`}>
                    {feedback.message}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-gray-300 text-sm">
                        Add Single Contact
                      </label>
                      <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="text-xs text-purple-400 hover:text-purple-300"
                      >
                        {showAddForm ? "Cancel" : "Add New"}
                      </button>
                    </div>
                    
                    {showAddForm && (
                      <div className="bg-[#0a0515] border border-gray-700 rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="email"
                            value={newContact.email}
                            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                            placeholder="Email *"
                            className="bg-[#0a0515] border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none text-sm"
                          />
                          <input
                            type="text"
                            value={newContact.firstName}
                            onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                            placeholder="First Name"
                            className="bg-[#0a0515] border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none text-sm"
                          />
                          <input
                            type="text"
                            value={newContact.lastName}
                            onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                            placeholder="Last Name"
                            className="bg-[#0a0515] border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none text-sm"
                          />
                          <input
                            type="text"
                            value={newContact.company}
                            onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                            placeholder="Company"
                            className="bg-[#0a0515] border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none text-sm"
                          />
                          <input
                            type="text"
                            value={newContact.title}
                            onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
                            placeholder="Job Title"
                            className="bg-[#0a0515] border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none text-sm"
                          />
                          <input
                            type="text"
                            value={newContact.location}
                            onChange={(e) => setNewContact({ ...newContact, location: e.target.value })}
                            placeholder="Location"
                            className="bg-[#0a0515] border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none text-sm"
                          />
                        </div>
                        <button
                          onClick={handleAddSingleContact}
                          disabled={saving || !newContact.email.trim()}
                          className="btn-primary text-sm w-full"
                        >
                          {saving ? "Adding..." : "Add Contact"}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-700" />
                    <span className="px-4 text-gray-500 text-sm">or</span>
                    <div className="flex-1 border-t border-gray-700" />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Add Multiple Emails (one per line)
                    </label>
                    <textarea
                      value={additionalEmails}
                      onChange={(e) => setAdditionalEmails(e.target.value)}
                      placeholder="email@example.com"
                      rows={5}
                      className="w-full bg-[#0a0515] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none font-mono text-sm"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">{emailCount} valid emails</p>
                      <button
                        onClick={handleAddEmails}
                        disabled={saving || !additionalEmails.trim()}
                        className="btn-secondary text-sm"
                      >
                        Add Emails
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-700" />
                    <span className="px-4 text-gray-500 text-sm">or</span>
                    <div className="flex-1 border-t border-gray-700" />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Import CSV File</label>
                    <div className="flex gap-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="bg-[#0a0515] border border-gray-700 border-dashed rounded-lg px-4 py-6 text-center hover:border-purple-500 transition-colors">
                          <div className="text-purple-400 mb-2">📄</div>
                          <p className="text-gray-400 text-sm">
                            {csvFile ? csvFile.name : "Click to select CSV file"}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">CSV should have columns: email, name, firstname, lastname, company, title, location</p>
                          <input
                            type="file"
                            accept=".csv"
                            onChange={(e) => setCsvFile(e.target.files[0])}
                            className="hidden"
                          />
                        </div>
                      </label>
                      <button
                        onClick={handleCsvImport}
                        disabled={importingCsv || !csvFile}
                        className="btn-primary whitespace-nowrap self-end"
                      >
                        {importingCsv ? "Importing..." : "Import CSV"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "contacts" && (
            <div>
              {loadingContacts ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No contacts in this audience
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="admin-table text-sm">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Company</th>
                        <th>Title</th>
                        <th>Location</th>
                        <th>Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact, idx) => (
                        <tr key={idx}>
                          <td className="text-white">{contact.email}</td>
                          <td className="text-gray-300">{contact.firstName || "-"}</td>
                          <td className="text-gray-300">{contact.lastName || "-"}</td>
                          <td className="text-gray-300">{contact.company || "-"}</td>
                          <td className="text-gray-300">{contact.title || "-"}</td>
                          <td className="text-gray-300">{contact.location || "-"}</td>
                          <td className="text-gray-400 text-xs">
                            {contact.addedAt ? new Date(contact.addedAt).toLocaleDateString() : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-700 flex justify-end">
          <button onClick={onClose} className="btn-secondary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
