# 🪙 CoinLens

A modern, responsive cryptocurrency tracking application built with React, TypeScript, and Material-UI. CoinLens allows users to monitor real-time crypto prices, manage a personal portfolio, and visualize market data through interactive charts.

## 🌟 Features

### Dashboard
- **Real-time Market Data**: Browse and search through cryptocurrency markets with live price updates
- **Smart Filtering**: Filter coins by category (All, Favorites, Crypto, Stable)
- **Advanced Sorting**: Sort by price, market cap, 24h change, and volume
- **Favorites System**: Star coins for quick access
- **Adaptive Pagination**: Optimized data fetching with debouncing to prevent API rate limits
- **Responsive Tables**: Horizontal scrolling on mobile with column visibility optimization

### Portfolio Management
- **Track Holdings**: Add cryptocurrencies with custom amounts
- **Live P/L Calculation**: Real-time profit/loss tracking in USD and percentage
- **Inline Editing**: Quick amount updates with intuitive UX
- **Visual Allocation**: Interactive pie chart showing portfolio distribution
- **Smart Summaries**: Total value and P/L at a glance

### Coin Details
- **Detailed Information**: Current price, market cap, and key metrics
- **Interactive Charts**: 7-day and 30-day price history with tooltips
- **Quick Actions**: Add to portfolio directly from coin page

### User Experience
- **Dark/Light Theme**: Persistent theme preference with smooth transitions
- **Fully Responsive**: Optimized layouts for mobile, tablet, and desktop
- **Modern UI**: Glassmorphism effects, gradients, and smooth animations
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Tech Stack

### Core
- **React 19** - Latest React with improved performance
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool with HMR

### State Management
- **Redux Toolkit** - Efficient state management with RTK Query
- **Redux Persist** - Persistent favorites and portfolio across sessions

### UI & Styling
- **Material-UI v7** - Comprehensive component library
- **Emotion** - CSS-in-JS styling solution
- **Recharts** - Responsive charting library

### Routing & Data
- **React Router v7** - Client-side routing
- **RTK Query** - Data fetching and caching
- **CoinGecko API** - Real-time cryptocurrency data

### Code Quality
- **ESLint** - Code linting with React best practices
- **Prettier** - Code formatting
- **TypeScript Strict Mode** - Enhanced type safety

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/HannaHtslk/coinlens.git
cd coinlens/coinlens
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open in browser**
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
coinlens/
├── public/
│   └── logo.svg           # App logo
├── src/
│   ├── api/
│   │   └── cryptoApi.ts   # RTK Query API definitions
│   ├── components/
│   │   ├── CoinsTable.tsx         # Dashboard table
│   │   ├── CoinInfo.tsx           # Coin details card
│   │   ├── Filters.tsx            # Search and filter controls
│   │   ├── Layout.tsx             # Header navigation
│   │   ├── NoResults.tsx          # Empty state
│   │   ├── PortfolioTable.tsx     # Portfolio holdings table
│   │   ├── PortfolioAllocation.tsx # Pie chart
│   │   ├── ProfitLossSection.tsx  # P/L summary cards
│   │   └── Skeleton.tsx           # Loading skeletons
│   ├── context/
│   │   └── ThemeContext.tsx       # Theme provider
│   ├── helpers/
│   │   └── helpers.ts             # Utility functions
│   ├── pages/
│   │   ├── DashboardPage.tsx      # Main market view
│   │   ├── CoinPage.tsx           # Individual coin details
│   │   └── PortfolioPage.tsx      # Portfolio management
│   ├── redux/
│   │   ├── favorites/
│   │   │   └── favoritesSlice.ts  # Favorites state
│   │   └── portfolio/
│   │       └── portfolioSlice.ts  # Portfolio state
│   ├── store/
│   │   ├── store.ts               # Redux store config
│   │   └── hooks.ts               # Typed Redux hooks
│   ├── theme/
│   │   └── theme.ts               # MUI theme configuration
│   ├── types/
│   │   └── coin.ts                # TypeScript interfaces
│   ├── App.tsx                    # Root component
│   └── main.tsx                   # App entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Design Decisions

### Why Redux Toolkit?
- **Type Safety**: Full TypeScript support out of the box
- **Less Boilerplate**: Simplified syntax with createSlice and RTK Query
- **DevTools**: Built-in Redux DevTools integration
- **Best Practices**: Enforces Flux pattern and immutability

### Why Material-UI?
- **Production Ready**: Battle-tested component library
- **Theming**: Powerful theming system with dark mode support
- **Accessibility**: WCAG compliant components
- **Documentation**: Extensive docs and community support

### Why Vite?
- **Speed**: 10-100x faster than Create React App
- **Modern**: ESM-based with native ES modules
- **DX**: Instant HMR and optimized production builds

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

**Anna Hutsaliuk** -  hannah.htslk@gmail.com

Project Link: [https://github.com/HannaHtslk/coinlens](https://github.com/HannaHtslk/coinlens)

---

Made with ❤️ and React
