
import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CommentIcon,
  EyeIcon,
  HeartIcon,
  RobotIcon,
  SearchIcon,
} from "../../components/Icon/rankingIcon";
import type { CategoryItem, ComicItem, BadgeTone } from "../../lib/types/category";


const navLinks: ReadonlyArray<{
  active?: boolean;
  href: string;
  label: string;
}> = [
  { href: "/home", label: "首页" },
  { active: true, href: "/category", label: "分类" },
  { href: "/ranking", label: "排行榜" },
  { href: "#", label: "AI创作" },
  { href: "#", label: "论坛" },
] as const;

const categoryItems: ReadonlyArray<CategoryItem> = [
  {
    count: "10000+ 部漫画",
    gradient: "linear-gradient(135deg, #2d3436, #636e72)",
    iconClass: "fas fa-globe",
    name: "全部",
  },
  {
    count: "238 部漫画",
    gradient: "linear-gradient(135deg, #ff6b6b, #ee5a6f)",
    iconClass: "fas fa-fire",
    name: "热血",
  },
  {
    count: "186 部漫画",
    gradient: "linear-gradient(135deg, #4ecdc4, #45b7d1)",
    iconClass: "fas fa-rocket",
    name: "科幻",
  },
  {
    count: "215 部漫画",
    gradient: "linear-gradient(135deg, #96ceb4, #feca57)",
    iconClass: "fas fa-dragon",
    name: "奇幻",
  },
  {
    count: "198 部漫画",
    gradient: "linear-gradient(135deg, #ff9ff3, #f368e0)",
    iconClass: "fas fa-heart",
    name: "爱情",
  },
  {
    count: "156 部漫画",
    gradient: "linear-gradient(135deg, #54a0ff, #2ecc71)",
    iconClass: "fas fa-laugh-beam",
    name: "搞笑",
  },
  {
    count: "124 部漫画",
    gradient: "linear-gradient(135deg, #5f27cd, #00d2d3)",
    iconClass: "fas fa-question-circle",
    name: "悬疑",
  },
  {
    count: "98 部漫画",
    gradient: "linear-gradient(135deg, #ff6b6b, #c44569)",
    iconClass: "fas fa-ghost",
    name: "恐怖",
  },
  {
    count: "176 部漫画",
    gradient: "linear-gradient(135deg, #a29bfe, #6c5ce7)",
    iconClass: "fas fa-home",
    name: "日常",
  },
  {
    count: "245 部漫画",
    gradient: "linear-gradient(135deg, #fdcb6e, #e17055)",
    iconClass: "fas fa-ellipsis-h",
    name: "其他",
  },
] as const;

const filterOptions = ["最新", "最热", "评分", "更新"] as const;
const paginationButtons = [1, 2, 3, 4, 5] as const;

const comics: ReadonlyArray<ComicItem> = [
  {
    author: "热血少年",
    badge: { label: "HOT", tone: "hot" },
    comments: "1.9万",
    cover: "https://picsum.photos/300/390?random=40",
    likes: "5.2万",
    readings: "86.5万",
    title: "王者之战",
  },
  {
    author: "天蚕土豆",
    badge: { label: "NEW", tone: "new" },
    comments: "5.6万",
    cover: "https://picsum.photos/300/390?random=41",
    likes: "12.8万",
    readings: "156.2万",
    title: "斗破苍穹",
  },
  {
    author: "蝴蝶蓝",
    badge: { label: "推荐", tone: "recommend" },
    comments: "4.8万",
    cover: "https://picsum.photos/300/390?random=42",
    likes: "10.3万",
    readings: "124.8万",
    title: "全职高手",
  },
  {
    author: "米二",
    comments: "4.2万",
    cover: "https://picsum.photos/300/390?random=43",
    likes: "8.7万",
    readings: "98.6万",
    title: "一人之下",
  },
  {
    author: "艺画开天",
    badge: { label: "HOT", tone: "hot" },
    comments: "3.6万",
    cover: "https://picsum.photos/300/390?random=44",
    likes: "7.2万",
    readings: "87.3万",
    title: "灵笼",
  },
  {
    author: "何小疯",
    badge: { label: "NEW", tone: "new" },
    comments: "3.9万",
    cover: "https://picsum.photos/300/390?random=45",
    likes: "16.5万",
    readings: "112.5万",
    title: "刺客伍六七",
  },
  {
    author: "MTJJ",
    comments: "2.7万",
    cover: "https://picsum.photos/300/390?random=46",
    likes: "14.2万",
    readings: "92.8万",
    title: "罗小黑战记",
  },
  {
    author: "林魂",
    badge: { label: "推荐", tone: "recommend" },
    comments: "2.3万",
    cover: "https://picsum.photos/300/390?random=47",
    likes: "12.8万",
    readings: "78.4万",
    title: "雾山五行",
  },
  {
    author: "RC",
    comments: "1.8万",
    cover: "https://picsum.photos/300/390?random=48",
    likes: "11.3万",
    readings: "65.7万",
    title: "大理寺日志",
  },
  {
    author: "李豪凌",
    badge: { label: "HOT", tone: "hot" },
    comments: "3.1万",
    cover: "https://picsum.photos/300/390?random=49",
    likes: "18.9万",
    readings: "105.3万",
    title: "时光代理人",
  },
] as const;

