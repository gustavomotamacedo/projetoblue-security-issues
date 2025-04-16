
import React, { createContext, useState, useContext, useEffect } from 'react';
import { DataUsageState, SignalQuality, DataUsageMetrics } from '@/types/dataUsage';
import { useAssets } from './useAssets';
import { toast } from '@/utils/toast';
import { ChipAsset } from '@/types/asset';

interface DataUsageContextType {
  dataUsage: DataUsageState;
  updateMetrics: (assetId: string, metrics: DataUsageMetrics) => void;
  getSignalQuality: (assetId: string) => SignalQuality | undefined;
  getActiveChipsWithMetrics: () => Array<ChipAsset & { metrics?: DataUsageMetrics; quality?: SignalQuality }>;
}

const DataUsageContext = createContext<DataUsageContextType | undefined>(undefined);

export const useDataUsage = () => {
  const context = useContext(DataUsageContext);
  if (!context) {
    throw new Error('useDataUsage must be used within a DataUsageProvider');
  }
  return context;
};

export const DataUsageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { assets, clients } = useAssets();
  const [dataUsage, setDataUsage] = useState<DataUsageState>(() => {
    const saved = localStorage.getItem('dataUsage');
    return saved ? JSON.parse(saved) : { metrics: {}, signalQuality: {} };
  });

  useEffect(() => {
    localStorage.setItem('dataUsage', JSON.stringify(dataUsage));
  }, [dataUsage]);

  const evaluateSignalQuality = (metrics: DataUsageMetrics): SignalQuality => {
    const { signalStrength, download, upload } = metrics;
    
    if (signalStrength >= 70 && download >= 1000 && upload >= 500) {
      return { status: 'GOOD', message: 'Sinal estável e performático' };
    } else if (signalStrength >= 50 && download >= 500 && upload >= 200) {
      return { status: 'UNSTABLE', message: 'Possível instabilidade detectada' };
    } else {
      return { status: 'POOR', message: 'Sinal fraco, necessita atenção' };
    }
  };

  const updateMetrics = (assetId: string, metrics: DataUsageMetrics) => {
    setDataUsage(prev => {
      const quality = evaluateSignalQuality(metrics);
      const newState = {
        metrics: { ...prev.metrics, [assetId]: metrics },
        signalQuality: { ...prev.signalQuality, [assetId]: quality }
      };

      if (quality.status !== 'GOOD') {
        const asset = assets.find(a => a.id === assetId);
        const client = asset?.clientId ? clients.find(c => c.id === asset.clientId) : undefined;
        
        if (client) {
          toast.error(`Instabilidade detectada no chip ${assetId} do cliente ${client.name}`);
        }
      }

      return newState;
    });
  };

  const getSignalQuality = (assetId: string) => dataUsage.signalQuality[assetId];

  const getActiveChipsWithMetrics = () => {
    return assets
      .filter((asset): asset is ChipAsset => 
        asset.type === "CHIP" && 
        Boolean(asset.clientId) && 
        ["ALUGADO", "ASSINATURA"].includes(asset.status)
      )
      .map(chip => ({
        ...chip,
        metrics: dataUsage.metrics[chip.id],
        quality: dataUsage.signalQuality[chip.id]
      }));
  };

  const value = {
    dataUsage,
    updateMetrics,
    getSignalQuality,
    getActiveChipsWithMetrics
  };

  return (
    <DataUsageContext.Provider value={value}>
      {children}
    </DataUsageContext.Provider>
  );
};
