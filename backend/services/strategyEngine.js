const executeStrategy = async (strategy, data, initialCapital) => {
  const trades = [];
  const equityCurve = [];
  let currentCapital = initialCapital;
  let position = null;
  let equity = initialCapital;

  // Initialize equity curve
  equityCurve.push({
    timestamp: data[0].timestamp,
    equity: initialCapital,
    drawdown: 0
  });

  for (let i = 1; i < data.length; i++) {
    const currentCandle = data[i];
    const previousCandle = data[i - 1];

    // Update equity based on current position
    if (position) {
      const unrealizedPnL = (currentCandle.close - position.entryPrice) * position.quantity;
      equity = currentCapital + unrealizedPnL;
    } else {
      equity = currentCapital;
    }

    // Add to equity curve
    equityCurve.push({
      timestamp: currentCandle.timestamp,
      equity: equity,
      drawdown: 0 // Will be calculated later
    });

    // Check for buy signals
    if (!position && shouldBuy(strategy.buyConditions, currentCandle, previousCandle)) {
      const quantity = calculatePositionSize(currentCapital, currentCandle.close, strategy.riskManagement.maxPositionSize);
      
      if (quantity > 0) {
        position = {
          entryPrice: currentCandle.close,
          quantity: quantity,
          entryTime: currentCandle.timestamp,
          stopLoss: currentCandle.close * (1 - strategy.riskManagement.stopLoss),
          takeProfit: currentCandle.close * (1 + strategy.riskManagement.takeProfit)
        };

        trades.push({
          timestamp: currentCandle.timestamp,
          symbol: 'BTCUSDT', // This should come from the data
          side: 'buy',
          price: currentCandle.close,
          quantity: quantity,
          pnl: 0,
          reason: 'Buy signal triggered'
        });
      }
    }

    // Check for sell signals or stop loss/take profit
    if (position) {
      let shouldSell = false;
      let sellReason = '';

      // Check stop loss
      if (currentCandle.close <= position.stopLoss) {
        shouldSell = true;
        sellReason = 'Stop loss triggered';
      }
      // Check take profit
      else if (currentCandle.close >= position.takeProfit) {
        shouldSell = true;
        sellReason = 'Take profit triggered';
      }
      // Check sell conditions
      else if (shouldSell(strategy.sellConditions, currentCandle, previousCandle)) {
        shouldSell = true;
        sellReason = 'Sell signal triggered';
      }

      if (shouldSell) {
        const pnl = (currentCandle.close - position.entryPrice) * position.quantity;
        currentCapital += pnl;

        trades.push({
          timestamp: currentCandle.timestamp,
          symbol: 'BTCUSDT',
          side: 'sell',
          price: currentCandle.close,
          quantity: position.quantity,
          pnl: pnl,
          reason: sellReason
        });

        position = null;
      }
    }
  }

  // Close any remaining position at the end
  if (position) {
    const lastCandle = data[data.length - 1];
    const pnl = (lastCandle.close - position.entryPrice) * position.quantity;
    currentCapital += pnl;

    trades.push({
      timestamp: lastCandle.timestamp,
      symbol: 'BTCUSDT',
      side: 'sell',
      price: lastCandle.close,
      quantity: position.quantity,
      pnl: pnl,
      reason: 'End of backtest'
    });
  }

  // Calculate monthly returns
  const monthlyReturns = calculateMonthlyReturns(equityCurve);

  return {
    trades,
    equityCurve,
    monthlyReturns,
    initialCapital,
    finalCapital: currentCapital
  };
};

const shouldBuy = (buyConditions, currentCandle, previousCandle) => {
  if (!buyConditions || buyConditions.length === 0) return false;

  for (const condition of buyConditions) {
    if (evaluateCondition(condition, currentCandle, previousCandle)) {
      return true;
    }
  }

  return false;
};

const shouldSell = (sellConditions, currentCandle, previousCandle) => {
  if (!sellConditions || sellConditions.length === 0) return false;

  for (const condition of sellConditions) {
    if (evaluateCondition(condition, currentCandle, previousCandle)) {
      return true;
    }
  }

  return false;
};

const evaluateCondition = (condition, currentCandle, previousCandle) => {
  if (!condition.conditions || condition.conditions.length === 0) return false;

  const results = condition.conditions.map(cond => {
    const currentValue = getIndicatorValue(currentCandle, cond.indicator);
    const previousValue = getIndicatorValue(previousCandle, cond.indicator);
    const targetValue = cond.value;

    if (currentValue === null || previousValue === null) return false;

    switch (cond.operator) {
      case '>':
        return currentValue > targetValue;
      case '<':
        return currentValue < targetValue;
      case '>=':
        return currentValue >= targetValue;
      case '<=':
        return currentValue <= targetValue;
      case '==':
        return currentValue === targetValue;
      case '!=':
        return currentValue !== targetValue;
      case 'crosses_above':
        return previousValue <= targetValue && currentValue > targetValue;
      case 'crosses_below':
        return previousValue >= targetValue && currentValue < targetValue;
      default:
        return false;
    }
  });

  // Apply logic (AND/OR)
  if (condition.logic === 'OR') {
    return results.some(result => result);
  } else {
    return results.every(result => result);
  }
};

const getIndicatorValue = (candle, indicatorName) => {
  // Handle different indicator formats
  if (indicatorName.includes('_')) {
    const parts = indicatorName.split('_');
    const baseName = parts[0];
    const suffix = parts[1];
    return candle[`${baseName}_${suffix}`];
  }
  
  return candle[indicatorName];
};

const calculatePositionSize = (capital, price, maxPositionSize) => {
  const maxInvestment = capital * maxPositionSize;
  return Math.floor(maxInvestment / price);
};

const calculateMonthlyReturns = (equityCurve) => {
  const monthlyReturns = [];
  const monthlyData = {};

  // Group by month
  equityCurve.forEach(point => {
    const month = point.timestamp.toISOString().substring(0, 7); // YYYY-MM
    if (!monthlyData[month]) {
      monthlyData[month] = [];
    }
    monthlyData[month].push(point);
  });

  // Calculate returns for each month
  Object.keys(monthlyData).sort().forEach(month => {
    const monthData = monthlyData[month];
    const startEquity = monthData[0].equity;
    const endEquity = monthData[monthData.length - 1].equity;
    const returnPercent = ((endEquity - startEquity) / startEquity) * 100;

    monthlyReturns.push({
      month: month,
      return: returnPercent
    });
  });

  return monthlyReturns;
};

module.exports = {
  executeStrategy
};
