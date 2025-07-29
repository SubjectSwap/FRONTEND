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
  const [to, setTo] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [error, setError] = useState('');
  const [keyPair, setKeyPair] = useState(null);
  const [publicKeyB64, setPublicKeyB64] = useState('');

  async function fetchExtraData() {
    await fetch(import.meta.env.VITE_BACKEND_URL + '/chat/get_user_info', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uuid }),
    })
      .then((response) => response.json())
      .then((data) => {
        setName(data.name);
        setProfilePic(data.profilePic);
        setTo(uuid);
      });
  }

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

    socketInstance.on('connect', async () => {
      setSocket(socketInstance);
      try{
        await fetchExtraData();
      } catch(e) {
        setError('An Error Occurred');
      } finally{
        setLoading(false);
      }
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
      <SpecificChat
        name={name}
        profilePic={profilePic}
        socket={socket}
        to={to}
        setTo={setTo}
        keyPair={keyPair}
        publicKeyB64={publicKeyB64}
        needSetTo={false}
      />
    );
}