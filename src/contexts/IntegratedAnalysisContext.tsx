import React, { createContext, useContext, useState, useEffect } from 'react';
import { Building, Family, Individual, StuntingHistory, FamilyAnalysisProfile } from '../types/analysis';

interface IntegratedAnalysisContextType {
    buildings: Building[];
    families: Family[];
    individuals: Individual[];
    stuntingHistory: StuntingHistory[];
    analysisResults: FamilyAnalysisProfile[];
    generateMockData: (regionId: string) => void;
    isLoading: boolean;
}

const IntegratedAnalysisContext = createContext<IntegratedAnalysisContextType | undefined>(undefined);

export const useIntegratedAnalysis = () => {
    const context = useContext(IntegratedAnalysisContext);
    if (!context) {
        throw new Error('useIntegratedAnalysis must be used within a IntegratedAnalysisProvider');
    }
    return context;
};

export const IntegratedAnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [families, setFamilies] = useState<Family[]>([]);
    const [individuals, setIndividuals] = useState<Individual[]>([]);
    const [stuntingHistory, setStuntingHistory] = useState<StuntingHistory[]>([]);
    const [analysisResults, setAnalysisResults] = useState<FamilyAnalysisProfile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Helper to generate random coordinates near a center point
    const randomGeo = (centerLat: number, centerLng: number, radiusInKm: number) => {
        const y0 = centerLat;
        const x0 = centerLng;
        const rd = radiusInKm / 111300; // about 111300 meters in one degree
        const u = Math.random();
        const v = Math.random();
        const w = rd * Math.sqrt(u);
        const t = 2 * Math.PI * v;
        const x = w * Math.cos(t);
        const y = w * Math.sin(t);
        return {
            latitude: y + y0,
            longitude: x + x0,
        };
    };

    const generateMockData = (regionId: string) => {
        setIsLoading(true);
        // Simulate API delay
        setTimeout(() => {
            const mockBuildings: Building[] = [];
            const mockFamilies: Family[] = [];
            const mockIndividuals: Individual[] = [];
            const mockStunting: StuntingHistory[] = [];

            // Center point for mock data (e.g., Sorong)
            const centerLat = -0.876;
            const centerLng = 131.255;

            // Generate 50 households
            for (let i = 0; i < 50; i++) {
                const coords = randomGeo(centerLat, centerLng, 2); // 2km radius
                const bId = `BLD-${i}`;
                const isSlum = Math.random() > 0.7; // 30% slum chance

                mockBuildings.push({
                    id: bId,
                    alamat_lengkap: `Jl. Contoh Data No. ${i}, Distrik Sorong`,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    jenis_lantai: isSlum ? (Math.random() > 0.5 ? 'Tanah' : 'Semen') : 'Keramik',
                    jenis_dinding: isSlum ? 'Kayu' : 'Tembok',
                    sumber_air_minum: isSlum ? 'Sungai' : 'PDAM',
                    kepemilikan_jamban: !isSlum, // Slums often lack private latrines
                    jenis_kloset: isSlum ? (Math.random() > 0.5 ? 'Cemplung' : 'Plengsengan') : 'Leher Angsa',
                    status_kawasan: isSlum ? 'Kumuh' : 'Bukan Kumuh',
                });

                const fId = `KK-${i}`;
                const isPoor = isSlum || Math.random() > 0.6; // Higher poverty in slums

                mockFamilies.push({
                    no_kk: fId,
                    id_bangunan: bId,
                    kepala_keluarga: `Kepala Keluarga ${i}`,
                    jumlah_anggota: 3 + Math.floor(Math.random() * 4),
                    status_dtks: isPoor ? 'Desil 1' : 'Non-DTKS',
                    pendapatan_rata_rata: isPoor ? 1500000 : 4500000,
                    penerima_bantuan: isPoor ? ['PKH', 'BPNT'] : [],
                    status_lahan: isSlum ? 'Menumpang' : 'Milik Sendiri',
                });

                // Generate kids
                const numKids = Math.floor(Math.random() * 3);
                for (let k = 0; k < numKids; k++) {
                    const indId = `NIK-${i}-${k}`;
                    const isStunted = isPoor && Math.random() > 0.4; // Higher stunting risk for poor

                    mockIndividuals.push({
                        nik: indId,
                        no_kk: fId,
                        nama_lengkap: `Anak ${k} dari KK ${i}`,
                        tanggal_lahir: '2022-01-01', // Approx 2-4 years old
                        jenis_kelamin: Math.random() > 0.5 ? 'L' : 'P',
                        nama_ibu_kandung: `Ibu KK ${i}`,
                        kategori: 'Balita'
                    });

                    if (isStunted) {
                        mockStunting.push({
                            id_pengukuran: `UKUR-${i}-${k}`,
                            nik_balita: indId,
                            tanggal_ukur: '2024-01-20',
                            usia_bulan: 24,
                            tinggi_badan: 75, // Short
                            berat_badan: 10,
                            status_gizi_tb_u: 'Sangat Pendek',
                            intervensi_diterima: ['PMT']
                        });
                    }
                }
            }

            setBuildings(mockBuildings);
            setFamilies(mockFamilies);
            setIndividuals(mockIndividuals);
            setStuntingHistory(mockStunting);

            // Run Logic immediately after generation
            const results = runAnalysisAlgorithm(mockBuildings, mockFamilies, mockIndividuals, mockStunting);
            setAnalysisResults(results);

            setIsLoading(false);
        }, 1000);
    };

    const runAnalysisAlgorithm = (b: Building[], f: Family[], i: Individual[], s: StuntingHistory[]): FamilyAnalysisProfile[] => {
        return f.map(family => {
            const building = b.find(x => x.id === family.id_bangunan)!;
            const members = i.filter(x => x.no_kk === family.no_kk);
            const stuntedKids = s.filter(hist => members.some(m => m.nik === hist.nik_balita));

            const isPoor = ['Desil 1', 'Desil 2', 'Desil 3'].includes(family.status_dtks);
            const isUnhealthyHouse = !building.kepemilikan_jamban || building.sumber_air_minum === 'Sungai' || building.jenis_lantai === 'Tanah';
            const hasStunting = stuntedKids.length > 0;

            let priority: 1 | 2 | 3 | 4 = 4;
            let intervention = "Edukasi Dasar";

            /*
              Prioritas 1 (Zona Merah): Miskin + Rumah Tidak Layak + Ada Stunting -> INTERVENSI TOTAL
              Prioritas 2 (Pencegahan): Miskin + Rumah Tidak Layak + Tidak Ada Stunting -> Bedah Rumah/Sanitasi
              Prioritas 3 (Gizi Spesifik): Mampu + Rumah Layak + Ada Stunting -> Pola Asuh/Penyakit
              Prioritas 4: Aman / Pemantauan Rutin
            */

            if (isPoor && isUnhealthyHouse && hasStunting) {
                priority = 1;
                intervention = "INTERVENSI TOTAL: Bedah Rumah + Sanitasi + PMT + Bansos";
            } else if (isPoor && isUnhealthyHouse && !hasStunting) {
                priority = 2;
                intervention = "PENCEGAHAN: Perbaikan Sanitasi & Air Bersih";
            } else if (!isUnhealthyHouse && hasStunting) {
                priority = 3;
                intervention = "GIZI SPESIFIK: Konseling Pola Asuh & Cek Penyakit";
            } else {
                priority = 4;
                intervention = "PEMANTAUAN RUTIN";
            }

            return {
                family,
                building,
                stunted_kids: stuntedKids,
                at_risk_members: members.filter(m => m.kategori === 'Ibu Hamil'),
                priority_score: priority,
                intervention_type: intervention
            };
        });
    };

    return (
        <IntegratedAnalysisContext.Provider value={{
            buildings,
            families,
            individuals,
            stuntingHistory,
            analysisResults,
            generateMockData,
            isLoading
        }}>
            {children}
        </IntegratedAnalysisContext.Provider>
    );
};
