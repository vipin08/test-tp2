import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PrivateChat from './pages/PrivateChat';
import RoomChat from './pages/RoomChat';

const socket: Socket = io('http://localhost:5000');

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    socket.on('notification', (msg: string) => {
      setNotifications((prev) => [msg, ...prev].slice(0, 5));
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f7fb', minHeight: '100vh' }}>
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      {notifications.length > 0 && (
        <div style={{ margin: '15px max(10px, 10%)', padding: '10px', background: '#e3f2fd', borderLeft: '5px solid #2196f3', borderRadius: '4px' }}>
          <strong>System Log:</strong> {notifications[0]}
        </div>
      )}

      <main style={{ padding: '20px max(10px, 10%)' }}>
        {currentTab === 'home' && <Home socket={socket} />}
        {currentTab === 'private' && <PrivateChat socket={socket} />}
        {currentTab === 'room' && <RoomChat socket={socket} />}
      </main>
    </div>
  );
};

export default App;