import { NextResponse } from "next/server"

// Données simulées pour l'API
const pandemics = {
  covid19: {
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
    origin: {
      location: "Wuhan, Chine",
      date: "Décembre 2019",
      details: "Premiers cas liés au marché de fruits de mer de Huanan",
    },
    timeline: [
      { date: "31 déc. 2019", event: "Premiers cas de pneumonie d'origine inconnue signalés à Wuhan, Chine" },
      { date: "7 jan. 2020", event: "Identification du nouveau coronavirus (SARS-CoV-2)" },
      { date: "13 jan. 2020", event: "Premier cas confirmé hors de Chine (Thaïlande)" },
      { date: "23 jan. 2020", event: "Confinement de Wuhan et d'autres villes chinoises" },
      { date: "30 jan. 2020", event: "L'OMS déclare une urgence de santé publique de portée internationale" },
      { date: "11 fév. 2020", event: "L'OMS nomme la maladie COVID-19" },
      { date: "11 mars 2020", event: "L'OMS déclare une pandémie mondiale" },
    ],
    controlMeasures: [
      "Vaccination",
      "Distanciation sociale",
      "Port du masque",
      "Confinements",
      "Traçage des contacts",
      "Restrictions de voyage",
    ],
  },
  spanish_flu: {
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
    origin: {
      location: "Incertain (États-Unis, Europe ou Chine)",
      date: "Mars 1918",
      details: "Premiers cas documentés au Kansas, États-Unis",
    },
    timeline: [
      { date: "Mars 1918", event: "Premiers cas signalés au Kansas, États-Unis" },
      { date: "Avril 1918", event: "Propagation en Europe via les troupes américaines" },
      { date: "Août 1918", event: "Début de la deuxième vague, beaucoup plus mortelle" },
      { date: "Sept-Nov 1918", event: "Pic de la pandémie, systèmes de santé débordés" },
      { date: "Déc. 1918", event: "Diminution des cas dans de nombreuses régions" },
      { date: "Jan-Fév 1919", event: "Troisième vague dans certaines régions" },
    ],
    controlMeasures: [
      "Fermeture des lieux publics",
      "Interdiction des rassemblements",
      "Port du masque",
      "Quarantaine",
      "Amélioration de l'hygiène",
    ],
  },
  black_death: {
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
    origin: {
      location: "Asie centrale",
      date: "1346",
      details: "Propagée le long des routes commerciales via les puces des rats",
    },
    timeline: [
      { date: "1346", event: "Apparition en Asie centrale" },
      { date: "Oct. 1347", event: "Arrivée à Messine, Sicile, via des navires marchands" },
      { date: "Jan. 1348", event: "Propagation en Italie et en France" },
      { date: "Juin 1348", event: "Atteint l'Angleterre" },
      { date: "1349", event: "Propagation en Europe du Nord" },
    ],
    controlMeasures: [
      "Quarantaine (40 jours)",
      "Isolement des malades",
      "Contrôle des ports",
      "Incinération des corps",
      "Abandon des zones touchées",
    ],
  },
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!pandemics[id]) {
    return NextResponse.json({ error: "Pandémie non trouvée" }, { status: 404 })
  }

  return NextResponse.json(pandemics[id])
}

