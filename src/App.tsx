import React from 'react';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './modules/dashboard';

// Import Page Builder styles
import './modules/pageBuilder/styles/pageBuilder.css';

function App() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

export default App;