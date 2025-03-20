import type { DataSource } from "./db"

/**
 * Sources de données recommandées pour la plateforme
 */
export const recommendedDataSources: DataSource[] = [
  {
    id: "who_dashboard",
    name: "WHO COVID-19 Dashboard",
    type: "API",
    url: "https://covid19.who.int/data",
    description:
      "Données officielles de l'OMS sur la COVID-19, incluant les cas, décès et vaccinations par pays et région.",
    format: "JSON, CSV",
    lastUpdated: "2023-05-10",
    coverage: {
      temporal: "2019-2023",
      spatial: "Mondial",
    },
  },
  {
    id: "our_world_in_data",
    name: "Our World in Data",
    type: "API",
    url: "https://github.com/owid/covid-19-data/tree/master/public/data",
    description:
      "Ensemble complet de données sur la COVID-19 et d'autres pandémies, avec des visualisations et analyses.",
    format: "CSV, JSON",
    lastUpdated: "2023-05-15",
    coverage: {
      temporal: "1900-2023",
      spatial: "Mondial",
    },
  },
  {
    id: "ecdc_data",
    name: "European Centre for Disease Prevention and Control",
    type: "API",
    url: "https://www.ecdc.europa.eu/en/covid-19/data",
    description: "Données européennes sur les maladies infectieuses, avec un focus sur la surveillance et le contrôle.",
    format: "JSON, CSV",
    lastUpdated: "2023-05-12",
    coverage: {
      temporal: "2019-2023",
      spatial: "Europe",
    },
  },
  {
    id: "cdc_data",
    name: "Centers for Disease Control and Prevention",
    type: "API",
    url: "https://data.cdc.gov/browse",
    description: "Données américaines sur les maladies infectieuses et la santé publique.",
    format: "JSON, CSV, XML",
    lastUpdated: "2023-05-14",
    coverage: {
      temporal: "1900-2023",
      spatial: "États-Unis",
    },
  },
  {
    id: "historical_archives",
    name: "Historical Pandemic Archives",
    type: "Database",
    url: "https://www.nlm.nih.gov/",
    description: "Archives historiques sur les pandémies passées, incluant des documents, rapports et statistiques.",
    format: "PDF, CSV, XML",
    lastUpdated: "2022-12-01",
    coverage: {
      temporal: "1300-2000",
      spatial: "Mondial",
    },
  },
]

/**
 * Justification du choix des sources de données
 */
export const dataSourceJustification = {
  who_dashboard: {
    strengths: [
      "Source officielle reconnue mondialement",
      "Données standardisées et vérifiées",
      "Couverture mondiale",
      "Mise à jour régulière",
      "Accès gratuit et ouvert",
    ],
    limitations: [
      "Délai dans la publication des données",
      "Dépendance aux rapports nationaux",
      "Granularité limitée (niveau national)",
    ],
    useCases: ["Analyse comparative entre pays", "Suivi des tendances mondiales", "Modélisation épidémiologique"],
  },
  our_world_in_data: {
    strengths: [
      "Combinaison de multiples sources fiables",
      "Données historiques étendues",
      "Visualisations prêtes à l'emploi",
      "Documentation détaillée des méthodologies",
      "Mise à jour quotidienne",
    ],
    limitations: [
      "Peut contenir des retards dans certaines régions",
      "Certaines séries de données historiques sont incomplètes",
      "Méthodologies variables selon les périodes",
    ],
    useCases: ["Analyse historique comparative", "Recherche académique", "Visualisation de tendances à long terme"],
  },
}

/**
 * Fonction pour récupérer les données d'une source spécifique
 * @param sourceId Identifiant de la source
 * @param params Paramètres de requête
 * @returns Données récupérées
 */
export async function fetchDataFromSource(sourceId: string, params: any = {}): Promise<any> {
  // Implémentation simulée
  // Dans une application réelle, cela ferait des appels API ou des requêtes à des bases de données

  console.log(`Récupération des données depuis ${sourceId} avec paramètres:`, params)

  // Simulation de délai réseau
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Retourne des données simulées
  return {
    source: sourceId,
    timestamp: new Date().toISOString(),
    data: [
      // Données simulées
      { date: "2020-01-01", cases: 100, deaths: 5 },
      { date: "2020-01-02", cases: 120, deaths: 7 },
      { date: "2020-01-03", cases: 150, deaths: 10 },
      // etc.
    ],
  }
}

/**
 * Fonction pour valider la qualité des données d'une source
 * @param data Données à valider
 * @returns Rapport de validation
 */
export function validateSourceData(data: any[]): { valid: boolean; issues: string[] } {
  const issues = []

  // Vérification des valeurs manquantes
  const missingValues = data.filter((item) =>
    Object.values(item).some((value) => value === null || value === undefined),
  )

  if (missingValues.length > 0) {
    issues.push(`${missingValues.length} entrées contiennent des valeurs manquantes`)
  }

  // Vérification des formats de date
  const invalidDates = data.filter((item) => item.date && isNaN(new Date(item.date).getTime()))

  if (invalidDates.length > 0) {
    issues.push(`${invalidDates.length} entrées contiennent des dates invalides`)
  }

  // Vérification des valeurs négatives pour les cas/décès
  const negativeValues = data.filter(
    (item) => (item.cases !== undefined && item.cases < 0) || (item.deaths !== undefined && item.deaths < 0),
  )

  if (negativeValues.length > 0) {
    issues.push(`${negativeValues.length} entrées contiennent des valeurs négatives`)
  }

  return {
    valid: issues.length === 0,
    issues,
  }
}

/**
 * Fonction pour combiner des données de plusieurs sources
 * @param dataSets Ensembles de données à combiner
 * @returns Données combinées
 */
export function combineDataSources(dataSets: any[][]): any[] {
  // Implémentation simulée
  // Dans une application réelle, cela nécessiterait une logique complexe de fusion et de résolution de conflits

  // Exemple simple: fusion par date
  const combinedData = {}

  dataSets.forEach((dataSet, sourceIndex) => {
    dataSet.forEach((item) => {
      if (!combinedData[item.date]) {
        combinedData[item.date] = {
          date: item.date,
          cases: 0,
          deaths: 0,
          sources: [],
        }
      }

      // Additionner les valeurs (approche simpliste)
      if (item.cases) combinedData[item.date].cases += item.cases
      if (item.deaths) combinedData[item.date].deaths += item.deaths

      // Garder une trace des sources
      combinedData[item.date].sources.push(sourceIndex)
    })
  })

  return Object.values(combinedData)
}

/**
 * Fonction pour documenter la provenance des données
 * @param data Données à documenter
 * @param sources Sources utilisées
 * @returns Données avec métadonnées de provenance
 */
export function addProvenanceMetadata(data: any[], sources: DataSource[]): any[] {
  return data.map((item) => ({
    ...item,
    metadata: {
      sources:
        item.sources?.map((sourceIndex) => ({
          id: sources[sourceIndex]?.id,
          name: sources[sourceIndex]?.name,
          url: sources[sourceIndex]?.url,
          retrievedAt: new Date().toISOString(),
        })) || [],
      processingSteps: [
        {
          type: "collection",
          timestamp: new Date().toISOString(),
          description: "Données collectées depuis les sources originales",
        },
        {
          type: "cleaning",
          timestamp: new Date().toISOString(),
          description: "Nettoyage et standardisation des données",
        },
        {
          type: "aggregation",
          timestamp: new Date().toISOString(),
          description: "Agrégation des données de plusieurs sources",
        },
      ],
    },
  }))
}

