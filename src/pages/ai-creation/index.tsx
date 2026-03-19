import { useEffect, useRef, useState } from "react";
import type { NavLink, InputTab, TemplateTab, StyleOption, TemplateCard, HistoryItem, FooterColumn, InputTabKey, TemplateTabKey, SizeKey } from "../../lib/types/ai-creation";
import { PencilIcon, SearchIcon, SparklesIcon, GridIcon, HistoryIcon, ImageIcon, EyeIcon, StarIcon, HeartIcon } from "../../components/Icon/ai-creation";

const navLinks: ReadonlyArray<NavLink> = [
  { href: "/", label: "首页" },
  { href: "#", label: "分类" },
  { href: "/ranking", label: "排行榜" },
  { active: true, href: "/ai-creation", label: "AI创作" },
  { href: "/forum", label: "论坛" },
] as const;

const inputTabs: ReadonlyArray<InputTab> = [
  { key: "manual", label: "手动输入" },
  { key: "upload", label: "本地上传" },
  { key: "crawl", label: "获取小说" },
] as const;

const templateTabs: ReadonlyArray<TemplateTab> = [
  { key: "hot", label: "热门模板" },
  { key: "new", label: "最新模板" },
  { key: "favorites", label: "我的收藏" },
] as const;

const styleOptions: ReadonlyArray<StyleOption> = [
  { label: "请选择风格", value: "" },
  { label: "日漫", value: "anime" },
  { label: "美漫", value: "western" },
  { label: "国风", value: "chinese" },
  { label: "Q版", value: "q-version" },
] as const;

const templates: ReadonlyArray<TemplateCard> = [
  {
    id: 10,
    image: "https://picsum.photos/250/180?random=10",
    name: "星际战争",
    rating: "4.8",
    views: "12.5万",
  },
  {
    id: 11,
    image: "https://picsum.photos/250/180?random=11",
    name: "古风美人",
    rating: "4.6",
    views: "9.8万",
  },
  {
    id: 12,
    image: "https://picsum.photos/250/180?random=12",
    name: "超级英雄",
    rating: "4.7",
    views: "8.6万",
  },
  {
    id: 13,
    image: "https://picsum.photos/250/180?random=13",
    name: "Q版动物",
    rating: "4.9",
    views: "7.2万",
  },
  {
    id: 14,
    image: "https://picsum.photos/250/180?random=14",
    name: "未来城市",
    rating: "4.5",
    views: "6.5万",
  },
  {
    id: 15,
    image: "https://picsum.photos/250/180?random=15",
    name: "奇幻森林",
    rating: "4.4",
    views: "5.8万",
  },
] as const;

const historyItems: ReadonlyArray<HistoryItem> = [
  {
    id: 1,
    image: "https://picsum.photos/200/150?random=1",
    style: "日漫风格",
    title: "星际战士与外星生物战斗",
  },
  {
    id: 2,
    image: "https://picsum.photos/200/150?random=2",
    style: "国风",
    title: "古风少女在樱花树下",
  },
  {
    id: 3,
    image: "https://picsum.photos/200/150?random=3",
    style: "美漫风格",
    title: "超级英雄与反派战斗",
  },
  {
    id: 4,
    image: "https://picsum.photos/200/150?random=4",
    style: "Q版",
    title: "可爱的动物角色",
  },
] as const;

const footerColumns: ReadonlyArray<FooterColumn> = [
  {
    links: [
      { href: "#", label: "平台介绍" },
      { href: "#", label: "团队成员" },
      { href: "#", label: "联系方式" },
      { href: "#", label: "加入我们" },
    ],
    title: "关于我们",
  },
  {
    links: [
      { href: "#", label: "使用指南" },
      { href: "#", label: "常见问题" },
      { href: "#", label: "意见反馈" },
      { href: "#", label: "隐私政策" },
    ],
    title: "帮助中心",
  },
  {
    links: [
      { href: "#", label: "客户端下载" },
      { href: "#", label: "素材库" },
      { href: "#", label: "模板下载" },
      { href: "#", label: "API文档" },
    ],
    title: "资源下载",
  },
] as const;



function getPolishedDescription(description: string) {
  return `[润色结果] ${description} - 已按照漫画风格进行润色`;
}

