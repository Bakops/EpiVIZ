import HeaderComponent from "@/components/layout/HeaderComponent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ApiDocsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeaderComponent />
      <main className="mt-[5rem] flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Documentation API</h1>
            <p className="text-muted-foreground mt-2">
              Accédez aux données historiques sur les pandémies via notre API
              RESTful
            </p>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="endpoints">Points d'accès</TabsTrigger>
              <TabsTrigger value="authentication">Authentification</TabsTrigger>
              <TabsTrigger value="examples">Exemples</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Vue d'ensemble de l'API</CardTitle>
                  <CardDescription>
                    Notre API vous permet d'accéder à des données historiques
                    détaillées sur les pandémies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    L'API PandemicInsight est une interface RESTful qui permet
                    aux chercheurs et aux développeurs d'accéder à notre base de
                    données complète sur les pandémies historiques. Vous pouvez
                    utiliser cette API pour:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Récupérer des données sur des pandémies spécifiques</li>
                    <li>
                      Filtrer les données par période, région géographique ou
                      indicateurs
                    </li>
                    <li>
                      Obtenir des statistiques comparatives entre différentes
                      pandémies
                    </li>
                    <li>
                      Accéder aux données brutes pour vos propres analyses
                    </li>
                  </ul>
                  <p>
                    Toutes les réponses sont au format JSON et incluent des
                    métadonnées sur la source des données.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="endpoints" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Points d'accès disponibles</CardTitle>
                  <CardDescription>
                    Liste complète des endpoints API avec leurs paramètres
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold">GET /api/pandemics</h3>
                    <p className="text-sm text-muted-foreground">
                      Récupère la liste de toutes les pandémies disponibles dans
                      la base de données
                    </p>
                    <div className="bg-muted p-2 rounded-md">
                      <code>
                        GET https://api.pandemicinsight.org/api/pandemics
                      </code>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">
                      GET /api/pandemics/{"{id}"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Récupère les détails d'une pandémie spécifique
                    </p>
                    <div className="bg-muted p-2 rounded-md">
                      <code>
                        GET
                        https://api.pandemicinsight.org/api/pandemics/covid19
                      </code>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">
                      GET /api/pandemics/{"{id}"}/stats
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Récupère les statistiques d'une pandémie spécifique
                    </p>
                    <div className="bg-muted p-2 rounded-md">
                      <code>
                        GET
                        https://api.pandemicinsight.org/api/pandemics/covid19/stats
                      </code>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">
                      GET /api/regions/{"{region}"}/pandemics
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Récupère les données des pandémies pour une région
                      spécifique
                    </p>
                    <div className="bg-muted p-2 rounded-md">
                      <code>
                        GET
                        https://api.pandemicinsight.org/api/regions/europe/pandemics
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="authentication" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Authentification</CardTitle>
                  <CardDescription>
                    Comment s'authentifier pour utiliser l'API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    L'API PandemicInsight utilise des clés API pour
                    l'authentification. Pour obtenir une clé API, vous devez
                    créer un compte sur notre portail développeur.
                  </p>
                  <h3 className="font-semibold">
                    Authentification par clé API
                  </h3>
                  <p>
                    Incluez votre clé API dans l'en-tête HTTP de chaque requête:
                  </p>
                  <div className="bg-muted p-2 rounded-md">
                    <code>Authorization: Bearer YOUR_API_KEY</code>
                  </div>
                  <div className="mt-4">
                    <Button>Créer un compte développeur</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="examples" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Exemples d'utilisation</CardTitle>
                  <CardDescription>
                    Exemples de code pour utiliser l'API dans différents
                    langages
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold">JavaScript (fetch)</h3>
                    <div className="bg-muted p-3 rounded-md overflow-x-auto">
                      <pre>
                        <code>{`fetch('https://api.pandemicinsight.org/api/pandemics/covid19', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}</code>
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Python (requests)</h3>
                    <div className="bg-muted p-3 rounded-md overflow-x-auto">
                      <pre>
                        <code>{`import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY'
}

response = requests.get('https://api.pandemicinsight.org/api/pandemics/covid19', headers=headers)
data = response.json()
print(data)`}</code>
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">R</h3>
                    <div className="bg-muted p-3 rounded-md overflow-x-auto">
                      <pre>
                        <code>{`library(httr)
library(jsonlite)

headers <- add_headers(Authorization = "Bearer YOUR_API_KEY")
response <- GET("https://api.pandemicinsight.org/api/pandemics/covid19", headers)
data <- content(response, "text") %>% fromJSON()
print(data)`}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
