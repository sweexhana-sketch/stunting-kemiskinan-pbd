import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useIntegratedAnalysis } from '@/contexts/IntegratedAnalysisContext';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons based on Priority
const getIcon = (priority: number) => {
    let color = 'blue';
    if (priority === 1) color = 'red';
    if (priority === 2) color = 'orange';
    if (priority === 3) color = 'yellow';
    if (priority === 4) color = 'green';

    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });
};

const FitBounds = ({ markers }: { markers: { lat: number; lng: number }[] }) => {
    const map = useMap();
    useEffect(() => {
        if (markers.length > 0) {
            const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [markers, map]);
    return null;
};

const DrillDownMap = () => {
    const { analysisResults } = useIntegratedAnalysis();

    if (analysisResults.length === 0) {
        return <div className="h-full flex items-center justify-center bg-gray-100">Menunggu Data...</div>;
    }

    const mapCenter = [analysisResults[0]?.building.latitude || -0.876, analysisResults[0]?.building.longitude || 131.255];
    const markers = analysisResults.map(r => ({ lat: r.building.latitude, lng: r.building.longitude }));

    return (
        <MapContainer center={[mapCenter[0], mapCenter[1]]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FitBounds markers={markers} />

            {analysisResults.map((item) => (
                <Marker
                    key={item.family.no_kk}
                    position={[item.building.latitude, item.building.longitude]}
                    icon={getIcon(item.priority_score)}
                >
                    <Popup>
                        <div className="text-sm">
                            <h3 className="font-bold">{item.family.kepala_keluarga}</h3>
                            <p className="text-xs text-gray-500">{item.building.alamat_lengkap}</p>

                            <div className="mt-2 space-y-1">
                                <div className={`badge ${item.priority_score === 1 ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>
                                    Priority: {item.priority_score}
                                </div>
                                <p><strong>Status:</strong> {item.intervention_type}</p>
                                <p><strong>Stunting:</strong> {item.stunted_kids.length > 0 ? `${item.stunted_kids.length} Anak` : 'Tidak Ada'}</p>
                                <p><strong>Sanitasi:</strong> {item.building.kepemilikan_jamban ? 'Ada' : 'TIDAK ADA'}</p>
                                <p><strong>Lantai:</strong> {item.building.jenis_lantai}</p>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default DrillDownMap;
