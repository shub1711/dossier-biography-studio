import { Suspense, memo } from "react";
import type { ComponentType, ReactNode } from "react";

export function withSuspense<P extends object>(
  Component: ComponentType<P>,
  fallback: ReactNode
): ComponentType<P> {
  const Wrapped = memo(function WithSuspense(props: P) {
    return (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    );
  });

  Wrapped.displayName = `withSuspense(${Component.displayName ?? Component.name ?? "Component"})`;

  return Wrapped as ComponentType<P>;
}
