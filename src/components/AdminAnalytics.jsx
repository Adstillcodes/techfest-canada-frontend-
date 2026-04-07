import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../utils/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function AdminAnalytics() {

  const [isDark, setIsDark] = useState(true);
  const [range, setRange] = useState("week");
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState({
    totalRevenue: 0,
    totalTickets: 0
  });

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.body.classList.contains("dark-mode"));
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    
    return () => observer.disconnect();
  }, []);

  const fetchAnalytics = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
  `${API}/admin/analytics`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

      setData(res.data.sales);
      setTotals(res.data.totals);

    } catch (err) {

      console.error("Analytics fetch error:", err);

    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const avgPrice =
    totals?.totalTickets > 0
      ? (totals?.totalRevenue / totals?.totalTickets).toFixed(2)
      : 0;

  const textMain = isDark ? "white" : "#0d0520";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const buttonBg = isDark ? "#1a1035" : "#f3f4f6";
  const buttonText = isDark ? "text-gray-300" : "text-gray-700";
  const chartGrid = isDark ? "#333" : "#e5e7eb";
  const chartAxis = isDark ? "#aaa" : "#6b7280";

  return (
    <div className="space-y-8">

      {/* KPI Cards */}

      <div className="grid grid-cols-3 gap-6">

        <div className={`${isDark ? 'bg-[#1a1035]' : 'bg-white'} p-6 rounded-xl border ${isDark ? 'border-purple-700' : 'border-purple-300'} shadow-sm`}>
          <p className={textMuted}>Total Revenue</p>
          <h2 className={`text-3xl font-bold ${textMain}`}>
            ${totals?.totalRevenue?.toLocaleString()}
          </h2>
        </div>

        <div className={`${isDark ? 'bg-[#1a1035]' : 'bg-white'} p-6 rounded-xl border ${isDark ? 'border-purple-700' : 'border-purple-300'} shadow-sm`}>
          <p className={textMuted}>Tickets Sold</p>
          <h2 className={`text-3xl font-bold ${textMain}`}>
            {totals?.totalTickets}
          </h2>
        </div>

        <div className={`${isDark ? 'bg-[#1a1035]' : 'bg-white'} p-6 rounded-xl border ${isDark ? 'border-purple-700' : 'border-purple-300'} shadow-sm`}>
          <p className={textMuted}>Avg Ticket Price</p>
          <h2 className={`text-3xl font-bold ${textMain}`}>
            ${avgPrice}
          </h2>
        </div>

      </div>

      {/* Range Selector */}

      <div className="flex gap-4">

        <button
          onClick={() => setRange("day")}
          className={`px-4 py-2 rounded-lg ${
            range === "day"
              ? "bg-purple-600 text-white"
              : `${buttonBg} ${buttonText}`
          }`}
        >
          Day
        </button>

        <button
          onClick={() => setRange("week")}
          className={`px-4 py-2 rounded-lg ${
            range === "week"
              ? "bg-purple-600 text-white"
              : `${buttonBg} ${buttonText}`
          }`}
        >
          Week
        </button>

        <button
          onClick={() => setRange("month")}
          className={`px-4 py-2 rounded-lg ${
            range === "month"
              ? "bg-purple-600 text-white"
              : `${buttonBg} ${buttonText}`
          }`}
        >
          Month
        </button>

      </div>

      {/* Revenue Chart */}

      <div className={`${isDark ? 'bg-[#1a1035]' : 'bg-white'} p-6 rounded-xl border ${isDark ? 'border-purple-700' : 'border-purple-300'} shadow-sm`}>

        <h3 className={`text-lg ${textMain} mb-4`}>
          Revenue Over Time
        </h3>

<ResponsiveContainer width="100%" height={350}>

  <LineChart data={data}>

    <CartesianGrid stroke={chartGrid} />

    <XAxis
      dataKey="name"
      stroke={chartAxis}
    />

    <YAxis stroke={chartAxis} />

    <Tooltip 
      contentStyle={{
        backgroundColor: isDark ? "#1a1035" : "#ffffff",
        border: isDark ? "1px solid #7a3fd1" : "1px solid #7a3fd1",
        borderRadius: "8px",
        color: isDark ? "#fff" : "#0d0520"
      }}
    />

    <Line
      type="monotone"
      dataKey="revenue"
      stroke="#a855f7"
      strokeWidth={3}
    />

  </LineChart>

</ResponsiveContainer>

      </div>

    </div>
  );
}
