import { useRef, useEffect, useState } from "react";
import { useData } from "@/contexts/DataProvider";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// import L from "leaflet"; // Removed as we are switching to polygons
import * as shp from "shpjs";

const InteractiveMap = () => {
  const { data } = useData();
  const [geoData, setGeoData] = useState<any | null>(null);

  useEffect(() => {
    // Load the shapefile (zipped)
    const loadShapefile = async () => {
      try {
        const response = await fetch("/shp/desapbd/btskab.zip");
        const buffer = await response.arrayBuffer();
        const geojson = await shp.parseZip(buffer);

        console.log("GeoJSON loaded:", geojson);

        if (Array.isArray(geojson)) {
          setGeoData(geojson[0]);
        } else {
          setGeoData(geojson);
        }
      } catch (err) {
        console.error("Error loading shapefile:", err);
      }
    };

    loadShapefile();
  }, []);

  // Helper to find data for a feature
  const getRegionData = (feature: any) => {
    if (!feature || !feature.properties) return null;

    // Adjust this property name based on the actual SHP attributes (e.g., KABUPATEN, WA, etc.)
    // We will dump the properties to console to verify during dev, but for now assuming 'KABUPATEN' or similar matching the DataProvider names
    // Try to match somewhat loosely to accommodate "Kabupaten" prefix differences if necessary
    const regionName = feature.properties.KABUPATEN || feature.properties.WADMKK || feature.properties.NAMOBJ;

    if (!regionName) return null;

    // Direct match first
    let matched = data.find(d => d.provinsi.toLowerCase() === regionName.toLowerCase());

    // Fuzzy match if needed (e.g. "Sorong" vs "Kabupaten Sorong")
    if (!matched) {
      matched = data.find(d => d.provinsi.toLowerCase().includes(regionName.toLowerCase()) || regionName.toLowerCase().includes(d.provinsi.toLowerCase()));
    }

    return matched;
  };

  const style = (feature: any) => {
    const region = getRegionData(feature);
    let fillColor = "#cccccc"; // Default gray

    if (region && region.color) {
      fillColor = region.color;
    } else if (region) {
      // Fallback if color is missing but status exists (though interface now requires color)
      if (region.status === "Sangat Tinggi") fillColor = "#b91c1c";
      else if (region.status === "Tinggi") fillColor = "#f97316";
      else if (region.status === "Sedang") fillColor = "#eab308";
      else if (region.status === "Baik") fillColor = "#22c55e";
    }

    return {
      fillColor,
      weight: 2,
      opacity: 1,
      color: "white", // Border color
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const region = getRegionData(feature);
    if (!region) {
      layer.bindPopup("Data not available for this region");
      return;
    }

    const popupContent = `
      <div class="p-2 min-w-[200px]">
        <h3 class="font-bold text-sm mb-1">${region.provinsi}</h3>
        <p class="text-xs"><strong>Status:</strong> ${region.status}</p>
        <hr class="my-1 border-gray-200" />
        <div class="grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
          <span class="text-xs font-semibold">Stunting:</span>
          <span class="text-xs">${region.stunting}%</span>
          <span class="text-xs font-semibold">Kemiskinan:</span>
          <span class="text-xs">${region.kemiskinan}%</span>
          <span class="text-xs font-semibold">Rumah Layak:</span>
          <span class="text-xs">${region.perumahan}%</span>
        </div>
      </div>
    `;
    layer.bindPopup(popupContent);
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

          {geoData && (
            <GeoJSON
              data={geoData}
              style={style}
              onEachFeature={onEachFeature}
            />
          )}

        </MapContainer>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-[#FF0000]"></div>
            <span className="text-sm font-medium">Sangat Tinggi</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Stunting &gt; 30% or High Poverty
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-[#FFA500]"></div>
            <span className="text-sm font-medium">Tinggi</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Critical attention needed
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-[#FFFF00]"></div>
            <span className="text-sm font-medium">Sedang</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Moderate priority
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-gray-400"></div>
            <span className="text-sm font-medium">Data Tidak Tersedia</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Belum ada data untuk wilayah ini
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
