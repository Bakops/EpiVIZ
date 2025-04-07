"use client";

import {
  createCalendrier,
  createData,
  createLocalisation,
  createPandemie,
} from "@/services/api";
import { useState } from "react";

interface Data {
  total_cases: number;
  total_deaths: number;
  new_cases: number;
  new_deaths: number;
  localisation: { id: number };
  pandemie: { id: number };
  calendrier: { id: number };
}

interface Calendrier {
  date: string;
}

interface Localisation {
  country: string;
  continent: string;
}

interface Pandemie {
  type: string;
}

export default function AdminPage() {
  const [data, setData] = useState<Data>({
    total_cases: 0,
    total_deaths: 0,
    new_cases: 0,
    new_deaths: 0,
    localisation: { id: 1 },
    pandemie: { id: 1 },
    calendrier: { id: 1 },
  });

  const [calendrier, setCalendrier] = useState<Calendrier>({ date: "" });
  const [localisation, setLocalisation] = useState<Localisation>({
    country: "",
    continent: "",
  });
  const [pandemie, setPandemie] = useState<Pandemie>({ type: "" });

  const handleSubmitData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await createData(data);
      console.log("Data created:", response);
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  const handleSubmitCalendrier = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      const response = await createCalendrier(calendrier);
      console.log("Calendrier created:", response);
    } catch (error) {
      console.error("Error creating calendrier:", error);
    }
  };

  const handleSubmitLocalisation = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      const response = await createLocalisation(localisation);
      console.log("Localisation created:", response);
    } catch (error) {
      console.error("Error creating localisation:", error);
    }
  };

  const handleSubmitPandemie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await createPandemie(pandemie);
      console.log("Pandemie created:", response);
    } catch (error) {
      console.error("Error creating pandemie:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <form
          onSubmit={handleSubmitData}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4">Create Data</h2>
          <input
            type="number"
            value={data.total_cases}
            onChange={(e) =>
              setData({ ...data, total_cases: Number(e.target.value) })
            }
            placeholder="Total Cases"
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="number"
            value={data.total_deaths}
            onChange={(e) =>
              setData({ ...data, total_deaths: Number(e.target.value) })
            }
            placeholder="Total Deaths"
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="number"
            value={data.new_cases}
            onChange={(e) =>
              setData({ ...data, new_cases: Number(e.target.value) })
            }
            placeholder="New Cases"
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="number"
            value={data.new_deaths}
            onChange={(e) =>
              setData({ ...data, new_deaths: Number(e.target.value) })
            }
            placeholder="New Deaths"
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="number"
            value={data.localisation.id}
            onChange={(e) =>
              setData({ ...data, localisation: { id: Number(e.target.value) } })
            }
            placeholder="Localisation ID"
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="number"
            value={data.pandemie.id}
            onChange={(e) =>
              setData({ ...data, pandemie: { id: Number(e.target.value) } })
            }
            placeholder="Pandemie ID"
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="number"
            value={data.calendrier.id}
            onChange={(e) =>
              setData({ ...data, calendrier: { id: Number(e.target.value) } })
            }
            placeholder="Calendrier ID"
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Create Data
          </button>
        </form>

        <form
          onSubmit={handleSubmitCalendrier}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4">Create Calendrier</h2>
          <input
            type="text"
            value={calendrier.date}
            onChange={(e) => setCalendrier({ date: e.target.value })}
            placeholder="Date"
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Create Calendrier
          </button>
        </form>

        <form
          onSubmit={handleSubmitLocalisation}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4">Create Localisation</h2>
          <input
            type="text"
            value={localisation.country}
            onChange={(e) =>
              setLocalisation({ ...localisation, country: e.target.value })
            }
            placeholder="Country"
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="text"
            value={localisation.continent}
            onChange={(e) =>
              setLocalisation({ ...localisation, continent: e.target.value })
            }
            placeholder="Continent"
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Create Localisation
          </button>
        </form>

        <form
          onSubmit={handleSubmitPandemie}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4">Create Pandemie</h2>
          <input
            type="text"
            value={pandemie.type}
            onChange={(e) => setPandemie({ type: e.target.value })}
            placeholder="Type"
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Create Pandemie
          </button>
        </form>
      </div>
    </div>
  );
}
