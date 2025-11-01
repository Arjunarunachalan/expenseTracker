import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getWeeklyData } from '../utils/storage';
import './WeeklyChart.css';

const WeeklyChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const weekly = getWeeklyData();
    setData(weekly);
  }, []);

  return (
    <div className="weekly-chart-card">
      <h2 className="chart-title">Weekly Expenses</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
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
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#6366f1" 
              strokeWidth={2}
              dot={{ fill: '#6366f1', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyChart;

