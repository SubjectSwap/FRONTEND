import React, { useEffect, useState } from 'react';
import CircularProgress from '../../components/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

function ListChats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Receive Previous Conversations
    let isMounted = true;
    setLoading(true);
    setError('');
    fetch(import.meta.env.VITE_BACKEND_URL + '/chat/previous_chats', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: localStorage.getItem('token')
      })
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
            navigate('/chat-to-connect/'+chat.convo_id);
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
      {/* Floating Action Button */}
      <button
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          backgroundColor: 'white',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          zIndex: 50,
          border: 'none',
          outline: 'none'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onClick={() => {
          navigate('/search')
        }}
      >
        <Plus size={24} color="#374151" />
      </button>
    </div>
  );
}

export default ListChats;