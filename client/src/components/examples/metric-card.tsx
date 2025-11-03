import { MetricCard } from '../metric-card';
import { DollarSign } from 'lucide-react';

export default function MetricCardExample() {
  return (
    <div className="p-6">
      <MetricCard
        title="Saldo Atual"
        value="R$ 45.230,00"
        change={{ value: "+12.5%", isPositive: true }}
        icon={DollarSign}
      />
    </div>
  );
}
