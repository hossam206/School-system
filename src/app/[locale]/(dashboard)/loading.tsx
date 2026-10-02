export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      aria-busy="true"
    >
      <div className="relative" aria-hidden="true">
        {/* Outer ring */}
        <div className="h-12 w-12 rounded-full border-4 border-muted"></div>
        {/* Spinning ring */}
        <div className="absolute top-0 left-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
      </div>
    </div>
  );
}
