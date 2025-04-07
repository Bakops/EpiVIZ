"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useEffect, useState } from "react";

interface PandemicMapProps {
  pandemic: string;
  timeframe: string;
}

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Replace with your actual API base URL
});

export const getPandemicMapData = async (
  pandemicId: string,
  timeframe: string
) => {
  const response = await api.get(
    `/pandemies/${pandemicId}/map?timeframe=${timeframe}`
  );
  return response.data;
};

export function PandemicMap({ pandemic, timeframe }: PandemicMapProps) {
  const [loading, setLoading] = useState(true);
  const [mapType, setMapType] = useState("spread");

  useEffect(() => {
    // Simuler le chargement des données
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [pandemic, timeframe]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs defaultValue="spread" onValueChange={setMapType}>
          <TabsList>
            <TabsTrigger value="spread">Propagation</TabsTrigger>
            <TabsTrigger value="intensity">Intensité</TabsTrigger>
            <TabsTrigger value="mortality">Mortalité</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select defaultValue="world">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Région" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="world">Monde</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
            <SelectItem value="asia">Asie</SelectItem>
            <SelectItem value="americas">Amériques du Nord</SelectItem>
            <SelectItem value="americas">Amériques du Sud</SelectItem>
            <SelectItem value="africa">Afrique</SelectItem>
            <SelectItem value="oceania">Océanie</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="h-[500px] w-full flex items-center justify-center bg-muted/20 rounded-lg">
          <div className="animate-pulse">Chargement de la carte...</div>
        </div>
      ) : (
        <div className="h-[500px] w-full bg-muted/20 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">
              Carte de{" "}
              {mapType === "spread"
                ? "propagation"
                : mapType === "intensity"
                ? "l'intensité"
                : "la mortalité"}{" "}
              pour {pandemic}
            </p>
            <p className="text-xs text-muted-foreground">
              Période: {timeframe}
            </p>
            <div className="mt-4 text-sm">
              [Ici s'afficherait une carte interactive montrant la propagation
              géographique]
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Origine géographique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {pandemic === "covid19"
                ? "Wuhan, Chine"
                : pandemic === "spanish_flu"
                ? "Incertain (Europe/Amérique)"
                : pandemic === "black_death"
                ? "Asie centrale"
                : "Foshan, Chine"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Premier cas documenté:{" "}
              {pandemic === "covid19"
                ? "Décembre 2019"
                : pandemic === "spanish_flu"
                ? "Mars 1918"
                : pandemic === "black_death"
                ? "1347"
                : "Novembre 2002"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Vitesse de propagation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {pandemic === "covid19"
                ? "Mondiale en 3 mois"
                : pandemic === "spanish_flu"
                ? "Mondiale en 6 mois"
                : pandemic === "black_death"
                ? "Europe en 4 ans"
                : "Internationale en 4 mois"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Facteur principal:{" "}
              {pandemic === "covid19"
                ? "Transport aérien"
                : pandemic === "spanish_flu"
                ? "Mouvements de troupes (WWI)"
                : pandemic === "black_death"
                ? "Routes commerciales"
                : "Voyages internationaux"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
