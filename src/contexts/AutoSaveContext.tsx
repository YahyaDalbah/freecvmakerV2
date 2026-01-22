import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AutoSaveContextType {
  status: AutoSaveStatus;
  startSaving: () => void;
  finishSaving: (hasError?: boolean) => void;
}

const AutoSaveContext = createContext<AutoSaveContextType | undefined>(undefined);

export function AutoSaveProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  const savedTimeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startSaving = useCallback(() => {
    // Clear any existing "saved" timeout
    if (savedTimeoutIdRef.current) {
      clearTimeout(savedTimeoutIdRef.current);
      savedTimeoutIdRef.current = null;
    }
    setStatus('saving');
  }, []);

  const finishSaving = useCallback((hasError: boolean = false) => {
    if (hasError) {
      setStatus('error');
      // Hide error message after 3 seconds
      const timeoutId = setTimeout(() => {
        setStatus('idle');
      }, 3000);
      savedTimeoutIdRef.current = timeoutId;
    } else {
      setStatus('saved');
      // Hide "saved" message after 2 seconds
      const timeoutId = setTimeout(() => {
        setStatus('idle');
      }, 2000);
      savedTimeoutIdRef.current = timeoutId;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (savedTimeoutIdRef.current) {
        clearTimeout(savedTimeoutIdRef.current);
      }
    };
  }, []);

  return (
    <AutoSaveContext.Provider value={{ status, startSaving, finishSaving }}>
      {children}
    </AutoSaveContext.Provider>
  );
}

export function useAutoSave() {
  const context = useContext(AutoSaveContext);
  if (context === undefined) {
    throw new Error('useAutoSave must be used within an AutoSaveProvider');
  }
  return context;
}

