import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const PovertyChart = () => {
  const data = [
    { tahun: "2019", kemiskinan: 11.5, ekstrem: 3.8 },
    { tahun: "2020", kemiskinan: 10.9, ekstrem: 3.5 },
    { tahun: "2021", kemiskinan: 10.1, ekstrem: 3.2 },
    { tahun: "2022", kemiskinan: 9.4, ekstrem: 2.8 },
    { tahun: "2023", kemiskinan: 8.6, ekstrem: 2.4 },
  ];

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Tren Tingkat Kemiskinan</CardTitle>
        <CardDescription>
          Persentase penduduk miskin (2019-2023)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
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
            <Line 
              type="monotone" 
              dataKey="kemiskinan" 
              name="Kemiskinan (%)" 
              stroke="hsl(var(--secondary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--secondary))', r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="ekstrem" 
              name="Kemiskinan Ekstrem (%)" 
              stroke="hsl(var(--accent))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--accent))', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PovertyChart;