const badgeGradients: Record<BadgeTone, string> = {
  hot: "linear-gradient(135deg, var(--error), var(--accent-400))",
  new: "linear-gradient(135deg, var(--art-600), var(--art-500))",
  recommend: "linear-gradient(135deg, var(--accent-500), var(--accent-400))",
};

const footerColumns = [
  {
    links: [
      { href: "/home", label: "首页" },
      { href: "/category", label: "分类" },
      { href: "/ranking", label: "排行榜" },
      { href: "#", label: "AI创作" },
      { href: "#", label: "论坛" },
    ],
    title: "快速链接",
  },
  {
    links: [
      { href: "#", label: "平台介绍" },
      { href: "#", label: "加入我们" },
      { href: "#", label: "联系方式" },
      { href: "#", label: "用户协议" },
      { href: "#", label: "隐私政策" },
    ],
    title: "关于我们",
  },
  {
    links: [
      { href: "#", iconClass: "fab fa-weixin", label: "微信公众号" },
      { href: "#", iconClass: "fab fa-weibo", label: "微博" },
      { href: "#", iconClass: "fab fa-qq", label: "QQ群" },
      { href: "#", iconClass: "fab fa-bilibili", label: "B站" },
    ],
    title: "关注我们",
  },
] as const;

export default function Category() {
  const [activeFilter, setActiveFilter] =
    useState<(typeof filterOptions)[number]>("最新");
  const [activePage, setActivePage] = useState(1);

  return (
    <div className="min-h-screen bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)]">
      <header className="bg-[linear-gradient(135deg,var(--primary-700),var(--primary-800))] px-0 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
        <div className="m-0 px-10">
          <div className="flex flex-col items-center justify-between gap-5 min-[769px]:flex-row">
            <div className="flex items-center gap-[10px] text-[28px] font-extrabold text-white">
              <div className="flex h-[45px] w-[45px] items-center justify-center rounded-xl bg-white text-[color:var(--primary-700)]">
                <RobotIcon className="h-6 w-6" />
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

            <div className="group relative">
              <div className="flex cursor-pointer items-center gap-[10px] rounded-[30px] bg-white/10 px-3 py-2 transition-all duration-300 hover:bg-white/20">
                <img
                  alt="用户头像"
                  className="h-9 w-9 rounded-full border-2 border-white/50 object-cover"
                  src="https://picsum.photos/40/40?random=100"
                />
                <span className="text-[14px] font-semibold text-white">
                  漫画迷
                </span>
                <i className="fas fa-chevron-down text-[12px] text-white transition-transform duration-300 group-hover:rotate-180" />
              </div>

              <div className="invisible absolute right-0 top-[calc(100%+10px)] z-[1000] min-w-[180px] translate-y-[-10px] overflow-hidden rounded-xl bg-white opacity-0 shadow-[0_10px_40px_rgba(0,0,0,0.15)] transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <a
                  className="flex items-center gap-3 px-5 py-[14px] text-[14px] text-[color:var(--text-primary)] no-underline transition-all duration-300 hover:bg-[color:var(--bg-secondary)] hover:text-[color:var(--primary-600)]"
                  href="/my"
                >
                  <i className="fas fa-user w-[18px] text-center text-[color:var(--text-secondary)]" />
                  我的
                </a>
                <a
                  className="flex items-center gap-3 px-5 py-[14px] text-[14px] text-[color:var(--text-primary)] no-underline transition-all duration-300 hover:bg-[color:var(--bg-secondary)] hover:text-[color:var(--primary-600)]"
                  href="/my/settings"
                >
                  <i className="fas fa-cog w-[18px] text-center text-[color:var(--text-secondary)]" />
                  个人设置
                </a>
                <div className="mx-0 my-2 h-px bg-[color:var(--border)]" />
                <a
                  className="flex items-center gap-3 px-5 py-[14px] text-[14px] text-[color:var(--error)] no-underline transition-all duration-300 hover:bg-[#fef2f2]"
                  href="#"
                >
                  <i className="fas fa-sign-out-alt w-[18px] text-center text-[color:var(--error)]" />
                  退出账号
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-5">
        <section className="my-[30px]">
          <div className="mb-[30px] rounded-2xl bg-white px-[30px] py-[25px] shadow-[0_2px_15px_rgba(0,0,0,0.05)]">
            <h1 className="mb-5 flex items-center gap-3 text-2xl font-bold text-[color:var(--text-primary)]">
              <i className="fas fa-th-large text-[color:var(--primary-600)]" />

              漫画分类
            </h1>
            <p className="text-[15px] leading-[1.6] text-[color:var(--text-secondary)]">
              探索不同类型的漫画，找到您喜欢的内容。从热血战斗到温馨日常，从科幻冒险到浪漫爱情，这里应有尽有。
            </p>
          </div>


          <div className="mb-10 grid grid-cols-1 gap-[25px] min-[769px]:grid-cols-2 min-[993px]:grid-cols-3 min-[1201px]:grid-cols-5">
            {categoryItems.map((item) => (
              <article
                className="group cursor-pointer rounded-2xl bg-white p-[25px] text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
                key={item.name}
              >
                <div
                  className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full text-[32px] text-white transition-transform duration-300 group-hover:scale-110"
                  style={{ background: item.gradient }}
                >
                  <i className={item.iconClass} />
                </div>
                <h3 className="mb-[10px] text-[18px] font-bold text-[color:var(--text-primary)]">
                  {item.name}
                </h3>
                <p className="text-[14px] text-[color:var(--text-secondary)]">
                  {item.count}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-5 flex flex-col gap-4 min-[769px]:flex-row min-[769px]:items-center min-[769px]:justify-between">
            <h2 className="flex items-center gap-[10px] text-[20px] font-bold text-[color:var(--text-primary)]">
              <i className="fas fa-list text-[color:var(--accent-500)]" />
              热门分类 - 热血
            </h2>


            <div className="flex flex-wrap gap-[10px]">
              {filterOptions.map((filter) => (
                <button
                  className={[
                    "rounded-[20px] border px-4 py-2 text-[13px] transition-all duration-300",
                    activeFilter === filter
                      ? "border-[color:var(--primary-600)] bg-[color:var(--primary-600)] text-white"
                      : "border-[color:var(--border)] bg-white text-[color:var(--text-secondary)] hover:border-[color:var(--primary-600)] hover:bg-[color:var(--primary-600)] hover:text-white",
                  ].join(" ")}
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  type="button"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>


          <div className="grid grid-cols-2 gap-[25px] min-[769px]:grid-cols-3 min-[993px]:grid-cols-4 min-[1201px]:grid-cols-5">
            {comics.map((comic) => (
              <article
                className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]"
                key={comic.title}
              >
                <div className="relative w-full overflow-hidden pt-[130%]">

                  <img
                    alt={comic.title}
                    className="absolute left-0 top-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={comic.cover}
                  />
                  {comic.badge ? (
                    <span
                      className="absolute left-3 top-3 z-[2] rounded-md px-[10px] py-1 text-[11px] font-bold text-white"
                      style={{ background: badgeGradients[comic.badge.tone] }}
                    >
                      {comic.badge.label}
                    </span>
                  ) : null}
                </div>

                <div className="p-4">
                  <h3 className="mb-2 truncate text-[15px] font-bold text-[color:var(--text-primary)]">
                    {comic.title}
                  </h3>
                  <p className="mb-3 flex items-center gap-[6px] text-[13px] text-[color:var(--text-secondary)]">
                    <i className="fas fa-user text-[13px]" />
                    {comic.author}
                  </p>


                  <div className="flex justify-between border-t border-t-[color:var(--bg-secondary)] pt-3">
                    <span className="flex items-center gap-[5px] text-[12px] text-[color:var(--text-secondary)]">
                      <EyeIcon className="h-[13px] w-[13px] text-[color:var(--primary-600)]" />
                      {comic.readings}
                    </span>
                    <span className="flex items-center gap-[5px] text-[12px] text-[color:var(--text-secondary)]">
                      <CommentIcon className="h-[13px] w-[13px] text-[color:var(--accent-500)]" />
                      {comic.comments}
                    </span>
                    <span className="flex items-center gap-[5px] text-[12px] text-[color:var(--text-secondary)]">
                      <HeartIcon className="h-[13px] w-[13px] text-[color:var(--art-700)]" />
                      {comic.likes}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-[30px] flex items-center justify-center gap-[10px]">
            <button
              className={[
                "rounded-md border border-[color:var(--border)] bg-white px-4 py-2 transition-all duration-300",
                activePage === 1
                  ? "cursor-not-allowed text-[color:var(--text-secondary)] opacity-50"
                  : "cursor-pointer text-[color:var(--text-secondary)] hover:border-[color:var(--primary-600)] hover:text-[color:var(--primary-600)]",
              ].join(" ")}
              disabled={activePage === 1}
              onClick={() => setActivePage((page) => Math.max(1, page - 1))}
              type="button"
            >
              <ChevronLeftIcon className="h-[14px] w-[14px]" />
            </button>

            {paginationButtons.map((page) => (
              <button
                className={[
                  "rounded-md border px-4 py-2 text-[14px] transition-all duration-300",
                  activePage === page
                    ? "border-[color:var(--primary-600)] bg-[color:var(--primary-600)] text-white"
                    : "border-[color:var(--border)] bg-white text-[color:var(--text-secondary)] hover:border-[color:var(--primary-600)] hover:text-[color:var(--primary-600)]",
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
                "rounded-md border border-[color:var(--border)] bg-white px-4 py-2 transition-all duration-300",
                activePage === paginationButtons.length
                  ? "cursor-not-allowed text-[color:var(--text-secondary)] opacity-50"
                  : "cursor-pointer text-[color:var(--text-secondary)] hover:border-[color:var(--primary-600)] hover:text-[color:var(--primary-600)]",
              ].join(" ")}
              disabled={activePage === paginationButtons.length}
              onClick={() =>
                setActivePage((page) =>
                  Math.min(paginationButtons.length, page + 1),
                )
              }
              type="button"
            >
              <ChevronRightIcon className="h-[14px] w-[14px]" />
            </button>
          </div>
        </section>
      </main>


      <footer className="mt-10 bg-[color:var(--primary-900)] px-0 py-10 pb-5 text-white">
        <div className="mx-auto max-w-[1400px] px-5">
          <div className="mb-[30px] grid grid-cols-1 gap-10 min-[481px]:grid-cols-2 min-[769px]:grid-cols-[2fr_1fr_1fr_1fr]">
            <div>
              <div className="mb-[15px] flex items-center gap-[10px] text-[28px] font-extrabold text-white">
                <div className="flex h-[45px] w-[45px] items-center justify-center rounded-xl bg-white text-[color:var(--primary-700)]">
                  <RobotIcon className="h-6 w-6" />
                </div>
                <span>AI漫画</span>
              </div>
              <p className="text-[14px] leading-[1.8] text-[color:var(--text-secondary)]">
                AI漫画是一个专注于提供高质量漫画内容的平台，致力于为漫画爱好者打造最佳的阅读体验。
              </p>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title}>
                <h4 className="mb-5 text-[16px] text-white">{column.title}</h4>
                <ul className="list-none">
                  {column.links.map((link) => (
                    <li className="mb-3" key={link.label}>
                      <a
                        className="flex items-center gap-2 text-[14px] text-[color:var(--text-secondary)] no-underline transition-colors duration-300 hover:text-[color:var(--accent-500)]"
                        href={link.href}
                      >
                        {"iconClass" in link ? (
                          <i className={link.iconClass} />
                        ) : null}
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-t-white/10 pt-5 text-center text-[14px] text-[color:var(--text-secondary)]">
            <p>&copy; 2026 AI漫画. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );

}
