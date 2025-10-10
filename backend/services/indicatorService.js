const math = require('mathjs');

// ============================================================================
// TREND INDICATORS
// ============================================================================

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

// Weighted Moving Average
const calculateWMA = (data, period) => {
  const result = [];
  const weights = Array.from({ length: period }, (_, i) => i + 1);
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const weightedSum = slice.reduce((sum, value, index) => sum + (value * weights[index]), 0);
      result.push(weightedSum / weightSum);
    }
  }
  return result;
};

// Hull Moving Average
const calculateHMA = (data, period) => {
  const halfPeriod = Math.floor(period / 2);
  const sqrtPeriod = Math.floor(Math.sqrt(period));
  
  const wma1 = calculateWMA(data, halfPeriod);
  const wma2 = calculateWMA(data, period);
  
  const wmaDiff = wma1.map((val, i) => val !== null && wma2[i] !== null ? 2 * val - wma2[i] : null);
  return calculateWMA(wmaDiff, sqrtPeriod);
};

// Triple Exponential Moving Average
const calculateTEMA = (data, period) => {
  const ema1 = calculateEMA(data, period);
  const ema2 = calculateEMA(ema1.filter(val => val !== null), period);
  const ema3 = calculateEMA(ema2.filter(val => val !== null), period);
  
  // Pad arrays to match original length
  const paddedEma2 = new Array(data.length - ema2.length).fill(null).concat(ema2);
  const paddedEma3 = new Array(data.length - ema3.length).fill(null).concat(ema3);
  
  return ema1.map((val, i) => {
    if (val !== null && paddedEma2[i] !== null && paddedEma3[i] !== null) {
      return 3 * val - 3 * paddedEma2[i] + paddedEma3[i];
    }
    return null;
  });
};

// Kaufman's Adaptive Moving Average
const calculateKAMA = (data, period = 14, fastSC = 2, slowSC = 30) => {
  const result = [data[0]];
  const efficiencyRatio = [];
  
  for (let i = 1; i < data.length; i++) {
    const change = Math.abs(data[i] - data[i - 1]);
    const volatility = i < period ? 
      data.slice(0, i + 1).reduce((sum, val, idx) => idx > 0 ? sum + Math.abs(val - data[idx - 1]) : 0, 0) :
      data.slice(i - period + 1, i + 1).reduce((sum, val, idx) => idx > 0 ? sum + Math.abs(val - data[idx - 1]) : 0, 0);
    
    const netChange = i < period ? 
      Math.abs(data[i] - data[0]) :
      Math.abs(data[i] - data[i - period]);
    
    const er = volatility === 0 ? 0 : netChange / volatility;
    efficiencyRatio.push(er);
    
    const sc = Math.pow(er * (2 / (fastSC + 1) - 2 / (slowSC + 1)) + 2 / (slowSC + 1), 2);
    const kama = result[i - 1] + sc * (data[i] - result[i - 1]);
    result.push(kama);
  }
  
  return result;
};

// MACD
const calculateMACD = (data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);
  
  const macdLine = fastEMA.map((fast, i) => fast !== null && slowEMA[i] !== null ? fast - slowEMA[i] : null);
  const signalLine = calculateEMA(macdLine.filter(val => val !== null), signalPeriod);
  
  // Pad signal line to match macd line length
  const paddedSignalLine = new Array(macdLine.length - signalLine.length).fill(null).concat(signalLine);
  
  const histogram = macdLine.map((macd, i) => macd !== null && paddedSignalLine[i] !== null ? macd - paddedSignalLine[i] : null);
  
  return {
    macd: macdLine,
    signal: paddedSignalLine,
    histogram: histogram
  };
};

// ============================================================================
// MOMENTUM INDICATORS
// ============================================================================

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

// Commodity Channel Index
const calculateCCI = (high, low, close, period = 20) => {
  const result = [];
  const typicalPrice = close.map((c, i) => (high[i] + low[i] + c) / 3);

  for (let i = 0; i < close.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      const slice = typicalPrice.slice(i - period + 1, i + 1);
      const sma = slice.reduce((sum, val) => sum + val, 0) / period;
      const meanDeviation = slice.reduce((sum, val) => sum + Math.abs(val - sma), 0) / period;
      
      const cci = meanDeviation === 0 ? 0 : (typicalPrice[i] - sma) / (0.015 * meanDeviation);
      result.push(cci);
    }
  }

  return result;
};

