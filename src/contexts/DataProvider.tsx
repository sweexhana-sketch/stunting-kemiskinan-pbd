import React, { createContext, useContext, useState, useEffect } from 'react';

export interface RegionData {
    id: string; // New ID
    kabupaten: string; // Renamed from provinsi
    stunting: number; // Mapped from stunting_prev
    kemiskinan: number; // Mapped from poverty_pct
    rumah_layak_pct: number; // Renamed from perumahan
    kk_p3ke: number; // Total KK P3KE
    desil1: number; // KK Desil 1
    desil2: number; // KK Desil 2
    balita_t_2t: number; // Balita di bawah garis merah
    status: string; // Priority
    color: string;
    keterangan: string; // New field
}

interface DataContextType {
    data: RegionData[];
    updateRegionData: (mode: 'id' | 'name', identifier: string, newData: Partial<RegionData>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

const initialData: RegionData[] = [
    {
        "id": "92.71",
        "kabupaten": "Kota Sorong",
        "stunting": 27.2,
        "kemiskinan": 15.2,
        "rumah_layak_pct": 68.5,
        "kk_p3ke": 45000,
        "desil1": 5000,
        "desil2": 7000,
        "balita_t_2t": 450,
        "status": "Sedang",
        "color": "#FFFF00",
        "keterangan": "Akses infrastruktur terbaik di provinsi, fokus pada pemeliharaan sanitasi."
    },
    {
        "id": "92.01",
        "kabupaten": "Kabupaten Sorong",
        "stunting": 23.8,
        "kemiskinan": 18.2,
        "rumah_layak_pct": 55.2,
        "kk_p3ke": 32000,
        "desil1": 6000,
        "desil2": 8000,
        "balita_t_2t": 320,
        "status": "Sedang",
        "color": "#FFFF00",
        "keterangan": "Perluasan akses air minum layak untuk menekan stunting."
    },
    {
        "id": "92.04",
        "kabupaten": "Kabupaten Raja Ampat",
        "stunting": 31.1,
        "kemiskinan": 14.5,
        "rumah_layak_pct": 48.9,
        "kk_p3ke": 12000,
        "desil1": 2500,
        "desil2": 3000,
        "balita_t_2t": 180,
        "status": "Tinggi",
        "color": "#FFA500",
        "keterangan": "Intervensi sensitif pada wilayah pesisir dan kepulauan."
    },
    {
        "id": "92.06",
        "kabupaten": "Kabupaten Sorong Selatan",
        "stunting": 36.7,
        "kemiskinan": 19.5,
        "rumah_layak_pct": 42.5,
        "kk_p3ke": 15000,
        "desil1": 4000,
        "desil2": 5000,
        "balita_t_2t": 210,
        "status": "Tinggi",
        "color": "#FF4500",
        "keterangan": "Urgensi tinggi pada perbaikan sanitasi dasar."
    },
    {
        "id": "92.10",
        "kabupaten": "Kabupaten Maybrat",
        "stunting": 27.3,
        "kemiskinan": 30.5,
        "rumah_layak_pct": 40.2,
        "kk_p3ke": 8000,
        "desil1": 3500,
        "desil2": 2000,
        "balita_t_2t": 150,
        "status": "Sangat Tinggi",
        "color": "#FF0000",
        "keterangan": "Kemiskinan ekstrem berdampak langsung pada kualitas hunian."
    },
    {
        "id": "92.09",
        "kabupaten": "Kabupaten Tambrauw",
        "stunting": 39.1,
        "kemiskinan": 32.1,
        "rumah_layak_pct": 35.8,
        "kk_p3ke": 7500,
        "desil1": 4200,
        "desil2": 1500,
        "balita_t_2t": 190,
        "status": "Sangat Tinggi",
        "color": "#FF0000",
        "keterangan": "Prioritas utama intervensi gizi spesifik dan sensitif (PUPR)."
    }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<RegionData[]>(() => {
        const saved = localStorage.getItem('sigap-data-v2');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Simple validation to check if new structure exists
                if (parsed.length > 0 && parsed[0].kabupaten) {
                    return parsed;
                }
            } catch (e) {
                console.error("Failed to parse saved data", e);
            }
        }
        return initialData;
    });

    useEffect(() => {
        localStorage.setItem('sigap-data-v2', JSON.stringify(data));
    }, [data]);

    const calculateStatus = (item: RegionData): string => {
        const { stunting, kemiskinan, desil1, kk_p3ke, kabupaten } = item;
        
        // Priority 1 (Kritis) Logic for Tambrauw or Maybrat
        const isTargetRegion = kabupaten.includes("Tambrauw") || kabupaten.includes("Maybrat");
        const desil1Ratio = kk_p3ke > 0 ? (desil1 / kk_p3ke) * 100 : 0;
        
        if (isTargetRegion && desil1Ratio > 50 && stunting > 30) {
            return "Kritis";
        }

        if (stunting > 30 || kemiskinan > 25) return "Sangat Tinggi";
        if (stunting > 20 || kemiskinan > 15) return "Tinggi";
        return "Sedang";
    };

    const getColorForStatus = (status: string): string => {
        if (status === "Kritis") return "#7f1d1d"; // Darker red
        if (status === "Sangat Tinggi") return "#FF0000";
        if (status === "Tinggi") return "#FFA500";
        if (status === "Sedang") return "#FFFF00";
        return "#22c55e"; // Default Baik
    };

    const updateRegionData = (mode: 'id' | 'name', identifier: string, newData: Partial<RegionData>) => {
        setData((prev) =>
            prev.map((item) => {
                const match = mode === 'id' ? item.id === identifier : item.kabupaten === identifier;
                if (match) {
                    const updatedItem = { ...item, ...newData };
                    // Recalculate status automatically
                    updatedItem.status = calculateStatus(updatedItem);
                    // Recalculate color automatically based on new status
                    updatedItem.color = getColorForStatus(updatedItem.status);

                    return updatedItem;
                }
                return item;
            })
        );
    };

    return (
        <DataContext.Provider value={{ data, updateRegionData }}>
            {children}
        </DataContext.Provider>
    );
};
