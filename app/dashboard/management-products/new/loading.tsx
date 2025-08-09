import { Icon } from '@/components/icons/Icon';

export default function AddProductLoading() {
  return (
    <div className="flex min-h-screen flex-col p-4 md:p-6 animate-in fade-in-50 duration-500">
      {/* Enhanced Header Skeleton */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* BackButton Skeleton */}
          <div className="h-10 w-20 rounded-lg bg-muted animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-feature-products/20 animate-pulse" />
            <div className="h-7 w-32 rounded bg-muted animate-pulse" />
          </div>
        </div>
      </header>

      {/* Enhanced Form Container */}
      <div className="w-full max-w-7xl mx-auto px-4 space-y-8 animate-in fade-in-50 duration-700">
        <div className="space-y-6">
          {/* Basic Product Information Skeleton */}
          <div className="shadow-lg border-l-4 border-l-feature-products card-hover-effect rounded-lg bg-card">
            <div className="p-6 pb-4">
              <div className="flex items-center gap-2 mb-6">
                <Icon name="Package" className="h-5 w-5 text-feature-products/50 animate-pulse" />
                <div className="h-6 w-48 rounded bg-muted animate-pulse" />
              </div>
            </div>
            <div className="px-6 pb-6 bg-feature-products-soft/5">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Product Name Field */}
                <div className="space-y-2">
                  <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                  <div className="h-11 w-full rounded bg-muted animate-pulse" />
                </div>

                {/* Price Field */}
                <div className="space-y-2">
                  <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                  <div className="h-11 w-full rounded bg-muted animate-pulse" />
                </div>

                {/* Description Field */}
                <div className="col-span-1 md:col-span-2 xl:col-span-3 space-y-2">
                  <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-11 w-full rounded bg-muted animate-pulse" />
                </div>

                {/* Image Management Info */}
                <div className="col-span-1 md:col-span-2 xl:col-span-3">
                  <div className="p-4 bg-feature-products-soft/10 border border-feature-products/20 rounded-lg">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded bg-feature-products/30 animate-pulse" />
                        <div className="h-5 w-32 rounded bg-muted animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-full rounded bg-muted animate-pulse" />
                        <div className="h-4 w-4/5 rounded bg-muted animate-pulse" />
                        <div className="h-3 w-3/4 rounded bg-muted animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supplier Selection Skeleton */}
          <div className="shadow-lg border-l-4 border-l-feature-suppliers card-hover-effect rounded-lg bg-card">
            <div className="p-6 pb-4">
              <div className="flex items-center gap-2 mb-6">
                <Icon name="Building2" className="h-5 w-5 text-feature-suppliers/50 animate-pulse" />
                <div className="h-6 w-32 rounded bg-muted animate-pulse" />
              </div>
            </div>
            <div className="px-6 pb-6 bg-feature-suppliers-soft/5">
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
                </div>

                <div className="h-64 w-full border border-feature-suppliers/10 rounded-lg bg-feature-suppliers-soft/5 p-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 p-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="border rounded-lg p-3 bg-card animate-pulse">
                        <div className="flex items-center gap-3">
                          <div className="h-4 w-4 rounded-full bg-muted" />
                          <div className="h-4 flex-1 rounded bg-muted" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Selection Skeleton */}
          <div className="shadow-lg border-l-4 border-l-feature-products card-hover-effect rounded-lg bg-card">
            <div className="p-6 pb-4">
              <div className="flex items-center gap-2 mb-6">
                <Icon name="Tag" className="h-5 w-5 text-feature-products/50 animate-pulse" />
                <div className="h-6 w-32 rounded bg-muted animate-pulse" />
              </div>
            </div>
            <div className="px-6 pb-6 bg-feature-products-soft/5">
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="h-4 w-28 rounded bg-muted animate-pulse" />
                  <div className="h-6 w-24 rounded-full bg-muted animate-pulse" />
                </div>

                <div className="h-48 w-full border border-feature-products/10 rounded-lg bg-feature-products-soft/5 p-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 p-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="border rounded-lg p-3 bg-card animate-pulse">
                        <div className="flex items-center gap-3">
                          <div className="h-4 w-4 rounded bg-muted" />
                          <div className="h-4 flex-1 rounded bg-muted" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Settings Skeleton */}
          <div className="shadow-lg border-l-4 border-l-feature-settings card-hover-effect rounded-lg bg-card">
            <div className="p-6 pb-4">
              <div className="flex items-center gap-2 mb-6">
                <Icon name="Settings" className="h-5 w-5 text-feature-settings/50 animate-pulse" />
                <div className="h-6 w-32 rounded bg-muted animate-pulse" />
              </div>
            </div>
            <div className="px-6 pb-6 bg-feature-settings-soft/5">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                      <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                      <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons Skeleton */}
          <div className="flex justify-end gap-4 pt-6">
            <div className="h-10 w-20 rounded-lg bg-muted animate-pulse" />
            <div className="h-10 w-28 rounded-lg bg-feature-products/20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
