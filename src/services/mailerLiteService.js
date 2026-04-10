import axios from "axios";

const API = "https://techfest-canada-backend.onrender.com/api";

export async function getMailerLiteCampaigns() {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/mailerlite/campaigns`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getMailerLiteCampaign(campaignId) {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/mailerlite/campaigns/${campaignId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getMailerLiteCampaignStats(campaignId) {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/mailerlite/campaigns/${campaignId}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getMailerLiteGroups() {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/mailerlite/groups`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getMailerLiteEmbedUrl() {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/mailerlite/embed-url`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}