"use client";

/**
 * Modal.tsx — login / signup modals, ported from the prototype's Modal.js.
 *
 * Usage anywhere under <ModalProvider>:
 *   const { openModal } = useModal();
 *   openModal("signup");
 *
 * Phase 1 note: these forms are COSMETIC. Submitting just routes to the
 * dashboard and shows a toast. Real authentication is wired up in Phase 2
 * (Auth.js + server actions) — at which point only this file's submit
 * handler changes; everything that calls openModal() stays the same.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./Toast";

type ModalName = "login" | "signup";

interface ModalContextValue {
  openModal: (name: ModalName) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<ModalName | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const openModal = useCallback((name: ModalName) => setCurrent(name), []);
  const closeModal = useCallback(() => setCurrent(null), []);

  // Close on Escape while a modal is open.
  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current, closeModal]);

  const handleSubmit = useCallback(() => {
    const name = current;
    closeModal();
    router.push("/dashboard");
    showToast(
      name === "login"
        ? "✓ Logged in! Welcome back."
        : "🎉 Account created! Your 7-day trial has started.",
    );
  }, [current, closeModal, router, showToast]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <div
        className={`modal-overlay ${current ? "open" : ""}`}
        onClick={(e) => {
          // Click on the backdrop (not the modal itself) closes.
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        {current === "login" && (
          <LoginForm
            onSubmit={handleSubmit}
            onCancel={closeModal}
            onSwitch={() => setCurrent("signup")}
          />
        )}
        {current === "signup" && (
          <SignupForm
            onSubmit={handleSubmit}
            onCancel={closeModal}
            onSwitch={() => setCurrent("login")}
          />
        )}
      </div>
    </ModalContext.Provider>
  );
}

export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used within a <ModalProvider>");
  }
  return ctx;
}

// ── Modal bodies ─────────────────────────────────────────────────────

interface FormProps {
  onSubmit: () => void;
  onCancel: () => void;
  onSwitch: () => void;
}

function LoginForm({ onSubmit, onCancel, onSwitch }: FormProps) {
  return (
    <form
      className="modal"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h2>Welcome back</h2>
      <p>Log in to access your lessons and progress.</p>
      <div className="form-field">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          autoFocus
        />
      </div>
      <div className="form-field">
        <label htmlFor="login-pw">Password</label>
        <input
          id="login-pw"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>
      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          style={{ flex: 1, justifyContent: "center" }}
        >
          Log in
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <div
        style={{
          textAlign: "center",
          marginTop: 16,
          fontSize: 13,
          color: "var(--muted)",
        }}
      >
        Don&apos;t have an account?{" "}
        <a
          style={{ color: "var(--red)", cursor: "pointer" }}
          onClick={onSwitch}
        >
          Sign up free
        </a>
      </div>
    </form>
  );
}

function SignupForm({ onSubmit, onCancel, onSwitch }: FormProps) {
  return (
    <form
      className="modal"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h2>Start learning today</h2>
      <p>7-day free trial. No credit card needed.</p>
      <div className="form-field">
        <label htmlFor="signup-name">Your name</label>
        <input
          id="signup-name"
          type="text"
          placeholder="Yuki"
          autoComplete="name"
          autoFocus
        />
      </div>
      <div className="form-field">
        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>
      <div className="form-field">
        <label htmlFor="signup-pw">Password</label>
        <input
          id="signup-pw"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
        />
      </div>
      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-red"
          style={{ flex: 1, justifyContent: "center" }}
        >
          Start free trial
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <div
        style={{
          textAlign: "center",
          marginTop: 16,
          fontSize: 12,
          color: "var(--muted)",
        }}
      >
        By signing up you agree to our terms. Cancel anytime.{" "}
        <a style={{ color: "var(--red)", cursor: "pointer" }} onClick={onSwitch}>
          Log in instead
        </a>
      </div>
    </form>
  );
}
