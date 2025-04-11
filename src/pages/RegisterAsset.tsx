import { useState } from "react";
import { useAssets } from "@/context/AssetContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, Wifi } from "lucide-react";
import { z } from "zod";
import { Asset, AssetType } from "@/types/asset";
import { toast } from "@/utils/toast";

const chipSchema = z.object({
  iccid: z.string()
    .length(20, "ICCID deve ter exatamente 20 dígitos")
    .regex(/^\d+$/, "ICCID deve conter apenas números"),
  phoneNumber: z.string().min(1, "Número da linha é obrigatório"),
  carrier: z.string().min(1, "Operadora é obrigatória"),
});

const routerSchema = z.object({
  uniqueId: z.string().min(1, "ID é obrigatório"),
  brand: z.string().min(1, "Marca é obrigatória"),
  model: z.string().min(1, "Modelo é obrigatório"),
  ssid: z.string().min(1, "SSID é obrigatório"),
  password: z.string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[a-zA-Z]/, "Senha deve conter pelo menos uma letra")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(/[^a-zA-Z0-9]/, "Senha deve conter pelo menos um caractere especial"),
});

const RegisterAsset = () => {
  const { assets, addAsset } = useAssets();
  const [activeTab, setActiveTab] = useState<string>("chip");

  const [chipData, setChipData] = useState({
    iccid: "",
    phoneNumber: "",
    carrier: "",
  });
  const [chipErrors, setChipErrors] = useState<Record<string, string>>({});

  const [routerData, setRouterData] = useState({
    uniqueId: "",
    brand: "",
    model: "",
    ssid: "",
    password: "",
  });
  const [routerErrors, setRouterErrors] = useState<Record<string, string>>({});

  const handleChipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      chipSchema.parse(chipData);
      
      const isDuplicate = assets.some(
        (asset) => asset.type === "CHIP" && 'iccid' in asset && asset.iccid === chipData.iccid
      );
      
      if (isDuplicate) {
        setChipErrors({ iccid: "ICCID já cadastrado no sistema" });
        return;
      }
      
      setChipErrors({});
      
      addAsset({
        type: "CHIP",
        registrationDate: new Date().toISOString(),
        iccid: chipData.iccid,
        phoneNumber: chipData.phoneNumber,
        carrier: chipData.carrier,
      } as Omit<Asset, "id" | "status">);
      
      setChipData({
        iccid: "",
        phoneNumber: "",
        carrier: "",
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setChipErrors(errors);
      }
    }
  };

  const handleRouterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      routerSchema.parse(routerData);
      
      const isDuplicate = assets.some(
        (asset) => asset.type === "ROTEADOR" && 'uniqueId' in asset && asset.uniqueId === routerData.uniqueId
      );
      
      if (isDuplicate) {
        setRouterErrors({ uniqueId: "ID já cadastrado no sistema" });
        return;
      }
      
      setRouterErrors({});
      
      addAsset({
        type: "ROTEADOR",
        registrationDate: new Date().toISOString(),
        uniqueId: routerData.uniqueId,
        brand: routerData.brand,
        model: routerData.model,
        ssid: routerData.ssid,
        password: routerData.password,
      } as Omit<Asset, "id" | "status">);
      
      setRouterData({
        uniqueId: "",
        brand: "",
        model: "",
        ssid: "",
        password: "",
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setRouterErrors(errors);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cadastro de Ativos</h1>
        <p className="text-muted-foreground">
          Cadastre chips e roteadores no sistema
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="chip" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            <span>Chip</span>
          </TabsTrigger>
          <TabsTrigger value="router" className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            <span>Roteador</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="chip">
            <Card>
              <CardHeader>
                <CardTitle>Cadastrar Novo Chip</CardTitle>
                <CardDescription>
                  Preencha os campos abaixo para cadastrar um novo chip no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChipSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="iccid">ICCID (20 dígitos)</Label>
                    <Input
                      id="iccid"
                      placeholder="Digite o ICCID do chip"
                      value={chipData.iccid}
                      onChange={(e) => setChipData({ ...chipData, iccid: e.target.value })}
                      className={chipErrors.iccid ? "border-red-500" : ""}
                    />
                    {chipErrors.iccid && (
                      <p className="text-sm text-red-500">{chipErrors.iccid}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Número da Linha</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="Digite o número da linha"
                      value={chipData.phoneNumber}
                      onChange={(e) => setChipData({ ...chipData, phoneNumber: e.target.value })}
                      className={chipErrors.phoneNumber ? "border-red-500" : ""}
                    />
                    {chipErrors.phoneNumber && (
                      <p className="text-sm text-red-500">{chipErrors.phoneNumber}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="carrier">Operadora</Label>
                    <Input
                      id="carrier"
                      placeholder="Digite a operadora"
                      value={chipData.carrier}
                      onChange={(e) => setChipData({ ...chipData, carrier: e.target.value })}
                      className={chipErrors.carrier ? "border-red-500" : ""}
                    />
                    {chipErrors.carrier && (
                      <p className="text-sm text-red-500">{chipErrors.carrier}</p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full">Cadastrar Chip</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="router">
            <Card>
              <CardHeader>
                <CardTitle>Cadastrar Novo Roteador</CardTitle>
                <CardDescription>
                  Preencha os campos abaixo para cadastrar um novo roteador no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRouterSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="uniqueId">ID Único</Label>
                    <Input
                      id="uniqueId"
                      placeholder="Digite o ID único do roteador"
                      value={routerData.uniqueId}
                      onChange={(e) => setRouterData({ ...routerData, uniqueId: e.target.value })}
                      className={routerErrors.uniqueId ? "border-red-500" : ""}
                    />
                    {routerErrors.uniqueId && (
                      <p className="text-sm text-red-500">{routerErrors.uniqueId}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Input
                      id="brand"
                      placeholder="Digite a marca do roteador"
                      value={routerData.brand}
                      onChange={(e) => setRouterData({ ...routerData, brand: e.target.value })}
                      className={routerErrors.brand ? "border-red-500" : ""}
                    />
                    {routerErrors.brand && (
                      <p className="text-sm text-red-500">{routerErrors.brand}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo</Label>
                    <Input
                      id="model"
                      placeholder="Digite o modelo do roteador"
                      value={routerData.model}
                      onChange={(e) => setRouterData({ ...routerData, model: e.target.value })}
                      className={routerErrors.model ? "border-red-500" : ""}
                    />
                    {routerErrors.model && (
                      <p className="text-sm text-red-500">{routerErrors.model}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ssid">SSID</Label>
                    <Input
                      id="ssid"
                      placeholder="Digite o SSID do roteador"
                      value={routerData.ssid}
                      onChange={(e) => setRouterData({ ...routerData, ssid: e.target.value })}
                      className={routerErrors.ssid ? "border-red-500" : ""}
                    />
                    {routerErrors.ssid && (
                      <p className="text-sm text-red-500">{routerErrors.ssid}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Digite a senha do roteador"
                      value={routerData.password}
                      onChange={(e) => setRouterData({ ...routerData, password: e.target.value })}
                      className={routerErrors.password ? "border-red-500" : ""}
                    />
                    {routerErrors.password && (
                      <p className="text-sm text-red-500">{routerErrors.password}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      A senha deve conter pelo menos 8 caracteres, uma letra, um número e um caractere especial
                    </p>
                  </div>
                  
                  <Button type="submit" className="w-full">Cadastrar Roteador</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default RegisterAsset;
