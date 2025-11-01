import { useState, useEffect } from 'react';
import { getExpenses, getIncome, deleteExpense, deleteIncome } from '../utils/storage';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import './TransactionTable.css';

const TransactionTable = ({ onDelete, limit, showSeparateSections = false }) => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [grandTotal, setGrandTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, [filter, limit, categoryFilter, searchQuery, dateFrom, dateTo]);

  const loadTransactions = () => {
    const expenses = getExpenses().map(exp => ({ ...exp, type: 'expense' }));
    const income = getIncome().map(inc => ({ ...inc, type: 'income' }));
    let all = [...expenses, ...income];
    
    // Filter by type
    if (filter === 'expenses') {
      all = expenses;
    } else if (filter === 'income') {
      all = income;
    }
    
    // Filter by category
    if (categoryFilter) {
      all = all.filter(t => t.category === categoryFilter);
    }
    
    // Filter by date range
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      all = all.filter(t => new Date(t.date) >= fromDate);
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      all = all.filter(t => new Date(t.date) <= toDate);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      all = all.filter(t => 
        t.description?.toLowerCase().includes(query) ||
        getCategoryInfo(t.category, t.type).label.toLowerCase().includes(query)
      );
    }
    
    all.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Calculate totals (before limit)
    const expensesList = all.filter(t => t.type === 'expense');
    const incomeList = all.filter(t => t.type === 'income');
    
    const expTotal = expensesList.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const incTotal = incomeList.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const grand = incTotal - expTotal;
    
    setExpenseTotal(expTotal);
    setIncomeTotal(incTotal);
    setGrandTotal(grand);
    
    if (limit) {
      all = all.slice(0, limit);
    }
    
    setTransactions(all);
  };
  
  const getFilteredTransactions = (type) => {
    return transactions.filter(t => t.type === type);
  };

  const handleDelete = (id, type) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      if (type === 'expense') {
        deleteExpense(id);
      } else {
        deleteIncome(id);
      }
      loadTransactions();
      if (onDelete) onDelete();
    }
  };

  const getCategoryInfo = (category, type) => {
    const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    return categories.find(cat => cat.value === category) || { label: category, icon: '📝', color: '#64748b' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const renderTransactionList = (transactionList, sectionTitle = null) => {
    if (transactionList.length === 0) return null;
    
    return (
      <div className="transaction-section">
        {sectionTitle && <h3 className="section-title">{sectionTitle}</h3>}
        <div className="transactions-list">
          {transactionList.map((transaction) => {
            const categoryInfo = getCategoryInfo(transaction.category, transaction.type);
            const isExpense = transaction.type === 'expense';
            
            return (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-main">
                  <div className="transaction-icon" style={{ backgroundColor: `${categoryInfo.color}20` }}>
                    <span>{categoryInfo.icon}</span>
                  </div>
                  <div className="transaction-info">
                    <div className="transaction-category">{categoryInfo.label}</div>
                    {transaction.description && (
                      <div className="transaction-description">{transaction.description}</div>
                    )}
                    <div className="transaction-date">{formatDate(transaction.date)}</div>
                  </div>
                  <div className={`transaction-amount ${isExpense ? 'expense' : 'income'}`}>
                    {isExpense ? '-' : '+'}₹{parseFloat(transaction.amount).toFixed(2)}
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(transaction.id, transaction.type)}
                  aria-label="Delete transaction"
                >
                  🗑️
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  const expenseTransactions = showSeparateSections ? getFilteredTransactions('expense') : [];
  const incomeTransactions = showSeparateSections ? getFilteredTransactions('income') : [];

  return (
    <div className="transaction-table-card">
      <div className="table-header">
        <h2>Transactions</h2>
        {!limit && (
          <div className="header-actions">
            <button
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        )}
      </div>

      {!limit && (
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'expenses' ? 'active' : ''}`}
            onClick={() => setFilter('expenses')}
          >
            Expenses
          </button>
          <button
            className={`filter-btn ${filter === 'income' ? 'active' : ''}`}
            onClick={() => setFilter('income')}
          >
            Income
          </button>
        </div>
      )}

      {!limit && showFilters && (
        <div className="advanced-filters">
          <div className="filter-group">
            <label htmlFor="search">Search</label>
            <input
              type="text"
              id="search"
              placeholder="Search by description or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {allCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="dateFrom">From Date</label>
              <input
                type="date"
                id="dateFrom"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="dateTo">To Date</label>
              <input
                type="date"
                id="dateTo"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          <button
            className="clear-filters-btn"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('');
              setDateFrom('');
              setDateTo('');
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}

      {!limit && (grandTotal !== 0 || expenseTotal !== 0 || incomeTotal !== 0) && (
        <div className="totals-summary">
          <div className="total-item expense">
            <span className="total-label">Total Expenses:</span>
            <span className="total-value">-₹{expenseTotal.toFixed(2)}</span>
          </div>
          <div className="total-item income">
            <span className="total-label">Total Income:</span>
            <span className="total-value">+₹{incomeTotal.toFixed(2)}</span>
          </div>
          <div className="total-item grand">
            <span className="total-label">Grand Total:</span>
            <span className={`total-value ${grandTotal < 0 ? 'negative' : ''}`}>
              ₹{grandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {showSeparateSections ? (
        <>
          {renderTransactionList(expenseTransactions, '💸 Expenses')}
          {renderTransactionList(incomeTransactions, '💰 Income')}
        </>
      ) : transactions.length === 0 ? (
        <div className="empty-state">
          <p>No transactions found</p>
        </div>
      ) : (
        <div className="transactions-list">
          {transactions.map((transaction) => {
            const categoryInfo = getCategoryInfo(transaction.category, transaction.type);
            const isExpense = transaction.type === 'expense';
            
            return (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-main">
                  <div className="transaction-icon" style={{ backgroundColor: `${categoryInfo.color}20` }}>
                    <span>{categoryInfo.icon}</span>
                  </div>
                  <div className="transaction-info">
                    <div className="transaction-category">{categoryInfo.label}</div>
                    {transaction.description && (
                      <div className="transaction-description">{transaction.description}</div>
                    )}
                    <div className="transaction-date">{formatDate(transaction.date)}</div>
                  </div>
                  <div className={`transaction-amount ${isExpense ? 'expense' : 'income'}`}>
                    {isExpense ? '-' : '+'}₹{parseFloat(transaction.amount).toFixed(2)}
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(transaction.id, transaction.type)}
                  aria-label="Delete transaction"
                >
                  🗑️
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
