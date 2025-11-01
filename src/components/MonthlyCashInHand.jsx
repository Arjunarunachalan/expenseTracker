import { useState, useEffect } from 'react';
import { getMonthlyCashInHand } from '../utils/storage';
import './MonthlyCashInHand.css';

const MonthlyCashInHand = () => {
  const [data, setData] = useState({ income: 0, expenses: 0, cashInHand: 0 });

  useEffect(() => {
    const monthly = getMonthlyCashInHand();
    setData(monthly);
  }, []);

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const isNegative = data.cashInHand < 0;

  return (
    <div className="cash-in-hand-card">
      <div className="cash-header">
        <h2>Cash in Hand</h2>
        <span className="month-label">{currentMonth}</span>
      </div>
      <div className={`cash-amount ${isNegative ? 'negative' : ''}`}>
        <span className="currency">{isNegative ? '-$' : '$'}</span>
        <span className="amount">{Math.abs(data.cashInHand).toFixed(2)}</span>
      </div>
      <div className="cash-breakdown">
        <div className="breakdown-item income">
          <span className="label">Income</span>
          <span className="value">+${data.income.toFixed(2)}</span>
        </div>
        <div className="breakdown-item expense">
          <span className="label">Expenses</span>
          <span className="value">-${data.expenses.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyCashInHand;

