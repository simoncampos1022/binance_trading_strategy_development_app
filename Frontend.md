# Binance Crypto Trading Platform - Frontend Documentation

## Overview

The frontend is a modern React/Next.js application that provides an intuitive interface for cryptocurrency trading strategy development, backtesting, and bot generation. Built with TypeScript, Tailwind CSS, and modern React patterns, it offers a responsive and user-friendly experience for both novice and advanced traders.

## Architecture

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **Charts**: Recharts
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Code Editor**: React Ace
- **Notifications**: React Hot Toast
- **Animations**: Framer Motion
- **Icons**: Lucide React, Heroicons


### Project Structure
```
frontend/
├── app/                    # Next.js App Router
│   ├── auth/
│   │   └── callback/      # OAuth callback page
│   ├── globals.css        # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── auth/             # Authentication components
│   │   ├── LoginModal.tsx
│   │   └── RegisterModal.tsx
│   ├── backtest/         # Backtesting components
│   │   └── BacktestResults.tsx
│   ├── bot/              # Bot generation components
│   │   └── BotGenerator.tsx
│   ├── demo/             # Demo components
│   │   └── ToastDemo.tsx
│   ├── layout/           # Layout components
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── profile/          # User profile components
│   │   └── Profile.tsx
│   ├── strategy/         # Strategy building components
│   │   ├── ConditionBuilder.tsx
│   │   ├── IndicatorSelector.tsx
│   │   ├── StrategyBuilder.tsx
│   │   └── StrategyPreview.tsx
│   ├── Dashboard.tsx     # Main dashboard
│   └── LandingPage.tsx   # Landing page
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # Authentication state
│   └── ThemeContext.tsx   # Theme management
├── hooks/               # Custom hooks
│   └── useToast.ts       # Toast notifications
├── lib/                 # Utility libraries
│   ├── api.ts           # API client
│   └── toast.ts         # Toast utilities
├── styles/              # Additional styles
│   └── toast.css        # Toast animations
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

## Key Features

### 1. Authentication System
- **JWT-based Authentication**: Secure token-based authentication
- **User Registration/Login**: Complete user management
- **OAuth Integration**: Google OAuth support
- **Session Management**: Persistent login state
- **Password Management**: Change password functionality

### 2. Strategy Builder
- **Visual Strategy Creation**: Drag-and-drop interface
- **Technical Indicators**: 50+ built-in indicators
- **Condition Builder**: Complex buy/sell conditions
- **Risk Management**: Stop loss, take profit, position sizing
- **Strategy Preview**: Real-time strategy visualization
- **Code Generation**: Python/JavaScript code export

### 3. Backtesting Engine
- **Historical Data**: Multiple timeframes and symbols
- **Performance Metrics**: Sharpe ratio, max drawdown, win rate
- **Visual Results**: Interactive charts and graphs
- **Trade Analysis**: Detailed trade history
- **Portfolio Simulation**: Realistic trading simulation

### 4. Bot Generator
- **Code Generation**: Python and JavaScript bots
- **Configuration Management**: API keys, trading parameters
- **Deployment Ready**: Production-ready code
- **Documentation**: Built-in deployment instructions
- **Download Support**: Direct file download

### 5. Dashboard & Analytics
- **Real-time Data**: Live market data integration
- **Portfolio Overview**: Account balance and positions
- **Performance Tracking**: Strategy performance metrics
- **Risk Monitoring**: Real-time risk assessment

## Component Architecture

### Core Components

#### Dashboard (`components/Dashboard.tsx`)
Main application interface with tabbed navigation:
- Strategy Builder tab
- Backtesting tab
- Bot Generator tab
- Profile tab

#### Strategy Builder (`components/strategy/StrategyBuilder.tsx`)
Comprehensive strategy development interface:
- Strategy information form
- Indicator selection
- Buy/sell condition builder
- Risk management settings
- Strategy preview

#### Bot Generator (`components/bot/BotGenerator.tsx`)
Trading bot code generation:
- Strategy selection
- Language selection (Python/JavaScript)
- Configuration management
- Code generation and download

#### Authentication Components
- **LoginModal**: User login interface
- **RegisterModal**: User registration interface
- **AuthContext**: Global authentication state management



### Context Providers

#### AuthContext (`contexts/AuthContext.tsx`)
Manages user authentication state:
```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => Promise<void>;
}


```

#### ThemeContext (`contexts/ThemeContext.tsx`)
Manages application theme:
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
```


## API Integration

### API Client (`lib/api.ts`)
Centralized API communication:
- Axios-based HTTP client
- Automatic token management
- Request/response interceptors
- Error handling