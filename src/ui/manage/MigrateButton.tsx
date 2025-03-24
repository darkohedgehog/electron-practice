import React, { useState } from 'react';
import { HardDriveUpload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

const MigrateButton: React.FC = () => {
  const { i18n } = useTranslation();
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
    <div className='flex items-center justify-center flex-col my-6'>
      <button 
        onClick={handleMigrate} 
        className="relative mb-20 inline-flex h-12 w-[200px] overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
             <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
             <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-accent dark:text-accentDark backdrop-blur-3xl gap-3">
             {t('migrationButton')}
            <HardDriveUpload className='w-5 h-5' />
            </span>
      </button>
      <div className='flex items-center justify-center mb-6 text-accent dark:text-accentDark'>
      {status && <p>{status}</p>}
      </div>
    </div>
  );
};

export default MigrateButton;
