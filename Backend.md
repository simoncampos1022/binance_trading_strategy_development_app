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