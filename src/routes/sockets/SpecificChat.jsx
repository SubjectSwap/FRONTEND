import React, { useEffect, useState, useRef } from 'react';
import CircularProgress from '../../components/CircularProgress';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { importPublicKey, decryptWithPrivateKey, encryptWithPublicKey } from './cryptoUtils';
import { useNavigate } from 'react-router-dom';

export default function SpecificChat({ socket, to, keyPair, publicKeyB64 }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(true);
  const [showDisconnected, setShowDisconnected] = useState(false);
  const [archived, setArchived] = useState(false);
  const [serverPublicKey, setServerPublicKey] = useState(null);
  const [isAMessageBeingSent, setIsAMessageBeingSent] = useState(false);
  const bottomRef = useRef(null);

  // Fetch previous chats
  useEffect(() => {
    if (!socket || !to || !keyPair || !publicKeyB64) return;
    setLoading(true);
    socket.emit('join_conversation', { to, publicKey: publicKeyB64 });
    console.log("Emitted here");
    socket.emit('previous_chats', { to });

    const handlePreviousChats = async (data) => {
      console.log("Previous chats received")
      setArchived(data.archived || false);
      // Import server public key
      if (data.server_public_key) {
        const imported = await importPublicKey(data.server_public_key);
        setServerPublicKey(imported);
      }
      // Decrypt all messages
      const decryptedChats = await Promise.all(
        (data.chats || []).map(async msg => {
          if (msg.content) {
            try {
              msg.content = await decryptWithPrivateKey(keyPair.privateKey, msg.content);
            } catch (e) {
              console.log('Decryption failed for message:', e);
              msg.content = '[Decryption failed]';
            }
          }
          return msg;
        })
      );
      setMessages(decryptedChats);
      setLoading(false);
      scrollToBottom();
    };

    const handleMessageReceived = async (msg) => {
      if(msg.byMe) setIsAMessageBeingSent(false);
      if (msg.content) {
        try {
          msg.content = await decryptWithPrivateKey(keyPair.privateKey, msg.content);
        } catch {
          msg.content = '[Decryption failed]';
        }
      }
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    };

    const handleDisconnect = () => {
      setWsConnected(false);
      setShowDisconnected(true);
    };

    socket.on('cantConnectWithSelf', () =>{
      navigate('/chat');
    })
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
  }, [socket, to, publicKeyB64]);

  const handleSend = async (msg) => {
    if (isAMessageBeingSent) return;
    if (msg.type === 'text' && serverPublicKey) {
      msg.content = await encryptWithPublicKey(serverPublicKey, msg.content);
    }
    socket.emit('message_sent', { to, ...msg });
    setIsAMessageBeingSent(true);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff',
      minHeight: '100vh',
      boxShadow: '0 0 20px rgba(0,0,0,0.05)'
    }}>
      {/* Modal for disconnect */}
      {showDisconnected && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(255, 255, 255, 0.9)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h2>Disconnected</h2>
            <p>WebSocket connection lost. Please refresh or try again later.</p>
          </div>
        </div>
      )}
      {/* Between sending of messages */}
      {isAMessageBeingSent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CircularProgress />
        </div>
      )}
      {/* Archiving */}
      {archived && (
        <div style={{
          background: '#e3f2fd',
          color: '#1565c0',
          padding: '1rem',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 500,
          borderBottom: '1px solid #bbdefb'
        }}>
          Previous Conversations have been archived.
        </div>
      )}
      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '4rem',
        background: '#fafafa'
      }}>
        {loading
          ? <CircularProgress size={32} />
          : <ChatMessages messages={messages} bottomRef={bottomRef} />}
      </div>
      {/* Input */}
        <ChatInput
          onSend={handleSend}
          disabled={!wsConnected || isAMessageBeingSent}
        />
    </div>
  );
}