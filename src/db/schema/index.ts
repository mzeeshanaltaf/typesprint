import {
  pgSchema,
  text,
  boolean,
  timestamp,
  integer,
  date,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";

export const typesprint = pgSchema("typesprint");

// ----- Better Auth core tables -----

export const user = typesprint.table("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const session = typesprint.table(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const account = typesprint.table(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const verification = typesprint.table("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ----- App tables -----

export const lesson = typesprint.table(
  "lesson",
  {
    id: text("id").primaryKey(),
    level: text("level").notNull(), // beginner | intermediate | advanced
    category: text("category").notNull(), // home_row | numbers | symbols | paragraph | coding
    title: text("title").notNull(),
    content: text("content").notNull(),
    orderIndex: integer("order_index").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("lesson_level_idx").on(t.level, t.orderIndex)],
);

export const typingSession = typesprint.table(
  "typing_session",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    mode: text("mode").notNull(), // 15 | 30 | 60 | custom | lesson
    durationSec: integer("duration_sec").notNull(),
    wpm: integer("wpm").notNull(),
    accuracy: integer("accuracy").notNull(), // 0-100
    mistakes: integer("mistakes").notNull().default(0),
    charsTyped: integer("chars_typed").notNull().default(0),
    lessonId: text("lesson_id").references(() => lesson.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("typing_session_user_idx").on(t.userId, t.createdAt)],
);

export const dailyStat = typesprint.table(
  "daily_stat",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    day: date("day").notNull(),
    practiceSeconds: integer("practice_seconds").notNull().default(0),
    bestWpm: integer("best_wpm").notNull().default(0),
    avgWpm: integer("avg_wpm").notNull().default(0),
    accuracyAvg: integer("accuracy_avg").notNull().default(0),
    sessionsCount: integer("sessions_count").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.userId, t.day] })],
);

export const streak = typesprint.table(
  "streak",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    currentDays: integer("current_days").notNull().default(0),
    longestDays: integer("longest_days").notNull().default(0),
    lastActiveDay: date("last_active_day"),
  },
  (t) => [uniqueIndex("streak_user_unique").on(t.userId)],
);
