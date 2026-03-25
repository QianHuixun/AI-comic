# 代码修改说明文档

## 1. 文档说明

本文档用于说明截至 2026-03-25 当前工作区内“小说转漫画”相关代码改动的目的、范围、实现方式与影响面。

本次改动不是单点修复，而是一次从数据库到后端、再到前端页面的成套落地，核心目标是把原先偏静态展示的 AI 创作页，升级为一个真实可用的“小说工作区”。

覆盖范围：

1. 数据库 Schema 与迁移
2. 后端应用入口、路由、控制器与服务层
3. 千问章节分析与分镜图生成能力接入
4. 前端 AI 创作页的真实化改造
5. 登录态存储、鉴权保护与接口联动
6. 测试入口与基础单测补充

## 2. 改动目标

本次改动要解决的问题主要有四个：

1. 系统此前缺少“小说 -> 章节 -> 角色 -> 漫画页”的持久化数据链路。
2. 前端 `ai-creation` 页面以静态展示为主，无法直接驱动真实业务流程。
3. 后端仅有基础鉴权接口，缺少小说、章节、角色、分析、漫画生成等业务接口。
4. 登录态与业务接口没有完全串起来，页面缺少受保护访问控制。

因此，这次改动的业务闭环是：

1. 用户登录后进入受保护的 AI 创作页
2. 创建小说
3. 手动输入章节或上传 TXT
4. 调用千问完成章节分析
5. 沉淀角色主档案与章节角色关系
6. 基于分镜草案生成分镜图
7. 自动合成漫画页并持久化

## 3. 改动概览

从实现层面看，本次改动新增了三类核心能力。

### 3.1 数据持久化能力

新增了围绕小说转漫画流程的完整表结构：

- `novels`
- `chapters`
- `characters`
- `chapter_characters`
- `storyboard_images`
- `comic_pages`

同时补充了多个业务枚举：

- `novel_status`
- `novel_source_type`
- `chapter_status`
- `character_action`
- `comic_asset_status`

对应代码主要在：

- `src/db/schema.ts`
- `drizzle/0002_oval_loki.sql`
- `drizzle/0003_steady_trace.sql`
- `drizzle/0004_nasty_pixie.sql`

### 3.2 后端业务能力

后端由单一 `AuthRouter` 扩展为完整应用入口，新增：

- 小说接口
- 章节接口
- 角色接口
- 章节分析接口
- 漫画生成接口

同时把原本直接在 `main.ts` 中拼装应用的方式，拆成了 `createApp()`，便于后续测试与扩展。

### 3.3 前端工作区能力

`src/pages/ai-creation/index.tsx` 从静态模板页改为真实工作台，支持：

- 登录后加载当前用户小说工作区
- 创建小说
- 新增章节
- 上传 TXT 章节
- 查看章节详情
- 发起章节分析
- 发起漫画生成
- 浏览角色档案、分镜图与漫画页产物

## 4. 数据库改动说明

## 4.1 新增表结构

### `novels`

用途：小说主档案。

关键字段：

- `user_id`：归属用户
- `title`：小说标题
- `description`：小说简介
- `style`：漫画风格
- `source_type`：来源类型，区分手动输入或上传
- `status`：小说状态
- `total_chapters`：章节总数缓存

### `chapters`

用途：保存章节原文与分析结果。

关键字段：

- `chapter_no`
- `title`
- `content`
- `content_length`
- `summary`
- `storyboard_json`
- `analysis_json`
- `analysis_error`
- `analysis_attempts`
- `last_analyzed_at`
- `status`

关键约束：

- 同一本小说内 `chapter_no` 唯一
- `content_length` 必须大于 0 且不超过 5000

### `characters`

用途：保存角色当前主档案。

关键字段：

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

关键设计点：

- 一个角色只保留“当前最新版本”
- 每次被高置信度新信息补充时，`version` 自增

### `chapter_characters`

用途：记录角色在某一章节中的出现与变化。

关键字段：

- `action`：`reuse | update | create`
- `role_in_chapter`
- `change_summary`
- `extracted_json`
- `is_new`
- `is_updated`

这张表把“角色主档案”和“角色在具体章节中的变化”拆开了，避免角色主表被章节级噪声污染。

### `storyboard_images`

用途：持久化分镜图生成结果。

关键字段：

- `panel_no`
- `scene_title`
- `prompt_text`
- `revised_prompt`
- `remote_url`
- `image_data`
- `mime_type`
- `status`
- `error_message`

