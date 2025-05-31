import axios from "axios";
import { Calendrier } from "../types/calendrier";
import { Localisation } from "../types/localisation";
import { Pandemie } from "../types/pandemie";

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

    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error("Impossible de parser les données de localisation:", e);
        return [];
      }
    }

    if (!Array.isArray(data)) {
      console.error(
        "Les données de localisation ne sont pas un tableau:",
        data
      );

      if (data && typeof data === "object") {
        if (Array.isArray(data.content)) return data.content;
        if (Array.isArray(data.locations)) return data.locations;
        if (Array.isArray(data.items)) return data.items;

        return Object.values(data).filter(
          (item) => item && typeof item === "object"
        );
      }

      return [];
    }

    return data.map((location) => ({
      id: location.id,
      country: location.country || location.nom,
      continent: location.continent,
      latitude: location.latitude,
      longitude: location.longitude,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des localisations :", error);
    return [];
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

export const getGlobalData = async (pandemicId: string) => {
  try {
    const response = await api.get("/data");
    const allData = Array.isArray(response.data) ? response.data : [];

    const pandemicData = allData.filter(
      (item) => item && item.idPandemic === Number(pandemicId)
    );

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
          dateValue: dateValue,
          totalCases: 0,
          totalDeaths: 0,
          newCases: 0,
          newDeaths: 0,
          idCalendar: 0,
        });
      }
      const dayData = timelineMap.get(dateValue);

      dayData.totalCases += item.totalCases || 0;
      dayData.totalDeaths += item.totalDeaths || 0;
      dayData.newCases += item.newCases || 0;
      dayData.newDeaths += item.newDeaths || 0;
      dayData.idCalendar = item.idCalendar || 0;
    });

    const timeline = Array.from(timelineMap.values());

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

export const getLocationData = async (
  locationId?: string,
  pandemicId?: string
) => {
  try {
    const response = await api.get(`/data`);

    let filteredData = Array.isArray(response.data) ? response.data : [];

    if (locationId) {
      filteredData = filteredData.filter(
        (item) => item.idLocation === Number(locationId)
      );
    }

    if (pandemicId) {
      filteredData = filteredData.filter(
        (item) => item.idPandemic === Number(pandemicId)
      );
    }

    return {
      cas_confirmes: filteredData.reduce(
        (sum, item) => sum + (item?.totalCases ?? 0),
        0
      ),
      deces: filteredData.reduce(
        (sum, item) => sum + (item?.totalDeaths ?? 0),
        0
      ),
      new_cases: filteredData.reduce(
        (sum, item) => sum + (item?.newCases ?? 0),
        0
      ),
      new_deaths: filteredData.reduce(
        (sum, item) => sum + (item?.newDeaths ?? 0),
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

export const createData = async (data: Record<string, any>) => {
  try {
    const response = await api.post("/data", data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création des données :", error);
    throw error;
  }
};

export const exportPandemicData = async (pandemicId: number) => {
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

export const createLocalisation = async (localisation: Localisation) => {
  const response = await fetch("http://localhost:8081/api/location", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(localisation),
  });
  return response.json();
};

export const createPandemie = async (pandemie: Pandemie) => {
  const response = await fetch("http://localhost:8081/api/pandemie", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pandemie),
  });
  return response.json();
};

export const createCalendrier = async (calendrier: Calendrier) => {
  const response = await fetch("http://localhost:8081/api/calendrier", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(calendrier),
  });
  return response.json();
};

export const deleteData = async (id: number) => {
  try {
    await api.delete(`/api/data/${id}`);
  } catch (error) {
    throw error;
  }
};

export const updateData = async (id: number, data: any) => {
  try {
    const response = await api.put(`/api/data/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteLocalisation = async (id: number) => {
  try {
    await api.delete(`/api/location/${id}`);
  } catch (error) {
    throw error;
  }
};

export const updateLocalisation = async (id: number, data: any) => {
  try {
    const response = await api.put(`/api/location/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePandemie = async (id: number) => {
  try {
    await api.delete(`/api/pandemie/${id}`);
  } catch (error) {
    throw error;
  }
};

export const updatePandemie = async (id: number, data: any) => {
  try {
    const response = await api.put(`/api/pandemie/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
