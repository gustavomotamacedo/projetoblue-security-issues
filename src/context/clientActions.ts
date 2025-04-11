
import { v4 as uuidv4 } from "uuid";
import { Client } from "@/types/asset";

export const getClientById = (clients: Client[], id: string) => {
  return clients.find(client => client.id === id);
};

export const createClient = (clientData: Omit<Client, "id" | "assets">) => {
  return {
    ...clientData,
    id: uuidv4(),
    assets: [],
  };
};

export const updateClientInList = (clients: Client[], id: string, clientData: Partial<Client>): Client[] => {
  return clients.map(client => 
    client.id === id ? { ...client, ...clientData } : client
  );
};
