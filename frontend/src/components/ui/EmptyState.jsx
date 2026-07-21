import { motion } from "framer-motion";

export default function EmptyState({
  icon: Icon,
  title = "Nothing here yet",
  description,
  action,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl border border-white/5 bg-surface/50"
    >
      {Icon && (
        <div className="mb-5 h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl text-primary">
          <Icon />
        </div>
      )}
      <h3 className="text-lg md:text-xl font-semibold text-white">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-slate-400">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
