// PUPR Infrastructure Data Types
// Based on nasional_40_persen_desa.xlsb Sheets 11, 12, 16, 17

export interface VillageInfrastructure {
    id: string; // Unique ID
    kode_desa: string; // Village code
    kabupaten: string; // District name
    kecamatan: string; // Sub-district
    nama_desa: string; // Village name

    // Poverty Data (P3KE)
    kk_miskin_desil1: number; // Households in Desil 1 (poorest)
    kk_miskin_desil2: number; // Households in Desil 2
    total_kk_p3ke: number; // Total P3KE households

    // Sheet 11: Building/Housing Indicators
    s11_rumah_tidak_layak: number; // Uninhabitable houses (units)
    s11_lantai_tanah: number; // Houses with dirt floor
    s11_dinding_bambu_kayu: number; // Houses with bamboo/wood walls
    s11_atap_tidak_layak: number; // Houses with inadequate roofing

    // Sheet 12: Water Supply Indicators
    s12_air_tidak_layak: number; // Households without proper water (KK)
    s12_air_hujan: number; // Households using rainwater
    s12_mata_air_terbuka: number; // Households using open spring water
    s12_sungai: number; // Households using river water
    s12_sumur_tidak_terlindung: number; // Unprotected wells

    // Sheet 16: Sanitation - Toilet Ownership
    s16_tanpa_jamban_sendiri: number; // Households without own toilet (KK)
    s16_jamban_bersama: number; // Shared toilet
    s16_jamban_umum: number; // Public toilet
    s16_tidak_ada_jamban: number; // No toilet access

    // Sheet 17: Sanitation - Waste Disposal
    s17_pembuangan_terbuka: number; // Open drainage/disposal (KK)
    s17_lubang_tanah: number; // Disposal to ground pit
    s17_pantai_sungai: number; // Disposal to beach/river
    s17_tanpa_septictank: number; // Without septic tank

    // Calculated Fields
    skor_resiko_sanitasi: number; // Sanitation risk score (1-10)
    prioritas_intervensi: 'P1' | 'P2' | 'P3' | 'P4'; // Intervention priority
    status_lokus: 'Merah' | 'Kuning' | 'Hijau'; // Red/Yellow/Green zone
}

export interface PUPRRecommendation {
    village_id: string;
    kabupaten: string;
    nama_desa: string;

    // Sector-specific recommendations
    perumahan: {
        needed: boolean;
        program: 'BSPS' | 'Rutilahu' | 'None'; // Housing programs
        target_kk: number;
        estimated_budget: number;
        description: string;
    };

    air_minum: {
        needed: boolean;
        program: 'SPAM' | 'Sumur Bor' | 'PAH' | 'None'; // Water programs
        capacity_needed: number; // in liters/day
        target_kk: number;
        estimated_budget: number;
        description: string;
    };

    sanitasi: {
        needed: boolean;
        program: 'Jamban' | 'IPAL Komunal' | 'Septictank' | 'None';
        target_kk: number;
        estimated_budget: number;
        description: string;
    };

    drainase: {
        needed: boolean;
        program: 'Drainase Lingkungan' | 'None';
        panjang_needed: number; // in meters
        estimated_budget: number;
        description: string;
    };

    // Total
    total_budget: number;
    priority_rank: number;
    stunting_correlation: 'Tinggi' | 'Sedang' | 'Rendah';
}

export interface PUPRBudgetStandard {
    // Unit costs (in IDR)
    bsps_per_unit: number; // Housing assistance per unit
    rutilahu_per_unit: number; // Housing renovation per unit
    spam_per_kk: number; // Water system per household
    sumur_bor_per_unit: number; // Borewell per unit
    jamban_per_unit: number; // Toilet per unit
    ipal_komunal_per_unit: number; // Communal WWTP per unit
    septictank_per_unit: number; // Septic tank per unit
    drainase_per_meter: number; // Drainage per meter
}

export interface PUPRAnalysisResult {
    summary: {
        total_villages: number;
        total_kk_targeted: number;
        total_budget_needed: number;
        priority_p1_count: number;
        priority_p2_count: number;
        red_zone_count: number;
    };

    by_kabupaten: {
        [kabupaten: string]: {
            villages_count: number;
            total_kk: number;
            budget_needed: number;
            top_needs: string[]; // ['Air Minum', 'Sanitasi', etc.]
        };
    };

    recommendations: PUPRRecommendation[];

    stunting_correlation: {
        high_stunting_poor_sanitation: number; // Count of villages
        correlation_strength: number; // 0-1
    };
}

// Analysis Criteria
export interface PUPRAnalysisCriteria {
    // Sheet 11 thresholds
    s11_threshold_pct: number; // % of KK with poor housing to trigger BSPS

    // Sheet 12 thresholds
    s12_threshold_pct: number; // % of KK without proper water to trigger SPAM

    // Sheet 16 & 17 thresholds
    s16_threshold_pct: number; // % of KK without own toilet
    s17_threshold_pct: number; // % of KK with open disposal

    // Priority classification
    p1_stunting_threshold: number; // Stunting % for P1
    p1_poverty_threshold: number; // Poverty % for P1
    red_zone_combined_threshold: number; // Combined score for red zone
}
