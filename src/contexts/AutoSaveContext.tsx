import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

type AutoSaveStatus = 'idle' | 'saving' | 'saved';

interface AutoSaveContextType {
  status: AutoSaveStatus;
  startSaving: () => void;
  finishSaving: () => void;
}

const AutoSaveContext = createContext<AutoSaveContextType | undefined>(undefined);

export function AutoSaveProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  const [savedTimeoutId, setSavedTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const startSaving = useCallback(() => {
    // Clear any existing "saved" timeout
    if (savedTimeoutId) {
      clearTimeout(savedTimeoutId);
      setSavedTimeoutId(null);
    }
    setStatus('saving');
  }, [savedTimeoutId]);

  const finishSaving = useCallback(() => {
    setStatus('saved');
    
    // Hide "saved" message after 2 seconds
    const timeoutId = setTimeout(() => {
      setStatus('idle');
    }, 2000);
    
    setSavedTimeoutId(timeoutId);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (savedTimeoutId) {
        clearTimeout(savedTimeoutId);
      }
    };
  }, [savedTimeoutId]);

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

