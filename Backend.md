# Binance Crypto Trading Platform - Backend Documentation

## Overview

The backend is a Node.js/Express.js API server that powers a comprehensive cryptocurrency trading platform. It provides authentication, strategy management, backtesting, bot generation, and real-time data services for crypto trading operations.

## Architecture

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with Passport.js
- **Crypto Integration**: CCXT library for exchange connectivity
- **Real-time**: WebSocket support
- **Scheduling**: Node-cron for automated tasks


### Project Structure
```
backend/
├── config/           # Configuration files
│   ├── database.js   # MongoDB connection
│   └── passport.js   # JWT authentication setup
├── middleware/       # Custom middleware
│   └── auth.js       # Authentication middleware
├── models/           # MongoDB schemas
│   ├── User.js       # User model
│   ├── Strategy.js   # Trading strategy model
│   └── Backtest.js   # Backtest results model
├── routes/           # API endpoints
│   ├── auth.js       # Authentication routes
│   ├── strategies.js # Strategy management
│   ├── backtest.js   # Backtesting endpoints
│   ├── bot.js        # Bot management
│   └── data.js       # Market data endpoints
├── services/         # Business logic
│   ├── backtestEngine.js    # Backtesting engine
│   ├── botGenerator.js      # Bot code generation
│   ├── dataService.js       # Market data service
│   ├── indicatorService.js  # Technical indicators
│   └── strategyEngine.js    # Strategy execution
└── server.js         # Main server file
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user profile
- `PUT /preferences` - Update user preferences
- `POST /logout` - User logout
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Password reset confirmation
- `PUT /change-password` - Change password
