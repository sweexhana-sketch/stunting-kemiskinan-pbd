import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InteractiveMap from "@/components/map/InteractiveMap";
import { Map, Layers, Navigation } from "lucide-react";

const MapPage = () => {
  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground">
          <Map className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Peta Interaktif SIGAP-PU</h1>
          <p className="text-sm text-muted-foreground">
            Visualisasi geospasial data stunting, kemiskinan, dan infrastruktur PUPR
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Peta Analisis Wilayah</CardTitle>
          <CardDescription>
            Klik marker untuk melihat detail data stunting, kemiskinan, dan kondisi infrastruktur
            per kecamatan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InteractiveMap />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <CardTitle>Layer Peta</CardTitle>
            </div>
            <CardDescription>Informasi layer data yang ditampilkan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border p-3">
                <div className="mt-1 h-3 w-3 rounded-full bg-destructive"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Hotspot Stunting</p>
                  <p className="text-xs text-muted-foreground">
                    Wilayah dengan prevalensi stunting tinggi yang memerlukan intervensi segera
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border p-3">
                <div className="mt-1 h-3 w-3 rounded-full bg-accent"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Zona Kemiskinan</p>
                  <p className="text-xs text-muted-foreground">
                    Area dengan tingkat kemiskinan di atas rata-rata nasional
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border p-3">
                <div className="mt-1 h-3 w-3 rounded-full bg-secondary"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Infrastruktur PUPR</p>
                  <p className="text-xs text-muted-foreground">
                    Lokasi proyek air bersih, sanitasi, dan perumahan rakyat
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              <CardTitle>Analisis Spasial</CardTitle>
            </div>
            <CardDescription>Metode analisis yang tersedia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium">Overlay Analysis</p>
                <p className="text-xs text-muted-foreground">
                  Menumpangtindihkan data untuk identifikasi wilayah prioritas
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium">Hotspot Analysis</p>
                <p className="text-xs text-muted-foreground">
                  Mengidentifikasi klaster wilayah dengan masalah tinggi
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium">Buffer Analysis</p>
                <p className="text-xs text-muted-foreground">
                  Menganalisis jangkauan layanan infrastruktur
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium">Regression Analysis</p>
                <p className="text-xs text-muted-foreground">
                  Menganalisis hubungan infrastruktur dengan indikator kesehatan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapPage;
