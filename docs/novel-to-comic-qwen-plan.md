# 小说转漫画改造文档（千问 HTTP 接口方案）

## 1. 目标

基于当前项目，新增一个“小说转漫画”能力，支持两种章节输入方式：

- 手动输入章节文本
- 上传章节文件后导入文本

约束：

- 单次章节内容最多 `5000` 字
- 小说以“章节”为最小处理单元
- 数据模型至少包含：小说表、章节表、角色表
- 新章节分析时：
  - 已有角色且信息无变化：复用旧角色
  - 已有角色但设定有补充或修正：更新角色
  - 出现新角色：新增角色

本阶段只输出改造方案，不直接修改业务代码。

## 2. 当前项目现状

### 2.1 前端

- 路由入口是 `src/main.tsx`，挂载的是 `RouterProvider`
- AI 创作页是 `src/pages/ai-creation/index.tsx`
- 当前 AI 创作页仍是本地模拟数据和假生成结果，没有真实接口联动
- 前端请求封装已存在：`src/api/index.ts`

### 2.2 后端

- 当前服务入口：`src/service/main.ts`
- 当前只实现了登录/注册接口
- 尚无小说、章节、角色、AI 调用相关服务

### 2.3 数据库

- 当前 Drizzle schema 只有 `users` 表
- Supabase PostgreSQL 已可连接

结论：这个需求属于“新增一条完整业务线”，需要同时补齐数据库、后端接口、AI 接入、前端页面交互。

## 3. 建议范围

建议先做 MVP，不直接生成漫画图片，先把“小说章节解析 -> 角色沉淀 -> 章节结构化结果”跑通。

MVP 输出：

- 小说基础信息
- 章节内容
- 章节摘要
- 章节分镜草案
- 角色库
- 角色在每章中的变化记录

后续再接“分镜出图”能力。

## 4. 推荐业务流程

### 4.1 创建小说

用户先创建一本小说，填写：

- 小说名称
- 简介
- 标签
- 漫画风格
- 目标受众

### 4.2 新增章节

新增章节时支持两种来源：

- 手动粘贴文字
- 上传 `.txt` 文件并读取文本

后端统一处理成：

- `chapterTitle`
- `chapterContent`
- `contentLength`

校验规则：

- 去掉首尾空白后不能为空
- 字数不能超过 `5000`

### 4.3 章节分析

保存章节后，后端调用千问 HTTP 接口，对当前章节做结构化分析。

分析输入包括：

- 当前章节文本
- 当前小说已有角色列表
- 最近几章的摘要
- 漫画风格配置

分析输出建议统一成 JSON，至少包含：

- 章节摘要
- 场景列表
- 分镜建议列表
- 本章涉及角色列表
- 每个角色的新增信息或变化信息

### 4.4 角色合并

后端根据 AI 返回的角色结果做角色归并：

- 能匹配到已有角色：复用角色 ID
- 已有角色信息被补充：更新角色主档案
- 无法匹配到已有角色：新增角色

### 4.5 结果回写

章节分析完成后，写回数据库：

- 章节表保存原文、摘要、状态、AI 结果
- 角色表保存最新角色档案
- 关系表保存“本章出现了哪些角色、角色在本章有什么变化”

## 5. 数据库设计

## 5.1 核心原则

用户要求至少有：

- 小说表
- 章节表
- 角色表

为了支持“角色在新章节里更新/复用”的可追踪能力，建议额外加一个关系表。

## 5.2 表结构建议

### `novels`

用途：保存一本小说的主信息。

建议字段：

- `id`
- `user_id`
- `title`
- `description`
- `status`
- `style`
- `source_type`
- `total_chapters`
- `created_at`
- `updated_at`

说明：

- `user_id` 关联当前登录用户
- `status` 可取 `draft`、`active`、`archived`

### `chapters`

用途：保存小说章节。

建议字段：

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

说明：

- `content` 保存原始文本
- `summary` 保存章节摘要
- `storyboard_json` 保存分镜建议
- `analysis_json` 保存 AI 原始结构化结果
- `status` 可取 `pending`、`processing`、`completed`、`failed`

### `characters`

用途：保存一本小说下的角色主档案。

建议字段：

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

说明：

- 一条记录代表“当前最新角色档案”
- `version` 每次角色被更新时递增
- `first_chapter_id` / `last_chapter_id` 方便追踪首次出现和最近出现

### `chapter_characters`

用途：保存“章节与角色”的关系，以及本章对角色的影响。

建议字段：

- `id`
- `chapter_id`
- `character_id`
- `role_in_chapter`
- `is_new`
- `is_updated`
- `change_summary`
- `extracted_json`
- `created_at`

说明：

- `is_new = true` 表示本章首次识别出该角色
- `is_updated = true` 表示本章对角色档案做了更新
- `extracted_json` 保存本章提取到的角色片段，便于回溯

## 6. 角色复用与更新规则

## 6.1 归并目标

避免同一个角色被重复创建多份，同时保留角色随着剧情推进产生的设定补充。

## 6.2 匹配规则

先做工程规则匹配，再做 AI 辅助判断，不建议完全依赖模型自由判断。

第一层：规则匹配

- 角色名完全一致
- 别名命中已有角色别名
- 角色名相似且身份描述高度接近

第二层：AI 辅助判定

当规则匹配不确定时，让千问返回：

- `matchedCharacterId`
- `confidence`
- `reason`

## 6.3 更新策略

命中已有角色后，按字段处理：

- 空字段可被补充
- 明显新增设定可追加
- 冲突设定不直接覆盖，优先写入 `change_summary`
- 只有高置信且可解释的更新才覆盖主档案

建议更新优先级：

- 外貌补充：可更新
- 性格补充：可更新
- 能力补充：可更新
- 身份冲突：标记人工复核
- 姓名变更：只加别名，不直接改主名

