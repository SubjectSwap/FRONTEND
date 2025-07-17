import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Dashboard from './routes/Dashboard';
import Login from './routes/Login';
import CreateAccount from './routes/CreateAccount';
import VerifyEmail from './routes/VerifyEmail';
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {
  return (
      <Router>
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/verify-email/:uuid" element={<VerifyEmail />} />
          <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
        </Routes>
    </AuthProvider>
    
      </Router>
  );
};

export default App;