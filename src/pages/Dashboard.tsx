
import { useAssets } from "@/context/AssetContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Smartphone, 
  Wifi, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Clock,
  FileSpreadsheet
} from "lucide-react";
import { exportToExcel } from "@/utils/excelExport";

const Dashboard = () => {
  const { assets, clients, getAssetsByType, getAssetsByStatus } = useAssets();
  
  const totalChips = getAssetsByType("CHIP").length;
  const totalRouters = getAssetsByType("ROTEADOR").length;
  
  const availableChips = getAssetsByType("CHIP").filter(chip => chip.status === "DISPONÍVEL").length;
  const availableRouters = getAssetsByType("ROTEADOR").filter(router => router.status === "DISPONÍVEL").length;
  
  const problemAssets = assets.filter(asset => 
    ["SEM DADOS", "BLOQUEADO", "MANUTENÇÃO"].includes(asset.status)
  );

  const handleExportToExcel = () => {
    exportToExcel({ assets, clients });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleExportToExcel}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Exportar para Excel
          </Button>
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Atualizado: {new Date().toLocaleString('pt-BR')}
          </Badge>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Chips</CardTitle>
            <Smartphone className="h-4 w-4 text-telecom-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalChips}</div>
            <p className="text-xs text-muted-foreground">
              {availableChips} disponíveis
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Roteadores</CardTitle>
            <Wifi className="h-4 w-4 text-telecom-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRouters}</div>
            <p className="text-xs text-muted-foreground">
              {availableRouters} disponíveis
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos em Uso</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assets.filter(asset => 
                ["ALUGADO", "ASSINATURA"].includes(asset.status)
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Alugados ou em assinatura
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos com Problema</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{problemAssets.length}</div>
            <p className="text-xs text-muted-foreground">
              Necessitam atenção
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Ativos com Problema</CardTitle>
            <CardDescription>
              Ativos que precisam de atenção imediata
            </CardDescription>
          </CardHeader>
          <CardContent>
            {problemAssets.length > 0 ? (
              <div className="space-y-2">
                {problemAssets.slice(0, 5).map((asset) => (
                  <div 
                    key={asset.id} 
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <div className="flex items-center space-x-2">
                      {asset.type === "CHIP" ? (
                        <Smartphone className="h-4 w-4" />
                      ) : (
                        <Wifi className="h-4 w-4" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {asset.type === "CHIP" 
                            ? (asset as any).iccid.slice(-4) 
                            : (asset as any).uniqueId
                          }
                        </p>
                        <p className="text-xs text-gray-500">
                          {asset.type === "CHIP" 
                            ? (asset as any).carrier 
                            : (asset as any).brand
                          }
                        </p>
                      </div>
                    </div>
                    <Badge 
                      className={
                        asset.status === "SEM DADOS" 
                          ? "bg-amber-500" 
                          : asset.status === "BLOQUEADO" 
                            ? "bg-red-500" 
                            : "bg-blue-500"
                      }
                    >
                      {asset.status}
                    </Badge>
                  </div>
                ))}
                {problemAssets.length > 5 && (
                  <p className="text-xs text-center text-gray-500 mt-2">
                    + {problemAssets.length - 5} outros ativos com problema
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <CheckCircle className="h-8 w-8 mb-2" />
                <p className="text-sm">Não há ativos com problema</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Status dos Ativos</CardTitle>
            <CardDescription>
              Distribuição por status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { status: "DISPONÍVEL", icon: <CheckCircle className="h-4 w-4 text-green-500" />, color: "bg-green-100" },
                { status: "ALUGADO", icon: <Smartphone className="h-4 w-4 text-telecom-500" />, color: "bg-telecom-100" },
                { status: "ASSINATURA", icon: <Wifi className="h-4 w-4 text-telecom-500" />, color: "bg-telecom-100" },
                { status: "SEM DADOS", icon: <AlertCircle className="h-4 w-4 text-amber-500" />, color: "bg-amber-100" },
                { status: "BLOQUEADO", icon: <XCircle className="h-4 w-4 text-red-500" />, color: "bg-red-100" },
                { status: "MANUTENÇÃO", icon: <Clock className="h-4 w-4 text-blue-500" />, color: "bg-blue-100" },
              ].map(({ status, icon, color }) => {
                const count = getAssetsByStatus(status as any).length;
                const percentage = assets.length > 0 
                  ? Math.round((count / assets.length) * 100) 
                  : 0;
                
                return (
                  <div key={status} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {icon}
                        <span className="ml-2 text-sm">{status}</span>
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div 
                        className={`h-full ${color}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
