import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { Category, ForumPost, ChatMessage, PostStat} from "../../lib/types/forum";

import {  CommentsIcon, PlusIcon, EyeIcon, CommentIcon, HeartIcon, UserIcon, ChevronLeftIcon, ChevronRightIcon } from "../../components/Icon/forum";
import Header from "../../components/header";
import { Footer } from "../../components/footer";

const categories: ReadonlyArray<Category> = [
  { key: "all", label: "全部" },
  { key: "discussion", label: "讨论" },
  { key: "feedback", label: "反馈" },
  { key: "share", label: "分享" },
  { key: "help", label: "求助" },
  { key: "announcement", label: "公告" },
] as const;

const forumPosts: ReadonlyArray<ForumPost> = [
  {
    author: "创作达人",
    category: "discussion",
    stats: [
      { icon: "eye", value: "128" },
      { icon: "comment", value: "23" },
      { icon: "heart", value: "45" },
    ],
    time: "2小时前",
    title: "如何提高AI漫画的创作质量？",
  },
  {
    author: "漫画爱好者",
    category: "share",
    stats: [
      { icon: "eye", value: "256" },
      { icon: "comment", value: "42" },
      { icon: "heart", value: "89" },
    ],
    time: "4小时前",
    title: "分享我的AI漫画创作经验",
  },
  {
    author: "新手小白",
    category: "help",
    stats: [
      { icon: "eye", value: "189" },
      { icon: "comment", value: "31" },
      { icon: "heart", value: "27" },
    ],
    time: "6小时前",
    title: "求推荐一些好看的AI漫画",
  },
  {
    author: "热心用户",
    category: "feedback",
    stats: [
      { icon: "eye", value: "324" },
      { icon: "comment", value: "56" },
      { icon: "heart", value: "78" },
    ],
    time: "1天前",
    title: "论坛功能建议",
  },
  {
    author: "技术宅",
    category: "discussion",
    stats: [
      { icon: "eye", value: "456" },
      { icon: "comment", value: "78" },
      { icon: "heart", value: "123" },
    ],
    time: "2天前",
    title: "AI漫画创作工具对比",
  },
] as const;

const initialChatMessages: ChatMessage[] = [
  { content: "大家好，有人在吗？", sender: "小明", time: "10:00" },
  { content: "在呢，有什么事吗？", sender: "小红", time: "10:01" },
  {
    content: "想问问大家都是怎么使用AI创作漫画的？",
    sender: "小明",
    time: "10:02",
  },
];

const paginationButtons = [1, 2, 3, 4, 5] as const;

function getPostStatIcon(icon: PostStat["icon"]) {
  if (icon === "eye") return <EyeIcon className="h-[14px] w-[14px]" />;
  if (icon === "heart") return <HeartIcon className="h-[14px] w-[14px]" />;
  return <CommentIcon className="h-[14px] w-[14px]" />;
}

function getCurrentTime() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

