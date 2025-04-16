"use client";

import HeaderComponent from "@/components/layout/HeaderComponent";
import InteractiveMap from "@/components/pandemic-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getAllLocations,
  getGlobalData,
  getLocationData,
  getPandemics,
} from "@/services/api";
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
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Définir un type pour les données des datasets
type ChartDataset = {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  tension: number;
};

// Définir un type pour les données du chart
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
      legend: { position: "top" },
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
        setLocalisations(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des localisations :",
          error
        );
      }
    }
    fetchLocalisations();
  }, []);

  useEffect(() => {
    async function fetchPandemics() {
      try {
        const data = await getPandemics();
        setPandemics(data);
        if (data.length > 0) setSelectedPandemic(data[0].id);
      } catch (error) {
        console.error("Erreur lors de la récupération des pandémies :", error);
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

  const updateChartData = (timelineData: any[]) => {
    if (!timelineData || timelineData.length === 0) {
      setChartData((prev) => ({
        ...prev,
        labels: [],
        datasets: prev.datasets.map((ds) => ({ ...ds, data: [] })),
      }));
      return;
    }

    const labels = timelineData.map((item) =>
      new Date(item.date).toLocaleDateString()
    );
    const confirmedCases = timelineData.map((item) => item.cas_confirmes);
    const deaths = timelineData.map((item) => item.deces);
    const newCases = timelineData.map((item) => item.new_cases);
    const newDeaths = timelineData.map((item) => item.new_deaths);

    setStats({
      cas_confirmes: confirmedCases.reduce((a, b) => a + b, 0),
      deces: deaths.reduce((a, b) => a + b, 0),
      new_cases: newCases.reduce((a, b) => a + b, 0),
      new_deaths: newDeaths.reduce((a, b) => a + b, 0),
    });

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
    try {
      const globalData = await getGlobalData(pandemicId);
      if (globalData.timeline) {
        setTimeline(globalData.timeline);
        const filtered = filterTimelineByTimeframe(
          globalData.timeline,
          selectedTimeframe
        );
        updateChartData(filtered);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données globales:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLocationData = async (locationId: string, pandemicId: string) => {
    setIsLoading(true);
    try {
      const data = await getLocationData(locationId, pandemicId);
      if (data.timeline) {
        setTimeline(data.timeline);
        const filtered = filterTimelineByTimeframe(
          data.timeline,
          selectedTimeframe
        );
        updateChartData(filtered);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de localisation:",
        error
      );
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

  const handleLocationClick = (_: any, locationId: string) => {
    setSelectedLocalisation(locationId);
    if (selectedPandemic) {
      fetchLocationData(locationId, selectedPandemic);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeaderComponent />
      <main className="mt-[5rem] flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Selects */}
        <div className="flex items-center gap-4">
          <Select
            value={selectedPandemic || ""}
            onValueChange={setSelectedPandemic}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une pandémie" />
            </SelectTrigger>
            <SelectContent>
              {pandemics.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.nom_pandemie}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedLocalisation || "global"}
            onValueChange={handleLocalisationChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une localisation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global</SelectItem>
              {localisations.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.country || l.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedTimeframe}
            onValueChange={setSelectedTimeframe}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toute la durée</SelectItem>
              <SelectItem value="early">Phase initiale</SelectItem>
              <SelectItem value="peak">Pic</SelectItem>
              <SelectItem value="decline">Phase de déclin</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto">
            <Button variant="outline" disabled={!selectedPandemic}>
              Exporter les données
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Nombre de cas confirmés</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-12">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {stats.cas_confirmes.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedLocalisation
                      ? `Données pour ${
                          localisations.find(
                            (loc) => loc.id === selectedLocalisation
                          )?.country ||
                          localisations.find(
                            (loc) => loc.id === selectedLocalisation
                          )?.nom ||
                          "la localisation sélectionnée"
                        }`
                      : "Données globales"}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Nombre de décès</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-12">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {stats.deces.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedLocalisation
                      ? `Données pour ${
                          localisations.find(
                            (loc) => loc.id === selectedLocalisation
                          )?.country ||
                          localisations.find(
                            (loc) => loc.id === selectedLocalisation
                          )?.nom ||
                          "la localisation sélectionnée"
                        }`
                      : "Données globales"}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Nouveaux cas</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-12">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {stats.new_cases.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedLocalisation
                      ? `Données pour ${
                          localisations.find(
                            (loc) => loc.id === selectedLocalisation
                          )?.country ||
                          localisations.find(
                            (loc) => loc.id === selectedLocalisation
                          )?.nom ||
                          "la localisation sélectionnée"
                        }`
                      : "Données globales"}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Nouveaux décès</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-12">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {stats.new_deaths.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedLocalisation
                      ? `Données pour ${
                          localisations.find(
                            (loc) => loc.id === selectedLocalisation
                          )?.country ||
                          localisations.find(
                            (loc) => loc.id === selectedLocalisation
                          )?.nom ||
                          "la localisation sélectionnée"
                        }`
                      : "Données globales"}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="charts">
          <TabsList>
            <TabsTrigger value="charts">Graphiques</TabsTrigger>
            <TabsTrigger value="map">Carte</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
            <TabsTrigger value="timeline">Chronologie</TabsTrigger>
          </TabsList>
          <TabsContent value="charts" className="border rounded-md p-4">
            <div className="w-full h-full">
              <Line data={chartData} options={chartOptions} />
            </div>
          </TabsContent>
          <TabsContent value="map" className="border rounded-md p-4">
            <InteractiveMap
              localisations={localisations}
              selectedLocationId={selectedLocalisation}
              onLocationClick={handleLocationClick}
              pandemicId={selectedPandemic}
              className="z-2"
            />
          </TabsContent>
          <TabsContent value="stats" className="border rounded-md p-4">
            <div>Statistiques détaillées à afficher ici</div>
          </TabsContent>
          <TabsContent value="timeline" className="border rounded-md p-4">
            {timeline && timeline.length > 0 ? (
              <div className="space-y-4">
                {timeline.map((item: any, index: number) => (
                  <div key={index} className="border-b pb-2">
                    <h3 className="font-medium">
                      {new Date(item.date).toLocaleDateString()}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Cas confirmés:
                        </span>
                        <span className="ml-2 font-medium">
                          {item.cas_confirmes.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Décès:
                        </span>
                        <span className="ml-2 font-medium">
                          {item.deces.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Nouveaux cas:
                        </span>
                        <span className="ml-2 font-medium">
                          {item.new_cases.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Nouveaux décès:
                        </span>
                        <span className="ml-2 font-medium">
                          {item.new_deaths.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>Aucune donnée chronologique disponible</div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
