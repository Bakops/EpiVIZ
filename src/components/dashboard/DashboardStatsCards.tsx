import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  stats: any;
  isLoading: boolean;
  selectedLocalisation: string | null;
  localisations: any[];
};

export default function DashboardStatsCards({
  stats,
  isLoading,
  selectedLocalisation,
  localisations,
}: Props) {
  const getLocName = () => {
    if (!selectedLocalisation) return "Données globales";
    const loc = localisations.find((l) => l.id === selectedLocalisation);
    return `Données pour ${
      loc?.country || loc?.nom || "la localisation sélectionnée"
    }`;
  };
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#4BC0C0]">
            Nombre de cas confirmés
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">
                {(typeof stats.cas_confirmes === "number"
                  ? stats.cas_confirmes
                  : 0
                ).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">{getLocName()}</p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-[#FF7391]">Nombre de décès</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">
                {(typeof stats.deces === "number"
                  ? stats.deces
                  : 0
                ).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">{getLocName()}</p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-[#4AABED]">Nouveaux cas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">
                {(typeof stats.new_cases === "number"
                  ? stats.new_cases
                  : 0
                ).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">{getLocName()}</p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-[#FF9F40]">Nouveaux décès</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">
                {(typeof stats.new_deaths === "number"
                  ? stats.new_deaths
                  : 0
                ).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">{getLocName()}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
