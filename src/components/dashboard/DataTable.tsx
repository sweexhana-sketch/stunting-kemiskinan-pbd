import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const DataTable = () => {
  const data = [
    {
      provinsi: "Kota Sorong",
      stunting: 22.0,
      kemiskinan: 10.5,
      perumahan: 75.2,
      status: "Prioritas Sedang",
    },
    {
      provinsi: "Kabupaten Sorong",
      stunting: 18.0,
      kemiskinan: 9.5,
      perumahan: 68.7,
      status: "Baik",
    },
    {
      provinsi: "Kabupaten Raja Ampat",
      stunting: 17.0,
      kemiskinan: 8.2,
      perumahan: 71.3,
      status: "Baik",
    },
    {
      provinsi: "Kabupaten Sorong Selatan",
      stunting: 15.0,
      kemiskinan: 7.9,
      perumahan: 62.5,
      status: "Prioritas Sedang",
    },
    {
      provinsi: "Kabupaten Maybrat",
      stunting: 14.0,
      kemiskinan: 7.5,
      perumahan: 58.9,
      status: "Prioritas Tinggi",
    },
    {
      provinsi: "Kabupaten Tambrauw",
      stunting: 14.0,
      kemiskinan: 6.4,
      perumahan: 55.4,
      status: "Prioritas Tinggi",
    },
  ];

  const getStatusBadge = (status: string) => {
    if (status === "Prioritas Tinggi") {
      return <Badge variant="destructive">{status}</Badge>;
    }
    if (status === "Prioritas Sedang") {
      return <Badge className="bg-accent text-accent-foreground">{status}</Badge>;
    }
    return <Badge className="bg-secondary text-secondary-foreground">{status}</Badge>;
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Data Regional Terperinci</CardTitle>
        <CardDescription>
          Ringkasan data stunting, kemiskinan, dan perumahan per provinsi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Kabupaten/Kota</TableHead>
                <TableHead className="font-semibold">Stunting (%)</TableHead>
                <TableHead className="font-semibold">Kemiskinan (%)</TableHead>
                <TableHead className="font-semibold">Rumah Layak (%)</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.provinsi}</TableCell>
                  <TableCell>{row.stunting}%</TableCell>
                  <TableCell>{row.kemiskinan}%</TableCell>
                  <TableCell>{row.perumahan}%</TableCell>
                  <TableCell>{getStatusBadge(row.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