export default function Forum() {
  const [activeCategory, setActiveCategory] =
    useState<Category["key"]>("all");
  const [activePage, setActivePage] = useState(1);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(initialChatMessages);
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);

  const visiblePosts =
    activeCategory === "all"
      ? forumPosts
      : forumPosts.filter((post) => post.category === activeCategory);

  useEffect(() => {
    const container = chatMessagesRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [chatMessages]);

  function handleSendMessage() {
    const message = chatInput.trim();
    if (!message) return;

    const currentTime = getCurrentTime();
    setChatMessages((messages) => [
      ...messages,
      { content: message, sender: "我", time: currentTime },
    ]);
    setChatInput("");

    window.setTimeout(() => {
      setChatMessages((messages) => [
        ...messages,
        { content: "收到你的消息", sender: "系统", time: getCurrentTime() },
      ]);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-[color:var(--bg-secondary)] font-sans leading-[1.6] text-[color:var(--text-primary)]">
      <Header></Header>
      <main className="px-0 py-10">
        <div className="mx-auto max-w-[1400px] px-5">
          <section>
            <h2 className="mb-[30px] flex items-center gap-[10px] text-2xl font-bold text-[color:var(--text-primary)] max-[480px]:text-[20px]">
              <CommentsIcon className="h-6 w-6 text-[color:var(--secondary)]" />
              论坛
            </h2>

            <div className="mb-10 grid grid-cols-1 gap-[30px] min-[1201px]:grid-cols-[2fr_1fr]">
              <div className="rounded-[20px] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] min-[769px]:p-[30px]">
                <button
                  className="mb-[30px] flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--secondary),var(--accent-600))] px-6 py-3 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_25px_rgba(255,153,51,0.3)]"
                  type="button"
                >
                  <PlusIcon className="h-4 w-4" />
                  发布新帖子
                </button>

                <div className="mb-[30px] flex gap-[15px] overflow-x-auto pb-[10px]">
                  {categories.map((category) => (
                    <button
                      className={[
                        "whitespace-nowrap rounded-[25px] px-5 py-[10px] text-[14px] font-semibold transition-all duration-300",
                        activeCategory === category.key
                          ? "bg-[color:var(--secondary)] text-white"
                          : "bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] hover:bg-[color:var(--neutral-200)]",
                      ].join(" ")}
                      key={category.key}
                      onClick={() => setActiveCategory(category.key)}
                      type="button"
                    >
                      {category.label}
                    </button>
                  ))}
                </div>

                <div className="mb-[30px]">
                  {visiblePosts.map((post) => (
                    <article
                      className="border-b border-b-[color:var(--border)] p-5 transition-all duration-300 hover:rounded-xl hover:bg-[color:var(--bg-secondary)]"
                      key={`${post.title}-${post.time}`}
                    >
                      <div className="mb-[10px] flex flex-col gap-[10px] min-[769px]:flex-row min-[769px]:items-center min-[769px]:justify-between">
                        <a
                          className="text-[18px] font-semibold text-[color:var(--text-primary)] no-underline transition-colors duration-300 hover:text-[color:var(--secondary)] max-[480px]:text-[16px]"
                          href="#"
                        >
                          {post.title}
                        </a>

                        <div className="flex items-center gap-[15px] text-[14px] text-[color:var(--text-secondary)] max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-[5px]">
                          <span className="font-semibold text-[color:var(--text-primary)]">
                            {post.author}
                          </span>
                          <span>{post.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-[15px] text-[14px] text-[color:var(--text-secondary)]">
                        {post.stats.map((stat, index) => (
                          <span
                            className="flex items-center gap-[5px]"
                            key={`${post.title}-${stat.icon}-${index}`}
                          >
                            {getPostStatIcon(stat.icon)}
                            {stat.value}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-[30px] flex flex-wrap items-center justify-center gap-[10px]">
                  <button
                    className={[
                      "flex items-center gap-1 rounded-lg border-2 border-[color:var(--border)] bg-white px-4 py-2 text-[14px] transition-all duration-300",
                      activePage === 1
                        ? "cursor-not-allowed text-[color:var(--text-secondary)] opacity-50"
                        : "cursor-pointer text-[color:var(--text-primary)] hover:border-[color:var(--secondary)] hover:text-[color:var(--secondary)]",
                    ].join(" ")}
                    disabled={activePage === 1}
                    onClick={() => setActivePage((page) => Math.max(1, page - 1))}
                    type="button"
                  >
                    <ChevronLeftIcon className="h-[14px] w-[14px]" />
                    上一页
                  </button>

                  {paginationButtons.map((page) => (
                    <button
                      className={[
                        "rounded-lg border-2 px-4 py-2 text-[14px] transition-all duration-300",
                        activePage === page
                          ? "border-[color:var(--secondary)] bg-[color:var(--secondary)] text-white"
                          : "border-[color:var(--border)] bg-white text-[color:var(--text-primary)] hover:border-[color:var(--secondary)] hover:text-[color:var(--secondary)]",
                      ].join(" ")}
                      key={page}
                      onClick={() => setActivePage(page)}
                      type="button"
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className={[
                      "flex items-center gap-1 rounded-lg border-2 border-[color:var(--border)] bg-white px-4 py-2 text-[14px] transition-all duration-300",
                      activePage === paginationButtons.length
                        ? "cursor-not-allowed text-[color:var(--text-secondary)] opacity-50"
                        : "cursor-pointer text-[color:var(--text-primary)] hover:border-[color:var(--secondary)] hover:text-[color:var(--secondary)]",
                    ].join(" ")}
                    disabled={activePage === paginationButtons.length}
                    onClick={() =>
                      setActivePage((page) =>
                        Math.min(paginationButtons.length, page + 1),
                      )
                    }
                    type="button"
                  >
                    下一页
                    <ChevronRightIcon className="h-[14px] w-[14px]" />
                  </button>
                </div>
              </div>

              <aside className="flex h-full flex-col gap-[30px]">
                <section className="flex flex-1 flex-col rounded-[20px] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-[18px] font-semibold text-[color:var(--text-primary)]">
                      在线聊天室
                    </h3>

                    <div className="flex items-center gap-[5px] text-[14px] text-[color:var(--success)]">
                      <UserIcon className="h-[14px] w-[14px]" />
                      <span>12人在线</span>
                    </div>
                  </div>

                  <div
                    className="mb-5 min-h-[200px] flex-1 overflow-y-auto rounded-xl bg-[color:var(--bg-secondary)] p-[10px]"
                    ref={chatMessagesRef}
                  >
                    {chatMessages.map((message, index) => (
                      <div
                        className="mb-[15px] flex flex-col last:mb-0"
                        key={`${message.sender}-${message.time}-${index}`}
                      >
                        <div className="mb-[5px] flex items-center justify-between text-[12px]">
                          <span className="font-semibold text-[color:var(--text-primary)]">
                            {message.sender}
                          </span>
                          <span className="text-[color:var(--text-secondary)]">
                            {message.time}
                          </span>
                        </div>
                        <div className="rounded-lg bg-white p-[10px] text-[14px] leading-[1.5] text-[color:var(--text-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-[10px]">
                    <input
                      className="flex-1 rounded-xl border-2 border-[color:var(--border)] px-3 py-3 text-[14px] outline-none transition-all duration-300 placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--secondary)] focus:shadow-[0_0_0_3px_rgba(255,153,51,0.1)]"
                      onChange={(event) => setChatInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleSendMessage();
                        }
                      }}
                      placeholder="输入消息..."
                      type="text"
                      value={chatInput}
                    />
                    <button
                      className="rounded-xl bg-[color:var(--secondary)] px-5 text-[14px] font-semibold text-white transition-all duration-300 hover:bg-[color:var(--accent-600)]"
                      onClick={handleSendMessage}
                      type="button"
                    >
                      发送
                    </button>
                  </div>
                </section>
              </aside>
            </div>
          </section>
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
}
