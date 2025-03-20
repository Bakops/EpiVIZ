export interface Pandemic {
  id: string
  name: string
  scientificName: string
  startYear: number
  endYear: number | null
  type: string
  agent: string
  totalCases: string
  totalDeaths: string
  mortalityRate: string
  transmissionRoute: string[]
  description: string
  origin?: {
    location: string
    date: string
    details: string
  }
  timeline?: {
    date: string
    event: string
  }[]
  controlMeasures?: string[]
}

export interface PandemicStats {
  global: {
    totalCases: string
    totalDeaths: string
    mortalityRate: string
    r0?: string
    peakDate?: string
    peakCases?: string
    vaccinationRate?: string
  }
  regions: {
    name: string
    totalCases?: string
    totalDeaths: string
    mortalityRate: string
    peakDate?: string
    vaccinationRate?: string
  }[]
  demographics?: {
    ageGroups?: {
      group: string
      mortalityRate: string
    }[]
    comorbidities?: {
      condition: string
      riskIncrease: string
    }[]
  }
}

export interface DataSource {
  id: string
  name: string
  type: string
  url: string
  description: string
  format: string
  lastUpdated: string
  coverage: {
    temporal: string
    spatial: string
  }
}

// Fonctions d'accès aux données simulées
export async function getAllPandemics(): Promise<Pandemic[]> {
  // Dans une implémentation réelle:
  // return prisma.pandemic.findMany()

  // Simulation de données
  return [
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
    // Autres pandémies...
  ]
}

export async function getPandemicById(id: string): Promise<Pandemic | null> {
  // Dans une implémentation réelle:
  // return prisma.pandemic.findUnique({ where: { id } })

  // Simulation
  const pandemics = await getAllPandemics()
  return pandemics.find((p) => p.id === id) || null
}

export async function getPandemicStats(id: string): Promise<PandemicStats | null> {
  // Dans une implémentation réelle:
  // return prisma.pandemicStats.findUnique({ where: { pandemicId: id } })

  // Simulation
  if (id === "covid19") {
    return {
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
        // Autres régions...
      ],
    }
  }

  return null
}

export async function getDataSources(): Promise<DataSource[]> {
  // Dans une implémentation réelle:
  // return prisma.dataSource.findMany()

  // Simulation
  return [
    {
      id: "who_dashboard",
      name: "WHO COVID-19 Dashboard",
      type: "API",
      url: "https://covid19.who.int/data",
      description: "Données officielles de l'OMS sur la COVID-19",
      format: "JSON, CSV",
      lastUpdated: "2023-05-10",
      coverage: {
        temporal: "2019-2023",
        spatial: "Mondial",
      },
    },
    {
      id: "ecdc_data",
      name: "European Centre for Disease Prevention and Control",
      type: "API",
      url: "https://www.ecdc.europa.eu/en/covid-19/data",
      description: "Données européennes sur les maladies infectieuses",
      format: "JSON, CSV",
      lastUpdated: "2023-05-12",
      coverage: {
        temporal: "2019-2023",
        spatial: "Europe",
      },
    },
    // Autres sources...
  ]
}

