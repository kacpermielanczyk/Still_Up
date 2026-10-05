type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  onChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  ).filter(
    (value) =>
      value === 1 || value === totalPages || Math.abs(value - page) <= 1,
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="cursor-pointer rounded-xl border border-border bg-input px-3 py-2 text-sm 
        font-semibold text-text-secondary transition-all hover:bg-input-hover 
        hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      {pages.map((value, index) => {
        const previous = pages[index - 1];
        const showGap = previous !== undefined && value - previous > 1;

        return (
          <div key={value} className="flex items-center gap-2">
            {showGap && <span className="text-text-muted">…</span>}

            <button
              type="button"
              onClick={() => onChange(value)}
              className={`
                size-9 cursor-pointer rounded-xl border text-sm font-semibold transition-all
                ${
                  value === page
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-input text-text-secondary hover:bg-input-hover hover:text-foreground"
                }
              `}
            >
              {value}
            </button>
          </div>
        );
      })}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="cursor-pointer rounded-xl border border-border 
        bg-input px-3 py-2 text-sm font-semibold text-text-secondary transition-all 
        hover:bg-input-hover hover:text-foreground disabled:cursor-not-allowed 
        disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
