"use client";

import HeaderComponent from "@/components/layout/HeaderComponent";
import PandemicMap from "@/components/pandemic-map";
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

type ConsentBannerProps = {
  onAccept: () => void;
  onReject: () => void;
};

const ConsentBanner = ({ onAccept, onReject }: ConsentBannerProps) => (
  <div
    role="alert"
    className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t z-50"
    aria-labelledby="consent-title"
  >
    <div className="container mx-auto">
      <h2 id="consent-title" className="text-lg font-bold mb-2">
        Protection de vos données
      </h2>
      <p className="mb-4">
        Conformément au RGPD, nous collectons uniquement des données
        statistiques anonymisées. Aucune donnée personnelle n'est stockée ou
        traitée.
        <a
          href="/privacy"
          className="text-blue-600 underline ml-2"
          aria-label="En savoir plus sur notre politique de confidentialité"
        >
          En savoir plus
        </a>
      </p>
      <div className="flex gap-4">
        <Button
          onClick={onAccept}
          aria-label="Accepter la collecte de données anonymisées"
        >
          Accepter
        </Button>
        <Button
          variant="outline"
          onClick={onReject}
          aria-label="Refuser la collecte de données"
        >
          Refuser
        </Button>
      </div>
    </div>
  </div>
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

  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<string>("medium");

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
        // Si les données sont directement un tableau
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
        // Si les données sont directement un tableau
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

    // Création et téléchargement du fichier
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pandemic-data-${selectedPandemic}-${selectedTimeframe}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  useEffect(() => {
    const savedConsent = localStorage.getItem("rgpdConsent");
    if (savedConsent) {
      setConsentGiven(JSON.parse(savedConsent));
    }
  }, []);

  const handleConsent = (accepted: boolean) => {
    setConsentGiven(accepted);
    localStorage.setItem("rgpdConsent", JSON.stringify(accepted));
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
            <Button
              variant="outline"
              disabled={!selectedPandemic || !timeline}
              onClick={handleExportData}
              className="flex items-center gap-2 cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Exporter les données
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#4BC0C0]">
                Nombre de cas confirmés
              </CardTitle>
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
              <CardTitle className="text-[#FF7391]">Nombre de décès</CardTitle>
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
              <CardTitle className="text-[#4AABED]">Nouveaux cas</CardTitle>
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
              <CardTitle className="text-[#FF9F40]">Nouveaux décès</CardTitle>
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
          </TabsList>
          <TabsContent value="charts" className="border rounded-md p-4">
            <div className="w-full h-full">
              <Line data={chartData} options={chartOptions} />
            </div>
          </TabsContent>
          <TabsContent value="map" className="border rounded-md p-4">
            <PandemicMap
              localisations={localisations}
              selectedLocationId={selectedLocalisation}
              selectedPandemicId={selectedPandemic}
              onLocationClick={handleLocationClick}
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
        {/* Bannière RGPD */}
        {!consentGiven && (
          <ConsentBanner
            onAccept={() => handleConsent(true)}
            onReject={() => handleConsent(false)}
          />
        )}
      </main>
    </div>
  );
}
