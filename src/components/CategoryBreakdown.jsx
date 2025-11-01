import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getCategoryBreakdown } from '../utils/storage';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import './CategoryBreakdown.css';

const CategoryBreakdown = ({ refreshKey }) => {
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [activeTab, setActiveTab] = useState('expense');

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const loadData = () => {
    const expenses = getCategoryBreakdown('expense');
    const income = getCategoryBreakdown('income');
    
    setExpenseData(expenses);
    setIncomeData(income);
  };

  const getCategoryColor = (categoryName) => {
    const categories = activeTab === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    const category = categories.find(cat => cat.value === categoryName);
    return category ? category.color : '#64748b';
  };

  const getCategoryInfo = (categoryName) => {
    const categories = activeTab === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    return categories.find(cat => cat.value === categoryName);
  };

  const currentData = activeTab === 'expense' ? expenseData : incomeData;
  const total = currentData.reduce((sum, item) => sum + item.amount, 0);

  const chartData = currentData.slice(0, 6).map(item => ({
    name: getCategoryInfo(item.name)?.label || item.name,
    value: parseFloat(item.amount.toFixed(2)),
    color: getCategoryColor(item.name)
  }));

  const COLORS = chartData.map(item => item.color);

  if (currentData.length === 0) {
    return null;
  }

  return (
    <div className="category-breakdown-card">
      <div className="breakdown-header">
        <h2 className="breakdown-title">Category Breakdown</h2>
        <div className="breakdown-tabs">
          <button
            className={`tab-btn ${activeTab === 'expense' ? 'active' : ''}`}
            onClick={() => setActiveTab('expense')}
          >
            Expenses
          </button>
          <button
            className={`tab-btn ${activeTab === 'income' ? 'active' : ''}`}
            onClick={() => setActiveTab('income')}
          >
            Income
          </button>
        </div>
      </div>

      {total > 0 && (
        <div className="breakdown-total">
          Total: ₹{total.toFixed(2)}
        </div>
      )}

      {chartData.length > 0 ? (
        <div className="breakdown-content">
          <div className="breakdown-chart">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="breakdown-list">
            {currentData.slice(0, 5).map((item, index) => {
              const category = getCategoryInfo(item.name);
              const percentage = total > 0 ? ((item.amount / total) * 100).toFixed(1) : 0;
              
              return (
                <div key={item.name} className="breakdown-item">
                  <div className="breakdown-item-info">
                    <span className="breakdown-icon">{category?.icon || '📝'}</span>
                    <span className="breakdown-name">{category?.label || item.name}</span>
                  </div>
                  <div className="breakdown-item-amount">
                    <span className="breakdown-percentage">{percentage}%</span>
                    <span className="breakdown-value">₹{item.amount.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <p>No {activeTab} data available</p>
        </div>
      )}
    </div>
  );
};

export default CategoryBreakdown;

