import React, { useEffect } from 'react';
import { useIntegratedAnalysis } from '@/contexts/IntegratedAnalysisContext';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InterventionMatrix from '@/components/analysis/InterventionMatrix';
import DrillDownMap from '@/components/analysis/DrillDownMap';
import { Loader2 } from "lucide-react";
import Navigation from '@/components/layout/Navigation';

const AnalysisDashboardPage = () => {
    const { generateMockData, isLoading, analysisResults } = useIntegratedAnalysis();

    useEffect(() => {
        // Auto-load data if empty
        if (analysisResults.length === 0) {
            generateMockData("92.71");
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Navigation container if needed, or rely on App.tsx Nav structure if it is global */}

            <main className="container mx-auto p-4 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Analisis Terintegrasi
                        </h1>
                        <p className="text-muted-foreground">
                            Peta Konvergensi Stunting, Kemiskinan, dan Perumahan Layak
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => generateMockData("92.71")} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Memuat Data...' : 'Refresh Analisis Data'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[800px]">
                    {/* Left Panel: Matrix & List */}
                    <div className="lg:col-span-2 flex flex-col gap-4 h-full overflow-hidden">
                        <Tabs defaultValue="matrix" className="h-full flex flex-col">
                            <TabsList className="w-full justify-start">
                                <TabsTrigger value="matrix">Matrix Kuadran</TabsTrigger>
                                <TabsTrigger value="list">Daftar Keluarga</TabsTrigger>
                            </TabsList>

                            <TabsContent value="matrix" className="flex-1 overflow-auto border rounded-xl bg-white shadow-sm mt-2">
                                <InterventionMatrix />
                            </TabsContent>

                            <TabsContent value="list" className="flex-1 overflow-auto border rounded-xl bg-white shadow-sm mt-2 p-4">
                                <div className="space-y-2">
                                    {analysisResults.map((item, idx) => (
                                        <div key={idx} className="p-3 border rounded-lg hover:bg-slate-50 flex justify-between items-center">
                                            <div>
                                                <div className="font-semibold">{item.family.kepala_keluarga}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    ST: {item.stunted_kids.length > 0 ? '❌' : '✅'} |
                                                    Jamban: {item.building.kepemilikan_jamban ? '✅' : '❌'} |
                                                    Miskin: {['Desil 1', 'Desil 2'].includes(item.family.status_dtks) ? '❌' : '✅'}
                                                </div>
                                            </div>
                                            <div className={`px-2 py-1 rounded text-xs font-bold 
                                                ${item.priority_score === 1 ? 'bg-red-100 text-red-700' :
                                                    item.priority_score === 2 ? 'bg-orange-100 text-orange-700' :
                                                        item.priority_score === 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                P{item.priority_score}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Panel: Map */}
                    <div className="lg:col-span-2 h-full">
                        <Card className="h-full flex flex-col">
                            <CardHeader>
                                <CardTitle>Peta Sebaran Drill-Down</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 relative min-h-[500px]">
                                <DrillDownMap />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AnalysisDashboardPage;
