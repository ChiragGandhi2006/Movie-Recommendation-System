import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle,
  FiFilm,
} from "react-icons/fi";
import { signup } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Button from "../components/ui/Button";

function validate({ username, email, password, confirmPassword }) {
  const errors = {};
  if (!username.trim()) errors.username = "Username is required.";
  else if (username.trim().length < 3)
    errors.username = "Username must be at least 3 characters.";

  if (!email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Enter a valid email address.";

  if (!password) errors.password = "Password is required.";
  else if (password.length < 6)
    errors.password = "Password must be at least 6 characters.";

  if (confirmPassword !== password)
    errors.confirmPassword = "Passwords do not match.";

  return errors;
}

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

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
      await signup({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      await login(form.email.trim(), form.password);
      toast("Account created successfully", "success");
      setSuccess(true);
      setTimeout(() => navigate("/preferences"), 1000);
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (err.response?.status === 400) {
        setServerError(detail || "Email already registered.");
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
              "radial-gradient(ellipse 60% 50% at 80% 10%, rgba(59,130,246,0.15), transparent), radial-gradient(ellipse 60% 50% at 10% 85%, rgba(239,68,68,0.15), transparent)",
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

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-10 text-center"
            >
              <div className="mx-auto h-14 w-14 rounded-2xl bg-green-500/15 flex items-center justify-center text-green-400 text-3xl mb-5">
                <FiCheckCircle />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Account created!
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Taking you to the login page…
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 1 }}>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Join MovieVerse AI and start getting personalized picks.
              </p>

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
                    Username
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={form.username}
                      onChange={handleChange("username")}
                      placeholder="moviebuff23"
                      className={`w-full rounded-xl bg-white/5 border ${
                        errors.username ? "border-red-500/60" : "border-white/10"
                      } pl-11 pr-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/60 transition-all`}
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.username}</p>
                  )}
                </div>

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
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                    Password
                  </label>
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

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={handleChange("confirmPassword")}
                      placeholder="••••••••"
                      className={`w-full rounded-xl bg-white/5 border ${
                        errors.confirmPassword ? "border-red-500/60" : "border-white/10"
                      } pl-11 pr-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/60 transition-all`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" loading={loading}>
                  {loading ? "Creating account…" : "Sign Up"}
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary hover:text-white transition-colors">
                  Log in
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
