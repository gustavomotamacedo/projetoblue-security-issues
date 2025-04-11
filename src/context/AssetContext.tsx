
import React, { createContext, useState, useEffect } from "react";
import { Asset, AssetStatus, Client, AssetType } from "@/types/asset";
import { AssetContextType } from "./AssetContextTypes";
import { toast } from "@/utils/toast";
import { 
  getAssetById, 
  getAssetsByStatus, 
  getAssetsByType, 
  createAsset, 
  updateAssetInList 
} from "./assetActions";
import { 
  getClientById, 
  createClient, 
  updateClientInList 
} from "./clientActions";

export const AssetContext = createContext<AssetContextType | undefined>(undefined);

export { useAssets } from "./useAssets";

export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(() => {
    const savedAssets = localStorage.getItem("assets");
    return savedAssets ? JSON.parse(savedAssets) : [];
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const savedClients = localStorage.getItem("clients");
    return savedClients ? JSON.parse(savedClients) : [];
  });

  useEffect(() => {
    localStorage.setItem("assets", JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  const addAsset = (assetData: Omit<Asset, "id" | "status">) => {
    const newAsset = createAsset(assetData);
    setAssets((prevAssets: Asset[]) => [...prevAssets, newAsset]);
    toast.success("Ativo adicionado com sucesso!");
  };

  const updateAsset = (id: string, assetData: Partial<Asset>) => {
    setAssets((prevAssets: Asset[]) => updateAssetInList(prevAssets, id, assetData));
    toast.success("Ativo atualizado com sucesso!");
  };

  const deleteAsset = (id: string) => {
    setAssets((prevAssets: Asset[]) => prevAssets.filter(asset => asset.id !== id));
    
    setClients((prevClients: Client[]) => prevClients.map(client => ({
      ...client,
      assets: client.assets.filter(assetId => assetId !== id)
    })));
    
    toast.success("Ativo removido com sucesso!");
  };

  const addClient = (clientData: Omit<Client, "id" | "assets">) => {
    const newClient = createClient(clientData);
    setClients((prevClients: Client[]) => [...prevClients, newClient]);
    toast.success("Cliente adicionado com sucesso!");
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    setClients((prevClients: Client[]) => updateClientInList(prevClients, id, clientData));
    toast.success("Cliente atualizado com sucesso!");
  };

  const deleteClient = (id: string) => {
    const clientToDelete = getClientById(clients, id);
    if (clientToDelete) {
      clientToDelete.assets.forEach(assetId => {
        const asset = getAssetById(assets, assetId);
        if (asset) {
          updateAsset(assetId, { 
            status: "DISPONÍVEL", 
            clientId: undefined 
          });
        }
      });
    }
    
    setClients((prevClients: Client[]) => prevClients.filter(client => client.id !== id));
    toast.success("Cliente removido com sucesso!");
  };

  const associateAssetToClient = (assetId: string, clientId: string) => {
    const asset = getAssetById(assets, assetId);
    
    if (asset) {
      updateAsset(assetId, { 
        status: asset.type === "CHIP" ? "ALUGADO" : "ASSINATURA",
        clientId 
      });
      
      const client = getClientById(clients, clientId);
      if (client && !client.assets.includes(assetId)) {
        updateClient(clientId, {
          assets: [...client.assets, assetId]
        });
      }
      
      toast.success("Ativo vinculado ao cliente com sucesso!");
    }
  };

  const removeAssetFromClient = (assetId: string, clientId: string) => {
    updateAsset(assetId, { 
      status: "DISPONÍVEL",
      clientId: undefined 
    });
    
    const client = getClientById(clients, clientId);
    if (client) {
      updateClient(clientId, {
        assets: client.assets.filter(id => id !== assetId)
      });
    }
    
    toast.success("Ativo desvinculado do cliente com sucesso!");
  };

  const value = {
    assets,
    clients,
    addAsset,
    updateAsset,
    deleteAsset,
    getAssetById: (id: string) => getAssetById(assets, id),
    getAssetsByStatus: (status: AssetStatus) => getAssetsByStatus(assets, status),
    getAssetsByType: (type: AssetType) => getAssetsByType(assets, type),
    addClient,
    updateClient,
    deleteClient,
    getClientById: (id: string) => getClientById(clients, id),
    associateAssetToClient,
    removeAssetFromClient,
  };

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>;
};
