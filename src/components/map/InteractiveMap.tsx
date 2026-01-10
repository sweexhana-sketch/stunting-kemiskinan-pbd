import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { useData } from "@/contexts/DataProvider";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin } from "lucide-react";

// Fix Leaflet default icon issue in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom colored icons
const createColoredIcon = (color: string) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const InteractiveMap = () => {
  const { data } = useData();

  // Approximate centroids for the regions
  const coordinatesMap: Record<string, [number, number]> = {
    "Kota Sorong": [-0.875, 131.255], // Lat, Lng
    "Kabupaten Sorong": [-0.950, 131.500],
    "Kabupaten Raja Ampat": [-0.500, 130.820],
    "Kabupaten Sorong Selatan": [-1.500, 132.000],
    "Kabupaten Maybrat": [-1.200, 132.450],
    "Kabupaten Tambrauw": [-0.650, 132.500],
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg shadow-lg h-[600px] overflow-hidden border">
        <MapContainer
          center={[-1.0, 131.5]}
          zoom={8}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {data.map((region) => {
            const coordinates = coordinatesMap[region.provinsi];
            if (!coordinates) return null;

            // Determine marker color based on status
            let markerColor = "#22c55e"; // Baik (Green)
            if (region.status === "Prioritas Tinggi") markerColor = "#ef4444"; // Red
            else if (region.status === "Prioritas Sedang") markerColor = "#f59e0b"; // Orange

            return (
              <Marker
                key={region.provinsi}
                position={coordinates}
                icon={createColoredIcon(markerColor)}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-sm mb-1">{region.provinsi}</h3>
                    <p className="text-xs"><strong>Status:</strong> {region.status}</p>
                    <hr className="my-1 border-gray-200" />
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
                      <span className="text-xs font-semibold">Stunting:</span>
                      <span className="text-xs">{region.stunting}%</span>
                      <span className="text-xs font-semibold">Kemiskinan:</span>
                      <span className="text-xs">{region.kemiskinan}%</span>
                      <span className="text-xs font-semibold">Rumah Layak:</span>
                      <span className="text-xs">{region.perumahan}%</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-destructive"></div>
            <span className="text-sm font-medium">Prioritas Tinggi</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Wilayah dengan stunting &gt; 20% atau kemiskinan &gt; 10%
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-accent"></div>
            <span className="text-sm font-medium">Prioritas Sedang</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Ambang batas menengah
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-secondary"></div>
            <span className="text-sm font-medium">Baik</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Indikator terkendali
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
