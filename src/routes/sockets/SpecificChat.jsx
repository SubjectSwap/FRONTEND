import React, { useEffect, useState, useRef } from 'react';
import CircularProgress from '../../components/CircularProgress';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function SpecificChat({ socket, to, name, profilePic, setTo }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(true);
  const [showDisconnected, setShowDisconnected] = useState(false);
  const [archived, setArchived] = useState(false);
  const bottomRef = useRef(null);

  // Fetch previous chats
  useEffect(() => {
    if (!socket || !to) return;

    setLoading(true);
    socket.emit('previous_chats', { to });

    const handlePreviousChats = (data) => {
      setArchived(data.archived || false);
      setMessages(data.chats || []);
      setLoading(false);
      scrollToBottom();
      socket.emit('join_conversation', { to });
    };

    const handleMessageReceived = (msg) => {
      console.log('Message received:', msg);
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    };

    const handleDisconnect = () => {
      setWsConnected(false);
      setShowDisconnected(true);
    };

    socket.on('previous_chats', handlePreviousChats);
    socket.on('message_received', handleMessageReceived);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.emit('offline', { to });
      socket.off('previous_chats', handlePreviousChats);
      socket.off('message_received', handleMessageReceived);
      socket.off('disconnect', handleDisconnect);
    };
    // eslint-disable-next-line
  }, [socket, to]);

  const handleSend = (msg) => {
    socket.emit('message_sent', { to, ...msg });
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh', background: '#ece5dd'
    }}>
      {/* Modal for disconnect */}
      {showDisconnected && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px #0002'
          }}>
            <h2>Disconnected</h2>
            <p>WebSocket connection lost. Please refresh or try again later.</p>
          </div>
        </div>
      )}
      {/* Header */}
      <div style={{
        background: '#075e54', color: '#fff', padding: 16, fontWeight: 600, fontSize: 18, justifyContent: 'left', display: 'flex'
      }}>
        <button onClick={() => setTo(null)} style={{
          background: 'none', border: 'none', color: '#fff', fontSize: 18, marginRight: 12, cursor: 'pointer'
        }}>&larr;</button>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8
        }}>
          <img
            src={profilePic || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name)}
            alt={name}
            style={{ width: 36, height: 36, borderRadius: '50%', marginRight: 8, verticalAlign: 'middle' }}
          />
          {name}
        </div>
      </div>
      {/* Archiving */}
      {archived && (
        <div style={{
          background: '#f8d7da', color: '#721c24', padding: 12, textAlign: 'center',
          fontSize: 14, fontWeight: 500, borderBottom: '1px solid #f5c6cb'
        }}>
          Previous Conversations have been archived.
        </div>
      )}
      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column'
      }}>
        {loading
          ? <CircularProgress size={32} />
          : <ChatMessages messages={messages} bottomRef={bottomRef} />}
      </div>
      {/* Input */}
      <div style={{ borderTop: '1px solid #ddd', background: '#f7f7f7', padding: 8 }}>
        <ChatInput
          onSend={handleSend}
          disabled={!wsConnected}
        />
      </div>
    </div>
  );
}