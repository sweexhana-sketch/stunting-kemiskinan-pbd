import React, { createContext, useContext, useState, useEffect } from 'react';

export interface RegionData {
    provinsi: string; // Used as unique ID (Region Name)
    stunting: number;
    kemiskinan: number;
    perumahan: number;
    status: string;
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
        provinsi: "Kota Sorong",
        stunting: 27.2,
        kemiskinan: 10.5, // Retention of existing non-specified data
        perumahan: 75.2,
        status: "Prioritas Sedang",
    },
    {
        provinsi: "Kabupaten Sorong",
        stunting: 23.8,
        kemiskinan: 9.5,
        perumahan: 68.7,
        status: "Prioritas Sedang", // "Tinggi" mapped to Prioritas Sedang based on user note
    },
    {
        provinsi: "Kabupaten Raja Ampat",
        stunting: 31.1,
        kemiskinan: 8.2,
        perumahan: 71.3,
        status: "Sangat Tinggi",
    },
    {
        provinsi: "Kabupaten Sorong Selatan",
        stunting: 36.7,
        kemiskinan: 7.9,
        perumahan: 62.5,
        status: "Sangat Tinggi",
    },
    {
        provinsi: "Kabupaten Maybrat",
        stunting: 27.3,
        kemiskinan: 7.5,
        perumahan: 58.9,
        status: "Prioritas Sedang",
    },
    {
        provinsi: "Kabupaten Tambrauw",
        stunting: 39.1,
        kemiskinan: 6.4,
        perumahan: 55.4,
        status: "Sangat Tinggi",
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
        // Updated logic based on SSGI 2024 thresholds from user
        // > 30% Stunting -> Sangat Tinggi
        // 20% - 30% Stunting -> Prioritas Sedang
        // Adjusted Poverty/Housing integration:

        if (stunting > 30) return "Sangat Tinggi";
        if (stunting > 20 || kemiskinan > 10 || perumahan < 60) return "Prioritas Sedang"; // Mapped "Tinggi" to Prioritas Sedang

        // Fallback for Moderate/Good
        if (stunting > 10 || kemiskinan > 8) return "Prioritas Sedang";

        return "Baik";
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
