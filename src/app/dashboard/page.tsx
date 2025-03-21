"use client";

import HeaderComponent from "@/components/layout/HeaderComponent";
import { PandemicChart } from "@/components/pandemic-chart";
import { PandemicMap } from "@/components/pandemic-map";
import { PandemicStats } from "@/components/pandemic-stats";
import { PandemicTimeline } from "@/components/pandemic-timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function DashboardPage() {
  const [selectedPandemic, setSelectedPandemic] = useState("covid19");
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");

  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeaderComponent />
      <main className="mt-[5rem] flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taux de transmission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">XX</div>
              <p className="text-xs text-muted-foreground">XX</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taux de mortalité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">XX</div>
              <p className="text-xs text-muted-foreground">XX</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Durée moyenne
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">XX</div>
              <p className="text-xs text-muted-foreground">XX</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Population touchée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">XX</div>
              <p className="text-xs text-muted-foreground">XX</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-4 md:gap-8">
          <div className="flex items-center gap-4">
            <Select
              value={selectedPandemic}
              onValueChange={setSelectedPandemic}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner une pandémie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="covid19">COVID-19 (2019-2023)</SelectItem>
                <SelectItem value="h1n1">MPOX (2022-2023)</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedTimeframe}
              onValueChange={setSelectedTimeframe}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toute la durée</SelectItem>
                <SelectItem value="early">Phase initiale</SelectItem>
                <SelectItem value="peak">Pic</SelectItem>
                <SelectItem value="decline">Phase de déclin</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="ml-auto">
              Exporter les données
            </Button>
          </div>
          <Tabs defaultValue="charts">
            <TabsList>
              <TabsTrigger value="charts">Graphiques</TabsTrigger>
              <TabsTrigger value="map">Carte</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
              <TabsTrigger value="timeline">Chronologie</TabsTrigger>
            </TabsList>
            <TabsContent value="charts" className="border rounded-md p-4">
              <PandemicChart
                pandemic={selectedPandemic}
                timeframe={selectedTimeframe}
              />
            </TabsContent>
            <TabsContent value="map" className="border rounded-md p-4">
              <PandemicMap
                pandemic={selectedPandemic}
                timeframe={selectedTimeframe}
              />
            </TabsContent>
            <TabsContent value="stats" className="border rounded-md p-4">
              <PandemicStats
                pandemic={selectedPandemic}
                timeframe={selectedTimeframe}
              />
            </TabsContent>
            <TabsContent value="timeline" className="border rounded-md p-4">
              <PandemicTimeline pandemic={selectedPandemic} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
