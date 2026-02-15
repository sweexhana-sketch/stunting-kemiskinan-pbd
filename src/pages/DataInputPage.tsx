import { useState, useEffect } from "react";
import { useData } from "@/contexts/DataProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, AlertCircle, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DataInputPage = () => {
    const { data, updateRegionData } = useData();
    const { toast } = useToast();

    const [selectedRegion, setSelectedRegion] = useState<string>("");
    const [formData, setFormData] = useState({
        stunting: "",
        kemiskinan: "",
        perumahan: "",
        kk_p3ke: "",
        desil1: "",
        desil2: "",
        balita_t_2t: "",
    });

    // Load data when region is selected
    useEffect(() => {
        if (selectedRegion) {
            const regionData = data.find(d => d.kabupaten === selectedRegion);
            if (regionData) {
                setFormData({
                    stunting: (regionData.stunting ?? 0).toString(),
                    kemiskinan: (regionData.kemiskinan ?? 0).toString(),
                    perumahan: (regionData.rumah_layak_pct ?? 0).toString(),
                    kk_p3ke: (regionData.kk_p3ke ?? 0).toString(),
                    desil1: (regionData.desil1 ?? 0).toString(),
                    desil2: (regionData.desil2 ?? 0).toString(),
                    balita_t_2t: (regionData.balita_t_2t ?? 0).toString(),
                });
            }
        }
    }, [selectedRegion, data]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRegion) return;

        updateRegionData('name', selectedRegion, {
            stunting: parseFloat(formData.stunting),
            kemiskinan: parseFloat(formData.kemiskinan),
            rumah_layak_pct: parseFloat(formData.perumahan),
            kk_p3ke: parseInt(formData.kk_p3ke),
            desil1: parseInt(formData.desil1),
            desil2: parseInt(formData.desil2),
            balita_t_2t: parseInt(formData.balita_t_2t),
        });

        toast({
            title: "Data Berhasil Disimpan",
            description: `Data untuk ${selectedRegion} telah diperbarui dan analisis dijalankan ulang.`,
        });
    };

    const handleExportCSV = () => {
        const headers = ["ID Wilayah", "Kabupaten/Kota", "Jumlah KK (P3KE)", "KK Miskin (Desil 1)", "KK Miskin (Desil 2)", "Prevalensi Stunting (%)", "Balita T/2T", "Status", "Rekomendasi"];
        const rows = data.map(r => [
            r.id,
            r.kabupaten,
            r.kk_p3ke,
            r.desil1,
            r.desil2,
            r.stunting,
            r.balita_t_2t,
            r.status,
            getRecommendation(r)
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `data_stunting_pbd_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getRecommendation = (r: any) => {
        if (!r) return "-";
        if (r.status === "Kritis" || r.status === "Sangat Tinggi") {
            if (r.rumah_layak_pct < 40) return "Pembangunan MCK Komunal & Bedah Rumah";
            if (r.stunting > 30) return "Penyaluran bantuan pangan protein hewani lokal (ikan)";
            return "Intervensi Terpadu Kesehatan & PKH";
        }
        if (r.status === "Tinggi") return "Edukasi Gizi & Sanitasi Dasar";
        return "Pemantauan Rutin";
    };

    const currentRegion = data.find(d => d.kabupaten === selectedRegion);

    return (
        <div className="container mx-auto p-6 space-y-6 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Input Data & Analisis</h1>
                <p className="text-muted-foreground">
                    Update data terbaru untuk menjalankan analisis otomatis stunting dan kemiskinan.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Form Input Wilayah</CardTitle>
                        <CardDescription>Pilih wilayah dan masukkan data terbaru.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {data.length === 0 ? (
                                <div className="p-4 text-center text-red-500 font-medium bg-red-50 rounded-lg">
                                    Data wilayah tidak ditemukan. Harap refresh halaman.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label>Wilayah Administratif</Label>
                                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Kabupaten/Kota" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {data.map((region) => (
                                                <SelectItem key={region.id} value={region.kabupaten}>
                                                    {region.kabupaten}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="stunting">Stunting (%)</Label>
                                    <Input
                                        id="stunting"
                                        type="number"
                                        step="0.1"
                                        value={formData.stunting}
                                        onChange={(e) => setFormData({ ...formData, stunting: e.target.value })}
                                        required
                                        disabled={!selectedRegion}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="kemiskinan">Kemiskinan (%)</Label>
                                    <Input
                                        id="kemiskinan"
                                        type="number"
                                        step="0.1"
                                        value={formData.kemiskinan}
                                        onChange={(e) => setFormData({ ...formData, kemiskinan: e.target.value })}
                                        required
                                        disabled={!selectedRegion}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="perumahan">Rumah Layak (%)</Label>
                                    <Input
                                        id="perumahan"
                                        type="number"
                                        step="0.1"
                                        value={formData.perumahan}
                                        onChange={(e) => setFormData({ ...formData, perumahan: e.target.value })}
                                        required
                                        disabled={!selectedRegion}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kk_p3ke">Jumlah KK (P3KE)</Label>
                                    <Input
                                        id="kk_p3ke"
                                        type="number"
                                        value={formData.kk_p3ke}
                                        onChange={(e) => setFormData({ ...formData, kk_p3ke: e.target.value })}
                                        required
                                        disabled={!selectedRegion}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="desil1">Desil 1 (Sangat Miskin)</Label>
                                    <Input
                                        id="desil1"
                                        type="number"
                                        value={formData.desil1}
                                        onChange={(e) => setFormData({ ...formData, desil1: e.target.value })}
                                        required
                                        disabled={!selectedRegion}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="desil2">Desil 2 (Miskin)</Label>
                                    <Input
                                        id="desil2"
                                        type="number"
                                        value={formData.desil2}
                                        onChange={(e) => setFormData({ ...formData, desil2: e.target.value })}
                                        required
                                        disabled={!selectedRegion}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="balita_t_2t">Balita (T/2T) - Bawah Garis Merah</Label>
                                <Input
                                    id="balita_t_2t"
                                    type="number"
                                    value={formData.balita_t_2t}
                                    onChange={(e) => setFormData({ ...formData, balita_t_2t: e.target.value })}
                                    required
                                    disabled={!selectedRegion}
                                />
                            </div>

                                <div className="flex gap-2">
                                    <Button type="submit" className="flex-1" disabled={!selectedRegion}>
                                        <Save className="mr-2 h-4 w-4" />
                                        Simpan & Analisis
                                    </Button>
                                    <Button type="button" variant="outline" onClick={handleExportCSV}>
                                        Export CSV
                                    </Button>
                                </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle>Panduan Analisis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Status Otomatis</AlertTitle>
                            <AlertDescription>
                                Sistem akan otomatis menentukan status prioritas berdasarkan data yang Anda input:
                                <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                                    <li><strong>Prioritas Tinggi:</strong> Jika Stunting &gt; 20% atau Kemiskinan &gt; 10%</li>
                                    <li><strong>Prioritas Sedang:</strong> Ambang batas menengah</li>
                                    <li><strong>Baik:</strong> Jika semua indikator terkendali</li>
                                </ul>
                            </AlertDescription>
                        </Alert>

                        {selectedRegion && currentRegion && (
                            <Alert className={`border-l-4 ${currentRegion.status === 'Kritis' ? 'border-l-red-900 bg-red-50' : 'border-l-primary'}`}>
                                <Lightbulb className="h-4 w-4" />
                                <AlertTitle>Rekomendasi Kebijakan (Automated)</AlertTitle>
                                <AlertDescription>
                                    <p className="mt-1 font-semibold">{getRecommendation(currentRegion)}</p>
                                    <p className="text-xs mt-1 italic">Status Wilayah: {currentRegion.status}</p>
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="text-sm text-muted-foreground p-4">
                            <p>Perubahan data akan langsung tercermin pada:</p>
                            <ul className="list-disc list-inside mt-2">
                                <li>Dashboard Utama</li>
                                <li>Peta Spasial (GIS)</li>
                                <li>Prioritas Intervensi</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DataInputPage;
