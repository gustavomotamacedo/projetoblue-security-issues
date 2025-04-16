import React, { createContext, useState, useEffect } from "react";
import { Asset, AssetStatus, Client, AssetType, SubscriptionInfo, ChipAsset, RouterAsset } from "@/types/asset";
import { AssetContextType } from "./AssetContextTypes";
import { AssetHistoryEntry } from "@/types/assetHistory";
import { toast } from "@/utils/toast";
import { v4 as uuidv4 } from "uuid";
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

  const [history, setHistory] = useState<AssetHistoryEntry[]>(() => {
    const savedHistory = localStorage.getItem("assetHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem("assets", JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem("assetHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const currentDate = new Date().toISOString();
    const updatedAssets = assets.map(asset => {
      if (asset.subscription && asset.subscription.endDate < currentDate && !asset.subscription.isExpired) {
        return {
          ...asset,
          subscription: {
            ...asset.subscription,
            isExpired: true
          }
        };
      }
      return asset;
    });

    if (JSON.stringify(updatedAssets) !== JSON.stringify(assets)) {
      setAssets(updatedAssets);
    }
  }, [assets]);

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
            status: "DISPONÍVEL" as AssetStatus, 
            clientId: undefined,
            subscription: undefined
          });
        }
      });
    }
    
    setClients((prevClients: Client[]) => prevClients.filter(client => client.id !== id));
    toast.success("Cliente removido com sucesso!");
  };

  const addHistoryEntry = (entryData: Omit<AssetHistoryEntry, "id" | "timestamp">) => {
    const newEntry: AssetHistoryEntry = {
      ...entryData,
      id: uuidv4(),
      timestamp: new Date().toISOString()
    };
    
    setHistory(prevHistory => [...prevHistory, newEntry]);
    toast.success("Histórico registrado com sucesso!");
  };

  const getAssetHistory = (assetId: string) => {
    return history.filter(entry => 
      entry.assetIds.includes(assetId)
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getClientHistory = (clientId: string) => {
    return history.filter(entry => 
      entry.clientId === clientId
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const associateAssetToClient = (assetId: string, clientId: string, subscription?: SubscriptionInfo) => {
    const asset = getAssetById(assets, assetId);
    const client = getClientById(clients, clientId);
    
    if (asset && client) {
      let status: AssetStatus;
      
      if (subscription?.type === "ANUAL" || subscription?.type === "MENSAL") {
        status = "ASSINATURA";
      } else if (subscription?.type === "ALUGUEL") {
        status = "ALUGADO";
      } else {
        status = "ALUGADO"; // Default fallback
      }
      
      updateAsset(assetId, { 
        status,
        clientId,
        subscription: subscription ? {
          ...subscription,
          isExpired: false
        } : undefined
      });
      
      if (!client.assets.includes(assetId)) {
        updateClient(clientId, {
          assets: [...client.assets, assetId]
        });
      }
      
      const assetIdentifier = asset.type === "CHIP" 
        ? (asset as ChipAsset).iccid 
        : (asset as RouterAsset).uniqueId;
        
      addHistoryEntry({
        clientId,
        clientName: client.name,
        assetIds: [assetId],
        assets: [{
          id: assetId,
          type: asset.type,
          identifier: assetIdentifier
        }],
        operationType: status === "ASSINATURA" ? "ASSINATURA" : "ALUGUEL",
        comments: `Ativo ${assetIdentifier} associado ao cliente ${client.name}`
      });
      
      toast.success("Ativo vinculado ao cliente com sucesso!");
    }
  };

  const removeAssetFromClient = (assetId: string, clientId: string) => {
    const asset = getAssetById(assets, assetId);
    const client = getClientById(clients, clientId);
    
    if (asset && client) {
      let needsPasswordChange = false;
      
      if (asset.type === "ROTEADOR") {
        needsPasswordChange = true;
        toast.error("⚠️ O roteador saiu do cliente " + client.name + " e retornou ao estoque. Altere o SSID e a senha.");
      }
      
      updateAsset(assetId, { 
        status: "DISPONÍVEL" as AssetStatus,
        clientId: undefined,
        subscription: undefined,
        ...(asset.type === "ROTEADOR" ? { needsPasswordChange } : {})
      });
      
      updateClient(clientId, {
        assets: client.assets.filter(id => id !== assetId)
      });
      
      const assetIdentifier = asset.type === "CHIP" 
        ? (asset as ChipAsset).iccid 
        : (asset as RouterAsset).uniqueId;
        
      addHistoryEntry({
        clientId,
        clientName: client.name,
        assetIds: [assetId],
        assets: [{
          id: assetId,
          type: asset.type,
          identifier: assetIdentifier
        }],
        operationType: asset.status === "ASSINATURA" ? "ASSINATURA" : "ALUGUEL",
        event: "Retorno ao estoque",
        comments: `Ativo ${assetIdentifier} removido do cliente ${client.name}`
      });
      
      toast.success("Ativo desvinculado do cliente com sucesso!");
    }
  };

  const getExpiredSubscriptions = () => {
    return assets.filter(asset => 
      asset.subscription?.isExpired === true
    );
  };

  const returnAssetsToStock = (assetIds: string[]) => {
    let updated = false;
    
    const updatedAssets = assets.map(asset => {
      if (assetIds.includes(asset.id)) {
        updated = true;
        
        if (asset.clientId) {
          const client = getClientById(clients, asset.clientId);
          if (client) {
            setClients(prevClients => 
              updateClientInList(
                prevClients, 
                asset.clientId as string, 
                { assets: client.assets.filter(id => id !== asset.id) }
              )
            );
            
            const assetIdentifier = asset.type === "CHIP" 
              ? (asset as ChipAsset).iccid 
              : (asset as RouterAsset).uniqueId;
              
            addHistoryEntry({
              clientId: asset.clientId,
              clientName: client.name,
              assetIds: [asset.id],
              assets: [{
                id: asset.id,
                type: asset.type,
                identifier: assetIdentifier
              }],
              operationType: asset.status === "ASSINATURA" ? "ASSINATURA" : "ALUGUEL",
              event: "Retorno ao estoque",
              comments: `Ativo ${assetIdentifier} retornado ao estoque`
            });
            
            if (asset.type === "ROTEADOR") {
              toast.error("⚠️ O roteador saiu do cliente " + client.name + " e retornou ao estoque. Altere o SSID e a senha.");
            }
          }
        }
        
        const baseUpdates = {
          status: "DISPONÍVEL" as AssetStatus,
          clientId: undefined,
          subscription: undefined,
        };
        
        const routerUpdates = asset.type === "ROTEADOR" ? { needsPasswordChange: true } : {};
        
        return {
          ...asset,
          ...baseUpdates,
          ...routerUpdates
        };
      }
      return asset;
    });
    
    if (updated) {
      setAssets(updatedAssets as Asset[]);
      toast.success("Ativos retornados ao estoque com sucesso!");
    }
  };

  const extendSubscription = (assetId: string, newEndDate: string) => {
    const asset = getAssetById(assets, assetId);
    if (asset && asset.subscription && asset.clientId) {
      const client = getClientById(clients, asset.clientId);
      
      updateAsset(assetId, {
        subscription: {
          ...asset.subscription,
          endDate: newEndDate,
          isExpired: false
        }
      });
      
      if (client) {
        const assetIdentifier = asset.type === "CHIP" 
          ? (asset as ChipAsset).iccid 
          : (asset as RouterAsset).uniqueId;
          
        addHistoryEntry({
          clientId: asset.clientId,
          clientName: client.name,
          assetIds: [asset.id],
          assets: [{
            id: asset.id,
            type: asset.type,
            identifier: assetIdentifier
          }],
          operationType: "ASSINATURA",
          event: "Extensão de assinatura",
          comments: `Assinatura do ativo ${assetIdentifier} estendida até ${new Date(newEndDate).toLocaleDateString('pt-BR')}`
        });
      }
      
      toast.success("Assinatura estendida com sucesso!");
    }
  };

  const value = {
    assets,
    clients,
    history,
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
    getExpiredSubscriptions,
    returnAssetsToStock,
    extendSubscription,
    addHistoryEntry,
    getAssetHistory,
    getClientHistory,
  };

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>;
};
