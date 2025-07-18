import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import CircularProgress from '../components/CircularProgress';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const [localLoading, setLocalLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLocalLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.message) {
        setError(err.message);
      }
      else setError('Failed to Log In');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className='app-container'>
      <h1>Login</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">    
            {localLoading && (
                  <span style={{ marginRight: '8px' }}>
                    <CircularProgress size={16} color='white' />
                  </span>
            )}
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;