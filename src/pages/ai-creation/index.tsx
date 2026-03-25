import { useEffect, useState } from "react";
import {
  analyzeChapter,
  createChapter,
  createNovel,
  fetchChapterDetail,
  fetchCharacterDetail,
  fetchCharacters,
  fetchChapters,
  fetchNovelDetail,
  fetchNovels,
  generateComic,
  getApiErrorMessage,
  uploadChapter,
} from "../../api/novel-comic.ts";
import type {
  ChapterDetail,
  ChapterRecord,
  CharacterAction,
  CharacterDetail as CharacterDetailRecord,
  CharacterRecord,
  InputTab,
  InputTabKey,
  NovelDetail,
  NovelRecord,
  StyleOption,
  StoryboardItem,
} from "../../lib/types/ai-creation.ts";
import {
  GridIcon,
  HistoryIcon,
  ImageIcon,
  SparklesIcon,
  StarIcon,
} from "../../components/Icon/ai-creation";
import { getStoredAuthUser } from "../../lib/auth/session.ts";

const inputTabs: ReadonlyArray<InputTab> = [
  { key: "manual", label: "手动输入" },
  { key: "upload", label: "上传 TXT" },
  { key: "crawl", label: "获取小说", disabled: true },
] as const;

const styleOptions: ReadonlyArray<StyleOption> = [
  { label: "请选择风格", value: "" },
  { label: "日漫", value: "anime" },
  { label: "美漫", value: "western" },
  { label: "国风", value: "chinese" },
  { label: "Q版", value: "q-version" },
] as const;

function getCharacterCount(value: string): number {
  return Array.from(value.trim()).length;
}

