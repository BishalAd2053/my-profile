export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-neutral-800 rounded ${className}`} style={{ minHeight: 48 }} />
  )
}

