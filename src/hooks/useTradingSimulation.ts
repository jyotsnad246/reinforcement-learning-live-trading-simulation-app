import { useState, useEffect, useCallback } from 'react';

export interface MarketData {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface TradeAction {
  timestamp: number;
  action: 'buy' | 'sell' | 'hold';
  price: number;
  confidence: number;
  reason: string;
}

export interface AgentParams {
  learningRate: number;
  explorationRate: number;
  rewardStrategy: 'profit' | 'sharpe' | 'risk-adjusted';
  agentPersona: 'risky-rita' | 'cautious-carl' | 'balanced-bob';
}

export interface PortfolioState {
  cash: number;
  shares: number;
  totalValue: number;
  returns: number;
  trades: TradeAction[];
  thoughts: string[];
}

const SAMPLE_DATASETS = {
  'BTC-USD': generateSampleData('crypto'),
  'S&P500': generateSampleData('stock'),
  'EUR-USD': generateSampleData('forex'),
};

function generateSampleData(type: 'crypto' | 'stock' | 'forex'): MarketData[] {
  const data: MarketData[] = [];
  const startPrice = type === 'crypto' ? 45000 : type === 'stock' ? 4200 : 1.1;
  const volatility = type === 'crypto' ? 0.05 : type === 'stock' ? 0.02 : 0.003;
  
  let price = startPrice;
  const now = Date.now();
  
  for (let i = 0; i < 100; i++) {
    const change = (Math.random() - 0.5) * volatility * 2;
    price *= (1 + change);
    
    data.push({
      timestamp: now - (100 - i) * 24 * 60 * 60 * 1000, // Daily data
      price: Math.round(price * 100) / 100,
      volume: Math.floor(Math.random() * 1000000),
    });
  }
  
  return data;
}

const AGENT_PERSONALITIES = {
  'risky-rita': {
    name: 'Risky Rita',
    description: 'High-risk, high-reward trading style',
    explorationBonus: 0.3,
    thoughts: [
      "Fortune favors the bold! 🚀",
      "Time to swing for the fences!",
      "Big risks, bigger rewards!",
      "YOLO trade incoming!",
      "Going all-in on this signal!"
    ]
  },
  'cautious-carl': {
    name: 'Cautious Carl',
    description: 'Conservative, risk-averse approach',
    explorationBonus: -0.2,
    thoughts: [
      "Better safe than sorry...",
      "This looks too risky for me",
      "Preserving capital is key",
      "Small steady gains win the race",
      "Risk management first!"
    ]
  },
  'balanced-bob': {
    name: 'Balanced Bob',
    description: 'Moderate risk with balanced strategy',
    explorationBonus: 0,
    thoughts: [
      "Finding the perfect balance",
      "Moderate risk, steady progress",
      "Diversification is wisdom",
      "Calculated moves only",
      "Following the trend wisely"
    ]
  }
};

export function useTradingSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDataset, setSelectedDataset] = useState<keyof typeof SAMPLE_DATASETS>('BTC-USD');
  const [marketData, setMarketData] = useState<MarketData[]>(SAMPLE_DATASETS['BTC-USD']);
  const [agentParams, setAgentParams] = useState<AgentParams>({
    learningRate: 0.001,
    explorationRate: 0.1,
    rewardStrategy: 'profit',
    agentPersona: 'balanced-bob'
  });
  
  const [portfolio, setPortfolio] = useState<PortfolioState>({
    cash: 10000,
    shares: 0,
    totalValue: 10000,
    returns: 0,
    trades: [],
    thoughts: []
  });

  const [rewards, setRewards] = useState<number[]>([]);
  const [episodeCount, setEpisodeCount] = useState(0);

  const resetSimulation = useCallback(() => {
    setCurrentStep(0);
    setPortfolio({
      cash: 10000,
      shares: 0,
      totalValue: 10000,
      returns: 0,
      trades: [],
      thoughts: []
    });
    setRewards([]);
    setEpisodeCount(0);
  }, []);

  const changeDataset = useCallback((dataset: keyof typeof SAMPLE_DATASETS) => {
    setSelectedDataset(dataset);
    setMarketData(SAMPLE_DATASETS[dataset]);
    resetSimulation();
  }, [resetSimulation]);

  const updateAgentParams = useCallback((newParams: Partial<AgentParams>) => {
    setAgentParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const makeDecision = useCallback((currentPrice: number, previousPrices: number[]): TradeAction => {
    const personality = AGENT_PERSONALITIES[agentParams.agentPersona];
    
    // Simple momentum strategy with personality adjustments
    const shortMA = previousPrices.slice(-5).reduce((a, b) => a + b, 0) / 5;
    const longMA = previousPrices.slice(-20).reduce((a, b) => a + b, 0) / 20;
    
    let signal = (shortMA - longMA) / longMA;
    signal += personality.explorationBonus * agentParams.explorationRate;
    
    // Add exploration noise
    if (Math.random() < agentParams.explorationRate) {
      signal += (Math.random() - 0.5) * 0.2;
    }

    let action: 'buy' | 'sell' | 'hold';
    let confidence: number;
    let reason: string;

    if (signal > 0.02) {
      action = 'buy';
      confidence = Math.min(Math.abs(signal) * 5, 1);
      reason = personality.thoughts[Math.floor(Math.random() * personality.thoughts.length)];
    } else if (signal < -0.02) {
      action = 'sell';
      confidence = Math.min(Math.abs(signal) * 5, 1);
      reason = "Time to take profits and exit";
    } else {
      action = 'hold';
      confidence = 0.3;
      reason = "Market looks uncertain, staying put";
    }

    return {
      timestamp: Date.now(),
      action,
      price: currentPrice,
      confidence,
      reason
    };
  }, [agentParams]);

  const step = useCallback(() => {
    if (currentStep >= marketData.length - 1) {
      setIsRunning(false);
      setEpisodeCount(prev => prev + 1);
      return;
    }

    const currentPrice = marketData[currentStep].price;
    const previousPrices = marketData.slice(Math.max(0, currentStep - 20), currentStep).map(d => d.price);
    
    if (previousPrices.length > 0) {
      const decision = makeDecision(currentPrice, previousPrices);
      
      setPortfolio(prev => {
        const newPortfolio = { ...prev };
        let reward = 0;

        // Execute trade
        if (decision.action === 'buy' && newPortfolio.cash > currentPrice) {
          const sharesBought = Math.floor(newPortfolio.cash / currentPrice);
          newPortfolio.cash -= sharesBought * currentPrice;
          newPortfolio.shares += sharesBought;
        } else if (decision.action === 'sell' && newPortfolio.shares > 0) {
          newPortfolio.cash += newPortfolio.shares * currentPrice;
          newPortfolio.shares = 0;
        }

        // Calculate reward based on strategy
        const newTotalValue = newPortfolio.cash + newPortfolio.shares * currentPrice;
        const returns = (newTotalValue - 10000) / 10000;
        
        switch (agentParams.rewardStrategy) {
          case 'profit':
            reward = newTotalValue - prev.totalValue;
            break;
          case 'sharpe':
            reward = returns * 100; // Simplified Sharpe ratio
            break;
          case 'risk-adjusted':
            reward = (newTotalValue - prev.totalValue) * (1 - Math.abs(returns) * 0.1);
            break;
        }

        newPortfolio.totalValue = newTotalValue;
        newPortfolio.returns = returns;
        newPortfolio.trades = [...prev.trades, decision];
        newPortfolio.thoughts = [...prev.thoughts.slice(-4), decision.reason];

        setRewards(prev => [...prev, reward]);
        
        return newPortfolio;
      });
    }

    setCurrentStep(prev => prev + 1);
  }, [currentStep, marketData, makeDecision, agentParams.rewardStrategy]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(step, 200); // 200ms per step
      return () => clearInterval(interval);
    }
  }, [isRunning, step]);

  const startSimulation = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseSimulation = useCallback(() => {
    setIsRunning(false);
  }, []);

  return {
    // State
    isRunning,
    currentStep,
    selectedDataset,
    marketData,
    agentParams,
    portfolio,
    rewards,
    episodeCount,
    
    // Actions
    startSimulation,
    pauseSimulation,
    resetSimulation,
    changeDataset,
    updateAgentParams,
    
    // Computed
    currentPrice: marketData[currentStep]?.price || 0,
    progress: (currentStep / (marketData.length - 1)) * 100,
    availableDatasets: Object.keys(SAMPLE_DATASETS) as (keyof typeof SAMPLE_DATASETS)[],
    agentPersonalities: AGENT_PERSONALITIES,
  };
}