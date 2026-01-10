import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useData } from "@/contexts/DataProvider";


const InteractiveMap = () => {
  const { data } = useData();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  // Approximate centroids for the regions
  const coordinatesMap: Record<string, [number, number]> = {
    "Kota Sorong": [131.255, -0.875],
    "Kabupaten Sorong": [131.500, -0.950],
    "Kabupaten Raja Ampat": [130.820, -0.500],
    "Kabupaten Sorong Selatan": [132.000, -1.500],
    "Kabupaten Maybrat": [132.450, -1.200],
    "Kabupaten Tambrauw": [132.500, -0.650],
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken || isMapInitialized) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [131.5, -1.0],
      zoom: 8,
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

      // Add markers for each region from the dynamic data
      data.forEach((region) => {
        const coordinates = coordinatesMap[region.provinsi];
        if (!coordinates) return;

        // Determine marker color based on status
        let markerColor = "#22c55e"; // Baik (Green)
        if (region.status === "Prioritas Tinggi") markerColor = "#ef4444"; // Red
        else if (region.status === "Prioritas Sedang") markerColor = "#f59e0b"; // Orange

        // Create popup content
        const popupContent = `
          <div class="p-2">
            <h3 class="font-bold text-sm mb-1">${region.provinsi}</h3>
            <p class="text-xs"><strong>Status:</strong> ${region.status}</p>
            <hr class="my-1"/>
            <p class="text-xs"><strong>Stunting:</strong> ${region.stunting}%</p>
            <p class="text-xs"><strong>Kemiskinan:</strong> ${region.kemiskinan}%</p>
            <p class="text-xs"><strong>Rumah Layak:</strong> ${region.perumahan}%</p>
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
          .setLngLat(coordinates)
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
