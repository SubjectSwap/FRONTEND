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
  return /\.(txt|csv|md|json)$/i.test(url);
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
          marginBottom: 10,
          alignSelf: isMe ? 'flex-end' : 'flex-start',
          background: isMe ? '#988bf8ff' : '#fff',
          color: '#222',
          borderRadius: 8,
          padding: 10,
          paddingBottom: 20,
          boxShadow: '0 1px 2px #0001',
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
                  margin: '18px 0 10px 0',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: 1,
                  background: '#080cfbff',
                  borderRadius: 8,
                  display: 'inline-block',
                  padding: '2px 16px'
                }}
              >
                {msgDate}
              </div>
            )}
            {msg.deleted ? (
              <div key={`msg-${messageKey}`} style={{ ...baseStyle, fontStyle: 'italic', color: '#888', background: '#f0f0f0' }}>
                This message is deleted
              </div>
            ) : msg.type === 'text' ? (
              <div key={`msg-${messageKey}`} style={{ ...baseStyle, paddingBottom: 20 }}>
                {msg.content}
                <div style={{
                  fontSize: 10, color: msg.byMe ? 'purple' : '#999', position: 'absolute', right: 8, bottom: 2
                }}>{formatTime(msg.timestamp)}</div>
              </div>
            ) : msg.type === 'file' ? (
              <div key={`msg-${messageKey}`} style={{ ...baseStyle, background: isMe ? '#a7e5ffff' : '#f0ffeaff' }}>
                <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, background: '#f8f8f8', borderRadius: 6, overflow: 'hidden' }}>
                  {isImage(msg.content) ? (
                    <a href={msg.content} target="_blank" rel="noopener noreferrer">
                      <img
                        src={msg.content}
                        alt="preview"
                        style={{ maxHeight: 140, maxWidth: 180, display: 'block', objectFit: 'contain' }}
                      />
                    </a>
                  ) : isPDF(msg.content) ? (
                    <a href={msg.content} target="_blank" rel="noopener noreferrer" style={{ width: '100%', textAlign: 'center' }}>
                      <embed
                        src={msg.content}
                        type="application/pdf"
                        width="100%"
                        height="120"
                        style={{ maxWidth: 180, border: 'none', background: '#fff' }}
                      />
                      <div style={{ fontSize: 13, color: '#1976d2', marginTop: 4 }}>Preview PDF</div>
                    </a>
                  ) : isTextFile(msg.content) ? (
                    <a href={msg.content} target="_blank" rel="noopener noreferrer" style={{ width: '100%', textAlign: 'center' }}>
                      <embed
                        src={msg.content}
                        type="text/plain"
                        width="100%"
                        height="120"
                        style={{ maxWidth: 180, border: 'none', background: '#fff' }}
                      />
                      <div style={{ fontSize: 13, color: '#1976d2', marginTop: 4 }}>Preview Text</div>
                    </a>
                  ) : (
                    <div style={{ color: '#888', fontSize: 13, textAlign: 'center', width: '100%' }}>
                      No preview available
                    </div>
                  )}
                </div>
                <a
                  href={msg.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}
                >
                  <em>A certain .{getFileExtension(msg.content)} file shared</em>
                </a>
                <div style={{
                  fontSize: 10, color: msg.byMe ? 'black' : '#999', position: 'absolute', right: 8, bottom: 2
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