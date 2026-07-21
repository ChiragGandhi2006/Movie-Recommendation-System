import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiFilm } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import { useToast } from "../context/ToastContext";

function validate({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Password is required.";
  return errors;
}

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const sessionExpired = new URLSearchParams(location.search).get("session") === "expired";
  const from = location.state?.from?.pathname || "/home";

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setServerError(null);
    try {
      const profile = await login(form.email.trim(), form.password, rememberMe);
      toast("Login successful", "success");
      navigate(profile.preferences?.length ? from : "/preferences", { replace: true });
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (err.response?.status === 401) {
        setServerError(detail || "Invalid email or password.");
      } else if (err.code === "ERR_NETWORK") {
        setServerError("Can't reach MovieVerse servers. Is the backend running?");
      } else {
        setServerError(detail || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-5 py-16 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 50% at 20% 10%, rgba(239,68,68,0.15), transparent), radial-gradient(ellipse 60% 50% at 90% 80%, rgba(59,130,246,0.15), transparent)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl glass p-8 md:p-10 shadow-2xl shadow-black/40"
      >
        <div className="flex items-center gap-2 mb-8">
          <span className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary text-xl">
            <FiFilm />
          </span>
          <span className="font-display text-2xl tracking-wide text-white">
            MovieVerse <span className="text-primary">AI</span>
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-400">
          Log in to get recommendations tuned to your taste.
        </p>

        {sessionExpired && (
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-gold/10 border border-gold/30 px-4 py-3 text-sm text-gold">
            <FiAlertCircle /> Your session expired. Please log in again.
          </div>
        )}

        <AnimatePresence>
          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400 overflow-hidden"
            >
              <FiAlertCircle className="shrink-0" /> {serverError}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="you@example.com"
                className={`w-full rounded-xl bg-white/5 border ${
                  errors.email ? "border-red-500/60" : "border-white/10"
                } pl-11 pr-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/60 transition-all`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-xs font-medium text-accent hover:text-white transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange("password")}
                placeholder="••••••••"
                className={`w-full rounded-xl bg-white/5 border ${
                  errors.password ? "border-red-500/60" : "border-white/10"
                } pl-11 pr-11 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/60 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          <label className="flex items-center gap-2.5 text-sm text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 accent-primary"
            />
            Remember me on this device
          </label>

          <Button type="submit" className="w-full" loading={loading}>
            {loading ? "Logging in…" : "Login"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-primary hover:text-white transition-colors">
            Sign up
          </Link>
        </p>
      </motion.div>

      <AnimatePresence>
        {showForgot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-5"
            onClick={() => setShowForgot(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl glass p-7 text-center"
            >
              <div className="mx-auto h-12 w-12 rounded-xl bg-accent/15 flex items-center justify-center text-accent text-xl mb-4">
                <FiMail />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Password recovery is coming soon
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                This backend doesn't expose a password-reset endpoint yet.
                Reach out to your administrator, or create a new account for now.
              </p>
              <Button
                variant="ghost"
                className="mt-6 w-full"
                onClick={() => setShowForgot(false)}
              >
                Got it
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