### `comic_pages`

用途：持久化按页合成后的漫画页产物。

关键字段：

- `page_no`
- `title`
- `layout_json`
- `panel_image_ids_json`
- `image_data`
- `mime_type`

## 4.2 索引与约束

本次改动补充了面向查询与幂等的索引/唯一约束，包括：

- 小说按用户和创建时间查询
- 章节按 `novel_id + chapter_no` 查询
- 章节按 `novel_id + status` 查询
- 角色按 `novel_id + name` 查询
- 章节角色关联唯一
- 分镜图按 `chapter_id + panel_no` 唯一
- 漫画页按 `chapter_id + page_no` 唯一

这些约束直接服务于工作区列表加载、章节详情展示、角色匹配和重复生成控制。

## 5. 后端改动说明

## 5.1 应用入口调整

原先 `src/service/main.ts` 直接创建 `express` 实例并挂单一路由。现在改为：

- `src/service/app.ts`：负责统一装配中间件与业务路由
- `src/service/main.ts`：只负责读取端口并启动服务

这样做的价值有两个：

1. 路由注册更集中
2. 后续更容易做 HTTP 层测试

## 5.2 新增业务路由

新增的核心路由如下：

- `POST /api/novels`
- `GET /api/novels`
- `GET /api/novels/:novelId`
- `POST /api/novels/:novelId/chapters`
- `GET /api/novels/:novelId/chapters`
- `GET /api/novels/:novelId/characters`
- `GET /api/chapters/:chapterId`
- `POST /api/chapters/:chapterId/analyze`
- `POST /api/chapters/:chapterId/comic`
- `GET /api/characters/:characterId`

其中：

- 小说路由负责工作区入口数据
- 章节路由负责详情、分析与漫画生成
- 角色路由负责角色详情侧边信息

## 5.3 控制器与服务层拆分

新增或扩展了以下服务模块：

- `NovelService`
- `ChapterService`
- `CharacterService`
- `ChapterAnalysisService`
- `CharacterMergeService`
- `ComicGenerationService`

职责划分如下：

- `NovelService`：小说创建、列表、详情统计
- `ChapterService`：章节创建、章节列表、章节详情
- `CharacterService`：角色列表、角色详情
- `ChapterAnalysisService`：章节分析流程编排与失败状态管理
- `CharacterMergeService`：角色匹配、增量合并、章节角色关联写入
- `ComicGenerationService`：分镜图生成、漫画页组装、结果持久化

这种拆法的优点是，业务流程虽然长，但职责边界比较清晰，后续定位问题更容易。

## 5.4 章节创建逻辑

章节创建支持两种入口：

1. 直接提交文本内容
2. 上传 TXT 文件，由后端读取 buffer 作为正文

当前校验规则：

- `novelId`、`chapterNo` 必须是正整数
- 章节标题不能为空
- 章节内容不能为空
- 章节内容不得超过 5000 字
- 同一小说内 `chapterNo` 不可重复

写入章节后，还会同步回写小说：

- 更新 `totalChapters`
- 标记 `sourceType` 为 `manual` 或 `upload`

## 5.5 章节分析逻辑

章节分析由 `ChapterAnalysisService` 驱动，完整流程如下：

1. 校验章节与用户归属关系
2. 拦截“正在分析中”与“已完成但未 force 重跑”的情况
3. 查询当前小说的已知角色
4. 查询最近 3 章摘要，作为上下文
5. 先把章节状态置为 `processing`
6. 调用 `QwenClient.analyzeChapter()`
7. 对返回结构做字段级校验
8. 把结构化结果交给 `CharacterMergeService`
9. 成功后把章节写为 `completed`
10. 失败时写回 `failed` 与 `analysis_error`

这里有两个重要设计点：

1. 分析前就先更新状态和尝试次数，便于可观测性。
2. 失败后保留错误信息，前端可以直接展示最近一次失败原因。

## 5.6 角色合并逻辑

`CharacterMergeService` 是本次改动里最关键的业务模块之一。

它解决的问题是：模型抽出来的角色信息，如何稳定地合并进已有角色库，而不是每章都重复造角色。

当前匹配顺序为：

1. `matchedCharacterId`
2. 精确角色名
3. 别名匹配
4. 高置信度模糊匹配

合并策略为：

- 不存在匹配角色时，新建角色并记录 `create`
- 存在匹配角色且有可信增量信息时，更新角色并记录 `update`
- 仅确认出场但无有效增量时，记录 `reuse`

