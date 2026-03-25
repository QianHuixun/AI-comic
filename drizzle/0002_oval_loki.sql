CREATE TYPE "public"."chapter_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."character_action" AS ENUM('reuse', 'update', 'create');--> statement-breakpoint
CREATE TYPE "public"."novel_source_type" AS ENUM('manual', 'upload');--> statement-breakpoint
CREATE TYPE "public"."novel_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TABLE "chapter_characters" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "chapter_characters_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"chapter_id" integer NOT NULL,
	"character_id" integer NOT NULL,
	"role_in_chapter" varchar(100),
	"action" character_action NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"is_updated" boolean DEFAULT false NOT NULL,
	"change_summary" text,
	"extracted_json" jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "uq_chapter_characters_chapter_id_character_id" UNIQUE("chapter_id","character_id")
);
--> statement-breakpoint
CREATE TABLE "chapters" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "chapters_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"novel_id" integer NOT NULL,
	"chapter_no" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"content_length" integer NOT NULL,
	"summary" text,
	"storyboard_json" jsonb,
	"analysis_json" jsonb,
	"status" "chapter_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "uq_chapters_novel_id_chapter_no" UNIQUE("novel_id","chapter_no"),
	CONSTRAINT "chk_chapters_content_length" CHECK ("chapters"."content_length" > 0 AND "chapters"."content_length" <= 5000)
);
--> statement-breakpoint
CREATE TABLE "characters" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "characters_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"novel_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"aliases_json" jsonb,
	"gender" varchar(50),
	"age_range" varchar(100),
	"appearance" text,
	"personality" text,
	"background" text,
	"ability" text,
	"relationship_json" jsonb,
	"first_chapter_id" integer,
	"last_chapter_id" integer,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "uq_characters_novel_id_name" UNIQUE("novel_id","name")
);
--> statement-breakpoint
CREATE TABLE "novels" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "novels_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"style" varchar(100),
	"source_type" "novel_source_type" DEFAULT 'manual' NOT NULL,
	"status" "novel_status" DEFAULT 'draft' NOT NULL,
	"total_chapters" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "chapter_characters" ADD CONSTRAINT "chapter_characters_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter_characters" ADD CONSTRAINT "chapter_characters_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_novel_id_novels_id_fk" FOREIGN KEY ("novel_id") REFERENCES "public"."novels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_novel_id_novels_id_fk" FOREIGN KEY ("novel_id") REFERENCES "public"."novels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_first_chapter_id_chapters_id_fk" FOREIGN KEY ("first_chapter_id") REFERENCES "public"."chapters"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_last_chapter_id_chapters_id_fk" FOREIGN KEY ("last_chapter_id") REFERENCES "public"."chapters"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "novels" ADD CONSTRAINT "novels_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_chapter_characters_chapter_id" ON "chapter_characters" USING btree ("chapter_id");--> statement-breakpoint
CREATE INDEX "idx_chapter_characters_character_id" ON "chapter_characters" USING btree ("character_id");--> statement-breakpoint
CREATE INDEX "idx_chapters_novel_id_chapter_no" ON "chapters" USING btree ("novel_id","chapter_no");--> statement-breakpoint
CREATE INDEX "idx_chapters_novel_id_status" ON "chapters" USING btree ("novel_id","status");--> statement-breakpoint
CREATE INDEX "idx_characters_novel_id_name" ON "characters" USING btree ("novel_id","name");--> statement-breakpoint
CREATE INDEX "idx_characters_novel_id_updated_at" ON "characters" USING btree ("novel_id","updated_at");--> statement-breakpoint
CREATE INDEX "idx_novels_user_id_created_at" ON "novels" USING btree ("user_id","created_at");