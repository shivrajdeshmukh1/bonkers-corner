export default function ProductGridSkeleton({ n = 8 }: { n?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="card">
          <div className="aspect-[3/4] skeleton" />
          <div className="p-3 space-y-2"><div className="h-4 w-3/4 skeleton" /><div className="h-4 w-1/3 skeleton" /></div>
        </div>
      ))}
    </div>
  );
}