字段更新策略偏保守：

- 只有在新值非空、置信度足够高时才覆盖
- 性别和年龄等冲突字段不会强覆盖
- 关系信息会去重后合并
- 角色别名会去重追加

这个策略的目的，是降低模型偶发误识别对角色主档案的破坏。

## 5.7 漫画生成逻辑

`ComicGenerationService` 建立在章节分析结果之上。

流程如下：

1. 读取章节分镜草案
2. 若没有分镜，则拒绝生成
3. 如果 `force=true`，先删除已有分镜图和漫画页
4. 逐个 panel 构建 prompt
5. 调用 `QwenImageClient.generateImage()`
6. 将生成结果写入 `storyboard_images`
7. 每 4 张 panel 合成 1 页 SVG 漫画页
8. 把漫画页写入 `comic_pages`

这里的一个实现特点是：

- 漫画页并不是直接由模型返回，而是后端用已有 panel 图像拼接成 SVG Data URL。

这样做的收益是：

- 生成逻辑更可控
- 结果可以直接持久化
- 页面展示更稳定

## 6. 鉴权与登录态改动

## 6.1 JWT 内容收敛

此前 JWT 逻辑偏示例化，存在把登录参数直接作为 token payload 的问题。现在已调整为明确的 `AuthSession` 结构：

- `userId`
- `phoneNumber`
- `name`

这样后端鉴权和前端会话读取都更稳定，也避免把密码信息带进 token。

## 6.2 鉴权中间件改造

`src/service/proxy/auth.proxy.ts` 现在负责：

- 校验 `Authorization: Bearer <token>`
- 解析 token
- 把解码后的用户会话挂到请求对象上
- 通过 `getAuthenticatedUser()` 给控制器读取

同时新增了统一的 401 语义，便于前端统一处理失效登录态。

## 6.3 前端会话管理

前端新增了 `src/lib/auth/session.ts` 配套逻辑，并完成了以下联动：

- 登录成功后同时保存 token 与用户摘要
- `ProtectedRoute` 基于本地 token 阻止未登录访问 `/ai-creation`
- Axios 响应拦截器在收到 401 时清空本地会话并跳转登录页

这让“登录 -> 进入工作区 -> token 过期后回登录页”的链路闭合了。

## 7. 前端页面改动说明

## 7.1 页面定位变化

`src/pages/ai-creation/index.tsx` 的定位已经从“AI 图片创作展示页”转为“小说转漫画工作区”。

此前页面的主要内容包括：

- 静态模板
- 历史记录展示
- 偏演示性质的本地状态

现在页面已经切换为真实业务状态驱动，核心区域包括：

- 工作区加载状态
- 小说列表与小说概览
- 章节录入区
- 角色库
- 角色详情
- 章节详情
- 分镜草案
- 分镜图结果
- 漫画页结果

## 7.2 新增前端 API 层

新增 `src/api/novel-comic.ts`，集中管理小说转漫画相关请求：

- 查询小说列表
- 创建小说
- 查询小说详情
- 查询章节列表
- 查询角色列表
- 创建章节
- 上传章节
- 查询章节详情
- 分析章节
- 生成漫画
- 查询角色详情

同时配套 `src/lib/types/ai-creation.ts` 扩充了完整的前端类型定义，避免页面层直接写 `any`。

## 7.3 页面交互变化

页面新增的关键交互包括：

1. 首次加载自动读取当前登录用户工作区
2. 小说切换后自动刷新章节与角色
3. 选中章节后加载章节详情
4. 选中角色后加载角色详情
5. 手动输入章节时实时计算字数并限制 5000
6. 对已分析或已生成的章节支持 `force` 重跑
7. 在页面中直接展示分析失败原因与生成产物

## 7.4 路由保护

`/ai-creation` 已改为受保护路由。未登录用户不能直接访问该页面，必须先完成登录。

## 8. AI 能力接入说明

本次改动新增了两类 AI 能力封装：

- `QwenClient`：用于章节分析
- `QwenImageClient`：用于分镜图生成

配套新增内容包括：

- `src/service/lib/ai/chapter-analysis-schema.ts`
- 章节分析结构化类型定义
- 请求超时、重试与错误归一化测试

章节分析接口关注的是结构化 JSON 输出，重点产出：

- 摘要
- 场景拆解
- 分镜草案
- 角色分析结果

分镜图生成接口关注的是图片资产落库，重点产出：

