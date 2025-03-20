"use client";

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
import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
  const [selectedPandemic, setSelectedPandemic] = useState("covid19");
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="header px-4 lg:px-6 h-16 flex items-center border-b bg-white shadow-md">
        <Link className="flex items-center justify-center" href="/">
          <div className="text-[30px] text-transparent bg-clip-text bg-gradient-to-r from-[#98ff87] to-[#3d96ff] font-poppins font-[700] flex flex-row items-center justify-center gap-1">
            EPIVIZ .
          </div>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="relative text-sm font-poppins font-bold text-[#6b6b6b] transition-colors duration-300 ease-in-out hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#98ff87] to-[#3d96ff]"
            href="/"
          >
            Accueil
          </Link>
          <Link
            className="relative text-sm font-poppins font-bold text-[#6b6b6b] transition-colors duration-300 ease-in-out hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-red-500 to-purple-900"
            href="/dashboard"
          >
            Tableau de bord
          </Link>
          <Link
            className="relative text-sm font-poppins font-bold text-[#6b6b6b] transition-colors duration-300 ease-in-out hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-red-500 to-purple-900"
            href="/api-docs"
          >
            API
          </Link>
          <Link
            className="relative text-sm font-poppins font-bold text-[#6b6b6b] transition-colors duration-300 ease-in-out hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-red-500 to-purple-900"
            href="/about"
          >
            À propos
          </Link>
        </nav>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
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
