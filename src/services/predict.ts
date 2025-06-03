export interface Prediction {
  date: string;
  new_cases: number;
  new_deaths: number;
  total_cases: number;
  total_deaths: number;
}

export async function getPredictions(countryId: number): Promise<Prediction[]> {
  const apiUrl = `https://0617-104-198-40-219.ngrok-free.app/predict?country=${countryId}`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!res.ok) {
      throw new Error(`Erreur HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (!data.predictions || !Array.isArray(data.predictions)) {
      throw new Error("Format de réponse inattendu depuis l'API");
    }

    return data.predictions;
  } catch (error) {
    console.error("Erreur lors de la récupération des prédictions :", error);
    return [];
  }
}
