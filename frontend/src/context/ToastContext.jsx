import { createContext, useContext, useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

const ToastContext = createContext(null);
const icons = { success: FiCheckCircle, error: FiAlertCircle, info: FiInfo };
const styles = { success: "border-emerald-400/30 text-emerald-200", error: "border-red-400/30 text-red-200", info: "border-accent/30 text-slate-100" };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 3600);
  }, []);
  return <ToastContext.Provider value={toast}>{children}<div className="fixed right-4 top-20 z-[70] w-[min(24rem,calc(100vw-2rem))] space-y-3"><AnimatePresence>{toasts.map((item) => { const Icon = icons[item.type]; return <motion.div key={item.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className={`glass flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl ${styles[item.type]}`}><Icon className="shrink-0 text-lg" /><p className="flex-1 text-sm font-medium">{item.message}</p><button onClick={() => setToasts((current) => current.filter((toastItem) => toastItem.id !== item.id))} aria-label="Dismiss notification"><FiX /></button></motion.div>; })}</AnimatePresence></div></ToastContext.Provider>;
}
export function useToast() { const toast = useContext(ToastContext); if (!toast) throw new Error("useToast must be used within ToastProvider"); return toast; }