## 6.4 角色处理结果

每个角色识别结果统一输出三种动作之一：

- `reuse`
- `update`
- `create`

## 7. 千问 HTTP 接口接入方案

## 7.1 接入原则

千问 API 只允许后端调用，前端不直连。

原因：

- 保护 API Key
- 统一做限流、重试、日志、结构化解析
- 方便后续替换模型供应商

## 7.2 服务端封装

建议新增一个独立 AI 服务层，例如：

- `src/service/lib/ai/qwen-client.ts`
- `src/service/services/novelService`
- `src/service/controllers/novelController`

建议环境变量：

- `QWEN_API_URL`
- `QWEN_API_KEY`
- `QWEN_MODEL`
- `QWEN_TIMEOUT_MS`

## 7.3 调用方式

后端对千问统一封装一个“结构化章节分析”方法，例如：

- 输入：章节文本、已有角色、小说配置
- 输出：严格 JSON

建议服务端对模型返回做两层处理：

- 第一层：拿到原始响应
- 第二层：转成内部标准结构

不要让业务代码直接依赖模型原始字段。

## 7.4 Prompt 约束

章节分析 Prompt 必须强约束输出 JSON，禁止自由散文式回答。

建议要求模型输出：

- 章节摘要
- 场景列表
- 角色列表
- 每个角色的动作类型：`reuse | update | create`
- 分镜列表

建议显式告诉模型：

- 输入最大 5000 字
- 只基于提供文本判断
- 不可捏造章节外设定
- 角色重复时必须优先复用已有角色

## 8. 后端接口设计

建议新增以下接口：

### 小说相关

- `POST /api/novels`
- `GET /api/novels`
- `GET /api/novels/:novelId`

### 章节相关

- `POST /api/novels/:novelId/chapters`
- `GET /api/novels/:novelId/chapters`
- `GET /api/chapters/:chapterId`
- `POST /api/chapters/:chapterId/analyze`

### 角色相关

- `GET /api/novels/:novelId/characters`
- `GET /api/characters/:characterId`

## 9. 前端改造建议

当前 `src/pages/ai-creation/index.tsx` 可以直接演进为第一版入口页。

建议改造为三个区域：

### 9.1 小说选择区

- 创建小说
- 选择已有小说
- 显示当前小说的章节数、角色数

### 9.2 章节输入区

- 手动输入
- 本地上传 `.txt`
- 实时字数统计
- 超过 `5000` 字阻止提交

### 9.3 分析结果区

- 章节摘要
- 分镜结果
- 本章识别角色
- 角色变化说明

## 10. 任务拆分建议

建议按下面顺序实施：

### 阶段 1：数据库

- 新增 Drizzle schema
- 新增迁移文件
- 跑通小说、章节、角色基础表

### 阶段 2：后端基础接口

- 新增 novels / chapters / characters 路由
- 完成新增小说、新增章节、查询详情

### 阶段 3：千问接入

- 封装 Qwen HTTP Client
- 新增章节分析服务
- 打通角色复用/更新逻辑

### 阶段 4：前端联调

- AI 创作页从静态改为真实接口
- 接入小说创建、章节输入、分析展示

### 阶段 5：增强

- 支持失败重试
- 支持章节重新分析
- 支持角色人工修正
- 支持后续漫画图片生成

## 11. 风险与注意点

### 11.1 角色重复识别

风险：

- 同一个角色被不同称呼重复创建

处理：

- 别名机制
- 规则匹配优先
- 低置信度时标记复核

### 11.2 模型输出不稳定

风险：

- JSON 不合法
- 字段缺失
- 角色动作判断漂移

处理：

- 严格 schema 校验
- 失败自动重试一次
- 保存原始响应便于排查

### 11.3 大文本与成本

风险：

- 多章节上下文过长导致成本增加

处理：

- 当前只传“当前章节 + 历史角色摘要 + 最近章节摘要”
- 不把整本小说全部送入模型

### 11.4 直接覆盖角色资料

风险：

- 模型误判导致角色主档案被污染

处理：

- 冲突字段不直接覆盖
- 记录变更摘要
- 后续预留人工审核入口

## 12. 推荐的 MVP 决策

为了尽快落地，建议先按下面的约束实现：

- 只支持文本输入和 `.txt` 上传
- 每章最多 `5000` 字
- 只做章节分析和角色沉淀
- 暂不做图片生成
- 角色更新先采用“保守更新”策略

这样可以先把核心价值跑通：

- 按章节处理小说
- 累积角色设定
- 新角色自动加入
- 老角色自动复用或补充更新

## 13. 建议落库字段最小集

如果你想先压缩开发量，最小可落地字段如下。

`novels`

- `id`
- `user_id`
- `title`
- `description`
- `created_at`

`chapters`

- `id`
- `novel_id`
- `chapter_no`
- `title`
- `content`
- `summary`
- `analysis_json`
- `status`

`characters`

- `id`
- `novel_id`
- `name`
- `appearance`
- `personality`
- `background`
- `first_chapter_id`
- `last_chapter_id`
- `version`

`chapter_characters`

- `id`
- `chapter_id`
- `character_id`
- `is_new`
- `is_updated`
- `change_summary`

## 14. 本文档对应的下一步

如果你确认这个方案，我建议下一步按下面顺序继续：

1. 先落数据库 schema 和迁移设计
2. 再补后端 novels / chapters / characters / analyze 接口
3. 然后接千问 HTTP Client
4. 最后把 `src/pages/ai-creation/index.tsx` 接成真实页面

如果你愿意，我下一步可以继续给你出第二份更具体的文档：

- Drizzle 表结构草案
- 接口请求/响应示例
- 千问章节分析 JSON schema 草案
