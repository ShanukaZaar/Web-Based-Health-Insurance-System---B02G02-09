import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import api from '../../services/api';

const ApiStatusBadge = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkHealth = async () => {
      try {
        const res = await api.get('/health', { timeout: 4000 });
        if (isMounted) {
          // api.js response interceptor returns response.data directly
          const ok = Boolean(
            res && (res.success === true || res.data?.status === 'UP' || res.status === 200)
          );
          setIsOnline(ok);
        }
      } catch {
        try {
          // Fallback check on policies endpoint if health route differs
          const fallback = await api.get('/policies', { timeout: 3500 });
          if (isMounted) {
            setIsOnline(Boolean(fallback));
          }
        } catch {
          if (isMounted) {
            setIsOnline(false);
          }
        }
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <aside 
      aria-label="API System Status"
      className="fixed bottom-3 left-3 z-40 pointer-events-auto select-none"
    >
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-white/95 backdrop-blur-xs border shadow-xs transition-all duration-300 ${
          isOnline
            ? 'border-emerald-200 text-emerald-800 shadow-emerald-900/5'
            : 'border-amber-200 text-amber-800 shadow-amber-900/5'
        }`}
      >
        <span className="relative flex h-2 w-2">
          {isOnline ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          )}
        </span>
        <span className="flex items-center gap-1">
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3 text-emerald-600" />
              <span>API Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-amber-600" />
              <span>API Offline</span>
            </>
          )}
        </span>
      </div>
    </aside>
  );
};

export default ApiStatusBadge;
