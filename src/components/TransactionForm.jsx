import { useState } from 'react';
import { addExpense, addIncome } from '../utils/storage';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import './TransactionForm.css';

const TransactionForm = ({ onSave }) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [success, setSuccess] = useState(false);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!amount || !category) {
      return;
    }

    const transaction = {
      type,
      amount: parseFloat(amount),
      description,
      category,
      date: new Date(date).toISOString()
    };

    if (type === 'expense') {
      addExpense(transaction);
    } else {
      addIncome(transaction);
    }

    setAmount('');
    setDescription('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setSuccess(true);
    
    setTimeout(() => {
      setSuccess(false);
      if (onSave) onSave();
    }, 1500);
  };

  return (
    <div className="transaction-form-container">
      <div className="form-card">
        <div className="type-selector">
          <button
            className={`type-btn ${type === 'expense' ? 'active' : ''}`}
            onClick={() => {
              setType('expense');
              setCategory('');
            }}
          >
            Expense
          </button>
          <button
            className={`type-btn ${type === 'income' ? 'active' : ''}`}
            onClick={() => {
              setType('income');
              setCategory('');
            }}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note..."
              rows="3"
            />
          </div>

          <button type="submit" className="submit-btn">
            Add {type === 'expense' ? 'Expense' : 'Income'}
          </button>

          {success && (
            <div className="success-message">
              ✓ {type === 'expense' ? 'Expense' : 'Income'} added successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;

