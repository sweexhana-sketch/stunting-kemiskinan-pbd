import { useState, useEffect } from "react";
import { useData } from "@/contexts/DataProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DataInputPage = () => {
    const { data, updateRegionData } = useData();
    const { toast } = useToast();

    const [selectedRegion, setSelectedRegion] = useState<string>("");
    const [formData, setFormData] = useState({
        stunting: "",
        kemiskinan: "",
        perumahan: "",
    });

    // Load data when region is selected
    useEffect(() => {
        if (selectedRegion) {
            const regionData = data.find(d => d.provinsi === selectedRegion);
            if (regionData) {
                setFormData({
                    stunting: regionData.stunting.toString(),
                    kemiskinan: regionData.kemiskinan.toString(),
                    perumahan: regionData.perumahan.toString(),
                });
            }
        }
    }, [selectedRegion, data]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRegion) return;

        updateRegionData(selectedRegion, {
            stunting: parseFloat(formData.stunting),
            kemiskinan: parseFloat(formData.kemiskinan),
            perumahan: parseFloat(formData.perumahan),
        });

        toast({
            title: "Data Berhasil Disimpan",
            description: `Data untuk ${selectedRegion} telah diperbarui dan analisis dijalankan ulang.`,
        });
    };

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
                            <div className="space-y-2">
                                <Label>Wilayah Administratif</Label>
                                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Kabupaten/Kota" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {data.map((region) => (
                                            <SelectItem key={region.provinsi} value={region.provinsi}>
                                                {region.provinsi}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedRegion && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="stunting">Angka Preferensi Stunting (%)</Label>
                                        <Input
                                            id="stunting"
                                            type="number"
                                            step="0.1"
                                            value={formData.stunting}
                                            onChange={(e) => setFormData({ ...formData, stunting: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kemiskinan">Tingkat Kemiskinan (%)</Label>
                                        <Input
                                            id="kemiskinan"
                                            type="number"
                                            step="0.1"
                                            value={formData.kemiskinan}
                                            onChange={(e) => setFormData({ ...formData, kemiskinan: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="perumahan">Rumah Layak Huni (%)</Label>
                                        <Input
                                            id="perumahan"
                                            type="number"
                                            step="0.1"
                                            value={formData.perumahan}
                                            onChange={(e) => setFormData({ ...formData, perumahan: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <Button type="submit" className="w-full">
                                        <Save className="mr-2 h-4 w-4" />
                                        Simpan & Analisis
                                    </Button>
                                </>
                            )}
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

                        <div className="text-sm text-muted-foreground p-4">
                            <p>Perubahan data akan langsung tercermin pada:</p>
                            <ul className="list-disc list-inside mt-2">
                                <li>Dashboard Utama</li>
                                <li>Grafik Analisis Regional</li>
                                <li>Tabel Peringkat Wilayah</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DataInputPage;
