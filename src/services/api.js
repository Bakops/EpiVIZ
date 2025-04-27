import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
});

export const getPandemics = async () => {
  try {
    const response = await api.get("/pandemie");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des pandémies :", error);
    return [];
  }
};

export const getAllLocations = async () => {
  try {
    const response = await api.get("/location");
    let data = response.data;

    // Si la réponse est une chaîne, essayez de la parser
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error("Impossible de parser les données de localisation:", e);
        return []; // Retourner un tableau vide en cas d'erreur
      }
    }

    // Assurez-vous que data est un tableau
    if (!Array.isArray(data)) {
      console.error(
        "Les données de localisation ne sont pas un tableau:",
        data
      );

      // Si data est un objet, essayez d'extraire un tableau
      if (data && typeof data === "object") {
        // Essayez différentes propriétés qui pourraient contenir un tableau
        if (Array.isArray(data.content)) return data.content;
        if (Array.isArray(data.locations)) return data.locations;
        if (Array.isArray(data.items)) return data.items;

        // Dernier recours: convertir l'objet en tableau
        return Object.values(data).filter(
          (item) => item && typeof item === "object"
        );
      }

      return []; // Retourner un tableau vide en cas d'échec
    }

    // Simplifier la structure des données pour éviter les références circulaires
    return data.map((location) => ({
      id: location.id,
      country: location.country || location.nom,
      continent: location.continent,
      latitude: location.latitude,
      longitude: location.longitude,
      // Ne pas inclure les propriétés qui créent des références circulaires
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des localisations :", error);
    return []; // Retourner un tableau vide en cas d'erreur
  }
};

export const getAllData = async () => {
  try {
    const response = await api.get("/data");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return [];
  }
};

export const getGlobalData = async (pandemicId) => {
  try {
    const response = await api.get("/data");
    const allData = Array.isArray(response.data) ? response.data : [];
    console.log("Données brutes reçues :", allData);

    const pandemicData = allData.filter(
      (item) => item && item.idPandemic === Number(pandemicId)
    );
    console.log("Données filtrées par pandémie :", pandemicData);

    const totalCases = pandemicData.reduce(
      (sum, item) => sum + (item.totalCases || 0),
      0
    );
    const totalDeaths = pandemicData.reduce(
      (sum, item) => sum + (item.totalDeaths || 0),
      0
    );
    const newCases = pandemicData.reduce(
      (sum, item) => sum + (item.newCases || 0),
      0
    );
    const newDeaths = pandemicData.reduce(
      (sum, item) => sum + (item.newDeaths || 0),
      0
    );

    const timelineMap = new Map();
    pandemicData.forEach((item) => {
      if (!item || !item.dateValue) return;
      const dateValue = item.dateValue;
      if (!timelineMap.has(dateValue)) {
        timelineMap.set(dateValue, {
          date_value: dateValue,
          cas_confirmes: 0,
          deces: 0,
          new_cases: 0,
          new_deaths: 0,
          idCalendar: 0,
        });
      }
      const dayData = timelineMap.get(dateValue);

      dayData.cas_confirmes += item.totalCases || 0;
      dayData.deces += item.totalDeaths || 0;
      dayData.new_cases += item.newCases || 0;
      dayData.new_deaths += item.newDeaths || 0;
      dayData.idCalendar = item.idCalendar || 0;
    });

    const timeline = Array.from(timelineMap.values());
    console.log("Données de la timeline :", timeline);

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
    return {
      cas_confirmes: 0,
      deces: 0,
      new_cases: 0,
      new_deaths: 0,
      timeline: [],
    };
  }
};

export const getLocationData = async (locationId, pandemicId) => {
  try {
    console.log(
      `Appel API pour localisation ${locationId} et pandémie ${pandemicId}`
    );
    const response = await api.get(`/data`);
    const allData = Array.isArray(response.data) ? response.data : [];
    console.log(allData)
    const filteredData = allData.filter(
      (item) =>
        item &&
        item.idPandemic === Number(pandemicId) &&
        item.idLocation === Number(locationId)
    );

    console.log("Données filtrées par localisation:", filteredData);

    return {
      cas_confirmes: filteredData.reduce(
        (sum, item) => sum + (item.totalCases || 0),
        0
      ),
      deces: filteredData.reduce(
        (sum, item) => sum + (item.totalDeaths || 0),
        0
      ),
      new_cases: filteredData.reduce(
        (sum, item) => sum + (item.newCases || 0),
        0
      ),
      new_deaths: filteredData.reduce(
        (sum, item) => sum + (item.newDeaths || 0),
        0
      ),
      timeline: filteredData,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données de localisation:",
      error
    );
    return {
      cas_confirmes: 0,
      deces: 0,
      new_cases: 0,
      new_deaths: 0,
      timeline: [],
    };
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
