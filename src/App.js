import React from 'react';
import LedgerDashboard from './components/LedgerDashboard';
import './App.css';

/**
 * The main application component.
 * Renders the `LedgerDashboard` which contains the core application UI.
 * 
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  return (
    <div className="App">
      <LedgerDashboard />
    </div>
  );
}

export default App;