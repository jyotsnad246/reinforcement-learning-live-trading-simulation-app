import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Award, TrendingUp } from 'lucide-react';

interface RewardsChartProps {
  rewards: number[];
}

export function RewardsChart({ rewards }: RewardsChartProps) {
  const chartData = rewards.map((reward, index) => ({
    step: index + 1,
    reward: reward,
    cumulativeReward: rewards.slice(0, index + 1).reduce((sum, r) => sum + r, 0),
  }));

  const chartConfig = {
    reward: {
      label: "Step Reward",
      color: "hsl(var(--primary))",
    },
    cumulativeReward: {
      label: "Cumulative Reward",
      color: "hsl(var(--success))",
    },
  };

  const totalReward = rewards.reduce((sum, r) => sum + r, 0);
  const avgReward = rewards.length > 0 ? totalReward / rewards.length : 0;
  const positiveRewards = rewards.filter(r => r > 0).length;
  const rewardRate = rewards.length > 0 ? (positiveRewards / rewards.length) * 100 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Rewards Bar Chart */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Step Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-2xl font-bold">{totalReward.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total Reward</p>
            </div>
            <div>
              <div className="text-2xl font-bold">{avgReward.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Avg per Step</p>
            </div>
          </div>
          
          <ChartContainer config={chartConfig} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.slice(-20)}>
                <XAxis 
                  dataKey="step" 
                  tick={false}
                  axisLine={false}
                />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="2 2" />
                <Bar
                  dataKey="reward"
                  fill="var(--color-reward)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Cumulative Rewards */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-2xl font-bold">{rewardRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
            <div>
              <div className="text-2xl font-bold">{positiveRewards}</div>
              <p className="text-xs text-muted-foreground">Positive Steps</p>
            </div>
          </div>

          <ChartContainer config={chartConfig} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.slice(-20)}>
                <XAxis 
                  dataKey="step" 
                  tick={false}
                  axisLine={false}
                />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="cumulativeReward"
                  fill="var(--color-cumulativeReward)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}