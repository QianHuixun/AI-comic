# 小说转漫画章节分析契约文档（Qwen HTTP）

## 1. 文档定位

本文档是以下文档的补充实现约定：

- [novel-to-comic-qwen-plan.md](/home/junxun/ai-comic/AI-comic/docs/novel-to-comic-qwen-plan.md)
- [novel-to-comic-detailed-spec.md](/home/junxun/ai-comic/AI-comic/docs/novel-to-comic-detailed-spec.md)
- [drizzle-schema-draft.md](/home/junxun/ai-comic/AI-comic/docs/drizzle-schema-draft.md)

这份文档只解决四个具体问题：

1. 章节如何上传和校验
2. 后端如何调用千问 HTTP 接口
3. 千问必须返回什么 JSON 结构
4. 新章节出现旧角色、新角色、角色补充信息时，系统如何复用、更新或新增

## 2. 业务范围

当前项目的“小说转漫画”能力按章节处理，不按整本书直接处理。

支持两种章节输入方式：

- 手动粘贴文字
- 上传章节文本文件后提取文字

本阶段约束：

- 单章正文最大 `5000` 字
- 每次只分析一个章节
- 小说主数据至少包含 `novels`、`chapters`、`characters`
- 为了记录“本章角色动作”，建议保留 `chapter_characters`

## 3. 核心业务规则

### 3.1 章节规则

- 章节归属于某一本小说
- 章节内容去除首尾空白后不能为空
- 章节字数超过 `5000` 时直接拒绝入库
- 章节创建后先存库，再触发 AI 分析

### 3.2 角色规则

- 角色以“小说维度”沉淀，不是按章节单独存一份
- 同一本小说内，同一角色应尽量复用同一条 `characters` 记录
- 新章节中如果只是再次出现旧角色，不新建角色
- 新章节中如果补充了旧角色的新设定，可更新角色主档案
- 新章节中如果出现无法匹配的新角色，则新增角色

### 3.3 角色动作定义

- `reuse`：识别为已有角色，本章没有足够信息更新主档案
- `update`：识别为已有角色，本章补充了新的稳定设定
- `create`：无法命中已有角色，需创建新角色

## 4. 数据模型约定

核心主表仍然是：

- `novels`
- `chapters`
- `characters`

同时建议保留关系表：

- `chapter_characters`

原因很直接：

- `novels` 负责一本书的主档案
- `chapters` 负责逐章原文和分析结果
- `characters` 只保留角色当前最新主档案
- `chapter_characters` 负责记录“某角色在某章是复用、更新还是新增”

### 4.1 `novels`

建议最少字段：

- `id`
- `user_id`
- `title`
- `description`
- `style`
- `status`
- `total_chapters`
- `created_at`
- `updated_at`

### 4.2 `chapters`

建议最少字段：

- `id`
- `novel_id`
- `chapter_no`
- `title`
- `content`
- `content_length`
- `summary`
- `analysis_json`
- `storyboard_json`
- `status`
- `created_at`
- `updated_at`

### 4.3 `characters`

建议最少字段：

- `id`
- `novel_id`
- `name`
- `aliases_json`
- `gender`
- `age_range`
- `appearance`
- `personality`
- `background`
- `ability`
- `relationship_json`
- `first_chapter_id`
- `last_chapter_id`
- `version`
- `created_at`
- `updated_at`

### 4.4 `chapter_characters`

建议最少字段：

- `id`
- `chapter_id`
- `character_id`
- `action`
- `role_in_chapter`
- `change_summary`
- `extracted_json`
- `is_new`
- `is_updated`
- `created_at`

## 5. 章节处理总流程

## 5.1 流程概览

1. 用户先创建小说
2. 用户新增章节，来源可以是手动输入或上传文本
3. 后端校验章节内容并写入 `chapters`
4. 后端读取当前小说已有角色库
5. 后端调用千问 HTTP 接口分析当前章节
6. 后端根据返回结果做角色归并
7. 更新 `characters`
8. 写入 `chapter_characters`
9. 回写 `chapters.summary`、`chapters.storyboard_json`、`chapters.analysis_json`

## 5.2 推荐状态流转

