import { useState } from "react";
import { CrownIcon, TrophyIcon, EyeIcon, CommentIcon, HeartIcon, ChevronLeftIcon, ChevronRightIcon } from "../../components/Icon/rankingIcon";
import type { TopComic, RankingSection, MetaItem } from "../../lib/types/ranking";

const topComics: TopComic[] = [
  {
    author: "作者：星辰创作",
    cover: "https://picsum.photos/400/560?random=1",
    rank: 1,
    stats: [
      { label: "阅读量", value: "125.6万" },
      { label: "评论", value: "3.2万" },
      { label: "点赞", value: "8.9万" },
    ],
    title: "星际穿越者",
  },
  {
    author: "作者：萌系画师",
    cover: "https://picsum.photos/400/560?random=2",
    rank: 2,
    stats: [
      { label: "阅读量", value: "98.3万" },
      { label: "评论", value: "2.8万" },
      { label: "点赞", value: "7.2万" },
    ],
    title: "魔法少女的日常",
  },
  {
    author: "作者：热血漫迷",
    cover: "https://picsum.photos/400/560?random=3",
    rank: 3,
    stats: [
      { label: "阅读量", value: "86.5万" },
      { label: "评论", value: "1.9万" },
      { label: "点赞", value: "6.5万" },
    ],
    title: "王者之战",
  },
  {
    author: "作者：唯美画师",
    cover: "https://picsum.photos/400/560?random=4",
    rank: 4,
    stats: [
      { label: "阅读量", value: "72.1万" },
      { label: "评论", value: "1.5万" },
      { label: "点赞", value: "5.8万" },
    ],
    title: "樱花下的约定",
  },
  {
    author: "作者：都市传说",
    cover: "https://picsum.photos/400/560?random=5",
    rank: 5,
    stats: [
      { label: "阅读量", value: "65.8万" },
      { label: "评论", value: "1.2万" },
      { label: "点赞", value: "4.9万" },
    ],
    title: "都市猎手",
  },
];

