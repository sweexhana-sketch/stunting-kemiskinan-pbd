import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    VillageInfrastructure,
    PUPRRecommendation,
    PUPRBudgetStandard,
    PUPRAnalysisResult,
    PUPRAnalysisCriteria
} from '@/types/pupr';

interface PUPRContextType {
    villages: VillageInfrastructure[];
    budgetStandards: PUPRBudgetStandard;
    criteria: PUPRAnalysisCriteria;
    addVillage: (village: VillageInfrastructure) => void;
    bulkAddVillages: (villages: VillageInfrastructure[]) => void;
    updateVillage: (id: string, data: Partial<VillageInfrastructure>) => void;
    deleteVillage: (id: string) => void;
    updateBudgetStandards: (standards: Partial<PUPRBudgetStandard>) => void;
    updateCriteria: (criteria: Partial<PUPRAnalysisCriteria>) => void;
    getAnalysisResults: () => PUPRAnalysisResult;
    getRecommendations: () => PUPRRecommendation[];
    exportToCSV: () => void;
}

const PUPRContext = createContext<PUPRContextType | undefined>(undefined);

export const usePUPR = () => {
    const context = useContext(PUPRContext);
    if (!context) {
        throw new Error('usePUPR must be used within a PUPRProvider');
    }
    return context;
};

// Default budget standards (in IDR)
const defaultBudgetStandards: PUPRBudgetStandard = {
    bsps_per_unit: 17500000, // 17.5 juta per unit
    rutilahu_per_unit: 25000000, // 25 juta per unit
    spam_per_kk: 3500000, // 3.5 juta per KK
    sumur_bor_per_unit: 15000000, // 15 juta per unit
    jamban_per_unit: 2500000, // 2.5 juta per unit
    ipal_komunal_per_unit: 150000000, // 150 juta per unit
    septictank_per_unit: 5000000, // 5 juta per unit
    drainase_per_meter: 500000, // 500 ribu per meter
};

// Default analysis criteria
const defaultCriteria: PUPRAnalysisCriteria = {
    s11_threshold_pct: 30, // 30% KK with poor housing
    s12_threshold_pct: 40, // 40% KK without proper water
    s16_threshold_pct: 50, // 50% KK without own toilet
    s17_threshold_pct: 40, // 40% KK with open disposal
    p1_stunting_threshold: 35, // 35% stunting for P1
    p1_poverty_threshold: 25, // 25% poverty for P1
    red_zone_combined_threshold: 70, // Combined score >= 70 for red zone
};

// Initial sample data for Papua Barat Daya
const initialVillages: VillageInfrastructure[] = [
    {
        id: '1',
        kode_desa: '9201011001',
        kabupaten: 'Kabupaten Sorong',
        kecamatan: 'Aimas',
        nama_desa: 'Klasaman',
        kk_miskin_desil1: 120,
        kk_miskin_desil2: 85,
        total_kk_p3ke: 450,
        s11_rumah_tidak_layak: 45,
        s11_lantai_tanah: 78,
        s11_dinding_bambu_kayu: 92,
        s11_atap_tidak_layak: 35,
        s12_air_tidak_layak: 180,
        s12_air_hujan: 45,
        s12_mata_air_terbuka: 67,
        s12_sungai: 68,
        s12_sumur_tidak_terlindung: 0,
        s16_tanpa_jamban_sendiri: 210,
        s16_jamban_bersama: 85,
        s16_jamban_umum: 45,
        s16_tidak_ada_jamban: 80,
        s17_pembuangan_terbuka: 195,
        s17_lubang_tanah: 120,
        s17_pantai_sungai: 45,
        s17_tanpa_septictank: 230,
        skor_resiko_sanitasi: 7.5,
        prioritas_intervensi: 'P1',
        status_lokus: 'Merah',
    },
];

