
export type AssetStatus = 
  | "DISPONÍVEL" 
  | "ALUGADO" 
  | "ASSINATURA" 
  | "SEM DADOS" 
  | "BLOQUEADO" 
  | "MANUTENÇÃO";

export type AssetType = "CHIP" | "ROTEADOR";

export interface BaseAsset {
  id: string;
  type: AssetType;
  registrationDate: string;
  status: AssetStatus;
  notes?: string;
  clientId?: string;
}

export interface ChipAsset extends BaseAsset {
  type: "CHIP";
  iccid: string;
  phoneNumber: string;
  carrier: string;
}

export interface RouterAsset extends BaseAsset {
  type: "ROTEADOR";
  uniqueId: string;
  brand: string;
  model: string;
  ssid: string;
  password: string;
}

export type Asset = ChipAsset | RouterAsset;

export interface Client {
  id: string;
  name: string;
  document: string;
  documentType: "CPF" | "CNPJ";
  contact: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  assets: string[];
}
