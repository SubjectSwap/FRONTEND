import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import CircularProgress from '../../components/CircularProgress';
import { io } from 'socket.io-client';
import SpecificChat from './SpecificChat';
import ListChats from './ListChats';
import { generateKeyPair, exportPublicKey } from './cryptoUtils';

/**
 * File Depriciated  
 * i.e. might contain useful reusable code but  
 *  is directly no longer in use
 */
export default function Chat() {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [to, setTo] = useState(null);
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [error, setError] = useState('');
  const [keyPair, setKeyPair] = useState(null);
  const [publicKeyB64, setPublicKeyB64] = useState('');

  useEffect(() => {
    if (!user) return;

    setLoading(true);
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

    socketInstance.on('connect', () => {
      setSocket(socketInstance);
      setLoading(false);
    });

    socketInstance.on('connect_error', (err) => {
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
    to ? (
      <SpecificChat
        name={name}
        profilePic={profilePic}
        socket={socket}
        to={to}
        setTo={setTo}
        keyPair={keyPair}
        publicKeyB64={publicKeyB64}
        needSetTo={true}
      />
    ) : (
      <ListChats setName={setName} setProfilePic={setProfilePic} setTo={setTo} />
    )
  );
}
