const express = require('express');
const Backtest = require('../models/Backtest');
const Strategy = require('../models/Strategy');
const auth = require('../middleware/auth');
const { runBacktest } = require('../services/backtestEngine');

const router = express.Router();

// Get all backtests for a user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, strategyId } = req.query;
    const query = { user: req.user._id };

    if (strategyId) query.strategy = strategyId;

    const backtests = await Backtest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('strategy', 'name');

    const total = await Backtest.countDocuments(query);

    res.json({
      backtests,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get backtests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single backtest
router.get('/:id', auth, async (req, res) => {
  try {
    const backtest = await Backtest.findById(req.params.id)
      .populate('strategy')
      .populate('user', 'username');

    if (!backtest) {
      return res.status(404).json({ message: 'Backtest not found' });
    }

    if (backtest.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ backtest });
  } catch (error) {
    console.error('Get backtest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create and run new backtest
router.post('/', auth, async (req, res) => {
  try {
    const {
      strategyId,
      name,
      symbol,
      timeframe,
      startDate,
      endDate,
      initialCapital = 10000,
      parameters = {}
    } = req.body;

    // Verify strategy exists and user has access
    const strategy = await Strategy.findById(strategyId);
    if (!strategy) {
      return res.status(404).json({ message: 'Strategy not found' });
    }

    if (strategy.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create backtest record
    const backtest = new Backtest({
      strategy: strategyId,
      user: req.user._id,
      name,
      symbol,
      timeframe,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      initialCapital,
      parameters,
      status: 'running'
    });

    await backtest.save();

    // Run backtest asynchronously
    runBacktest(backtest._id, strategy, {
      symbol,
      timeframe,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      initialCapital,
      parameters
    }).catch(error => {
      console.error('Backtest execution error:', error);
      Backtest.findByIdAndUpdate(backtest._id, {
        status: 'failed',
        error: error.message
      });
    });

    res.status(201).json({
      message: 'Backtest started successfully',
      backtest
    });
  } catch (error) {
    console.error('Create backtest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get backtest results
router.get('/:id/results', auth, async (req, res) => {
  try {
    const backtest = await Backtest.findById(req.params.id);

    if (!backtest) {
      return res.status(404).json({ message: 'Backtest not found' });
    }

    if (backtest.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      results: backtest.results,
      trades: backtest.trades,
      equityCurve: backtest.equityCurve,
      monthlyReturns: backtest.monthlyReturns,
      status: backtest.status
    });
  } catch (error) {
    console.error('Get backtest results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete backtest
router.delete('/:id', auth, async (req, res) => {
  try {
    const backtest = await Backtest.findById(req.params.id);

    if (!backtest) {
      return res.status(404).json({ message: 'Backtest not found' });
    }

    if (backtest.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Backtest.findByIdAndDelete(req.params.id);

    res.json({ message: 'Backtest deleted successfully' });
  } catch (error) {
    console.error('Delete backtest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
