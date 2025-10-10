const axios = require('axios');

// Mock data generator for development
const generateMockData = (symbol, timeframe, startDate, endDate) => {
  const data = [];
  const interval = getIntervalMs(timeframe);
  let currentTime = new Date(startDate);
  let price = 100; // Starting price

  while (currentTime <= endDate) {
    // Generate realistic price movement
    const change = (Math.random() - 0.5) * 0.02; // ±1% change
    price = price * (1 + change);
    
    const high = price * (1 + Math.random() * 0.01);
    const low = price * (1 - Math.random() * 0.01);
    const volume = Math.random() * 1000000;

    data.push({
      timestamp: new Date(currentTime),
      open: price,
      high: Math.max(price, high),
      low: Math.min(price, low),
      close: price,
      volume: volume
    });

    currentTime = new Date(currentTime.getTime() + interval);
  }

  return data;
};

const getIntervalMs = (timeframe) => {
  const intervals = {
    '1m': 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000
  };
  return intervals[timeframe] || intervals['1h'];
};

const getHistoricalData = async (symbol, timeframe, startDate, endDate) => {
  try {
    // For development, use mock data
    // In production, integrate with real exchange APIs
    if (process.env.NODE_ENV === 'development') {
      return generateMockData(symbol, timeframe, startDate, endDate);
    }

    // Real API integration would go here
    // Example with Binance API:
    const response = await axios.get('https://api.binance.com/api/v3/klines', {
      params: {
        symbol: symbol.toUpperCase(),
        interval: timeframe,
        startTime: startDate.getTime(),
        endTime: endDate.getTime(),
        limit: 1000
      }
    });

    return response.data.map(kline => ({
      timestamp: new Date(kline[0]),
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5])
    }));

  } catch (error) {
    console.error('Error fetching historical data:', error);
    // Fallback to mock data
    return generateMockData(symbol, timeframe, startDate, endDate);
  }
};

const getRealTimeData = async (symbol) => {
  try {
    const response = await axios.get(`https://api.binance.com/api/v3/ticker/price`, {
      params: { symbol: symbol.toUpperCase() }
    });

    return {
      symbol: response.data.symbol,
      price: parseFloat(response.data.price),
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error fetching real-time data:', error);
    throw error;
  }
};

const getMarketData = async (symbols) => {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr', {
      params: { symbols: JSON.stringify(symbols.map(s => s.toUpperCase())) }
    });

    return response.data.map(ticker => ({
      symbol: ticker.symbol,
      price: parseFloat(ticker.lastPrice),
      change: parseFloat(ticker.priceChange),
      changePercent: parseFloat(ticker.priceChangePercent),
      volume: parseFloat(ticker.volume),
      high: parseFloat(ticker.highPrice),
      low: parseFloat(ticker.lowPrice)
    }));
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};

module.exports = {
  getHistoricalData,
  getRealTimeData,
  getMarketData
};
