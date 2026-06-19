import { memo } from "react";
import { withSuspense } from "@/components/core/withSuspense";
import { Skeleton } from "@/components/core/Skeleton";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { SignupForm } from "@/features/auth/components/SignupForm";

function SignupPage() {
  return (
    <AuthLayout mode="signup">
      <SignupForm />
    </AuthLayout>
  );
}

export default withSuspense(memo(SignupPage), <Skeleton variant="auth" />);
