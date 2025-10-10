const express = require('express');
const { getRealTimeData, getMarketData, getHistoricalData } = require('../services/dataService');

const router = express.Router();

// Get real-time price for a symbol
router.get('/price/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await getRealTimeData(symbol);
    res.json(data);
  } catch (error) {
    console.error('Get price error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get market data for multiple symbols
router.get('/market', async (req, res) => {
  try {
    const { symbols } = req.query;
    const symbolList = symbols ? symbols.split(',') : ['BTCUSDT', 'ETHUSDT', 'ADAUSDT'];
    const data = await getMarketData(symbolList);
    res.json(data);
  } catch (error) {
    console.error('Get market data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get historical data
router.get('/historical/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1h', startDate, endDate, limit = 100 } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const end = endDate ? new Date(endDate) : new Date();
    
    const data = await getHistoricalData(symbol, timeframe, start, end);
    
    // Limit results if requested
    const limitedData = limit ? data.slice(-limit) : data;
    
    res.json({
      symbol,
      timeframe,
      data: limitedData,
      count: limitedData.length
    });
  } catch (error) {
    console.error('Get historical data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available symbols
router.get('/symbols', async (req, res) => {
  try {
    // This would typically come from the exchange API
    const symbols = [
      'BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'BNBUSDT', 'XRPUSDT',
      'SOLUSDT', 'DOTUSDT', 'DOGEUSDT', 'AVAXUSDT', 'MATICUSDT',
      'LINKUSDT', 'UNIUSDT', 'LTCUSDT', 'ATOMUSDT', 'FTMUSDT'
    ];
    
    res.json({ symbols });
  } catch (error) {
    console.error('Get symbols error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available timeframes
router.get('/timeframes', async (req, res) => {
  try {
    const timeframes = [
      { value: '1m', label: '1 Minute' },
      { value: '5m', label: '5 Minutes' },
      { value: '15m', label: '15 Minutes' },
      { value: '30m', label: '30 Minutes' },
      { value: '1h', label: '1 Hour' },
      { value: '4h', label: '4 Hours' },
      { value: '1d', label: '1 Day' },
      { value: '1w', label: '1 Week' }
    ];
    
    res.json({ timeframes });
  } catch (error) {
    console.error('Get timeframes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
