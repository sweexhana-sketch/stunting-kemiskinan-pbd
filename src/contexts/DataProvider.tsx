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
        stunting: 22.0,
        kemiskinan: 10.5,
        perumahan: 75.2,
        status: "Prioritas Sedang",
    },
    {
        provinsi: "Kabupaten Sorong",
        stunting: 18.0,
        kemiskinan: 9.5,
        perumahan: 68.7,
        status: "Baik",
    },
    {
        provinsi: "Kabupaten Raja Ampat",
        stunting: 17.0,
        kemiskinan: 8.2,
        perumahan: 71.3,
        status: "Baik",
    },
    {
        provinsi: "Kabupaten Sorong Selatan",
        stunting: 15.0,
        kemiskinan: 7.9,
        perumahan: 62.5,
        status: "Prioritas Sedang",
    },
    {
        provinsi: "Kabupaten Maybrat",
        stunting: 14.0,
        kemiskinan: 7.5,
        perumahan: 58.9,
        status: "Prioritas Tinggi",
    },
    {
        provinsi: "Kabupaten Tambrauw",
        stunting: 14.0,
        kemiskinan: 6.4,
        perumahan: 55.4,
        status: "Prioritas Tinggi",
    },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<RegionData[]>(() => {
        const saved = localStorage.getItem('sigap-data');
        return saved ? JSON.parse(saved) : initialData;
    });

    useEffect(() => {
        localStorage.setItem('sigap-data', JSON.stringify(data));
    }, [data]);

    const calculateStatus = (stunting: number, kemiskinan: number, perumahan: number): string => {
        // Simple logic for status calculation
        // High stunting (> 20) OR High poverty (> 10) OR Low housing (< 60) -> Prioritas Tinggi
        if (stunting > 20 || kemiskinan > 10 || perumahan < 60) return "Prioritas Tinggi";
        // Moderate values -> Prioritas Sedang
        if (stunting > 15 || kemiskinan > 8 || perumahan < 70) return "Prioritas Sedang";
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
