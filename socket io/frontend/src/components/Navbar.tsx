import React from 'react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'private', label: 'Private Chat' },
    { id: 'room', label: 'Room Chat' },
  ];

  return (
    <nav style={{
      display: 'flex',
      backgroundColor: '#1e293b',
      padding: '10px 20px',
      justifyContent: 'center',
      gap: '15px'
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setCurrentTab(tab.id)}
          style={{
            padding: '8px 16px',
            backgroundColor: currentTab === tab.id ? '#3b82f6' : 'transparent',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default Navbar;