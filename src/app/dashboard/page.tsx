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

  const [chartData, setChartData] = useState({
    labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin"],
    datasets: [
      {
        label: "Cas confirmés",
        data: [100, 200, 300, 400, 500, 600],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
      {
        label: "Décès",
        data: [50, 100, 150, 200, 250, 300],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
      {
        label: "Nouveaux cas",
        data: [20, 30, 40, 50, 60, 70],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
      },
      {
        label: "Nouveaux décès",
        data: [5, 10, 15, 20, 25, 30],
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        tension: 0.4,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
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
        if (data.length > 0) {
          setSelectedPandemic(data[0].id);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des pandémies :", error);
      }
    }
    fetchPandemics();
  }, []);

  useEffect(() => {
    if (selectedPandemic) {
      if (selectedLocalisation) {
        fetchLocationData(selectedLocalisation);
      } else {
        fetchGlobalData();
      }
    }
  }, [selectedPandemic, selectedLocalisation]);

  const updateChartData = (timelineData) => {
    const labels = timelineData.map((item) =>
      new Date(item.date).toLocaleDateString()
    );
    const confirmedCases = timelineData.map((item) => item.cas_confirmes);
    const deaths = timelineData.map((item) => item.deces);
    const newCases = timelineData.map((item) => item.new_cases);
    const newDeaths = timelineData.map((item) => item.new_deaths);

    setChartData({
      labels,
      datasets: [
        {
          label: "Cas confirmés",
          data: confirmedCases,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
        },
        {
          label: "Décès",
          data: deaths,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          tension: 0.4,
        },
        {
          label: "Nouveaux cas",
          data: newCases,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          tension: 0.4,
        },
        {
          label: "Nouveaux décès",
          data: newDeaths,
          borderColor: "rgba(255, 159, 64, 1)",
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          tension: 0.4,
        },
      ],
    });
  };

  const fetchGlobalData = async () => {
    setIsLoading(true);
    try {
      const globalData = await getGlobalData();
      setStats({
        cas_confirmes: globalData.cas_confirmes || 0,
        deces: globalData.deces || 0,
        new_cases: globalData.new_cases || 0,
        new_deaths: globalData.new_deaths || 0,
      });

      if (globalData.timeline) {
        updateChartData(globalData.timeline);
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

  const fetchLocationData = async (locationId) => {
    setIsLoading(true);
    try {
      const data = await getLocationData(locationId);
      setStats({
        cas_confirmes: data.cas_confirmes || 0,
        deces: data.deces || 0,
        new_cases: data.new_cases || 0,
        new_deaths: data.new_deaths || 0,
      });

      if (data.timeline) {
        updateChartData(data.timeline);
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

  const handleLocalisationChange = (localisationId) => {
    setSelectedLocalisation(localisationId);

    if (!localisationId) {
      fetchGlobalData();
      return;
    }

    const localisation = localisations.find((loc) => loc.id === localisationId);
    if (localisation) {
      fetchLocationData(localisationId);
    }
  };

  const handleLocationClick = (data, locationId) => {
    setStats({
      cas_confirmes: data.cas_confirmes || 0,
      deces: data.deces || 0,
      new_cases: data.new_cases || 0,
      new_deaths: data.new_deaths || 0,
    });

    setSelectedLocalisation(locationId);

    if (data.timeline) {
      updateChartData(data.timeline);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeaderComponent />
      <main className="mt-[5rem] flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Select
            value={selectedPandemic || ""}
            onValueChange={(value) => setSelectedPandemic(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une pandémie" />
            </SelectTrigger>
            <SelectContent>
              {pandemics.length > 0 ? (
                pandemics.map((pandemie) => (
                  <SelectItem key={pandemie.id} value={pandemie.id}>
                    {pandemie.nom_pandemie}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled>Aucune pandémie disponible</SelectItem>
              )}
            </SelectContent>
          </Select>
          <Select
            value={selectedLocalisation || ""}
            onValueChange={(value) => handleLocalisationChange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une localisation" />
            </SelectTrigger>
            <SelectContent>
              {localisations.length > 0 ? (
                localisations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.country}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled>Aucune localisation disponible</SelectItem>
              )}
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
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline">Exporter les données</Button>
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
                          )?.country || "la localisation sélectionnée"
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
                          )?.country || "la localisation sélectionnée"
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
                          )?.country || "la localisation sélectionnée"
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
                          )?.country || "la localisation sélectionnée"
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
              className="z-2"
            />
          </TabsContent>
          <TabsContent value="stats" className="border rounded-md p-4">
            <div>Statistiques détaillées à afficher ici</div>
          </TabsContent>
          <TabsContent value="timeline" className="border rounded-md p-4">
            <div>Chronologie à afficher ici</div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
