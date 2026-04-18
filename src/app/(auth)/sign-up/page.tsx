import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata = {
  title: "Create account",
};

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-md border-border/60 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Start improving your typing speed in minutes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="ml-1 font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
