import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
});

export async function getPandemics() {
  try {
    const response = await api.get("/pandemies"); // Appel à l'API
    const data = response.data; // Récupération des données
    const transformedData = data.map((pandemic) => ({
      id: pandemic.id,
      name: pandemic.type || "Nom non disponible", // Utilise le champ `type` comme nom
    }));
    return transformedData; // Retourne les données transformées
  } catch (error) {
    console.error("Erreur lors de la récupération des pandémies :", error);
    throw error;
  }
}

export const getPandemicStats = async (pandemicId) => {
  const response = await api.get(`/pandemies/${pandemicId}/stats`);
  return response.data;
};

export const getPandemicTimeline = async (pandemicId) => {
  const response = await api.get(`/pandemies/${pandemicId}/timeline`);
  return response.data;
};

export const getPandemicMapData = async (pandemicId) => {
  const response = await api.get(`/pandemies/${pandemicId}/map`);
  return response.data;
};

export const createData = async (data) => {
  const response = await api.post("/data", data);
  return response.data;
};

export const createCalendrier = async (calendrier) => {
  const response = await api.post("/calendriers", calendrier);
  return response.data;
};

export const createLocalisation = async (localisation) => {
  const response = await api.post("/localisations", localisation);
  return response.data;
};

export const createPandemie = async (pandemie) => {
  const response = await api.post("/pandemies", pandemie);
  return response.data;
};

export const exportPandemicData = async (pandemicId) => {
  const response = await api.get(`/pandemies/${pandemicId}/export`, {
    responseType: "blob", // Pour gérer les fichiers
  });
  return response.data;
};
