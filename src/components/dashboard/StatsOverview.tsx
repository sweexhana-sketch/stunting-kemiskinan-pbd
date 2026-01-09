import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Users, Home } from "lucide-react";

const StatsOverview = () => {
  const stats = [
    {
      title: "Prevalensi Stunting",
      value: "21.6%",
      change: "-2.4%",
      trend: "down",
      icon: TrendingDown,
      description: "Dari tahun sebelumnya",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Tingkat Kemiskinan",
      value: "9.4%",
      change: "-0.8%",
      trend: "down",
      icon: Users,
      description: "Dari tahun sebelumnya",
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
                      className={`text-sm font-medium ${
                        stat.trend === "up" ? "text-chart-5" : "text-primary"
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
