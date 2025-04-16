
export interface SignalQuality {
  status: 'GOOD' | 'UNSTABLE' | 'POOR';
  message: string;
}

export interface DataUsageMetrics {
  download: number;
  upload: number;
  signalStrength: number;
  lastUpdated: string;
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
}
