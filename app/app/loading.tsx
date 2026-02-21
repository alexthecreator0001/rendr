export default function AppLoading() {
  return (
    <div className="flex h-full min-h-[60vh] items-center justify-center">
      <div className="relative h-6 w-6">
        <div className="absolute inset-0 rounded-full border-[1.5px] border-border" />
        <div className="absolute inset-0 animate-spin rounded-full border-[1.5px] border-transparent border-t-muted-foreground/60" />
      </div>
    </div>
  );
}
