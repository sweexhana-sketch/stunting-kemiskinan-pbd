import React, { createContext, useContext, useState, useEffect } from 'react';

export interface RegionData {
    provinsi: string; // Used as unique ID (Region Name)
    stunting: number;
    kemiskinan: number;
    perumahan: number;
    status: string;
    color: string; // Added color property
}

interface DataContextType {
    data: RegionData[];
    updateRegionData: (regionName: string, newData: Partial<RegionData>) => void;
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
        provinsi: "Kabupaten Tambrauw",
        stunting: 39.1,
        kemiskinan: 32.1,
        perumahan: 55.4, // Retaining previous housing data as user didn't provide it, or default
        status: "Sangat Tinggi",
        color: "#FF0000"
    },
    {
        provinsi: "Kabupaten Sorong Selatan",
        stunting: 36.7,
        kemiskinan: 19.5,
        perumahan: 62.5,
        status: "Tinggi",
        color: "#FF4500"
    },
    {
        provinsi: "Kabupaten Raja Ampat",
        stunting: 31.1,
        kemiskinan: 14.5,
        perumahan: 71.3,
        status: "Tinggi",
        color: "#FFA500"
    },
    {
        provinsi: "Kabupaten Maybrat",
        stunting: 27.3,
        kemiskinan: 30.5,
        perumahan: 58.9,
        status: "Sangat Tinggi",
        color: "#FF0000"
    },
    {
        provinsi: "Kota Sorong",
        stunting: 27.2,
        kemiskinan: 15.2,
        perumahan: 75.2,
        status: "Sedang",
        color: "#FFFF00"
    },
    {
        provinsi: "Kabupaten Sorong",
        stunting: 23.8,
        kemiskinan: 18.2,
        perumahan: 68.7,
        status: "Sedang",
        color: "#FFFF00"
    },
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

    const updateRegionData = (regionName: string, newData: Partial<RegionData>) => {
        setData((prev) =>
            prev.map((item) => {
                if (item.provinsi === regionName) {
                    const updatedItem = { ...item, ...newData };
                    // Recalculate status automatically
                    updatedItem.status = calculateStatus(
                        updatedItem.stunting,
                        updatedItem.kemiskinan,
                        updatedItem.perumahan
                    );
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
