import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface MapData {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: {
      name: string;
      stunting: number;
      poverty: number;
      housing: number;
      infrastructure: string;
    };
    geometry: {
      type: "Point";
      coordinates: [number, number];
    };
  }>;
}

const InteractiveMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  // Sample data untuk provinsi di Indonesia dengan fokus Papua Barat (Sorong)
  const mapData: MapData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          name: "Kec. Sorong Timur",
          stunting: 32.5,
          poverty: 15.8,
          housing: 52.3,
          infrastructure: "Air Bersih: Terbatas, Sanitasi: Rendah",
        },
        geometry: { type: "Point", coordinates: [131.2599, -0.8618] },
      },
      {
        type: "Feature",
        properties: {
          name: "Kec. Sorong Barat",
          stunting: 28.3,
          poverty: 13.2,
          housing: 61.5,
          infrastructure: "Air Bersih: Sedang, Sanitasi: Sedang",
        },
        geometry: { type: "Point", coordinates: [131.2199, -0.8818] },
      },
      {
        type: "Feature",
        properties: {
          name: "Kec. Sorong Utara",
          stunting: 25.7,
          poverty: 11.5,
          housing: 68.2,
          infrastructure: "Air Bersih: Baik, Sanitasi: Baik",
        },
        geometry: { type: "Point", coordinates: [131.2499, -0.8418] },
      },
      {
        type: "Feature",
        properties: {
          name: "Kec. Sorong Kepulauan",
          stunting: 35.2,
          poverty: 18.9,
          housing: 45.6,
          infrastructure: "Air Bersih: Sangat Terbatas, Sanitasi: Sangat Rendah",
        },
        geometry: { type: "Point", coordinates: [131.1899, -0.9018] },
      },
      {
        type: "Feature",
        properties: {
          name: "Kec. Sorong Manoi",
          stunting: 22.1,
          poverty: 9.8,
          housing: 74.3,
          infrastructure: "Air Bersih: Baik, Sanitasi: Baik",
        },
        geometry: { type: "Point", coordinates: [131.2799, -0.8518] },
      },
    ],
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken || isMapInitialized) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [131.2499, -0.8718], // Centered on Sorong
      zoom: 11,
      pitch: 45,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      "top-right"
    );

    map.current.on("load", () => {
      if (!map.current) return;

      // Add markers for each location
      mapData.features.forEach((feature) => {
        const { coordinates } = feature.geometry;
        const { name, stunting, poverty, housing, infrastructure } = feature.properties;

        // Determine marker color based on stunting level
        const markerColor =
          stunting > 30 ? "#ef4444" : stunting > 25 ? "#f59e0b" : "#22c55e";

        // Create popup content
        const popupContent = `
          <div class="p-2">
            <h3 class="font-bold text-sm mb-1">${name}</h3>
            <p class="text-xs"><strong>Stunting:</strong> ${stunting}%</p>
            <p class="text-xs"><strong>Kemiskinan:</strong> ${poverty}%</p>
            <p class="text-xs"><strong>Rumah Layak:</strong> ${housing}%</p>
            <p class="text-xs mt-1"><strong>Infrastruktur:</strong><br/>${infrastructure}</p>
          </div>
        `;

        // Create marker
        const el = document.createElement("div");
        el.className = "marker";
        el.style.backgroundColor = markerColor;
        el.style.width = "30px";
        el.style.height = "30px";
        el.style.borderRadius = "50%";
        el.style.border = "3px solid white";
        el.style.cursor = "pointer";
        el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";

        new mapboxgl.Marker(el)
          .setLngLat(coordinates as [number, number])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
          .addTo(map.current!);
      });
    });

    setIsMapInitialized(true);
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="space-y-4">
      {!isMapInitialized && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Setup Peta Interaktif</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Untuk mengaktifkan peta interaktif, masukkan Mapbox Access Token Anda.
              Dapatkan token gratis di{" "}
              <a
                href="https://mapbox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
            <div className="space-y-2">
              <Label htmlFor="mapbox-token">Mapbox Access Token</Label>
              <Input
                id="mapbox-token"
                type="text"
                placeholder="pk.eyJ1Ijo..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
            </div>
            <Button onClick={initializeMap} disabled={!mapboxToken} className="w-full">
              Aktifkan Peta
            </Button>
          </div>
        </Card>
      )}

      <div
        ref={mapContainer}
        className={`rounded-lg shadow-lg ${isMapInitialized ? "h-[600px]" : "h-0"}`}
      />

      {isMapInitialized && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-destructive"></div>
              <span className="text-sm font-medium">Prioritas Tinggi (&gt;30%)</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Wilayah dengan stunting di atas 30%
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-accent"></div>
              <span className="text-sm font-medium">Prioritas Sedang (25-30%)</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Wilayah dengan stunting 25-30%
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-chart-5"></div>
              <span className="text-sm font-medium">Baik (&lt;25%)</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Wilayah dengan stunting di bawah 25%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
