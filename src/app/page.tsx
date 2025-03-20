import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
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
      <main className="flex-1">
        <section className=" h-[45rem] w-full py-12 md:py-24 lg:py-32 bg-muted flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Plateforme d'analyse des pandémies historiques
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Collectez, analysez et visualisez les données historiques sur
                  les pandémies pour mieux comprendre et prédire les événements
                  futurs.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/dashboard">
                  <Button>Explorer les données</Button>
                </Link>
                <Link href="/api-docs">
                  <Button variant="outline">Documentation API</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full flex justify-center py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Collecte de données
                  </CardTitle>
                  <BarChart className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Multisource</div>
                  <p className="text-xs text-muted-foreground">
                    Données provenant de bases de santé publiques, archives
                    hospitalières et publications scientifiques
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Nettoyage et analyse
                  </CardTitle>
                  <LineChart className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Standardisé</div>
                  <p className="text-xs text-muted-foreground">
                    Élimination des doublons, standardisation et assurance
                    qualité des données
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Visualisation
                  </CardTitle>
                  <PieChart className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Interactive</div>
                  <p className="text-xs text-muted-foreground">
                    Tableaux de bord interactifs avec filtres et indicateurs
                    clés
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-muted-foreground">
          © 2025 PandemicInsight. Tous droits réservés.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Conditions d'utilisation
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Politique de confidentialité
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  );
}
