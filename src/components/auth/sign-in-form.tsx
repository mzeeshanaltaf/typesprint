"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/auth/google-icon";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [pendingGoogle, setPendingGoogle] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: callbackUrl,
    });
    setPending(false);
    if (error) {
      toast.error(error.message ?? "Could not sign in.");
      return;
    }
    toast.success("Welcome back!");
    router.push(callbackUrl);
    router.refresh();
  }

  async function onGoogle() {
    setPendingGoogle(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: callbackUrl,
    });
    setPendingGoogle(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <Button
        type="button"
        variant="outline"
        onClick={onGoogle}
        disabled={pendingGoogle}
        className="w-full"
      >
        {pendingGoogle ? (
          <Loader2 className="animate-spin" data-icon="inline-start" />
        ) : (
          <GoogleIcon data-icon="inline-start" />
        )}
        Continue with Google
      </Button>

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs uppercase tracking-wider text-muted-foreground">
          or
        </span>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? (
            <Loader2 className="animate-spin" data-icon="inline-start" />
          ) : null}
          Sign in
        </Button>
      </form>
    </div>
  );
}
