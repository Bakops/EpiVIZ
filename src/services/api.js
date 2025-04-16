import axios from "axios";

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

export const getAllLocations = async () => {
  try {
    const response = await api.get("/location");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des localisations :", error);
    throw error;
  }
};

export const getAllData = async () => {
  try {
    const response = await api.get("/data");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    throw error;
  }
};

export const getGlobalData = async (pandemicId) => {
  try {
    const response = await api.get("/data");
    const allData = response.data;

    const pandemicData = allData.filter(
      (item) => item.pandemie.id === pandemicId
    );

    const totalCases = pandemicData.reduce(
      (sum, item) => sum + item.totalCases,
      0
    );
    const totalDeaths = pandemicData.reduce(
      (sum, item) => sum + item.totalDeaths,
      0
    );
    const newCases = pandemicData.reduce((sum, item) => sum + item.newCases, 0);
    const newDeaths = pandemicData.reduce(
      (sum, item) => sum + item.newDeaths,
      0
    );

    const timelineMap = new Map();

    pandemicData.forEach((item) => {
      const date = item.calendrier.date;

      if (!timelineMap.has(date)) {
        timelineMap.set(date, {
          date,
          cas_confirmes: 0,
          deces: 0,
          new_cases: 0,
          new_deaths: 0,
        });
      }

      const dayData = timelineMap.get(date);
      dayData.cas_confirmes += item.totalCases;
      dayData.deces += item.totalDeaths;
      dayData.new_cases += item.newCases;
      dayData.new_deaths += item.newDeaths;
    });

    const timeline = Array.from(timelineMap.values()).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    return {
      cas_confirmes: totalCases,
      deces: totalDeaths,
      new_cases: newCases,
      new_deaths: newDeaths,
      timeline,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données globales :",
      error
    );
    throw error;
  }
};

export const getLocationData = async (locationId, pandemicId) => {
  try {
    const response = await api.get("/data");
    const allData = response.data;

    const locationData = allData.filter(
      (item) =>
        item.localisation.id === locationId &&
        (pandemicId ? item.pandemie.id === pandemicId : true)
    );

    const totalCases = locationData.reduce(
      (sum, item) => sum + item.totalCases,
      0
    );
    const totalDeaths = locationData.reduce(
      (sum, item) => sum + item.totalDeaths,
      0
    );
    const newCases = locationData.reduce((sum, item) => sum + item.newCases, 0);
    const newDeaths = locationData.reduce(
      (sum, item) => sum + item.newDeaths,
      0
    );

    const timelineMap = new Map();

    locationData.forEach((item) => {
      const date = item.calendrier.date;

      if (!timelineMap.has(date)) {
        timelineMap.set(date, {
          date,
          cas_confirmes: 0,
          deces: 0,
          new_cases: 0,
          new_deaths: 0,
        });
      }

      const dayData = timelineMap.get(date);
      dayData.cas_confirmes += item.totalCases;
      dayData.deces += item.totalDeaths;
      dayData.new_cases += item.newCases;
      dayData.new_deaths += item.newDeaths;
    });

    const timeline = Array.from(timelineMap.values()).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    return {
      cas_confirmes: totalCases,
      deces: totalDeaths,
      new_cases: newCases,
      new_deaths: newDeaths,
      timeline,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données de localisation :",
      error
    );
    throw error;
  }
};

export const createData = async (data) => {
  try {
    const response = await api.post("/data", data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création des données :", error);
    throw error;
  }
};

export const exportPandemicData = async (pandemicId) => {
  try {
    const response = await api.get(`/pandemie/${pandemicId}/export`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'exportation des données :", error);
    throw error;
  }
};
