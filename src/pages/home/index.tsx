import { useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CommentIcon,
  EyeIcon,
  HeartIcon,
  TrophyIcon,
} from "../../components/Icon/rankingIcon";
import { FireIcon, UserIcon, StarIcon } from "../../components/Icon/homeIcon";

const carouselSlides = [
  {
    description: "AI科幻巨作，跨越星际的史诗冒险",
    image: "https://picsum.photos/1400/400?random=1",
    title: "🔥 星际穿越者",
  },
  {
    description: "轻松治愈的魔法日常，带给你温暖与欢乐",
    image: "https://picsum.photos/1400/400?random=2",
    title: "💜 魔法少女的日常",
  },
  {
    description: "热血战斗，强者为王的奇幻世界",
    image: "https://picsum.photos/1400/400?random=3",
    title: "⚔️ 王者之战",
  },
  {
    description: "浪漫唯美的青春恋爱故事",
    image: "https://picsum.photos/1400/400?random=4",
    title: "🌸 樱花下的约定",
  },
] as const;

const rankingTabs = ["周榜", "月榜", "总榜"] as const;

const rankingSections = [
  {
    items: [
      {
        cover: "https://picsum.photos/45/60?random=10",
        meta: [
          { icon: "eye", value: "125.6万" },
          { icon: "comment", value: "3.2万" },
        ],
        name: "星际穿越者",
        rank: 1,
      },
      {
        cover: "https://picsum.photos/45/60?random=11",
        meta: [
          { icon: "eye", value: "98.3万" },
          { icon: "comment", value: "2.8万" },
        ],
        name: "魔法少女的日常",
        rank: 2,
      },
      {
        cover: "https://picsum.photos/45/60?random=12",
        meta: [
          { icon: "eye", value: "86.5万" },
          { icon: "comment", value: "1.9万" },
        ],
        name: "王者之战",
        rank: 3,
      },
      {
        cover: "https://picsum.photos/45/60?random=13",
        meta: [
          { icon: "eye", value: "72.1万" },
          { icon: "comment", value: "1.5万" },
        ],
        name: "樱花下的约定",
        rank: 4,
      },
      {
        cover: "https://picsum.photos/45/60?random=14",
        meta: [
          { icon: "eye", value: "65.8万" },
          { icon: "comment", value: "1.2万" },
        ],
        name: "都市猎手",
        rank: 5,
      },
    ],
    icon: "eye",
    key: "reading",
    title: "阅读量排行",
  },
  {
    items: [
      {
        cover: "https://picsum.photos/45/60?random=15",
        meta: [
          { icon: "comment", value: "5.6万" },
          { accent: true, icon: "heart", value: "2.3万" },
        ],
        name: "斗破苍穹",
        rank: 1,
      },
      {
        cover: "https://picsum.photos/45/60?random=16",
        meta: [
          { icon: "comment", value: "4.8万" },
          { accent: true, icon: "heart", value: "1.9万" },
        ],
        name: "全职高手",
        rank: 2,
      },
      {
        cover: "https://picsum.photos/45/60?random=17",
        meta: [
          { icon: "comment", value: "4.2万" },
          { accent: true, icon: "heart", value: "1.7万" },
        ],
        name: "一人之下",
        rank: 3,
      },
      {
        cover: "https://picsum.photos/45/60?random=18",
        meta: [
          { icon: "comment", value: "3.6万" },
          { accent: true, icon: "heart", value: "1.4万" },
        ],
        name: "灵笼",
        rank: 4,
      },
      {
        cover: "https://picsum.photos/45/60?random=19",
        meta: [
          { icon: "comment", value: "3.1万" },
          { accent: true, icon: "heart", value: "1.2万" },
        ],
        name: "秦时明月",
        rank: 5,
      },
    ],
    icon: "comment",
    key: "comment",
    title: "最热评论",
  },
  {
    items: [
      {
        cover: "https://picsum.photos/45/60?random=20",
        meta: [
          { accent: true, icon: "heart", value: "18.9万" },
          { accent: "star", icon: "star", value: "4.8" },
        ],
        name: "时光代理人",
        rank: 1,
      },
      {
        cover: "https://picsum.photos/45/60?random=21",
        meta: [
          { accent: true, icon: "heart", value: "16.5万" },
          { accent: "star", icon: "star", value: "4.7" },
        ],
        name: "刺客伍六七",
        rank: 2,
      },
      {
        cover: "https://picsum.photos/45/60?random=22",
        meta: [
          { accent: true, icon: "heart", value: "14.2万" },
          { accent: "star", icon: "star", value: "4.9" },
        ],
        name: "罗小黑战记",
        rank: 3,
      },
      {
        cover: "https://picsum.photos/45/60?random=23",
        meta: [
          { accent: true, icon: "heart", value: "12.8万" },
          { accent: "star", icon: "star", value: "4.8" },
        ],
        name: "雾山五行",
        rank: 4,
      },
      {
        cover: "https://picsum.photos/45/60?random=24",
        meta: [
          { accent: true, icon: "heart", value: "11.3万" },
          { accent: "star", icon: "star", value: "4.6" },
        ],
        name: "大理寺日志",
        rank: 5,
      },
    ],
    icon: "heart",
    key: "like",
    title: "点赞排行",
  },
] as const;

