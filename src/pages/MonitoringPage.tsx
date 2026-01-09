import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ClipboardCheck, Clock, Users, MapPin } from "lucide-react";

const MonitoringPage = () => {
  const projects = [
    {
      name: "Pembangunan SPAM Kec. Sorong Kepulauan",
      status: "Dalam Progres",
      progress: 65,
      location: "Kec. Sorong Kepulauan",
      startDate: "Jan 2024",
      endDate: "Des 2024",
      budget: "Rp 2.5 Miliar",
      beneficiaries: 5000,
    },
    {
      name: "Program Jamban Sehat Kec. Sorong Timur",
      status: "Dalam Progres",
      progress: 45,
      location: "Kec. Sorong Timur",
      startDate: "Mar 2024",
      endDate: "Sep 2024",
      budget: "Rp 800 Juta",
      beneficiaries: 2500,
    },
    {
      name: "Renovasi Perumahan Layak Huni",
      status: "Perencanaan",
      progress: 15,
      location: "Kec. Sorong Barat",
      startDate: "Jun 2024",
      endDate: "Des 2025",
      budget: "Rp 5 Miliar",
      beneficiaries: 1000,
    },
  ];

  const impacts = [
    {
      indicator: "Penurunan Stunting",
      baseline: "28.5%",
      current: "24.3%",
      target: "21.0%",
      change: "-4.2%",
    },
    {
      indicator: "Penurunan Kemiskinan",
      baseline: "12.8%",
      current: "11.5%",
      target: "10.0%",
      change: "-1.3%",
    },
    {
      indicator: "Akses Air Bersih",
      baseline: "65.0%",
      current: "78.5%",
      target: "85.0%",
      change: "+13.5%",
    },
    {
      indicator: "Rumah Layak Huni",
      baseline: "58.0%",
      current: "66.8%",
      target: "75.0%",
      change: "+8.8%",
    },
  ];

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground">
          <ClipboardCheck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Monitoring & Evaluasi</h1>
          <p className="text-sm text-muted-foreground">
            Pelacakan progres proyek dan evaluasi dampak program PUPR
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Proyek</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dalam Progres</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <div className="rounded-lg bg-secondary/10 p-3">
                <Clock className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Penerima Manfaat</p>
                <p className="text-3xl font-bold">28K</p>
              </div>
              <div className="rounded-lg bg-accent/10 p-3">
                <Users className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Realisasi Anggaran</p>
                <p className="text-3xl font-bold">68%</p>
              </div>
              <div className="rounded-lg bg-chart-5/10 p-3">
                <ClipboardCheck className="h-6 w-6 text-chart-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progres Proyek Aktif</CardTitle>
          <CardDescription>Pelacakan real-time proyek PUPR di lapangan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {projects.map((project, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{project.name}</h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {project.location}
                    </div>
                  </div>
                  <Badge
                    variant={
                      project.status === "Dalam Progres"
                        ? "default"
                        : project.status === "Selesai"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>

                <div className="mb-3">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                  <div>
                    <p className="text-muted-foreground">Mulai</p>
                    <p className="font-medium">{project.startDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Target Selesai</p>
                    <p className="font-medium">{project.endDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Anggaran</p>
                    <p className="font-medium">{project.budget}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Penerima</p>
                    <p className="font-medium">{project.beneficiaries.toLocaleString()} KK</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evaluasi Dampak Program</CardTitle>
          <CardDescription>Perubahan indikator stunting dan kemiskinan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {impacts.map((impact, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">{impact.indicator}</h3>
                  <Badge
                    variant={impact.change.startsWith("+") ? "default" : "secondary"}
                    className={
                      impact.change.startsWith("+") && !impact.indicator.includes("Akses")
                        ? "bg-destructive text-destructive-foreground"
                        : ""
                    }
                  >
                    {impact.change}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Baseline</p>
                    <p className="font-semibold">{impact.baseline}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Saat Ini</p>
                    <p className="font-semibold text-primary">{impact.current}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Target</p>
                    <p className="font-semibold">{impact.target}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringPage;
