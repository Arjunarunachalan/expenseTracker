# Expense Tracker

A responsive expense tracking web application built with React and Vite, optimized for iPhone and mobile devices.

## Features

- 📊 **Overview Dashboard**: View monthly cash in hand, weekly expense charts, and recent transactions
- ➕ **Add Transactions**: Easy-to-use forms for adding expenses and income
- 📋 **Transaction Table**: View all your transactions with filtering options
- 📈 **Weekly Analytics**: Visual chart showing your spending patterns over the past week
- 💰 **Monthly Cash Flow**: Track your income, expenses, and cash in hand for the current month
- 🏷️ **Categories**: Organized expense and income categories including:
  - Food, Shopping, Saving, Transport, Bills, Entertainment, Health, Education, and more
- 💾 **Local Storage**: All data is stored locally in your browser
- 📱 **Mobile-First Design**: Optimized for iPhone and mobile devices with clean, modern UI

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Usage

1. **Overview Tab**: View your monthly summary, weekly chart, and recent transactions
2. **Add Tab**: Add new expenses or income entries with categories and descriptions
3. **All Tab**: View all transactions with filtering options (All/Expenses/Income)

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── Header.jsx       # Navigation header
│   │   ├── MonthlyCashInHand.jsx
│   │   ├── WeeklyChart.jsx
│   │   ├── TransactionForm.jsx
│   │   └── TransactionTable.jsx
│   ├── constants/          # Constants and configuration
│   │   └── categories.js   # Expense and income categories
│   ├── utils/              # Utility functions
│   │   └── storage.js      # Local storage helpers
│   ├── App.jsx             # Main app component
│   ├── App.css
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Technologies Used

- React 18
- Vite
- Recharts (for chart visualization)
- Local Storage API

## License

MIT

