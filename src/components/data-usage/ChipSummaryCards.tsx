
import React from 'react';
import { ChipWithMetrics } from '@/types/dataUsage';
import { formatDataSize } from '@/utils/formatDataSize';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Signal, Download, Upload, Wifi, WifiOff, AlertTriangle } from 'lucide-react';

interface ChipSummaryCardsProps {
  chips: ChipWithMetrics[];
  onSelectChip?: (chipId: string) => void;
}

export const ChipSummaryCards: React.FC<ChipSummaryCardsProps> = ({ chips, onSelectChip }) => {
  if (chips.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum chip encontrado com os filtros selecionados.
      </div>
    );
  }

  const getQualityColor = (status?: string) => {
    switch (status) {
      case 'GOOD':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'UNSTABLE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'POOR':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {chips.map((chip) => (
        <Card 
          key={chip.id} 
          className={`hover:shadow-md transition-shadow cursor-pointer ${
            chip.anomalyLevel === 'critical' 
              ? 'border-red-300 bg-red-50' 
              : chip.anomalyLevel === 'warning'
                ? 'border-yellow-300 bg-yellow-50'
                : ''
          }`}
          onClick={() => onSelectChip && onSelectChip(chip.id)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <Smartphone className="h-4 w-4 mr-2 text-gray-500" />
                <h3 className="font-medium">{chip.phoneNumber || "N/A"}</h3>
              </div>
              <Badge variant="outline" className={getQualityColor(chip.quality?.status)}>
                {chip.quality?.status === 'GOOD' && <Signal className="h-3 w-3 mr-1" />}
                {chip.quality?.status === 'UNSTABLE' && <AlertTriangle className="h-3 w-3 mr-1" />}
                {chip.quality?.status === 'POOR' && <WifiOff className="h-3 w-3 mr-1" />}
                {chip.quality?.status === 'GOOD' ? 'Bom' : 
                  chip.quality?.status === 'UNSTABLE' ? 'Médio' : 
                  chip.quality?.status === 'POOR' ? 'Ruim' : 'Desconhecido'}
              </Badge>
            </div>
            
            <div className="text-sm text-gray-500 mb-3">
              <div>Cliente: <span className="font-medium text-gray-700">{chip.clientName || "N/A"}</span></div>
              <div>ICCID: <span className="font-medium text-gray-700">{chip.iccid || "N/A"}</span></div>
              <div>Operadora: <span className="font-medium text-gray-700">{chip.carrier || "N/A"}</span></div>
            </div>
            
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <Download className="h-4 w-4 text-blue-500 mr-1" />
                <span>{formatDataSize(chip.metrics?.download || 0)}</span>
              </div>
              <div className="flex items-center">
                <Upload className="h-4 w-4 text-green-500 mr-1" />
                <span>{formatDataSize(chip.metrics?.upload || 0)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-2 pt-0 flex justify-between items-center">
            <div className="text-xs text-gray-500">
              {chip.isOnline ? (
                <span className="flex items-center text-green-600">
                  <Wifi className="h-3 w-3 mr-1" /> Online
                </span>
              ) : (
                <span className="flex items-center text-gray-500">
                  <WifiOff className="h-3 w-3 mr-1" /> Offline
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {chip.region || "Região desconhecida"}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
