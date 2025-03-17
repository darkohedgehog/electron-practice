import React, { useState } from 'react';

const MigrateButton: React.FC = () => {
  const [status, setStatus] = useState<string>('');

  const handleMigrate = async () => {
    setStatus('Migracija u toku...');
    try {
      const result = await window.api.migrateBooks();
      if (result.success) {
        setStatus('Migracija uspešno završena!');
      } else {
        setStatus(`Greška: ${result.message}`);
      }
    } catch (error) {
      setStatus('Došlo je do neočekivane greške.');
    }
  };

  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <button 
        onClick={handleMigrate} 
        style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
      >
        Pokreni migraciju
      </button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default MigrateButton;
