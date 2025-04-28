"use client";
import HeaderComponent from "@/components/layout/HeaderComponent";
import {
  createCalendrier,
  createData,
  createLocalisation,
  createPandemie,
  deleteData,
  getAllData,
  updateData,
} from "@/services/api";
import { Key, useEffect, useState } from "react";

interface Data {
  id?: Key | null | undefined;
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
  // État initial pour les données
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
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [dataList, setDataList] = useState<Data[]>([]);

  // Ajoutez ces états dans votre composant
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  // Handlers pour les soumissions de formulaires
  // Modifiez les handlers pour appeler les API
  const handleSubmitCalendrier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCalendrier(calendrier);
      setCalendrier({ date: "" });
      alert("Calendrier créé avec succès!");
    } catch (error) {
      console.error("Erreur lors de la création du calendrier:", error);
      alert("Erreur lors de la création du calendrier");
    }
  };

  const handleSubmitLocalisation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLocalisation(localisation);
      setLocalisation({ country: "", continent: "" });
      alert("Localisation créée avec succès!");
    } catch (error) {
      console.error("Erreur lors de la création de la localisation:", error);
      alert("Erreur lors de la création de la localisation");
    }
  };

  const handleSubmitPandemie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPandemie(pandemie);
      setPandemie({ type: "" });
      alert("Pandémie créée avec succès!");
    } catch (error) {
      console.error("Erreur lors de la création de la pandémie:", error);
      alert("Erreur lors de la création de la pandémie");
    }
  };

  // Charger les données existantes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllData();
        setDataList(response);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };
    fetchData();
  }, []);

  // Fonction de modification
  const handleEdit = async (id: number) => {
    try {
      if (editMode && selectedId) {
        await updateData(selectedId, data);
        setEditMode(false);
        setSelectedId(null);
        // Recharger les données
        const response = await getAllData();
        setDataList(response);
      } else {
        setEditMode(true);
        setSelectedId(id);
        // Charger les données à modifier
        const itemToEdit = dataList.find((item) => item.id === id);
        if (itemToEdit) {
          setData(itemToEdit);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      alert("Erreur lors de la modification");
    }
  };

  // Fonction de suppression
  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      try {
        await deleteData(id);
        const response = await getAllData();
        setDataList(response);
        alert("Élément supprimé avec succès!");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  // Fonction pour créer des données
  const handleSubmitData = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createData(data);
      setData({
        total_cases: 0,
        total_deaths: 0,
        new_cases: 0,
        new_deaths: 0,
        localisation: { id: 1 },
        pandemie: { id: 1 },
        calendrier: { id: 1 },
      });
      const response = await getAllData();
      setDataList(response);
      alert("Données créées avec succès!");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      alert("Erreur lors de la création des données");
    }
  };

  // Calculs pour la pagination
  const totalItems = dataList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = dataList.slice(startIndex, endIndex);

  // Traduisez les textes dans le JSX
  return (
    <>
      <HeaderComponent />
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-8">Administration</h1>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Données existantes</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm">{totalItems} données au total</span>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-blue-600"
              >
                {isExpanded ? "Réduire" : "Voir plus"}
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div
            className={`transition-all duration-300 ${
              isExpanded ? "max-h-[1000px]" : "max-h-[300px]"
            } overflow-hidden`}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded">
                <thead>
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Cas totaux</th>
                    <th className="px-4 py-2">Décès totaux</th>
                    <th className="px-4 py-2">Nouveaux cas</th>
                    <th className="px-4 py-2">Nouveaux décès</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.id}>
                      <td className="border px-4 py-2">{item.id}</td>
                      <td className="border px-4 py-2">{item.total_cases}</td>
                      <td className="border px-4 py-2">{item.total_deaths}</td>
                      <td className="border px-4 py-2">{item.new_cases}</td>
                      <td className="border px-4 py-2">{item.new_deaths}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() =>
                            typeof item.id === "number" && handleEdit(item.id)
                          }
                          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                        >
                          {editMode && selectedId === item.id
                            ? "Sauvegarder"
                            : "Modifier"}
                        </button>
                        <button
                          onClick={() =>
                            typeof item.id === "number" && handleDelete(item.id)
                          }
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border rounded px-2 py-1"
                >
                  <option value={5}>5 par page</option>
                  <option value={10}>10 par page</option>
                  <option value={20}>20 par page</option>
                </select>
                <span className="text-sm text-gray-600">
                  Affichage {startIndex + 1}-{Math.min(endIndex, totalItems)}{" "}
                  sur {totalItems}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Précédent
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaires existants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <form
            onSubmit={handleSubmitData}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4">Créer des données</h2>
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
                setData({
                  ...data,
                  localisation: { id: Number(e.target.value) },
                })
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
              Créer les données
            </button>
          </form>

          <form
            onSubmit={handleSubmitCalendrier}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4">Créer un calendrier</h2>
            <input
              type="date"
              value={calendrier.date}
              onChange={(e) => setCalendrier({ date: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Créer le calendrier
            </button>
          </form>

          <form
            onSubmit={handleSubmitLocalisation}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4">
              Créer une localisation
            </h2>
            <input
              type="text"
              value={localisation.country}
              onChange={(e) =>
                setLocalisation({ ...localisation, country: e.target.value })
              }
              placeholder="Pays"
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
              Créer la localisation
            </button>
          </form>

          <form
            onSubmit={handleSubmitPandemie}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4">Créer une pandémie</h2>
            <input
              type="text"
              value={pandemie.type}
              onChange={(e) => setPandemie({ type: e.target.value })}
              placeholder="Type de pandémie"
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Créer la pandémie
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
