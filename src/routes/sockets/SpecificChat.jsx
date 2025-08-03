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
      display: 'flex', flexDirection: 'column', background: loading || '#f0e6feff', minHeight: '100vh'
    }}>
      {/* Modal for disconnect */}
      {showDisconnected && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(255, 255, 255, 0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px #0002'
          }}>
            <h2>Disconnected</h2>
            <p>WebSocket connection lost. Please refresh or try again later.</p>
          </div>
        </div>
      )}
      {/* Between sending of messages */}
      {isAMessageBeingSent && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(255, 255, 255, 0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <CircularProgress />
        </div>
      )}
      {/* Archiving */}
      {archived && (
        <div style={{
          background: '#cbeafdff', color: '#721c24', padding: 12, textAlign: 'center',
          fontSize: 14, fontWeight: 500, borderBottom: '1px solid #f5c6cb'
        }}>
          Previous Conversations have been archived.
        </div>
      )}
      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', marginBottom: 10,
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