// Rate of Change
const calculateROC = (data, period = 10) => {
  const result = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      result.push(null);
    } else {
      const roc = ((data[i] - data[i - period]) / data[i - period]) * 100;
      result.push(roc);
    }
  }

  return result;
};

// Money Flow Index
const calculateMFI = (high, low, close, volume, period = 14) => {
  const result = [];
  const moneyFlow = [];

  for (let i = 0; i < close.length; i++) {
    if (i === 0) {
      moneyFlow.push(null);
    } else {
      const typicalPrice = (high[i] + low[i] + close[i]) / 3;
      const prevTypicalPrice = (high[i - 1] + low[i - 1] + close[i - 1]) / 3;
      const rawMoneyFlow = typicalPrice * volume[i];
      
      if (typicalPrice > prevTypicalPrice) {
        moneyFlow.push({ positive: rawMoneyFlow, negative: 0 });
      } else if (typicalPrice < prevTypicalPrice) {
        moneyFlow.push({ positive: 0, negative: rawMoneyFlow });
      } else {
        moneyFlow.push({ positive: 0, negative: 0 });
      }
    }
  }

  for (let i = 0; i < close.length; i++) {
    if (i < period) {
      result.push(null);
    } else {
      const slice = moneyFlow.slice(i - period + 1, i + 1);
      const positiveFlow = slice.reduce((sum, mf) => sum + (mf?.positive || 0), 0);
      const negativeFlow = slice.reduce((sum, mf) => sum + (mf?.negative || 0), 0);
      
      if (negativeFlow === 0) {
        result.push(100);
      } else {
        const mfi = 100 - (100 / (1 + (positiveFlow / negativeFlow)));
        result.push(mfi);
      }
    }
  }

  return result;
};

// ============================================================================
// VOLATILITY INDICATORS
// ============================================================================

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

// Average True Range
const calculateATR = (high, low, close, period = 14) => {
  const trueRange = [];
  
  for (let i = 0; i < high.length; i++) {
    if (i === 0) {
      trueRange.push(high[i] - low[i]);
    } else {
      const tr1 = high[i] - low[i];
      const tr2 = Math.abs(high[i] - close[i - 1]);
      const tr3 = Math.abs(low[i] - close[i - 1]);
      trueRange.push(Math.max(tr1, tr2, tr3));
    }
  }
  
  return calculateSMA(trueRange, period);
};

// Keltner Channels
const calculateKeltnerChannels = (high, low, close, period = 20, multiplier = 2) => {
  const typicalPrice = close.map((c, i) => (high[i] + low[i] + c) / 3);
  const middle = calculateEMA(typicalPrice, period);
  const atr = calculateATR(high, low, close, period);
  
  return {
    upper: middle.map((mid, i) => mid !== null && atr[i] !== null ? mid + (multiplier * atr[i]) : null),
    middle: middle,
    lower: middle.map((mid, i) => mid !== null && atr[i] !== null ? mid - (multiplier * atr[i]) : null)
  };
};

// Donchian Channels
const calculateDonchianChannels = (high, low, period = 20) => {
  const result = {
    upper: [],
    middle: [],
    lower: []
  };

  for (let i = 0; i < high.length; i++) {
    if (i < period - 1) {
      result.upper.push(null);
      result.middle.push(null);
      result.lower.push(null);
    } else {
      const highSlice = high.slice(i - period + 1, i + 1);
      const lowSlice = low.slice(i - period + 1, i + 1);
      const highestHigh = Math.max(...highSlice);
      const lowestLow = Math.min(...lowSlice);
      
      result.upper.push(highestHigh);
      result.lower.push(lowestLow);
      result.middle.push((highestHigh + lowestLow) / 2);
    }
  }

  return result;
};

// ============================================================================
// VOLUME INDICATORS
// ============================================================================

// On-Balance Volume
const calculateOBV = (close, volume) => {
  const result = [volume[0]];

  for (let i = 1; i < close.length; i++) {
    if (close[i] > close[i - 1]) {
      result.push(result[i - 1] + volume[i]);
    } else if (close[i] < close[i - 1]) {
      result.push(result[i - 1] - volume[i]);
    } else {
      result.push(result[i - 1]);
    }
  }

  return result;
};

// Volume Weighted Average Price
const calculateVWAP = (high, low, close, volume) => {
  const result = [];
  let cumulativeVolume = 0;
  let cumulativeVolumePrice = 0;

  for (let i = 0; i < close.length; i++) {
    const typicalPrice = (high[i] + low[i] + close[i]) / 3;
    cumulativeVolume += volume[i];
    cumulativeVolumePrice += typicalPrice * volume[i];
    
    result.push(cumulativeVolume === 0 ? 0 : cumulativeVolumePrice / cumulativeVolume);
  }

  return result;
};

