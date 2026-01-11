import React, { createContext, useContext, useState, useEffect } from 'react';

export interface RegionData {
    id: string; // New ID
    kabupaten: string; // Renamed from provinsi
    stunting: number; // Mapped from stunting_prev
    kemiskinan: number; // Mapped from poverty_pct
    rumah_layak_pct: number; // Renamed from perumahan
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
        "status": "Sangat Tinggi",
        "color": "#FF0000",
        "keterangan": "Prioritas utama intervensi gizi spesifik dan sensitif (PUPR)."
    }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<RegionData[]>(() => {
        const saved = localStorage.getItem('sigap-data');
        // If saved data exists, we might want to merge or specific logic, but for this update we force new values if they differ significantly or just reset to initialData if dev/testing
        // For simplicity in this context, we fallback to initialData if parsed structure is different, but here we might just want to use initialData directly for this update to ensure user sees changes.
        // However, standard pattern:
        return initialData;
    });

    useEffect(() => {
        localStorage.setItem('sigap-data', JSON.stringify(data));
    }, [data]);

    const calculateStatus = (stunting: number, kemiskinan: number, perumahan: number): string => {
        // Updated logic based on SSGI 2024 and User JSON categories
        if (stunting > 30 || kemiskinan > 25) return "Sangat Tinggi";
        if (stunting > 20 || kemiskinan > 15) return "Tinggi";
        return "Sedang";
    };

    const getColorForStatus = (status: string): string => {
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
                    updatedItem.status = calculateStatus(
                        updatedItem.stunting,
                        updatedItem.kemiskinan,
                        updatedItem.rumah_layak_pct
                    );
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
