import React from 'react';
import { useAuth } from '../context/AuthProvider';
import Match from './matchMakingPage/Match';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <Match />
      <br />
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;