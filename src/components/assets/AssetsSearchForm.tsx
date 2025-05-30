
import React from 'react';
import { Search, Filter, RotateCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface AssetsSearchFormProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  filterStatus: string;
  handleSearch: (e: React.FormEvent) => void;
  handleFilterChange: (type: string, value: string) => void;
}

const AssetsSearchForm = ({
  searchTerm,
  setSearchTerm,
  filterType,
  filterStatus,
  handleSearch,
  handleFilterChange
}: AssetsSearchFormProps) => {
  
  const handleReset = () => {
    setSearchTerm('');
    handleFilterChange('type', 'all');
    handleFilterChange('status', 'all');
  };

  return (
    <Card className="border-legal-primary/20 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header da busca */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-legal-primary rounded-lg">
              <Search className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-legal-dark font-neue-haas text-lg">
                Buscar e Filtrar Ativos
              </h3>
              <p className="text-sm text-gray-600 font-neue-haas">
                Encontre rapidamente o equipamento que você precisa
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            {/* Campo de busca principal */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-legal-primary" />
              <Input
                type="text"
                placeholder="Pesquisar por ICCID, número de linha, rádio, modelo ou série..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-legal-primary/30 focus:border-legal-primary focus:ring-legal-primary/20 font-neue-haas"
              />
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtro por Tipo */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-legal-dark font-neue-haas flex items-center gap-2">
                  <Filter className="h-4 w-4 text-legal-secondary" />
                  Tipo de Solução
                </label>
                <Select
                  value={filterType}
                  onValueChange={(value) => handleFilterChange('type', value)}
                >
                  <SelectTrigger className="border-legal-secondary/30 focus:border-legal-secondary font-neue-haas">
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-legal-secondary/20">
                    <SelectItem value="all" className="font-neue-haas">Todos os Tipos</SelectItem>
                    <SelectItem value="CHIP" className="font-neue-haas">📱 Chips</SelectItem>
                    <SelectItem value="ROTEADOR" className="font-neue-haas">📡 Roteadores</SelectItem>
                    <SelectItem value="MODEM" className="font-neue-haas">📶 Modems</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Status */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-legal-dark font-neue-haas flex items-center gap-2">
                  <Filter className="h-4 w-4 text-legal-secondary" />
                  Status do Ativo
                </label>
                <Select
                  value={filterStatus}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger className="border-legal-secondary/30 focus:border-legal-secondary font-neue-haas">
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-legal-secondary/20">
                    <SelectItem value="all" className="font-neue-haas">Todos os Status</SelectItem>
                    <SelectItem value="DISPONÍVEL" className="font-neue-haas">✓ Disponível</SelectItem>
                    <SelectItem value="EM LOCAÇÃO" className="font-neue-haas">📍 Em Locação</SelectItem>
                    <SelectItem value="EM ASSINATURA" className="font-neue-haas">📋 Em Assinatura</SelectItem>
                    <SelectItem value="SEM DADOS" className="font-neue-haas">⚠️ Sem Dados</SelectItem>
                    <SelectItem value="BLOQUEADO" className="font-neue-haas">🚫 Bloqueado</SelectItem>
                    <SelectItem value="EM MANUTENÇÃO" className="font-neue-haas">🔧 Em Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Botão de Busca */}
              <div className="space-y-2">
                <label className="text-sm text-transparent">Ações</label>
                <Button
                  type="submit"
                  className="w-full h-10 bg-legal-primary hover:bg-legal-dark text-white font-bold font-neue-haas transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Buscar Ativos
                </Button>
              </div>

              {/* Botão de Reset */}
              <div className="space-y-2">
                <label className="text-sm text-transparent">Reset</label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="w-full h-10 border-legal-secondary text-legal-secondary hover:bg-legal-secondary hover:text-white font-bold font-neue-haas transition-all duration-200"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </form>

          {/* Dicas de busca */}
          <div className="mt-4 p-3 bg-legal-primary/5 rounded-lg border border-legal-primary/20">
            <p className="text-xs text-legal-dark font-neue-haas">
              💡 <strong>Dica:</strong> Use números para buscar linhas telefônicas, ou digite texto para encontrar por ICCID, modelo ou série.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetsSearchForm;
