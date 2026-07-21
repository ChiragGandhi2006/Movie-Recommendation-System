import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiCheckCircle, FiFilm, FiMail } from "react-icons/fi";
import Button from "../components/ui/Button";

const emailIsValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) return setError("Email is required.");
    if (!emailIsValid(email)) return setError("Enter a valid email address.");
    setError("");
    setSent(true);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-5 py-16 overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ backgroundImage: "radial-gradient(ellipse 60% 50% at 20% 10%, rgba(239,68,68,0.15), transparent), radial-gradient(ellipse 60% 50% at 90% 80%, rgba(59,130,246,0.15), transparent)" }} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md rounded-3xl glass p-8 md:p-10 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-2 mb-8">
          <span className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary text-xl"><FiFilm /></span>
          <span className="font-display text-2xl tracking-wide text-white">MovieVerse <span className="text-primary">AI</span></span>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-4 text-center">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 text-3xl mb-5"><FiCheckCircle /></div>
              <h1 className="text-2xl font-bold text-white">Check your inbox</h1>
              <p className="mt-3 text-sm leading-6 text-slate-400">If an account is registered with <span className="text-slate-200">{email}</span>, we’ll send password recovery instructions to it.</p>
              <p className="mt-3 text-xs leading-5 text-slate-500">Didn’t receive an email? Check your spam folder or try again shortly.</p>
              <Link to="/login" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-white transition-colors"><FiArrowLeft /> Back to login</Link>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"><FiArrowLeft /> Back to login</Link>
              <h1 className="mt-6 text-2xl md:text-3xl font-bold text-white">Forgot your password?</h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">Enter the email you use for MovieVerse AI. We’ll send you recovery instructions.</p>
              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Email</label>
                  <div className="relative"><FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input autoFocus type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} placeholder="you@example.com" className={`w-full rounded-xl bg-white/5 border ${error ? "border-red-500/60" : "border-white/10"} pl-11 pr-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/60 transition-all`} /></div>
                  {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
                </div>
                <Button type="submit" className="w-full">Send recovery instructions</Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
