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
        console.log("Localisations récupérées:", data);
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
        console.log("Pandémies récupérées:", data);
        setPandemics(data || []);
        if (data && data.length > 0) {
          console.log("Sélection de la pandémie par défaut:", data[0].id);
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
      console.log("Pandemic sélectionnée:", selectedPandemic);
      if (selectedLocalisation) {
        console.log("Localisation sélectionnée:", selectedLocalisation);
        fetchLocationData(selectedLocalisation, selectedPandemic);
      } else {
        console.log("Récupération des données globales");
        fetchGlobalData(selectedPandemic);
      }
    }
  }, [selectedPandemic, selectedLocalisation]);

  useEffect(() => {
    if (timeline) {
      console.log(
        "Timeline mise à jour, application du filtre:",
        selectedTimeframe
      );
      const filtered = filterTimelineByTimeframe(timeline, selectedTimeframe);
      updateChartData(filtered);
    }
  }, [selectedTimeframe, timeline]);

  const filterTimelineByTimeframe = (data: any[], timeframe: string) => {
    if (!data || data.length === 0) return [];

    const len = data.length;

    console.log(
      `Filtrage de la timeline (${len} entrées) par période:`,
      timeframe
    );

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
    console.log('Valeur de item property ${property} :', value)
    if (value === null || value === undefined) return 0;
    const numberValue = Number(value);
    return isNaN(numberValue) ? 0 : numberValue;
  };

  const updateChartData = (timelineData: any[]) => {
    console.log("Mise à jour des données du graphique:", timelineData);

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
      console.log("Clés de l'objet item:", Object.keys(item));
      try {
        return new Date(item.date_value).toLocaleDateString();
      } catch (e) {
        console.error("Date invalide:", item.date);
        return "Date invalide";
      }
    });

    const confirmedCases = timelineData.map((item) =>
      normalizeData(item, "totalCases")
    );
<<<<<<< HEAD
    const deaths = timelineData.map((item) =>
      normalizeData(item, "totalDeaths")
    );

=======
    const deaths = timelineData.map((item) => normalizeData(item, "deces"));
    
>>>>>>> 565468d40fc0483c8d32c115686bedff4525b6e2
    const newCases = timelineData.map((item) =>
      normalizeData(item, "newCases")
    );
    const newDeaths = timelineData.map((item) =>
      normalizeData(item, "newDeaths")
    );

    console.log("Données préparées:", {
      labels,
      confirmedCases,
      deaths,
      newCases,
      newDeaths,
    });

    // Utiliser la dernière valeur non nulle pour chaque statistique
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

    console.log("Mise à jour des statistiques:", statsUpdate);
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
      console.log("Récupération des données globales pour:", pandemicId);
      const globalData = await getGlobalData(pandemicId);
      console.log("Données globales reçues:", globalData);

      if (!globalData) {
        throw new Error("Aucune donnée reçue");
      }

      if (globalData.timeline && Array.isArray(globalData.timeline)) {
        console.log(
          `Timeline globale reçue: ${globalData.timeline.length} entrées`
        );
        setTimeline(globalData.timeline);
        const filtered = filterTimelineByTimeframe(
          globalData.timeline,
          selectedTimeframe
        );
        updateChartData(filtered);
      } else if (Array.isArray(globalData)) {
        // Si les données sont directement un tableau
        console.log(`Timeline globale directe: ${globalData.length} entrées`);
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
      console.log(
        `Récupération des données pour localisation ${locationId} et pandémie ${pandemicId}`
      );
      const data = await getLocationData(locationId, pandemicId);
      console.log("Données de localisation reçues:", data);

      if (!data) {
        throw new Error("Aucune donnée reçue");
      }

      if (data.timeline && Array.isArray(data.timeline)) {
        console.log(
          `Timeline de localisation reçue: ${data.timeline.length} entrées`
        );
        setTimeline(data.timeline);
        const filtered = filterTimelineByTimeframe(
          data.timeline,
          selectedTimeframe
        );
        updateChartData(filtered);
      } else if (Array.isArray(data)) {
        // Si les données sont directement un tableau
        console.log(`Timeline de localisation directe: ${data.length} entrées`);
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
    console.log("Changement de localisation:", localisationId);
    if (localisationId === "global") {
      setSelectedLocalisation(null);
    } else {
      setSelectedLocalisation(localisationId);
    }
  };

  const handleLocationClick = (_: any, locationId: string) => {
    console.log("Clic sur la localisation:", locationId);
    setSelectedLocalisation(locationId);
    if (selectedPandemic) {
      fetchLocationData(locationId, selectedPandemic);
    }
  };

  return (
    <div
      className="flex min-h-screen w-fu
    ll flex-col"
    >
      <HeaderComponent />
      <main className="mt-[5rem] flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

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
                  {p.type}
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
              {(Array.isArray(localisations) ? localisations : []).map((l) => (
                <SelectItem key={l.id || Math.random()} value={l.id}>
                  {l.country || l.nom || "Sans nom"}
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
                    {(typeof stats.cas_confirmes === "number"
                      ? stats.cas_confirmes
                      : 0
                    ).toLocaleString()}
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
                    {(typeof stats.deces === "number"
                      ? stats.deces
                      : 0
                    ).toLocaleString()}
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
                    {(typeof stats.new_cases === "number"
                      ? stats.new_cases
                      : 0
                    ).toLocaleString()}
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
                    {(typeof stats.new_deaths === "number"
                      ? stats.new_deaths
                      : 0
                    ).toLocaleString()}
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
                {timeline.map((item: any, index: number) => {
                  // Sécuriser les valeurs pour éviter les erreurs
                  const safeValue = (value: any) => {
                    if (value === null || value === undefined) return 0;
                    return isNaN(Number(value)) ? 0 : Number(value);
                  };

                  const cas_confirmes = safeValue(item.totalCases);
                  const deces = safeValue(item.totalDeaths);
                  const new_cases = safeValue(item.newCases);
                  const new_deaths = safeValue(item.newDeaths);

                  // Formater la date
                  let formattedDate;
                  try {
                    formattedDate = new Date(item.date).toLocaleDateString();
                  } catch (e) {
                    formattedDate = "Date invalide";
                  }

                  return (
                    <div key={index} className="border-b pb-2">
                      <h3 className="font-medium">{formattedDate}</h3>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Cas confirmés:
                          </span>
                          <span className="ml-2 font-medium">
                            {cas_confirmes.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Décès:
                          </span>
                          <span className="ml-2 font-medium">
                            {deces.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Nouveaux cas:
                          </span>
                          <span className="ml-2 font-medium">
                            {new_cases.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Nouveaux décès:
                          </span>
                          <span className="ml-2 font-medium">
                            {new_deaths.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                {isLoading
                  ? "Chargement des données chronologiques..."
                  : "Aucune donnée chronologique disponible"}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
