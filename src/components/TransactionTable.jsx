import { useState, useEffect } from 'react';
import { getExpenses, getIncome, deleteExpense, deleteIncome } from '../utils/storage';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import './TransactionTable.css';

const TransactionTable = ({ onDelete, limit }) => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTransactions();
  }, [filter, limit]);

  const loadTransactions = () => {
    const expenses = getExpenses().map(exp => ({ ...exp, type: 'expense' }));
    const income = getIncome().map(inc => ({ ...inc, type: 'income' }));
    let all = [...expenses, ...income];
    
    if (filter === 'expenses') {
      all = expenses;
    } else if (filter === 'income') {
      all = income;
    }
    
    all.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (limit) {
      all = all.slice(0, limit);
    }
    
    setTransactions(all);
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

  if (transactions.length === 0) {
    return (
      <div className="transaction-table-card">
        <div className="table-header">
          <h2>Transactions</h2>
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
        </div>
        <div className="empty-state">
          <p>No transactions found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-table-card">
      <div className="table-header">
        <h2>Transactions</h2>
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
      </div>
      
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
                  {isExpense ? '-' : '+'}${parseFloat(transaction.amount).toFixed(2)}
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

export default TransactionTable;

