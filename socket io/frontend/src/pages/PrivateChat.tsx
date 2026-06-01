import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

interface PrivateChatProps {
  socket: Socket;
}

interface MessageLog {
  senderId: string;
  text: string;
  type: 'incoming' | 'outgoing';
}

const PrivateChat: React.FC<PrivateChatProps> = ({ socket }) => {
  const [receiverId, setReceiverId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [chatLog, setChatLog] = useState<MessageLog[]>([]);

  useEffect(() => {
    socket.on('receive_private_message', (data: { from: string; message: string }) => {
      setChatLog((prev) => [...prev, { senderId: data.from, text: data.message, type: 'incoming' }]);
    });

    return () => {
      socket.off('receive_private_message');
    };
  }, [socket]);

  const handleSendPrivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverId.trim() || !message.trim()) return;

    socket.emit('send_private_message', {
      to: receiverId.trim(),
      message: message.trim(),
    });

    setChatLog((prev) => [...prev, { senderId: 'You', text: message, type: 'outgoing' }]);
    setMessage('');
  };

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>Private Secure Chat</h2>
      
      <form onSubmit={handleSendPrivate} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Receiver Socket ID:</label>
          <input 
            type="text" 
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            placeholder="Paste target Socket ID here..."
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Message:</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your private message..."
              style={{ flexGrow: 1, padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            />
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Send
            </button>
          </div>
        </div>
      </form>

      <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', height: '250px', overflowY: 'auto', padding: '15px', background: '#f8fafc' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#475569' }}>Conversation History</h4>
        {chatLog.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>No direct messages yet.</p>
        ) : (
          chatLog.map((chat, idx) => (
            <div key={idx} style={{ textAlign: chat.type === 'outgoing' ? 'right' : 'left', margin: '8px 0' }}>
              <span style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: '12px',
                background: chat.type === 'outgoing' ? '#10b981' : '#e2e8f0',
                color: chat.type === 'outgoing' ? '#ffffff' : '#0f172a',
                fontSize: '14px',
                maxWidth: '75%',
                wordBreak: 'break-word'
              }}>
                <small style={{ display: 'block', fontSize: '10px', opacity: 0.8 }}>{chat.senderId}</small>
                {chat.text}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PrivateChat;