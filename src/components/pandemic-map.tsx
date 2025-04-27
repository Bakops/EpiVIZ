"use client";

import { getAllLocations, getLocationData } from "@/services/api";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

let L;
if (typeof window !== "undefined") {
  L = require("leaflet");
}

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

let customIcon: L.Icon | undefined;
if (typeof window !== "undefined" && L) {
  customIcon = new L.Icon({
    iconUrl: "/location.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: null,
  });
}

export default function PandemicMap({ 
  localisations, 
  selectedLocationId, 
  selectedPandemicId, 
  onLocationClick 
}) {
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<any>(null);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const data = await getAllLocations();
        setLocations(data);

        const locationData = await getLocationData(selectedLocationId, selectedPandemicId);
        setLocationData(locationData);

        console.log("Location data:", locationData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des localisations :",
          error
        );
      } finally {
        setLoading(false);
      }
    }
    fetchLocations();
  }, [selectedLocationId, selectedPandemicId]);

  const handleMarkerClick = async (location) => {
    try {
      onLocationClick(location.id);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de localisation:",
        error
      );
    }
  };

  return (
    <div className="space-y-4">
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

          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={customIcon}
              eventHandlers={{
                click: () => handleMarkerClick(location),
              }}
              opacity={selectedLocationId === location.id ? 1 : 0.5}
            >
              <Popup>
                <strong>{location.country}</strong>
                <br />
                {location.continent}
                <br />
                Cas confirmés: {locationData.new_cases}
                <br />
                Décès: {locationData.new_deaths}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
