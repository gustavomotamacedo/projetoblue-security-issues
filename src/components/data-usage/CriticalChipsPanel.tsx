
import React from 'react';
import { useDataUsage } from "@/context/DataUsageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingDown, WifiOff, Smartphone } from "lucide-react";
import { formatDataSize } from "@/utils/formatDataSize";
import { ChipWithMetrics } from '@/types/dataUsage';

interface CriticalChipsPanelProps {
  onSelectChip?: (chipId: string) => void;
}

export const CriticalChipsPanel: React.FC<CriticalChipsPanelProps> = ({ onSelectChip }) => {
  const { getUnderperformingChips } = useDataUsage();
  
  const criticalChips = getUnderperformingChips('critical');
  const warningChips = getUnderperformingChips('warning');
  
  const allCriticalChips = [...criticalChips, ...warningChips];
  
  if (allCriticalChips.length === 0) {
    return null;
  }
  
  return (
    <Card className="mb-6 border-red-200 bg-red-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          Chips com Consumo Crítico
        </CardTitle>
        <CardDescription>
          Estes chips precisam de atenção imediata
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {allCriticalChips.map((chip) => (
            <div 
              key={chip.id} 
              className={`flex items-center justify-between p-2 border rounded-md cursor-pointer
                ${chip.anomalyLevel === 'critical' ? 'bg-red-100 border-red-300' : 'bg-yellow-100 border-yellow-300'}
                hover:bg-opacity-80 transition-colors
              `}
              onClick={() => onSelectChip && onSelectChip(chip.id)}
            >
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{chip.clientName || "Cliente sem nome"}</p>
                  <p className="text-xs text-gray-500">
                    {chip.phoneNumber} - ICCID: {chip.iccid?.slice(-4) || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Badge 
                  className={
                    chip.anomalyLevel === 'critical' 
                      ? "bg-red-500" 
                      : "bg-yellow-500"
                  }
                >
                  {chip.anomalyLevel === 'critical' ? (
                    <WifiOff className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {chip.anomalyLevel === 'critical' ? 'Crítico' : 'Atenção'}
                </Badge>
                <span className="text-xs mt-1">
                  {formatDataSize(chip.metrics?.download || 0)} nos últimos 7 dias
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
