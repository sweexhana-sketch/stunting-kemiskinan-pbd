import { useState } from 'react';
import { usePUPR } from '@/contexts/PUPRContext';
import { VillageInfrastructure } from '@/types/pupr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Download,
    Plus,
    Trash2,
    AlertCircle,
    Home,
    Droplet,
    Toilet,
    Waves,
    TrendingUp,
    MapPin
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ExcelImport from '@/components/pupr/ExcelImport';

const PUPRMatrixPage = () => {
    const {
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
        exportToCSV
    } = usePUPR();

    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState<Partial<VillageInfrastructure>>({
        kode_desa: '',
        kabupaten: '',
        kecamatan: '',
        nama_desa: '',
        kk_miskin_desil1: 0,
        kk_miskin_desil2: 0,
        total_kk_p3ke: 0,
        s11_rumah_tidak_layak: 0,
        s11_lantai_tanah: 0,
        s11_dinding_bambu_kayu: 0,
        s11_atap_tidak_layak: 0,
        s12_air_tidak_layak: 0,
        s12_air_hujan: 0,
        s12_mata_air_terbuka: 0,
        s12_sungai: 0,
        s12_sumur_tidak_terlindung: 0,
        s16_tanpa_jamban_sendiri: 0,
        s16_jamban_bersama: 0,
        s16_jamban_umum: 0,
        s16_tidak_ada_jamban: 0,
        s17_pembuangan_terbuka: 0,
        s17_lubang_tanah: 0,
        s17_pantai_sungai: 0,
        s17_tanpa_septictank: 0,
    });

    const analysisResults = getAnalysisResults();
    const recommendations = getRecommendations();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newVillage: VillageInfrastructure = {
            id: Date.now().toString(),
            ...formData as VillageInfrastructure,
            skor_resiko_sanitasi: 0,
            prioritas_intervensi: 'P4',
            status_lokus: 'Hijau',
        };
        addVillage(newVillage);
        setShowAddForm(false);
        setFormData({});
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'P1': return 'bg-red-600';
            case 'P2': return 'bg-orange-500';
            case 'P3': return 'bg-yellow-500';
            default: return 'bg-green-500';
        }
    };

    const getLokusColor = (lokus: string) => {
        switch (lokus) {
            case 'Merah': return 'destructive';
            case 'Kuning': return 'warning';
            default: return 'default';
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Matriks Intervensi PUPR</h1>
                    <p className="text-muted-foreground mt-1">
                        Analisis Kebutuhan Infrastruktur Papua Barat Daya
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setShowAddForm(!showAddForm)} variant="default">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Desa
                    </Button>
                    <Button onClick={exportToCSV} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Desa</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analysisResults.summary.total_villages}</div>
                        <p className="text-xs text-muted-foreground">
                            {analysisResults.summary.red_zone_count} Lokus Merah
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total KK Sasaran</CardTitle>
                        <Home className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {analysisResults.summary.total_kk_targeted.toLocaleString('id-ID')}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Kepala Keluarga P3KE
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Anggaran Dibutuhkan</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(analysisResults.summary.total_budget_needed)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Total estimasi biaya
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Prioritas P1</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {analysisResults.summary.priority_p1_count}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Desa prioritas tertinggi
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Excel Import */}
            <ExcelImport onImport={bulkAddVillages} />

            {/* Add Village Form */}
            {showAddForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Data Desa Baru</CardTitle>
                        <CardDescription>
                            Input data infrastruktur berdasarkan Sheet 11, 12, 16, dan 17
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="kode_desa">Kode Desa</Label>
                                    <Input
                                        id="kode_desa"
                                        value={formData.kode_desa}
                                        onChange={(e) => setFormData({ ...formData, kode_desa: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kabupaten">Kabupaten</Label>
                                    <Input
                                        id="kabupaten"
                                        value={formData.kabupaten}
                                        onChange={(e) => setFormData({ ...formData, kabupaten: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kecamatan">Kecamatan</Label>
                                    <Input
                                        id="kecamatan"
                                        value={formData.kecamatan}
                                        onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nama_desa">Nama Desa</Label>
                                    <Input
                                        id="nama_desa"
                                        value={formData.nama_desa}
                                        onChange={(e) => setFormData({ ...formData, nama_desa: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* P3KE Data */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Data Kemiskinan (P3KE)</h3>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="total_kk_p3ke">Total KK P3KE</Label>
                                        <Input
                                            id="total_kk_p3ke"
                                            type="number"
                                            value={formData.total_kk_p3ke}
                                            onChange={(e) => setFormData({ ...formData, total_kk_p3ke: parseInt(e.target.value) || 0 })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="kk_miskin_desil1">KK Desil 1</Label>
                                        <Input
                                            id="kk_miskin_desil1"
                                            type="number"
                                            value={formData.kk_miskin_desil1}
                                            onChange={(e) => setFormData({ ...formData, kk_miskin_desil1: parseInt(e.target.value) || 0 })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="kk_miskin_desil2">KK Desil 2</Label>
                                        <Input
                                            id="kk_miskin_desil2"
                                            type="number"
                                            value={formData.kk_miskin_desil2}
                                            onChange={(e) => setFormData({ ...formData, kk_miskin_desil2: parseInt(e.target.value) || 0 })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sheet 11: Housing */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <Home className="w-5 h-5" />
                                    Sheet 11: Indikator Bangunan/Perumahan
                                </h3>
                                <div className="grid gap-4 md:grid-cols-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="s11_rumah_tidak_layak">Rumah Tidak Layak (Unit)</Label>
                                        <Input
                                            id="s11_rumah_tidak_layak"
                                            type="number"
                                            value={formData.s11_rumah_tidak_layak}
                                            onChange={(e) => setFormData({ ...formData, s11_rumah_tidak_layak: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s11_lantai_tanah">Lantai Tanah (KK)</Label>
                                        <Input
                                            id="s11_lantai_tanah"
                                            type="number"
                                            value={formData.s11_lantai_tanah}
                                            onChange={(e) => setFormData({ ...formData, s11_lantai_tanah: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s11_dinding_bambu_kayu">Dinding Bambu/Kayu (KK)</Label>
                                        <Input
                                            id="s11_dinding_bambu_kayu"
                                            type="number"
                                            value={formData.s11_dinding_bambu_kayu}
                                            onChange={(e) => setFormData({ ...formData, s11_dinding_bambu_kayu: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s11_atap_tidak_layak">Atap Tidak Layak (KK)</Label>
                                        <Input
                                            id="s11_atap_tidak_layak"
                                            type="number"
                                            value={formData.s11_atap_tidak_layak}
                                            onChange={(e) => setFormData({ ...formData, s11_atap_tidak_layak: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sheet 12: Water */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <Droplet className="w-5 h-5" />
                                    Sheet 12: Indikator Air Minum
                                </h3>
                                <div className="grid gap-4 md:grid-cols-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="s12_air_tidak_layak">Air Tidak Layak (KK)</Label>
                                        <Input
                                            id="s12_air_tidak_layak"
                                            type="number"
                                            value={formData.s12_air_tidak_layak}
                                            onChange={(e) => setFormData({ ...formData, s12_air_tidak_layak: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s12_air_hujan">Air Hujan (KK)</Label>
                                        <Input
                                            id="s12_air_hujan"
                                            type="number"
                                            value={formData.s12_air_hujan}
                                            onChange={(e) => setFormData({ ...formData, s12_air_hujan: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s12_mata_air_terbuka">Mata Air Terbuka (KK)</Label>
                                        <Input
                                            id="s12_mata_air_terbuka"
                                            type="number"
                                            value={formData.s12_mata_air_terbuka}
                                            onChange={(e) => setFormData({ ...formData, s12_mata_air_terbuka: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s12_sungai">Sungai (KK)</Label>
                                        <Input
                                            id="s12_sungai"
                                            type="number"
                                            value={formData.s12_sungai}
                                            onChange={(e) => setFormData({ ...formData, s12_sungai: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s12_sumur_tidak_terlindung">Sumur Tidak Terlindung (KK)</Label>
                                        <Input
                                            id="s12_sumur_tidak_terlindung"
                                            type="number"
                                            value={formData.s12_sumur_tidak_terlindung}
                                            onChange={(e) => setFormData({ ...formData, s12_sumur_tidak_terlindung: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sheet 16: Toilet Ownership */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <Toilet className="w-5 h-5" />
                                    Sheet 16: Kepemilikan Jamban
                                </h3>
                                <div className="grid gap-4 md:grid-cols-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="s16_tanpa_jamban_sendiri">Tanpa Jamban Sendiri (KK)</Label>
                                        <Input
                                            id="s16_tanpa_jamban_sendiri"
                                            type="number"
                                            value={formData.s16_tanpa_jamban_sendiri}
                                            onChange={(e) => setFormData({ ...formData, s16_tanpa_jamban_sendiri: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s16_jamban_bersama">Jamban Bersama (KK)</Label>
                                        <Input
                                            id="s16_jamban_bersama"
                                            type="number"
                                            value={formData.s16_jamban_bersama}
                                            onChange={(e) => setFormData({ ...formData, s16_jamban_bersama: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s16_jamban_umum">Jamban Umum (KK)</Label>
                                        <Input
                                            id="s16_jamban_umum"
                                            type="number"
                                            value={formData.s16_jamban_umum}
                                            onChange={(e) => setFormData({ ...formData, s16_jamban_umum: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s16_tidak_ada_jamban">Tidak Ada Jamban (KK)</Label>
                                        <Input
                                            id="s16_tidak_ada_jamban"
                                            type="number"
                                            value={formData.s16_tidak_ada_jamban}
                                            onChange={(e) => setFormData({ ...formData, s16_tidak_ada_jamban: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sheet 17: Waste Disposal */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <Waves className="w-5 h-5" />
                                    Sheet 17: Pembuangan Limbah
                                </h3>
                                <div className="grid gap-4 md:grid-cols-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="s17_pembuangan_terbuka">Pembuangan Terbuka (KK)</Label>
                                        <Input
                                            id="s17_pembuangan_terbuka"
                                            type="number"
                                            value={formData.s17_pembuangan_terbuka}
                                            onChange={(e) => setFormData({ ...formData, s17_pembuangan_terbuka: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s17_lubang_tanah">Lubang Tanah (KK)</Label>
                                        <Input
                                            id="s17_lubang_tanah"
                                            type="number"
                                            value={formData.s17_lubang_tanah}
                                            onChange={(e) => setFormData({ ...formData, s17_lubang_tanah: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s17_pantai_sungai">Pantai/Sungai (KK)</Label>
                                        <Input
                                            id="s17_pantai_sungai"
                                            type="number"
                                            value={formData.s17_pantai_sungai}
                                            onChange={(e) => setFormData({ ...formData, s17_pantai_sungai: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s17_tanpa_septictank">Tanpa Septictank (KK)</Label>
                                        <Input
                                            id="s17_tanpa_septictank"
                                            type="number"
                                            value={formData.s17_tanpa_septictank}
                                            onChange={(e) => setFormData({ ...formData, s17_tanpa_septictank: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit">Simpan Data</Button>
                                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Tabs for different views */}
            <Tabs defaultValue="matrix" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="matrix">Matriks Data</TabsTrigger>
                    <TabsTrigger value="recommendations">Rekomendasi</TabsTrigger>
                    <TabsTrigger value="analysis">Analisis</TabsTrigger>
                </TabsList>

                {/* Matrix View */}
                <TabsContent value="matrix" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Infrastruktur Desa</CardTitle>
                            <CardDescription>
                                Matriks lengkap indikator infrastruktur dari Sheet 11, 12, 16, dan 17
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Desa</TableHead>
                                            <TableHead>Kabupaten</TableHead>
                                            <TableHead className="text-right">Total KK</TableHead>
                                            <TableHead className="text-right">Desil 1</TableHead>
                                            <TableHead className="text-right">Desil 2</TableHead>
                                            <TableHead className="text-right">Rumah Tidak Layak</TableHead>
                                            <TableHead className="text-right">Air Tidak Layak</TableHead>
                                            <TableHead className="text-right">Tanpa Jamban</TableHead>
                                            <TableHead className="text-right">Pembuangan Terbuka</TableHead>
                                            <TableHead className="text-center">Skor Sanitasi</TableHead>
                                            <TableHead className="text-center">Prioritas</TableHead>
                                            <TableHead className="text-center">Lokus</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {villages.map((village) => (
                                            <TableRow key={village.id}>
                                                <TableCell className="font-medium">{village.nama_desa}</TableCell>
                                                <TableCell>{village.kabupaten}</TableCell>
                                                <TableCell className="text-right">{village.total_kk_p3ke}</TableCell>
                                                <TableCell className="text-right">{village.kk_miskin_desil1}</TableCell>
                                                <TableCell className="text-right">{village.kk_miskin_desil2}</TableCell>
                                                <TableCell className="text-right">{village.s11_rumah_tidak_layak}</TableCell>
                                                <TableCell className="text-right">{village.s12_air_tidak_layak}</TableCell>
                                                <TableCell className="text-right">{village.s16_tanpa_jamban_sendiri}</TableCell>
                                                <TableCell className="text-right">{village.s17_pembuangan_terbuka}</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline">{village.skor_resiko_sanitasi.toFixed(1)}</Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge className={getPriorityColor(village.prioritas_intervensi)}>
                                                        {village.prioritas_intervensi}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant={getLokusColor(village.status_lokus)}>
                                                        {village.status_lokus}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteVillage(village.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Recommendations View */}
                <TabsContent value="recommendations" className="space-y-4">
                    {recommendations.map((rec) => {
                        const village = villages.find(v => v.id === rec.village_id);
                        return (
                            <Card key={rec.village_id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{rec.nama_desa}</CardTitle>
                                            <CardDescription>{rec.kabupaten}</CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Badge className={getPriorityColor(village?.prioritas_intervensi || 'P4')}>
                                                {village?.prioritas_intervensi}
                                            </Badge>
                                            <Badge variant={getLokusColor(village?.status_lokus || 'Hijau')}>
                                                {village?.status_lokus}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {/* Housing */}
                                        <Card className={rec.perumahan.needed ? 'border-orange-500' : ''}>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-sm flex items-center gap-2">
                                                    <Home className="w-4 h-4" />
                                                    Perumahan
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {rec.perumahan.needed ? (
                                                    <>
                                                        <p className="text-sm mb-2">{rec.perumahan.description}</p>
                                                        <div className="space-y-1 text-xs">
                                                            <p><strong>Program:</strong> {rec.perumahan.program}</p>
                                                            <p><strong>Target:</strong> {rec.perumahan.target_kk} KK</p>
                                                            <p><strong>Anggaran:</strong> {formatCurrency(rec.perumahan.estimated_budget)}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">{rec.perumahan.description}</p>
                                                )}
                                            </CardContent>
                                        </Card>

                                        {/* Water */}
                                        <Card className={rec.air_minum.needed ? 'border-blue-500' : ''}>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-sm flex items-center gap-2">
                                                    <Droplet className="w-4 h-4" />
                                                    Air Minum
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {rec.air_minum.needed ? (
                                                    <>
                                                        <p className="text-sm mb-2">{rec.air_minum.description}</p>
                                                        <div className="space-y-1 text-xs">
                                                            <p><strong>Program:</strong> {rec.air_minum.program}</p>
                                                            <p><strong>Target:</strong> {rec.air_minum.target_kk} KK</p>
                                                            <p><strong>Kapasitas:</strong> {rec.air_minum.capacity_needed.toLocaleString()} L/hari</p>
                                                            <p><strong>Anggaran:</strong> {formatCurrency(rec.air_minum.estimated_budget)}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">{rec.air_minum.description}</p>
                                                )}
                                            </CardContent>
                                        </Card>

                                        {/* Sanitation */}
                                        <Card className={rec.sanitasi.needed ? 'border-purple-500' : ''}>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-sm flex items-center gap-2">
                                                    <Toilet className="w-4 h-4" />
                                                    Sanitasi
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {rec.sanitasi.needed ? (
                                                    <>
                                                        <p className="text-sm mb-2">{rec.sanitasi.description}</p>
                                                        <div className="space-y-1 text-xs">
                                                            <p><strong>Program:</strong> {rec.sanitasi.program}</p>
                                                            <p><strong>Target:</strong> {rec.sanitasi.target_kk} KK</p>
                                                            <p><strong>Anggaran:</strong> {formatCurrency(rec.sanitasi.estimated_budget)}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">{rec.sanitasi.description}</p>
                                                )}
                                            </CardContent>
                                        </Card>

                                        {/* Drainage */}
                                        <Card className={rec.drainase.needed ? 'border-teal-500' : ''}>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-sm flex items-center gap-2">
                                                    <Waves className="w-4 h-4" />
                                                    Drainase
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {rec.drainase.needed ? (
                                                    <>
                                                        <p className="text-sm mb-2">{rec.drainase.description}</p>
                                                        <div className="space-y-1 text-xs">
                                                            <p><strong>Program:</strong> {rec.drainase.program}</p>
                                                            <p><strong>Panjang:</strong> {rec.drainase.panjang_needed} meter</p>
                                                            <p><strong>Anggaran:</strong> {formatCurrency(rec.drainase.estimated_budget)}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">{rec.drainase.description}</p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-medium">Total Anggaran Dibutuhkan</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Korelasi Stunting: <Badge variant="outline">{rec.stunting_correlation}</Badge>
                                                </p>
                                            </div>
                                            <p className="text-2xl font-bold">{formatCurrency(rec.total_budget)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </TabsContent>

                {/* Analysis View */}
                <TabsContent value="analysis" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ringkasan Analisis</CardTitle>
                            <CardDescription>
                                Analisis agregat kebutuhan infrastruktur per kabupaten
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kabupaten</TableHead>
                                        <TableHead className="text-right">Jumlah Desa</TableHead>
                                        <TableHead className="text-right">Total KK</TableHead>
                                        <TableHead className="text-right">Anggaran Dibutuhkan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.entries(analysisResults.by_kabupaten).map(([kabupaten, data]) => (
                                        <TableRow key={kabupaten}>
                                            <TableCell className="font-medium">{kabupaten}</TableCell>
                                            <TableCell className="text-right">{data.villages_count}</TableCell>
                                            <TableCell className="text-right">{data.total_kk.toLocaleString('id-ID')}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(data.budget_needed)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="mt-6 p-4 bg-muted rounded-lg">
                                <h3 className="font-semibold mb-2">Korelasi Stunting & Sanitasi</h3>
                                <p className="text-sm text-muted-foreground">
                                    Terdapat <strong>{analysisResults.stunting_correlation.high_stunting_poor_sanitation}</strong> desa
                                    dengan sanitasi buruk yang berkorelasi dengan tingkat stunting tinggi.
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Kekuatan korelasi: <strong>{(analysisResults.stunting_correlation.correlation_strength * 100).toFixed(1)}%</strong>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PUPRMatrixPage;
