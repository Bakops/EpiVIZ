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
  getLocalisations,
  getPandemicMapData,
  getPandemics,
  getPandemicStats,
  getPandemicTimeline,
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
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

// Enregistrez les composants nécessaires pour Chart.js
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
  const [stats, setStats] = useState<any>(null);
  const [timeline, setTimeline] = useState<any>(null);
  const [mapData, setMapData] = useState<any>(null);

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
    ],
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Évolution des cas et des décès",
      },
    },
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleImportCSV(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      console.error("Aucun fichier sélectionné.");
      return;
    }

    // Utilisation de PapaParse pour lire le fichier CSV
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log("Données importées :", results.data);
        const data = results.data as Array<{
          country: string;
          cases: string;
          deaths: string;
        }>;

        // Mettre à jour les localisations
        const updatedLocalisations = data.map((row, index) => ({
          id: index + 1,
          country: row.country,
          cases: parseInt(row.cases, 10),
          deaths: parseInt(row.deaths, 10),
        }));
        setLocalisations(updatedLocalisations);

        // Mettre à jour les données du graphique
        const updatedChartData = {
          labels: updatedLocalisations.map((loc) => loc.country),
          datasets: [
            {
              label: "Cas confirmés",
              data: updatedLocalisations.map((loc) => loc.cases),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.4,
            },
            {
              label: "Décès",
              data: updatedLocalisations.map((loc) => loc.deaths),
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              tension: 0.4,
            },
          ],
        };
        setChartData(updatedChartData);
      },
      error: (error) => {
        console.error("Erreur lors de l'importation du fichier CSV :", error);
      },
    });
  }

  useEffect(() => {
    async function fetchLocalisations() {
      try {
        const data = await getLocalisations();
        console.log("Données des localisations récupérées :", data);
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
        console.log("Données des pandémies récupérées :", data);
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
    async function fetchPandemicData() {
      if (selectedPandemic) {
        try {
          const statsData = await getPandemicStats(selectedPandemic);
          const timelineData = await getPandemicTimeline(selectedPandemic);
          const mapData = await getPandemicMapData(selectedPandemic);
          setStats(statsData);
          setTimeline(timelineData);
          setMapData(mapData);
        } catch (error) {
          console.error("Erreur lors de la récupération des données :", error);
        }
      }
    }
    fetchPandemicData();
  }, [selectedPandemic, selectedTimeframe]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeaderComponent />
      <main className="mt-[5rem] flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Sélection des filtres */}
        <div className="flex items-center gap-4">
          <Select
            value={selectedPandemic || ""}
            onValueChange={(value) => setSelectedPandemic(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une pandémie" />
            </SelectTrigger>
            <SelectContent>
              {pandemics.map((pandemic) => (
                <SelectItem key={pandemic.id} value={pandemic.id}>
                  {pandemic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedLocalisation || ""}
            onValueChange={(value) => setSelectedLocalisation(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une localisation" />
            </SelectTrigger>
            <SelectContent>
              {localisations.map((localisation) => (
                <SelectItem key={localisation.id} value={localisation.id}>
                  {localisation.country} - {localisation.continent}
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
          <div className="ml-auto flex items-center gap-4">
            {/* Bouton pour ouvrir la modale */}
            <Button variant="outline" onClick={() => setIsModalOpen(true)}>
              Importer les données
            </Button>

            {/* Bouton pour exporter les données */}
            <Button variant="outline">Exporter les données</Button>
          </div>

          {/* Modale */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000005b] bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
                <h2 className="text-xl font-bold mb-4">
                  Importer un fichier CSV
                </h2>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    handleImportCSV({
                      target: { files: [file] },
                      currentTarget: { files: [file] },
                    } as unknown as React.ChangeEvent<HTMLInputElement>);
                  }}
                >
                  <p className="text-gray-500">
                    Glissez et déposez votre fichier ici
                  </p>
                  <p className="text-gray-500">ou</p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImportCSV}
                    className="hidden"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="text-blue-500 underline cursor-pointer"
                  >
                    Sélectionnez un fichier
                  </label>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Affichage des statistiques */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Taux de transmission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.transmissionRate ?? "XX"}
              </div>
              <p className="text-sm text-muted-foreground">
                {stats?.transmissionRateDescription ?? "Aucune donnée"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Taux de mortalité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.mortalityRate ?? "XX"}
              </div>
              <p className="text-sm text-muted-foreground">
                {stats?.mortalityRateDescription ?? "Aucune donnée"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Durée moyenne</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.averageDuration ?? "XX"}
              </div>
              <p className="text-sm text-muted-foreground">
                {stats?.averageDurationDescription ?? "Aucune donnée"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Population touchée</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.affectedPopulation ?? "XX"}
              </div>
              <p className="text-sm text-muted-foreground">
                {stats?.affectedPopulationDescription ?? "Aucune donnée"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Affichage des données dans les onglets */}
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
            <InteractiveMap localisations={localisations} className="z-2" />
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
