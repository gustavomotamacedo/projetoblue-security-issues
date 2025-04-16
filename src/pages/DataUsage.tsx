
import { useState, useMemo, useEffect } from "react";
import { useDataUsage } from "@/context/DataUsageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Database, 
  Download, 
  Upload, 
  FileSpreadsheet,
  BarChart3,
  Layers
} from "lucide-react";
import { ChipWithMetrics, TimeRange, GroupByOption } from "@/types/dataUsage";
import { formatDataSize } from "@/utils/formatDataSize";
import { UsageFilters } from "@/components/data-usage/UsageFilters";
import { UsageChart } from "@/components/data-usage/UsageChart";
import { ChipSummaryCards } from "@/components/data-usage/ChipSummaryCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DataUsage() {
  const { 
    getActiveChipsWithMetrics, 
    getAvailableCarriers,
    getAvailableClients,
    getAvailableRegions
  } = useDataUsage();
  
  // State for filters
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [groupBy, setGroupBy] = useState<GroupByOption>("CHIP");
  const [clientFilter, setClientFilter] = useState<string>("");
  const [carrierFilter, setCarrierFilter] = useState<string>("");
  const [regionFilter, setRegionFilter] = useState<string>("");
  const [signalFilter, setSignalFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [viewType, setViewType] = useState<"cards" | "chart">("chart");
  
  // Get active chips with metrics
  const allChips = getActiveChipsWithMetrics();
  
  // Get available options for filters
  const availableCarriers = getAvailableCarriers();
  const availableClients = getAvailableClients();
  const availableRegions = getAvailableRegions();
  
  // Apply filters
  const filteredChips = useMemo(() => {
    return allChips.filter(chip => {
      if (clientFilter && chip.clientName !== clientFilter) return false;
      if (carrierFilter && chip.carrier !== carrierFilter) return false;
      if (regionFilter && chip.region !== regionFilter) return false;
      if (signalFilter && chip.quality?.status !== signalFilter) return false;
      return true;
    });
  }, [allChips, clientFilter, carrierFilter, regionFilter, signalFilter]);
  
  // Group data
  const groupedData = useMemo(() => {
    if (groupBy === "CLIENTE") {
      const clientData: Record<string, ChipWithMetrics & { 
        download: number; 
        upload: number; 
        chips: number; 
        name: string 
      }> = {};
      
      filteredChips.forEach(chip => {
        if (chip.clientId && chip.clientName) {
          if (!clientData[chip.clientName]) {
            clientData[chip.clientName] = {
              ...chip,
              download: 0,
              upload: 0,
              chips: 0,
              name: chip.clientName
            };
          }
          
          clientData[chip.clientName].download += chip.metrics?.download || 0;
          clientData[chip.clientName].upload += chip.metrics?.upload || 0;
          clientData[chip.clientName].chips += 1;
        }
      });
      
      return Object.values(clientData);
    } else if (groupBy === "OPERADORA") {
      const carrierData: Record<string, ChipWithMetrics & { 
        download: number; 
        upload: number; 
        chips: number; 
        name: string 
      }> = {};
      
      filteredChips.forEach(chip => {
        if (!carrierData[chip.carrier]) {
          carrierData[chip.carrier] = {
            ...chip,
            download: 0,
            upload: 0,
            chips: 0,
            name: chip.carrier
          };
        }
        
        carrierData[chip.carrier].download += chip.metrics?.download || 0;
        carrierData[chip.carrier].upload += chip.metrics?.upload || 0;
        carrierData[chip.carrier].chips += 1;
      });
      
      return Object.values(carrierData);
    } else if (groupBy === "REGIAO") {
      const regionData: Record<string, ChipWithMetrics & { 
        download: number; 
        upload: number; 
        chips: number; 
        name: string 
      }> = {};
      
      filteredChips.forEach(chip => {
        const region = chip.region || "Desconhecida";
        
        if (!regionData[region]) {
          regionData[region] = {
            ...chip,
            download: 0,
            upload: 0,
            chips: 0,
            name: region
          };
        }
        
        regionData[region].download += chip.metrics?.download || 0;
        regionData[region].upload += chip.metrics?.upload || 0;
        regionData[region].chips += 1;
      });
      
      return Object.values(regionData);
    } else {
      // Group by chip (default)
      return filteredChips.map(chip => ({
        ...chip,
        name: chip.phoneNumber || chip.id,
        download: chip.metrics?.download || 0,
        upload: chip.metrics?.upload || 0
      }));
    }
  }, [filteredChips, groupBy]);
  
  // Prepare chart data
  const chartData = useMemo(() => {
    return groupedData.map(item => ({
      name: item.name,
      download: item.download,
      upload: item.upload,
      quality: item.quality?.status,
      carrier: item.carrier,
      iccid: item.iccid,
      clientName: item.clientName
    })).sort((a, b) => b.download - a.download); // Sort by download
  }, [groupedData]);
  
  // Format labels for chart
  const formatLabel = (value: string) => {
    if (value.length > 15) {
      return value.substring(0, 12) + '...';
    }
    return value;
  };

  // Clear all filters
  const clearFilters = () => {
    setClientFilter("");
    setCarrierFilter("");
    setRegionFilter("");
    setSignalFilter("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  // Handle export to Excel
  const handleExport = () => {
    // This would be implemented with the actual Excel export functionality
    alert("Exportar dados para Excel");
  };
  
  // Calculate totals
  const totalDownload = filteredChips.reduce((sum, chip) => sum + (chip.metrics?.download || 0), 0);
  const totalUpload = filteredChips.reduce((sum, chip) => sum + (chip.metrics?.upload || 0), 0);
  const totalChips = filteredChips.length;
  
  // Check for chips with issues
  const chipsWithIssues = filteredChips.filter(
    chip => chip.quality?.status === 'UNSTABLE' || chip.quality?.status === 'POOR'
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Consumo de Dados</h1>
          <p className="text-gray-500">Monitoramento de consumo dos chips ativos em campo</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Exportar para Excel
          </Button>
          <Tabs value={viewType} onValueChange={(v) => setViewType(v as "cards" | "chart")}>
            <TabsList>
              <TabsTrigger value="chart">
                <BarChart3 className="h-4 w-4 mr-2" />
                Gráficos
              </TabsTrigger>
              <TabsTrigger value="cards">
                <Layers className="h-4 w-4 mr-2" />
                Cartões
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Download</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Download className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-2xl font-bold">
                {formatDataSize(totalDownload)}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Upload className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold">
                {formatDataSize(totalUpload)}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chips Monitorados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Database className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-2xl font-bold">
                {totalChips}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`md:col-span-1 ${chipsWithIssues > 0 ? 'border-yellow-300 bg-yellow-50' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chips com Instabilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className={`h-5 w-5 mr-2 rounded-full flex items-center justify-center 
                ${chipsWithIssues > 0 ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}>
                !
              </div>
              <div className="text-2xl font-bold">
                {chipsWithIssues}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <UsageFilters
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        clientFilter={clientFilter}
        setClientFilter={setClientFilter}
        carrierFilter={carrierFilter}
        setCarrierFilter={setCarrierFilter}
        regionFilter={regionFilter}
        setRegionFilter={setRegionFilter}
        signalFilter={signalFilter}
        setSignalFilter={setSignalFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        clearFilters={clearFilters}
        carriers={availableCarriers}
        clients={availableClients}
        regions={availableRegions}
      />

      <Tabs value={viewType} className="w-full">
        <TabsContent value="chart" className="mt-0">
          <UsageChart
            data={filteredChips}
            timeRange={timeRange}
            groupBy={groupBy}
            chartData={chartData}
            formatLabel={formatLabel}
            startDate={startDate}
            endDate={endDate}
          />
        </TabsContent>
        
        <TabsContent value="cards" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Cartões de Resumo por Chip</CardTitle>
            </CardHeader>
            <CardContent>
              <ChipSummaryCards chips={filteredChips} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
