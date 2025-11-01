import './Header.css';

const Header = ({ activeTab, setActiveTab }) => {
  return (
    <header className="header">
      <h1 className="header-title">Expense Tracker</h1>
      <nav className="header-nav">
        <button
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Overview</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          <span className="nav-icon">➕</span>
          <span className="nav-label">Add</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          <span className="nav-icon">📋</span>
          <span className="nav-label">All</span>
        </button>
      </nav>
    </header>
  );
};

export default Header;

