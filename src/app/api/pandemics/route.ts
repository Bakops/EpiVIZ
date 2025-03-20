import { NextResponse } from "next/server"

// Données simulées pour l'API
const pandemics = [
  {
    id: "covid19",
    name: "COVID-19",
    scientificName: "SARS-CoV-2",
    startYear: 2019,
    endYear: 2023,
    type: "Viral",
    agent: "Coronavirus",
    totalCases: "768 millions",
    totalDeaths: "6.9 millions",
    mortalityRate: "0.9%",
    transmissionRoute: ["Respiratoire", "Contact"],
    description: "Pandémie mondiale causée par un nouveau coronavirus, provoquant une maladie respiratoire.",
  },
  {
    id: "spanish_flu",
    name: "Grippe espagnole",
    scientificName: "H1N1",
    startYear: 1918,
    endYear: 1920,
    type: "Viral",
    agent: "Virus de la grippe A",
    totalCases: "500 millions",
    totalDeaths: "50 millions",
    mortalityRate: "10%",
    transmissionRoute: ["Respiratoire"],
    description:
      "L'une des pandémies les plus meurtrières de l'histoire, survenue à la fin de la Première Guerre mondiale.",
  },
  {
    id: "black_death",
    name: "Peste noire",
    scientificName: "Yersinia pestis",
    startYear: 1347,
    endYear: 1351,
    type: "Bactérienne",
    agent: "Bactérie Yersinia pestis",
    totalCases: "Inconnu",
    totalDeaths: "75-200 millions",
    mortalityRate: "30-60%",
    transmissionRoute: ["Vectorielle (puces)", "Respiratoire"],
    description:
      "Pandémie dévastatrice qui a balayé l'Eurasie et l'Afrique du Nord, tuant jusqu'à 60% de la population européenne.",
  },
  {
    id: "sars",
    name: "SRAS",
    scientificName: "SARS-CoV",
    startYear: 2002,
    endYear: 2004,
    type: "Viral",
    agent: "Coronavirus",
    totalCases: "8,098",
    totalDeaths: "774",
    mortalityRate: "9.6%",
    transmissionRoute: ["Respiratoire", "Contact"],
    description: "Épidémie de syndrome respiratoire aigu sévère qui a commencé en Chine et s'est propagée à 29 pays.",
  },
  {
    id: "h1n1_2009",
    name: "Grippe porcine",
    scientificName: "H1N1pdm09",
    startYear: 2009,
    endYear: 2010,
    type: "Viral",
    agent: "Virus de la grippe A",
    totalCases: "700 millions - 1.4 milliard",
    totalDeaths: "150,000 - 575,000",
    mortalityRate: "0.01-0.08%",
    transmissionRoute: ["Respiratoire"],
    description: "Pandémie mondiale causée par une nouvelle souche du virus H1N1 qui a émergé au Mexique.",
  },
]

export async function GET() {
  return NextResponse.json(pandemics)
}

