import React, { useState } from 'react';

export default function ChatInput({ onSend, disabled }) {
  const [mode, setMode] = useState('text'); // 'text' or 'file'
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (mode === 'text' && text.trim()) {
      onSend({ type: 'text', content: text.trim() });
      setText('');
    } else if (mode === 'file' && file) {
      setSending(true);
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        onSend({
          type: 'file',
          filedata: {
            name: file.name,
            buffer: arrayBuffer,
            mime: file.type
          }
        });
        setFile(null);
        setSending(false);
      };
      reader.onerror = () => {
        alert('Failed to read file');
        setSending(false);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    
  <div style={{ 
    borderTop: '1px solid #e0e0e0', 
    background: '#ffffff', 
    padding: '12px',
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    boxShadow: '0 -2px 8px rgba(0,0,0,0.05)'
  }}>
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 4px'
    }}>
      <button
        onClick={() => setMode(mode === 'text' ? 'file' : 'text')}
        style={{
          background: '#f5f5f5',
          color: '#333333',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '8px 16px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 500,
          transition: 'all 0.2s ease'
        }}
        type="button"
        disabled={disabled || sending}
      >
        {mode === 'text' ? 'File' : 'Text'}
      </button>
      {mode === 'text' ? (
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message"
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
          disabled={disabled || sending}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        />
      ) : (
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
          style={{ 
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            fontSize: '14px'
          }}
          disabled={disabled || sending}
        />
      )}
      <button
        onClick={handleSend}
        style={{
          background: '#2196f3',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 24px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 500,
          transition: 'background-color 0.2s ease'
        }}
        type="button"
        disabled={disabled || sending || (mode === 'text' ? !text.trim() : !file)}
      >
        {sending ? 'Sending...' : 'Send'}
      </button>
    </div>
  </div>
  );
}