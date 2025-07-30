import React from 'react';
import { useAuth } from '../context/AuthProvider';
import Match from './matchMakingPage/Match';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <p>Welcome to your dashboard!</p>
      <Match />
    </div>
  );
};

export default Dashboard;