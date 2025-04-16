
export interface SignalQuality {
  status: 'GOOD' | 'UNSTABLE' | 'POOR';
  message: string;
}

export interface DataUsageMetrics {
  download: number;
  upload: number;
  signalStrength: number;
  lastUpdated: string;
  // New fields for historical data
  history?: {
    timestamp: string;
    download: number;
    upload: number;
    signalStrength: number;
  }[];
}

export interface DataUsageState {
  metrics: Record<string, DataUsageMetrics>;
  signalQuality: Record<string, SignalQuality>;
}

export interface ChipWithMetrics {
  id: string;
  phoneNumber: string;
  carrier: string;
  clientId?: string;
  clientName?: string;
  metrics?: DataUsageMetrics;
  quality?: SignalQuality;
  iccid?: string;
  region?: string;
  isOnline?: boolean;
}

export type TimeRange = '24h' | '7d' | '30d' | 'custom';
export type GroupByOption = 'CHIP' | 'CLIENTE' | 'OPERADORA' | 'REGIAO';
export type SortByOption = 'download' | 'upload' | 'signalStrength' | 'lastUpdated';
