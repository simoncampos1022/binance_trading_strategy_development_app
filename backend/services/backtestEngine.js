const Backtest = require('../models/Backtest');
const { getHistoricalData } = require('./dataService');
const { calculateIndicators } = require('./indicatorService');
const { executeStrategy } = require('./strategyEngine');

const runBacktest = async (backtestId, strategy, config) => {
  const startTime = Date.now();
  
  try {
    console.log(`Starting backtest ${backtestId} for strategy ${strategy.name}`);
    
    // Get historical data
    const historicalData = await getHistoricalData(
      config.symbol,
      config.timeframe,
      config.startDate,
      config.endDate
    );

    if (!historicalData || historicalData.length === 0) {
      throw new Error('No historical data available for the specified period');
    }

    // Calculate indicators
    const dataWithIndicators = await calculateIndicators(historicalData, strategy.indicators);

    // Execute strategy
    const results = await executeStrategy(
      strategy,
      dataWithIndicators,
      config.initialCapital
    );

    // Calculate performance metrics
    const performanceMetrics = calculatePerformanceMetrics(results);

    // Update backtest with results
    await Backtest.findByIdAndUpdate(backtestId, {
      status: 'completed',
      results: performanceMetrics,
      trades: results.trades,
      equityCurve: results.equityCurve,
      monthlyReturns: results.monthlyReturns,
      executionTime: Date.now() - startTime
    });

    console.log(`Backtest ${backtestId} completed successfully`);
    
  } catch (error) {
    console.error(`Backtest ${backtestId} failed:`, error);
    await Backtest.findByIdAndUpdate(backtestId, {
      status: 'failed',
      error: error.message,
      executionTime: Date.now() - startTime
    });
  }
};

const calculatePerformanceMetrics = (results) => {
  const { trades, equityCurve, initialCapital } = results;
  
  if (!trades || trades.length === 0) {
    return {
      totalReturn: 0,
      totalReturnPercent: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      maxDrawdownPercent: 0,
      winRate: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      avgWin: 0,
      avgLoss: 0,
      profitFactor: 0,
      avgTradeReturn: 0,
      bestTrade: 0,
      worstTrade: 0,
      finalCapital: initialCapital
    };
  }

  const finalCapital = equityCurve[equityCurve.length - 1]?.equity || initialCapital;
  const totalReturn = finalCapital - initialCapital;
  const totalReturnPercent = (totalReturn / initialCapital) * 100;

  // Calculate drawdown
  let maxDrawdown = 0;
  let peak = initialCapital;
  
  equityCurve.forEach(point => {
    if (point.equity > peak) {
      peak = point.equity;
    }
    const drawdown = (peak - point.equity) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  // Calculate trade statistics
  const winningTrades = trades.filter(trade => trade.pnl > 0);
  const losingTrades = trades.filter(trade => trade.pnl < 0);
  const totalTrades = trades.length;
  const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;

  const avgWin = winningTrades.length > 0 
    ? winningTrades.reduce((sum, trade) => sum + trade.pnl, 0) / winningTrades.length 
    : 0;
  
  const avgLoss = losingTrades.length > 0 
    ? losingTrades.reduce((sum, trade) => sum + trade.pnl, 0) / losingTrades.length 
    : 0;

  const profitFactor = Math.abs(avgLoss) > 0 ? Math.abs(avgWin / avgLoss) : 0;
  const avgTradeReturn = totalTrades > 0 ? totalReturn / totalTrades : 0;

  const bestTrade = trades.length > 0 ? Math.max(...trades.map(t => t.pnl)) : 0;
  const worstTrade = trades.length > 0 ? Math.min(...trades.map(t => t.pnl)) : 0;

  // Calculate Sharpe ratio (simplified)
  const returns = equityCurve.slice(1).map((point, i) => 
    (point.equity - equityCurve[i].equity) / equityCurve[i].equity
  );
  const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const returnStdDev = Math.sqrt(
    returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length
  );
  const sharpeRatio = returnStdDev > 0 ? avgReturn / returnStdDev : 0;

  return {
    totalReturn,
    totalReturnPercent,
    sharpeRatio,
    maxDrawdown,
    maxDrawdownPercent: maxDrawdown * 100,
    winRate,
    totalTrades,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    avgWin,
    avgLoss,
    profitFactor,
    avgTradeReturn,
    bestTrade,
    worstTrade,
    finalCapital
  };
};

module.exports = {
  runBacktest,
  calculatePerformanceMetrics
};
