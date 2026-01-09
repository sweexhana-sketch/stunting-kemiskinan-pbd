import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const StuntingChart = () => {
  const data = [
    { tahun: "2019", stunting: 27.7, target: 27.0 },
    { tahun: "2020", stunting: 26.9, target: 25.0 },
    { tahun: "2021", stunting: 24.4, target: 23.0 },
    { tahun: "2022", stunting: 21.6, target: 21.0 },
    { tahun: "2023", stunting: 19.2, target: 19.0 },
  ];

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Tren Prevalensi Stunting</CardTitle>
        <CardDescription>
          Persentase balita dengan stunting (2019-2023)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="tahun" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar 
              dataKey="stunting" 
              name="Stunting (%)" 
              fill="hsl(var(--primary))" 
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="target" 
              name="Target (%)" 
              fill="hsl(var(--secondary))" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StuntingChart;