章节状态建议如下：

- `pending`：刚创建，尚未分析
- `processing`：正在调用 AI
- `completed`：分析完成
- `failed`：分析失败

推荐处理顺序：

1. 新建章节时写入 `pending`
2. 调用分析前更新为 `processing`
3. 归并完成后更新为 `completed`
4. 调用失败或 JSON 不合法时更新为 `failed`

## 6. Qwen HTTP 接入约定

## 6.1 调用原则

- 前端不直接调用千问
- 只允许后端持有 API Key
- 业务层不直接依赖千问原始返回结构
- 千问返回先转成内部标准结构，再进入角色合并流程

## 6.2 环境变量

建议保留：

- `QWEN_API_URL`
- `QWEN_API_KEY`
- `QWEN_MODEL`
- `QWEN_TIMEOUT_MS`

可选补充：

- `QWEN_MAX_RETRIES`
- `QWEN_TEMPERATURE`

## 6.3 后端职责拆分

推荐按三层拆：

- `qwen-client`
  - 只负责发 HTTP 请求、处理超时、重试、标准化错误
- `chapter-analysis-service`
  - 负责组装 prompt、解析 JSON、校验返回结构
- `character-merge-service`
  - 负责复用、更新、新增角色的业务决策

不要把角色合并逻辑写进 HTTP Client。

## 6.4 请求输入结构

后端在调用千问前，统一构造以下分析输入：

```json
{
  "novel": {
    "id": 1,
    "title": "星河旅人",
    "style": "anime"
  },
  "chapter": {
    "id": 101,
    "chapterNo": 12,
    "title": "第十二章 雨夜追逐",
    "content": "章节正文，最大 5000 字。"
  },
  "knownCharacters": [
    {
      "id": 11,
      "name": "林雾",
      "aliases": ["小雾"],
      "gender": "男",
      "appearance": "黑发，身形偏瘦",
      "personality": "冷静克制",
      "background": "来自旧城区",
      "ability": "高观察力"
    }
  ],
  "recentSummaries": [
    "上一章林雾离开旧城区前往车站。",
    "上一章末尾出现神秘白衣少女。"
  ]
}
```

### 6.5 Prompt 约束

Prompt 建议分为系统指令和业务输入两部分。

系统指令必须明确要求模型：

- 只依据输入章节和已有角色信息判断
- 输出严格 JSON，不要输出 Markdown，不要输出解释文字
- 角色重复时优先匹配已有角色
- 只有在本章明确出现的新稳定设定，才允许建议更新角色
- 无法确认是否同一角色时，要降低置信度，不要强行匹配

### 6.6 推荐系统指令

可直接作为第一版约束文本：

```text
你是小说转漫画系统的章节分析器。
你的任务是基于当前章节文本和已有角色库，输出严格 JSON。
禁止输出任何 JSON 之外的内容。
禁止编造章节中没有出现的设定。
如果章节中的人物与已有角色库可以匹配，优先复用已有角色。
只有当章节提供了明确、稳定、非冲突的新信息时，才将角色动作标记为 update。
如果无法与已有角色稳定匹配，则标记为 create。
每个角色必须返回 action、matchType、confidence、changeSummary。
```

## 7. 千问输出 JSON 契约

## 7.1 顶层结构

千问返回值必须能被解析为如下结构：

```json
{
  "summary": "本章摘要",
  "scenes": [
    {
      "title": "场景标题",
      "summary": "场景摘要",
      "location": "地点",
      "mood": "氛围",
      "characters": ["林雾", "白璃"]
    }
  ],
  "storyboards": [
    {
      "sceneTitle": "场景标题",
      "panelNo": 1,
      "shot": "中景",
      "description": "画面描述",
      "dialogue": "对白",
      "emotion": "紧张"
    }
  ],
  "characters": [
    {
      "name": "林雾",
      "aliases": ["小雾"],
      "action": "update",
      "matchedCharacterId": 11,
      "matchType": "id",
      "confidence": 0.96,
      "roleInChapter": "主角",
      "changeSummary": "补充了惯用武器信息",
      "extractedProfile": {
        "gender": "男",
        "appearance": "黑发，穿深色风衣",
        "personality": "冷静克制",
        "background": null,
        "ability": "擅长近身格斗",
        "relationships": [
          {
            "targetName": "白璃",
            "relation": "刚结识，互相试探"
          }
        ]
      },
      "evidence": [
        "章节明确写到林雾今晚穿着深色风衣",
        "章节提到他擅长近身格斗"
      ]
    }
  ]
}
```

