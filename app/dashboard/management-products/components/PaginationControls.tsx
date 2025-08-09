import Link from '@/components/link';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';

interface PaginationControlsProps {
  page: number;
  pageSize: number;
  total: number;
}



export default function PaginationControls({
  page,
  pageSize,
  total,
}: PaginationControlsProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  // Generate page numbers for RTL (descending order)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = totalPages; i >= 1; i--) pages.push(i);
    } else {
      if (page >= totalPages - 3) {
        pages.push(
          totalPages,
          totalPages - 1,
          totalPages - 2,
          totalPages - 3,
          totalPages - 4,
          '...',
          1,
        );
      } else if (page <= 4) {
        pages.push(totalPages, '...', 5, 4, 3, 2, 1);
      } else {
        pages.push(totalPages, '...', page + 1, page, page - 1, '...', 1);
      }
    }
    return pages;
  };

  // Helper to build URL with correct page param
  const getPageHref = (targetPage: number) => {
    // On the server, we don't have window.location, so we use the current URL from process.env or fallback
    // We'll use a relative URL with only the page param for simplicity
    return `?page=${targetPage}`;
  };

  return (
    <Pagination dir='rtl'>
      <PaginationContent>
        <PaginationItem>
          <Link
            href={getPageHref(page < totalPages ? page + 1 : totalPages)}
            aria-disabled={page >= totalPages}
            className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
          >
            التالي &larr;
          </Link>
        </PaginationItem>
        {getPageNumbers().map((p, idx) =>
          typeof p === 'number' ? (
            <PaginationItem key={p}>
              <PaginationLink
                href={getPageHref(p)}
                isActive={p === page}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={'ellipsis-' + idx}>
              <PaginationEllipsis />
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <Link
            href={getPageHref(page > 1 ? page - 1 : 1)}
            aria-disabled={page <= 1}
            className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
          >
            &rarr; السابق
          </Link>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
