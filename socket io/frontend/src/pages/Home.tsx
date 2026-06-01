import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface HomeProps {
  socket: Socket;
}

const Home: React.FC<HomeProps> = ({ socket }) => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [socketId, setSocketId] = useState<string>('');

  useEffect(() => {
    setSocketId(socket.id || 'Connecting...');

    socket.on('user_count_update', (count: number) => {
      setTotalUsers(count);
    });

    socket.on('connect', () => {
      setSocketId(socket.id || '');
    });

    return () => {
      socket.off('user_count_update');
    };
  }, [socket]);

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>Welcome to the Real-Time Hub</h2>
      <hr style={{ border: '0.5px solid #eee' }} />
      
      <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          height: '12px',
          width: '12px',
          backgroundColor: '#10b981',
          borderRadius: '50%',
          display: 'inline-block'
        }}></span>
        <span style={{ fontSize: '16px', fontWeight: '500' }}>Status: Online</span>
      </div>

      <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
        <p style={{ margin: '0 0 5px 0', color: '#64748b' }}>Your Communication Reference address:</p>
        <strong style={{ fontSize: '18px', color: '#0f172a', wordBreak: 'break-all' }}>{socketId}</strong>
      </div>

      <div style={{ background: '#eff6ff', padding: '20px', borderRadius: '6px', borderLeft: '4px solid #3b82f6' }}>
        <h3 style={{ margin: '0 0 5px 0', color: '#1e40af' }}>Connected Users Counter</h3>
        <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#1d4ed8' }}>{totalUsers}</p>
      </div>
    </div>
  );
};

export default Home;