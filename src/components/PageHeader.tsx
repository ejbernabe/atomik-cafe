interface PageHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  className?: string; // Allows passing additional custom spacing/styles if needed
}

export default function PageHeader({
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