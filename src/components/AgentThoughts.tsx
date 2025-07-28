import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentThoughtsProps {
  thoughts: string[];
  personality: {
    name: string;
    description: string;
    explorationBonus: number;
    thoughts: string[];
  };
}

export function AgentThoughts({ thoughts, personality }: AgentThoughtsProps) {
  const latestThoughts = thoughts.slice(-3).reverse();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="fintech-card animate-pulse-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Agent Thoughts
            </CardTitle>
            <Badge variant="secondary" className="gradient-primary text-primary-foreground">
              {personality.name}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{personality.description}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {latestThoughts.length > 0 ? (
                latestThoughts.map((thought, index) => (
                  <motion.div
                    key={`${thought}-${index}`}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                    className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border/50"
                  >
                    <MessageCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-relaxed">{thought}</p>
                      <span className="text-xs text-muted-foreground">
                        {index === 0 ? 'Just now' : `${index} step${index === 1 ? '' : 's'} ago`}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Agent is thinking... Start the simulation to see thoughts!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {latestThoughts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 pt-4 border-t border-border/50"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Decision confidence varies by market conditions</span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Thinking...
                </span>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}