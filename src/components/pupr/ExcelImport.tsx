import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { VillageInfrastructure } from '@/types/pupr';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ExcelImportProps {
    onImport: (villages: VillageInfrastructure[]) => void;
}

interface ParsedRow {
    kode_desa?: string;
    kabupaten?: string;
    kecamatan?: string;
    nama_desa?: string;
    [key: string]: any;
}

const ExcelImport: React.FC<ExcelImportProps> = ({ onImport }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<{
        success: boolean;
        message: string;
        count?: number;
    } | null>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        setProgress(0);
        setResult(null);

        try {
            // Read file
            const data = await file.arrayBuffer();
            setProgress(20);

            // Parse Excel
            const workbook = XLSX.read(data, { type: 'array' });
            setProgress(40);

            // Get first sheet (or specific sheet if known)
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert to JSON
            const jsonData: ParsedRow[] = XLSX.utils.sheet_to_json(worksheet);
            setProgress(60);

            // Filter for Papua Barat Daya data
            const pbdData = jsonData.filter((row) => {
                const provinsi = row['PROVINSI'] || row['provinsi'] || '';
                return provinsi.toLowerCase().includes('papua barat daya');
            });

            setProgress(70);

            // Map to VillageInfrastructure format
            const villages: VillageInfrastructure[] = pbdData.map((row, index) => {
                // Extract basic info
                const kode_desa = String(row['KODE_DESA'] || row['kode_desa'] || `AUTO_${Date.now()}_${index}`);
                const kabupaten = String(row['KABUPATEN'] || row['kabupaten'] || row['KAB_KOTA'] || '');
                const kecamatan = String(row['KECAMATAN'] || row['kecamatan'] || row['KEC'] || '');
                const nama_desa = String(row['DESA'] || row['desa'] || row['NAMA_DESA'] || row['nama_desa'] || '');

                // P3KE Data
                const total_kk_p3ke = Number(row['TOTAL_KK_P3KE'] || row['total_kk'] || row['JML_KK'] || 0);
                const kk_miskin_desil1 = Number(row['DESIL_1'] || row['desil1'] || row['KK_DESIL_1'] || 0);
                const kk_miskin_desil2 = Number(row['DESIL_2'] || row['desil2'] || row['KK_DESIL_2'] || 0);

                // Sheet 11 - Housing (look for various column name patterns)
                const s11_rumah_tidak_layak = Number(
                    row['S11_RUMAH_TIDAK_LAYAK'] ||
                    row['RUMAH_TIDAK_LAYAK'] ||
                    row['RTLH'] ||
                    0
                );
                const s11_lantai_tanah = Number(
                    row['S11_LANTAI_TANAH'] ||
                    row['LANTAI_TANAH'] ||
                    0
                );
                const s11_dinding_bambu_kayu = Number(
                    row['S11_DINDING_BAMBU'] ||
                    row['DINDING_BAMBU_KAYU'] ||
                    0
                );
                const s11_atap_tidak_layak = Number(
                    row['S11_ATAP_TIDAK_LAYAK'] ||
                    row['ATAP_TIDAK_LAYAK'] ||
                    0
                );

                // Sheet 12 - Water Supply
                const s12_air_tidak_layak = Number(
                    row['S12_AIR_TIDAK_LAYAK'] ||
                    row['AIR_TIDAK_LAYAK'] ||
                    row['KK_AIR_TIDAK_LAYAK'] ||
                    0
                );
                const s12_air_hujan = Number(
                    row['S12_AIR_HUJAN'] ||
                    row['AIR_HUJAN'] ||
                    0
                );
                const s12_mata_air_terbuka = Number(
                    row['S12_MATA_AIR_TERBUKA'] ||
                    row['MATA_AIR_TERBUKA'] ||
                    0
                );
                const s12_sungai = Number(
                    row['S12_SUNGAI'] ||
                    row['AIR_SUNGAI'] ||
                    0
                );
                const s12_sumur_tidak_terlindung = Number(
                    row['S12_SUMUR_TIDAK_TERLINDUNG'] ||
                    row['SUMUR_TIDAK_TERLINDUNG'] ||
                    0
                );

                // Sheet 16 - Toilet Ownership
                const s16_tanpa_jamban_sendiri = Number(
                    row['S16_TANPA_JAMBAN_SENDIRI'] ||
                    row['TANPA_JAMBAN_SENDIRI'] ||
                    row['TIDAK_PUNYA_JAMBAN'] ||
                    0
                );
                const s16_jamban_bersama = Number(
                    row['S16_JAMBAN_BERSAMA'] ||
                    row['JAMBAN_BERSAMA'] ||
                    0
                );
                const s16_jamban_umum = Number(
                    row['S16_JAMBAN_UMUM'] ||
                    row['JAMBAN_UMUM'] ||
                    0
                );
                const s16_tidak_ada_jamban = Number(
                    row['S16_TIDAK_ADA_JAMBAN'] ||
                    row['TIDAK_ADA_JAMBAN'] ||
                    0
                );

                // Sheet 17 - Waste Disposal
                const s17_pembuangan_terbuka = Number(
                    row['S17_PEMBUANGAN_TERBUKA'] ||
                    row['PEMBUANGAN_TERBUKA'] ||
                    row['LIMBAH_TERBUKA'] ||
                    0
                );
                const s17_lubang_tanah = Number(
                    row['S17_LUBANG_TANAH'] ||
                    row['LUBANG_TANAH'] ||
                    0
                );
                const s17_pantai_sungai = Number(
                    row['S17_PANTAI_SUNGAI'] ||
                    row['PEMBUANGAN_PANTAI_SUNGAI'] ||
                    0
                );
                const s17_tanpa_septictank = Number(
                    row['S17_TANPA_SEPTICTANK'] ||
                    row['TANPA_SEPTICTANK'] ||
                    row['TIDAK_ADA_SEPTICTANK'] ||
                    0
                );

                return {
                    id: kode_desa,
                    kode_desa,
                    kabupaten,
                    kecamatan,
                    nama_desa,
                    kk_miskin_desil1,
                    kk_miskin_desil2,
                    total_kk_p3ke,
                    s11_rumah_tidak_layak,
                    s11_lantai_tanah,
                    s11_dinding_bambu_kayu,
                    s11_atap_tidak_layak,
                    s12_air_tidak_layak,
                    s12_air_hujan,
                    s12_mata_air_terbuka,
                    s12_sungai,
                    s12_sumur_tidak_terlindung,
                    s16_tanpa_jamban_sendiri,
                    s16_jamban_bersama,
                    s16_jamban_umum,
                    s16_tidak_ada_jamban,
                    s17_pembuangan_terbuka,
                    s17_lubang_tanah,
                    s17_pantai_sungai,
                    s17_tanpa_septictank,
                    skor_resiko_sanitasi: 0, // Will be calculated by context
                    prioritas_intervensi: 'P4' as const, // Will be calculated by context
                    status_lokus: 'Hijau' as const, // Will be calculated by context
                };
            });

            setProgress(90);

            // Validate data
            const validVillages = villages.filter(v =>
                v.nama_desa && v.kabupaten && v.total_kk_p3ke > 0
            );

            setProgress(100);

            if (validVillages.length === 0) {
                setResult({
                    success: false,
                    message: 'Tidak ada data valid yang ditemukan. Pastikan file Excel memiliki kolom yang sesuai.',
                });
            } else {
                onImport(validVillages);
                setResult({
                    success: true,
                    message: `Berhasil mengimport ${validVillages.length} desa dari ${pbdData.length} baris data Papua Barat Daya.`,
                    count: validVillages.length,
                });
            }
        } catch (error) {
            console.error('Error parsing Excel:', error);
            setResult({
                success: false,
                message: `Gagal membaca file: ${error instanceof Error ? error.message : 'Unknown error'}`,
            });
        } finally {
            setIsProcessing(false);
            // Reset file input
            event.target.value = '';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5" />
                    Import Data dari Excel
                </CardTitle>
                <CardDescription>
                    Upload file Excel (XLSX/XLSB) untuk mengisi data infrastruktur desa secara otomatis
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <input
                        type="file"
                        accept=".xlsx,.xls,.xlsb"
                        onChange={handleFileUpload}
                        disabled={isProcessing}
                        className="hidden"
                        id="excel-upload"
                    />
                    <label
                        htmlFor="excel-upload"
                        className={`cursor-pointer flex flex-col items-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <Upload className="w-12 h-12 text-muted-foreground" />
                        <div>
                            <p className="font-medium">
                                {isProcessing ? 'Memproses file...' : 'Klik untuk upload file Excel'}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Mendukung format .xlsx, .xls, dan .xlsb
                            </p>
                        </div>
                    </label>
                </div>

                {isProcessing && (
                    <div className="space-y-2">
                        <Progress value={progress} className="w-full" />
                        <p className="text-sm text-muted-foreground text-center">
                            {progress}% - Memproses data...
                        </p>
                    </div>
                )}

                {result && (
                    <Alert variant={result.success ? 'default' : 'destructive'}>
                        {result.success ? (
                            <CheckCircle className="h-4 w-4" />
                        ) : (
                            <AlertCircle className="h-4 w-4" />
                        )}
                        <AlertDescription>{result.message}</AlertDescription>
                    </Alert>
                )}

                <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
                    <p className="font-semibold">Format Excel yang Diharapkan:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Kolom PROVINSI harus berisi "Papua Barat Daya"</li>
                        <li>Kolom identitas: KODE_DESA, KABUPATEN, KECAMATAN, DESA/NAMA_DESA</li>
                        <li>Kolom P3KE: TOTAL_KK_P3KE, DESIL_1, DESIL_2</li>
                        <li>Kolom Sheet 11: S11_RUMAH_TIDAK_LAYAK, S11_LANTAI_TANAH, dll</li>
                        <li>Kolom Sheet 12: S12_AIR_TIDAK_LAYAK, S12_AIR_HUJAN, dll</li>
                        <li>Kolom Sheet 16: S16_TANPA_JAMBAN_SENDIRI, dll</li>
                        <li>Kolom Sheet 17: S17_PEMBUANGAN_TERBUKA, dll</li>
                    </ul>
                    <p className="text-xs italic mt-2">
                        * Sistem akan mencoba mencocokkan nama kolom secara fleksibel
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            // Download template
                            const template = [
                                {
                                    PROVINSI: 'Papua Barat Daya',
                                    KABUPATEN: 'Kabupaten Sorong',
                                    KECAMATAN: 'Aimas',
                                    DESA: 'Contoh Desa',
                                    KODE_DESA: '9201011001',
                                    TOTAL_KK_P3KE: 450,
                                    DESIL_1: 120,
                                    DESIL_2: 85,
                                    S11_RUMAH_TIDAK_LAYAK: 45,
                                    S11_LANTAI_TANAH: 78,
                                    S11_DINDING_BAMBU: 92,
                                    S11_ATAP_TIDAK_LAYAK: 35,
                                    S12_AIR_TIDAK_LAYAK: 180,
                                    S12_AIR_HUJAN: 45,
                                    S12_MATA_AIR_TERBUKA: 67,
                                    S12_SUNGAI: 68,
                                    S12_SUMUR_TIDAK_TERLINDUNG: 0,
                                    S16_TANPA_JAMBAN_SENDIRI: 210,
                                    S16_JAMBAN_BERSAMA: 85,
                                    S16_JAMBAN_UMUM: 45,
                                    S16_TIDAK_ADA_JAMBAN: 80,
                                    S17_PEMBUANGAN_TERBUKA: 195,
                                    S17_LUBANG_TANAH: 120,
                                    S17_PANTAI_SUNGAI: 45,
                                    S17_TANPA_SEPTICTANK: 230,
                                },
                            ];

                            const ws = XLSX.utils.json_to_sheet(template);
                            const wb = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(wb, ws, 'Template');
                            XLSX.writeFile(wb, 'template_pupr_import.xlsx');
                        }}
                    >
                        Download Template Excel
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ExcelImport;
