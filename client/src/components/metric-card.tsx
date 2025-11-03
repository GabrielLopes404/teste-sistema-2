import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  gradient?: string;
}

export function MetricCard({ title, value, change, icon: Icon, gradient = "from-primary to-chart-2" }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
        {/* Gradient Background Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
        
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3 relative z-10">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
          <motion.div 
            className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient}`}
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="h-5 w-5 text-white" />
          </motion.div>
        </CardHeader>
        <CardContent className="relative z-10">
          <motion.div 
            className="text-3xl font-bold font-mono tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text" 
            data-testid={`metric-${title}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {value}
          </motion.div>
          {change && (
            <motion.div 
              className="flex items-center gap-1.5 mt-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                animate={{ y: change.isPositive ? [-2, 0, -2] : [2, 0, 2] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {change.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </motion.div>
              <span className={`text-sm font-bold ${change.isPositive ? 'text-success' : 'text-destructive'}`}>
                {change.value}
              </span>
              <span className="text-xs text-muted-foreground font-medium">vs. mês anterior</span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
