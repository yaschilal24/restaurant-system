export default function Button({
  children, variant = 'primary', className = '', loading = false, disabled, type = 'button', ...props
}) {
  const variants = {
    primary: 'btn-primary', secondary: 'btn-secondary', ghost: 'btn-ghost',
    danger: 'inline-flex items-center justify-center bg-danger/10 hover:bg-danger/20 text-danger font-semibold rounded-xl px-5 py-2.5 border border-danger/30 transition-all active:scale-[0.98]',
    success: 'inline-flex items-center justify-center bg-success/10 hover:bg-success/20 text-success font-semibold rounded-xl px-5 py-2.5 border border-success/30 transition-all active:scale-[0.98]',
  };
  return (
    <button
      type={type}
      className={`${variants[variant] || variants.primary} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />}
      {children}
    </button>
  );
}