export const PUPRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [villages, setVillages] = useState<VillageInfrastructure[]>(() => {
        const saved = localStorage.getItem('pupr-villages-data');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse PUPR data', e);
            }
        }
        return initialVillages;
    });

    const [budgetStandards, setBudgetStandards] = useState<PUPRBudgetStandard>(() => {
        const saved = localStorage.getItem('pupr-budget-standards');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse budget standards', e);
            }
        }
        return defaultBudgetStandards;
    });

    const [criteria, setCriteria] = useState<PUPRAnalysisCriteria>(() => {
        const saved = localStorage.getItem('pupr-criteria');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse criteria', e);
            }
        }
        return defaultCriteria;
    });

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('pupr-villages-data', JSON.stringify(villages));
    }, [villages]);

    useEffect(() => {
        localStorage.setItem('pupr-budget-standards', JSON.stringify(budgetStandards));
    }, [budgetStandards]);

    useEffect(() => {
        localStorage.setItem('pupr-criteria', JSON.stringify(criteria));
    }, [criteria]);

    // Calculate sanitation risk score (1-10)
    const calculateSanitationScore = (village: VillageInfrastructure): number => {
        const total_kk = village.total_kk_p3ke || 1;

        const s16_pct = (village.s16_tanpa_jamban_sendiri / total_kk) * 100;
        const s17_pct = (village.s17_pembuangan_terbuka / total_kk) * 100;
        const s12_pct = (village.s12_air_tidak_layak / total_kk) * 100;

        // Weighted score
        const score = (s16_pct * 0.4 + s17_pct * 0.4 + s12_pct * 0.2) / 10;
        return Math.min(10, Math.max(1, score));
    };

    // Determine intervention priority
    const calculatePriority = (village: VillageInfrastructure): 'P1' | 'P2' | 'P3' | 'P4' => {
        const sanitationScore = village.skor_resiko_sanitasi;
        const total_kk = village.total_kk_p3ke || 1;
        const desil1_pct = (village.kk_miskin_desil1 / total_kk) * 100;

        if (sanitationScore >= 7 && desil1_pct >= 25) return 'P1';
        if (sanitationScore >= 5 || desil1_pct >= 20) return 'P2';
        if (sanitationScore >= 3) return 'P3';
        return 'P4';
    };

    // Determine lokus status
    const calculateLokusStatus = (village: VillageInfrastructure): 'Merah' | 'Kuning' | 'Hijau' => {
        const total_kk = village.total_kk_p3ke || 1;
        const s12_pct = (village.s12_air_tidak_layak / total_kk) * 100;
        const s16_pct = (village.s16_tanpa_jamban_sendiri / total_kk) * 100;
        const poverty_pct = ((village.kk_miskin_desil1 + village.kk_miskin_desil2) / total_kk) * 100;

        const combined_score = (s12_pct + s16_pct + poverty_pct) / 3;

        if (combined_score >= criteria.red_zone_combined_threshold) return 'Merah';
        if (combined_score >= 40) return 'Kuning';
        return 'Hijau';
    };

    const addVillage = (village: VillageInfrastructure) => {
        const enrichedVillage = {
            ...village,
            skor_resiko_sanitasi: calculateSanitationScore(village),
        };
        enrichedVillage.prioritas_intervensi = calculatePriority(enrichedVillage);
        enrichedVillage.status_lokus = calculateLokusStatus(enrichedVillage);

        setVillages(prev => [...prev, enrichedVillage]);
    };

    const bulkAddVillages = (newVillages: VillageInfrastructure[]) => {
        const enrichedVillages = newVillages.map(village => {
            const enriched = {
                ...village,
                skor_resiko_sanitasi: calculateSanitationScore(village),
            };
            enriched.prioritas_intervensi = calculatePriority(enriched);
            enriched.status_lokus = calculateLokusStatus(enriched);
            return enriched;
        });

        setVillages(prev => [...prev, ...enrichedVillages]);
    };

    const updateVillage = (id: string, data: Partial<VillageInfrastructure>) => {
        setVillages(prev => prev.map(v => {
            if (v.id === id) {
                const updated = { ...v, ...data };
                updated.skor_resiko_sanitasi = calculateSanitationScore(updated);
                updated.prioritas_intervensi = calculatePriority(updated);
                updated.status_lokus = calculateLokusStatus(updated);
                return updated;
            }
            return v;
        }));
    };

    const deleteVillage = (id: string) => {
        setVillages(prev => prev.filter(v => v.id !== id));
    };

    const updateBudgetStandards = (standards: Partial<PUPRBudgetStandard>) => {
        setBudgetStandards(prev => ({ ...prev, ...standards }));
    };

    const updateCriteria = (newCriteria: Partial<PUPRAnalysisCriteria>) => {
        setCriteria(prev => ({ ...prev, ...newCriteria }));
    };

    // Generate recommendations for a village
    const generateRecommendation = (village: VillageInfrastructure): PUPRRecommendation => {
        const total_kk = village.total_kk_p3ke || 1;

        // Housing analysis (Sheet 11)
        const s11_pct = (village.s11_rumah_tidak_layak / total_kk) * 100;
        const housingNeeded = s11_pct >= criteria.s11_threshold_pct;
        const housingProgram = s11_pct >= 50 ? 'Rutilahu' : 'BSPS';
        const housingBudget = housingNeeded
            ? village.s11_rumah_tidak_layak * (housingProgram === 'BSPS' ? budgetStandards.bsps_per_unit : budgetStandards.rutilahu_per_unit)
            : 0;

        // Water analysis (Sheet 12)
        const s12_pct = (village.s12_air_tidak_layak / total_kk) * 100;
        const waterNeeded = s12_pct >= criteria.s12_threshold_pct;
        const waterProgram = s12_pct >= 60 ? 'SPAM' : 'Sumur Bor';
        const waterBudget = waterNeeded
            ? village.s12_air_tidak_layak * (waterProgram === 'SPAM' ? budgetStandards.spam_per_kk : budgetStandards.sumur_bor_per_unit / 10)
            : 0;

        // Sanitation analysis (Sheet 16 & 17)
        const s16_pct = (village.s16_tanpa_jamban_sendiri / total_kk) * 100;
        const s17_pct = (village.s17_pembuangan_terbuka / total_kk) * 100;
        const sanitationNeeded = s16_pct >= criteria.s16_threshold_pct || s17_pct >= criteria.s17_threshold_pct;

        let sanitationProgram: 'Jamban' | 'IPAL Komunal' | 'Septictank' | 'None' = 'None';
        let sanitationBudget = 0;

        if (sanitationNeeded) {
            if (s17_pct >= 50 && village.s17_pantai_sungai > 20) {
                sanitationProgram = 'IPAL Komunal';
                sanitationBudget = Math.ceil(village.s17_pembuangan_terbuka / 50) * budgetStandards.ipal_komunal_per_unit;
            } else if (s16_pct >= 60) {
                sanitationProgram = 'Jamban';
                sanitationBudget = village.s16_tanpa_jamban_sendiri * budgetStandards.jamban_per_unit;
            } else {
                sanitationProgram = 'Septictank';
                sanitationBudget = village.s17_tanpa_septictank * budgetStandards.septictank_per_unit;
            }
        }

        // Drainage analysis
        const drainageNeeded = s17_pct >= 40;
        const drainageBudget = drainageNeeded
            ? village.s17_pembuangan_terbuka * 20 * budgetStandards.drainase_per_meter // Assume 20m per KK
            : 0;

        const totalBudget = housingBudget + waterBudget + sanitationBudget + drainageBudget;

        // Stunting correlation
        const stuntingCorrelation: 'Tinggi' | 'Sedang' | 'Rendah' =
            village.skor_resiko_sanitasi >= 7 ? 'Tinggi' :
                village.skor_resiko_sanitasi >= 4 ? 'Sedang' : 'Rendah';

        return {
            village_id: village.id,
            kabupaten: village.kabupaten,
            nama_desa: village.nama_desa,
            perumahan: {
                needed: housingNeeded,
                program: housingNeeded ? housingProgram : 'None',
                target_kk: village.s11_rumah_tidak_layak,
                estimated_budget: housingBudget,
                description: housingNeeded
                    ? `${s11_pct.toFixed(1)}% KK memiliki rumah tidak layak. Program ${housingProgram} diperlukan untuk ${village.s11_rumah_tidak_layak} unit.`
                    : 'Kondisi perumahan memadai',
            },
            air_minum: {
                needed: waterNeeded,
                program: waterNeeded ? waterProgram : 'None',
                capacity_needed: waterNeeded ? village.s12_air_tidak_layak * 150 : 0, // 150 L/day per KK
                target_kk: village.s12_air_tidak_layak,
                estimated_budget: waterBudget,
                description: waterNeeded
                    ? `${s12_pct.toFixed(1)}% KK tanpa akses air minum layak. Dibutuhkan ${waterProgram} untuk ${village.s12_air_tidak_layak} KK.`
                    : 'Akses air minum memadai',
            },
            sanitasi: {
                needed: sanitationNeeded,
                program: sanitationProgram,
                target_kk: Math.max(village.s16_tanpa_jamban_sendiri, village.s17_pembuangan_terbuka),
                estimated_budget: sanitationBudget,
                description: sanitationNeeded
                    ? `${s16_pct.toFixed(1)}% KK tanpa jamban sendiri, ${s17_pct.toFixed(1)}% dengan pembuangan terbuka. Program ${sanitationProgram} diperlukan.`
                    : 'Sanitasi memadai',
            },
            drainase: {
                needed: drainageNeeded,
                program: drainageNeeded ? 'Drainase Lingkungan' : 'None',
                panjang_needed: drainageNeeded ? village.s17_pembuangan_terbuka * 20 : 0,
                estimated_budget: drainageBudget,
                description: drainageNeeded
                    ? `Dibutuhkan drainase lingkungan sepanjang ${village.s17_pembuangan_terbuka * 20}m untuk mengatasi pembuangan terbuka.`
                    : 'Drainase memadai',
            },
            total_budget: totalBudget,
            priority_rank: village.prioritas_intervensi === 'P1' ? 1 : village.prioritas_intervensi === 'P2' ? 2 : village.prioritas_intervensi === 'P3' ? 3 : 4,
            stunting_correlation: stuntingCorrelation,
        };
    };

    const getRecommendations = (): PUPRRecommendation[] => {
        return villages.map(generateRecommendation).sort((a, b) => a.priority_rank - b.priority_rank);
    };

    const getAnalysisResults = (): PUPRAnalysisResult => {
        const recommendations = getRecommendations();

        const summary = {
            total_villages: villages.length,
            total_kk_targeted: villages.reduce((sum, v) => sum + v.total_kk_p3ke, 0),
            total_budget_needed: recommendations.reduce((sum, r) => sum + r.total_budget, 0),
            priority_p1_count: villages.filter(v => v.prioritas_intervensi === 'P1').length,
            priority_p2_count: villages.filter(v => v.prioritas_intervensi === 'P2').length,
            red_zone_count: villages.filter(v => v.status_lokus === 'Merah').length,
        };

        const by_kabupaten: { [key: string]: any } = {};
        villages.forEach(v => {
            if (!by_kabupaten[v.kabupaten]) {
                by_kabupaten[v.kabupaten] = {
                    villages_count: 0,
                    total_kk: 0,
                    budget_needed: 0,
                    top_needs: [] as string[],
                };
            }
            by_kabupaten[v.kabupaten].villages_count++;
            by_kabupaten[v.kabupaten].total_kk += v.total_kk_p3ke;
        });

        recommendations.forEach(r => {
            if (by_kabupaten[r.kabupaten]) {
                by_kabupaten[r.kabupaten].budget_needed += r.total_budget;
            }
        });

        const highStuntingPoorSanitation = villages.filter(v =>
            v.skor_resiko_sanitasi >= 6 // Assuming high stunting areas
        ).length;

        return {
            summary,
            by_kabupaten,
            recommendations,
            stunting_correlation: {
                high_stunting_poor_sanitation: highStuntingPoorSanitation,
                correlation_strength: highStuntingPoorSanitation / Math.max(villages.length, 1),
            },
        };
    };

    const exportToCSV = () => {
        const recommendations = getRecommendations();
        const headers = [
            'Kabupaten', 'Desa', 'Total KK P3KE', 'Desil 1', 'Desil 2',
            'Rumah Tidak Layak', 'Air Tidak Layak', 'Tanpa Jamban', 'Pembuangan Terbuka',
            'Skor Sanitasi', 'Prioritas', 'Status Lokus',
            'Program Perumahan', 'Program Air', 'Program Sanitasi', 'Program Drainase',
            'Total Anggaran', 'Korelasi Stunting'
        ];

        const rows = recommendations.map(r => {
            const village = villages.find(v => v.id === r.village_id)!;
            return [
                village.kabupaten,
                village.nama_desa,
                village.total_kk_p3ke,
                village.kk_miskin_desil1,
                village.kk_miskin_desil2,
                village.s11_rumah_tidak_layak,
                village.s12_air_tidak_layak,
                village.s16_tanpa_jamban_sendiri,
                village.s17_pembuangan_terbuka,
                village.skor_resiko_sanitasi,
                village.prioritas_intervensi,
                village.status_lokus,
                r.perumahan.program,
                r.air_minum.program,
                r.sanitasi.program,
                r.drainase.program,
                r.total_budget,
                r.stunting_correlation,
            ];
        });

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pupr_intervention_matrix_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <PUPRContext.Provider value={{
            villages,
            budgetStandards,
            criteria,
            addVillage,
            bulkAddVillages,
            updateVillage,
            deleteVillage,
            updateBudgetStandards,
            updateCriteria,
            getAnalysisResults,
            getRecommendations,
            exportToCSV,
        }}>
            {children}
        </PUPRContext.Provider>
    );
};
