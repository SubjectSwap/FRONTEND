import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import CircularProgress from '../../components/CircularProgress';
import { io } from 'socket.io-client';
import SpecificChat from './SpecificChat';
import ListChats from './ListChats';
import { generateKeyPair, exportPublicKey } from './cryptoUtils';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

export default function ConnectChat() {
  const { user } = useAuth();
  const {uuid} = useParams();
  if (!uuid || uuid.trim() == '') return <Navigate to="/" replace={true} />;
  const [to, setTo] = useState(uuid);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyPair, setKeyPair] = useState(null);
  const [publicKeyB64, setPublicKeyB64] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    console.log('Connecting to socket.io server...');
    setError('');

    // Get JWT cookie value
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return '';
    };
    const token = getCookie('SubjectSwapLoginJWT');

    // Connect to socket.io server with cookie/token
    const socketInstance = io(import.meta.env.VITE_BACKEND_URL + '/private_chat', {
      transports: ['websocket'],
      auth: { token },
      withCredentials: true,
      reconnectionAttempts: 3,
    });

    socketInstance.on('connect', async () => {
      setSocket(socketInstance);
      console.log('connected');
      setLoading(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
      setError('An Error Occurred');
      setLoading(false);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  useEffect(() => {
    generateKeyPair().then(async kp => {
      setKeyPair(kp);
      setPublicKeyB64(await exportPublicKey(kp.publicKey));
    });
  }, []);

  if (loading) return <CircularProgress size={32} />;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
      <SpecificChat
        socket={socket}
        to={to}
        keyPair={keyPair}
        publicKeyB64={publicKeyB64}
      />
    );
}