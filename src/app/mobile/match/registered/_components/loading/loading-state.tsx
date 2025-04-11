export function LoadingState() {
  return (
    <div className="flex h-screen items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <span className="ml-2">로딩중...</span>
    </div>
  );
}
