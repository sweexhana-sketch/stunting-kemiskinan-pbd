import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIntegratedAnalysis } from '@/contexts/IntegratedAnalysisContext';

const InterventionMatrix = () => {
    const { analysisResults } = useIntegratedAnalysis();

    // Group by Priority
    const p1 = analysisResults.filter(r => r.priority_score === 1);
    const p2 = analysisResults.filter(r => r.priority_score === 2);
    const p3 = analysisResults.filter(r => r.priority_score === 3);
    const p4 = analysisResults.filter(r => r.priority_score === 4);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full p-4">
            {/* Quadrant 1: High Priority */}
            <Card className="border-4 border-red-500 bg-red-50 dark:bg-red-900/20">
                <CardHeader>
                    <CardTitle className="text-red-700 flex justify-between items-center">
                        <span>P1: INTERVENSI TOTAL (Zona Merah)</span>
                        <Badge variant="destructive" className="text-xl">{p1.length} KK</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold mb-2">Stunting + Miskin + Rumah Tidak Layak</p>
                    <ul className="list-disc pl-5 text-sm text-red-800 dark:text-red-200">
                        <li>Intervensi Fisik: Bedah Rumah, Sanitasi, Air Bersih</li>
                        <li>Intervensi Gizi: PMT, Vitamin</li>
                        <li>Intervensi Sosial: PKH/Bansos</li>
                    </ul>
                </CardContent>
            </Card>

            {/* Quadrant 2: Prevention */}
            <Card className="border-4 border-orange-400 bg-orange-50 dark:bg-orange-900/20">
                <CardHeader>
                    <CardTitle className="text-orange-700 flex justify-between items-center">
                        <span>P2: PENCEGAHAN (Infrastruktur)</span>
                        <Badge className="text-xl bg-orange-500">{p2.length} KK</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold mb-2">Miskin + Rumah Tidak Layak (Tanpa Stunting)</p>
                    <ul className="list-disc pl-5 text-sm text-orange-800 dark:text-orange-200">
                        <li>Fokus: Perbaikan Lingkungan untuk mencegah stunting baru.</li>
                        <li>Prioritas PUPR: Penyediaan akses air minum & sanitasi layak.</li>
                    </ul>
                </CardContent>
            </Card>

            {/* Quadrant 3: Specific Nutrition */}
            <Card className="border-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
                <CardHeader>
                    <CardTitle className="text-yellow-700 flex justify-between items-center">
                        <span>P3: GIZI SPESIFIK (Perilaku)</span>
                        <Badge className="text-xl bg-yellow-500">{p3.length} KK</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold mb-2">Stunting + Rumah Layak</p>
                    <ul className="list-disc pl-5 text-sm text-yellow-800 dark:text-yellow-200">
                        <li>Masalah bukan pada ekonomi/lingkungan.</li>
                        <li>Fokus: Edukasi Pola Asuh, Cek Penyakit Bawaan/Infeksi.</li>
                    </ul>
                </CardContent>
            </Card>

            {/* Quadrant 4: Secure */}
            <Card className="border-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                <CardHeader>
                    <CardTitle className="text-green-700 flex justify-between items-center">
                        <span>P4: AMAN / PEMANTAUAN</span>
                        <Badge className="text-xl bg-green-500">{p4.length} KK</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold mb-2">Sejahtera + Rumah Layak + Sehat</p>
                    <ul className="list-disc pl-5 text-sm text-green-800 dark:text-green-200">
                        <li>Kondisi ideal. Lanjutkan pemantauan rutin di Posyandu.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default InterventionMatrix;
