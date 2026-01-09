import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useData } from "@/contexts/DataProvider";

interface RegionalAnalysisProps {
  type: "stunting" | "poverty" | "housing";
}

const RegionalAnalysis = ({ type }: RegionalAnalysisProps) => {
  const { data: contextData } = useData();

  const dataMap = {
    stunting: contextData.map(item => ({ name: item.provinsi, value: item.stunting })),
    poverty: contextData.map(item => ({ name: item.provinsi, value: item.kemiskinan })),
    housing: [
      // This is aggregated data for housing, we can calculate it from the regions or keep it static if needed.
      // For now, let's keep the static distribution or attempt to calculate it.
      // Let's keep it static as user only provided per-region % but not total counts.
      // OR we can map specific regions for "housing" if the user wants per-region housing chart.
      // The original was a pie chart of "Layak" vs "Tidak Layak" aggregated.
      { name: "Layak Huni", value: 66.8 },
      { name: "Perlu Renovasi", value: 23.5 },
      { name: "Tidak Layak", value: 9.7 },
    ],
  };

  const titles = {
    stunting: "Distribusi Stunting Regional",
    poverty: "Distribusi Kemiskinan Regional",
    housing: "Status Perumahan",
  };

  const descriptions = {
    stunting: "Persentase stunting berdasarkan provinsi",
    poverty: "Tingkat kemiskinan per provinsi",
    housing: "Kondisi perumahan rakyat",
  };

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const data = dataMap[type];

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>{titles[type]}</CardTitle>
        <CardDescription>{descriptions[type]}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RegionalAnalysis;
