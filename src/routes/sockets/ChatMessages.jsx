
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
          background: isMe ? '#dcf8c6' : '#fff',
          color: '#222',
          borderRadius: 8,
          padding: 10,
          boxShadow: '0 1px 2px #0001',
          position: 'relative',
          wordBreak: 'break-word'
        };

        const DateBanner = () =>{
          return showDateBanner && (
              <div style={{
                textAlign: 'center',
                margin: '18px 0 10px 0',
                color: '#888',
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: 1,
                background: '#e1e1e1',
                borderRadius: 8,
                display: 'inline-block',
                padding: '2px 16px'
              }}>
                {msgDate}
              </div>
            );
        }

        if (msg.deleted) {
          return (
            <>
            <DateBanner key={idx} />
            <div key={idx} style={{ ...baseStyle, fontStyle: 'italic', color: '#888', background: '#f0f0f0' }}>
              This message is deleted
              <div style={{
                fontSize: 10, color: '#999', position: 'absolute', right: 8, bottom: 2
              }}>{formatTime(msg.timestamp)}</div>
            </div>
            </>
          );
        }
        if (msg.type === 'text') {
          return (
          <>
            <DateBanner key={idx} />
            <div key={idx} style={baseStyle}>
              {msg.content}
              <div style={{
                fontSize: 10, color: '#999', position: 'absolute', right: 8, bottom: 2
              }}>{formatTime(msg.timestamp)}</div>
            </div>
          </>
          );
        }
        if (msg.type === 'file') {
          return (<>
            <DateBanner key={idx} />
            <div key={idx} style={{ ...baseStyle, background: isMe ? '#e1f3fb' : '#f7f7f7' }}>
              <a
                href={msg.content}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}
              >
                <em>A certain .{getFileExtension(msg.content)} file shared</em>
              </a>
              <div style={{
                fontSize: 10, color: '#999', position: 'absolute', right: 8, bottom: 2
              }}>{formatTime(msg.timestamp)}</div>
            </div>
          </>
          );
        }
        return null;
      })}
      <div ref={bottomRef} />
    </>
  );
}