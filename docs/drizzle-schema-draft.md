# Drizzle 表结构草案

## 1. 文档目标

本文档只用于定义“小说转漫画”需求对应的 Drizzle 数据结构草案，不改代码。

目标：

- 明确需要新增哪些表
- 明确字段类型、约束、索引、外键
- 给出建议的 Drizzle schema 写法方向
- 给出迁移注意事项

## 2. 关联范围

本方案建立在当前已有 `users` 表之上，新增以下业务表：

- `novels`
- `chapters`
- `characters`
- `chapter_characters`

## 3. 枚举草案

建议新增以下枚举。

### `novel_status`

- `draft`
- `active`
- `archived`

### `novel_source_type`

- `manual`
- `upload`

### `chapter_status`

- `pending`
- `processing`
- `completed`
- `failed`

### `character_action`

- `reuse`
- `update`
- `create`

## 4. 表结构草案

## 4.1 `novels`

用途：一本小说的主档案。

字段：

- `id`
  - 类型：`integer`
  - 约束：主键，自增
- `user_id`
  - 类型：`integer`
  - 约束：非空，外键到 `users.id`
- `title`
  - 类型：`varchar(255)`
  - 约束：非空
- `description`
  - 类型：`text`
  - 约束：可空
- `style`
  - 类型：`varchar(100)`
  - 约束：可空
- `source_type`
  - 类型：`novel_source_type`
  - 约束：非空，默认 `manual`
- `status`
  - 类型：`novel_status`
  - 约束：非空，默认 `draft`
- `total_chapters`
  - 类型：`integer`
  - 约束：非空，默认 `0`
- `created_at`
  - 类型：`timestamp`
  - 约束：默认 `now()`
- `updated_at`
  - 类型：`timestamp`
  - 约束：默认 `now()`

建议索引：

- `idx_novels_user_id_created_at`
  - 字段：`user_id`, `created_at`

Drizzle 草案：

```ts
export const novels = pgTable("novels", {
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
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});
```

## 4.2 `chapters`

用途：存储小说章节原文和分析结果。

字段：

- `id`
  - 类型：`integer`
  - 约束：主键，自增
- `novel_id`
  - 类型：`integer`
  - 约束：非空，外键到 `novels.id`
- `chapter_no`
  - 类型：`integer`
  - 约束：非空
- `title`
  - 类型：`varchar(255)`
  - 约束：非空
- `content`
  - 类型：`text`
  - 约束：非空
- `content_length`
  - 类型：`integer`
  - 约束：非空
- `summary`
  - 类型：`text`
  - 约束：可空
- `storyboard_json`
  - 类型：`jsonb`
  - 约束：可空
- `analysis_json`
  - 类型：`jsonb`
  - 约束：可空
- `status`
  - 类型：`chapter_status`
  - 约束：非空，默认 `pending`
- `created_at`
  - 类型：`timestamp`
  - 约束：默认 `now()`
- `updated_at`
  - 类型：`timestamp`
  - 约束：默认 `now()`

建议约束：

- `(novel_id, chapter_no)` 唯一
- `content_length > 0`
- `content_length <= 5000`

建议索引：

- `idx_chapters_novel_id_chapter_no`
- `idx_chapters_novel_id_status`

Drizzle 草案：

```ts
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
    status: chapterStatusEnum().notNull().default("pending"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
  },
  (table) => ({
    novelChapterNoUnique: unique().on(table.novelId, table.chapterNo),
    novelStatusIdx: index("idx_chapters_novel_id_status").on(table.novelId, table.status),
  })
);
```

## 4.3 `characters`

用途：存储某本小说下的角色主档案。

字段：

- `id`
  - 类型：`integer`
  - 约束：主键，自增
- `novel_id`
  - 类型：`integer`
  - 约束：非空，外键到 `novels.id`
- `name`
  - 类型：`varchar(255)`
  - 约束：非空
- `aliases_json`
  - 类型：`jsonb`
  - 约束：可空
- `gender`
  - 类型：`varchar(50)`
  - 约束：可空
- `age_range`
  - 类型：`varchar(100)`
  - 约束：可空
- `appearance`
  - 类型：`text`
  - 约束：可空
- `personality`
  - 类型：`text`
  - 约束：可空
- `background`
  - 类型：`text`
  - 约束：可空
- `ability`
  - 类型：`text`
  - 约束：可空
- `relationship_json`
  - 类型：`jsonb`
  - 约束：可空
- `first_chapter_id`
  - 类型：`integer`
  - 约束：可空，外键到 `chapters.id`
- `last_chapter_id`
  - 类型：`integer`
  - 约束：可空，外键到 `chapters.id`
- `version`
  - 类型：`integer`
  - 约束：非空，默认 `1`
- `created_at`
  - 类型：`timestamp`
  - 约束：默认 `now()`
- `updated_at`
  - 类型：`timestamp`
  - 约束：默认 `now()`

建议约束：

- `(novel_id, name)` 唯一

建议索引：

- `idx_characters_novel_id_name`
- `idx_characters_novel_id_updated_at`

