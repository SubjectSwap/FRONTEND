import React, { useEffect, useState } from 'react';
import CircularProgress from '../../components/CircularProgress';

function ListChats({ setName, setProfilePic, setTo }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');
    fetch(import.meta.env.VITE_BACKEND_URL + '/chat/previous_chats', {
      method: 'POST',
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch chats');
        return res.json();
      })
      .then(data => {
        if (isMounted) {
          setChats(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError('Could not load chats');
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  if (loading) return <CircularProgress size={32} />;
  if (error) return <div style={{ color: 'red', padding: 16 }}>{error}</div>;

  return (
    <div style={{
      background: '#fff',
      borderRadius: 8,
      margin: 16,
      boxShadow: '0 2px 8px #0001',
      overflow: 'hidden'
    }}>
      {chats.length === 0 && (
        <div style={{ padding: 24, color: '#888', textAlign: 'center' }}>No chats yet.</div>
      )}
      {chats.map(chat => (
        <div
          key={chat.convo_id}
          onClick={() => {
            setName(chat.name);
            setProfilePic(chat.profilePic);
            setTo(chat.convo_id)
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid #f0f0f0',
            cursor: 'pointer',
            background: '#fff',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#f6f6f6'}
          onMouseOut={e => e.currentTarget.style.background = '#fff'}
        >
          <img
            src={chat.profilePic || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(chat.name)}
            alt={chat.name}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              marginRight: 16,
              objectFit: 'cover',
              border: '1px solid #eee'
            }}
          />
          <span style={{ fontWeight: 500, fontSize: 16 }}>{chat.name}</span>
        </div>
      ))}
    </div>
  );
}

export default ListChats;