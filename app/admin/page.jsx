"use client";

import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function Dashboard() {
  const cards = [
    { title: "Usuarios", value: "128", color: "from-blue-500 to-blue-700" },
    { title: "Dispositivos", value: "342", color: "from-purple-500 to-purple-700" },
    { title: "Logs", value: "12.4k", color: "from-green-500 to-green-700" }
  ];

  const data = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Usuarios activos",
        data: [20, 35, 40, 50, 65, 70, 80],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        tension: 0.3,
        fill: true
      }
    ]
  };

  const options = {
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: "#9ca3af" } },
      y: { ticks: { color: "#9ca3af" } }
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-xl shadow-lg text-white bg-gradient-to-br ${card.color}`}
          >
            <p className="text-lg">{card.title}</p>
            <p className="text-4xl font-bold mt-2">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-neutral-950 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-800 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Usuarios activos esta semana
        </h2>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
