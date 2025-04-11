
import React, { createContext, useState, useContext, useEffect } from "react";
import { Asset, AssetStatus, Client, ChipAsset, RouterAsset, AssetType } from "@/types/asset";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/utils/toast";

interface AssetContextType {
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

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const useAssets = () => {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error("useAssets must be used within an AssetProvider");
  }
  return context;
};

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
    // Create a properly typed new asset based on the type
    let newAsset: Asset;
    
    if (assetData.type === "CHIP") {
      const chipData = assetData as Omit<ChipAsset, "id" | "status">;
      newAsset = {
        ...chipData,
        id: uuidv4(),
        status: "DISPONÍVEL" as AssetStatus,
      } as ChipAsset;
    } else {
      const routerData = assetData as Omit<RouterAsset, "id" | "status">;
      newAsset = {
        ...routerData,
        id: uuidv4(),
        status: "DISPONÍVEL" as AssetStatus,
      } as RouterAsset;
    }
    
    setAssets(prevAssets => [...prevAssets, newAsset]);
    toast.success("Ativo adicionado com sucesso!");
  };

  const updateAsset = (id: string, assetData: Partial<Asset>) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => {
        if (asset.id === id) {
          // Ensure we maintain the correct type when updating
          if (asset.type === "CHIP" && assetData.type === "CHIP") {
            return { ...asset, ...assetData } as ChipAsset;
          } else if (asset.type === "ROTEADOR" && assetData.type === "ROTEADOR") {
            return { ...asset, ...assetData } as RouterAsset;
          } else if (!assetData.type) {
            // If type is not being updated, maintain the original type
            return { ...asset, ...assetData };
          }
          // If trying to change type (shouldn't happen), maintain original
          return asset;
        }
        return asset;
      })
    );
    toast.success("Ativo atualizado com sucesso!");
  };

  const deleteAsset = (id: string) => {
    setAssets(prevAssets => prevAssets.filter(asset => asset.id !== id));
    
    setClients(prevClients => prevClients.map(client => ({
      ...client,
      assets: client.assets.filter(assetId => assetId !== id)
    })));
    
    toast.success("Ativo removido com sucesso!");
  };

  const getAssetById = (id: string) => {
    return assets.find(asset => asset.id === id);
  };

  const getAssetsByStatus = (status: AssetStatus) => {
    return assets.filter(asset => asset.status === status);
  };

  const getAssetsByType = (type: AssetType) => {
    return assets.filter(asset => asset.type === type);
  };

  const addClient = (clientData: Omit<Client, "id" | "assets">) => {
    const newClient = {
      ...clientData,
      id: uuidv4(),
      assets: [],
    };
    
    setClients(prevClients => [...prevClients, newClient]);
    toast.success("Cliente adicionado com sucesso!");
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    setClients(prevClients => prevClients.map(client => 
      client.id === id ? { ...client, ...clientData } : client
    ));
    toast.success("Cliente atualizado com sucesso!");
  };

  const deleteClient = (id: string) => {
    const clientToDelete = clients.find(client => client.id === id);
    if (clientToDelete) {
      clientToDelete.assets.forEach(assetId => {
        const asset = getAssetById(assetId);
        if (asset) {
          updateAsset(assetId, { 
            status: "DISPONÍVEL", 
            clientId: undefined 
          });
        }
      });
    }
    
    setClients(prevClients => prevClients.filter(client => client.id !== id));
    toast.success("Cliente removido com sucesso!");
  };

  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  const associateAssetToClient = (assetId: string, clientId: string) => {
    const asset = getAssetById(assetId);
    
    if (asset) {
      updateAsset(assetId, { 
        status: asset.type === "CHIP" ? "ALUGADO" : "ASSINATURA",
        clientId 
      });
      
      const client = getClientById(clientId);
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
    
    const client = getClientById(clientId);
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
    getAssetById,
    getAssetsByStatus,
    getAssetsByType,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    associateAssetToClient,
    removeAssetFromClient,
  };

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>;
};
