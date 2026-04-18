import { desc } from "drizzle-orm";

import { Card, CardContent } from "@/components/ui/card";
import { UsersManager } from "@/components/admin/users-manager";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

export default async function AdminUsersPage() {
  const session = await requireAdmin();
  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      image: user.image,
    })
    .from(user)
    .orderBy(desc(user.createdAt));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
        <p className="text-sm text-muted-foreground">
          Promote or demote users. You cannot remove your own admin role.
        </p>
      </div>
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-6">
          <UsersManager
            users={rows.map((u) => ({
              ...u,
              createdAt: u.createdAt.toISOString(),
            }))}
            currentUserId={session.user.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
