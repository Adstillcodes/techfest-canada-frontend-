import { useState, useRef, useEffect } from "react";
import axios from "axios";
import TiptapEditor, { insertText } from "./ui/TiptapEditor";

const API = "https://techfest-canada-backend.onrender.com/api";

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

export default function EmailEditorModal({ campaign, onClose, onSave, mode = "campaigns" }) {
  const [subject, setSubject] = useState(campaign.subject || campaign.subjectLine || "");
  const [htmlBody, setHtmlBody] = useState(campaign.template || campaign.htmlBody || generateDefaultHtml(campaign));
  const [textBody, setTextBody] = useState(campaign.textBody || "");
  const [activeTab, setActiveTab] = useState("editor");
  const [saving, setSaving] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const editorRef = useRef(null);
  const codeEditorRef = useRef(null);

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
      
      if (mode === "automation") {
        await axios.put(
          `${API}/campaigns/automation/templates/${campaign.id || campaign._id}`,
          { subject, htmlBody, textBody },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.put(
          `${API}/campaigns/${campaign._id}`,
          { subject, template: htmlBody, textBody },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      alert("Template saved!");
      onSave?.();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      if (mode === "automation") {
        await axios.post(
          `${API}/campaigns/automation/templates/${campaign.id || campaign._id}/send`,
          { subject, htmlBody, textBody },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Campaign sent!");
      } else {
        await axios.post(
          `${API}/campaigns/${campaign._id}/launch`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Campaign launched!");
      }
      onSave?.();
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || "Failed to send");
    } finally {
      setSaving(false);
    }
  };

  const modalTitle = mode === "automation" 
    ? `Edit Email - ${campaign.audience} • ${campaign.purpose}`
    : `Edit Email - ${campaign.name}`;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1035] rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-700 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white">Edit Email Content</h3>
            <p className="text-gray-400 text-sm mt-1">{modalTitle}</p>
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
          {mode !== "automation" && (
            <button
              onClick={handleSend}
              disabled={saving}
              className="btn-primary bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Sending..." : "Launch Campaign"}
            </button>
          )}
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
            ${campaign.ctaText || "Learn More"} →
          </a>
        </div>
        
        <div style="background:#f9f5ff;border-radius:8px;padding:20px;margin-top:30px;">
          <p style="margin:0;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Campaign Info</p>
          <p style="margin:5px 0 0;color:#333;font-size:14px;">
            <strong>Phase:</strong> ${campaign.phase || "N/A"} | 
            <strong>Audience:</strong> ${campaign.audience || "N/A"} | 
            <strong>Purpose:</strong> ${campaign.purpose || "N/A"}
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
            <td style="background:#f1f5f9;padding:20px 30px;text-align:center;">
              <p style="color:#64748b;font-size:12px;margin:0;">
                The Tech Festival Canada • Toronto, Ontario
              </p>
              <p style="color:#94a3b8;font-size:11px;margin:8px 0 0;">
                <a href="#" style="color:#64748b;">Unsubscribe</a> | <a href="#" style="color:#64748b;">View in browser</a>
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