export default function AICreation() {
  const [activeInputTab, setActiveInputTab] = useState<InputTabKey>("manual");
  const [activeTemplateTab, setActiveTemplateTab] =
    useState<TemplateTabKey>("hot");
  const [selectedSize, setSelectedSize] = useState<SizeKey>("landscape");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("");
  const [novelUrl, setNovelUrl] = useState("");
  const [getWholeBook, setGetWholeBook] = useState(true);
  const [getChapterOnly, setGetChapterOnly] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [favoriteTemplateIds, setFavoriteTemplateIds] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleManualPolish() {
    if (!description.trim()) {
      window.alert("请输入需要润色的文本");
      return;
    }

    setDescription(getPolishedDescription(description.trim()));
  }

  function handleGenerate() {
    let creationSource = "";

    if (activeInputTab === "manual") {
      creationSource = description.trim();
      if (!creationSource) {
        window.alert("请输入漫画描述");
        return;
      }
    }

    if (activeInputTab === "upload") {
      if (!selectedFileName) {
        window.alert("请选择要上传的文件");
        return;
      }
      creationSource = `[文件上传] ${selectedFileName}`;
    }

    if (activeInputTab === "crawl") {
      if (!novelUrl.trim()) {
        window.alert("请输入小说网站地址");
        return;
      }
      creationSource = `[获取小说] ${novelUrl.trim()}`;
    }

    if (!style) {
      window.alert("请选择漫画风格");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage("");

    timeoutRef.current = window.setTimeout(() => {
      const sizeQuery = selectedSize === "landscape" ? "600/400" : "400/600";
      const cacheKey = Math.floor(Math.random() * 1000);
      setGeneratedImage(
        `https://picsum.photos/${sizeQuery}?random=${cacheKey}&source=${encodeURIComponent(
          creationSource,
        )}`,
      );
      setIsGenerating(false);
    }, 2000);
  }

  function toggleFavorite(templateId: number) {
    setFavoriteTemplateIds((ids) =>
      ids.includes(templateId)
        ? ids.filter((id) => id !== templateId)
        : [...ids, templateId],
    );
  }

  function handleUseTemplate(templateName: string) {
    window.alert("使用此模板");
    setActiveInputTab("manual");
    setDescription(templateName);
  }

  const visibleTemplates =
    activeTemplateTab === "favorites"
      ? templates.filter((template) => favoriteTemplateIds.includes(template.id))
      : templates;

  return (
    <div className="min-h-screen bg-[color:var(--bg-secondary)] font-sans leading-[1.6] text-[color:var(--text-primary)]">
      <header className="bg-[linear-gradient(135deg,var(--primary-700),var(--primary-800))] py-5 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
        <div className="m-0 px-10">
          <div className="flex flex-col items-center justify-between gap-5 min-[769px]:flex-row">
            <div className="flex items-center gap-[10px] text-[28px] font-extrabold text-white">
              <div className="flex h-[45px] w-[45px] items-center justify-center rounded-xl bg-white text-[color:var(--primary-700)]">
                <PencilIcon className="h-6 w-6" />
              </div>
              <span>AI漫画</span>
            </div>

            <div className="flex w-full items-center rounded-[50px] bg-white px-5 py-[10px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] min-[769px]:w-[300px] min-[993px]:w-[400px]">
              <SearchIcon className="h-4 w-4 shrink-0 text-[color:var(--text-secondary)]" />
              <input
                className="min-w-0 flex-1 border-none bg-transparent px-[10px] py-[5px] text-[15px] outline-none placeholder:text-[color:var(--text-secondary)]"
                placeholder="搜索漫画、作者..."
                type="text"
              />
              <button
                className="rounded-[25px] bg-[color:var(--secondary)] px-5 py-2 text-[14px] text-white transition-all duration-300 hover:scale-105 hover:bg-[color:var(--accent-600)]"
                type="button"
              >
                搜索
              </button>
            </div>

            <nav className="flex flex-wrap justify-center gap-[30px]">
              {navLinks.map((link) => (
                <a
                  className={[
                    "rounded-lg px-4 py-2 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-white/20",
                    link.active ? "bg-white/30" : "",
                  ].join(" ")}
                  href={link.href}
                  key={link.label}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="relative">
              <a
                className="rounded-lg px-4 py-2 text-[15px] font-semibold text-white no-underline transition-all duration-300 hover:bg-white/20"
                href="#"
              >
                登录/注册
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="px-0 py-10">
        <div className="mx-auto max-w-[1400px] px-5">
          <section className="mb-10 rounded-[20px] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] min-[769px]:p-10">
            <h2 className="mb-[30px] flex items-center gap-[10px] text-2xl font-bold text-[color:var(--text-primary)] max-[480px]:text-[20px]">
              <SparklesIcon className="h-6 w-6 text-[color:var(--secondary)]" />
              AI漫画创作
            </h2>

            <div className="mb-10 grid grid-cols-1 gap-[30px] min-[1201px]:grid-cols-2">
              <div className="flex flex-col gap-5">
                <div>
                  <div className="mb-5 flex gap-[10px] border-b-2 border-b-[color:var(--border)]">
                    {inputTabs.map((tab) => (
                      <button
                        className={[
                          "border-b-[3px] border-b-transparent px-5 py-3 text-[14px] font-semibold transition-all duration-300",
                          activeInputTab === tab.key
                            ? "border-b-[color:var(--secondary)] text-[color:var(--secondary)]"
                            : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]",
                        ].join(" ")}
                        key={tab.key}
                        onClick={() => setActiveInputTab(tab.key)}
                        type="button"
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="mb-5">
                    {activeInputTab === "manual" ? (
                      <div className="flex flex-col gap-2">
                        <label
                          className="text-[15px] font-semibold text-[color:var(--text-primary)]"
                          htmlFor="description"
                        >
                          漫画描述
                        </label>
                        <div className="relative">
                          <textarea
                            className="h-[150px] w-full resize-y rounded-xl border-2 border-[color:var(--border)] px-[15px] py-[15px] pr-[120px] text-[15px] outline-none transition-all duration-300 placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--secondary)] focus:shadow-[0_0_0_3px_rgba(255,153,51,0.1)]"
                            id="description"
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="请输入漫画的详细描述，例如：一位穿着机甲的少女在太空站中与外星生物战斗，背景是星空和空间站，风格科幻，色彩鲜明..."
                            value={description}
                          />
                          <button
                            className="absolute bottom-[10px] right-[10px] flex min-w-[100px] items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--accent-2),var(--info))] px-4 py-2 text-[13px] font-semibold text-white transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_25px_rgba(56,112,56,0.3)]"
                            id="manual-polish-button"
                            onClick={handleManualPolish}
                            type="button"
                          >
                            <SparklesIcon className="h-[14px] w-[14px]" />
                            AI润色
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {activeInputTab === "upload" ? (
                      <div className="flex flex-col gap-2">
                        <label
                          className="text-[15px] font-semibold text-[color:var(--text-primary)]"
                          htmlFor="file-upload"
                        >
                          导入小说/文本
                        </label>
                        <input
                          accept=".txt,.text"
                          className="w-full cursor-pointer rounded-xl border-2 border-dashed border-[color:var(--border)] bg-[color:var(--bg-secondary)] p-[10px] text-[15px] transition-all duration-300 hover:border-[color:var(--secondary)]"
                          id="file-upload"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            setSelectedFileName(file?.name ?? "");
                          }}
                          type="file"
                        />
                        <div className="mt-[10px] text-[14px] text-[color:var(--text-secondary)]">
                          {selectedFileName
                            ? `已选择文件: ${selectedFileName}`
                            : "请选择要上传的TXT文件"}
                        </div>
                      </div>
                    ) : null}

                    {activeInputTab === "crawl" ? (
                      <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                          <label
                            className="text-[15px] font-semibold text-[color:var(--text-primary)]"
                            htmlFor="novel-url"
                          >
                            小说网站地址
                          </label>
                          <input
                            className="w-full rounded-xl border-2 border-[color:var(--border)] px-[15px] py-3 text-[15px] outline-none transition-all duration-300 placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--secondary)] focus:shadow-[0_0_0_3px_rgba(255,153,51,0.1)]"
                            id="novel-url"
                            onChange={(event) => setNovelUrl(event.target.value)}
                            placeholder="请输入小说网站的整本小说地址，例如：https://www.example.com/novel/12345"
                            type="text"
                            value={novelUrl}
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[15px] font-semibold text-[color:var(--text-primary)]">
                            获取选项
                          </label>
                          <div className="flex flex-col gap-[10px]">
                            <label className="flex cursor-pointer items-center gap-2 text-[15px] font-normal text-[color:var(--text-primary)]">
                              <input
                                checked={getWholeBook}
                                onChange={(event) => setGetWholeBook(event.target.checked)}
                                type="checkbox"
                              />
                              获取整本书
                            </label>
                            <label className="flex cursor-pointer items-center gap-2 text-[15px] font-normal text-[color:var(--text-primary)]">
                              <input
                                checked={getChapterOnly}
                                onChange={(event) => setGetChapterOnly(event.target.checked)}
                                type="checkbox"
                              />
                              只获取章节
                            </label>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    className="text-[15px] font-semibold text-[color:var(--text-primary)]"
                    htmlFor="style"
                  >
                    风格选择
                  </label>
                  <select
                    className="w-full cursor-pointer rounded-xl border-2 border-[color:var(--border)] bg-white px-[15px] py-3 text-[15px] outline-none transition-all duration-300 focus:border-[color:var(--secondary)] focus:shadow-[0_0_0_3px_rgba(255,153,51,0.1)]"
                    id="style"
                    onChange={(event) => setStyle(event.target.value)}
                    value={style}
                  >
                    {styleOptions.map((option) => (
                      <option key={option.value || "placeholder"} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[15px] font-semibold text-[color:var(--text-primary)]">
                    尺寸选择
                  </label>
                  <div className="flex gap-[15px]">
                    {[
                      { key: "landscape" as const, label: "横版" },
                      { key: "portrait" as const, label: "竖版" },
                    ].map((option) => (
                      <button
                        className={[
                          "flex-1 rounded-xl border-2 p-3 text-center transition-all duration-300",
                          selectedSize === option.key
                            ? "border-[color:var(--secondary)] bg-[rgba(255,153,51,0.1)]"
                            : "border-[color:var(--border)] hover:border-[color:var(--secondary)]",
                        ].join(" ")}
                        key={option.key}
                        onClick={() => setSelectedSize(option.key)}
                        type="button"
                      >
                        <ImageIcon className="mx-auto mb-1 h-[18px] w-[18px] text-[color:var(--text-secondary)]" />
                        <div className="text-[14px] text-[color:var(--text-primary)]">
                          {option.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <button
                  className={[
                    "flex items-center justify-center gap-[10px] rounded-xl px-[30px] py-[15px] text-[16px] font-semibold text-white transition-all duration-300",
                    isGenerating
                      ? "cursor-not-allowed bg-[color:var(--neutral-400)]"
                      : "bg-[linear-gradient(135deg,var(--secondary),var(--accent-600))] hover:-translate-y-[2px] hover:shadow-[0_8px_25px_rgba(255,153,51,0.3)]",
                  ].join(" ")}
                  disabled={isGenerating}
                  onClick={handleGenerate}
                  type="button"
                >
                  <SparklesIcon className="h-[18px] w-[18px]" />
                  生成漫画
                </button>

                {isGenerating ? (
                  <div className="flex items-center justify-center rounded-xl bg-[color:var(--bg-secondary)] p-10">
                    <div className="h-[50px] w-[50px] animate-spin rounded-full border-[5px] border-solid border-[color:var(--border)] border-t-[color:var(--secondary)]" />
                  </div>
                ) : null}

                <div className="relative flex h-[300px] w-full items-center justify-center rounded-xl border-2 border-dashed border-[color:var(--border)] bg-[color:var(--bg-secondary)]">
                  {generatedImage ? (
                    <img
                      alt="生成的漫画"
                      className="max-h-full max-w-full rounded-[10px]"
                      src={generatedImage}
                    />
                  ) : (
                    <div className="text-center text-[color:var(--text-secondary)]">
                      <ImageIcon className="mx-auto mb-[10px] h-12 w-12 text-[color:var(--neutral-400)]" />
                      <div>生成的图片将显示在这里</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10 rounded-[20px] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] min-[769px]:p-10">
            <h2 className="mb-[30px] flex items-center gap-[10px] text-2xl font-bold text-[color:var(--text-primary)] max-[480px]:text-[20px]">
              <GridIcon className="h-6 w-6 text-[color:var(--secondary)]" />
              模板分类
            </h2>

            <div className="mb-[30px] flex gap-5 overflow-x-auto border-b-2 border-b-[color:var(--border)]">
              {templateTabs.map((tab) => (
                <button
                  className={[
                    "border-b-[3px] border-b-transparent px-6 py-3 text-[15px] font-semibold transition-all duration-300",
                    activeTemplateTab === tab.key
                      ? "border-b-[color:var(--secondary)] text-[color:var(--secondary)]"
                      : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]",
                  ].join(" ")}
                  key={tab.key}
                  onClick={() => setActiveTemplateTab(tab.key)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-[25px] min-[481px]:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
              {visibleTemplates.map((template) => {
                const isFavorite = favoriteTemplateIds.includes(template.id);

                return (
                  <article
                    className="overflow-hidden rounded-2xl bg-[color:var(--bg-secondary)] shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
                    key={template.id}
                  >
                    <div className="relative h-[180px] w-full overflow-hidden bg-[color:var(--neutral-200)]">
                      <img
                        alt="模板"
                        className="h-full w-full object-cover"
                        src={template.image}
                      />
                      <button
                        className={[
                          "absolute right-[10px] top-[10px] flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-110",
                          isFavorite ? "text-[color:var(--secondary)]" : "text-[color:var(--text-secondary)] hover:text-[color:var(--secondary)]",
                        ].join(" ")}
                        onClick={() => toggleFavorite(template.id)}
                        type="button"
                      >
                        <HeartIcon className="h-4 w-4" filled={isFavorite} />
                      </button>
                    </div>

                    <div className="p-5">
                      <div className="mb-2 text-[16px] font-semibold text-[color:var(--text-primary)]">
                        {template.name}
                      </div>
                      <div className="mb-[15px] flex items-center gap-[15px] text-[14px] text-[color:var(--text-secondary)]">
                        <span className="flex items-center gap-[5px]">
                          <EyeIcon className="h-[14px] w-[14px]" />
                          {template.views}
                        </span>
                        <span className="flex items-center gap-[5px]">
                          <StarIcon className="h-[14px] w-[14px]" />
                          {template.rating}
                        </span>
                      </div>
                      <button
                        className="w-full rounded-lg bg-[color:var(--secondary)] p-[10px] text-[14px] font-semibold text-white transition-all duration-300 hover:bg-[color:var(--accent-600)]"
                        onClick={() => handleUseTemplate(template.name)}
                        type="button"
                      >
                        使用此模板
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-[20px] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] min-[769px]:p-10">
            <h2 className="mb-[30px] flex items-center gap-[10px] text-2xl font-bold text-[color:var(--text-primary)] max-[480px]:text-[20px]">
              <HistoryIcon className="h-6 w-6 text-[color:var(--secondary)]" />
              历史记录
            </h2>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
              {historyItems.map((item) => (
                <button
                  className="relative rounded-xl bg-[color:var(--bg-secondary)] p-[15px] text-left transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)]"
                  key={item.id}
                  onClick={() => window.alert("显示原prompt")}
                  type="button"
                >
                  <div className="mb-[10px] h-[150px] w-full overflow-hidden rounded-lg bg-[color:var(--neutral-200)]">
                    <img
                      alt="历史记录"
                      className="h-full w-full object-cover"
                      src={item.image}
                    />
                  </div>
                  <div className="text-[14px] leading-[1.4] text-[color:var(--text-secondary)]">
                    <div>{item.title}</div>
                    <div className="mt-[5px] text-[12px]">{item.style}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-[60px] bg-[linear-gradient(135deg,var(--primary-700),var(--primary-800))] px-0 py-[60px] pb-[30px] text-white">
        <div className="m-0 px-10">
          <div className="mb-10 grid grid-cols-1 gap-10 min-[769px]:grid-cols-2 min-[993px]:grid-cols-3 min-[1201px]:grid-cols-[2fr_1fr_1fr_1fr]">
            <div>
              <div className="mb-5 flex items-center gap-[10px] text-2xl font-extrabold text-white">
                <div className="flex h-[45px] w-[45px] items-center justify-center rounded-xl bg-white text-[color:var(--primary-700)]">
                  <PencilIcon className="h-6 w-6" />
                </div>
                <span>AI漫画</span>
              </div>
              <p className="mb-5 text-[14px] leading-[1.6] text-white/70">
                AI漫画是一个基于人工智能技术的漫画创作平台，为用户提供高质量的漫画生成和创作工具。
              </p>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title}>
                <h4 className="mb-5 text-[16px] font-semibold text-white">
                  {column.title}
                </h4>
                <ul className="list-none">
                  {column.links.map((link) => (
                    <li className="mb-3" key={link.label}>
                      <a
                        className="text-[14px] text-white/70 no-underline transition-colors duration-300 hover:text-white"
                        href={link.href}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-t-white/10 pt-[30px] text-center text-[14px] text-white/70">
            <p>&copy; 2026 AI漫画. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
