import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const novelStatusEnum = pgEnum("novel_status", [
  "draft",
  "active",
  "archived",
]);

export const novelSourceTypeEnum = pgEnum("novel_source_type", [
  "manual",
  "upload",
]);

export const chapterStatusEnum = pgEnum("chapter_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const characterActionEnum = pgEnum("character_action", [
  "reuse",
  "update",
  "create",
]);

export const comicAssetStatusEnum = pgEnum("comic_asset_status", [
  "pending",
  "completed",
  "failed",
]);

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).default("用户"),
  age: integer().notNull().default(0),
  email: varchar({ length: 255 }).unique(),
  passWord: varchar({ length: 255 }).notNull(),
  phoneNumber: varchar({ length: 11 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const novels = pgTable(
  "novels",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar({ length: 255 }).notNull(),
    description: text(),
    style: varchar({ length: 100 }),
    sourceType: novelSourceTypeEnum("source_type").notNull().default("manual"),
    status: novelStatusEnum().notNull().default("draft"),
    totalChapters: integer("total_chapters").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userCreatedAtIdx: index("idx_novels_user_id_created_at").on(
      table.userId,
      table.createdAt,
    ),
  }),
);

export const chapters = pgTable(
  "chapters",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    novelId: integer("novel_id")
      .notNull()
      .references(() => novels.id, { onDelete: "cascade" }),
    chapterNo: integer("chapter_no").notNull(),
    title: varchar({ length: 255 }).notNull(),
    content: text().notNull(),
    contentLength: integer("content_length").notNull(),
    summary: text(),
    storyboardJson: jsonb("storyboard_json").$type<Record<string, unknown> | null>(),
    analysisJson: jsonb("analysis_json").$type<Record<string, unknown> | null>(),
    analysisError: text("analysis_error"),
    analysisAttempts: integer("analysis_attempts").notNull().default(0),
    lastAnalyzedAt: timestamp("last_analyzed_at"),
    status: chapterStatusEnum().notNull().default("pending"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    novelChapterNoUnique: unique("uq_chapters_novel_id_chapter_no").on(
      table.novelId,
      table.chapterNo,
    ),
    novelChapterNoIdx: index("idx_chapters_novel_id_chapter_no").on(
      table.novelId,
      table.chapterNo,
    ),
    novelStatusIdx: index("idx_chapters_novel_id_status").on(
      table.novelId,
      table.status,
    ),
    contentLengthCheck: check(
      "chk_chapters_content_length",
      sql`${table.contentLength} > 0 AND ${table.contentLength} <= 5000`,
    ),
  }),
);

export const characters = pgTable(
  "characters",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    novelId: integer("novel_id")
      .notNull()
      .references(() => novels.id, { onDelete: "cascade" }),
    name: varchar({ length: 255 }).notNull(),
    aliasesJson: jsonb("aliases_json").$type<string[] | null>(),
    gender: varchar({ length: 50 }),
    ageRange: varchar("age_range", { length: 100 }),
    appearance: text(),
    personality: text(),
    background: text(),
    ability: text(),
    relationshipJson: jsonb("relationship_json").$type<Record<string, unknown>[] | null>(),
    firstChapterId: integer("first_chapter_id").references(() => chapters.id, {
      onDelete: "set null",
    }),
    lastChapterId: integer("last_chapter_id").references(() => chapters.id, {
      onDelete: "set null",
    }),
    version: integer().notNull().default(1),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    novelNameUnique: unique("uq_characters_novel_id_name").on(
      table.novelId,
      table.name,
    ),
    novelNameIdx: index("idx_characters_novel_id_name").on(table.novelId, table.name),
    novelUpdatedAtIdx: index("idx_characters_novel_id_updated_at").on(
      table.novelId,
      table.updatedAt,
    ),
  }),
);

export const chapterCharacters = pgTable(
  "chapter_characters",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    chapterId: integer("chapter_id")
      .notNull()
      .references(() => chapters.id, { onDelete: "cascade" }),
    characterId: integer("character_id")
      .notNull()
      .references(() => characters.id, { onDelete: "cascade" }),
    roleInChapter: varchar("role_in_chapter", { length: 100 }),
    action: characterActionEnum().notNull(),
    isNew: boolean("is_new").notNull().default(false),
    isUpdated: boolean("is_updated").notNull().default(false),
    changeSummary: text("change_summary"),
    extractedJson: jsonb("extracted_json").$type<Record<string, unknown> | null>(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    chapterCharacterUnique: unique("uq_chapter_characters_chapter_id_character_id").on(
      table.chapterId,
      table.characterId,
    ),
    chapterIdx: index("idx_chapter_characters_chapter_id").on(table.chapterId),
    characterIdx: index("idx_chapter_characters_character_id").on(table.characterId),
  }),
);

export const storyboardImages = pgTable(
  "storyboard_images",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    chapterId: integer("chapter_id")
      .notNull()
      .references(() => chapters.id, { onDelete: "cascade" }),
    panelNo: integer("panel_no").notNull(),
    sceneTitle: varchar("scene_title", { length: 255 }).notNull(),
    promptText: text("prompt_text").notNull(),
    revisedPrompt: text("revised_prompt"),
    remoteUrl: text("remote_url"),
    imageData: text("image_data"),
    mimeType: varchar("mime_type", { length: 100 }),
    status: comicAssetStatusEnum().notNull().default("pending"),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    chapterPanelUnique: unique("uq_storyboard_images_chapter_id_panel_no").on(
      table.chapterId,
      table.panelNo,
    ),
    chapterPanelIdx: index("idx_storyboard_images_chapter_id_panel_no").on(
      table.chapterId,
      table.panelNo,
    ),
  }),
);

export const comicPages = pgTable(
  "comic_pages",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    chapterId: integer("chapter_id")
      .notNull()
      .references(() => chapters.id, { onDelete: "cascade" }),
    pageNo: integer("page_no").notNull(),
    title: varchar({ length: 255 }).notNull(),
    layoutJson: jsonb("layout_json").$type<Record<string, unknown> | null>(),
    panelImageIdsJson: jsonb("panel_image_ids_json").$type<number[] | null>(),
    imageData: text("image_data").notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull().default("image/svg+xml"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    chapterPageUnique: unique("uq_comic_pages_chapter_id_page_no").on(
      table.chapterId,
      table.pageNo,
    ),
    chapterPageIdx: index("idx_comic_pages_chapter_id_page_no").on(
      table.chapterId,
      table.pageNo,
    ),
  }),
);

export type User = typeof users.$inferSelect;
export type Novel = typeof novels.$inferSelect;
export type NewNovel = typeof novels.$inferInsert;
export type Chapter = typeof chapters.$inferSelect;
export type NewChapter = typeof chapters.$inferInsert;
export type Character = typeof characters.$inferSelect;
export type NewCharacter = typeof characters.$inferInsert;
export type ChapterCharacter = typeof chapterCharacters.$inferSelect;
export type NewChapterCharacter = typeof chapterCharacters.$inferInsert;
export type StoryboardImage = typeof storyboardImages.$inferSelect;
export type NewStoryboardImage = typeof storyboardImages.$inferInsert;
export type ComicPage = typeof comicPages.$inferSelect;
export type NewComicPage = typeof comicPages.$inferInsert;
