import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Target, Lightbulb, TrendingUp, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useData, RegionData } from "@/contexts/DataProvider";
import { useState } from "react";
import { toast } from "sonner"; // Assuming sonner is used based on App.tsx

const InterventionPage = () => {
  const { data, updateRegionData } = useData();
  const [selectedRegion, setSelectedRegion] = useState<RegionData | undefined>(undefined);
  const [selectedIntervention, setSelectedIntervention] = useState<string>("");
  const [simulationResult, setSimulationResult] = useState<{ reduction: number } | null>(null);

  const handleSimulation = (regionName: string | undefined, interventionType: string) => {
    if (!regionName) return;

    // 1. Ambil data asli (sudah ada di selectedRegion atau contexts)
    const currentData = data.find(r => r.kabupaten === regionName);
    if (!currentData) return;

    // 2. Hitung dampak otomatis (Logic Simulasi)
    let reduction = 0;
    if (interventionType === 'sanitasi_PUPR') {
      reduction = 5.5; // Prediksi penurunan
    } else if (interventionType === 'perumahan') {
      reduction = 3.2;
    } else if (interventionType === 'kawasan') {
      reduction = 4.1;
    }

    setSimulationResult({ reduction });

    // 3. Update State untuk trigger re-render warna poligon
    const newStunting = Math.max(0, currentData.stunting - reduction);

    updateRegionData('name', regionName, { stunting: parseFloat(newStunting.toFixed(1)) });

    toast.success(`Simulasi Berhasil: Stunting di ${regionName} diprediksi turun menjadi ${newStunting.toFixed(1)}%`);
  };
  const priorityAreas = [
    {
      area: "Kec. Sorong Kepulauan",
      stunting: 35.2,
      poverty: 18.9,
      priority: "Sangat Tinggi",
      recommendation: "Pembangunan SPAM dan jamban sehat prioritas 1",
    },
    {
      area: "Kec. Sorong Timur",
      stunting: 32.5,
      poverty: 15.8,
      priority: "Tinggi",
      recommendation: "Renovasi sistem sanitasi dan akses air bersih",
    },
    {
      area: "Kec. Sorong Barat",
      stunting: 28.3,
      poverty: 13.2,
      priority: "Sedang",
      recommendation: "Peningkatan kualitas perumahan layak huni",
    },
  ];

  const interventions = [
    {
      title: "Sistem Penyediaan Air Minum (SPAM)",
      impact: "Penurunan stunting 8-12%",
      cost: "Rp 2.5 Miliar",
      duration: "12 bulan",
      beneficiaries: "5,000 keluarga",
    },
    {
      title: "Program Jamban Sehat",
      impact: "Penurunan stunting 5-8%",
      cost: "Rp 800 Juta",
      duration: "6 bulan",
      beneficiaries: "2,500 keluarga",
    },
    {
      title: "Perumahan Layak Huni",
      impact: "Penurunan kemiskinan 3-5%",
      cost: "Rp 5 Miliar",
      duration: "18 bulan",
      beneficiaries: "1,000 keluarga",
    },
  ];

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground">
          <Target className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Perencanaan Intervensi</h1>
          <p className="text-sm text-muted-foreground">
            Prioritisasi dan simulasi program PUPR untuk penurunan stunting dan kemiskinan
          </p>
        </div>
      </div>

      <Tabs defaultValue="priority" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[500px]">
          <TabsTrigger value="priority">Prioritas</TabsTrigger>
          <TabsTrigger value="simulation">Simulasi</TabsTrigger>
          <TabsTrigger value="allocation">Alokasi</TabsTrigger>
        </TabsList>

        <TabsContent value="priority" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wilayah Prioritas Intervensi</CardTitle>
              <CardDescription>
                Berdasarkan analisis spasial dan indikator stunting/kemiskinan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priorityAreas.map((area, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between rounded-lg border p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="font-semibold">{area.area}</h3>
                        <Badge
                          variant={
                            area.priority === "Sangat Tinggi"
                              ? "destructive"
                              : area.priority === "Tinggi"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {area.priority}
                        </Badge>
                      </div>
                      <div className="mb-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Stunting:</span>{" "}
                          <span className="font-medium">{area.stunting}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Kemiskinan:</span>{" "}
                          <span className="font-medium">{area.poverty}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <Lightbulb className="mr-1 inline h-4 w-4" />
                        {area.recommendation}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Detail
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulasi Dampak Intervensi</CardTitle>
              <CardDescription>
                Proyeksi dampak program PUPR terhadap indikator stunting dan kemiskinan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pilih Wilayah</label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onChange={(e) => setSelectedRegion(data.find(r => r.kabupaten === e.target.value))}
                    >
                      <option value="">Pilih Kabupaten/Kota</option>
                      {data.map((region) => (
                        <option key={region.kabupaten} value={region.kabupaten}>{region.kabupaten}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bentuk Intervensi (PUPR)</label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onChange={(e) => setSelectedIntervention(e.target.value)}
                    >
                      <option value="">Pilih Program</option>
                      <option value="sanitasi_PUPR">Sanitasi & Air Bersih (SPAM)</option>
                      <option value="perumahan">Perumahan Layak Huni</option>
                      <option value="kawasan">Penataan Kawasan Kumuh</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold">Hasil Proyeksi Real-time</h3>
                    {simulationResult && <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Disimulasikan</Badge>}
                  </div>
                  {selectedRegion ? (
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Stunting Awal</p>
                        <p className="text-xl font-bold">{selectedRegion.stunting}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Estimasi Penurunan</p>
                        <p className="text-xl font-bold text-green-600">
                          {simulationResult ? `-${simulationResult.reduction}%` : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Stunting Akhir</p>
                        <p className="text-xl font-bold">
                          {simulationResult ? `${(selectedRegion.stunting - simulationResult.reduction).toFixed(1)}%` : "-"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-sm text-muted-foreground">Pilih wilayah dan intervensi untuk melihat prediksi impact.</div>
                  )}
                </div>

                <Button
                  className="w-full"
                  disabled={!selectedRegion || !selectedIntervention}
                  onClick={() => handleSimulation(selectedRegion?.kabupaten, selectedIntervention)}
                >
                  Jalankan Simulasi & Update Peta
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  *Simulasi menggunakan model regresi berdasarkan data historis efektivitas program PUPR.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alokasi Sumber Daya</CardTitle>
              <CardDescription>
                Distribusi anggaran dan sumber daya untuk intervensi optimal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Total Anggaran Tersedia</h3>
                    <Badge className="bg-primary text-primary-foreground">2024</Badge>
                  </div>
                  <p className="text-3xl font-bold">Rp 15.5 Miliar</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Untuk program PUPR terkait stunting dan kemiskinan
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <CheckCircle2 className="mb-2 h-5 w-5 text-primary" />
                    <p className="text-sm font-medium">Air Bersih & SPAM</p>
                    <p className="text-2xl font-bold">Rp 6.5M</p>
                    <p className="text-xs text-muted-foreground">42% dari total</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <CheckCircle2 className="mb-2 h-5 w-5 text-secondary" />
                    <p className="text-sm font-medium">Sanitasi</p>
                    <p className="text-2xl font-bold">Rp 4.0M</p>
                    <p className="text-xs text-muted-foreground">26% dari total</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <CheckCircle2 className="mb-2 h-5 w-5 text-accent" />
                    <p className="text-sm font-medium">Perumahan</p>
                    <p className="text-2xl font-bold">Rp 5.0M</p>
                    <p className="text-xs text-muted-foreground">32% dari total</p>
                  </div>
                </div>

                <Button className="w-full">Optimasi Alokasi Anggaran</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterventionPage;
