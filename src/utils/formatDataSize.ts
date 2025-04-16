
/**
 * Formats a data size in MB to a human-readable format
 * @param sizeInMB Data size in megabytes
 * @param compact Whether to show a compact format for charts
 * @returns Formatted data size string
 */
export const formatDataSize = (sizeInMB: number, compact: boolean = false): string => {
  if (sizeInMB >= 1000) {
    return `${(sizeInMB / 1000).toFixed(compact ? 1 : 2)} ${compact ? 'GB' : 'GB'}`;
  }
  return `${sizeInMB.toFixed(compact ? 0 : 1)} ${compact ? 'MB' : 'MB'}`;
};
