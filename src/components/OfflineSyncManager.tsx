import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store';
import { translate } from '../utils/translate';
import { Wifi, WifiOff, CloudLightning, ShieldAlert } from 'lucide-react';

export const OfflineSyncManager: React.FC = () => {
  const { isOffline, isSyncing, setOfflineStatus, language } = useGameStore();

  useEffect(() => {
    const handleOnline = () => setOfflineStatus(false);
    const handleOffline = () => setOfflineStatus(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline && !isSyncing) return null;

  return (
    <div className="fixed bottom-3 left-3 z-50 flex items-center gap-2 bg-black border border-white px-3 py-2 text-xs font-mono animate-fade-in shadow-lg">
      {isOffline ? (
        <div className="flex items-center gap-2 text-white">
          <WifiOff size={14} className="animate-pulse" />
          <span>{translate('offlineMode', language)}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-white">
          <CloudLightning size={14} className="animate-sync-pulse text-white" />
          <span>PUSHING LOCAL DATA...</span>
        </div>
      )}
    </div>
  );
};
export default OfflineSyncManager;
