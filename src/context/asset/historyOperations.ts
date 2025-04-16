
import { AssetHistoryEntry } from "@/types/assetHistory";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/utils/toast";

export const addHistoryEntry = (
  setHistory: (value: React.SetStateAction<AssetHistoryEntry[]>) => void,
  entryData: Omit<AssetHistoryEntry, "id" | "timestamp">
) => {
  const newEntry: AssetHistoryEntry = {
    ...entryData,
    id: uuidv4(),
    timestamp: new Date().toISOString()
  };
  
  setHistory(prevHistory => [...prevHistory, newEntry]);
  toast.success("Histórico registrado com sucesso!");
};

export const getAssetHistory = (
  history: AssetHistoryEntry[],
  assetId: string
) => {
  return history.filter(entry => 
    entry.assetIds.includes(assetId)
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const getClientHistory = (
  history: AssetHistoryEntry[],
  clientId: string
) => {
  return history.filter(entry => 
    entry.clientId === clientId
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