const comics = [
  {
    author: "星辰创作",
    badge: "HOT",
    badgeKey: "hot",
    cover: "https://picsum.photos/300/390?random=30",
    rank: 1,
    stats: [
      { icon: "eye", value: "125.6万" },
      { icon: "comment", value: "3.2万" },
      { icon: "heart", value: "8.9万" },
    ],
    title: "星际穿越者",
  },
  {
    author: "萌系画师",
    badge: "NEW",
    badgeKey: "new",
    cover: "https://picsum.photos/300/390?random=31",
    rank: 2,
    stats: [
      { icon: "eye", value: "98.3万" },
      { icon: "comment", value: "2.8万" },
      { icon: "heart", value: "7.2万" },
    ],
    title: "魔法少女的日常",
  },
  {
    author: "战旗工作室",
    badge: "推荐",
    badgeKey: "recommend",
    cover: "https://picsum.photos/300/390?random=32",
    rank: 3,
    stats: [
      { icon: "eye", value: "86.5万" },
      { icon: "comment", value: "1.9万" },
      { icon: "heart", value: "6.5万" },
    ],
    title: "王者之战",
  },
  {
    author: "青春物語",
    badge: "HOT",
    badgeKey: "hot",
    cover: "https://picsum.photos/300/390?random=33",
    rank: 4,
    stats: [
      { icon: "eye", value: "72.1万" },
      { icon: "comment", value: "1.5万" },
      { icon: "heart", value: "5.8万" },
    ],
    title: "樱花下的约定",
  },
  {
    author: "都市传说",
    badge: "NEW",
    badgeKey: "new",
    cover: "https://picsum.photos/300/390?random=34",
    rank: 5,
    stats: [
      { icon: "eye", value: "65.8万" },
      { icon: "comment", value: "1.2万" },
      { icon: "heart", value: "4.9万" },
    ],
    title: "都市猎手",
  },
  {
    author: "时间工匠",
    badge: "推荐",
    badgeKey: "recommend",
    cover: "https://picsum.photos/300/390?random=35",
    rank: 6,
    stats: [
      { icon: "eye", value: "58.2万" },
      { icon: "comment", value: "1.1万" },
      { icon: "heart", value: "4.5万" },
    ],
    title: "时光代理人",
  },
  {
    author: "暗杀者联盟",
    badge: "HOT",
    badgeKey: "hot",
    cover: "https://picsum.photos/300/390?random=36",
    rank: 7,
    stats: [
      { icon: "eye", value: "52.6万" },
      { icon: "comment", value: "9800" },
      { icon: "heart", value: "4.2万" },
    ],
    title: "刺客伍六七",
  },
  {
    author: "森林精灵",
    badge: "NEW",
    badgeKey: "new",
    cover: "https://picsum.photos/300/390?random=37",
    rank: 8,
    stats: [
      { icon: "eye", value: "48.9万" },
      { icon: "comment", value: "8500" },
      { icon: "heart", value: "3.8万" },
    ],
    title: "罗小黑战记",
  },
  {
    author: "麒麟家族",
    badge: "推荐",
    badgeKey: "recommend",
    cover: "https://picsum.photos/300/390?random=38",
    rank: 9,
    stats: [
      { icon: "eye", value: "45.3万" },
      { icon: "comment", value: "7200" },
      { icon: "heart", value: "3.5万" },
    ],
    title: "雾山五行",
  },
  {
    author: "唐朝密探",
    badge: "HOT",
    badgeKey: "hot",
    cover: "https://picsum.photos/300/390?random=39",
    rank: 10,
    stats: [
      { icon: "eye", value: "41.7万" },
      { icon: "comment", value: "6800" },
      { icon: "heart", value: "3.2万" },
    ],
    title: "大理寺日志",
  },
] as const;

const stats = [
  { label: "漫画作品", unit: "+", value: "10,000" },
  { label: "活跃用户", unit: "万+", value: "500" },
  { label: "总阅读量", unit: "亿+", value: "1.2" },
  { label: "创作者", unit: "万+", value: "50" },
] as const;