// Accumulation/Distribution Line
const calculateADL = (high, low, close, volume) => {
  const result = [0];

  for (let i = 1; i < close.length; i++) {
    const clv = ((close[i] - low[i]) - (high[i] - close[i])) / (high[i] - low[i]);
    const adl = result[i - 1] + (clv * volume[i]);
    result.push(isNaN(adl) ? result[i - 1] : adl);
  }

  return result;
};

// Chaikin Money Flow
const calculateCMF = (high, low, close, volume, period = 20) => {
  const result = [];
  const moneyFlowVolume = [];

  for (let i = 0; i < close.length; i++) {
    const clv = ((close[i] - low[i]) - (high[i] - close[i])) / (high[i] - low[i]);
    moneyFlowVolume.push(isNaN(clv) ? 0 : clv * volume[i]);
  }

  for (let i = 0; i < close.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      const mfvSlice = moneyFlowVolume.slice(i - period + 1, i + 1);
      const volumeSlice = volume.slice(i - period + 1, i + 1);
      const sumMFV = mfvSlice.reduce((sum, val) => sum + val, 0);
      const sumVolume = volumeSlice.reduce((sum, val) => sum + val, 0);
      
      result.push(sumVolume === 0 ? 0 : sumMFV / sumVolume);
    }
  }

  return result;
};

// ============================================================================
// OSCILLATORS
// ============================================================================

// Awesome Oscillator
const calculateAO = (high, low, period1 = 5, period2 = 34) => {
  const sma1 = calculateSMA(high.map((h, i) => (h + low[i]) / 2), period1);
  const sma2 = calculateSMA(high.map((h, i) => (h + low[i]) / 2), period2);
  
  return sma1.map((val1, i) => val1 !== null && sma2[i] !== null ? val1 - sma2[i] : null);
};

// Ultimate Oscillator
const calculateUO = (high, low, close, period1 = 7, period2 = 14, period3 = 28) => {
  const result = [];
  const bp = []; // Buying Pressure
  const tr = []; // True Range

  for (let i = 0; i < close.length; i++) {
    if (i === 0) {
      bp.push(close[i] - Math.min(low[i], close[i]));
      tr.push(high[i] - low[i]);
    } else {
      bp.push(close[i] - Math.min(low[i], close[i - 1]));
      tr.push(Math.max(high[i] - low[i], Math.abs(high[i] - close[i - 1]), Math.abs(low[i] - close[i - 1])));
    }
  }

  for (let i = 0; i < close.length; i++) {
    if (i < period3 - 1) {
      result.push(null);
    } else {
      const bp1 = bp.slice(i - period1 + 1, i + 1).reduce((sum, val) => sum + val, 0);
      const tr1 = tr.slice(i - period1 + 1, i + 1).reduce((sum, val) => sum + val, 0);
      const bp2 = bp.slice(i - period2 + 1, i + 1).reduce((sum, val) => sum + val, 0);
      const tr2 = tr.slice(i - period2 + 1, i + 1).reduce((sum, val) => sum + val, 0);
      const bp3 = bp.slice(i - period3 + 1, i + 1).reduce((sum, val) => sum + val, 0);
      const tr3 = tr.slice(i - period3 + 1, i + 1).reduce((sum, val) => sum + val, 0);

      const avg1 = tr1 === 0 ? 0 : (bp1 / tr1) * 100;
      const avg2 = tr2 === 0 ? 0 : (bp2 / tr2) * 100;
      const avg3 = tr3 === 0 ? 0 : (bp3 / tr3) * 100;

      const uo = (4 * avg1 + 2 * avg2 + avg3) / 7;
      result.push(uo);
    }
  }

  return result;
};

// ============================================================================
// CUSTOM AND COMPOSITE INDICATORS
// ============================================================================

