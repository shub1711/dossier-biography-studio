import { memo } from "react";
import { withSuspense } from "@/components/core/withSuspense";
import { Skeleton } from "@/components/core/Skeleton";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";

function LoginPage() {
  return (
    <AuthLayout mode="login">
      <LoginForm />
    </AuthLayout>
  );
}

export default withSuspense(memo(LoginPage), <Skeleton variant="auth" />);
