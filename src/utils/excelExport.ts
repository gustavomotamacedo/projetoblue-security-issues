
import * as XLSX from 'xlsx';
import { Asset, Client } from '@/types/asset';
import { toast } from './toast';

interface ExportData {
  assets: Asset[];
  clients: Client[];
}

export const exportToExcel = ({ assets, clients }: ExportData) => {
  try {
    const workbook = XLSX.utils.book_new();
    
    // Assets worksheet
    const assetsForExport = assets.map(asset => {
      const baseAsset = {
        ID: asset.id,
        Tipo: asset.type === 'CHIP' ? 'Chip' : 'Roteador',
        Status: asset.status,
        'Data de Registro': asset.registrationDate,
        'Cliente ID': asset.clientId || 'N/A',
        Observações: asset.notes || '',
      };
      
      if (asset.type === 'CHIP') {
        return {
          ...baseAsset,
          ICCID: asset.iccid,
          'Número de Telefone': asset.phoneNumber,
          Operadora: asset.carrier,
        };
      } else {
        return {
          ...baseAsset,
          'ID Único': asset.uniqueId,
          Marca: asset.brand,
          Modelo: asset.model,
          SSID: asset.ssid,
          Senha: asset.password,
        };
      }
    });
    
    // Clients worksheet
    const clientsForExport = clients.map(client => ({
      ID: client.id,
      Nome: client.name,
      Documento: client.document,
      'Tipo de Documento': client.documentType,
      Contato: client.contact,
      Email: client.email,
      Endereço: client.address,
      Cidade: client.city,
      Estado: client.state,
      CEP: client.zipCode,
      'Quantidade de Ativos': client.assets.length,
    }));
    
    // Create worksheets
    const assetsWorksheet = XLSX.utils.json_to_sheet(assetsForExport);
    const clientsWorksheet = XLSX.utils.json_to_sheet(clientsForExport);
    
    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(workbook, assetsWorksheet, 'Ativos');
    XLSX.utils.book_append_sheet(workbook, clientsWorksheet, 'Clientes');
    
    // Generate excel file and trigger download
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    XLSX.writeFile(workbook, `telecom-inventory-${timestamp}.xlsx`);
    
    toast.success('Relatório exportado com sucesso!');
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    toast.error('Erro ao exportar relatório. Tente novamente.');
  }
};
