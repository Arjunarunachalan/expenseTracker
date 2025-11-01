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