function formatDate(value: string | null): string {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getActionLabel(action: CharacterAction): string {
  if (action === "create") {
    return "新增";
  }

  if (action === "update") {
    return "更新";
  }

  return "复用";
}

function getActionBadgeClass(action: CharacterAction): string {
  if (action === "create") {
    return "bg-[rgba(56,112,56,0.12)] text-[color:var(--accent-2)]";
  }

  if (action === "update") {
    return "bg-[rgba(255,153,51,0.12)] text-[color:var(--secondary)]";
  }

  return "bg-[rgba(31,111,235,0.12)] text-[color:var(--info)]";
}

function getChapterStatusLabel(status: ChapterRecord["status"] | undefined): string {
  if (status === "processing") {
    return "分析中";
  }

  if (status === "completed") {
    return "已完成";
  }

  if (status === "failed") {
    return "失败";
  }

  return "待分析";
}

function getChapterStatusClass(status: ChapterRecord["status"] | undefined): string {
  if (status === "processing") {
    return "bg-[rgba(31,111,235,0.12)] text-[color:var(--info)]";
  }

  if (status === "completed") {
    return "bg-[rgba(56,112,56,0.12)] text-[color:var(--accent-2)]";
  }

  if (status === "failed") {
    return "bg-[rgba(201,79,70,0.12)] text-[color:var(--error)]";
  }

  return "bg-[rgba(255,153,51,0.12)] text-[color:var(--secondary)]";
}

function getStyleLabel(value: string | null): string {
  const matched = styleOptions.find((option) => option.value === (value ?? ""));
  return matched?.label ?? "未设置";
}

function getStoryboards(detail: ChapterDetail | null): StoryboardItem[] {
  if (!detail) {
    return [];
  }

  return (
    detail.storyboardJson?.storyboards ??
    detail.analysisJson?.storyboards ??
    []
  );
}

export default function AICreation() {
  const [currentUser] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return getStoredAuthUser();
  });
  const [workspaceMessage, setWorkspaceMessage] = useState("已接入当前登录账号，点击刷新即可加载工作区。");
  const [workspaceError, setWorkspaceError] = useState("");
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(false);
  const [isCreatingNovel, setIsCreatingNovel] = useState(false);
  const [isSubmittingChapter, setIsSubmittingChapter] = useState(false);
  const [isAnalyzingChapter, setIsAnalyzingChapter] = useState(false);
  const [isGeneratingComic, setIsGeneratingComic] = useState(false);

  const [novels, setNovels] = useState<NovelRecord[]>([]);
  const [selectedNovelId, setSelectedNovelId] = useState<number | null>(null);
  const [novelDetail, setNovelDetail] = useState<NovelDetail | null>(null);
  const [chapters, setChapters] = useState<ChapterRecord[]>([]);
  const [characters, setCharacters] = useState<CharacterRecord[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [chapterDetail, setChapterDetail] = useState<ChapterDetail | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [characterDetail, setCharacterDetail] = useState<CharacterDetailRecord | null>(null);
  const [characterDetailError, setCharacterDetailError] = useState("");
  const [isLoadingCharacterDetail, setIsLoadingCharacterDetail] = useState(false);
  const [chapterAnalysisError, setChapterAnalysisError] = useState("");

  const [novelTitle, setNovelTitle] = useState("");
  const [novelDescription, setNovelDescription] = useState("");
  const [style, setStyle] = useState("");

  const [activeInputTab, setActiveInputTab] = useState<InputTabKey>("manual");
  const [chapterNo, setChapterNo] = useState("1");
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const chapterLength = getCharacterCount(chapterContent);
  const isManualOverLimit = chapterLength > 5000;
  const selectedChapterRecord =
    selectedChapterId === null
      ? null
      : chapters.find((chapter) => chapter.id === selectedChapterId) ?? null;
  const shouldForceAnalyze =
    selectedChapterRecord?.status === "completed" ||
    selectedChapterRecord?.status === "failed";
  const shouldForceGenerateComic =
    (chapterDetail?.storyboardImages.length ?? 0) > 0 ||
    (chapterDetail?.comicPages.length ?? 0) > 0;

  useEffect(() => {
    if (!currentUser) {
      setWorkspaceError("未检测到有效登录信息，请重新登录。");
      return;
    }

    void handleLoadWorkspace();
  }, [currentUser?.id]);

  useEffect(() => {
    if (!currentUser || selectedNovelId === null) {
      return;
    }

    void loadNovelWorkspace(selectedNovelId);
  }, [currentUser, selectedNovelId]);

  useEffect(() => {
    if (selectedChapterId === null) {
      setChapterDetail(null);
      setChapterAnalysisError("");
      return;
    }

    void loadChapterDetail(selectedChapterId);
  }, [selectedChapterId]);

  useEffect(() => {
    if (selectedCharacterId === null) {
      setCharacterDetail(null);
      setCharacterDetailError("");
      return;
    }

    void loadCharacterDetail(selectedCharacterId);
  }, [selectedCharacterId]);

  async function handleLoadWorkspace() {
    if (!currentUser) {
      setWorkspaceError("登录状态无效，请重新登录。");
      return;
    }

    setIsLoadingWorkspace(true);
    setWorkspaceError("");

    try {
      const data = await fetchNovels();
      setNovels(data);

      if (data.length === 0) {
        setSelectedNovelId(null);
        setNovelDetail(null);
        setChapters([]);
        setCharacters([]);
        setSelectedChapterId(null);
        setChapterDetail(null);
        setWorkspaceMessage("当前用户还没有小说，先创建一本小说。");
        return;
      }

      const nextNovelId =
        selectedNovelId !== null && data.some((item) => item.id === selectedNovelId)
          ? selectedNovelId
          : data[0].id;

      setSelectedNovelId(nextNovelId);
      setWorkspaceMessage(`已加载 ${data.length} 本小说。`);
    } catch (error) {
      setWorkspaceError(getApiErrorMessage(error));
    } finally {
      setIsLoadingWorkspace(false);
    }
  }

  async function loadNovelWorkspace(novelId: number) {
    setWorkspaceError("");

    try {
      const [detail, chapterList, characterList] = await Promise.all([
        fetchNovelDetail(novelId),
        fetchChapters(novelId),
        fetchCharacters(novelId),
      ]);

      setNovelDetail(detail);
      setChapters(chapterList);
      setCharacters(characterList);

      setSelectedChapterId((current) => {
        if (current !== null && chapterList.some((item) => item.id === current)) {
          return current;
        }

        return chapterList[0]?.id ?? null;
      });
      setSelectedCharacterId((current) => {
        if (current !== null && characterList.some((item) => item.id === current)) {
          return current;
        }

        return characterList[0]?.id ?? null;
      });
    } catch (error) {
      setWorkspaceError(getApiErrorMessage(error));
    }
  }

  async function loadChapterDetail(chapterId: number) {
    try {
      const detail = await fetchChapterDetail(chapterId);
      setChapterDetail(detail);
    } catch (error) {
      setWorkspaceError(getApiErrorMessage(error));
    }
  }

  async function loadCharacterDetail(characterId: number) {
    setIsLoadingCharacterDetail(true);
    setCharacterDetailError("");

    try {
      const detail = await fetchCharacterDetail(characterId);
      setCharacterDetail(detail);
    } catch (error) {
      setCharacterDetail(null);
      setCharacterDetailError(getApiErrorMessage(error));
    } finally {
      setIsLoadingCharacterDetail(false);
    }
  }

  async function handleCreateNovel() {
    if (!currentUser) {
      setWorkspaceError("登录状态无效，请重新登录。");
      return;
    }

    if (!novelTitle.trim()) {
      setWorkspaceError("请输入小说标题");
      return;
    }

    setIsCreatingNovel(true);
    setWorkspaceError("");

    try {
      const createdNovel = await createNovel({
        title: novelTitle.trim(),
        description: novelDescription.trim(),
        style,
      });

      setNovelTitle("");
      setNovelDescription("");
      setStyle("");
      setWorkspaceMessage(`小说《${createdNovel.title}》创建成功。`);
      await handleLoadWorkspace();
      setSelectedNovelId(createdNovel.id);
    } catch (error) {
      setWorkspaceError(getApiErrorMessage(error));
    } finally {
      setIsCreatingNovel(false);
    }
  }

  async function handleCreateChapter() {
    if (selectedNovelId === null) {
      setWorkspaceError("请先选择一本小说");
      return;
    }

    const chapterNoValue = Number(chapterNo);

    if (!Number.isInteger(chapterNoValue) || chapterNoValue <= 0) {
      setWorkspaceError("章节序号必须是正整数");
      return;
    }

    if (!chapterTitle.trim()) {
      setWorkspaceError("请输入章节标题");
      return;
    }

    if (activeInputTab === "crawl") {
      setWorkspaceError("获取小说功能还未接入，目前只支持手动输入和 TXT 上传");
      return;
    }

    if (activeInputTab === "manual") {
      if (!chapterContent.trim()) {
        setWorkspaceError("请输入章节正文");
        return;
      }

      if (isManualOverLimit) {
        setWorkspaceError("章节内容不能超过 5000 字");
        return;
      }
    }

    if (activeInputTab === "upload" && !selectedFile) {
      setWorkspaceError("请先选择 TXT 文件");
      return;
    }

    setIsSubmittingChapter(true);
    setWorkspaceError("");

    try {
      const createdChapter =
        activeInputTab === "upload" && selectedFile
          ? await uploadChapter(selectedNovelId, {
              chapterNo: chapterNoValue,
              title: chapterTitle.trim(),
              file: selectedFile,
            })
          : await createChapter(selectedNovelId, {
              chapterNo: chapterNoValue,
              title: chapterTitle.trim(),
              content: chapterContent.trim(),
            });

      setWorkspaceMessage(`章节《${createdChapter.title}》创建成功。`);
      setChapterTitle("");
      setChapterContent("");
      setSelectedFile(null);
      setActiveInputTab("manual");

      if (currentUser) {
        await loadNovelWorkspace(selectedNovelId);
      }

      setSelectedChapterId(createdChapter.id);
    } catch (error) {
      setWorkspaceError(getApiErrorMessage(error));
    } finally {
      setIsSubmittingChapter(false);
    }
  }

  async function handleAnalyzeChapter() {
    if (selectedChapterId === null) {
      setWorkspaceError("请先选择一个章节");
      return;
    }

    setIsAnalyzingChapter(true);
    setWorkspaceError("");
    setChapterAnalysisError("");

    try {
      const result = await analyzeChapter(selectedChapterId, {
        force: shouldForceAnalyze,
      });
      setWorkspaceMessage(
        `${shouldForceAnalyze ? "章节重新分析完成" : "章节分析完成"}：${result.summary}`,
      );

      if (selectedNovelId !== null && currentUser) {
        await loadNovelWorkspace(selectedNovelId);
      }

      await loadChapterDetail(selectedChapterId);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setWorkspaceError(message);
      setChapterAnalysisError(message);

      if (selectedNovelId !== null && currentUser) {
        await loadNovelWorkspace(selectedNovelId);
      }

      await loadChapterDetail(selectedChapterId);
    } finally {
      setIsAnalyzingChapter(false);
    }
  }

  async function handleGenerateComic() {
    if (selectedChapterId === null) {
      setWorkspaceError("请先选择一个章节");
      return;
    }

    if (!chapterDetail || getStoryboards(chapterDetail).length === 0) {
      setWorkspaceError("请先完成章节分析并生成分镜草案");
      return;
    }

    setIsGeneratingComic(true);
    setWorkspaceError("");

    try {
      const result = await generateComic(selectedChapterId, {
        force: shouldForceGenerateComic,
      });
      setWorkspaceMessage(
        `${shouldForceGenerateComic ? "漫画页重新生成完成" : "漫画页生成完成"}：已生成 ${result.storyboardImages.length} 张分镜图，${result.comicPages.length} 页漫画。`,
      );

      if (selectedNovelId !== null && currentUser) {
        await loadNovelWorkspace(selectedNovelId);
      }

      await loadChapterDetail(selectedChapterId);
    } catch (error) {
      setWorkspaceError(getApiErrorMessage(error));
      await loadChapterDetail(selectedChapterId);
    } finally {
      setIsGeneratingComic(false);
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f1_0%,#f6f8fb_35%,#eef4f7_100%)] text-[color:var(--text-primary)]">
      <main className="mx-auto max-w-[1480px] px-5 py-10">
        <section className="mb-8 overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,247,235,0.92))] p-6 shadow-[0_18px_60px_rgba(89,63,24,0.08)] min-[900px]:p-8">
          <div className="grid gap-6 min-[1100px]:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[rgba(255,153,51,0.12)] px-4 py-2 text-[13px] font-semibold text-[color:var(--secondary)]">
                <SparklesIcon className="h-4 w-4" />
                Qwen 章节分析工作台
              </div>
              <h1 className="max-w-[720px] text-[32px] font-black leading-[1.15] min-[900px]:text-[44px]">
                小说按章节入库，角色自动复用、更新与新增。
              </h1>
              <p className="mt-4 max-w-[760px] text-[15px] leading-7 text-[color:var(--text-secondary)]">
                当前工作台直接使用登录账号访问小说、章节、角色和分析接口。工作流是：登录后创建小说，再按章节提交正文或 TXT，最后触发 Qwen 分析并查看分镜与角色动作。
              </p>
            </div>

            <div className="rounded-[24px] bg-[rgba(34,42,54,0.94)] p-5 text-white shadow-[0_12px_30px_rgba(34,42,54,0.18)]">
              <div className="mb-4 text-sm font-semibold text-white/70">当前账号</div>
              <div className="flex flex-col gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <div className="text-[13px] text-white/60">用户</div>
                  <div className="mt-2 text-[16px] font-semibold text-white">
                    {currentUser?.name?.trim() || `用户 #${currentUser?.id ?? "--"}`}
                  </div>
                  <div className="mt-1 text-[13px] text-white/70">
                    {currentUser?.phoneNumber ?? "未读取到手机号"}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    className="rounded-xl bg-[linear-gradient(135deg,var(--secondary),#ffb34d)] px-5 py-3 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isLoadingWorkspace}
                    onClick={() => void handleLoadWorkspace()}
                    type="button"
                  >
                    {isLoadingWorkspace ? "加载中..." : "刷新工作区"}
                  </button>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[13px] leading-6 text-white/75">
                  {workspaceError ? (
                    <span className="text-[#ffd1cd]">{workspaceError}</span>
                  ) : (
                    workspaceMessage
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 min-[1180px]:grid-cols-[420px_minmax(0,1fr)]">
          <section className="space-y-6">
            <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
              <div className="mb-5 flex items-center gap-3">
                <StarIcon className="h-5 w-5 text-[color:var(--secondary)]" />
                <h2 className="text-xl font-bold">创建小说</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-[14px] font-semibold" htmlFor="novel-title">
                    小说标题
                  </label>
                  <input
                    className="w-full rounded-xl border border-[color:var(--border)] px-4 py-3 outline-none transition focus:border-[color:var(--secondary)]"
                    id="novel-title"
                    onChange={(event) => setNovelTitle(event.target.value)}
                    placeholder="例如：星河旅人"
                    value={novelTitle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[14px] font-semibold" htmlFor="novel-style">
                    漫画风格
                  </label>
                  <select
                    className="w-full rounded-xl border border-[color:var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[color:var(--secondary)]"
                    id="novel-style"
                    onChange={(event) => setStyle(event.target.value)}
                    value={style}
                  >
                    {styleOptions.map((option) => (
                      <option key={option.value || "empty"} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="mb-2 block text-[14px] font-semibold"
                    htmlFor="novel-description"
                  >
                    小说简介
                  </label>
                  <textarea
                    className="h-[120px] w-full rounded-xl border border-[color:var(--border)] px-4 py-3 outline-none transition focus:border-[color:var(--secondary)]"
                    id="novel-description"
                    onChange={(event) => setNovelDescription(event.target.value)}
                    placeholder="写小说的世界观、题材和风格目标。"
                    value={novelDescription}
                  />
                </div>

                <button
                  className="w-full rounded-xl bg-[linear-gradient(135deg,var(--secondary),var(--accent-600))] px-4 py-3 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isCreatingNovel}
                  onClick={() => void handleCreateNovel()}
                  type="button"
                >
                  {isCreatingNovel ? "创建中..." : "创建小说"}
                </button>
              </div>
            </div>

            <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
              <div className="mb-5 flex items-center gap-3">
                <ImageIcon className="h-5 w-5 text-[color:var(--secondary)]" />
                <h2 className="text-xl font-bold">新增章节</h2>
              </div>

              <div className="mb-4 flex gap-2 border-b border-[color:var(--border)] pb-3">
                {inputTabs.map((tab) => (
                  <button
                    className={[
                      "rounded-full px-4 py-2 text-[14px] font-semibold transition-all duration-300",
                      activeInputTab === tab.key
                        ? "bg-[rgba(255,153,51,0.14)] text-[color:var(--secondary)]"
                        : "text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-secondary)]",
                      tab.disabled ? "cursor-not-allowed opacity-50" : "",
                    ].join(" ")}
                    disabled={tab.disabled}
                    key={tab.key}
                    onClick={() => setActiveInputTab(tab.key)}
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 min-[520px]:grid-cols-[120px_minmax(0,1fr)]">
                  <div>
                    <label className="mb-2 block text-[14px] font-semibold" htmlFor="chapter-no">
                      章节序号
                    </label>
                    <input
                      className="w-full rounded-xl border border-[color:var(--border)] px-4 py-3 outline-none transition focus:border-[color:var(--secondary)]"
                      id="chapter-no"
                      min="1"
                      onChange={(event) => setChapterNo(event.target.value)}
                      type="number"
                      value={chapterNo}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[14px] font-semibold" htmlFor="chapter-title">
                      章节标题
                    </label>
                    <input
                      className="w-full rounded-xl border border-[color:var(--border)] px-4 py-3 outline-none transition focus:border-[color:var(--secondary)]"
                      id="chapter-title"
                      onChange={(event) => setChapterTitle(event.target.value)}
                      placeholder="例如：第一章 初见"
                      value={chapterTitle}
                    />
                  </div>
                </div>

                {activeInputTab === "manual" ? (
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="block text-[14px] font-semibold" htmlFor="chapter-content">
                        章节正文
                      </label>
                      <span
                        className={[
                          "text-[13px] font-semibold",
                          isManualOverLimit
                            ? "text-[color:var(--error)]"
                            : "text-[color:var(--text-secondary)]",
                        ].join(" ")}
                      >
                        {chapterLength}/5000
                      </span>
                    </div>
                    <textarea
                      className="h-[220px] w-full rounded-2xl border border-[color:var(--border)] px-4 py-3 outline-none transition focus:border-[color:var(--secondary)]"
                      id="chapter-content"
                      onChange={(event) => setChapterContent(event.target.value)}
                      placeholder="粘贴章节正文。建议每次只提交一章。"
                      value={chapterContent}
                    />
                  </div>
                ) : null}

                {activeInputTab === "upload" ? (
                  <div>
                    <label
                      className="mb-2 block text-[14px] font-semibold"
                      htmlFor="chapter-file"
                    >
                      选择 TXT 文件
                    </label>
                    <input
                      accept=".txt,.text"
                      className="w-full rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--bg-secondary)] px-4 py-6"
                      id="chapter-file"
                      onChange={(event) => {
                        const file = event.target.files?.[0] ?? null;
                        setSelectedFile(file);
                      }}
                      type="file"
                    />
                    <p className="mt-2 text-[13px] text-[color:var(--text-secondary)]">
                      {selectedFile
                        ? `已选择：${selectedFile.name}`
                        : "仅支持 TXT 文本，文件内容会直接作为章节正文入库。"}
                    </p>
                  </div>
                ) : null}

                {activeInputTab === "crawl" ? (
                  <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--bg-secondary)] p-4 text-[14px] leading-7 text-[color:var(--text-secondary)]">
                    获取小说还未接入。第一版前端只支持手动输入章节正文和上传 TXT 文件。
                  </div>
                ) : null}

                <button
                  className="w-full rounded-xl bg-[color:var(--text-primary)] px-4 py-3 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSubmittingChapter}
                  onClick={() => void handleCreateChapter()}
                  type="button"
                >
                  {isSubmittingChapter ? "提交中..." : "保存章节"}
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="grid gap-6 min-[980px]:grid-cols-[320px_minmax(0,1fr)]">
              <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
                <div className="mb-5 flex items-center gap-3">
                  <GridIcon className="h-5 w-5 text-[color:var(--secondary)]" />
                  <h2 className="text-xl font-bold">小说工作区</h2>
                </div>

                <div className="space-y-3">
                  {novels.length > 0 ? (
                    novels.map((novel) => (
                      <button
                        className={[
                          "w-full rounded-2xl border px-4 py-4 text-left transition-all duration-300",
                          selectedNovelId === novel.id
                            ? "border-[color:var(--secondary)] bg-[rgba(255,153,51,0.08)]"
                            : "border-[color:var(--border)] hover:border-[color:var(--secondary)]",
                        ].join(" ")}
                        key={novel.id}
                        onClick={() => setSelectedNovelId(novel.id)}
                        type="button"
                      >
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <div className="text-[15px] font-bold">{novel.title}</div>
                          <span className="rounded-full bg-[color:var(--bg-secondary)] px-2 py-1 text-[12px] text-[color:var(--text-secondary)]">
                            {getStyleLabel(novel.style)}
                          </span>
                        </div>
                        <div className="text-[13px] leading-6 text-[color:var(--text-secondary)]">
                          章节 {novel.totalChapters} · 更新时间 {formatDate(novel.updatedAt)}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--bg-secondary)] p-5 text-[14px] leading-7 text-[color:var(--text-secondary)]">
                      暂无小说。创建后会出现在这里。
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[24px] bg-[linear-gradient(135deg,#fffefb,#f8fbff)] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
                      Current Novel
                    </div>
                    <h2 className="mt-2 text-[28px] font-black">
                      {novelDetail?.title ?? "未选择小说"}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3">
                    {selectedChapterRecord?.status === "failed" ? (
                      <span className="rounded-full bg-[rgba(201,79,70,0.12)] px-3 py-2 text-[12px] font-semibold text-[color:var(--error)]">
                        上次分析失败，可直接重新分析
                      </span>
                    ) : null}
                    <button
                      className="rounded-xl border border-[color:var(--border)] bg-white px-5 py-3 text-[14px] font-semibold text-[color:var(--text-primary)] transition-all duration-300 hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={
                        selectedChapterId === null ||
                        isGeneratingComic ||
                        !chapterDetail ||
                        getStoryboards(chapterDetail).length === 0
                      }
                      onClick={() => void handleGenerateComic()}
                      type="button"
                    >
                      {isGeneratingComic
                        ? shouldForceGenerateComic
                          ? "重新生成漫画中..."
                          : "生成漫画中..."
                        : shouldForceGenerateComic
                          ? "重新生成分镜图与漫画页"
                          : "生成分镜图与漫画页"}
                    </button>
                    <button
                      className="rounded-xl bg-[linear-gradient(135deg,var(--secondary),var(--accent-600))] px-5 py-3 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={selectedChapterId === null || isAnalyzingChapter}
                      onClick={() => void handleAnalyzeChapter()}
                      type="button"
                    >
                      {isAnalyzingChapter
                        ? shouldForceAnalyze
                          ? "重新分析中..."
                          : "分析中..."
                        : shouldForceAnalyze
                          ? "重新分析当前章节"
                          : "分析当前章节"}
                    </button>
                  </div>
                </div>

                <p className="max-w-[700px] text-[14px] leading-7 text-[color:var(--text-secondary)]">
                  {novelDetail?.description ?? "这里会显示小说简介、风格与当前统计。"}
                </p>

                <div className="mt-5 grid gap-4 min-[700px]:grid-cols-3">
                  <div className="rounded-2xl bg-white p-4 shadow-[0_8px_20px_rgba(0,0,0,0.04)]">
                    <div className="text-[13px] text-[color:var(--text-secondary)]">风格</div>
                    <div className="mt-2 text-[18px] font-bold">
                      {getStyleLabel(novelDetail?.style ?? null)}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-[0_8px_20px_rgba(0,0,0,0.04)]">
                    <div className="text-[13px] text-[color:var(--text-secondary)]">章节数</div>
                    <div className="mt-2 text-[18px] font-bold">
                      {novelDetail?.stats.chapterCount ?? 0}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-[0_8px_20px_rgba(0,0,0,0.04)]">
                    <div className="text-[13px] text-[color:var(--text-secondary)]">角色数</div>
                    <div className="mt-2 text-[18px] font-bold">
                      {novelDetail?.stats.characterCount ?? 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 min-[1200px]:grid-cols-[360px_minmax(0,1fr)]">
              <div className="space-y-6">
                <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
                  <div className="mb-5 flex items-center gap-3">
                    <HistoryIcon className="h-5 w-5 text-[color:var(--secondary)]" />
                    <h2 className="text-xl font-bold">章节列表</h2>
                  </div>

                  <div className="space-y-3">
                    {chapters.length > 0 ? (
                      chapters.map((chapter) => (
                        <button
                          className={[
                            "w-full rounded-2xl border px-4 py-4 text-left transition-all duration-300",
                            selectedChapterId === chapter.id
                              ? "border-[color:var(--secondary)] bg-[rgba(255,153,51,0.08)]"
                              : "border-[color:var(--border)] hover:border-[color:var(--secondary)]",
                          ].join(" ")}
                          key={chapter.id}
                          onClick={() => setSelectedChapterId(chapter.id)}
                          type="button"
                        >
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <div className="font-semibold">
                              第 {chapter.chapterNo} 章 {chapter.title}
                            </div>
                            <span
                              className={[
                                "rounded-full px-2 py-1 text-[12px] font-semibold",
                                getChapterStatusClass(chapter.status),
                              ].join(" ")}
                            >
                              {getChapterStatusLabel(chapter.status)}
                            </span>
                          </div>
                          <div className="text-[13px] leading-6 text-[color:var(--text-secondary)]">
                            {chapter.contentLength} 字 · {formatDate(chapter.updatedAt)}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--bg-secondary)] p-5 text-[14px] leading-7 text-[color:var(--text-secondary)]">
                        当前小说还没有章节。
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
                  <div className="mb-5 flex items-center gap-3">
                    <SparklesIcon className="h-5 w-5 text-[color:var(--secondary)]" />
                    <h2 className="text-xl font-bold">角色库</h2>
                  </div>

                  <div className="space-y-3">
                    {characters.length > 0 ? (
                      characters.map((character) => (
                        <button
                          className={[
                            "w-full rounded-2xl border px-4 py-4 text-left transition-all duration-300",
                            selectedCharacterId === character.id
                              ? "border-[color:var(--secondary)] bg-[rgba(255,153,51,0.08)]"
                              : "border-[color:var(--border)] bg-[color:var(--bg-secondary)] hover:border-[color:var(--secondary)]",
                          ].join(" ")}
                          key={character.id}
                          onClick={() => setSelectedCharacterId(character.id)}
                          type="button"
                        >
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <div className="font-semibold">{character.name}</div>
                            <span className="rounded-full bg-white px-2 py-1 text-[12px] text-[color:var(--text-secondary)]">
                              v{character.version}
                            </span>
                          </div>
                          <div className="text-[13px] leading-6 text-[color:var(--text-secondary)]">
                            {character.appearance ?? character.personality ?? "等待章节补充角色设定"}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--bg-secondary)] p-5 text-[14px] leading-7 text-[color:var(--text-secondary)]">
                        章节分析后，角色会沉淀到这里。
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
                  <div className="mb-5 flex items-center gap-3">
                    <ImageIcon className="h-5 w-5 text-[color:var(--secondary)]" />
                    <h2 className="text-xl font-bold">角色详情</h2>
                  </div>

                  {isLoadingCharacterDetail ? (
                    <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--bg-secondary)] p-5 text-[14px] leading-7 text-[color:var(--text-secondary)]">
                      角色详情加载中...
                    </div>
                  ) : characterDetailError ? (
                    <div className="rounded-2xl border border-[rgba(201,79,70,0.18)] bg-[rgba(201,79,70,0.06)] p-5 text-[14px] leading-7 text-[color:var(--error)]">
                      {characterDetailError}
                    </div>
                  ) : characterDetail ? (
                    <div className="space-y-4">
                      <div className="rounded-2xl bg-[color:var(--bg-secondary)] px-4 py-4">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div className="text-[18px] font-bold">{characterDetail.name}</div>
                          <span className="rounded-full bg-white px-2 py-1 text-[12px] text-[color:var(--text-secondary)]">
                            v{characterDetail.version}
                          </span>
                        </div>
                        <div className="text-[13px] leading-6 text-[color:var(--text-secondary)]">
                          {characterDetail.gender ? `性别：${characterDetail.gender} · ` : ""}
                          {characterDetail.ageRange
                            ? `年龄范围：${characterDetail.ageRange}`
                            : "年龄范围未标注"}
                        </div>
                      </div>

                      <div className="grid gap-3">
                        {[
                          ["外貌", characterDetail.appearance],
                          ["性格", characterDetail.personality],
                          ["背景", characterDetail.background],
                          ["能力", characterDetail.ability],
                        ].map(([label, value]) => (
                          <div
                            className="rounded-2xl border border-[color:var(--border)] px-4 py-4"
                            key={label}
                          >
                            <div className="mb-2 text-[13px] font-semibold text-[color:var(--text-secondary)]">
                              {label}
                            </div>
                            <div className="text-[14px] leading-7">
                              {value || "暂无信息"}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-2xl border border-[color:var(--border)] px-4 py-4">
                        <div className="mb-3 text-[14px] font-semibold">最近出场</div>
                        <div className="space-y-3">
                          {characterDetail.recentAppearances.length > 0 ? (
                            characterDetail.recentAppearances.map((appearance) => (
                              <div
                                className="rounded-2xl bg-[color:var(--bg-secondary)] px-4 py-4"
                                key={`${appearance.chapterId}-${appearance.action}`}
                              >
                                <div className="mb-2 flex items-center justify-between gap-3">
                                  <div className="font-semibold">
                                    第 {appearance.chapterNo} 章 {appearance.chapterTitle}
                                  </div>
                                  <span
                                    className={[
                                      "rounded-full px-2 py-1 text-[12px] font-semibold",
                                      getActionBadgeClass(appearance.action),
                                    ].join(" ")}
                                  >
                                    {getActionLabel(appearance.action)}
                                  </span>
                                </div>
                                <div className="text-[13px] leading-6 text-[color:var(--text-secondary)]">
                                  {appearance.roleInChapter
                                    ? `${appearance.roleInChapter} · `
                                    : ""}
                                  {appearance.changeSummary ?? "无变更说明"}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="rounded-2xl bg-[color:var(--bg-secondary)] px-4 py-4 text-[14px] leading-7 text-[color:var(--text-secondary)]">
                              暂无最近出场记录。
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--bg-secondary)] p-5 text-[14px] leading-7 text-[color:var(--text-secondary)]">
                      从角色库中选择一个角色后，这里会显示主档案和最近出场记录。
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-secondary)]">
                      Chapter Detail
                    </div>
                    <h2 className="mt-2 text-[28px] font-black">
                      {chapterDetail
                        ? `第 ${chapterDetail.chapterNo} 章 ${chapterDetail.title}`
                        : "未选择章节"}
                    </h2>
                  </div>
                  <span
                    className={[
                      "rounded-full px-3 py-2 text-[12px] font-semibold",
                      getChapterStatusClass(chapterDetail?.status),
                    ].join(" ")}
                  >
                    {getChapterStatusLabel(chapterDetail?.status)}
                  </span>
                </div>

                {chapterDetail ? (
                  <div className="space-y-6">
                    {chapterDetail.status === "failed" || chapterDetail.analysisError || chapterAnalysisError ? (
                      <div className="rounded-[24px] border border-[rgba(201,79,70,0.18)] bg-[rgba(201,79,70,0.06)] px-5 py-4 text-[14px] leading-7 text-[color:var(--error)]">
                        <div className="font-semibold">分析失败</div>
                        <div className="mt-1">
                          {chapterDetail.analysisError ||
                            chapterAnalysisError ||
                            "本章最近一次分析失败，请检查配置后重新分析。"}
                        </div>
                        <div className="mt-2 text-[12px] leading-6 text-[color:var(--error)]/80">
                          已尝试 {chapterDetail.analysisAttempts} 次
                          {chapterDetail.lastAnalyzedAt
                            ? ` · 最近一次分析时间 ${formatDate(chapterDetail.lastAnalyzedAt)}`
                            : ""}
                        </div>
                      </div>
                    ) : null}

                    <div className="grid gap-4 min-[950px]:grid-cols-[1.05fr_0.95fr]">
                      <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--bg-secondary)] p-5">
                        <div className="mb-3 text-[15px] font-bold">章节原文</div>
                        <div className="max-h-[380px] overflow-auto whitespace-pre-wrap text-[14px] leading-7 text-[color:var(--text-secondary)]">
                          {chapterDetail.content}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-[24px] border border-[color:var(--border)] bg-[linear-gradient(135deg,#fff8f0,#fff)] p-5">
                          <div className="mb-3 text-[15px] font-bold">章节摘要</div>
                          <p className="text-[14px] leading-7 text-[color:var(--text-secondary)]">
                            {chapterDetail.summary ?? "分析完成后会写入章节摘要。"}
                          </p>
                        </div>

                        <div className="rounded-[24px] border border-[color:var(--border)] bg-[linear-gradient(135deg,#f5fbff,#fff)] p-5">
                          <div className="mb-3 text-[15px] font-bold">本章角色动作</div>
                          <div className="space-y-3">
                            {chapterDetail.characters.length > 0 ? (
                              chapterDetail.characters.map((character) => (
                                <button
                                  className="w-full rounded-2xl bg-white px-4 py-4 text-left shadow-[0_8px_18px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-[1px]"
                                  key={`${character.id}-${character.action}`}
                                  onClick={() => setSelectedCharacterId(character.id)}
                                  type="button"
                                >
                                  <div className="mb-2 flex items-center justify-between gap-3">
                                    <div className="font-semibold">{character.name}</div>
                                    <span
                                      className={[
                                        "rounded-full px-2 py-1 text-[12px] font-semibold",
                                        getActionBadgeClass(character.action),
                                      ].join(" ")}
                                    >
                                      {getActionLabel(character.action)}
                                    </span>
                                  </div>
                                  <div className="text-[13px] leading-6 text-[color:var(--text-secondary)]">
                                    {character.roleInChapter
                                      ? `${character.roleInChapter} · `
                                      : ""}
                                    {character.changeSummary ?? "本章无新增变更说明"}
                                  </div>
                                </button>
                              ))
                            ) : (
                              <div className="rounded-2xl bg-white px-4 py-4 text-[14px] leading-7 text-[color:var(--text-secondary)]">
                                分析完成后会显示本章角色的复用、更新或新增结果。
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6 min-[980px]:grid-cols-[1fr_1fr]">
                      <div className="rounded-[24px] border border-[color:var(--border)] bg-white p-5">
                        <div className="mb-4 text-[15px] font-bold">分镜草案</div>
                        <div className="space-y-3">
                          {getStoryboards(chapterDetail).length > 0 ? (
                            getStoryboards(chapterDetail).map((storyboard) => (
                              <div
                                className="rounded-2xl bg-[color:var(--bg-secondary)] px-4 py-4"
                                key={`${storyboard.sceneTitle}-${storyboard.panelNo}`}
                              >
                                <div className="mb-2 flex items-center justify-between gap-3">
                                  <div className="font-semibold">
                                    {storyboard.sceneTitle}
                                  </div>
                                  <span className="rounded-full bg-white px-2 py-1 text-[12px] text-[color:var(--text-secondary)]">
                                    Panel {storyboard.panelNo}
                                  </span>
                                </div>
                                <div className="text-[13px] leading-6 text-[color:var(--text-secondary)]">
                                  {storyboard.shot} · {storyboard.description}
                                  {storyboard.dialogue ? ` · 对白：${storyboard.dialogue}` : ""}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="rounded-2xl bg-[color:var(--bg-secondary)] px-4 py-4 text-[14px] leading-7 text-[color:var(--text-secondary)]">
                              还没有分镜数据。
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-[color:var(--border)] bg-white p-5">
                        <div className="mb-4 text-[15px] font-bold">场景拆解</div>
                        <div className="space-y-3">
                          {chapterDetail.analysisJson?.scenes?.length ? (
                            chapterDetail.analysisJson.scenes.map((scene, index) => (
                              <div
                                className="rounded-2xl bg-[color:var(--bg-secondary)] px-4 py-4"
                                key={`${scene.title}-${index}`}
                              >
                                <div className="mb-2 flex items-center justify-between gap-3">
                                  <div className="font-semibold">{scene.title}</div>
                                  <span className="text-[12px] text-[color:var(--text-secondary)]">
                                    {scene.location ?? "地点未标注"}
                                  </span>
                                </div>
                                <div className="text-[13px] leading-6 text-[color:var(--text-secondary)]">
                                  {scene.summary}
                                </div>
                                <div className="mt-2 text-[12px] leading-6 text-[color:var(--text-secondary)]">
                                  角色：{scene.characters.join("、") || "无"}
                                  {scene.mood ? ` · 氛围：${scene.mood}` : ""}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="rounded-2xl bg-[color:var(--bg-secondary)] px-4 py-4 text-[14px] leading-7 text-[color:var(--text-secondary)]">
                              还没有场景拆解数据。
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6 min-[980px]:grid-cols-[1fr_1fr]">
                      <div className="rounded-[24px] border border-[color:var(--border)] bg-white p-5">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div className="text-[15px] font-bold">分镜图</div>
                          <span className="text-[12px] text-[color:var(--text-secondary)]">
                            {chapterDetail.storyboardImages.length} 张已持久化
                          </span>
                        </div>
                        <div className="space-y-4">
                          {chapterDetail.storyboardImages.length > 0 ? (
                            chapterDetail.storyboardImages.map((panel) => (
                              <div
                                className="overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--bg-secondary)]"
                                key={panel.id}
                              >
                                <div className="border-b border-[color:var(--border)] px-4 py-3">
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="font-semibold">
                                      Panel {panel.panelNo} · {panel.sceneTitle}
                                    </div>
                                    <span
                                      className={[
                                        "rounded-full px-2 py-1 text-[12px] font-semibold",
                                        panel.status === "completed"
                                          ? "bg-[rgba(56,112,56,0.12)] text-[color:var(--accent-2)]"
                                          : panel.status === "failed"
                                            ? "bg-[rgba(201,79,70,0.12)] text-[color:var(--error)]"
                                            : "bg-[rgba(255,153,51,0.12)] text-[color:var(--secondary)]",
                                      ].join(" ")}
                                    >
                                      {panel.status === "completed"
                                        ? "已完成"
                                        : panel.status === "failed"
                                          ? "失败"
                                          : "生成中"}
                                    </span>
                                  </div>
                                  <div className="mt-2 text-[12px] leading-6 text-[color:var(--text-secondary)]">
                                    {panel.promptText}
                                  </div>
                                </div>
                                {panel.imageData ? (
                                  <img
                                    alt={`${panel.sceneTitle} 分镜图`}
                                    className="block w-full bg-white object-cover"
                                    src={panel.imageData}
                                  />
                                ) : (
                                  <div className="px-4 py-6 text-[13px] leading-6 text-[color:var(--error)]">
                                    {panel.errorMessage ?? "当前还没有可展示的图片。"}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="rounded-2xl bg-[color:var(--bg-secondary)] px-4 py-4 text-[14px] leading-7 text-[color:var(--text-secondary)]">
                              还没有分镜图。完成章节分析后，点击上方按钮即可生成并持久化。
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-[color:var(--border)] bg-white p-5">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div className="text-[15px] font-bold">漫画页产物</div>
                          <span className="text-[12px] text-[color:var(--text-secondary)]">
                            {chapterDetail.comicPages.length} 页
                          </span>
                        </div>
                        <div className="space-y-4">
                          {chapterDetail.comicPages.length > 0 ? (
                            chapterDetail.comicPages.map((page) => (
                              <div
                                className="overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--bg-secondary)]"
                                key={page.id}
                              >
                                <div className="border-b border-[color:var(--border)] px-4 py-3">
                                  <div className="font-semibold">{page.title}</div>
                                  <div className="mt-1 text-[12px] leading-6 text-[color:var(--text-secondary)]">
                                    关联分镜图 ID：{page.panelImageIdsJson?.join("、") ?? "无"}
                                  </div>
                                </div>
                                <img
                                  alt={page.title}
                                  className="block w-full bg-white object-cover"
                                  src={page.imageData}
                                />
                              </div>
                            ))
                          ) : (
                            <div className="rounded-2xl bg-[color:var(--bg-secondary)] px-4 py-4 text-[14px] leading-7 text-[color:var(--text-secondary)]">
                              还没有漫画页。分镜图生成完成后，会自动合成漫画页并保存在数据库中。
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-dashed border-[color:var(--border)] bg-[color:var(--bg-secondary)] p-8 text-[14px] leading-8 text-[color:var(--text-secondary)]">
                    从左侧选择章节后，这里会显示原文、摘要、分镜和角色动作。
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
