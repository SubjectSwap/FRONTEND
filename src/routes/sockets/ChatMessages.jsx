function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function getFileExtension(fileurl) {
  return fileurl.split('.').pop().split(/\#|\?/)[0];
}

function isImage(url) {
  return /\.(jpe?g|png|gif|bmp|webp)$/i.test(url);
}
function isPDF(url) {
  return /\.pdf$/i.test(url);
}

function isTextFile(url) {
  return /\.(txt)$/i.test(url);
}

import React from "react";

export default function ChatMessages({ messages, bottomRef }) {
  let lastDate = null;
  return (
    <>
      {messages.map((msg, idx) => {
        const msgDate = formatDate(msg.timestamp);
        const showDateBanner = msgDate !== lastDate;
        lastDate = msgDate;

        const isMe = msg.byMe;
        const baseStyle = {
          maxWidth: '70%',
          minWidth: 100,
          marginBottom: 12,
          alignSelf: isMe ? 'flex-end' : 'flex-start',
          background: isMe ? '#e3f2fd' : '#ffffff',
          color: '#333333',
          borderRadius: 12,
          padding: '12px 16px',
          paddingBottom: 28,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          position: 'relative',
          wordBreak: 'break-word'
        };

        const messageKey = msg._id || msg.timestamp || idx;

        return (
          <React.Fragment key={messageKey}>
            {showDateBanner && (
              <div
                key={`date-${msgDate}-${idx}`}
                style={{
                  textAlign: 'center',
                  margin: '20px 0 12px 0',
                  color: '#666666',
                  fontSize: 13,
                  fontWeight: 500,
                  background: '#f5f5f5',
                  borderRadius: 20,
                  display: 'inline-block',
                  padding: '4px 20px',
                  alignSelf: 'center',
                  width: 'auto'
                }}
              >
                {msgDate}
              </div>
            )}

            {msg.deleted ? (
              <div key={`msg-${messageKey}`} style={{ 
                ...baseStyle, 
                fontStyle: 'italic', 
                color: '#999999', 
                background: '#f5f5f5',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}>
                This message is deleted
              </div>
            ) : msg.type === 'text' ? (
              <div key={`msg-${messageKey}`} style={{ ...baseStyle, paddingBottom: 28 }}>
                {msg.content}
                <div style={{
                  fontSize: 11, 
                  color: isMe ? '#666666' : '#999999', 
                  position: 'absolute', 
                  right: 12, 
                  bottom: 8
                }}>{formatTime(msg.timestamp)}</div>
              </div>
            ) : msg.type === 'file' ? (
              <div key={`msg-${messageKey}`} style={{ 
                ...baseStyle, 
                background: isMe ? '#e8f5e9' : '#f5f5f5',
                padding: '16px'
              }}>
                <div style={{ 
                  height: 160, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginBottom: 12, 
                  background: '#ffffff',
                  borderRadius: 8,
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  {isImage(msg.content) ? (
                    <a href={msg.content} target="_blank" rel="noopener noreferrer">
                      <img
                        src={msg.content}
                        alt="preview"
                        style={{ 
                          maxHeight: 160, 
                          maxWidth: 200, 
                          display: 'block', 
                          objectFit: 'contain',
                          borderRadius: 4
                        }}
                      />
                    </a>
                  ) : isPDF(msg.content) ? (
                    <a href={msg.content} target="_blank" rel="noopener noreferrer" style={{ width: '100%', textAlign: 'center' }}>
                      <embed
                        src={msg.content}
                        type="application/pdf"
                        width="100%"
                        height="140"
                        style={{ maxWidth: 200, border: 'none', background: '#fff', borderRadius: 4 }}
                      />
                      <div style={{ fontSize: 13, color: '#1976d2', marginTop: 6, fontWeight: 500 }}>Preview PDF</div>
                    </a>
                  ) : isTextFile(msg.content) ? (
                    <a href={msg.content} target="_blank" rel="noopener noreferrer" style={{ width: '100%', textAlign: 'center' }}>
                      <embed
                        src={msg.content}
                        type="text/plain"
                        width="100%"
                        height="140"
                        style={{ maxWidth: 200, border: 'none', background: '#fff', borderRadius: 4 }}
                      />
                      <div style={{ fontSize: 13, color: '#1976d2', marginTop: 6, fontWeight: 500 }}>Preview Text</div>
                    </a>
                  ) : (
                    <div style={{ color: '#999999', fontSize: 13, textAlign: 'center', width: '100%', padding: '20px' }}>
                      No preview available
                    </div>
                  )}
                </div>
                <a
                  href={msg.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#1976d2', 
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: 14,
                    display: 'block',
                    textAlign: 'center',
                    padding: '8px 0'
                  }}
                >
                  A certain .{getFileExtension(msg.content)} file shared
                </a>
                <div style={{
                  fontSize: 11, 
                  color: isMe ? '#666666' : '#999999', 
                  position: 'absolute', 
                  right: 12, 
                  bottom: 8
                }}>{formatTime(msg.timestamp)}</div>
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      <div ref={bottomRef} />
    </>
  );
}