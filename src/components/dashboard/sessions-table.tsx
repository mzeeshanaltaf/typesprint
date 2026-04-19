"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type SessionRow = {
  id: string;
  mode: string;
  wpm: number;
  accuracy: number;
  mistakes: number;
  durationSec: number;
  createdAt: string; // ISO string — formatted client-side for correct local timezone
  lessonTitle: string | null;
};

function formatDuration(totalSec: number): string {
  if (totalSec < 60) return `${totalSec}s`;
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function modeLabel(mode: string, lessonTitle: string | null): string {
  if (mode === "lesson" && lessonTitle) return lessonTitle;
  if (mode === "custom") return "Free";
  return `${mode}s`;
}

export function SessionsTable({ sessions }: { sessions: SessionRow[] }) {
  if (sessions.length === 0) {
    return (
      <p className="px-6 py-6 text-sm text-muted-foreground">
        No sessions yet. Head to{" "}
        <a className="text-indigo-500 hover:underline" href="/practice">
          /practice
        </a>{" "}
        to run one.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>When</TableHead>
          <TableHead>Mode</TableHead>
          <TableHead className="text-right">WPM</TableHead>
          <TableHead className="text-right">Accuracy</TableHead>
          <TableHead className="text-right">Mistakes</TableHead>
          <TableHead className="text-right">Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="whitespace-nowrap">
              <div className="flex flex-col">
                <span>{formatDate(s.createdAt)}</span>
                <span className="text-xs text-muted-foreground">
                  {formatTime(s.createdAt)}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="capitalize">
                {modeLabel(s.mode, s.lessonTitle)}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-mono font-medium">
              {s.wpm}
            </TableCell>
            <TableCell className="text-right font-mono">
              {s.accuracy}%
            </TableCell>
            <TableCell className="text-right font-mono text-muted-foreground">
              {s.mistakes}
            </TableCell>
            <TableCell className="text-right font-mono text-muted-foreground">
              {formatDuration(s.durationSec)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
