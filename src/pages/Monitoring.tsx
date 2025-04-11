
import { useAssets } from "@/context/AssetContext";
import { AssetStatus } from "@/types/asset";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Signal, AlertTriangle, WifiOff, Wrench, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define status colors and icons
const statusConfig: Record<AssetStatus, { color: string; icon: React.ReactNode; description: string }> = {
  "DISPONÍVEL": { 
    color: "bg-green-100 text-green-700", 
    icon: <Signal className="h-5 w-5" />,
    description: "Ativos disponíveis para uso"
  },
  "ALUGADO": { 
    color: "bg-blue-100 text-blue-700", 
    icon: <Clock className="h-5 w-5" />,
    description: "Ativos alugados para clientes"
  },
  "ASSINATURA": { 
    color: "bg-purple-100 text-purple-700", 
    icon: <Clock className="h-5 w-5" />,
    description: "Ativos em uso por assinatura"
  },
  "SEM DADOS": { 
    color: "bg-gray-100 text-gray-700", 
    icon: <WifiOff className="h-5 w-5" />,
    description: "Ativos sem conectividade ou dados"
  },
  "BLOQUEADO": { 
    color: "bg-red-100 text-red-700", 
    icon: <AlertTriangle className="h-5 w-5" />,
    description: "Ativos bloqueados ou com problema"
  },
  "MANUTENÇÃO": { 
    color: "bg-yellow-100 text-yellow-700", 
    icon: <Wrench className="h-5 w-5" />,
    description: "Ativos em manutenção"
  }
};

export default function Monitoring() {
  const { assets, getAssetsByStatus, getClientById } = useAssets();
  
  // Calculate metrics
  const totalAssets = assets.length;
  const availableAssets = getAssetsByStatus("DISPONÍVEL").length;
  const rentedAssets = getAssetsByStatus("ALUGADO").length;
  const subscriptionAssets = getAssetsByStatus("ASSINATURA").length;
  const noDataAssets = getAssetsByStatus("SEM DADOS").length;
  const blockedAssets = getAssetsByStatus("BLOQUEADO").length;
  const maintenanceAssets = getAssetsByStatus("MANUTENÇÃO").length;
  
  // Calculate percentages
  const getPercentage = (count: number) => {
    return totalAssets > 0 ? Math.round((count / totalAssets) * 100) : 0;
  };

  // Get critical assets (those that need attention)
  const criticalAssets = [
    ...getAssetsByStatus("BLOQUEADO"),
    ...getAssetsByStatus("SEM DADOS"),
    ...getAssetsByStatus("MANUTENÇÃO")
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Monitoramento de Ativos</h1>
        <p className="text-gray-500">Monitore o status e condição de todos os ativos em tempo real</p>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total de Ativos</CardTitle>
            <CardDescription>Visão geral da sua frota</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAssets}</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-green-600 font-medium">{availableAssets}</span> disponíveis
              </div>
              <div>
                <span className="text-blue-600 font-medium">{rentedAssets}</span> alugados
              </div>
              <div>
                <span className="text-purple-600 font-medium">{subscriptionAssets}</span> assinatura
              </div>
              <div>
                <span className="text-red-600 font-medium">{blockedAssets + noDataAssets + maintenanceAssets}</span> críticos
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Status Críticos</CardTitle>
            <CardDescription>Ativos que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Bloqueados</span>
                <div className="flex items-center">
                  <span className="text-red-600 font-medium">{blockedAssets}</span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({getPercentage(blockedAssets)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sem Dados</span>
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium">{noDataAssets}</span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({getPercentage(noDataAssets)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Em Manutenção</span>
                <div className="flex items-center">
                  <span className="text-yellow-600 font-medium">{maintenanceAssets}</span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({getPercentage(maintenanceAssets)}%)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Ativos em Uso</CardTitle>
            <CardDescription>Ativos alocados para clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Alugados</span>
                <div className="flex items-center">
                  <span className="text-blue-600 font-medium">{rentedAssets}</span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({getPercentage(rentedAssets)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Assinatura</span>
                <div className="flex items-center">
                  <span className="text-purple-600 font-medium">{subscriptionAssets}</span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({getPercentage(subscriptionAssets)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Disponíveis</span>
                <div className="flex items-center">
                  <span className="text-green-600 font-medium">{availableAssets}</span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({getPercentage(availableAssets)}%)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert for critical assets */}
      {criticalAssets.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Atenção!</AlertTitle>
          <AlertDescription>
            Existem {criticalAssets.length} ativos que precisam de atenção.
          </AlertDescription>
        </Alert>
      )}

      {/* Assets by Status Tabs */}
      <Tabs defaultValue="BLOQUEADO">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
          {Object.entries(statusConfig).map(([status]) => (
            <TabsTrigger key={status} value={status}>
              {status}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {Object.entries(statusConfig).map(([status, config]) => (
          <TabsContent key={status} value={status}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${config.color}`}>
                    {config.icon}
                  </div>
                  <div>
                    <CardTitle>{status}</CardTitle>
                    <CardDescription>{config.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Detalhes</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data de Registro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getAssetsByStatus(status as AssetStatus).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          Nenhum ativo encontrado com este status.
                        </TableCell>
                      </TableRow>
                    ) : (
                      getAssetsByStatus(status as AssetStatus).map((asset) => {
                        const client = asset.clientId ? getClientById(asset.clientId) : null;
                        return (
                          <TableRow key={asset.id}>
                            <TableCell className="font-medium">{asset.id.substring(0, 8)}</TableCell>
                            <TableCell>{asset.type}</TableCell>
                            <TableCell>
                              {asset.type === "CHIP" ? 
                                `${(asset as any).carrier} - ${(asset as any).phoneNumber}` : 
                                `${(asset as any).brand} ${(asset as any).model}`
                              }
                            </TableCell>
                            <TableCell>
                              {client ? client.name : "—"}
                            </TableCell>
                            <TableCell>{new Date(asset.registrationDate).toLocaleDateString()}</TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
