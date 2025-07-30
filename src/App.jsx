import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Dashboard from './routes/Dashboard';
import Login from './routes/Login';
import CreateAccount from './routes/CreateAccount';
import VerifyEmail from './routes/VerifyEmail';
import ProtectedRoute from './routes/ProtectedRoute';
import Chat from './routes/sockets/Chat';
import ConnectChat from './routes/sockets/ConnectChat';
import Match from './routes/matchMakingPage/Match';

const App = () => {
  return (
      <Router>
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/verify-account/:uuid" element={<VerifyEmail />} />
          <Route path="/match" element={<ProtectedRoute component={Match} />} />
          <Route path="/chat" element={<ProtectedRoute component={Chat} />} />
          <Route path="/chat-to-connect/:uuid" element={<ProtectedRoute component={ConnectChat} />} />
          <Route path="/dashboard" />
          <Route path="/forgot-password" />
          <Route path="/change-password/:uuid" />
          <Route path="/profile/:id" />
        </Routes>
    </AuthProvider>
      </Router>
  );
};

export default App;