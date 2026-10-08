export default function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="text-4xl mb-3">⚠️</div>
      <h3 className="text-lg font-bold text-txt-primary mb-1">{title}</h3>
      {message && <p className="text-sm text-txt-muted max-w-sm mb-5">{message}</p>}
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">Try Again</button>
      )}
    </div>
  );
}