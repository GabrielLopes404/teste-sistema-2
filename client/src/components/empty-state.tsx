import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  gradient?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  gradient = "from-primary to-chart-2"
}: EmptyStateProps) {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Icon Container */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        {/* Outer Glow Ring */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-full blur-2xl opacity-20`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2] 
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Icon Background */}
        <motion.div 
          className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${gradient} p-0.5`}
          whileHover={{ rotate: 10, scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
            <Icon className="w-16 h-16 text-primary" />
          </div>
        </motion.div>

        {/* Floating Dots */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full bg-gradient-to-br ${gradient}`}
            style={{
              top: `${20 + i * 20}%`,
              right: `-${10 + i * 8}px`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>

      {/* Text Content */}
      <motion.div
        className="space-y-3 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </motion.div>

      {/* Action Button */}
      {action && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button 
            onClick={action.onClick}
            className={`bg-gradient-to-r ${gradient} text-white hover:shadow-lg hover:shadow-primary/30 transition-all`}
            size="lg"
          >
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
