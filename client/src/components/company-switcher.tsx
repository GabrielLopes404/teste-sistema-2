import { Building2, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface Company {
  id: string;
  name: string;
  cnpj: string;
}

const mockCompanies: Company[] = [
  { id: "1", name: "Empresa Principal", cnpj: "12.345.678/0001-90" },
  { id: "2", name: "Filial SP", cnpj: "98.765.432/0001-10" },
];

export function CompanySwitcher() {
  const [selectedCompany, setSelectedCompany] = useState(mockCompanies[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-[240px] justify-between" 
          data-testid="button-company-switcher"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{selectedCompany.name}</span>
              <span className="text-xs text-muted-foreground">{selectedCompany.cnpj}</span>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]" align="start">
        <DropdownMenuLabel>Empresas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mockCompanies.map((company) => (
          <DropdownMenuItem
            key={company.id}
            onClick={() => setSelectedCompany(company)}
            data-testid={`company-${company.id}`}
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium">{company.name}</span>
              <span className="text-xs text-muted-foreground">{company.cnpj}</span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem data-testid="button-add-company">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Empresa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
