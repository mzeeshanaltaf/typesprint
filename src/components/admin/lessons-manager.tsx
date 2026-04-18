"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createLesson,
  deleteLesson,
  updateLesson,
} from "@/app/admin/actions";

type LessonRow = {
  id: string;
  level: string;
  category: string;
  title: string;
  content: string;
  orderIndex: number;
};

const LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const CATEGORIES = [
  { value: "home_row", label: "Home row" },
  { value: "numbers", label: "Numbers" },
  { value: "symbols", label: "Symbols" },
  { value: "paragraph", label: "Paragraph" },
  { value: "coding", label: "Coding" },
];

function categoryLabel(v: string) {
  return CATEGORIES.find((c) => c.value === v)?.label ?? v;
}

export function LessonsManager({ lessons }: { lessons: LessonRow[] }) {
  const [editing, setEditing] = useState<LessonRow | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button onClick={() => setCreating(true)} className="gap-2">
          <Plus className="size-4" />
          New lesson
        </Button>
      </div>

      {lessons.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No lessons yet. Click &ldquo;New lesson&rdquo; to create one.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Order</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {l.level}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{categoryLabel(l.category)}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">
                  {l.orderIndex}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Edit lesson"
                      onClick={() => setEditing(l)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <DeleteLessonButton id={l.id} title={l.title} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <LessonDialog
        open={creating}
        onOpenChange={setCreating}
        title="New lesson"
        description="Add a new typing lesson to the library."
      />

      <LessonDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        title="Edit lesson"
        description="Update this lesson's content or metadata."
        lesson={editing}
      />
    </div>
  );
}

function LessonDialog({
  open,
  onOpenChange,
  title,
  description,
  lesson,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  lesson?: LessonRow | null;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form
          action={(formData) =>
            startTransition(async () => {
              const result = lesson
                ? await updateLesson(lesson.id, null, formData)
                : await createLesson(null, formData);
              if (result.ok) {
                toast.success(lesson ? "Lesson updated" : "Lesson created");
                onOpenChange(false);
              } else {
                toast.error(result.error);
              }
            })
          }
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={lesson?.title}
              required
              maxLength={200}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="level">Level</Label>
              <Select name="level" defaultValue={lesson?.level ?? "beginner"}>
                <SelectTrigger id="level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                defaultValue={lesson?.category ?? "home_row"}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="orderIndex">Order index</Label>
            <Input
              id="orderIndex"
              name="orderIndex"
              type="number"
              min={0}
              defaultValue={lesson?.orderIndex ?? 0}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="content">Content</Label>
            <textarea
              id="content"
              name="content"
              defaultValue={lesson?.content}
              required
              rows={6}
              className="rounded-md border border-input bg-transparent px-3 py-2 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : lesson ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteLessonButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Delete lesson"
      disabled={isPending}
      onClick={() => {
        if (!confirm(`Delete lesson "${title}"? This cannot be undone.`))
          return;
        startTransition(async () => {
          const result = await deleteLesson(id);
          if (result.ok) toast.success("Lesson deleted");
          else toast.error(result.error);
        });
      }}
    >
      <Trash2 className="size-3.5" />
    </Button>
  );
}
