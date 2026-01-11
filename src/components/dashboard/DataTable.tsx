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
import { useData } from "@/contexts/DataProvider";

const DataTable = () => {
  const { data } = useData();

  const getStatusBadge = (status: string) => {
    if (status === "Sangat Tinggi") {
      return <Badge className="bg-[#FF0000] hover:bg-red-800 text-white">{status}</Badge>;
    }
    if (status === "Tinggi") {
      return <Badge className="bg-[#FFA500] hover:bg-orange-600 text-white">{status}</Badge>;
    }
    if (status === "Sedang") {
      return <Badge className="bg-[#FFFF00] hover:bg-yellow-600 text-black">{status}</Badge>;
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
