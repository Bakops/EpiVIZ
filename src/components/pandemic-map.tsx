"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Charger React Leaflet uniquement côté client
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface PandemicMapProps {
  pandemic: string;
  timeframe: string;
  localisations: any[];
}

const api = axios.create({
  baseURL: "http://localhost:8080/api",
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

export default function PandemicMap({ pandemic, timeframe }: PandemicMapProps) {
  const [loading, setLoading] = useState(true);
  const [mapType, setMapType] = useState("spread");
  const [localisations, setLocalisations] = useState<any[]>([]);

  useEffect(() => {
    async function fetchLocalisations() {
      try {
        const data = await getPandemicMapData(pandemic, timeframe);
        setLocalisations(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des localisations :",
          error
        );
      } finally {
        setLoading(false);
      }
    }
    fetchLocalisations();
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
      </div>

      {loading ? (
        <div className="h-[500px] w-full flex items-center justify-center bg-muted/20 rounded-lg">
          <div className="animate-pulse">Chargement de la carte...</div>
        </div>
      ) : (
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {localisations.map((localisation) => (
            <Marker
              key={localisation.id}
              position={[localisation.latitude, localisation.longitude]}
            >
              <Popup>
                <strong>{localisation.country}</strong>
                <br />
                {localisation.continent}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