// Ichimoku Cloud
const calculateIchimoku = (high, low, close, tenkanPeriod = 9, kijunPeriod = 26, senkouSpanBPeriod = 52) => {
  const tenkanSen = [];
  const kijunSen = [];
  const senkouSpanA = [];
  const senkouSpanB = [];
  const chikouSpan = [];

  // Tenkan-sen (Conversion Line)
  for (let i = 0; i < high.length; i++) {
    if (i < tenkanPeriod - 1) {
      tenkanSen.push(null);
    } else {
      const highSlice = high.slice(i - tenkanPeriod + 1, i + 1);
      const lowSlice = low.slice(i - tenkanPeriod + 1, i + 1);
      tenkanSen.push((Math.max(...highSlice) + Math.min(...lowSlice)) / 2);
    }
  }

  // Kijun-sen (Base Line)
  for (let i = 0; i < high.length; i++) {
    if (i < kijunPeriod - 1) {
      kijunSen.push(null);
    } else {
      const highSlice = high.slice(i - kijunPeriod + 1, i + 1);
      const lowSlice = low.slice(i - kijunPeriod + 1, i + 1);
      kijunSen.push((Math.max(...highSlice) + Math.min(...lowSlice)) / 2);
    }
  }

  // Senkou Span A (Leading Span A)
  for (let i = 0; i < high.length; i++) {
    if (i < kijunPeriod - 1) {
      senkouSpanA.push(null);
    } else {
      const tenkan = tenkanSen[i];
      const kijun = kijunSen[i];
      if (tenkan !== null && kijun !== null) {
        senkouSpanA.push((tenkan + kijun) / 2);
      } else {
        senkouSpanA.push(null);
      }
    }
  }

  // Senkou Span B (Leading Span B)
  for (let i = 0; i < high.length; i++) {
    if (i < senkouSpanBPeriod - 1) {
      senkouSpanB.push(null);
    } else {
      const highSlice = high.slice(i - senkouSpanBPeriod + 1, i + 1);
      const lowSlice = low.slice(i - senkouSpanBPeriod + 1, i + 1);
      senkouSpanB.push((Math.max(...highSlice) + Math.min(...lowSlice)) / 2);
    }
  }

  // Chikou Span (Lagging Span)
  for (let i = 0; i < close.length; i++) {
    chikouSpan.push(close[i]);
  }

  return {
    tenkanSen,
    kijunSen,
    senkouSpanA,
    senkouSpanB,
    chikouSpan
  };
};

// Parabolic SAR
const calculatePSAR = (high, low, close, acceleration = 0.02, maximum = 0.2) => {
  const result = [];
  let trend = 1; // 1 for uptrend, -1 for downtrend
  let af = acceleration; // Acceleration factor
  let ep = high[0]; // Extreme point
  let psar = low[0]; // Previous SAR

  result.push(psar);

  for (let i = 1; i < high.length; i++) {
    const prevPsar = psar;
    const prevEp = ep;
    const prevAf = af;

    // Calculate new SAR
    psar = prevPsar + prevAf * (prevEp - prevPsar);

    // Check for trend reversal
    if (trend === 1) {
      if (low[i] <= psar) {
        trend = -1;
        psar = prevEp;
        ep = low[i];
        af = acceleration;
      } else {
        if (high[i] > ep) {
          ep = high[i];
          af = Math.min(af + acceleration, maximum);
        }
        psar = Math.min(psar, low[i - 1], low[i]);
      }
    } else {
      if (high[i] >= psar) {
        trend = 1;
        psar = prevEp;
        ep = high[i];
        af = acceleration;
      } else {
        if (low[i] < ep) {
          ep = low[i];
          af = Math.min(af + acceleration, maximum);
        }
        psar = Math.max(psar, high[i - 1], high[i]);
      }
    }

    result.push(psar);
  }

  return result;
};

// ============================================================================
// MAIN INDICATOR CALCULATOR
// ============================================================================

