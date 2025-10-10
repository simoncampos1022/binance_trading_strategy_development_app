const math = require('mathjs');

// Simple Moving Average
const calculateSMA = (data, period) => {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / period);
    }
  }
  return result;
};

// Exponential Moving Average
const calculateEMA = (data, period) => {
  const result = [];
  const multiplier = 2 / (period + 1);
  
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      result.push(data[i]);
    } else {
      result.push((data[i] * multiplier) + (result[i - 1] * (1 - multiplier)));
    }
  }
  return result;
};

// Relative Strength Index
const calculateRSI = (data, period = 14) => {
  const result = [];
  const gains = [];
  const losses = [];

  for (let i = 1; i < data.length; i++) {
    const change = data[i] - data[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      result.push(null);
    } else {
      const avgGain = gains.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
      
      if (avgLoss === 0) {
        result.push(100);
      } else {
        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        result.push(rsi);
      }
    }
  }
  return result;
};

// MACD
const calculateMACD = (data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);
  
  const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
  const signalLine = calculateEMA(macdLine.filter(val => val !== null), signalPeriod);
  
  // Pad signal line to match macd line length
  const paddedSignalLine = new Array(macdLine.length - signalLine.length).fill(null).concat(signalLine);
  
  const histogram = macdLine.map((macd, i) => macd - paddedSignalLine[i]);
  
  return {
    macd: macdLine,
    signal: paddedSignalLine,
    histogram: histogram
  };
};

// Bollinger Bands
const calculateBollingerBands = (data, period = 20, stdDev = 2) => {
  const sma = calculateSMA(data, period);
  const result = {
    upper: [],
    middle: sma,
    lower: []
  };

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.upper.push(null);
      result.lower.push(null);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const mean = sma[i];
      const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
      const standardDeviation = Math.sqrt(variance);
      
      result.upper.push(mean + (stdDev * standardDeviation));
      result.lower.push(mean - (stdDev * standardDeviation));
    }
  }

  return result;
};

// Stochastic Oscillator
const calculateStochastic = (high, low, close, kPeriod = 14, dPeriod = 3) => {
  const result = {
    k: [],
    d: []
  };

  for (let i = 0; i < close.length; i++) {
    if (i < kPeriod - 1) {
      result.k.push(null);
    } else {
      const highSlice = high.slice(i - kPeriod + 1, i + 1);
      const lowSlice = low.slice(i - kPeriod + 1, i + 1);
      const highestHigh = Math.max(...highSlice);
      const lowestLow = Math.min(...lowSlice);
      
      const k = ((close[i] - lowestLow) / (highestHigh - lowestLow)) * 100;
      result.k.push(k);
    }
  }

  // Calculate %D (SMA of %K)
  result.d = calculateSMA(result.k.filter(val => val !== null), dPeriod);
  
  // Pad %D to match %K length
  const paddedD = new Array(result.k.length - result.d.length).fill(null).concat(result.d);
  result.d = paddedD;

  return result;
};

// Williams %R
const calculateWilliamsR = (high, low, close, period = 14) => {
  const result = [];

  for (let i = 0; i < close.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      const highSlice = high.slice(i - period + 1, i + 1);
      const lowSlice = low.slice(i - period + 1, i + 1);
      const highestHigh = Math.max(...highSlice);
      const lowestLow = Math.min(...lowSlice);
      
      const wr = ((highestHigh - close[i]) / (highestHigh - lowestLow)) * -100;
      result.push(wr);
    }
  }

  return result;
};

const calculateIndicators = async (data, indicators) => {
  const result = data.map(candle => ({ ...candle }));

  for (const indicator of indicators) {
    const { name, parameters, timeframe } = indicator;
    
    // Extract price data based on timeframe
    const priceData = result.map(candle => candle.close);
    const highData = result.map(candle => candle.high);
    const lowData = result.map(candle => candle.low);

    let indicatorValues = [];

    switch (name.toLowerCase()) {
      case 'sma':
        indicatorValues = calculateSMA(priceData, parameters.period || 20);
        break;
      
      case 'ema':
        indicatorValues = calculateEMA(priceData, parameters.period || 20);
        break;
      
      case 'rsi':
        indicatorValues = calculateRSI(priceData, parameters.period || 14);
        break;
      
      case 'macd':
        const macd = calculateMACD(
          priceData,
          parameters.fastPeriod || 12,
          parameters.slowPeriod || 26,
          parameters.signalPeriod || 9
        );
        result.forEach((candle, i) => {
          candle[`${name}_macd`] = macd.macd[i];
          candle[`${name}_signal`] = macd.signal[i];
          candle[`${name}_histogram`] = macd.histogram[i];
        });
        continue;
      
      case 'bollinger':
        const bb = calculateBollingerBands(
          priceData,
          parameters.period || 20,
          parameters.stdDev || 2
        );
        result.forEach((candle, i) => {
          candle[`${name}_upper`] = bb.upper[i];
          candle[`${name}_middle`] = bb.middle[i];
          candle[`${name}_lower`] = bb.lower[i];
        });
        continue;
      
      case 'stochastic':
        const stoch = calculateStochastic(
          highData,
          lowData,
          priceData,
          parameters.kPeriod || 14,
          parameters.dPeriod || 3
        );
        result.forEach((candle, i) => {
          candle[`${name}_k`] = stoch.k[i];
          candle[`${name}_d`] = stoch.d[i];
        });
        continue;
      
      case 'williams_r':
        indicatorValues = calculateWilliamsR(
          highData,
          lowData,
          priceData,
          parameters.period || 14
        );
        break;
      
      default:
        console.warn(`Unknown indicator: ${name}`);
        continue;
    }

    // Add indicator values to data
    result.forEach((candle, i) => {
      candle[name] = indicatorValues[i];
    });
  }

  return result;
};

module.exports = {
  calculateIndicators,
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateStochastic,
  calculateWilliamsR
};
