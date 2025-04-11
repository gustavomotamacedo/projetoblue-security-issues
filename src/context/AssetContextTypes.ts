
import { Asset, AssetStatus, Client, AssetType } from "@/types/asset";

export interface AssetContextType {
  assets: Asset[];
  clients: Client[];
  addAsset: (asset: Omit<Asset, "id" | "status">) => void;
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  getAssetById: (id: string) => Asset | undefined;
  getAssetsByStatus: (status: AssetStatus) => Asset[];
  getAssetsByType: (type: AssetType) => Asset[];
  addClient: (client: Omit<Client, "id" | "assets">) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  associateAssetToClient: (assetId: string, clientId: string) => void;
  removeAssetFromClient: (assetId: string, clientId: string) => void;
}
