export interface Building {
    id: string; // UUID
    alamat_lengkap: string;
    latitude: number;
    longitude: number;
    jenis_lantai: 'Tanah' | 'Semen' | 'Keramik' | 'Ubin';
    jenis_dinding: 'Bambu' | 'Kayu' | 'Tembok';
    sumber_air_minum: 'Sumur Gali' | 'PDAM' | 'Sungai' | 'Mata Air';
    kepemilikan_jamban: boolean;
    jenis_kloset: 'Leher Angsa' | 'Plengsengan' | 'Cemplung' | 'Tidak Ada';
    status_kawasan: 'Kumuh' | 'Bukan Kumuh';
}

export interface Family {
    no_kk: string;
    id_bangunan: string; // FK to Building
    kepala_keluarga: string;
    jumlah_anggota: number;
    status_dtks: 'Desil 1' | 'Desil 2' | 'Desil 3' | 'Non-DTKS';
    pendapatan_rata_rata: number;
    penerima_bantuan: string[]; // ["PKH", "BPNT", "KIS"]
    status_lahan: 'Milik Sendiri' | 'Sewa' | 'Menumpang';
}

export interface Individual {
    nik: string;
    no_kk: string; // FK to Family
    nama_lengkap: string;
    tanggal_lahir: string; // YYYY-MM-DD
    jenis_kelamin: 'L' | 'P';
    nama_ibu_kandung: string;
    kategori: 'Balita' | 'Ibu Hamil' | 'Lansia' | 'Usia Produktif' | 'Anak';
}

export interface StuntingHistory {
    id_pengukuran: string;
    nik_balita: string; // FK to Individual
    tanggal_ukur: string; // YYYY-MM-DD
    usia_bulan: number;
    tinggi_badan: number;
    berat_badan: number;
    status_gizi_tb_u: 'Sangat Pendek' | 'Pendek' | 'Normal' | 'Tinggi';
    intervensi_diterima: string[];
}

// Joined View for Analysis
export interface FamilyAnalysisProfile {
    family: Family;
    building: Building;
    stunted_kids: StuntingHistory[]; // List of stunted records for this family
    at_risk_members: Individual[]; // Pregnant moms, etc.
    priority_score: 1 | 2 | 3 | 4; // 1 = Highest Priority (Red Zone)
    intervention_type: string; // Recommendation
}