Drizzle 草案：

```ts
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
    relationshipJson: jsonb("relationship_json").$type<Record<string, unknown> | null>(),
    firstChapterId: integer("first_chapter_id").references(() => chapters.id, {
      onDelete: "set null",
    }),
    lastChapterId: integer("last_chapter_id").references(() => chapters.id, {
      onDelete: "set null",
    }),
    version: integer().notNull().default(1),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
  },
  (table) => ({
    novelNameUnique: unique().on(table.novelId, table.name),
    novelUpdatedAtIdx: index("idx_characters_novel_id_updated_at").on(
      table.novelId,
      table.updatedAt
    ),
  })
);
```

## 4.4 `chapter_characters`

用途：存储某角色在某章中的出现和变更情况。

字段：

- `id`
  - 类型：`integer`
  - 约束：主键，自增
- `chapter_id`
  - 类型：`integer`
  - 约束：非空，外键到 `chapters.id`
- `character_id`
  - 类型：`integer`
  - 约束：非空，外键到 `characters.id`
- `role_in_chapter`
  - 类型：`varchar(100)`
  - 约束：可空
- `action`
  - 类型：`character_action`
  - 约束：非空
- `is_new`
  - 类型：`boolean`
  - 约束：非空，默认 `false`
- `is_updated`
  - 类型：`boolean`
  - 约束：非空，默认 `false`
- `change_summary`
  - 类型：`text`
  - 约束：可空
- `extracted_json`
  - 类型：`jsonb`
  - 约束：可空
- `created_at`
  - 类型：`timestamp`
  - 约束：默认 `now()`

建议约束：

- `(chapter_id, character_id)` 唯一

建议索引：

- `idx_chapter_characters_chapter_id`
- `idx_chapter_characters_character_id`

Drizzle 草案：

```ts
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
    chapterCharacterUnique: unique().on(table.chapterId, table.characterId),
    chapterIdx: index("idx_chapter_characters_chapter_id").on(table.chapterId),
    characterIdx: index("idx_chapter_characters_character_id").on(table.characterId),
  })
);
```

## 5. 建议导出类型

建议为新增表导出这些类型：

```ts
export type Novel = typeof novels.$inferSelect;
export type NewNovel = typeof novels.$inferInsert;
export type Chapter = typeof chapters.$inferSelect;
export type NewChapter = typeof chapters.$inferInsert;
export type Character = typeof characters.$inferSelect;
export type NewCharacter = typeof characters.$inferInsert;
export type ChapterCharacter = typeof chapterCharacters.$inferSelect;
export type NewChapterCharacter = typeof chapterCharacters.$inferInsert;
```

## 6. 迁移注意事项

## 6.1 外键顺序

迁移时注意依赖顺序：

1. 枚举
2. `novels`
3. `chapters`
4. `characters`
5. `chapter_characters`

## 6.2 `first_chapter_id` / `last_chapter_id`

这两个字段依赖 `chapters.id`，建议：

- 删除章节时使用 `set null`
- 避免因章节删除导致角色主档案被级联删除

## 6.3 `content_length`

建议由服务层写入，不依赖数据库自动计算。

原因：

- 前后端都要做 `5000` 字校验
- 服务层容易统一错误提示

## 6.4 JSON 字段

建议这些字段统一用 `jsonb`：

- `storyboard_json`
- `analysis_json`
- `aliases_json`
- `relationship_json`
- `extracted_json`

原因：

- 后续结构可能演进
- 查询和扩展比纯字符串更稳

## 7. 角色更新建议

当前设计里 `characters` 表只保留最新角色档案，没有单独角色历史表。

这意味着：

- 当前实现更简单
- 角色历史更新只能通过 `chapter_characters.change_summary` 追踪

如果后续要更强的审计能力，可以再补：

- `character_versions`

但第一版不建议加，避免模型复杂度过高。

## 8. MVP 最小落地集

如果要先压缩实现成本，可以先只落这些字段。

### `novels`

- `id`
- `user_id`
- `title`
- `description`
- `style`
- `status`
- `created_at`
- `updated_at`

### `chapters`

- `id`
- `novel_id`
- `chapter_no`
- `title`
- `content`
- `content_length`
- `summary`
- `analysis_json`
- `status`

### `characters`

- `id`
- `novel_id`
- `name`
- `appearance`
- `personality`
- `background`
- `first_chapter_id`
- `last_chapter_id`
- `version`

### `chapter_characters`

- `id`
- `chapter_id`
- `character_id`
- `action`
- `is_new`
- `is_updated`
- `change_summary`

## 9. 验收清单

这份 schema 草案后续如果落成代码，至少要满足：

- 能新增小说
- 能给小说按章节存储正文
- 能记录章节分析结果
- 能维护小说角色库
- 能标记角色在某章节是复用、更新还是新增

## 10. 下一步文档建议

如果继续只补文档，下一份最适合写的是：

- 千问 Prompt 与 JSON Schema 文档

这样数据库和 AI 输出约定就能接上。
