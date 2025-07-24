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
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        onClick={() => setMode(mode === 'text' ? 'file' : 'text')}
        style={{
          background: '#075e54', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer'
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
            flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc'
          }}
          disabled={disabled || sending}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        />
      ) : (
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
          style={{ flex: 1 }}
          disabled={disabled || sending}
        />
      )}
      <button
        onClick={handleSend}
        style={{
          background: '#25d366', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer'
        }}
        type="button"
        disabled={disabled || sending || (mode === 'text' ? !text.trim() : !file)}
      >
        {sending ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}