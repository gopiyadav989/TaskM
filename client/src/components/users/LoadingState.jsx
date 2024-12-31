import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingState() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-6 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          <Skeleton className="h-10 w-[140px]" />
        </div>
        <div className="p-6">
          <div className="rounded-md border">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center p-4 border-b last:border-0">
                <div className="flex items-center gap-3 w-1/4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-24 mx-4" />
                <Skeleton className="h-4 w-32 mx-4" />
                <Skeleton className="h-6 w-20 mx-4 rounded-full" />
                <Skeleton className="h-8 w-20 mx-4 rounded-full" />
                <div className="flex gap-2 ml-auto">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}