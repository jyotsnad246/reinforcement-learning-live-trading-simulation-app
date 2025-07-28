import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { MarketData, PortfolioState } from '@/hooks/useTradingSimulation';
import { TrendingUp, DollarSign } from 'lucide-react';

interface PortfolioChartProps {
  marketData: MarketData[];
  portfolio: PortfolioState;
  currentStep: number;
}

export function PortfolioChart({ marketData, portfolio, currentStep }: PortfolioChartProps) {
  const chartData = marketData.slice(0, currentStep + 1).map((data, index) => {
    const portfolioValue = index === 0 ? 10000 : 
      portfolio.cash + portfolio.shares * data.price;
    
    return {
      timestamp: new Date(data.timestamp).toLocaleDateString(),
      price: data.price,
      portfolio: portfolioValue,
      date: data.timestamp,
    };
  });

  const chartConfig = {
    price: {
      label: "Market Price",
      color: "hsl(var(--primary))",
    },
    portfolio: {
      label: "Portfolio Value",
      color: "hsl(var(--success))",
    },
  };

  const latestValue = chartData[chartData.length - 1];
  const priceChange = latestValue ? 
    ((latestValue.price - chartData[0]?.price) / chartData[0]?.price * 100) : 0;
  const portfolioChange = latestValue ? 
    ((latestValue.portfolio - 10000) / 10000 * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Market Price Chart */}
      <Card className="fintech-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Market Price</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${latestValue?.price?.toFixed(2) || '0.00'}</div>
          <p className={`text-xs ${priceChange >= 0 ? 'text-success' : 'text-destructive'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}% from start
          </p>
          <ChartContainer config={chartConfig} className="mt-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="timestamp" 
                  tick={false}
                  axisLine={false}
                />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="var(--color-price)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Portfolio Value Chart */}
      <Card className="fintech-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Portfolio Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${latestValue?.portfolio?.toFixed(2) || '10,000.00'}</div>
          <p className={`text-xs ${portfolioChange >= 0 ? 'text-success' : 'text-destructive'}`}>
            {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toFixed(2)}% return
          </p>
          <ChartContainer config={chartConfig} className="mt-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="timestamp" 
                  tick={false}
                  axisLine={false}
                />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="portfolio"
                  stroke="var(--color-portfolio)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}