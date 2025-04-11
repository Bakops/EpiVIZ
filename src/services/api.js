import axios from "axios";

// Configuration de l'URL de base pour l'API
const api = axios.create({
  baseURL: "http://localhost:8081/api",
});

export const getPandemics = async () => {
  try {
    const response = await api.get("/pandemie"); // Appel à l'endpoint backend
    return response.data; // Retourne les données des pandémies
  } catch (error) {
    console.error("Erreur lors de la récupération des pandémies :", error);
    throw error;
  }
};

// Récupérer les statistiques d'une pandémie
export const getPandemicStats = async (pandemicId) => {
  const response = await api.get(`/pandemie/${pandemicId}/stats`);
  return response.data;
};

// Récupérer la timeline d'une pandémie
export const getPandemicTimeline = async (pandemicId) => {
  const response = await api.get(`/pandemie/${pandemicId}/timeline`);
  return response.data;
};

// Récupérer les données de la carte pour une pandémie
export const getPandemicMapData = async (pandemicId) => {
  const response = await api.get(`/pandemie/${pandemicId}/map`);
  return response.data;
};

// Créer une nouvelle donnée
export const createData = async (data) => {
  const response = await api.post("/data", data);
  return response.data;
};

// Créer un calendrier
export const createCalendrier = async (calendrier) => {
  const response = await api.post("/calendar", calendrier);
  return response.data;
};

// Créer une localisation
export const createLocalisation = async (location) => {
  const response = await api.post("/location", location);
  return response.data;
};

// Créer une pandémie
export const createPandemie = async (pandemie) => {
  const response = await api.post("/pandemie", pandemie);
  return response.data;
};

// Exporter les données d'une pandémie
export const exportPandemicData = async (pandemicId) => {
  const response = await api.get(`/pandemie/${pandemicId}/export`, {
    responseType: "blob", // Pour gérer les fichiers
  });
  return response.data;
};

export const getAllLocations = async () => {
  try {
    const response = await api.get("/location"); // Appel à l'endpoint Spring
    return response.data; // Retourne les données des localisations
  } catch (error) {
    console.error("Erreur lors de la récupération des localisations :", error);
    throw error;
  }
};
