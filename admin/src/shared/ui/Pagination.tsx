interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-30"
      >
        이전
      </button>
      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            1
          </button>
          {start > 2 && <span className="px-1 text-gray-400">...</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            p === page
              ? 'bg-[#5B5CF9] text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-gray-400">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-30"
      >
        다음
      </button>
    </div>
  );
}
