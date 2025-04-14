import { useState } from "react";
import { useAssets } from "@/context/useAssets";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, Wifi, Shield, KeyRound, Hash, AlertTriangle } from "lucide-react";
import { z } from "zod";
import { Asset, AssetType } from "@/types/asset";
import { toast } from "@/utils/toast";
import { checkPasswordStrength } from "@/utils/passwordStrength";

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
  password: z.string().min(1, "Senha é obrigatória"),
  ipAddress: z.string()
    .regex(/^(\d{1,3}\.){3}\d{1,3}$/, "Formato de IP inválido")
    .refine(
      (ip) => {
        const parts = ip.split(".");
        return parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255);
      },
      { message: "IP deve estar entre 0 e 255 para cada octeto" }
    ),
  adminUser: z.string()
    .min(3, "Usuário deve ter pelo menos 3 caracteres")
    .regex(/^[a-zA-Z0-9_-]+$/, "Usuário deve conter apenas letras, números, hífens e underscores"),
  adminPassword: z.string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[a-zA-Z]/, "Senha deve conter pelo menos uma letra")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(/[^a-zA-Z0-9]/, "Senha deve conter pelo menos um caractere especial"),
  imei: z.string()
    .regex(/^\d{15}$/, "IMEI deve conter exatamente 15 dígitos numéricos"),
  serialNumber: z.string()
    .min(5, "SN deve ter pelo menos 5 caracteres")
    .max(30, "SN deve ter no máximo 30 caracteres")
    .regex(/^[a-zA-Z0-9]+$/, "SN deve conter apenas letras e números"),
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
    ipAddress: "",
    adminUser: "",
    adminPassword: "",
    imei: "",
    serialNumber: "",
    hasWeakPassword: false,
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
      toast.success("Chip cadastrado com sucesso!");
      
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
      
      const passwordStrength = checkPasswordStrength(routerData.password);
      
      addAsset({
        type: "ROTEADOR",
        registrationDate: new Date().toISOString(),
        uniqueId: routerData.uniqueId,
        brand: routerData.brand,
        model: routerData.model,
        ssid: routerData.ssid,
        password: routerData.password,
        ipAddress: routerData.ipAddress,
        adminUser: routerData.adminUser,
        adminPassword: routerData.adminPassword,
        imei: routerData.imei,
        serialNumber: routerData.serialNumber,
        hasWeakPassword: passwordStrength === 'weak',
      } as Omit<Asset, "id" | "status">);
      
      if (passwordStrength === 'weak') {
        toast.warning("Ativo cadastrado com senha fraca. Recomenda-se alterar para uma senha mais forte.");
      } else {
        toast.success("Roteador cadastrado com sucesso!");
      }
      
      setRouterData({
        uniqueId: "",
        brand: "",
        model: "",
        ssid: "",
        password: "",
        ipAddress: "",
        adminUser: "",
        adminPassword: "",
        imei: "",
        serialNumber: "",
        hasWeakPassword: false,
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="serialNumber" className="flex items-center gap-1">
                        <Hash className="h-4 w-4" />
                        SN (Número de Série)
                      </Label>
                      <Input
                        id="serialNumber"
                        placeholder="Digite o número de série"
                        value={routerData.serialNumber}
                        onChange={(e) => setRouterData({ ...routerData, serialNumber: e.target.value })}
                        className={routerErrors.serialNumber ? "border-red-500" : ""}
                      />
                      {routerErrors.serialNumber && (
                        <p className="text-sm text-red-500">{routerErrors.serialNumber}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Entre 5 e 30 caracteres, apenas letras e números
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="password" className="flex items-center gap-2">
                        Senha Wi-Fi
                        {routerData.password && checkPasswordStrength(routerData.password) === 'weak' && (
                          <div className="flex items-center text-red-500 text-xs gap-1">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Senha fraca</span>
                          </div>
                        )}
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Digite a senha do Wi-Fi"
                        value={routerData.password}
                        onChange={(e) => {
                          const newPassword = e.target.value;
                          setRouterData({ 
                            ...routerData, 
                            password: newPassword,
                            hasWeakPassword: checkPasswordStrength(newPassword) === 'weak'
                          });
                        }}
                        className={`${routerErrors.password ? "border-red-500" : ""} ${
                          routerData.password && checkPasswordStrength(routerData.password) === 'weak' 
                            ? "border-orange-500" 
                            : ""
                        }`}
                      />
                      {routerErrors.password && (
                        <p className="text-sm text-red-500">{routerErrors.password}</p>
                      )}
                      {routerData.password && checkPasswordStrength(routerData.password) === 'weak' && (
                        <p className="text-sm text-orange-500">
                          Recomendado: Use uma senha com pelo menos 8 caracteres, incluindo letras, números e caracteres especiais
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ipAddress" className="flex items-center gap-1">
                        <Shield className="h-4 w-4" />
                        IP Gerência
                      </Label>
                      <Input
                        id="ipAddress"
                        placeholder="Ex: 192.168.0.1"
                        value={routerData.ipAddress}
                        onChange={(e) => setRouterData({ ...routerData, ipAddress: e.target.value })}
                        className={routerErrors.ipAddress ? "border-red-500" : ""}
                      />
                      {routerErrors.ipAddress && (
                        <p className="text-sm text-red-500">{routerErrors.ipAddress}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="imei" className="flex items-center gap-1">
                        <KeyRound className="h-4 w-4" />
                        IMEI
                      </Label>
                      <Input
                        id="imei"
                        placeholder="Digite o IMEI (15 dígitos)"
                        value={routerData.imei}
                        onChange={(e) => setRouterData({ ...routerData, imei: e.target.value })}
                        className={routerErrors.imei ? "border-red-500" : ""}
                      />
                      {routerErrors.imei && (
                        <p className="text-sm text-red-500">{routerErrors.imei}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        IMEI deve conter exatamente 15 dígitos numéricos
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adminUser" className="flex items-center gap-1">
                        <KeyRound className="h-4 w-4" />
                        Usuário administrador
                      </Label>
                      <Input
                        id="adminUser"
                        placeholder="Digite o usuário administrador"
                        value={routerData.adminUser}
                        onChange={(e) => setRouterData({ ...routerData, adminUser: e.target.value })}
                        className={routerErrors.adminUser ? "border-red-500" : ""}
                      />
                      {routerErrors.adminUser && (
                        <p className="text-sm text-red-500">{routerErrors.adminUser}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Mínimo 3 caracteres, apenas letras, números, hífens e underscores
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="adminPassword" className="flex items-center gap-1">
                        <KeyRound className="h-4 w-4" />
                        Senha de administrador
                      </Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        placeholder="Digite a senha de administrador"
                        value={routerData.adminPassword}
                        onChange={(e) => setRouterData({ ...routerData, adminPassword: e.target.value })}
                        className={routerErrors.adminPassword ? "border-red-500" : ""}
                      />
                      {routerErrors.adminPassword && (
                        <p className="text-sm text-red-500">{routerErrors.adminPassword}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Mínimo 8 caracteres, com letras, números e caracteres especiais
                      </p>
                    </div>
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
