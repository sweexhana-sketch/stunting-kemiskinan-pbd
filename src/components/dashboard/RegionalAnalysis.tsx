import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useData } from "@/contexts/DataProvider";

interface RegionalAnalysisProps {
  type: "stunting" | "poverty" | "housing";
}

const RegionalAnalysis = ({ type }: RegionalAnalysisProps) => {
  const { data: contextData } = useData();

  const dataMap = {
    stunting: contextData.map(item => ({ name: item.provinsi, value: item.stunting, color: item.color })),
    poverty: contextData.map(item => ({ name: item.provinsi, value: item.kemiskinan, color: item.color })), // Using same color coding for consistency
    housing: [
      { name: "Layak Huni", value: 66.8, color: "#22c55e" },
      { name: "Perlu Renovasi", value: 23.5, color: "#f59e0b" },
      { name: "Tidak Layak", value: 9.7, color: "#ef4444" },
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
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || COLORS[index % COLORS.length]}
                />
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
