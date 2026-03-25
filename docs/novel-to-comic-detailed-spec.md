# 小说转漫画详细实施文档

## 1. 文档目的

本文档是 [novel-to-comic-qwen-plan.md](/home/junxun/ai-comic/AI-comic/docs/novel-to-comic-qwen-plan.md) 的细化版，只描述设计与实施方案，不包含代码改动。

覆盖范围：

1. 数据库 schema 与迁移设计
2. 后端 `novels / chapters / characters / analyze` 接口设计
3. 千问 HTTP Client 设计
4. `src/pages/ai-creation/index.tsx` 的真实化页面方案

## 2. 阶段一：数据库 Schema 与迁移设计

## 2.1 目标

围绕“小说按章节上传或输入，逐章沉淀角色”的业务，建立最小可扩展数据模型。

必须满足：

- 一本小说包含多章
- 一章属于一本小说
- 一本小说包含多个角色
- 一个角色可在多章出现
- 一章分析后可以标记角色是复用、更新还是新增

## 2.2 表设计总览

建议表：

- `novels`
- `chapters`
- `characters`
- `chapter_characters`

依赖现有表：

- `users`

## 2.3 枚举设计

建议增加三个枚举概念。

### 小说状态

- `draft`
- `active`
- `archived`

### 章节状态

- `pending`
- `processing`
- `completed`
- `failed`

### 角色动作

- `reuse`
- `update`
- `create`

## 2.4 表字段明细

### `novels`

用途：存储一本小说的主档案。

字段建议：

- `id`: 主键
- `user_id`: 所属用户
- `title`: 小说名
- `description`: 小说简介
- `style`: 目标漫画风格
- `source_type`: `manual | upload`
- `status`: `draft | active | archived`
- `total_chapters`: 章节数缓存
- `created_at`
- `updated_at`

约束建议：

- `user_id` 外键到 `users.id`
- `title` 非空
- `total_chapters` 默认 `0`

### `chapters`

用途：存储章节原文和分析结果。

字段建议：

- `id`
- `novel_id`
- `chapter_no`
- `title`
- `content`
- `content_length`
- `summary`
- `storyboard_json`
- `analysis_json`
- `status`
- `created_at`
- `updated_at`

约束建议：

- `novel_id` 外键到 `novels.id`
- `content` 非空
- `content_length <= 5000`
- `(novel_id, chapter_no)` 唯一

说明：

- `summary` 存简明摘要
- `storyboard_json` 存分镜草案
- `analysis_json` 存模型返回的结构化结果

### `characters`

用途：存储角色主档案，表示“当前最新版本角色资料”。

字段建议：

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

约束建议：

- `novel_id` 外键到 `novels.id`
- `name` 非空
- `(novel_id, name)` 建唯一索引

说明：

- `aliases_json` 用于存别名
- `version` 每次角色主档案更新时递增
- `first_chapter_id` 指首次出现章节
- `last_chapter_id` 指最近一次出现章节

### `chapter_characters`

用途：存储章节和角色的关联，以及本章对角色的影响。

字段建议：

- `id`
- `chapter_id`
- `character_id`
- `role_in_chapter`
- `action`
- `is_new`
- `is_updated`
- `change_summary`
- `extracted_json`
- `created_at`

约束建议：

- `chapter_id` 外键到 `chapters.id`
- `character_id` 外键到 `characters.id`
- `(chapter_id, character_id)` 唯一

说明：

- `action` 为 `reuse | update | create`
- `change_summary` 用来保存“本章新增了什么信息”
- `extracted_json` 存该章里模型抽出的角色片段

## 2.5 迁移顺序

建议按以下顺序生成迁移。

1. 新增枚举类型
2. 新增 `novels`
3. 新增 `chapters`
4. 新增 `characters`
5. 新增 `chapter_characters`
6. 建立唯一索引与外键

原因：

- `characters` 依赖 `chapters` 的首次/最近章节外键
- `chapter_characters` 同时依赖 `chapters` 和 `characters`

## 2.6 推荐索引

建议索引：

- `novels(user_id, created_at desc)`
- `chapters(novel_id, chapter_no)`
- `chapters(novel_id, status)`
- `characters(novel_id, name)`
- `chapter_characters(chapter_id, character_id)`

## 2.7 迁移验收标准

迁移完成后应满足：

- 能创建小说
- 能给小说新增章节
- 能给小说新增角色
- 能记录角色在某一章的出现与变化
- 删除小说时，其章节、角色、关联记录能级联清理

## 3. 阶段二：后端接口设计

## 3.1 目标

为前端提供完整的“小说管理 + 章节上传/输入 + 章节分析 + 角色查询”接口。

## 3.2 路由分组建议

基于当前 `src/service/main.ts` 的结构，建议新增：

- `/api/novels`
- `/api/chapters`
- `/api/characters`

## 3.3 接口清单

### `POST /api/novels`

用途：创建小说。

请求体：

```json
{
  "title": "星河旅人",
  "description": "一部科幻冒险小说",
  "style": "anime",
  "sourceType": "manual"
}
```

响应：

