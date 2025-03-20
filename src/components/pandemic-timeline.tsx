"use client"

import { useEffect, useState } from "react"

interface PandemicTimelineProps {
  pandemic: string
}

export function PandemicTimeline({ pandemic }: PandemicTimelineProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler le chargement des données
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [pandemic])

  // Données simulées pour la chronologie
  const timelineEvents = {
    covid19: [
      { date: "31 déc. 2019", event: "Premiers cas de pneumonie d'origine inconnue signalés à Wuhan, Chine" },
      { date: "7 jan. 2020", event: "Identification du nouveau coronavirus (SARS-CoV-2)" },
      { date: "13 jan. 2020", event: "Premier cas confirmé hors de Chine (Thaïlande)" },
      { date: "23 jan. 2020", event: "Confinement de Wuhan et d'autres villes chinoises" },
      { date: "30 jan. 2020", event: "L'OMS déclare une urgence de santé publique de portée internationale" },
      { date: "11 fév. 2020", event: "L'OMS nomme la maladie COVID-19" },
      { date: "11 mars 2020", event: "L'OMS déclare une pandémie mondiale" },
      { date: "Mars-Avril 2020", event: "Confinements dans de nombreux pays du monde" },
      { date: "Déc. 2020", event: "Début des campagnes de vaccination" },
      { date: "2021-2022", event: "Émergence de variants préoccupants (Alpha, Beta, Delta, Omicron)" },
      { date: "Mai 2023", event: "L'OMS déclare la fin de l'urgence de santé publique mondiale" },
    ],
    spanish_flu: [
      { date: "Mars 1918", event: "Premiers cas signalés au Kansas, États-Unis" },
      { date: "Avril 1918", event: "Propagation en Europe via les troupes américaines" },
      { date: "Août 1918", event: "Début de la deuxième vague, beaucoup plus mortelle" },
      { date: "Sept-Nov 1918", event: "Pic de la pandémie, systèmes de santé débordés" },
      { date: "Déc. 1918", event: "Diminution des cas dans de nombreuses régions" },
      { date: "Jan-Fév 1919", event: "Troisième vague dans certaines régions" },
      { date: "Avril 1919", event: "Fin de la troisième vague" },
      { date: "1920", event: "Fin officielle de la pandémie" },
    ],
    black_death: [
      { date: "1346", event: "Apparition en Asie centrale" },
      { date: "Oct. 1347", event: "Arrivée à Messine, Sicile, via des navires marchands" },
      { date: "Jan. 1348", event: "Propagation en Italie et en France" },
      { date: "Juin 1348", event: "Atteint l'Angleterre" },
      { date: "1349", event: "Propagation en Europe du Nord" },
      { date: "1350", event: "Atteint la Russie" },
      { date: "1351", event: "Déclin en Europe occidentale" },
      { date: "1353", event: "Fin de la première vague majeure" },
    ],
    sars: [
      { date: "Nov. 2002", event: "Premier cas à Foshan, Chine" },
      { date: "Fév. 2003", event: "Propagation à Hong Kong" },
      { date: "Mars 2003", event: "L'OMS émet une alerte mondiale" },
      { date: "Avril 2003", event: "Identification du virus SARS-CoV" },
      { date: "Mai 2003", event: "Pic de l'épidémie" },
      { date: "Juillet 2003", event: "L'OMS déclare la fin de la transmission" },
    ],
    h1n1_2009: [
      { date: "Mars 2009", event: "Premiers cas au Mexique et aux États-Unis" },
      { date: "Avril 2009", event: "L'OMS déclare une urgence de santé publique" },
      { date: "Juin 2009", event: "L'OMS déclare une pandémie" },
      { date: "Oct-Nov 2009", event: "Pic de la pandémie dans l'hémisphère nord" },
      { date: "Déc. 2009", event: "Début des campagnes de vaccination de masse" },
      { date: "Août 2010", event: "L'OMS déclare la fin de la pandémie" },
    ],
  }

  const events = timelineEvents[pandemic] || []

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Chronologie des événements clés</h3>

      {loading ? (
        <div className="h-[400px] w-full flex items-center justify-center bg-muted/20 rounded-lg">
          <div className="animate-pulse">Chargement de la chronologie...</div>
        </div>
      ) : (
        <div className="relative border-l border-muted-foreground/20 pl-6 ml-4 space-y-8 py-4">
          {events.map((event, index) => (
            <div key={index} className="relative">
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-[30px] top-1 border-4 border-background"></div>
              <div className="mb-1 text-sm font-semibold">{event.date}</div>
              <div className="text-muted-foreground">{event.event}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

