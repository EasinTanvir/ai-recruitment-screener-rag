import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "USER"]);

export const jobStatusEnum = pgEnum("job_status", [
  "DRAFT",
  "PUBLISHED",
  "CLOSED",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "PENDING",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW",
  "ACCEPTED",
  "REJECTED",
]);

/* ===========================
   USERS
=========================== */

export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  email: varchar("email", { length: 320 }).notNull().unique(),

  passwordHash: text("password_hash").notNull(),

  role: userRoleEnum("role").default("USER").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ===========================
   JOBS
=========================== */

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),

  createdBy: integer("created_by")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  title: varchar("title", {
    length: 255,
  }).notNull(),

  companyName: varchar("company_name", {
    length: 255,
  }).notNull(),

  description: text("description").notNull(),

  requirements: text("requirements").notNull(),

  status: jobStatusEnum("status").default("PUBLISHED").notNull(),

  publishedAt: timestamp("published_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ===========================
   APPLICATIONS
=========================== */

export const applications = pgTable(
  "applications",
  {
    id: serial("id").primaryKey(),

    jobId: integer("job_id")
      .references(() => jobs.id, {
        onDelete: "cascade",
      })
      .notNull(),

    candidateId: integer("candidate_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

    resumeUrl: text("resume_url").notNull(),

    resumeText: text("resume_text").notNull(),

    status: applicationStatusEnum("status").default("PENDING").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueApplication: unique().on(table.jobId, table.candidateId),
  }),
);

/* ===========================
   APPLICANT METADATA
=========================== */

export const applicantMetadata = pgTable("applicant_metadata", {
  id: serial("id").primaryKey(),

  applicationId: integer("application_id")
    .references(() => applications.id, {
      onDelete: "cascade",
    })
    .notNull()
    .unique(),

  firstName: varchar("first_name", {
    length: 255,
  }),

  lastName: varchar("last_name", {
    length: 255,
  }),

  email: varchar("email", {
    length: 320,
  }),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ===========================
   AI SCORES
=========================== */

export const aiEvaluations = pgTable("ai_evaluations", {
  id: serial("id").primaryKey(),

  applicationId: integer("application_id")
    .references(() => applications.id, {
      onDelete: "cascade",
    })
    .notNull(),

  // Overall matching score (0-100)
  overallScore: integer("overall_score").notNull(),

  // AI generated overall evaluation
  summary: text("summary"),

  // Array of rubric evaluations
  // [
  //   {
  //     rubricName: "Technical Skills",
  //     score: 5,
  //   }
  // ]
  rubrics: jsonb("rubrics").notNull(),

  createdBy: integer("created_by").references(() => users.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