const calculateIndicators = async (data, indicators) => {
  const result = data.map(candle => ({ ...candle }));

  for (const indicator of indicators) {
    const { name, parameters, timeframe } = indicator;
    
    // Extract price data
    const priceData = result.map(candle => candle.close);
    const highData = result.map(candle => candle.high);
    const lowData = result.map(candle => candle.low);
    const volumeData = result.map(candle => candle.volume || 0);

    let indicatorValues = [];

    switch (name.toLowerCase()) {
      // Trend Indicators
      case 'sma':
        indicatorValues = calculateSMA(priceData, parameters.period || 20);
        break;
      
      case 'ema':
        indicatorValues = calculateEMA(priceData, parameters.period || 20);
        break;
      
      case 'wma':
        indicatorValues = calculateWMA(priceData, parameters.period || 20);
        break;
      
      case 'hma':
        indicatorValues = calculateHMA(priceData, parameters.period || 20);
        break;
      
      case 'tema':
        indicatorValues = calculateTEMA(priceData, parameters.period || 20);
        break;
      
      case 'kama':
        indicatorValues = calculateKAMA(
          priceData,
          parameters.period || 14,
          parameters.fastSC || 2,
          parameters.slowSC || 30
        );
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
      
      // Momentum Indicators
      case 'rsi':
        indicatorValues = calculateRSI(priceData, parameters.period || 14);
        break;
      
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
      
      case 'cci':
        indicatorValues = calculateCCI(
          highData,
          lowData,
          priceData,
          parameters.period || 20
        );
        break;
      
      case 'roc':
        indicatorValues = calculateROC(priceData, parameters.period || 10);
        break;
      
      case 'mfi':
        indicatorValues = calculateMFI(
          highData,
          lowData,
          priceData,
          volumeData,
          parameters.period || 14
        );
        break;
      
      // Volatility Indicators
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
      
      case 'atr':
        indicatorValues = calculateATR(
          highData,
          lowData,
          priceData,
          parameters.period || 14
        );
        break;
      
      case 'keltner':
        const keltner = calculateKeltnerChannels(
          highData,
          lowData,
          priceData,
          parameters.period || 20,
          parameters.multiplier || 2
        );
        result.forEach((candle, i) => {
          candle[`${name}_upper`] = keltner.upper[i];
          candle[`${name}_middle`] = keltner.middle[i];
          candle[`${name}_lower`] = keltner.lower[i];
        });
        continue;
      
      case 'donchian':
        const donchian = calculateDonchianChannels(
          highData,
          lowData,
          parameters.period || 20
        );
        result.forEach((candle, i) => {
          candle[`${name}_upper`] = donchian.upper[i];
          candle[`${name}_middle`] = donchian.middle[i];
          candle[`${name}_lower`] = donchian.lower[i];
        });
        continue;
      
      // Volume Indicators
      case 'obv':
        indicatorValues = calculateOBV(priceData, volumeData);
        break;
      
      case 'vwap':
        indicatorValues = calculateVWAP(highData, lowData, priceData, volumeData);
        break;
      
      case 'adl':
        indicatorValues = calculateADL(highData, lowData, priceData, volumeData);
        break;
      
      case 'cmf':
        indicatorValues = calculateCMF(
          highData,
          lowData,
          priceData,
          volumeData,
          parameters.period || 20
        );
        break;
      
      // Oscillators
      case 'ao':
        indicatorValues = calculateAO(
          highData,
          lowData,
          parameters.period1 || 5,
          parameters.period2 || 34
        );
        break;
      
      case 'uo':
        indicatorValues = calculateUO(
          highData,
          lowData,
          priceData,
          parameters.period1 || 7,
          parameters.period2 || 14,
          parameters.period3 || 28
        );
        break;
      
      // Custom Indicators
      case 'ichimoku':
        const ichimoku = calculateIchimoku(
          highData,
          lowData,
          priceData,
          parameters.tenkanPeriod || 9,
          parameters.kijunPeriod || 26,
          parameters.senkouSpanBPeriod || 52
        );
        result.forEach((candle, i) => {
          candle[`${name}_tenkan`] = ichimoku.tenkanSen[i];
          candle[`${name}_kijun`] = ichimoku.kijunSen[i];
          candle[`${name}_senkouA`] = ichimoku.senkouSpanA[i];
          candle[`${name}_senkouB`] = ichimoku.senkouSpanB[i];
          candle[`${name}_chikou`] = ichimoku.chikouSpan[i];
        });
        continue;
      
      case 'psar':
        indicatorValues = calculatePSAR(
          highData,
          lowData,
          priceData,
          parameters.acceleration || 0.02,
          parameters.maximum || 0.2
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
  // Trend Indicators
  calculateSMA,
  calculateEMA,
  calculateWMA,
  calculateHMA,
  calculateTEMA,
  calculateKAMA,
  calculateMACD,
  // Momentum Indicators
  calculateRSI,
  calculateStochastic,
  calculateWilliamsR,
  calculateCCI,
  calculateROC,
  calculateMFI,
  // Volatility Indicators
  calculateBollingerBands,
  calculateATR,
  calculateKeltnerChannels,
  calculateDonchianChannels,
  // Volume Indicators
  calculateOBV,
  calculateVWAP,
  calculateADL,
  calculateCMF,
  // Oscillators
  calculateAO,
  calculateUO,
  // Custom Indicators
  calculateIchimoku,
  calculatePSAR
};