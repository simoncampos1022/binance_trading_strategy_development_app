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

### Strategies (`/api/strategies`)
- `GET /` - Get user strategies
- `POST /` - Create new strategy
- `GET /:id` - Get strategy details
- `PUT /:id` - Update strategy
- `DELETE /:id` - Delete strategy
- `GET /public` - Get public strategies
- `POST /:id/clone` - Clone strategy

### Backtesting (`/api/backtest`)
- `POST /` - Start new backtest
- `GET /` - Get user backtests
- `GET /:id` - Get backtest results
- `DELETE /:id` - Cancel/delete backtest

### Bot Management (`/api/bot`)
- `POST /generate` - Generate trading bot code
- `GET /` - Get user bots
- `POST /deploy` - Deploy bot
- `PUT /:id/start` - Start bot
- `PUT /:id/stop` - Stop bot


### Market Data (`/api/data`)
- `GET /symbols` - Get available trading symbols
- `GET /ohlcv/:symbol` - Get OHLCV data
- `GET /indicators` - Get available indicators
- `POST /calculate-indicator` - Calculate technical indicators

## Data Models

### User Model
```javascript
{
  username: String (unique, required)
  email: String (unique, required)
  password: String (hashed)
  googleId: String (for OAuth)
  isVerified: Boolean
  strategies: [ObjectId] (references to Strategy)
  preferences: {
    defaultTimeframe: String
    defaultExchange: String
    theme: String
  }
  subscription: {
    plan: String (free/pro/enterprise)
    expiresAt: Date
  }
}
```


### Strategy Model
```javascript
{
  name: String (required)
  description: String
  author: ObjectId (User reference)
  isPublic: Boolean
  category: String (trend/momentum/mean_reversion/arbitrage/custom)
  symbols: [String] (trading pairs)
  timeframes: [String] (1m, 5m, 1h, 1d, etc.)
  indicators: [IndicatorSchema]
  buyConditions: [ConditionSchema]
  sellConditions: [ConditionSchema]
  riskManagement: {
    stopLoss: Number
    takeProfit: Number
    maxPositionSize: Number
    maxDrawdown: Number
  }
  backtestResults: {
    totalReturn: Number
    sharpeRatio: Number
    maxDrawdown: Number
    winRate: Number
    totalTrades: Number
  }
  code: {
    python: String
    javascript: String
  }
}
```


### Backtest Model
```javascript
{
  strategy: ObjectId (Strategy reference)
  user: ObjectId (User reference)
  name: String
  symbol: String
  timeframe: String
  startDate: Date
  endDate: Date
  initialCapital: Number
  results: {
    totalReturn: Number
    totalReturnPercent: Number
    sharpeRatio: Number
    maxDrawdown: Number
    winRate: Number
    totalTrades: Number
    // ... more metrics
  }
  trades: [TradeSchema]
  equityCurve: [EquityPointSchema]
  status: String (running/completed/failed/cancelled)
}
```

## Core Services

### Backtest Engine
- Historical data processing
- Strategy execution simulation
- Performance metrics calculation
- Risk management implementation
- Trade logging and analysis

### Bot Generator
- Python/JavaScript code generation
- Exchange API integration
- Real-time strategy execution
- Error handling and logging
- Performance monitoring

### Data Service
- Real-time market data
- Historical data retrieval
- Multiple exchange support
- Data caching and optimization
- WebSocket connections

### Indicator Service
- Technical indicator calculations
- Custom indicator support
- Performance optimization
- Multiple timeframe support
- Real-time updates


### Strategy Engine
- Strategy validation
- Condition evaluation
- Signal generation
- Risk management
- Portfolio optimization

## Security Features

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Token expiration handling
- Secure password requirements


### Authorization
- Route-level protection
- User-specific data access
- Strategy ownership validation
- API rate limiting

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration


## Environment Configuration

### Required Environment Variables
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/trading-platform

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Exchange APIs (optional)
BINANCE_API_KEY=your-api-key
BINANCE_SECRET_KEY=your-secret-key
```

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn


### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Start production server
npm start
```

### Available Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests

## API Documentation

### Authentication Flow
1. Register/Login to get JWT token
2. Include token in Authorization header: `Bearer <token>`
3. Token expires after configured time (default: 7 days)

### Error Handling
All API responses follow a consistent format:
```javascript

// Success
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}


// Error
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```
### Rate Limiting
- Authentication endpoints: 5 requests per minute
- Data endpoints: 100 requests per minute
- Strategy endpoints: 20 requests per minute
## Performance Considerations

### Database Optimization
- Indexed fields for faster queries
- Aggregation pipelines for complex operations
- Connection pooling
- Query optimization


### Caching Strategy
- Redis for session storage
- In-memory caching for frequently accessed data
- CDN for static assets

### Scalability
- Horizontal scaling with load balancers
- Microservices architecture ready
- Database sharding support
- Queue-based processing

## Monitoring and Logging

### Health Checks
- `GET /api/health` - Server health status
- Database connection monitoring
- External service availability