```json
{
  "success": true,
  "message": "小说创建成功",
  "data": {
    "id": 1,
    "title": "星河旅人",
    "description": "一部科幻冒险小说",
    "style": "anime",
    "status": "draft",
    "totalChapters": 0
  }
}
```

### `GET /api/novels`

用途：获取当前用户的小说列表。

响应：

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "星河旅人",
      "status": "active",
      "totalChapters": 3,
      "updatedAt": "2026-03-23T12:00:00.000Z"
    }
  ]
}
```

### `GET /api/novels/:novelId`

用途：获取小说详情。

返回内容建议包含：

- 小说基础信息
- 章节统计
- 角色统计

### `POST /api/novels/:novelId/chapters`

用途：新增章节。

请求体：

```json
{
  "chapterNo": 1,
  "title": "第一章 初见",
  "content": "这里是章节正文，最大 5000 字。"
}
```

校验规则：

- `chapterNo` 必填且大于 `0`
- `title` 必填
- `content` 必填
- `content.length <= 5000`

响应：

```json
{
  "success": true,
  "message": "章节创建成功",
  "data": {
    "id": 10,
    "novelId": 1,
    "chapterNo": 1,
    "title": "第一章 初见",
    "contentLength": 24,
    "status": "pending"
  }
}
```

### `GET /api/novels/:novelId/chapters`

用途：获取某本小说的章节列表。

建议返回：

- `id`
- `chapterNo`
- `title`
- `status`
- `contentLength`
- `updatedAt`

### `GET /api/chapters/:chapterId`

用途：获取章节详情。

建议返回：

- 章节原文
- 章节摘要
- 分镜结果
- 本章识别到的角色列表

### `POST /api/chapters/:chapterId/analyze`

用途：对某一章节触发分析。

请求体建议为空，或者允许透传少量控制参数：

```json
{
  "force": false
}
```

响应建议：

```json
{
  "success": true,
  "message": "章节分析已完成",
  "data": {
    "chapterId": 10,
    "status": "completed",
    "summary": "主角在车站遇到神秘少女。",
    "characters": [
      {
        "id": 3,
        "name": "林雾",
        "action": "reuse"
      },
      {
        "id": 5,
        "name": "白璃",
        "action": "create"
      }
    ]
  }
}
```

### `GET /api/novels/:novelId/characters`

用途：获取一本小说下的角色库。

返回内容建议：

- `id`
- `name`
- `aliases`
- `version`
- `firstChapterId`
- `lastChapterId`
- `updatedAt`

### `GET /api/characters/:characterId`

用途：获取单个角色详情。

建议返回：

- 角色主档案
- 最近出现场景
- 最近变更摘要

## 3.4 错误响应格式

建议统一错误响应：

```json
{
  "success": false,
  "message": "章节内容不能超过 5000 字"
}
```

## 3.5 服务层拆分建议

建议服务层最少拆成：

- `NovelService`
- `ChapterService`
- `CharacterService`
- `ChapterAnalysisService`

职责建议：

- `NovelService`: 小说增删改查
- `ChapterService`: 章节增删改查和基础校验
- `CharacterService`: 角色查询、匹配、更新
- `ChapterAnalysisService`: 调用千问并处理角色归并

## 4. 阶段三：千问 HTTP Client 设计

## 4.1 目标

在后端封装一个稳定的 AI 调用层，不让业务逻辑直接依赖第三方返回结构。

## 4.2 环境变量建议

- `QWEN_API_URL`
- `QWEN_API_KEY`
- `QWEN_MODEL`
- `QWEN_TIMEOUT_MS`

## 4.3 调用职责边界

千问 Client 只做三件事：

- 发送 HTTP 请求
- 获取原始响应
- 标准化错误

不要在 Client 里做业务规则，例如角色合并或章节入库。

## 4.4 章节分析输入结构

建议在服务层统一构造输入：

```json
{
  "novel": {
    "id": 1,
    "title": "星河旅人",
    "style": "anime"
  },
  "chapter": {
    "id": 10,
    "chapterNo": 1,
    "title": "第一章 初见",
    "content": "章节正文"
  },
  "knownCharacters": [
    {
      "id": 3,
      "name": "林雾",
      "aliases": ["小雾"],
      "appearance": "黑发少年",
      "personality": "冷静"
    }
  ],
  "recentSummaries": [
    "上一章中主角离开故乡。"
  ]
}
```

## 4.5 章节分析输出结构

建议要求模型输出严格 JSON：

```json
{
  "summary": "主角在车站遇到神秘少女，并意外卷入追捕事件。",
  "scenes": [
    {
      "title": "车站相遇",
      "summary": "主角第一次见到白璃。"
    }
  ],
  "storyboards": [
    {
      "panelNo": 1,
      "sceneTitle": "车站相遇",
      "shot": "远景",
      "prompt": "黄昏车站，少年与少女对视。"
    }
  ],
  "characters": [
    {
      "name": "林雾",
      "matchedCharacterId": 3,
      "action": "reuse",
      "confidence": 0.98,
      "roleInChapter": "主角",
      "changes": []
    },
    {
      "name": "白璃",
      "matchedCharacterId": null,
      "action": "create",
      "confidence": 0.93,
      "roleInChapter": "关键新角色",
      "profile": {
        "gender": "女",
        "appearance": "银发少女",
        "personality": "警觉冷淡",
        "background": "身份未明"
      },
      "changes": []
    }
  ]
}
```

## 4.6 Prompt 约束建议

System Prompt 目标：

- 你是小说章节结构化分析助手
- 你只能基于输入文本判断
- 你必须优先复用已有角色
- 你必须输出合法 JSON

关键约束：

- 不得输出 Markdown
- 不得输出解释性文字
- 不得补充文本之外的世界观设定
- 对不确定信息必须降低置信度
- 冲突信息不要直接强判覆盖

## 4.7 角色归并策略

建议按两阶段处理。

第一阶段：规则初筛

- 名称完全匹配
- 别名命中
- 章节内上下文与已有角色关键描述相似

第二阶段：模型辅助决策

- 输出 `matchedCharacterId`
- 输出 `action`
- 输出 `confidence`
- 输出 `reason`

最终服务端决策规则：

- `confidence >= 0.9` 可直接采用
- `0.7 <= confidence < 0.9` 保守采用
- `< 0.7` 不自动覆盖角色主档案

## 4.8 重试与容错

建议最少有这些策略：

- 超时重试 1 次
- JSON 解析失败重试 1 次
- 模型返回字段缺失则判为失败
- 保留原始响应日志

## 5. 阶段四：前端页面真实化方案

## 5.1 页面目标

把当前 [src/pages/ai-creation/index.tsx](/home/junxun/ai-comic/AI-comic/src/pages/ai-creation/index.tsx) 从静态演示页改成真实的小说转漫画工作台。

## 5.2 当前页面问题

当前页面有几个明显不匹配点：

- 输入标签是 `manual / upload / crawl`
- 生成逻辑还是 `setTimeout + picsum` 模拟
- 没有小说概念
- 没有章节概念
- 没有角色展示
- 没有 API 请求

## 5.3 建议页面结构

建议分成四个区块。

### 区块一：小说管理

包含：

- 选择已有小说下拉框
- 创建小说弹窗或侧边表单
- 显示小说基础信息

字段建议：

- 小说名称
- 简介
- 漫画风格
- 当前章节数
- 当前角色数

### 区块二：章节输入

保留两种模式即可：

- 手动输入
- 本地上传

不建议第一期保留“获取小说”。

原因：

- 需求里已经明确是按章节上传或输入
- 爬取小说会带来额外解析、版权和站点适配问题

章节输入区建议字段：

- 章节号
- 章节标题
- 章节正文
- 字数统计
- 上传 `.txt`

交互规则：

- 超过 `5000` 字立即提示
- 未选择小说时不可提交章节
- 提交后自动调用“新增章节”

### 区块三：章节分析结果

展示内容：

- 章节摘要
- 场景列表
- 分镜列表
- 分析状态

操作：

- 触发分析
- 重新分析

### 区块四：角色结果面板

展示内容：

- 本章出现角色
- `reuse / update / create` 标签
- 角色变更摘要
- 小说全局角色库简表

## 5.4 前端接口调用关系

建议前端调用顺序：

1. 进入页面拉取小说列表 `GET /api/novels`
2. 选择小说后拉取章节列表 `GET /api/novels/:novelId/chapters`
3. 同时拉取角色列表 `GET /api/novels/:novelId/characters`
4. 新增章节 `POST /api/novels/:novelId/chapters`
5. 提交分析 `POST /api/chapters/:chapterId/analyze`
6. 刷新章节详情 `GET /api/chapters/:chapterId`

## 5.5 前端状态设计

建议最小状态：

- `novels`
- `selectedNovelId`
- `chapters`
- `selectedChapterId`
- `characters`
- `chapterForm`
- `analysisDetail`
- `isSubmitting`
- `isAnalyzing`

## 5.6 前端文案建议

为了匹配真实业务，建议把页面标题从“AI漫画创作”调整为：

- `小说转漫画`

按钮文案建议：

- `创建小说`
- `保存章节`
- `开始分析`
- `重新分析`

## 6. 推荐实施顺序

文档阶段建议仍按下面顺序落地。

1. 先出 Drizzle schema 草案和迁移清单
2. 再出接口文档和请求响应示例
3. 再出千问 Prompt 与 JSON schema
4. 最后出前端交互稿和页面字段映射

## 7. 验收标准

如果后续按本文档实现，第一版完成时应满足：

- 用户能创建小说
- 用户能为小说新增章节
- 章节内容超过 `5000` 字会被拒绝
- 用户能对章节触发分析
- 系统能输出章节摘要和分镜
- 系统能识别角色并区分 `reuse / update / create`
- 小说角色库会随着章节推进持续沉淀

## 8. 下一份文档建议

如果你继续只要文档，下一步最有价值的是再补两份：

- `Drizzle schema 草案文档`
- `千问 Prompt + JSON schema 文档`

这样你后面不管是自己写代码，还是让我再接着做文档，都能直接落地。
