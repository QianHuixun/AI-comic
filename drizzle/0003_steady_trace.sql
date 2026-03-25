ALTER TABLE "chapters"
ADD COLUMN "analysis_error" text;
--> statement-breakpoint
ALTER TABLE "chapters"
ADD COLUMN "analysis_attempts" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "chapters"
ADD COLUMN "last_analyzed_at" timestamp;
