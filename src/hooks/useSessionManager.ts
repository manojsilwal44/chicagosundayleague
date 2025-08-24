import { useState, useEffect, useCallback, useRef } from 'react';

interface SessionManagerOptions {
  sessionTimeout: number; // 15 minutes in milliseconds
  warningTimeout: number; // 60 seconds warning
  onSessionExpired: () => void;
  onShowWarning: () => void;
}

export const useSessionManager = (options: SessionManagerOptions) => {
  const [isWarningShown, setIsWarningShown] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetSession = useCallback(() => {
    // Clear existing timers
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }

    // Reset activity timestamp
    lastActivityRef.current = Date.now();
    setIsWarningShown(false);
    setTimeRemaining(0);

    // Set session timeout
    sessionTimerRef.current = setTimeout(() => {
      options.onSessionExpired();
    }, options.sessionTimeout);

    // Set warning timeout (15 minutes - 60 seconds)
    warningTimerRef.current = setTimeout(() => {
      setIsWarningShown(true);
      setTimeRemaining(options.warningTimeout / 1000);
      options.onShowWarning();
    }, options.sessionTimeout - options.warningTimeout);
  }, [options]);

  const extendSession = useCallback(() => {
    resetSession();
  }, [resetSession]);

  const logout = useCallback(() => {
    // Clear timers
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    
    setIsWarningShown(false);
    setTimeRemaining(0);
    options.onSessionExpired();
  }, [options]);

  const handleUserActivity = useCallback(() => {
    if (!isWarningShown) {
      resetSession();
    }
  }, [isWarningShown, resetSession]);

  // Countdown timer for warning
  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;
    
    if (isWarningShown && timeRemaining > 0) {
      countdownTimer = setTimeout(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            logout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownTimer) {
        clearTimeout(countdownTimer);
      }
    };
  }, [isWarningShown, timeRemaining, logout]);

  // Set up activity listeners
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      handleUserActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initial session setup
    resetSession();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (sessionTimerRef.current) {
        clearTimeout(sessionTimerRef.current);
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
    };
  }, [handleUserActivity, resetSession]);

  return {
    isWarningShown,
    timeRemaining,
    extendSession,
    logout,
    resetSession
  };
};