## 7.2 字段要求

### 顶层字段

- `summary` 必填，字符串
- `scenes` 必填，数组
- `storyboards` 必填，数组
- `characters` 必填，数组

### `characters[]` 字段

- `name` 必填
- `action` 必填，只允许 `reuse | update | create`
- `matchedCharacterId` 可空
- `matchType` 必填，只允许 `id | alias | name | fuzzy | none`
- `confidence` 必填，范围建议 `0` 到 `1`
- `roleInChapter` 可空
- `changeSummary` 必填，没变化时可写空字符串
- `extractedProfile` 必填，对应本章提取出的角色信息
- `evidence` 必填，数组，说明为什么这样判断

### `extractedProfile` 字段

建议至少保留：

- `gender`
- `appearance`
- `personality`
- `background`
- `ability`
- `relationships`

## 7.3 后端兜底校验

后端不能信任模型一定返回合法数据，必须做以下校验：

- 顶层必须是 JSON 对象
- `characters` 必须是数组
- `action` 不在允许枚举内时直接判失败
- `matchedCharacterId` 如果不在当前小说角色库中，按空值处理
- `confidence` 缺失时默认按 `0`
- `summary` 缺失时可降级为空字符串，但不建议静默忽略

## 8. 角色归并规则

## 8.1 归并目标

角色归并的目标不是“让模型决定一切”，而是：

- 用规则确保同一角色尽量不重复创建
- 允许模型补充角色信息
- 避免低置信的设定污染角色主档案

## 8.2 归并优先级

后端按下面顺序匹配角色：

1. `matchedCharacterId` 命中已有角色且属于当前小说
2. 名称与已有角色 `name` 完全一致
3. 名称命中已有角色 `aliases_json`
4. 名称近似且 `confidence >= 0.85`
5. 否则视为新角色

推荐原则：

- 工程规则优先
- AI 结果只作为辅助证据
- 低置信结果不能直接覆盖主档案

## 8.3 动作判定规则

### 判定为 `reuse`

满足任一情况即可：

- 已成功匹配到旧角色，且本章没有提取到有效新增字段
- 提取到了字段，但只是旧信息重复表述
- 提取到的信息存在冲突，且置信不足以更新

### 判定为 `update`

必须同时满足：

- 已成功匹配到旧角色
- 本章提供了旧档案里没有的新信息，或更完整的同类信息
- 信息不存在明显冲突
- `confidence >= 0.80`

### 判定为 `create`

满足以下之一：

- 完全无法命中旧角色
- 命中结果只有弱相似，`confidence < 0.80`
- 模型和规则都不足以证明是已有角色

## 8.4 字段更新策略

角色主档案更新时，不建议一律覆盖，建议按字段处理。

### 可直接补充的字段

- `appearance`
- `personality`
- `background`
- `ability`
- `aliases_json`
- `relationship_json`

规则：

- 旧值为空，新值非空，可更新
- 旧值较短，新值更完整，可更新
- 新值只是旧值同义改写，可不更新

### 谨慎更新的字段

- `name`
- `gender`
- `age_range`

规则：

- `name` 不直接改主名，只新增别名
- `gender` 与旧值冲突时不覆盖，写入 `changeSummary`
- `age_range` 冲突时不覆盖，写入 `changeSummary`

## 8.5 冲突处理

出现以下情况时，默认不覆盖主档案：

- 本章称角色为男性，旧档案为女性
- 本章给出完全不同的身份背景
- 本章出现疑似化名，但无法确认是否同一人

此时处理方式：

1. `action` 降级为 `reuse`
2. 把冲突信息写入 `chapter_characters.change_summary`
3. 原始提取内容保留到 `chapter_characters.extracted_json`
4. 角色主档案不改

