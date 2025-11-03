import { Badge } from "@/components/ui/badge";

type StatusType = "pago" | "pendente" | "vencido" | "agendado";

interface StatusBadgeProps {
  status: StatusType;
}

const statusConfig = {
  pago: {
    label: "Pago",
    className: "bg-success/10 text-success hover:bg-success/20 border-success/20",
  },
  pendente: {
    label: "Pendente",
    className: "bg-pending/10 text-pending hover:bg-pending/20 border-pending/20",
  },
  vencido: {
    label: "Vencido",
    className: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20",
  },
  agendado: {
    label: "Agendado",
    className: "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={config.className} data-testid={`badge-${status}`}>
      {config.label}
    </Badge>
  );
}
