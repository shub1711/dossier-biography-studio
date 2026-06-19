import { withSuspense } from "@/components/core/withSuspense";
import { Skeleton } from "@/components/core/Skeleton";
import { BiographyPageClient } from "@/features/biography/components/BiographyPageClient";

export default withSuspense(BiographyPageClient, <Skeleton variant="page" />);
