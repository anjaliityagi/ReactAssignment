type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className }: SkeletonProps) {
  return <div className={`rounded-md bg-[var(--skeleton-bg)] ${className}`} />;
}
