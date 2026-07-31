// ERROR MESSAGE
interface ToastErrorProps {
  message: string;
}

export const ToastError = ({ message }: ToastErrorProps) => {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-red-500 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg border border-red-500/30">
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
    </div>
  )
}

// LOADING
interface LoadingMessageProps {
  message: string;
}

export const LoadingMessage = ({ message }: LoadingMessageProps) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-bg-base text-white">
      <p className="animate-pulse text-zinc-400 text-2xl">
        {message} <span className="loading loading-dots loading-xl"></span>
      </p>
    </div>
  )
}


// PAGE HEADER
interface PageHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  className?: string; // Allows passing additional custom spacing/styles if needed
}

export function PageHeader({
  badge,
  title,
  description,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`text-center mb-10 ${className}`}>
      {/* Render badge only if provided */}
      {badge && (
        <span className="inline-block text-xs font-bold text-badge-text uppercase tracking-widest bg-badge px-3.5 py-1 rounded-full shadow-sm">
          {badge}
        </span>
      )}

      <h1 className="text-3xl font-black text-text-heading mt-3 sm:text-4xl tracking-tight">
        {title}
      </h1>

      {/* Render description only if provided */}
      {description && (
        <p className="text-text-muted font-medium text-sm mt-2 max-w-md mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}