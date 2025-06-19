import React, { useState, useEffect } from 'react';
import ItemService from '../../api/itemService';

const ApiDebugger = () => {
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ItemService.getUserItems();
        setRawData(response);
      } catch (error) {
        console.error('Debug: Error fetching data:', error);
        setRawData({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading debug data...</div>;

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      backgroundColor: 'rgba(0,0,0,0.9)', 
      color: 'white', 
      padding: '20px', 
      overflow: 'auto', 
      zIndex: 9999,
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      <h2>API Debug Information</h2>
      <button 
        onClick={() => window.location.reload()} 
        style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          padding: '10px', 
          background: 'red', 
          color: 'white', 
          border: 'none', 
          cursor: 'pointer' 
        }}
      >
        Close & Reload
      </button>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {JSON.stringify(rawData, null, 2)}
      </pre>
    </div>
  );
};

export default ApiDebugger;
