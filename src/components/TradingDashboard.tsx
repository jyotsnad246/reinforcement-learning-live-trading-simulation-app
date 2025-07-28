import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Play, Pause, RotateCcw, TrendingUp, TrendingDown, Minus, Brain, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTradingSimulation } from '@/hooks/useTradingSimulation';
import { PortfolioChart } from './PortfolioChart';
import { TradePointsChart } from './TradePointsChart';
import { RewardsChart } from './RewardsChart';
import { AgentThoughts } from './AgentThoughts';
import { SummaryCards } from './SummaryCards';

export function TradingDashboard() {
  const [viewMode, setViewMode] = useState<'beginner' | 'expert'>('beginner');
  const {
    isRunning,
    currentStep,
    selectedDataset,
    marketData,
    agentParams,
    portfolio,
    rewards,
    episodeCount,
    currentPrice,
    progress,
    availableDatasets,
    agentPersonalities,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    changeDataset,
    updateAgentParams,
  } = useTradingSimulation();

  const currentPersonality = agentPersonalities[agentParams.agentPersona];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/10 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-primary bg-clip-text text-transparent">
            AI Trading Simulator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch an AI agent learn to trade using reinforcement learning. Experiment with different strategies and see how it performs!
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="view-mode"
                checked={viewMode === 'expert'}
                onCheckedChange={(checked) => setViewMode(checked ? 'expert' : 'beginner')}
              />
              <Label htmlFor="view-mode" className="text-sm font-medium">
                {viewMode === 'beginner' ? 'Beginner' : 'Expert'} View
              </Label>
            </div>
          </div>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Control Panel
              </CardTitle>
              <CardDescription>
                Configure your AI agent and start the simulation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Controls */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={isRunning ? pauseSimulation : startSimulation}
                    size="lg"
                    className={isRunning ? "bg-warning hover:bg-warning/90" : "gradient-primary"}
                  >
                    {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isRunning ? 'Pause' : 'Start'}
                  </Button>
                  
                  <Button onClick={resetSimulation} variant="outline" size="lg">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Dataset</Label>
                    <Select value={selectedDataset} onValueChange={changeDataset}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDatasets.map((dataset) => (
                          <SelectItem key={dataset} value={dataset}>
                            {dataset}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Agent Persona</Label>
                    <Select value={agentParams.agentPersona} onValueChange={(value: any) => updateAgentParams({ agentPersona: value })}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(agentPersonalities).map(([key, personality]) => (
                          <SelectItem key={key} value={key}>
                            {personality.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <Badge variant="secondary">
                    Episode {episodeCount}
                  </Badge>
                  <Badge variant="outline">
                    Step {currentStep}
                  </Badge>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Agent Parameters */}
              {viewMode === 'expert' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t"
                >
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Learning Rate: {agentParams.learningRate}
                    </Label>
                    <Slider
                      value={[agentParams.learningRate]}
                      onValueChange={([value]) => updateAgentParams({ learningRate: value })}
                      min={0.0001}
                      max={0.01}
                      step={0.0001}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Exploration Rate: {agentParams.explorationRate}
                    </Label>
                    <Slider
                      value={[agentParams.explorationRate]}
                      onValueChange={([value]) => updateAgentParams({ explorationRate: value })}
                      min={0}
                      max={0.5}
                      step={0.01}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Reward Strategy</Label>
                    <Select value={agentParams.rewardStrategy} onValueChange={(value: any) => updateAgentParams({ rewardStrategy: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="profit">Profit</SelectItem>
                        <SelectItem value="sharpe">Sharpe Ratio</SelectItem>
                        <SelectItem value="risk-adjusted">Risk Adjusted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary Cards */}
        <SummaryCards 
          portfolio={portfolio} 
          currentPrice={currentPrice}
          personality={currentPersonality}
          episodeCount={episodeCount}
        />

        {/* Agent Thoughts */}
        <AgentThoughts thoughts={portfolio.thoughts} personality={currentPersonality} />

        {/* Charts */}
        <Tabs defaultValue="portfolio" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="trades">Trade Points</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-4">
            <PortfolioChart marketData={marketData} portfolio={portfolio} currentStep={currentStep} />
          </TabsContent>

          <TabsContent value="trades" className="space-y-4">
            <TradePointsChart marketData={marketData} trades={portfolio.trades} />
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <RewardsChart rewards={rewards} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}