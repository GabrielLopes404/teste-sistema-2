import { StatusBadge } from '../status-badge';

export default function StatusBadgeExample() {
  return (
    <div className="p-6 flex gap-2">
      <StatusBadge status="pago" />
      <StatusBadge status="pendente" />
      <StatusBadge status="vencido" />
      <StatusBadge status="agendado" />
    </div>
  );
}
