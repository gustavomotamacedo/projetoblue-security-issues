
import React, { useState, useEffect } from "react";
import { useAssets } from "@/context/useAssets";
import { Asset, ChipAsset, RouterAsset } from "@/types/asset";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Wifi, Smartphone, KeyRound, Monitor, Hash, Phone, Briefcase } from "lucide-react";

interface EditAssetDialogProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditAssetDialog = ({ asset, isOpen, onClose }: EditAssetDialogProps) => {
  const { updateAsset } = useAssets();
  
  const [chipData, setChipData] = useState<Partial<ChipAsset>>({
    iccid: "",
    phoneNumber: "",
    carrier: "",
  });
  
  const [routerData, setRouterData] = useState<Partial<RouterAsset>>({
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
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Reset form data when the asset changes
  useEffect(() => {
    if (!asset) return;
    
    setErrors({});
    
    if (asset.type === "CHIP") {
      const chipAsset = asset as ChipAsset;
      setChipData({
        iccid: chipAsset.iccid,
        phoneNumber: chipAsset.phoneNumber,
        carrier: chipAsset.carrier,
      });
    } else {
      const routerAsset = asset as RouterAsset;
      setRouterData({
        uniqueId: routerAsset.uniqueId,
        brand: routerAsset.brand,
        model: routerAsset.model,
        ssid: routerAsset.ssid,
        password: routerAsset.password,
        ipAddress: routerAsset.ipAddress || "",
        adminUser: routerAsset.adminUser || "",
        adminPassword: routerAsset.adminPassword || "",
        imei: routerAsset.imei || "",
        serialNumber: routerAsset.serialNumber || "",
      });
    }
  }, [asset]);
  
  if (!asset) return null;
  
  const validateChipData = () => {
    const newErrors: Record<string, string> = {};
    
    if (!chipData.iccid?.trim()) {
      newErrors.iccid = "ICCID é obrigatório";
    }
    
    if (!chipData.phoneNumber?.trim()) {
      newErrors.phoneNumber = "Número do telefone é obrigatório";
    }
    
    if (!chipData.carrier?.trim()) {
      newErrors.carrier = "Operadora é obrigatória";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateRouterData = () => {
    const newErrors: Record<string, string> = {};
    
    if (!routerData.uniqueId?.trim()) {
      newErrors.uniqueId = "ID único é obrigatório";
    }
    
    if (!routerData.brand?.trim()) {
      newErrors.brand = "Marca é obrigatória";
    }
    
    if (!routerData.model?.trim()) {
      newErrors.model = "Modelo é obrigatório";
    }
    
    if (!routerData.ssid?.trim()) {
      newErrors.ssid = "SSID é obrigatório";
    }
    
    if (!routerData.password?.trim()) {
      newErrors.password = "Senha é obrigatória";
    }
    
    // IP Address validation (IPv4 format)
    if (routerData.ipAddress && !/^(\d{1,3}\.){3}\d{1,3}$/.test(routerData.ipAddress)) {
      newErrors.ipAddress = "Formato de IP inválido (ex: 192.168.0.1)";
    }
    
    // Admin user validation (min 3 chars, only letters, numbers, hyphens, underscores)
    if (routerData.adminUser && !/^[a-zA-Z0-9_-]{3,}$/.test(routerData.adminUser)) {
      newErrors.adminUser = "Usuário deve ter no mínimo 3 caracteres (letras, números, hífens e sublinhados)";
    }
    
    // Admin password validation (min 8 chars, letters, numbers, at least one special char)
    if (routerData.adminPassword && !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(routerData.adminPassword)) {
      newErrors.adminPassword = "Senha deve ter no mínimo 8 caracteres, incluindo letras, números e pelo menos um caractere especial";
    }
    
    // IMEI validation (exactly 15 digits)
    if (routerData.imei && !/^\d{15}$/.test(routerData.imei)) {
      newErrors.imei = "IMEI deve conter exatamente 15 dígitos numéricos";
    }
    
    // Serial Number validation (5-30 alphanumeric chars)
    if (routerData.serialNumber && !/^[a-zA-Z0-9]{5,30}$/.test(routerData.serialNumber)) {
      newErrors.serialNumber = "Número de série deve ter entre 5 e 30 caracteres alfanuméricos";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = () => {
    if (asset.type === "CHIP") {
      if (validateChipData()) {
        updateAsset(asset.id, chipData);
        onClose();
      }
    } else {
      if (validateRouterData()) {
        updateAsset(asset.id, routerData);
        onClose();
      }
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {asset.type === "CHIP" ? (
              <>
                <Smartphone className="h-5 w-5" />
                <span>Editar Chip</span>
              </>
            ) : (
              <>
                <Wifi className="h-5 w-5" />
                <span>Editar Roteador</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            Altere as informações do ativo conforme necessário.
          </DialogDescription>
        </DialogHeader>
        
        {asset.type === "CHIP" ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="iccid" className="flex items-center gap-1">
                <Hash className="h-4 w-4" />
                ICCID
              </Label>
              <Input
                id="iccid"
                value={chipData.iccid}
                onChange={(e) => setChipData({ ...chipData, iccid: e.target.value })}
                className={errors.iccid ? "border-red-500" : ""}
              />
              {errors.iccid && <p className="text-xs text-red-500">{errors.iccid}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                Número de Telefone
              </Label>
              <Input
                id="phoneNumber"
                value={chipData.phoneNumber}
                onChange={(e) => setChipData({ ...chipData, phoneNumber: e.target.value })}
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="carrier" className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                Operadora
              </Label>
              <Input
                id="carrier"
                value={chipData.carrier}
                onChange={(e) => setChipData({ ...chipData, carrier: e.target.value })}
                className={errors.carrier ? "border-red-500" : ""}
              />
              {errors.carrier && <p className="text-xs text-red-500">{errors.carrier}</p>}
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="uniqueId" className="flex items-center gap-1">
                <Hash className="h-4 w-4" />
                ID Único
              </Label>
              <Input
                id="uniqueId"
                value={routerData.uniqueId}
                onChange={(e) => setRouterData({ ...routerData, uniqueId: e.target.value })}
                className={errors.uniqueId ? "border-red-500" : ""}
              />
              {errors.uniqueId && <p className="text-xs text-red-500">{errors.uniqueId}</p>}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand" className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  Marca
                </Label>
                <Input
                  id="brand"
                  value={routerData.brand}
                  onChange={(e) => setRouterData({ ...routerData, brand: e.target.value })}
                  className={errors.brand ? "border-red-500" : ""}
                />
                {errors.brand && <p className="text-xs text-red-500">{errors.brand}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model" className="flex items-center gap-1">
                  <Monitor className="h-4 w-4" />
                  Modelo
                </Label>
                <Input
                  id="model"
                  value={routerData.model}
                  onChange={(e) => setRouterData({ ...routerData, model: e.target.value })}
                  className={errors.model ? "border-red-500" : ""}
                />
                {errors.model && <p className="text-xs text-red-500">{errors.model}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ssid" className="flex items-center gap-1">
                  <Wifi className="h-4 w-4" />
                  SSID
                </Label>
                <Input
                  id="ssid"
                  value={routerData.ssid}
                  onChange={(e) => setRouterData({ ...routerData, ssid: e.target.value })}
                  className={errors.ssid ? "border-red-500" : ""}
                />
                {errors.ssid && <p className="text-xs text-red-500">{errors.ssid}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-1">
                  <KeyRound className="h-4 w-4" />
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={routerData.password}
                  onChange={(e) => setRouterData({ ...routerData, password: e.target.value })}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ipAddress" className="flex items-center gap-1">
                <Monitor className="h-4 w-4" />
                IP Gerência
              </Label>
              <Input
                id="ipAddress"
                value={routerData.ipAddress}
                onChange={(e) => setRouterData({ ...routerData, ipAddress: e.target.value })}
                className={errors.ipAddress ? "border-red-500" : ""}
              />
              {errors.ipAddress && <p className="text-xs text-red-500">{errors.ipAddress}</p>}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adminUser" className="flex items-center gap-1">
                  <KeyRound className="h-4 w-4" />
                  Usuário administrador
                </Label>
                <Input
                  id="adminUser"
                  value={routerData.adminUser}
                  onChange={(e) => setRouterData({ ...routerData, adminUser: e.target.value })}
                  className={errors.adminUser ? "border-red-500" : ""}
                />
                {errors.adminUser && <p className="text-xs text-red-500">{errors.adminUser}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adminPassword" className="flex items-center gap-1">
                  <KeyRound className="h-4 w-4" />
                  Senha de administrador
                </Label>
                <Input
                  id="adminPassword"
                  type="password"
                  value={routerData.adminPassword}
                  onChange={(e) => setRouterData({ ...routerData, adminPassword: e.target.value })}
                  className={errors.adminPassword ? "border-red-500" : ""}
                />
                {errors.adminPassword && <p className="text-xs text-red-500">{errors.adminPassword}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imei" className="flex items-center gap-1">
                  <Hash className="h-4 w-4" />
                  IMEI
                </Label>
                <Input
                  id="imei"
                  value={routerData.imei}
                  onChange={(e) => setRouterData({ ...routerData, imei: e.target.value })}
                  className={errors.imei ? "border-red-500" : ""}
                />
                {errors.imei && <p className="text-xs text-red-500">{errors.imei}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serialNumber" className="flex items-center gap-1">
                  <Hash className="h-4 w-4" />
                  SN (Número de Série)
                </Label>
                <Input
                  id="serialNumber"
                  value={routerData.serialNumber}
                  onChange={(e) => setRouterData({ ...routerData, serialNumber: e.target.value })}
                  className={errors.serialNumber ? "border-red-500" : ""}
                />
                {errors.serialNumber && <p className="text-xs text-red-500">{errors.serialNumber}</p>}
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAssetDialog;
