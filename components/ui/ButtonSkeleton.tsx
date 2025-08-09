// components/ButtonSkeleton.tsx
type ButtonSkeletonProps = {
  size?: 'sm' | 'md' | 'lg';
};

export function ButtonSkeleton({ size = 'md' }: ButtonSkeletonProps) {
  const dimensions = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32',
  };

  return (
    <div
      className={`w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${dimensions[size]}`}
    />
  );
}
