CREATE TYPE "application_status" AS ENUM('PENDING', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'ACCEPTED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "job_status" AS ENUM('DRAFT', 'PUBLISHED', 'CLOSED');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('ADMIN', 'USER');--> statement-breakpoint
CREATE TABLE "ai_evaluations" (
	"id" serial PRIMARY KEY,
	"application_id" integer NOT NULL,
	"overall_score" integer NOT NULL,
	"summary" text,
	"rubrics" jsonb NOT NULL,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applicant_metadata" (
	"id" serial PRIMARY KEY,
	"application_id" integer NOT NULL UNIQUE,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" varchar(320),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" serial PRIMARY KEY,
	"job_id" integer NOT NULL,
	"candidate_id" integer NOT NULL,
	"resume_url" text NOT NULL,
	"resume_text" text NOT NULL,
	"status" "application_status" DEFAULT 'PENDING'::"application_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "applications_job_id_candidate_id_unique" UNIQUE("job_id","candidate_id")
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY,
	"created_by" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"requirements" text NOT NULL,
	"status" "job_status" DEFAULT 'DRAFT'::"job_status" NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'USER'::"user_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_evaluations" ADD CONSTRAINT "ai_evaluations_application_id_applications_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "ai_evaluations" ADD CONSTRAINT "ai_evaluations_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "applicant_metadata" ADD CONSTRAINT "applicant_metadata_application_id_applications_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_jobs_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_candidate_id_users_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE;