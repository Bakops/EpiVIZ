export interface Prediction {
  date: string;
  new_cases: number;
  new_deaths: number;
  total_cases: number;
  total_deaths: number;
}

export async function getPredictions(countryId: number): Promise<Prediction[]> {
  const apiUrl = `https://db58-34-57-148-132.ngrok-free.app/predict?country=${countryId}`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const raw = await res.text();
    const data = JSON.parse(raw);

    if (!data.predictions || !Array.isArray(data.predictions)) {
      throw new Error("Format de réponse inattendu");
    }

    return data.predictions;
  } catch (error) {
    console.error("Erreur lors de la récupération des prédictions :", error);
    return [];
  }
}
