import { useEffect, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';

function Counter() {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('[Counter] Component mounted');
    setMounted(true);
    return () => console.log('[Counter] Component unmounted');
  }, []);

  if (!mounted) {
    console.log('[Counter] Not mounted yet, returning null');
    return null;
  }

  console.log('[Counter] Rendering with count:', count);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[Counter] Click handler called, current count:', count);
    setCount(prev => {
      console.log('[Counter] Updating count from', prev, 'to', prev + 1);
      return prev + 1;
    });
  };

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px', 
        padding: '20px', 
        background: 'white', 
        border: '2px solid #4CAF50', 
        zIndex: 9999,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        minWidth: '200px'
      }}
      onClick={e => e.stopPropagation()}
    >
      <div style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>Count: {count}</div>
      <button 
        onClick={handleClick}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#4CAF50', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%',
          fontWeight: 'bold'
        }}
      >
        Increment ({count})
      </button>
      <div style={{ fontSize: '12px', color: '#666', marginTop: '10px', textAlign: 'center' }}>
        Last rendered: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}

export function ClientCounter() {
  return (
    <ClientOnly fallback={<div>Loading counter...</div>}>
      {() => <Counter />}
    </ClientOnly>
  );
} 