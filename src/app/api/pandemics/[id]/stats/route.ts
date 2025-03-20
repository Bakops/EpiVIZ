import { NextResponse } from "next/server"

// Données simulées pour l'API
const pandemicStats = {
  covid19: {
    global: {
      totalCases: "768 millions",
      totalDeaths: "6.9 millions",
      mortalityRate: "0.9%",
      r0: "2.5 (varie selon les variants)",
      peakDate: "Janvier 2022",
      peakCases: "3.8 millions par jour",
      vaccinationRate: "70% (population mondiale avec au moins une dose)",
    },
    regions: [
      {
        name: "Europe",
        totalCases: "240 millions",
        totalDeaths: "2.1 millions",
        mortalityRate: "0.9%",
        peakDate: "Janvier 2022",
        vaccinationRate: "75%",
      },
      {
        name: "Amériques",
        totalCases: "190 millions",
        totalDeaths: "1.7 millions",
        mortalityRate: "0.9%",
        peakDate: "Janvier 2022",
        vaccinationRate: "72%",
      },
      {
        name: "Asie",
        totalCases: "300 millions",
        totalDeaths: "2.7 millions",
        mortalityRate: "0.9%",
        peakDate: "Mai 2021",
        vaccinationRate: "68%",
      },
      {
        name: "Afrique",
        totalCases: "25 millions",
        totalDeaths: "225,000",
        mortalityRate: "0.9%",
        peakDate: "Juillet 2021",
        vaccinationRate: "35%",
      },
      {
        name: "Océanie",
        totalCases: "13 millions",
        totalDeaths: "117,000",
        mortalityRate: "0.9%",
        peakDate: "Janvier 2022",
        vaccinationRate: "80%",
      },
    ],
    demographics: {
      ageGroups: [
        { group: "0-9", mortalityRate: "0.002%" },
        { group: "10-19", mortalityRate: "0.006%" },
        { group: "20-29", mortalityRate: "0.03%" },
        { group: "30-39", mortalityRate: "0.08%" },
        { group: "40-49", mortalityRate: "0.15%" },
        { group: "50-59", mortalityRate: "0.6%" },
        { group: "60-69", mortalityRate: "2.0%" },
        { group: "70-79", mortalityRate: "5.0%" },
        { group: "80+", mortalityRate: "15.0%" },
      ],
      comorbidities: [
        { condition: "Maladies cardiovasculaires", riskIncrease: "10.5%" },
        { condition: "Diabète", riskIncrease: "7.3%" },
        { condition: "Maladies respiratoires chroniques", riskIncrease: "6.3%" },
        { condition: "Hypertension", riskIncrease: "6.0%" },
        { condition: "Cancer", riskIncrease: "5.6%" },
      ],
    },
  },
  spanish_flu: {
    global: {
      totalCases: "500 millions",
      totalDeaths: "50 millions",
      mortalityRate: "10%",
      r0: "1.8",
      peakDate: "Octobre-Novembre 1918",
      peakCases: "Inconnu",
      vaccinationRate: "0% (pas de vaccin disponible)",
    },
    regions: [
      {
        name: "Europe",
        totalCases: "125 millions",
        totalDeaths: "12.5 millions",
        mortalityRate: "10%",
        peakDate: "Octobre 1918",
      },
      {
        name: "Amériques",
        totalCases: "150 millions",
        totalDeaths: "15 millions",
        mortalityRate: "10%",
        peakDate: "Octobre 1918",
      },
      {
        name: "Asie",
        totalCases: "200 millions",
        totalDeaths: "20 millions",
        mortalityRate: "10%",
        peakDate: "Novembre 1918",
      },
      {
        name: "Afrique",
        totalCases: "15 millions",
        totalDeaths: "1.5 millions",
        mortalityRate: "10%",
        peakDate: "Décembre 1918",
      },
      {
        name: "Océanie",
        totalCases: "10 millions",
        totalDeaths: "1 million",
        mortalityRate: "10%",
        peakDate: "Janvier 1919",
      },
    ],
    demographics: {
      ageGroups: [
        { group: "0-4", mortalityRate: "6.5%" },
        { group: "5-14", mortalityRate: "5.2%" },
        { group: "15-24", mortalityRate: "20.0%" },
        { group: "25-34", mortalityRate: "15.6%" },
        { group: "35-44", mortalityRate: "8.0%" },
        { group: "45+", mortalityRate: "6.0%" },
      ],
    },
  },
  black_death: {
    global: {
      totalCases: "Inconnu",
      totalDeaths: "75-200 millions",
      mortalityRate: "30-60%",
      peakDate: "1348-1349",
      peakCases: "Inconnu",
    },
    regions: [
      {
        name: "Europe",
        totalDeaths: "20-30 millions",
        mortalityRate: "30-60%",
        peakDate: "1348-1349",
      },
      {
        name: "Asie",
        totalDeaths: "40-60 millions",
        mortalityRate: "30-50%",
        peakDate: "1347-1348",
      },
      {
        name: "Afrique du Nord",
        totalDeaths: "8-10 millions",
        mortalityRate: "30-40%",
        peakDate: "1348-1349",
      },
    ],
  },
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!pandemicStats[id]) {
    return NextResponse.json({ error: "Statistiques non trouvées" }, { status: 404 })
  }

  return NextResponse.json(pandemicStats[id])
}

