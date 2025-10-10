const express = require('express');
const Strategy = require('../models/Strategy');
const auth = require('../middleware/auth');
const { generatePythonBot, generateJavaScriptBot } = require('../services/botGenerator');

const router = express.Router();

// Generate Python bot
router.post('/generate/python/:strategyId', auth, async (req, res) => {
  try {
    const strategy = await Strategy.findById(req.params.strategyId);

    if (!strategy) {
      return res.status(404).json({ message: 'Strategy not found' });
    }

    if (strategy.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const botCode = generatePythonBot(strategy, req.body.config || {});

    // Update strategy with generated code
    await Strategy.findByIdAndUpdate(req.params.strategyId, {
      'code.python': botCode
    });

    res.json({
      message: 'Python bot generated successfully',
      code: botCode,
      filename: `${strategy.name.replace(/\s+/g, '_')}_bot.py`
    });
  } catch (error) {
    console.error('Generate Python bot error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate JavaScript bot
router.post('/generate/javascript/:strategyId', auth, async (req, res) => {
  try {
    const strategy = await Strategy.findById(req.params.strategyId);

    if (!strategy) {
      return res.status(404).json({ message: 'Strategy not found' });
    }

    if (strategy.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const botCode = generateJavaScriptBot(strategy, req.body.config || {});

    // Update strategy with generated code
    await Strategy.findByIdAndUpdate(req.params.strategyId, {
      'code.javascript': botCode
    });

    res.json({
      message: 'JavaScript bot generated successfully',
      code: botCode,
      filename: `${strategy.name.replace(/\s+/g, '_')}_bot.js`
    });
  } catch (error) {
    console.error('Generate JavaScript bot error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Download bot code
router.get('/download/:strategyId/:language', auth, async (req, res) => {
  try {
    const { strategyId, language } = req.params;
    const strategy = await Strategy.findById(strategyId);

    if (!strategy) {
      return res.status(404).json({ message: 'Strategy not found' });
    }

    if (strategy.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let code, filename, contentType;

    if (language === 'python') {
      code = strategy.code?.python || generatePythonBot(strategy);
      filename = `${strategy.name.replace(/\s+/g, '_')}_bot.py`;
      contentType = 'text/x-python';
    } else if (language === 'javascript') {
      code = strategy.code?.javascript || generateJavaScriptBot(strategy);
      filename = `${strategy.name.replace(/\s+/g, '_')}_bot.js`;
      contentType = 'text/javascript';
    } else {
      return res.status(400).json({ message: 'Unsupported language' });
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(code);
  } catch (error) {
    console.error('Download bot error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bot configuration template
router.get('/config/template', auth, (req, res) => {
  const template = {
    api: {
      key: 'YOUR_API_KEY',
      secret: 'YOUR_SECRET_KEY',
      testnet: true
    },
    trading: {
      symbol: 'BTCUSDT',
      timeframe: '1h',
      initialCapital: 10000,
      maxPositionSize: 0.1
    },
    risk: {
      stopLoss: 0.02,
      takeProfit: 0.04,
      maxDrawdown: 0.15
    },
    notifications: {
      email: 'your-email@example.com',
      webhook: 'https://your-webhook-url.com'
    }
  };

  res.json({ template });
});

module.exports = router;
