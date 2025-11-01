import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getWeeklyData, getMonthlyData, getYearlyData } from '../utils/storage';
import './AnalyticsChart.css';

const AnalyticsChart = ({ refreshKey }) => {
  const [period, setPeriod] = useState('weekly');
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadData();
  }, [period, refreshKey]);

  const loadData = () => {
    let chartData = [];
    let totalAmount = 0;

    switch (period) {
      case 'weekly':
        chartData = getWeeklyData();
        break;
      case 'monthly':
        chartData = getMonthlyData();
        break;
      case 'yearly':
        chartData = getYearlyData();
        break;
      default:
        chartData = getWeeklyData();
    }

    totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0);
    setData(chartData);
    setTotal(totalAmount);
  };

  const ChartComponent = period === 'yearly' ? BarChart : LineChart;
  const ChartLine = period === 'yearly' ? Bar : Line;

  return (
    <div className="analytics-chart-card">
      <div className="chart-header">
        <h2 className="chart-title">
          {period === 'weekly' && 'Weekly Expenses'}
          {period === 'monthly' && 'Monthly Expenses'}
          {period === 'yearly' && 'Yearly Expenses'}
        </h2>
        <div className="period-toggle">
          <button
            className={`toggle-btn ${period === 'weekly' ? 'active' : ''}`}
            onClick={() => setPeriod('weekly')}
          >
            Week
          </button>
          <button
            className={`toggle-btn ${period === 'monthly' ? 'active' : ''}`}
            onClick={() => setPeriod('monthly')}
          >
            Month
          </button>
          <button
            className={`toggle-btn ${period === 'yearly' ? 'active' : ''}`}
            onClick={() => setPeriod('yearly')}
          >
            Year
          </button>
        </div>
      </div>
      
      {total > 0 && (
        <div className="chart-total">
          <span className="total-label">Total:</span>
          <span className="total-amount">₹{total.toFixed(2)}</span>
        </div>
      )}

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              formatter={(value) => [`₹${value}`, 'Amount']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                padding: '0.5rem'
              }}
            />
            <ChartLine 
              type="monotone" 
              dataKey="amount" 
              stroke="#6366f1" 
              fill="#6366f1"
              strokeWidth={2}
              dot={{ fill: '#6366f1', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;

