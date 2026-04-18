"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { setUserRole } from "@/app/admin/actions";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
  createdAt: string;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function UsersManager({
  users,
  currentUserId,
}: {
  users: UserRow[];
  currentUserId: string;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="w-40 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((u) => (
          <TableRow key={u.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  {u.image ? <AvatarImage src={u.image} alt={u.name} /> : null}
                  <AvatarFallback>{initials(u.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{u.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {u.email}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                {u.role}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(u.createdAt)}
            </TableCell>
            <TableCell className="text-right">
              <RoleToggle
                userId={u.id}
                role={u.role === "admin" ? "admin" : "user"}
                disabled={u.id === currentUserId && u.role === "admin"}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function RoleToggle({
  userId,
  role,
  disabled,
}: {
  userId: string;
  role: "user" | "admin";
  disabled: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const nextRole: "user" | "admin" = role === "admin" ? "user" : "admin";

  return (
    <Button
      variant={role === "admin" ? "outline" : "default"}
      size="sm"
      disabled={disabled || isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await setUserRole(userId, nextRole);
          if (result.ok) {
            toast.success(
              nextRole === "admin" ? "Promoted to admin" : "Demoted to user",
            );
          } else {
            toast.error(result.error);
          }
        });
      }}
    >
      {isPending
        ? "Saving..."
        : role === "admin"
          ? "Demote to user"
          : "Promote to admin"}
    </Button>
  );
}