- 每个 panel 的图像结果
- 按页聚合后的漫画页 SVG

## 9. 测试与工程化改动

## 9.1 测试入口

`package.json` 新增：

- `npm test`

对应执行方式为：

- `node --import tsx --test`

## 9.2 新增测试文件

当前已看到的测试覆盖包括：

- `tests/http-layer.test.ts`
- `tests/chapter-analysis-service.test.ts`
- `tests/qwen-client.test.ts`

覆盖重点：

- 鉴权中间件行为
- 控制器参数透传
- 角色合并行为
- 千问客户端重试与错误归一化

## 9.3 数据库连接脚本调整

`scripts/db.ts` 与 `src/db/connection.ts` 补充了更适合 Supabase/pgbouncer 的连接配置：

- `ssl.rejectUnauthorized = false`
- `prepare = false`

同时把数据库连通性日志改得更明确，方便排查网络、用户、实例地址等问题。

## 10. 主要影响文件

本次改动的核心文件可以按职责快速定位：

### 数据层

- `src/db/schema.ts`
- `drizzle/0002_oval_loki.sql`
- `drizzle/0003_steady_trace.sql`
- `drizzle/0004_nasty_pixie.sql`

### 后端入口与路由

- `src/service/app.ts`
- `src/service/main.ts`
- `src/service/router/novel.router/index.ts`
- `src/service/router/chapter.router/index.ts`
- `src/service/router/character.router/index.ts`

### 后端核心服务

- `src/service/services/novelService/index.ts`
- `src/service/services/chapterService/index.ts`
- `src/service/services/chapterAnalysisService/index.ts`
- `src/service/services/characterMergeService/index.ts`
- `src/service/services/characterService/index.ts`
- `src/service/services/comicGenerationService/index.ts`

### AI 能力与错误处理

- `src/service/lib/ai/qwen-client.ts`
- `src/service/lib/ai/qwen-image-client.ts`
- `src/service/lib/http-error/index.ts`

### 前端页面与接口

- `src/pages/ai-creation/index.tsx`
- `src/api/novel-comic.ts`
- `src/lib/types/ai-creation.ts`
- `src/router/index.tsx`
- `src/router/ProtectRoute.tsx`
- `src/pages/login/index.tsx`
- `src/api/index.ts`
- `src/lib/auth/session.ts`

### 测试

- `tests/http-layer.test.ts`
- `tests/chapter-analysis-service.test.ts`
- `tests/qwen-client.test.ts`

## 11. 当前收益

从产品和工程两个层面看，这次改动已经带来以下收益：

1. 小说转漫画流程首次具备了真实数据闭环。
2. 前端不再依赖演示数据，能够直接驱动后端业务。
3. 角色沉淀逻辑从“每章独立结果”升级为“跨章节持续演化”。
4. 漫画生成结果能够持久化保存，而不是只存在内存态。
5. 鉴权链路更完整，工作区权限边界更清晰。
6. 后端职责拆分后，后续继续补接口和测试的成本更低。

## 12. 已知限制与后续建议

虽然本次改动已经打通主流程，但仍有一些明显边界。

### 12.1 当前限制

- 章节内容上限仍为 5000 字，更长小说需要拆章或后续扩容。
- “获取小说/爬取小说”入口仍处于禁用状态，尚未落地抓取逻辑。
- 漫画页目前是基于分镜图的 SVG 拼装，不是真正的整页模型生成。
- 角色冲突处理以保守策略为主，暂未提供人工审核流程。
- 失败重试依赖 `force=true`，尚未做更细的任务队列化管理。

### 12.2 后续建议

1. 把分析与生成流程异步任务化，避免长请求阻塞。
2. 为章节分析和漫画生成补充更完整的集成测试。
3. 给角色冲突增加人工确认或回滚能力。
4. 为 `storyboard_images` 和 `comic_pages` 增加外部对象存储方案，避免数据库承载过多大体积 `image_data`。
5. 把前端大页面继续拆分成多个子组件，降低 `src/pages/ai-creation/index.tsx` 的复杂度。

## 13. 结论

这次代码改动完成的不是“页面美化”或“接口补充”，而是小说转漫画能力的一次基础设施级落地。

它已经把数据库模型、用户鉴权、章节分析、角色沉淀、分镜图生成、漫画页持久化和前端工作区串成了一条真实业务链路。后续工作的重点，不再是“能不能做”，而是围绕稳定性、可扩展性和任务化运行机制继续增强。
