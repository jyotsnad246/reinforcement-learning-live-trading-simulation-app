import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MarketData, TradeAction } from '@/hooks/useTradingSimulation';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TradePointsChartProps {
  marketData: MarketData[];
  trades: TradeAction[];
}

export function TradePointsChart({ marketData, trades }: TradePointsChartProps) {
  const chartData = marketData.map((data, index) => ({
    x: index,
    y: data.price,
    timestamp: new Date(data.timestamp).toLocaleDateString(),
  }));

  const buyTrades = trades
    .filter(trade => trade.action === 'buy')
    .map(trade => {
      const dataPoint = marketData.find(d => Math.abs(d.timestamp - trade.timestamp) < 86400000);
      const index = marketData.indexOf(dataPoint!);
      return {
        x: index,
        y: trade.price,
        confidence: trade.confidence,
        reason: trade.reason,
      };
    });

  const sellTrades = trades
    .filter(trade => trade.action === 'sell')
    .map(trade => {
      const dataPoint = marketData.find(d => Math.abs(d.timestamp - trade.timestamp) < 86400000);
      const index = marketData.indexOf(dataPoint!);
      return {
        x: index,
        y: trade.price,
        confidence: trade.confidence,
        reason: trade.reason,
      };
    });

  const chartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--muted-foreground))",
    },
    buy: {
      label: "Buy",
      color: "hsl(var(--success))",
    },
    sell: {
      label: "Sell",
      color: "hsl(var(--destructive))",
    },
  };

  const tradeStats = {
    total: trades.length,
    buys: trades.filter(t => t.action === 'buy').length,
    sells: trades.filter(t => t.action === 'sell').length,
    holds: trades.filter(t => t.action === 'hold').length,
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Trade Points Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-success" />
              {tradeStats.buys} Buys
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-destructive" />
              {tradeStats.sells} Sells
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Minus className="h-3 w-3 text-muted-foreground" />
              {tradeStats.holds} Holds
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={chartData}>
              <XAxis 
                type="number" 
                dataKey="x" 
                domain={['dataMin', 'dataMax']}
                tick={false}
                axisLine={false}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                domain={['dataMin', 'dataMax']}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              
              {/* Price line */}
              <Scatter
                name="Price"
                data={chartData}
                fill="var(--color-price)"
                fillOpacity={0.6}
                r={1}
              />
              
              {/* Buy points */}
              <Scatter
                name="Buy Orders"
                data={buyTrades}
                fill="var(--color-buy)"
                r={6}
              />
              
              {/* Sell points */}
              <Scatter
                name="Sell Orders"
                data={sellTrades}
                fill="var(--color-sell)"
                r={6}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {trades.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium">Recent Trades</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {trades.slice(-5).reverse().map((trade, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {trade.action === 'buy' ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : trade.action === 'sell' ? (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    ) : (
                      <Minus className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span className="capitalize">{trade.action}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>${trade.price.toFixed(2)}</span>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(trade.confidence * 100)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}