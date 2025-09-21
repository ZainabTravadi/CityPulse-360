import { useState, useEffect } from "react";
import axios from "axios";
import KPICard from "./KPICard";
import { Car, Wind, Droplets, Zap, MessageSquare } from "lucide-react";

const Dashboard = () => {
  const [kpiData, setKpiData] = useState<any[]>([]);

  const API_BASE = import.meta.env.VITE_API_BASE || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trafficRes, airRes, waterRes, elecRes, complaintsRes] =
          await Promise.all([
            axios.get(`${API_BASE}/traffic`),
            axios.get(`${API_BASE}/air`),
            axios.get(`${API_BASE}/water`),
            axios.get(`${API_BASE}/electricity`),
            axios.get(`${API_BASE}/complaints`),
          ]);

        setKpiData([
          {
            title: "Traffic Congestion",
            value: trafficRes.data.congestion.replace("%", ""),
            unit: "%",
            trend: "neutral",
            trendValue: "Live",
            icon: <Car className="w-5 h-5 text-blue-500" />,
            status: "warning",
            textColor: "text-red-500 font-bold",
          },
          {
            title: "Air Quality Index",
            value: airRes.data.aqi,
            unit: "AQI",
            trend: "neutral",
            trendValue: airRes.data.description,
            icon: <Wind className="w-5 h-5 text-yellow-500" />,
            status: "good",
            textColor: "text-blue-500 font-semibold",
          },
          {
            title: "Water Usage",
            value: waterRes.data.water_usage.split(" ")[0],
            unit: "ML",
            trend: "neutral",
            trendValue: waterRes.data.condition,
            icon: <Droplets className="w-5 h-5 text-yellow-300" />,
            textColor: "text-cyan-500 font-semibold",
          },
          {
            title: "Electricity Load",
            value: elecRes.data.electricity_load.split(" ")[0],
            unit: "MW",
            trend: "neutral",
            trendValue: elecRes.data.zone,
            icon: <Zap className="w-5 h-5 text-red-500" />,
            status: "critical",
            textColor: "text-yellow-500 font-bold",
          },
          {
            title: "Active Complaints",
            value: complaintsRes.data.count,
            unit: "",
            trend: "neutral",
            trendValue: "Live data",
            icon: <MessageSquare className="w-5 h-5 text-blue-300" />,
            status: "warning",
            textColor: "text-purple-500 font-semibold",
          },
        ]);
      } catch (err) {
        console.error("API fetch error:", err);

        // Fallback demo data
        setKpiData([
          {
            title: "Traffic Congestion",
            value: 65,
            unit: "%",
            trend: "neutral",
            trendValue: "Live",
            icon: <Car className="w-5 h-5 text-blue-500" />,
            status: "warning",
            textColor: "text-red-500 font-bold",
          },
          {
            title: "Air Quality Index",
            value: 42,
            unit: "AQI",
            trend: "neutral",
            trendValue: "Moderate",
            icon: <Wind className="w-5 h-5 text-yellow-500" />,
            status: "good",
            textColor: "text-blue-500 font-semibold",
          },
          {
            title: "Water Usage",
            value: 120,
            unit: "ML",
            trend: "neutral",
            trendValue: "Normal",
            icon: <Droplets className="w-5 h-5 text-yellow-300" />,
            textColor: "text-cyan-500 font-semibold",
          },
          {
            title: "Electricity Load",
            value: 320,
            unit: "MW",
            trend: "neutral",
            trendValue: "Zone 1",
            icon: <Zap className="w-5 h-5 text-red-500" />,
            status: "critical",
            textColor: "text-yellow-500 font-bold",
          },
          {
            title: "Active Complaints",
            value: 8,
            unit: "",
            trend: "neutral",
            trendValue: "Live data",
            icon: <MessageSquare className="w-5 h-5 text-blue-300" />,
            status: "warning",
            textColor: "text-purple-500 font-semibold",
          },
        ]);
      }
    };

    fetchData();
  }, [API_BASE]);

  return (
    <section
      id="dashboard"
      className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-gray-900 via-gray-950 to-black"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <KPICard key={index} {...kpi} className={kpi.textColor} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