const rankingSections: RankingSection[] = [
  {
    icon: "eye",
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
      {
        cover: "https://picsum.photos/45/60?random=15",
        meta: [
          { icon: "eye", value: "58.3万" },
          { icon: "comment", value: "1.0万" },
        ],
        name: "斗破苍穹",
        rank: 6,
      },
      {
        cover: "https://picsum.photos/45/60?random=16",
        meta: [
          { icon: "eye", value: "52.7万" },
          { icon: "comment", value: "0.9万" },
        ],
        name: "全职高手",
        rank: 7,
      },
      {
        cover: "https://picsum.photos/45/60?random=17",
        meta: [
          { icon: "eye", value: "48.9万" },
          { icon: "comment", value: "0.8万" },
        ],
        name: "一人之下",
        rank: 8,
      },
      {
        cover: "https://picsum.photos/45/60?random=18",
        meta: [
          { icon: "eye", value: "45.2万" },
          { icon: "comment", value: "0.7万" },
        ],
        name: "灵笼",
        rank: 9,
      },
      {
        cover: "https://picsum.photos/45/60?random=19",
        meta: [
          { icon: "eye", value: "41.5万" },
          { icon: "comment", value: "0.6万" },
        ],
        name: "秦时明月",
        rank: 10,
      },
    ],
    key: "reading",
    title: "阅读量排行",
  },
  {
    icon: "comments",
    items: [
      {
        cover: "https://picsum.photos/45/60?random=20",
        meta: [
          { icon: "comment", value: "5.6万" },
          { accent: true, icon: "heart", value: "2.3万" },
        ],
        name: "斗破苍穹",
        rank: 1,
      },
      {
        cover: "https://picsum.photos/45/60?random=21",
        meta: [
          { icon: "comment", value: "4.8万" },
          { accent: true, icon: "heart", value: "1.9万" },
        ],
        name: "全职高手",
        rank: 2,
      },
      {
        cover: "https://picsum.photos/45/60?random=22",
        meta: [
          { icon: "comment", value: "4.2万" },
          { accent: true, icon: "heart", value: "1.7万" },
        ],
        name: "一人之下",
        rank: 3,
      },
      {
        cover: "https://picsum.photos/45/60?random=23",
        meta: [
          { icon: "comment", value: "3.6万" },
          { accent: true, icon: "heart", value: "1.4万" },
        ],
        name: "灵笼",
        rank: 4,
      },
      {
        cover: "https://picsum.photos/45/60?random=24",
        meta: [
          { icon: "comment", value: "3.1万" },
          { accent: true, icon: "heart", value: "1.2万" },
        ],
        name: "秦时明月",
        rank: 5,
      },
      {
        cover: "https://picsum.photos/45/60?random=25",
        meta: [
          { icon: "comment", value: "2.9万" },
          { accent: true, icon: "heart", value: "1.1万" },
        ],
        name: "星际穿越者",
        rank: 6,
      },
      {
        cover: "https://picsum.photos/45/60?random=26",
        meta: [
          { icon: "comment", value: "2.7万" },
          { accent: true, icon: "heart", value: "1.0万" },
        ],
        name: "魔法少女的日常",
        rank: 7,
      },
      {
        cover: "https://picsum.photos/45/60?random=27",
        meta: [
          { icon: "comment", value: "2.4万" },
          { accent: true, icon: "heart", value: "0.9万" },
        ],
        name: "王者之战",
        rank: 8,
      },
      {
        cover: "https://picsum.photos/45/60?random=28",
        meta: [
          { icon: "comment", value: "2.1万" },
          { accent: true, icon: "heart", value: "0.8万" },
        ],
        name: "樱花下的约定",
        rank: 9,
      },
      {
        cover: "https://picsum.photos/45/60?random=29",
        meta: [
          { icon: "comment", value: "1.8万" },
          { accent: true, icon: "heart", value: "0.7万" },
        ],
        name: "都市猎手",
        rank: 10,
      },
    ],
    key: "comment",
    title: "最热评论",
  },
];

const paginationButtons = [1, 2, 3, 4, 5] as const;

function getTopCardBorderClass(rank: number) {
  if (rank === 1) return "border-2 border-[color:var(--rank-gold)]";
  if (rank === 2) return "border-2 border-[color:var(--rank-silver)]";
  if (rank === 3) return "border-2 border-[color:var(--rank-bronze)]";
  return "border border-[color:var(--border)]";
}

 function getBadgeClass(rank: number) {
  if (rank === 1) {
    return "bg-[linear-gradient(135deg,var(--rank-gold),#ffcc99)]";
  }
  if (rank === 2) {
    return "bg-[linear-gradient(135deg,var(--rank-silver),#808080)]";
  }
  if (rank === 3) {
    return "bg-[linear-gradient(135deg,var(--rank-bronze),#b36b24)]";
  }
  return "bg-[color:var(--primary-600)]";
}

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

function getSectionTitleClass(sectionKey: RankingSection["key"]) {
  if (sectionKey === "reading") {
    return "text-[color:var(--primary-600)]";
  }
  return "text-[color:var(--accent-500)]";
}

function getMetaIcon(meta: MetaItem) {
  const className = meta.accent
    ? "h-[14px] w-[14px] text-[color:var(--secondary)]"
    : "h-[14px] w-[14px]";

  if (meta.icon === "eye") return <EyeIcon className={className} />;
  if (meta.icon === "heart") return <HeartIcon className={className} />;
  return <CommentIcon className={className} />;
}

