"use client";
import { getPredictions, Prediction } from "@/services/predict";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface PredictionChartProps {
  country: string;
}

export default function PredictionChart({ country }: PredictionChartProps) {
  const [data, setData] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!country) return;

    setLoading(true);
    const countryId = Number(country);
    if (isNaN(countryId)) {
      setData([]);
      setLoading(false);
      return;
    }
    getPredictions(countryId)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        setData([]);
        setLoading(false);
      });
  }, [country]); // <== très important : relancer l'effet si le pays change

  if (loading) return <p>Chargement des prédictions...</p>;
  if (data.length === 0) return <p>Aucune donnée disponible</p>;

  const chartData = {
    labels: data.map((p) => p.date),
    datasets: [
      {
        label: "Nouveaux cas",
        data: data.map((p) => p.new_cases),
        borderColor: "blue",
      },
      {
        label: "Nouveaux décès",
        data: data.map((p) => p.new_deaths),
        borderColor: "red",
      },
      {
        label: "Total cas",
        data: data.map((p) => p.total_cases),
        borderColor: "green",
      },
      {
        label: "Total décès",
        data: data.map((p) => p.total_deaths),
        borderColor: "orange",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Prédictions sur 30 jours" },
    },
    scales: {
      x: {
        ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 },
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
