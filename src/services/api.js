import axios from "axios";

// Configuration de l'URL de base pour l'API
const api = axios.create({
  baseURL: "http://localhost:8081/api",
});

export const getPandemics = async () => {
  try {
    const response = await api.get("/pandemie");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des pandémies :", error);
    throw error;
  }
};

export const getPandemicStats = async (pandemicId) => {
  const response = await api.get(`/pandemie/${pandemicId}/stats`);
  return response.data;
};

export const getPandemicTimeline = async (pandemicId) => {
  const response = await api.get(`/pandemie/${pandemicId}/timeline`);
  return response.data;
};

export const getPandemicMapData = async (pandemicId) => {
  const response = await api.get(`/pandemie/${pandemicId}/map`);
  return response.data;
};

export const createData = async (data) => {
  const response = await api.post("/data", data);
  return response.data;
};

export const createCalendrier = async (calendrier) => {
  const response = await api.post("/calendar", calendrier);
  return response.data;
};

export const createLocalisation = async (location) => {
  const response = await api.post("/location", location);
  return response.data;
};

export const createPandemie = async (pandemie) => {
  const response = await api.post("/pandemie", pandemie);
  return response.data;
};

export const exportPandemicData = async (pandemicId) => {
  const response = await api.get(`/pandemie/${pandemicId}/export`, {
    responseType: "blob",
  });
  return response.data;
};

export const getAllLocations = async () => {
  try {
    const response = await api.get("/location");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des localisations :", error);
    throw error;
  }
};

export async function getLocationData(locationId) {
  try {
    const response = await fetch(`/api/locations/${locationId}/data`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données de localisation:",
      error
    );
    throw error;
  }
}
