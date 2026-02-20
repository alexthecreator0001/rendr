export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-border" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
        </div>
        <img
          src="/logo.svg"
          alt="Rendr"
          className="h-4 w-auto opacity-20 dark:invert animate-pulse"
        />
      </div>
    </div>
  );
}
