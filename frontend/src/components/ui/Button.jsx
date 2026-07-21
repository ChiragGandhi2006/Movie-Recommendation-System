import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-dark",
  accent:
    "bg-accent text-white shadow-lg shadow-accent/30 hover:brightness-110",
  ghost:
    "bg-white/5 text-white border border-white/15 hover:bg-white/10 backdrop-blur",
  outline:
    "bg-transparent text-white border border-primary hover:bg-primary/10",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm md:text-base",
  lg: "px-8 py-4 text-base md:text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  as = "button",
  loading = false,
  disabled = false,
  icon: Icon,
  ...props
}) {
  const Component = motion[as] || motion.button;

  return (
    <Component
      whileHover={{ scale: disabled || loading ? 1 : 1.03 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-wide transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
      ) : (
        Icon && <Icon className="text-lg" />
      )}
      {children}
    </Component>
  );
}
