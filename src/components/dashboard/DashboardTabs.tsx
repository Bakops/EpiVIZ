import PandemicMap from "@/components/pandemic-map";
import PredictionChart from "@/components/predict-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

type Localisation = {
  id: string;
  country?: string;
  nom?: string;
};

type TimelineItem = {
  totalCases: number;
  totalDeaths: number;
  newCases: number;
  newDeaths: number;
  date: string;
};

type Props = {
  chartData: ChartData<"line">;
  chartOptions: ChartOptions<"line">;
  localisations: Localisation[];
  selectedLocalisation: string | null;
  selectedPandemic: string | null;
  handleLocationClick: (id: string | number | null) => void;
  timeline: TimelineItem[];
  isLoading: boolean;
};

export default function DashboardTabs({
  chartData,
  chartOptions,
  localisations,
  selectedLocalisation,
  selectedPandemic,
  handleLocationClick,
  timeline,
  isLoading,
}: Props) {
  return (
    <Tabs defaultValue="charts">
      <TabsList>
        <TabsTrigger value="charts">Graphiques</TabsTrigger>
        <TabsTrigger value="map">Carte</TabsTrigger>
        <TabsTrigger value="predict">Prédictions</TabsTrigger>
      </TabsList>
      <TabsContent value="charts" className="border rounded-md p-4">
        <div className="w-full h-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </TabsContent>
      <TabsContent value="map" className="border rounded-md p-4">
        <PandemicMap
          localisations={localisations}
          selectedLocationId={selectedLocalisation}
          selectedPandemicId={selectedPandemic}
          onLocationClick={handleLocationClick}
          className="z-2"
        />
      </TabsContent>
      <TabsContent value="predict" className="border rounded-md p-4">
        <PredictionChart country={selectedLocalisation ?? ""} />
      </TabsContent>
      <TabsContent value="timeline" className="border rounded-md p-4">
        {timeline && timeline.length > 0 ? (
          <div className="space-y-4">
            {timeline.map((item: any, index: number) => {
              const safeValue = (value: any) => {
                if (value === null || value === undefined) return 0;
                return isNaN(Number(value)) ? 0 : Number(value);
              };
              const cas_confirmes = safeValue(item.totalCases);
              const deces = safeValue(item.totalDeaths);
              const new_cases = safeValue(item.newCases);
              const new_deaths = safeValue(item.newDeaths);
              let formattedDate;
              try {
                formattedDate = new Date(item.date).toLocaleDateString();
              } catch (e) {
                formattedDate = "Date invalide";
              }
              return (
                <div key={index} className="border-b pb-2">
                  <h3 className="font-medium">{formattedDate}</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Cas confirmés:
                      </span>
                      <span className="ml-2 font-medium">
                        {cas_confirmes.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Décès:
                      </span>
                      <span className="ml-2 font-medium">
                        {deces.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Nouveaux cas:
                      </span>
                      <span className="ml-2 font-medium">
                        {new_cases.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Nouveaux décès:
                      </span>
                      <span className="ml-2 font-medium">
                        {new_deaths.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            {isLoading
              ? "Chargement des données chronologiques..."
              : "Aucune donnée chronologique disponible"}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