## 8.6 章节关系表写入规则

当角色归并完成后，每个识别结果都写入一条 `chapter_characters`：

- `reuse`
  - `is_new = false`
  - `is_updated = false`
- `update`
  - `is_new = false`
  - `is_updated = true`
- `create`
  - `is_new = true`
  - `is_updated = false`

## 9. 推荐服务端伪流程

```text
createChapter()
  -> 校验 title/content/contentLength
  -> 插入 chapters(status=pending)

analyzeChapter(chapterId)
  -> 读取 chapter + novel + knownCharacters + recentSummaries
  -> 更新 chapters.status = processing
  -> 调用 qwen client
  -> 解析并校验 JSON
  -> 遍历 analysis.characters
     -> match existing character
     -> decide action(reuse/update/create)
     -> create or update characters
     -> insert chapter_characters
  -> 更新 chapters.summary
  -> 更新 chapters.storyboard_json
  -> 更新 chapters.analysis_json
  -> 更新 chapters.status = completed
```

## 10. API 层建议

基于现有文档，章节相关接口建议保持：

- `POST /api/novels`
- `GET /api/novels`
- `GET /api/novels/:novelId`
- `POST /api/novels/:novelId/chapters`
- `GET /api/novels/:novelId/chapters`
- `GET /api/chapters/:chapterId`
- `POST /api/chapters/:chapterId/analyze`
- `GET /api/novels/:novelId/characters`
- `GET /api/characters/:characterId`

### `POST /api/novels/:novelId/chapters`

请求体建议：

```json
{
  "chapterNo": 3,
  "title": "第三章 雨夜追逐",
  "content": "章节正文"
}
```

校验要求：

- `title` 非空
- `content` 非空
- `contentLength <= 5000`
- 同一本小说内 `chapterNo` 唯一

### `POST /api/chapters/:chapterId/analyze`

建议同步返回第一版处理结果：

```json
{
  "success": true,
  "message": "章节分析完成",
  "data": {
    "chapterId": 101,
    "status": "completed",
    "summary": "林雾在雨夜追逐中再次遇见白璃。",
    "characters": [
      {
        "id": 11,
        "name": "林雾",
        "action": "update"
      },
      {
        "id": 18,
        "name": "白璃",
        "action": "create"
      }
    ]
  }
}
```

## 11. 失败与重试策略

推荐处理：

- HTTP 超时：最多重试 `1` 到 `2` 次
- 返回非 JSON：记录原始返回并置 `failed`
- JSON 结构不合法：置 `failed`
- 部分角色无法匹配：不应导致整章失败，可按 `create` 或 `reuse` 降级处理

建议在 `chapters.analysis_json` 中保留：

- 标准化后的结构化结果
- 原始模型返回文本
- 本次分析时间
- 模型名

## 12. MVP 验收标准

满足以下条件即可视为第一版方案成立：

1. 用户可以创建小说
2. 用户可以按章节输入正文或上传文本
3. 单章超过 `5000` 字会被拒绝
4. 新章节可以调用千问完成结构化分析
5. 已有角色再次出现时能复用，不重复创建
6. 已有角色在新章节出现新稳定信息时能更新
7. 新角色能新增到角色库
8. 每章都能记录角色动作是 `reuse`、`update` 或 `create`

## 13. 与现有文档的关系

建议将当前文档作为“AI 分析契约层”，与现有文档分工如下：

- [novel-to-comic-qwen-plan.md](/home/junxun/ai-comic/AI-comic/docs/novel-to-comic-qwen-plan.md)
  - 负责总体改造方向
- [novel-to-comic-detailed-spec.md](/home/junxun/ai-comic/AI-comic/docs/novel-to-comic-detailed-spec.md)
  - 负责数据库、接口和实施阶段拆分
- [drizzle-schema-draft.md](/home/junxun/ai-comic/AI-comic/docs/drizzle-schema-draft.md)
  - 负责表结构和迁移草案
- `qwen-chapter-analysis-contract.md`
  - 负责千问输入输出契约和角色归并规则

如果下一步继续补文档，最适合补的是两份：

- Qwen 请求示例与错误码文档
- 角色归并测试样例文档
