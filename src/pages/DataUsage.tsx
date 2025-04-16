
import { useState } from "react";
import { useAssets } from "@/context/AssetContext";
import { ChipAsset } from "@/types/asset";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Database, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  SlidersHorizontal,
  ArrowDownUp
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data - in a real implementation, this would come from the API
const generateMockDataUsage = (chips: ChipAsset[]) => {
  return chips.map(chip => {
    const downloadMB = Math.floor(Math.random() * 5000);
    const uploadMB = Math.floor(Math.random() * 1000);
    
    return {
      ...chip,
      dataUsage: {
        download: downloadMB,
        upload: uploadMB,
        period: "MENSAL",
        lastUpdated: new Date().toISOString()
      }
    };
  });
};

export default function DataUsage() {
  const { assets, clients, getClientById } = useAssets();
  const [period, setPeriod] = useState<string>("MENSAL");
  const [groupBy, setGroupBy] = useState<string>("CHIP");
  const [sortBy, setSortBy] = useState<string>("download");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filter only chips
  const chips = assets.filter(asset => asset.type === "CHIP") as ChipAsset[];
  
  // Add mock data usage if not present
  const chipsWithData = chips.map(chip => {
    if (!chip.dataUsage) {
      const downloadMB = Math.floor(Math.random() * 5000);
      const uploadMB = Math.floor(Math.random() * 1000);
      
      return {
        ...chip,
        dataUsage: {
          download: downloadMB,
          upload: uploadMB,
          period: "MENSAL",
          lastUpdated: new Date().toISOString()
        }
      };
    }
    return chip;
  });

  // Function to get formatted data size
  const formatDataSize = (sizeInMB: number) => {
    if (sizeInMB >= 1000) {
      return `${(sizeInMB / 1000).toFixed(2)} GB`;
    }
    return `${sizeInMB} MB`;
  };

  // Group data by client, carrier or chip
  const groupData = () => {
    if (groupBy === "CLIENTE") {
      const clientData: Record<string, { download: number; upload: number; chips: number; name: string }> = {};
      
      chipsWithData.forEach(chip => {
        if (chip.clientId) {
          const client = getClientById(chip.clientId);
          const clientName = client ? client.name : "Cliente Desconhecido";
          
          if (!clientData[chip.clientId]) {
            clientData[chip.clientId] = {
              download: 0,
              upload: 0,
              chips: 0,
              name: clientName
            };
          }
          
          clientData[chip.clientId].download += chip.dataUsage?.download || 0;
          clientData[chip.clientId].upload += chip.dataUsage?.upload || 0;
          clientData[chip.clientId].chips += 1;
        }
      });
      
      return Object.entries(clientData).map(([clientId, data]) => ({
        id: clientId,
        name: data.name,
        download: data.download,
        upload: data.upload,
        chips: data.chips
      }));
    } else if (groupBy === "OPERADORA") {
      const carrierData: Record<string, { download: number; upload: number; chips: number }> = {};
      
      chipsWithData.forEach(chip => {
        if (!carrierData[chip.carrier]) {
          carrierData[chip.carrier] = {
            download: 0,
            upload: 0,
            chips: 0
          };
        }
        
        carrierData[chip.carrier].download += chip.dataUsage?.download || 0;
        carrierData[chip.carrier].upload += chip.dataUsage?.upload || 0;
        carrierData[chip.carrier].chips += 1;
      });
      
      return Object.entries(carrierData).map(([carrier, data]) => ({
        id: carrier,
        name: carrier,
        download: data.download,
        upload: data.upload,
        chips: data.chips
      }));
    } else {
      // Group by chip (default)
      return chipsWithData.map(chip => {
        const client = chip.clientId ? getClientById(chip.clientId) : null;
        
        return {
          id: chip.id,
          number: chip.phoneNumber,
          carrier: chip.carrier,
          clientName: client ? client.name : "—",
          download: chip.dataUsage?.download || 0,
          upload: chip.dataUsage?.upload || 0
        };
      });
    }
  };

  // Sort data
  const sortData = (data: any[]) => {
    return [...data].sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  const processedData = sortData(groupData());
  
  // Data for chart
  const chartData = processedData.slice(0, 10).map(item => ({
    name: item.name || item.number || item.id,
    download: item.download,
    upload: item.upload,
  }));

  // Handle export to Excel
  const handleExport = () => {
    // This would be implemented with the actual Excel export functionality
    alert("Exportar dados para Excel");
  };

  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Consumo de Dados</h1>
          <p className="text-gray-500">Monitoramento de consumo dos chips ativos</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exportar para Excel
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Card className="w-full md:w-auto flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Download</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Download className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-2xl font-bold">
                {formatDataSize(chipsWithData.reduce((sum, chip) => sum + (chip.dataUsage?.download || 0), 0))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full md:w-auto flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Upload className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold">
                {formatDataSize(chipsWithData.reduce((sum, chip) => sum + (chip.dataUsage?.upload || 0), 0))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full md:w-auto flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chips Monitorados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Database className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-2xl font-bold">
                {chipsWithData.length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Gráfico de Consumo</CardTitle>
              <CardDescription>
                Top 10 consumidores de dados por {
                  groupBy === "CLIENTE" ? "cliente" :
                  groupBy === "OPERADORA" ? "operadora" : "chip"
                }
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DIÁRIO">Diário</SelectItem>
                  <SelectItem value="SEMANAL">Semanal</SelectItem>
                  <SelectItem value="MENSAL">Mensal</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Agrupar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CHIP">Chip</SelectItem>
                  <SelectItem value="CLIENTE">Cliente</SelectItem>
                  <SelectItem value="OPERADORA">Operadora</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatDataSize(value as number)} />
                <Legend />
                <Bar dataKey="download" name="Download" fill="#1E88E5" />
                <Bar dataKey="upload" name="Upload" fill="#43A047" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Detalhes de Consumo</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => toggleSort("download")}>
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {sortBy === "download" && (
                  <ArrowDownUp className={`h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                )}
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={() => toggleSort("upload")}>
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {sortBy === "upload" && (
                  <ArrowDownUp className={`h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                )}
                Upload
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              {groupBy === "CHIP" ? (
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Operadora</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Download</TableHead>
                  <TableHead>Upload</TableHead>
                </TableRow>
              ) : (
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Quantidade de Chips</TableHead>
                  <TableHead>Download Total</TableHead>
                  <TableHead>Upload Total</TableHead>
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {processedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Nenhum dado encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                processedData.map((item) => (
                  <TableRow key={item.id}>
                    {groupBy === "CHIP" ? (
                      <>
                        <TableCell>{item.number}</TableCell>
                        <TableCell>{item.carrier}</TableCell>
                        <TableCell>{item.clientName}</TableCell>
                        <TableCell>{formatDataSize(item.download)}</TableCell>
                        <TableCell>{formatDataSize(item.upload)}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.chips}</TableCell>
                        <TableCell>{formatDataSize(item.download)}</TableCell>
                        <TableCell>{formatDataSize(item.upload)}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