export default function Ranking() {
  const [activePage, setActivePage] = useState(1);

  return (
    <div className="min-h-screen bg-[color:var(--bg-secondary)] font-sans leading-[1.6] text-[color:var(--text-primary)]">
      <main className="mx-auto max-w-[1400px] px-5">
        <section className="my-10">
          <h2 className="mb-[25px] flex items-center gap-3 text-2xl font-bold text-[color:var(--text-primary)]">
            <CrownIcon className="h-6 w-6 text-[color:var(--primary-600)]" />
            热门前5
          </h2>

          <div className="mb-[30px] grid grid-cols-1 gap-[15px] min-[993px]:grid-cols-3 min-[1201px]:grid-cols-5">
            {topComics.map((comic) => (
              <article
                className={[
                  "group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_5px_15px_rgba(0,0,0,0.12)]",
                  getTopCardBorderClass(comic.rank),
                ].join(" ")}
                key={comic.rank}
              >
                <div className="relative w-full overflow-hidden pt-[120%]">
                  <img
                    alt={comic.title}
                    className="absolute left-0 top-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    src={comic.cover}
                  />
                  <div
                    className={[
                      "absolute left-2 top-2 z-[2] flex h-7 w-7 items-center justify-center rounded-[6px] text-xs font-extrabold text-white",
                      getBadgeClass(comic.rank),
                    ].join(" ")}
                  >
                    {comic.rank}
                  </div>
                </div>

                <div className="p-[10px]">
                  <h3 className="mb-[3px] truncate text-[12px] font-bold text-[color:var(--text-primary)]">
                    {comic.title}
                  </h3>
                  <p className="mb-[6px] truncate text-[10px] text-[color:var(--text-secondary)]">
                    {comic.author}
                  </p>

                  <div className="flex justify-between border-t border-t-[color:var(--bg-secondary)] pt-[6px]">
                    {comic.stats.map((stat) => (
                      <div
                        className="flex flex-col items-center"
                        key={`${comic.rank}-${stat.label}`}
                      >
                        <div className="text-[10px] font-bold text-[color:var(--primary-600)]">
                          {stat.value}
                        </div>
                        <div className="mt-px text-[8px] text-[color:var(--text-secondary)]">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="my-10">
          <h2 className="mb-[25px] flex items-center gap-3 text-2xl font-bold text-[color:var(--text-primary)]">
            <TrophyIcon className="h-6 w-6 text-[color:var(--primary-600)]" />
            漫画排行榜
          </h2>

          <div className="mb-10 grid w-full grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[25px]">
            {rankingSections.map((section) => (
              <section
                className="rounded-2xl bg-white p-[25px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
                key={section.key}
              >
                <div className="mb-5 flex items-center justify-between border-b-2 border-b-[color:var(--bg-secondary)] pb-[15px]">
                  <h3
                    className={[
                      "flex items-center gap-[10px] text-[18px] font-bold",
                      getSectionTitleClass(section.key),
                    ].join(" ")}
                  >
                    {section.icon === "eye" ? (
                      <EyeIcon className="h-[18px] w-[18px]" />
                    ) : (
                      <CommentIcon className="h-[18px] w-[18px]" />
                    )}
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

                      <div className="flex-1">
                        <div className="mb-1 truncate text-[14px] font-semibold text-[color:var(--text-primary)]">
                          {item.name}
                        </div>
                        <div className="flex gap-[15px] text-[12px] text-[color:var(--text-secondary)]">
                          {item.meta.map((meta, index) => (
                            <span
                              className="flex items-center gap-1"
                              key={`${item.rank}-${meta.icon}-${index}`}
                            >
                              {getMetaIcon(meta)}
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

          <div className="mb-10 mt-10 flex items-center justify-center gap-[10px]">
            <button
              className={[
                "rounded-lg border border-[color:var(--border)] bg-white px-[18px] py-[10px] text-[14px] font-semibold transition-all duration-300",
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
                  "rounded-lg border px-[18px] py-[10px] text-[14px] font-semibold transition-all duration-300",
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
                "rounded-lg border border-[color:var(--border)] bg-white px-[18px] py-[10px] text-[14px] font-semibold transition-all duration-300",
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
    </div>
  );
}
