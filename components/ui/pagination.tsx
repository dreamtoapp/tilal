import * as React from 'react';
import { iconVariants } from '@/lib/utils';
import { Icon } from '@/components/icons/Icon';
import { ButtonProps, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role='navigation'
    aria-label='pagination'
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
  ),
);
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn('', className)} {...props} />,
);
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>;

const PaginationLink = ({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label='Go to previous page'
    size='default'
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <Icon name="ChevronLeft" size="xs" className={iconVariants({ size: 'xs' })} />
    <span>{children || 'السابق'}</span>
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label='Go to next page'
    size='default'
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>{children || 'التالي'}</span>
    <Icon name="ChevronRight" size="xs" className={iconVariants({ size: 'xs' })} />
  </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <Icon name="MoreHorizontal" size="xs" className={iconVariants({ size: 'xs' })} />
    <span className='sr-only'>More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

interface PaginationNavProps extends React.ComponentProps<typeof PaginationPrevious> {
  previousLabel?: string;
  nextLabel?: string;
}

const PaginationNav = ({ previousLabel, nextLabel, ...props }: PaginationNavProps) => {
  // Default to Arabic for all app, will support multi-language later
  const prev = previousLabel || 'السابق';
  const next = nextLabel || 'التالي';
  return (
    <>
      <PaginationPrevious aria-label={prev}>{prev}</PaginationPrevious>
      {props.children}
      <PaginationNext aria-label={next}>{next}</PaginationNext>
    </>
  );
};

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNav,
  PaginationNext,
  PaginationPrevious,
};
