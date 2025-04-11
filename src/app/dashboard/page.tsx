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
import { getAllLocations, getPandemics } from "@/services/api";
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

  useEffect(() => {
    async function fetchLocalisations() {
      try {
        const data = await getAllLocations();
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

  const handleLocalisationChange = (localisationId: string) => {
    setSelectedLocalisation(localisationId);

    const localisation = localisations.find((loc) => loc.id === localisationId);

    if (localisation) {
      setMapData({
        center: [localisation.latitude, localisation.longitude], // Coordonnées du pays
        zoom: 6,
        marker: {
          position: [localisation.latitude, localisation.longitude],
          label: localisation.country,
        },
      });
    }
  };

  const [mapData, setMapData] = useState({
    center: [0, 0], // Coordonnées initiales (par exemple, le centre du monde)
    zoom: 2, // Niveau de zoom initial
    marker: null, // Pas de marqueur initialement
  });

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
              {pandemics.length > 0 ? (
                pandemics.map((pandemie) => (
                  <SelectItem key={pandemie.id} value={pandemie.id}>
                    {pandemie.name}
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
            {/* Bouton pour ouvrir la modale */}

            {/* Bouton pour exporter les données */}
            <Button variant="outline">Exporter les données</Button>
          </div>
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
            <InteractiveMap
              localisations={localisations}
              mapData={mapData} // Passez les données de la carte
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
