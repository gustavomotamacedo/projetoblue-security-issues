
import React from 'react';
import { useDataUsage } from "@/context/DataUsageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingDown, WifiOff, Smartphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatDataSize } from "@/utils/formatDataSize";

const UnderperformingChipsPanel: React.FC = () => {
  const { getUnderperformingChips } = useDataUsage();
  const navigate = useNavigate();
  
  const underperformingChips = getUnderperformingChips();
  
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center text-lg">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            Chips com Baixo Consumo
          </CardTitle>
          <CardDescription>
            Chips alocados com consumo abaixo do esperado
          </CardDescription>
        </div>
        {underperformingChips.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={() => navigate("/data-usage")}
          >
            Ver detalhes <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {underperformingChips.length > 0 ? (
          <div className="space-y-2">
            {underperformingChips.slice(0, 5).map((chip) => (
              <div 
                key={chip.id} 
                className="flex items-center justify-between p-2 border rounded-md bg-red-50"
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
                    {formatDataSize(chip.metrics?.download || 0)} / 7d
                  </span>
                </div>
              </div>
            ))}
            {underperformingChips.length > 5 && (
              <p className="text-xs text-center text-gray-500 mt-2">
                + {underperformingChips.length - 5} outros chips com baixo consumo
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <TrendingDown className="h-8 w-8 mb-2" />
            <p className="text-sm">Não há chips com consumo abaixo do esperado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnderperformingChipsPanel;
