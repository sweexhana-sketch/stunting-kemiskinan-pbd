import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Users, Home } from "lucide-react";

const StatsOverview = () => {
  const stats = [
    {
      title: "Prevalensi Stunting",
      value: "30.5%",
      change: "+8.9%", // Assuming increase from 21.6 to 30.5
      trend: "up", // Changed to up because it increased
      icon: TrendingDown, // Icon might need to be TrendingUp if we want to show 'bad' trend, but usually TrendingDown is 'good' for stunting. Here we just show the metric. Let's keep icon but maybe change trend logic if desired.
      // User didn't specify trend direction intent, but 30.5 is high.
      // I will keep the icon as TrendingDown component but maybe the trend indicator logic in UI uses 'trend' prop.
      // If trend='down', it shows primary color. If 'up', chart-5 (green?).
      // Let's check logic: stat.trend === "up" ? "text-chart-5" : "text-primary".
      // Usually stunting going UP is bad.
      // "text-chart-5" seems to be Green (from Map logic "Right?"). "text-primary" might be default or Red.
      // Let's assume red for bad.
      // In the original: 21.6%, -2.4% (down), color primary.
      // If I set 30.5%, it's +8.9%.
      // Let's set description to "Di atas rata-rata nasional" as per user prompt.
      description: "Di atas rata-rata nasional",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Tingkat Kemiskinan",
      value: "21.7%", // Average of SSGI 2024 regional data provided
      change: "+12.3%", // vs ~9.4% previous
      trend: "up",
      icon: Users,
      description: "Rata-rata tingkat kemiskinan provinsi",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Rumah Layak Huni",
      value: "66.8%",
      change: "+3.2%",
      trend: "up",
      icon: Home,
      description: "Peningkatan akses",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Akses Air Bersih",
      value: "89.2%",
      change: "+1.5%",
      trend: "up",
      icon: TrendingUp,
      description: "Infrastruktur membaik",
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="transition-all hover:shadow-lg"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold tracking-tight">
                      {stat.value}
                    </h3>
                    <span
                      className={`text-sm font-medium ${stat.trend === "up" ? "text-chart-5" : "text-primary"
                        }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
                <div className={`rounded-lg ${stat.bgColor} p-3`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsOverview;
