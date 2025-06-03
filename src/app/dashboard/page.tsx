"use client";

import DashboardSelectors from "@/components/dashboard/DashboardSelectors";
import DashboardStatsCards from "@/components/dashboard/DashboardStatsCards";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import HeaderComponent from "@/components/layout/HeaderComponent";
import {
  getAllLocations,
  getGlobalData,
  getLocationData,
  getPandemics,
} from "@/services/api";
import { getPredictions } from "@/services/predict";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ChartDataset = {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  tension: number;
};

type ChartData = {
  labels: string[];
  datasets: ChartDataset[];
};

export default function DashboardPage() {
  const [selectedPandemic, setSelectedPandemic] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");
  const [selectedLocalisation, setSelectedLocalisation] = useState<
    string | null
  >(null);


  const [localisations, setLocalisations] = useState<any[]>([]);
  const [pandemics, setPandemics] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    cas_confirmes: 0,
    deces: 0,
    new_cases: 0,
    new_deaths: 0,
  });
  const [timeline, setTimeline] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: "Cas confirmés",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
      {
        label: "Décès",
        data: [],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
      {
        label: "Nouveaux cas",
        data: [],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
      },
      {
        label: "Nouveaux décès",
        data: [],
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        tension: 0.4,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Évolution des cas et des décès",
      },
    },
  };

  useEffect(() => {
    async function fetchLocalisations() {
      try {
        const data = await getAllLocations();
        setLocalisations(data || []);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des localisations :",
          error
        );
        setError("Erreur lors du chargement des localisations");
      }
    }
    fetchLocalisations();
  }, []);

  useEffect(() => {
    async function fetchPandemics() {
      try {
        const data = await getPandemics();
        setPandemics(data || []);
        if (data && data.length > 0) {
          setSelectedPandemic(data[0].id);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des pandémies :", error);
        setError("Erreur lors du chargement des pandémies");
      }
    }
    fetchPandemics();
  }, []);

  useEffect(() => {
    if (selectedPandemic) {
      if (selectedLocalisation) {
        fetchLocationData(selectedLocalisation, selectedPandemic);
      } else {
        fetchGlobalData(selectedPandemic);
      }
    }
  }, [selectedPandemic, selectedLocalisation]);

  useEffect(() => {
    if (timeline) {
      const filtered = filterTimelineByTimeframe(timeline, selectedTimeframe);
      updateChartData(filtered);
    }
  }, [selectedTimeframe, timeline]);

  const filterTimelineByTimeframe = (data: any[], timeframe: string) => {
    if (!data || data.length === 0) return [];

    const len = data.length;

    switch (timeframe) {
      case "early":
        return data.slice(0, Math.ceil(len * 0.25));
      case "peak":
        const start = Math.floor(len * 0.375);
        return data.slice(start, start + Math.ceil(len * 0.25));
      case "decline":
        return data.slice(Math.floor(len * 0.75));
      default:
        return data;
    }
  };

  const normalizeData = (item: any, property: string): number => {
    const value = item[property];
    if (value === null || value === undefined) return 0;
    const numberValue = Number(value);
    return isNaN(numberValue) ? 0 : numberValue;
  };

  const updateChartData = (timelineData: any[]) => {
    if (!timelineData || timelineData.length === 0) {
      console.warn("Aucune donnée de timeline disponible");
      setChartData((prev) => ({
        ...prev,
        labels: [],
        datasets: prev.datasets.map((ds) => ({ ...ds, data: [] })),
      }));
      return;
    }

    const labels = timelineData.map((item) => {
      try {
        return new Date(item.dateValue).toLocaleDateString();
      } catch (e) {
        console.error("Date invalide:", item.date);
        return "Date invalide";
      }
    });

    const confirmedCases = timelineData.map((item) =>
      normalizeData(item, "totalCases")
    );
    const deaths = timelineData.map((item) =>
      normalizeData(item, "totalDeaths")
    );

    const newCases = timelineData.map((item) =>
      normalizeData(item, "newCases")
    );
    const newDeaths = timelineData.map((item) =>
      normalizeData(item, "newDeaths")
    );

    const getLastNonZeroValue = (values: number[]) => {
      for (let i = values.length - 1; i >= 0; i--) {
        if (values[i] !== null && values[i] !== 0) {
          return values[i];
        }
      }
      return 0;
    };

    const statsUpdate = {
      cas_confirmes: getLastNonZeroValue(confirmedCases),
      deces: getLastNonZeroValue(deaths),
      new_cases: getLastNonZeroValue(newCases),
      new_deaths: getLastNonZeroValue(newDeaths),
    };

    setStats(statsUpdate);

    setChartData({
      labels,
      datasets: [
        { ...chartData.datasets[0], data: confirmedCases },
        { ...chartData.datasets[1], data: deaths },
        { ...chartData.datasets[2], data: newCases },
        { ...chartData.datasets[3], data: newDeaths },
      ],
    });
  };

  const fetchGlobalData = async (pandemicId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const globalData = await getGlobalData(pandemicId);

      if (!globalData) {
        throw new Error("Aucune donnée reçue");
      }

      if (globalData.timeline && Array.isArray(globalData.timeline)) {
        setTimeline(globalData.timeline);
        const filtered = filterTimelineByTimeframe(
          globalData.timeline,
          selectedTimeframe
        );
        updateChartData(filtered);
      } else if (Array.isArray(globalData)) {
        setTimeline(globalData);
        const filtered = filterTimelineByTimeframe(
          globalData,
          selectedTimeframe
        );
        updateChartData(filtered);
      } else {
        console.error("Format de données invalide:", globalData);
        setError("Format de données invalide");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données globales:",
        error
      );
      setError("Erreur lors du chargement des données globales");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLocationData = async (locationId: string, pandemicId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getLocationData(locationId, pandemicId);
      if (!data) {
        throw new Error("Aucune donnée reçue");
      }

      if (data.timeline && Array.isArray(data.timeline)) {
        setTimeline(data.timeline);
        const filtered = filterTimelineByTimeframe(
          data.timeline,
          selectedTimeframe
        );
        updateChartData(filtered);
      } else if (Array.isArray(data)) {
        setTimeline(data);
        const filtered = filterTimelineByTimeframe(data, selectedTimeframe);
        updateChartData(filtered);
      } else {
        console.error("Format de données invalide:", data);
        setError("Format de données invalide");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de localisation:",
        error
      );
      setError("Erreur lors du chargement des données de localisation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocalisationChange = (localisationId: string) => {
    if (localisationId === "global") {
      setSelectedLocalisation(null);
    } else {
      setSelectedLocalisation(localisationId);
    }
  };

  const handleLocationClick = (locationId: string) => {
    setSelectedLocalisation(locationId);
    if (selectedPandemic) {
      fetchLocationData(locationId, selectedPandemic);
    }
  };

  const handleExportData = () => {
    if (!selectedPandemic || !timeline) return;

    const exportData = {
      pandemic_id: selectedPandemic,
      location: selectedLocalisation ? selectedLocalisation : "global",
      timeframe: selectedTimeframe,
      statistics: {
        total_cases: stats.cas_confirmes,
        total_deaths: stats.deces,
        new_cases: stats.new_cases,
        new_deaths: stats.new_deaths,
      },
      timeline: timeline.map((item: any) => ({
        date: item.date || item.dateValue,
        total_cases: item.totalCases || 0,
        total_deaths: item.totalDeaths || 0,
        new_cases: item.newCases || 0,
        new_deaths: item.newDeaths || 0,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pandemic-data-${selectedPandemic}-${selectedTimeframe}-${new Date().toISOString().split("T")[0]
      }.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeaderComponent />
      <main className="mt-[5rem] flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <DashboardSelectors
          pandemics={pandemics}
          localisations={localisations}
          selectedPandemic={selectedPandemic}
          setSelectedPandemic={setSelectedPandemic}
          selectedLocalisation={selectedLocalisation}
          handleLocalisationChange={handleLocalisationChange}
          selectedTimeframe={selectedTimeframe}
          setSelectedTimeframe={setSelectedTimeframe}
          handleExportData={handleExportData}
          timeline={timeline}
        />

        <DashboardStatsCards
          stats={stats}
          isLoading={isLoading}
          selectedLocalisation={selectedLocalisation}
          localisations={localisations}
        />

        <DashboardTabs
          chartData={chartData}
          chartOptions={chartOptions}
          localisations={localisations}
          selectedLocalisation={selectedLocalisation}
          selectedPandemic={selectedPandemic}
          handleLocationClick={handleLocationClick}
          timeline={timeline}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
