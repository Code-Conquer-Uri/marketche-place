export default function Loading() {
  return (
    <div
      aria-busy="true"
      className="min-h-screen flex items-center justify-center p-12 bg-gray-50 dark:bg-gray-900"
    >
      <div className="flex items-center justify-center">
        <svg
          aria-hidden="true"
          className="w-12 h-12 text-gray-300 animate-spin"
          viewBox="0 0 50 50"
          fill="none"
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="5"
            className="opacity-25"
          />
          <path
            d="M45 25a20 20 0 00-20-20"
            stroke="currentColor"
            strokeWidth="5"
            className="opacity-75"
            strokeLinecap="round"
          />
        </svg>
        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
}
