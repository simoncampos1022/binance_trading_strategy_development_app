const express = require('express');
const Strategy = require('../models/Strategy');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all strategies for a user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, isPublic } = req.query;
    const query = { author: req.user._id };

    if (category) query.category = category;
    if (isPublic !== undefined) query.isPublic = isPublic === 'true';

    const strategies = await Strategy.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'username');

    const total = await Strategy.countDocuments(query);

    res.json({
      strategies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get strategies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public strategies
router.get('/public', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const query = { isPublic: true };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const strategies = await Strategy.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'username');

    const total = await Strategy.countDocuments(query);

    res.json({
      strategies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get public strategies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single strategy
router.get('/:id', auth, async (req, res) => {
  try {
    const strategy = await Strategy.findById(req.params.id)
      .populate('author', 'username');

    if (!strategy) {
      return res.status(404).json({ message: 'Strategy not found' });
    }

    // Check if user owns the strategy or it's public
    if (strategy.author._id.toString() !== req.user._id.toString() && !strategy.isPublic) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ strategy });
  } catch (error) {
    console.error('Get strategy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new strategy
router.post('/', auth, async (req, res) => {
  try {
    const strategyData = {
      ...req.body,
      author: req.user._id
    };

    const strategy = new Strategy(strategyData);
    await strategy.save();

    // Add strategy to user's strategies array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { strategies: strategy._id } }
    );

    res.status(201).json({
      message: 'Strategy created successfully',
      strategy
    });
  } catch (error) {
    console.error('Create strategy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update strategy
router.put('/:id', auth, async (req, res) => {
  try {
    const strategy = await Strategy.findById(req.params.id);

    if (!strategy) {
      return res.status(404).json({ message: 'Strategy not found' });
    }

    if (strategy.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedStrategy = await Strategy.findByIdAndUpdate(
      req.params.id,
      { ...req.body, version: strategy.version + 1 },
      { new: true }
    );

    res.json({
      message: 'Strategy updated successfully',
      strategy: updatedStrategy
    });
  } catch (error) {
    console.error('Update strategy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete strategy
router.delete('/:id', auth, async (req, res) => {
  try {
    const strategy = await Strategy.findById(req.params.id);

    if (!strategy) {
      return res.status(404).json({ message: 'Strategy not found' });
    }

    if (strategy.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Strategy.findByIdAndDelete(req.params.id);

    // Remove strategy from user's strategies array
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { strategies: req.params.id } }
    );

    res.json({ message: 'Strategy deleted successfully' });
  } catch (error) {
    console.error('Delete strategy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Duplicate strategy
router.post('/:id/duplicate', auth, async (req, res) => {
  try {
    const originalStrategy = await Strategy.findById(req.params.id);

    if (!originalStrategy) {
      return res.status(404).json({ message: 'Strategy not found' });
    }

    if (!originalStrategy.isPublic && originalStrategy.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const duplicatedStrategy = new Strategy({
      ...originalStrategy.toObject(),
      _id: undefined,
      author: req.user._id,
      name: `${originalStrategy.name} (Copy)`,
      isPublic: false,
      version: 1,
      createdAt: undefined,
      updatedAt: undefined
    });

    await duplicatedStrategy.save();

    // Add strategy to user's strategies array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { strategies: duplicatedStrategy._id } }
    );

    res.status(201).json({
      message: 'Strategy duplicated successfully',
      strategy: duplicatedStrategy
    });
  } catch (error) {
    console.error('Duplicate strategy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