function getRankingNumberClass(rank: number) {
  if (rank === 1) {
    return "bg-[linear-gradient(135deg,var(--rank-gold),#ffcc99)] text-white";
  }
  if (rank === 2) {
    return "bg-[linear-gradient(135deg,var(--rank-silver),#808080)] text-white";
  }
  if (rank === 3) {
    return "bg-[linear-gradient(135deg,var(--rank-bronze),#b36b24)] text-white";
  }
  return "bg-[color:var(--bg-secondary)] text-[color:var(--text-secondary)]";
}

function getRankingTitleClass(sectionKey: string) {
  if (sectionKey === "reading") return "text-[color:var(--primary-600)]";
  if (sectionKey === "comment") return "text-[color:var(--accent-500)]";
  return "text-[color:var(--art-700)]";
}

function getComicBadgeClass(badgeKey: string) {
  if (badgeKey === "hot") {
    return "bg-[linear-gradient(135deg,var(--error),var(--accent-400))]";
  }
  if (badgeKey === "new") {
    return "bg-[linear-gradient(135deg,var(--art-600),var(--art-500))]";
  }
  return "bg-[linear-gradient(135deg,var(--accent-500),var(--accent-400))]";
}

function renderMetaIcon(
  icon: "comment" | "eye" | "heart" | "star",
  accent?: true | "star",
) {
  const baseClass = "h-[14px] w-[14px]";

  if (icon === "eye") {
    return <EyeIcon className={baseClass} />;
  }
  if (icon === "comment") {
    return <CommentIcon className={baseClass} />;
  }
  if (icon === "heart") {
    return (
      <HeartIcon
        className={`${baseClass} ${accent ? "text-[color:var(--secondary)]" : ""}`}
      />
    );
  }
  return <StarIcon className={`${baseClass} text-[color:var(--accent-500)]`} />;
}

function renderSectionIcon(icon: "comment" | "eye" | "heart") {
  if (icon === "eye") {
    return <EyeIcon className="h-[18px] w-[18px]" />;
  }
  if (icon === "comment") {
    return <CommentIcon className="h-[18px] w-[18px]" />;
  }
  return <HeartIcon className="h-[18px] w-[18px]" />;
}

