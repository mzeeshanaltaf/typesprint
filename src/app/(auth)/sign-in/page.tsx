import { Suspense } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <Card className="w-full max-w-md border-border/60 backdrop-blur supports-backdrop-filter:bg-card/80">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to track your progress and unlock lessons.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense>
          <SignInForm />
        </Suspense>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="ml-1 font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </CardFooter>
    </Card>
  );
}
