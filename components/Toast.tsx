"use client";

/**
 * Toast.tsx — global notification, ported from the prototype's toast.js.
 *
 * Usage anywhere under <ToastProvider>:
 *   const { showToast } = useToast();
 *   showToast("Saved! ✓");
 *
 * Behaviour matches the prototype: a single toast, auto-hides after 2.8s,
 * and re-firing resets the timer so stacked calls don't fight.
 */

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

interface ToastContextValue {
  showToast: (message: string, durationMs?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string, durationMs = 2800) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(msg);
    setVisible(true);
    timerRef.current = setTimeout(() => setVisible(false), durationMs);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className={`toast ${visible ? "show" : ""}`}
        role="status"
        aria-live="polite"
      >
        {message}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}
