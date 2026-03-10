import { useEffect, useState } from "react";
import axios from "axios";

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

  const [range, setRange] = useState("week");
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState({
    totalRevenue: 0,
    totalTickets: 0
  });

  const fetchAnalytics = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `/api/admin/analytics?range=${range}`,
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
    totals.totalTickets > 0
      ? (totals.totalRevenue / totals.totalTickets).toFixed(2)
      : 0;

  return (
    <div className="space-y-8">

      {/* KPI Cards */}

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-[#1a1035] p-6 rounded-xl border border-purple-700">
          <p className="text-gray-400">Total Revenue</p>
          <h2 className="text-3xl font-bold text-white">
            ${totals.totalRevenue}
          </h2>
        </div>

        <div className="bg-[#1a1035] p-6 rounded-xl border border-purple-700">
          <p className="text-gray-400">Tickets Sold</p>
          <h2 className="text-3xl font-bold text-white">
            {totals.totalTickets}
          </h2>
        </div>

        <div className="bg-[#1a1035] p-6 rounded-xl border border-purple-700">
          <p className="text-gray-400">Avg Ticket Price</p>
          <h2 className="text-3xl font-bold text-white">
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
              : "bg-[#1a1035] text-gray-300"
          }`}
        >
          Day
        </button>

        <button
          onClick={() => setRange("week")}
          className={`px-4 py-2 rounded-lg ${
            range === "week"
              ? "bg-purple-600 text-white"
              : "bg-[#1a1035] text-gray-300"
          }`}
        >
          Week
        </button>

        <button
          onClick={() => setRange("month")}
          className={`px-4 py-2 rounded-lg ${
            range === "month"
              ? "bg-purple-600 text-white"
              : "bg-[#1a1035] text-gray-300"
          }`}
        >
          Month
        </button>

      </div>

      {/* Revenue Chart */}

      <div className="bg-[#1a1035] p-6 rounded-xl border border-purple-700">

        <h3 className="text-lg text-white mb-4">
          Revenue Over Time
        </h3>

        <ResponsiveContainer width="100%" height={350}>

          <LineChart data={data}>

            <CartesianGrid stroke="#333" />

            <XAxis
              dataKey="_id"
              stroke="#aaa"
            />

            <YAxis stroke="#aaa" />

            <Tooltip />

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
