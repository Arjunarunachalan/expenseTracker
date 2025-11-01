import { useState } from 'react';
import Header from './components/Header';
import MonthlyCashInHand from './components/MonthlyCashInHand';
import AnalyticsChart from './components/AnalyticsChart';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import CategoryBreakdown from './components/CategoryBreakdown';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        {activeTab === 'overview' && (
          <div className="overview-container">
            <MonthlyCashInHand key={`cash-${refreshKey}`} />
            <AnalyticsChart key={`chart-${refreshKey}`} refreshKey={refreshKey} />
            <CategoryBreakdown key={`category-${refreshKey}`} refreshKey={refreshKey} />
            <TransactionTable 
              key={`table-${refreshKey}`} 
              onDelete={refresh}
              limit={5}
            />
          </div>
        )}
        
        {activeTab === 'add' && (
          <TransactionForm onSave={refresh} />
        )}
        
        {activeTab === 'transactions' && (
          <TransactionTable 
            key={`table-full-${refreshKey}`} 
            onDelete={refresh}
            showSeparateSections={true}
          />
        )}
      </main>
    </div>
  );
}

export default App;

