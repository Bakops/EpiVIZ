import { NextResponse } from "next/server"

// Données simulées pour l'API
const regionPandemics = {
  europe: [
    {
      id: "covid19",
      name: "COVID-19",
      period: "2019-2023",
      totalCases: "240 millions",
      totalDeaths: "2.1 millions",
      mortalityRate: "0.9%",
    },
    {
      id: "spanish_flu",
      name: "Grippe espagnole",
      period: "1918-1920",
      totalCases: "125 millions",
      totalDeaths: "12.5 millions",
      mortalityRate: "10%",
    },
    {
      id: "black_death",
      name: "Peste noire",
      period: "1347-1351",
      totalCases: "Inconnu",
      totalDeaths: "20-30 millions",
      mortalityRate: "30-60%",
    },
  ],
  asia: [
    {
      id: "covid19",
      name: "COVID-19",
      period: "2019-2023",
      totalCases: "300 millions",
      totalDeaths: "2.7 millions",
      mortalityRate: "0.9%",
    },
    {
      id: "spanish_flu",
      name: "Grippe espagnole",
      period: "1918-1920",
      totalCases: "200 millions",
      totalDeaths: "20 millions",
      mortalityRate: "10%",
    },
    {
      id: "black_death",
      name: "Peste noire",
      period: "1347-1351",
      totalCases: "Inconnu",
      totalDeaths: "40-60 millions",
      mortalityRate: "30-50%",
    },
    {
      id: "sars",
      name: "SRAS",
      period: "2002-2004",
      totalCases: "5,000+",
      totalDeaths: "500+",
      mortalityRate: "10%",
    },
  ],
  americas: [
    {
      id: "covid19",
      name: "COVID-19",
      period: "2019-2023",
      totalCases: "190 millions",
      totalDeaths: "1.7 millions",
      mortalityRate: "0.9%",
    },
    {
      id: "spanish_flu",
      name: "Grippe espagnole",
      period: "1918-1920",
      totalCases: "150 millions",
      totalDeaths: "15 millions",
      mortalityRate: "10%",
    },
    {
      id: "h1n1_2009",
      name: "Grippe porcine",
      period: "2009-2010",
      totalCases: "100 millions+",
      totalDeaths: "100,000+",
      mortalityRate: "0.1%",
    },
  ],
  africa: [
    {
      id: "covid19",
      name: "COVID-19",
      period: "2019-2023",
      totalCases: "25 millions",
      totalDeaths: "225,000",
      mortalityRate: "0.9%",
    },
    {
      id: "spanish_flu",
      name: "Grippe espagnole",
      period: "1918-1920",
      totalCases: "15 millions",
      totalDeaths: "1.5 millions",
      mortalityRate: "10%",
    },
    {
      id: "black_death",
      name: "Peste noire",
      period: "1347-1351",
      totalCases: "Inconnu",
      totalDeaths: "8-10 millions",
      mortalityRate: "30-40%",
    },
  ],
  oceania: [
    {
      id: "covid19",
      name: "COVID-19",
      period: "2019-2023",
      totalCases: "13 millions",
      totalDeaths: "117,000",
      mortalityRate: "0.9%",
    },
    {
      id: "spanish_flu",
      name: "Grippe espagnole",
      period: "1918-1920",
      totalCases: "10 millions",
      totalDeaths: "1 million",
      mortalityRate: "10%",
    },
    {
      id: "h1n1_2009",
      name: "Grippe porcine",
      period: "2009-2010",
      totalCases: "500,000+",
      totalDeaths: "1,500+",
      mortalityRate: "0.3%",
    },
  ],
}

export async function GET(request: Request, { params }: { params: { region: string } }) {
  const region = params.region.toLowerCase()

  if (!regionPandemics[region]) {
    return NextResponse.json({ error: "Région non trouvée" }, { status: 404 })
  }

  return NextResponse.json(regionPandemics[region])
}

