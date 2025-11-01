const STORAGE_KEYS = {
  EXPENSES: 'expenses',
  INCOME: 'income'
};

export const getExpenses = () => {
  const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
  return data ? JSON.parse(data) : [];
};

export const saveExpenses = (expenses) => {
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
};

export const getIncome = () => {
  const data = localStorage.getItem(STORAGE_KEYS.INCOME);
  return data ? JSON.parse(data) : [];
};

export const saveIncome = (income) => {
  localStorage.setItem(STORAGE_KEYS.INCOME, JSON.stringify(income));
};

export const addExpense = (expense) => {
  const expenses = getExpenses();
  const newExpense = {
    ...expense,
    id: Date.now().toString(),
    date: expense.date || new Date().toISOString()
  };
  expenses.push(newExpense);
  saveExpenses(expenses);
  return newExpense;
};

export const addIncome = (income) => {
  const incomeList = getIncome();
  const newIncome = {
    ...income,
    id: Date.now().toString(),
    date: income.date || new Date().toISOString()
  };
  incomeList.push(newIncome);
  saveIncome(incomeList);
  return newIncome;
};

export const deleteExpense = (id) => {
  const expenses = getExpenses();
  const filtered = expenses.filter(exp => exp.id !== id);
  saveExpenses(filtered);
};

export const deleteIncome = (id) => {
  const incomeList = getIncome();
  const filtered = incomeList.filter(inc => inc.id !== id);
  saveIncome(filtered);
};

export const getMonthlyCashInHand = () => {
  const expenses = getExpenses();
  const income = getIncome();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthlyIncome = income
    .filter(inc => {
      const date = new Date(inc.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, inc) => sum + parseFloat(inc.amount || 0), 0);
  
  const monthlyExpenses = expenses
    .filter(exp => {
      const date = new Date(exp.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  
  return {
    income: monthlyIncome,
    expenses: monthlyExpenses,
    cashInHand: monthlyIncome - monthlyExpenses
  };
};

export const getWeeklyData = () => {
  const expenses = getExpenses();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const weeklyExpenses = expenses.filter(exp => {
    const date = new Date(exp.date);
    return date >= weekAgo && date <= now;
  });
  
  const dailyData = {};
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dailyData[dateStr] = 0;
  }
  
  weeklyExpenses.forEach(exp => {
    const date = new Date(exp.date);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (dailyData.hasOwnProperty(dateStr)) {
      dailyData[dateStr] += parseFloat(exp.amount || 0);
    }
  });
  
  return Object.entries(dailyData).map(([name, value]) => ({
    name,
    amount: parseFloat(value.toFixed(2))
  }));
};

export const getMonthlyData = () => {
  const expenses = getExpenses();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const monthlyExpenses = expenses.filter(exp => {
    const date = new Date(exp.date);
    return date >= startOfMonth && date <= endOfMonth;
  });
  
  const weeklyData = {};
  const weeksInMonth = Math.ceil((endOfMonth.getDate() + startOfMonth.getDay()) / 7);
  
  for (let week = 0; week < weeksInMonth; week++) {
    const weekStart = new Date(startOfMonth);
    weekStart.setDate(startOfMonth.getDate() + (week * 7) - startOfMonth.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const weekLabel = `Week ${week + 1}`;
    weeklyData[weekLabel] = 0;
    
    monthlyExpenses.forEach(exp => {
      const date = new Date(exp.date);
      if (date >= weekStart && date <= weekEnd) {
        weeklyData[weekLabel] += parseFloat(exp.amount || 0);
      }
    });
  }
  
  return Object.entries(weeklyData).map(([name, value]) => ({
    name,
    amount: parseFloat(value.toFixed(2))
  }));
};

export const getYearlyData = () => {
  const expenses = getExpenses();
  const now = new Date();
  const currentYear = now.getFullYear();
  
  const yearlyExpenses = expenses.filter(exp => {
    const date = new Date(exp.date);
    return date.getFullYear() === currentYear;
  });
  
  const monthlyData = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  monthNames.forEach((month, index) => {
    monthlyData[month] = 0;
    
    yearlyExpenses.forEach(exp => {
      const date = new Date(exp.date);
      if (date.getMonth() === index) {
        monthlyData[month] += parseFloat(exp.amount || 0);
      }
    });
  });
  
  return Object.entries(monthlyData).map(([name, value]) => ({
    name,
    amount: parseFloat(value.toFixed(2))
  }));
};

export const getCategoryBreakdown = (type = 'expense') => {
  const data = type === 'expense' ? getExpenses() : getIncome();
  const categories = {};
  
  data.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = 0;
    }
    categories[item.category] += parseFloat(item.amount || 0);
  });
  
  return Object.entries(categories).map(([name, value]) => ({
    name,
    amount: parseFloat(value.toFixed(2))
  })).sort((a, b) => b.amount - a.amount);
};

