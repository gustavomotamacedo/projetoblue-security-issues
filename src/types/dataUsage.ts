
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
