import React from 'react';
import { useAuth } from '../context/AuthProvider';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      {JSON.stringify(user.user)}
      <br />
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;