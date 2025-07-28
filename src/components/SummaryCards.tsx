import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PortfolioState } from '@/hooks/useTradingSimulation';
import { DollarSign, TrendingUp, TrendingDown, BarChart3, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface SummaryCardsProps {
  portfolio: PortfolioState;
  currentPrice: number;
  personality: {
    name: string;
    description: string;
    explorationBonus: number;
    thoughts: string[];
  };
  episodeCount: number;
}

export function SummaryCards({ portfolio, currentPrice, personality, episodeCount }: SummaryCardsProps) {
  const totalValue = portfolio.cash + portfolio.shares * currentPrice;
  const dailyChange = totalValue - 10000;
  const dailyChangePercent = (dailyChange / 10000) * 100;
  const todayTrades = portfolio.trades.filter(trade => 
    Date.now() - trade.timestamp < 24 * 60 * 60 * 1000
  ).length;

  const cards = [
    {
      title: 'Portfolio Value',
      value: `$${totalValue.toFixed(2)}`,
      change: `${dailyChangePercent >= 0 ? '+' : ''}${dailyChangePercent.toFixed(2)}%`,
      changeColor: dailyChangePercent >= 0 ? 'text-success' : 'text-destructive',
      icon: DollarSign,
      gradient: true,
    },
    {
      title: 'Daily P&L',
      value: `${dailyChange >= 0 ? '+' : ''}$${Math.abs(dailyChange).toFixed(2)}`,
      change: `${todayTrades} trades today`,
      changeColor: 'text-muted-foreground',
      icon: dailyChange >= 0 ? TrendingUp : TrendingDown,
      iconColor: dailyChange >= 0 ? 'text-success' : 'text-destructive',
    },
    {
      title: 'Position',
      value: portfolio.shares > 0 ? `${portfolio.shares} shares` : 'Cash',
      change: `$${portfolio.cash.toFixed(2)} cash`,
      changeColor: 'text-muted-foreground',
      icon: BarChart3,
    },
    {
      title: 'Agent Level',
      value: `Level ${Math.floor(episodeCount / 3) + 1}`,
      change: personality.name,
      changeColor: 'text-primary',
      icon: Zap,
      special: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((card, index) => {
        const Icon = card.icon;
        
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className={`fintech-card hover:shadow-glow transition-all duration-300 ${
              card.gradient ? 'gradient-primary text-primary-foreground' : ''
            } ${card.special ? 'animate-float' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className={`text-xs font-medium ${
                      card.gradient ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    }`}>
                      {card.title}
                    </p>
                    <p className={`text-xl font-bold ${
                      card.gradient ? 'text-primary-foreground' : 'text-foreground'
                    }`}>
                      {card.value}
                    </p>
                    <p className={`text-xs ${
                      card.gradient ? 'text-primary-foreground/80' : card.changeColor
                    }`}>
                      {card.change}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${
                    card.gradient ? 'bg-primary-foreground/20' : 'bg-accent'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      card.gradient ? 'text-primary-foreground' : 
                      card.iconColor || 'text-accent-foreground'
                    }`} />
                  </div>
                </div>

                {card.special && (
                  <div className="mt-2 pt-2 border-t border-primary-foreground/20">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        {episodeCount === 0 ? 'Beginner' : 
                         episodeCount < 5 ? 'Learning' : 
                         episodeCount < 10 ? 'Improving' : 'Expert'}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}