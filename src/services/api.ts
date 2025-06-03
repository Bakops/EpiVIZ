import axios from "axios";
import { Localisation } from "../models/Localisation";
import { Pandemie } from "../models/Pandemie";
import { Calendrier } from "../models/Calendrier";

const api = axios.create({
  baseURL: "http://localhost:8081/api/v1",
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

export const getCalendars = async () => {
  try {
    const response = await api.get("/calendar");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des calendriers :", error);
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
    const [dataResponse, calendarResponse] = await Promise.all([
      api.get("/data"),
      api.get("/calendar"),
    ]);

    const allData = Array.isArray(dataResponse.data) ? dataResponse.data : [];
    const calendars = Array.isArray(calendarResponse.data) ? calendarResponse.data : [];

    // Convertir les calendriers en Map pour accès rapide par id_calendar
    const calendarMap = new Map(
      calendars.map((cal) => [cal.id, cal.date_value ?? ""]));
    console.log("Calendars Map :", calendarMap);

    const mappedData = allData.map((item) => ({
      ...item,
      totalCases: item.totalCases ?? item.total_cases ?? 0,
      totalDeaths: item.totalDeaths ?? item.total_deaths ?? 0,
      newCases: item.newCases ?? item.new_cases ?? 0,
      newDeaths: item.newDeaths ?? item.new_deaths ?? 0,
      idPandemic: item.idPandemic ?? item.id_pandemie ?? 0,
      idLocation: item.idLocation ?? item.id_location ?? 0,
      idCalendar: item.idCalendar ?? item.id_calendar ?? 0,
      dateValue: calendarMap.get(item.idCalendar ?? item.id_calendar) ?? "",
    }));

    const pandemicData = mappedData.filter(
      (item) => item && item.idPandemic === Number(pandemicId)
    );



    const totalCases = pandemicData.reduce(
      (sum, item) => sum + (item.totalCases || 0),
      0
    );
    console.log("TotalCases :", totalCases);
    const totalDeaths = pandemicData.reduce(
      (sum, item) => sum + (item.totalDeaths || 0),
      0
    );
    console.log("TotalDeaths :", totalDeaths);

    const newCases = pandemicData.reduce(
      (sum, item) => sum + (item.newCases || 0),
      0
    );
    console.log("NewCases :", newCases);
    const newDeaths = pandemicData.reduce(
      (sum, item) => sum + (item.newDeaths || 0),
      0
    );
    console.log("NewDeaths :", newDeaths);

    const timelineMap = new Map();
    pandemicData.forEach((item) => {
      if (!item || !item.dateValue) return;
      const date = item.dateValue;
      if (!timelineMap.has(date)) {
        timelineMap.set(date, {
          dateValue: date,
          totalCases: 0,
          totalDeaths: 0,
          newCases: 0,
          newDeaths: 0,
          idCalendar: item.idCalendar,
        });
      }

      const dayData = timelineMap.get(date);

      dayData.totalCases += item.totalCases || 0;
      dayData.totalDeaths += item.totalDeaths || 0;
      dayData.newCases += item.newCases || 0;
      dayData.newDeaths += item.newDeaths || 0;
      dayData.idCalendar = item.idCalendar || 0;
    });
    console.log("TimelineMap :", timelineMap);

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
  if (!locationId || !pandemicId) {
    return {
      cas_confirmes: 0,
      deces: 0,
      new_cases: 0,
      new_deaths: 0,
      timeline: [],
    };
  }

  try {
    const [dataResponse, calendarResponse] = await Promise.all([
      api.get("/data", { params: { id_location: locationId, id_pandemie: pandemicId } }),
      api.get("/calendar"),
    ]);

    const allData = Array.isArray(dataResponse.data) ? dataResponse.data : [];
    const calendars = Array.isArray(calendarResponse.data) ? calendarResponse.data : [];

    const calendarMap = new Map(
      calendars.map((cal) => [cal.id, cal.date_value ?? ""])
    );

    const mappedData = allData.map((item) => ({
      ...item,
      totalCases: item.totalCases ?? item.total_cases ?? 0,
      totalDeaths: item.totalDeaths ?? item.total_deaths ?? 0,
      newCases: item.newCases ?? item.new_cases ?? 0,
      newDeaths: item.newDeaths ?? item.new_deaths ?? 0,
      idPandemic: item.idPandemic ?? item.id_pandemie ?? 0,
      idLocation: item.idLocation ?? item.id_location ?? 0,
      idCalendar: item.idCalendar ?? item.id_calendar ?? 0,
      dateValue: calendarMap.get(item.idCalendar ?? item.id_calendar) ?? "",
    }));

    // On filtre si besoin (au cas où API ne filtre pas)
    const filteredData = mappedData.filter(
      (item) =>
        (!locationId || item.idLocation === Number(locationId)) &&
        (!pandemicId || item.idPandemic === Number(pandemicId))
    );

    // Construction timeline agrégée par date
    const timelineMap = new Map<string, {
      dateValue: string;
      totalCases: number;
      totalDeaths: number;
      newCases: number;
      newDeaths: number;
      idCalendar: number;
    }>();

    filteredData.forEach((item) => {
      if (!item.dateValue) return;

      if (!timelineMap.has(item.dateValue)) {
        timelineMap.set(item.dateValue, {
          dateValue: item.dateValue,
          totalCases: 0,
          totalDeaths: 0,
          newCases: 0,
          newDeaths: 0,
          idCalendar: item.idCalendar,
        });
      }

      const dayData = timelineMap.get(item.dateValue)!;
      dayData.totalCases += item.totalCases;
      dayData.totalDeaths += item.totalDeaths;
      dayData.newCases += item.newCases;
      dayData.newDeaths += item.newDeaths;
    });

    const timeline = Array.from(timelineMap.values());

    // Calculs globaux
    const cas_confirmes = filteredData.reduce((max, item) => Math.max(max, item.totalCases), 0);
    const deces = filteredData.reduce((max, item) => Math.max(max, item.totalDeaths), 0);
    const new_cases = filteredData.reduce((sum, item) => sum + item.newCases, 0);
    const new_deaths = filteredData.reduce((sum, item) => sum + item.newDeaths, 0);

    return {
      cas_confirmes,
      deces,
      new_cases,
      new_deaths,
      timeline,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des données de localisation :", error);
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
  const response = await fetch("http://localhost:8081/api/v1/location", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(localisation),
  });
  return response.json();
};

export const createPandemie = async (pandemie: Pandemie) => {
  const response = await fetch("http://localhost:8081/api/v1/pandemie", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pandemie),
  });
  return response.json();
};

export const createCalendrier = async (calendrier: Calendrier) => {
  const response = await fetch("http://localhost:8081/api/v1/calendrier", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(calendrier),
  });
  return response.json();
};

export const deleteData = async (id: number) => {
  try {
    await api.delete(`/api/v1/data/${id}`);
  } catch (error) {
    throw error;
  }
};

export const updateData = async (id: number, data: any) => {
  try {
    const response = await api.put(`/api/v1/data/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteLocalisation = async (id: number) => {
  try {
    await api.delete(`/api/v1/location/${id}`);
  } catch (error) {
    throw error;
  }
};

export const updateLocalisation = async (id: number, data: any) => {
  try {
    const response = await api.put(`/api/v1/location/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePandemie = async (id: number) => {
  try {
    await api.delete(`/api/v1/pandemie/${id}`);
  } catch (error) {
    throw error;
  }
};

export const updatePandemie = async (id: number, data: any) => {
  try {
    const response = await api.put(`/api/v1/pandemie/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
