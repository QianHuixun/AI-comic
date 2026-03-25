CREATE TYPE "public"."comic_asset_status" AS ENUM('pending', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "comic_pages" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "comic_pages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"chapter_id" integer NOT NULL,
	"page_no" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"layout_json" jsonb,
	"panel_image_ids_json" jsonb,
	"image_data" text NOT NULL,
	"mime_type" varchar(100) DEFAULT 'image/svg+xml' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "uq_comic_pages_chapter_id_page_no" UNIQUE("chapter_id","page_no")
);
--> statement-breakpoint
CREATE TABLE "storyboard_images" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "storyboard_images_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"chapter_id" integer NOT NULL,
	"panel_no" integer NOT NULL,
	"scene_title" varchar(255) NOT NULL,
	"prompt_text" text NOT NULL,
	"revised_prompt" text,
	"remote_url" text,
	"image_data" text,
	"mime_type" varchar(100),
	"status" "comic_asset_status" DEFAULT 'pending' NOT NULL,
	"error_message" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "uq_storyboard_images_chapter_id_panel_no" UNIQUE("chapter_id","panel_no")
);
--> statement-breakpoint
ALTER TABLE "comic_pages" ADD CONSTRAINT "comic_pages_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storyboard_images" ADD CONSTRAINT "storyboard_images_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_comic_pages_chapter_id_page_no" ON "comic_pages" USING btree ("chapter_id","page_no");--> statement-breakpoint
CREATE INDEX "idx_storyboard_images_chapter_id_panel_no" ON "storyboard_images" USING btree ("chapter_id","panel_no");
