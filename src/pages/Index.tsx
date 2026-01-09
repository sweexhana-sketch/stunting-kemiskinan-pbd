import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsOverview from "@/components/dashboard/StatsOverview";
import StuntingChart from "@/components/dashboard/StuntingChart";
import PovertyChart from "@/components/dashboard/PovertyChart";
import RegionalAnalysis from "@/components/dashboard/RegionalAnalysis";
import DataTable from "@/components/dashboard/DataTable";
import { TrendingDown, Users, Home } from "lucide-react";

const Index = () => {
  return (
    <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <StatsOverview />

        {/* Charts Section */}
        <div className="mt-8">
          <Tabs defaultValue="stunting" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="stunting" className="gap-2">
                <TrendingDown className="h-4 w-4" />
                Stunting
              </TabsTrigger>
              <TabsTrigger value="poverty" className="gap-2">
                <Users className="h-4 w-4" />
                Kemiskinan
              </TabsTrigger>
              <TabsTrigger value="housing" className="gap-2">
                <Home className="h-4 w-4" />
                Perumahan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stunting" className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <StuntingChart />
                <RegionalAnalysis type="stunting" />
              </div>
            </TabsContent>

            <TabsContent value="poverty" className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <PovertyChart />
                <RegionalAnalysis type="poverty" />
              </div>
            </TabsContent>

            <TabsContent value="housing" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Perumahan Rakyat</CardTitle>
                  <CardDescription>
                    Analisis ketersediaan dan kualitas perumahan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border bg-muted/50 p-4">
                      <div className="text-2xl font-bold text-primary">12,450</div>
                      <div className="text-sm text-muted-foreground">Unit Tersedia</div>
                    </div>
                    <div className="rounded-lg border bg-muted/50 p-4">
                      <div className="text-2xl font-bold text-secondary">8,320</div>
                      <div className="text-sm text-muted-foreground">Layak Huni</div>
                    </div>
                    <div className="rounded-lg border bg-muted/50 p-4">
                      <div className="text-2xl font-bold text-accent">4,130</div>
                      <div className="text-sm text-muted-foreground">Perlu Renovasi</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <RegionalAnalysis type="housing" />
            </TabsContent>
          </Tabs>
        </div>

        {/* Data Table */}
        <div className="mt-8">
          <DataTable />
        </div>
      </main>
  );
};

export default Index;
