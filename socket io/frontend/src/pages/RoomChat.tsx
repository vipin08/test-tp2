import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

interface RoomChatProps {
  socket: Socket;
}

interface RoomMsg {
  from: string;
  message: string;
}

const RoomChat: React.FC<RoomChatProps> = ({ socket }) => {
  const [room, setRoom] = useState<string>('');
  const [currentRoom, setCurrentRoom] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [roomMessages, setRoomMessages] = useState<RoomMsg[]>([]);

  useEffect(() => {
    socket.on('receive_room_message', (data: RoomMsg) => {
      setRoomMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_room_message');
    };
  }, [socket]);

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room.trim()) return;

    socket.emit('join_room', room.trim());
    setCurrentRoom(room.trim());
    setRoomMessages([]);
  };

  const handleSendRoomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentRoom) return;

    socket.emit('send_room_message', {
      room: currentRoom,
      message: message.trim(),
    });
    setMessage('');
  };

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>Group Room Channels</h2>

      <form onSubmit={handleJoinRoom} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter room name (e.g., Gaming, Study)..."
          style={{ flexGrow: 1, padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Join Room
        </button>
      </form>

      {currentRoom && (
        <div>
          <div style={{ background: '#f1f5f9', padding: '8px 12px', borderRadius: '4px', marginBottom: '10px', borderLeft: '4px solid #3b82f6' }}>
            Active Session Channel: <strong>{currentRoom}</strong>
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', height: '200px', overflowY: 'auto', padding: '15px', background: '#f8fafc', marginBottom: '15px' }}>
            {roomMessages.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>No room activity broadcasted yet.</p>
            ) : (
              roomMessages.map((msg, idx) => (
                <div key={idx} style={{ margin: '6px 0', borderBottom: '1px dashed #e2e8f0', paddingBottom: '4px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>User: {msg.from}</span>
                  <span style={{ fontSize: '14px', color: '#0f172a' }}>{msg.message}</span>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendRoomMessage} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Send message to ${currentRoom}...`}
              style={{ flexGrow: 1, padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            />
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#1e293b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Broadcast
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RoomChat;