function renderComicStatIcon(icon: "comment" | "eye" | "heart") {
  const className = "h-[13px] w-[13px]";

  if (icon === "eye") {
    return <EyeIcon className={`${className} text-[color:var(--primary-600)]`} />;
  }
  if (icon === "comment") {
    return (
      <CommentIcon className={`${className} text-[color:var(--accent-500)]`} />
    );
  }
  return <HeartIcon className={`${className} text-[color:var(--art-700)]`} />;
}

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeRankingTab, setActiveRankingTab] =
    useState<(typeof rankingTabs)[number]>("周榜");

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % carouselSlides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const moveCarousel = (direction: -1 | 1) => {
    setActiveSlide(
      (current) =>
        (current + direction + carouselSlides.length) % carouselSlides.length,
    );
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg-secondary)] font-sans leading-[1.6] text-[color:var(--text-primary)]">
      <main className="mx-auto max-w-[1400px] px-5">
        <section className="my-[30px]">
          <div className="relative h-[400px] overflow-hidden rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
            <div
              className="flex h-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {carouselSlides.map((slide) => (
                <div className="relative h-full min-w-full" key={slide.title}>
                  <img
                    alt={slide.title}
                    className="h-full w-full object-cover"
                    src={slide.image}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8),transparent)] px-10 pb-10 pt-[60px] text-white">
                    <h2 className="mb-[10px] text-[32px] [text-shadow:2px_2px_4px_rgba(0,0,0,0.3)]">
                      {slide.title}
                    </h2>
                    <p className="text-[16px] opacity-90">{slide.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="absolute left-5 top-1/2 flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full border-none bg-white/20 text-white backdrop-blur-[10px] transition-all duration-300 hover:scale-110 hover:bg-[color:var(--primary-600)]"
              onClick={() => moveCarousel(-1)}
              type="button"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              className="absolute right-5 top-1/2 flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full border-none bg-white/20 text-white backdrop-blur-[10px] transition-all duration-300 hover:scale-110 hover:bg-[color:var(--primary-600)]"
              onClick={() => moveCarousel(1)}
              type="button"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>

            <div className="absolute bottom-5 right-10 flex gap-[10px]">
              {carouselSlides.map((slide, index) => (
                <button
                  className={[
                    "h-3 rounded-[10px] bg-white/50 transition-all duration-300",
                    activeSlide === index ? "w-[30px] bg-white" : "w-3",
                  ].join(" ")}
                  key={slide.title}
                  onClick={() => setActiveSlide(index)}
                  type="button"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-[25px] flex items-center gap-3 text-2xl font-bold text-[color:var(--text-primary)]">
            <TrophyIcon className="h-6 w-6 text-[color:var(--primary-600)]" />
            漫画排行榜
          </h2>

          <div className="grid grid-cols-1 gap-[25px] min-[993px]:grid-cols-3">
            {rankingSections.map((section) => (
              <section
                className="rounded-2xl bg-white p-[25px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
                key={section.key}
              >
                <div className="mb-5 flex items-center justify-between border-b-2 border-b-[color:var(--bg-secondary)] pb-[15px]">
                  <h3
                    className={[
                      "flex items-center gap-[10px] text-[18px] font-bold",
                      getRankingTitleClass(section.key),
                    ].join(" ")}
                  >
                    {renderSectionIcon(section.icon)}
                    {section.title}
                  </h3>
                </div>

                <ul className="list-none">
                  {section.items.map((item) => (
                    <li
                      className="flex cursor-pointer items-center border-b border-b-[color:var(--bg-secondary)] px-0 py-3 transition-all duration-300 last:border-b-0 hover:-mx-[10px] hover:rounded-lg hover:bg-[color:var(--bg-secondary)] hover:px-[10px]"
                      key={`${section.key}-${item.rank}`}
                    >
                      <span
                        className={[
                          "mr-[15px] flex h-7 w-7 items-center justify-center rounded-lg text-[14px] font-bold",
                          getRankingNumberClass(item.rank),
                        ].join(" ")}
                      >
                        {item.rank}
                      </span>

                      <img
                        alt="封面"
                        className="mr-[15px] h-[60px] w-[45px] rounded-[6px] object-cover"
                        src={item.cover}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 truncate text-[14px] font-semibold text-[color:var(--text-primary)]">
                          {item.name}
                        </div>
                        <div className="flex gap-[15px] text-[12px] text-[color:var(--text-secondary)]">
                          {item.meta.map((meta, index) => (
                            <span
                              className="flex items-center gap-1"
                              key={`${item.rank}-${meta.icon}-${index}`}
                            >
                              {renderMetaIcon(
                                meta.icon,
                                "accent" in meta ? meta.accent : undefined,
                              )}
                              {meta.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-[25px] flex items-center gap-3 text-2xl font-bold text-[color:var(--text-primary)]">
            <FireIcon className="h-6 w-6 text-[color:var(--primary-600)]" />
            热门漫画
          </h2>

          <div className="grid grid-cols-1 gap-[25px] min-[560px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1200px]:grid-cols-4 min-[1400px]:grid-cols-5">
            {comics.map((comic) => (
              <article
                className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]"
                key={comic.rank}
              >
                <div className="relative w-full overflow-hidden pt-[130%]">
                  <img
                    alt={comic.title}
                    className="absolute left-0 top-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={comic.cover}
                  />
                  <span
                    className={[
                      "absolute left-3 top-3 z-[2] rounded-[6px] px-[10px] py-1 text-[11px] font-bold text-white",
                      getComicBadgeClass(comic.badgeKey),
                    ].join(" ")}
                  >
                    {comic.badge}
                  </span>
                  <span className="absolute right-3 top-3 z-[2] flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--primary-600)] text-[12px] font-bold text-white">
                    {comic.rank}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="mb-2 truncate text-[15px] font-bold text-[color:var(--text-primary)]">
                    {comic.title}
                  </h3>
                  <p className="mb-3 flex items-center gap-[6px] text-[13px] text-[color:var(--text-secondary)]">
                    <UserIcon className="h-[13px] w-[13px]" />
                    {comic.author}
                  </p>
                  <div className="flex justify-between border-t border-t-[color:var(--bg-secondary)] pt-3">
                    {comic.stats.map((stat) => (
                      <span
                        className="flex items-center gap-[5px] text-[12px] text-[color:var(--text-secondary)]"
                        key={`${comic.rank}-${stat.icon}`}
                      >
                        {renderComicStatIcon(stat.icon)}
                        {stat.value}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-[20px] bg-[linear-gradient(135deg,var(--primary-700),var(--primary-800))] p-10 text-white">
          <div className="flex flex-wrap items-center justify-between gap-[30px]">
            <div>
              <h2 className="mb-2 text-2xl font-bold">平台数据统计</h2>
              <p className="text-[15px] opacity-90">
                致力于打造最优质的AI漫画创作平台
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 min-[900px]:grid-cols-4 min-[900px]:gap-[60px]">
              {stats.map((stat) => (
                <div className="text-center" key={stat.label}>
                  <div className="flex items-baseline justify-center gap-[5px] text-[36px] font-extrabold">
                    <span>{stat.value}</span>
                    <span className="text-[18px] opacity-80">{stat.unit}</span>
                  </div>
                  <div className="mt-[5px] text-[14px] opacity-90">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
