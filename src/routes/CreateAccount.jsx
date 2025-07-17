import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const CreateAccount = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [info, setInfo] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo('');
    if (!email || !password || !name) {
      setError('All fields are required.');
      return;
    }
    try {
      const resp = await register(name, email, password);
      if (resp.message = 'Verification email sent') setInfo(`Check your email! You have ${resp.time_left} minutes to verify.`);
      // Optionally navigate or wait for verification
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='app-container'>
      <h2>Create Account</h2>
      {error && <p className="error-message">{error}</p>}
      {info && <p>{info}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default CreateAccount;