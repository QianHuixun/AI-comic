import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TabKey, ProfileStat, ComicItem, TemplateItem } from "../../lib/types/my";
import { UserIcon, HeartIcon, EyeIcon, StarIcon } from "../../components/Icon/my";

const profileStats: ReadonlyArray<ProfileStat> = [
  { label: "收藏漫画", value: "12" },
  { label: "收藏模板", value: "8" },
  { label: "创作作品", value: "5" },
  { label: "积分", value: "128" },
] as const;

const comics: ReadonlyArray<ComicItem> = [
  {
    category: "科幻",
    cover: "https://picsum.photos/200/260?random=1",
    id: "comic-1",
    title: "星际穿越者",
    views: "125.6万阅读",
  },
  {
    category: "奇幻",
    cover: "https://picsum.photos/200/260?random=2",
    id: "comic-2",
    title: "魔法少女的日常",
    views: "98.3万阅读",
  },
  {
    category: "动作",
    cover: "https://picsum.photos/200/260?random=3",
    id: "comic-3",
    title: "王者之战",
    views: "86.5万阅读",
  },
  {
    category: "爱情",
    cover: "https://picsum.photos/200/260?random=4",
    id: "comic-4",
    title: "樱花下的约定",
    views: "72.1万阅读",
  },
  {
    category: "都市",
    cover: "https://picsum.photos/200/260?random=5",
    id: "comic-5",
    title: "都市猎手",
    views: "65.8万阅读",
  },
  {
    category: "玄幻",
    cover: "https://picsum.photos/200/260?random=6",
    id: "comic-6",
    title: "斗破苍穹",
    views: "58.3万阅读",
  },
] as const;

const templates: ReadonlyArray<TemplateItem> = [
  {
    cover: "https://picsum.photos/250/180?random=10",
    id: "template-1",
    name: "星际战争",
    rating: "4.8",
    views: "12.5万",
  },
  {
    cover: "https://picsum.photos/250/180?random=11",
    id: "template-2",
    name: "古风美人",
    rating: "4.6",
    views: "9.8万",
  },
  {
    cover: "https://picsum.photos/250/180?random=12",
    id: "template-3",
    name: "超级英雄",
    rating: "4.7",
    views: "8.6万",
  },
  {
    cover: "https://picsum.photos/250/180?random=13",
    id: "template-4",
    name: "Q版动物",
    rating: "4.9",
    views: "7.2万",
  },
] as const;

const defaultFavorites = [...comics, ...templates].reduce<
  Record<string, boolean>
>((result, item) => {
  result[item.id] = true;
  return result;
}, {});

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export default function MyPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>("comics");
  const [favorites, setFavorites] =
    useState<Record<string, boolean>>(defaultFavorites);

  const toggleFavorite = (id: string) => {
    setFavorites((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)]">
      <main className="px-0 py-10">
        <div className="mx-auto max-w-[1400px] px-5">
          <section className="mb-10 flex items-center gap-[30px] rounded-[20px] bg-white p-[30px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] max-[992px]:flex-col max-[992px]:text-center">
            <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--secondary),var(--accent-600))] text-white max-[480px]:h-[100px] max-[480px]:w-[100px]">
              <UserIcon className="h-12 w-12 max-[480px]:h-10 max-[480px]:w-10" />
            </div>

            <div className="flex flex-1 flex-col gap-5">
              <div className="text-[24px] font-bold text-[color:var(--text-primary)] max-[480px]:text-[20px]">
                用户名称
              </div>

              <div className="flex gap-[30px] max-[992px]:justify-center max-[480px]:gap-5">
                {profileStats.map((stat) => (
                  <div
                    className="flex flex-col items-center"
                    key={stat.label}
                  >
                    <div className="text-[18px] font-semibold text-[color:var(--text-primary)]">
                      {stat.value}
                    </div>
                    <div className="text-[14px] text-[color:var(--text-secondary)]">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ml-auto flex gap-[15px] max-[992px]:ml-0 max-[992px]:justify-center">
              <button
                className="rounded-xl border-2 border-[color:var(--secondary)] bg-[color:var(--secondary)] px-5 py-[10px] text-[14px] font-semibold text-white transition-all duration-300 hover:border-[color:var(--accent-600)] hover:bg-[color:var(--accent-600)]"
                onClick={() => navigate("/my/edit-profile")}
                type="button"
              >
                编辑资料
              </button>
            </div>
          </section>

          <section className="mb-10 rounded-[20px] bg-white p-[30px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] max-[768px]:p-5">
            <h2 className="mb-[30px] flex items-center gap-[10px] text-[24px] font-bold text-[color:var(--text-primary)] max-[480px]:text-[20px]">
              <HeartIcon className="h-6 w-6 text-[color:var(--secondary)]" />
              我的收藏
            </h2>

            <div className="mb-[30px] flex gap-5 overflow-x-auto border-b-2 border-b-[color:var(--border)] pb-0 max-[768px]:pb-[10px]">
              <button
                className={cx(
                  "border-b-[3px] px-6 py-3 text-[15px] font-semibold transition-all duration-300",
                  activeTab === "comics"
                    ? "border-b-[color:var(--secondary)] text-[color:var(--secondary)]"
                    : "border-b-transparent text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]",
                )}
                onClick={() => setActiveTab("comics")}
                type="button"
              >
                收藏漫画
              </button>
              <button
                className={cx(
                  "border-b-[3px] px-6 py-3 text-[15px] font-semibold transition-all duration-300",
                  activeTab === "templates"
                    ? "border-b-[color:var(--secondary)] text-[color:var(--secondary)]"
                    : "border-b-transparent text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]",
                )}
                onClick={() => setActiveTab("templates")}
                type="button"
              >
                收藏模板
              </button>
            </div>

            {activeTab === "comics" ? (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-5 min-[769px]:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
                {comics.map((comic) => (
                  <article
                    className="overflow-hidden rounded-2xl bg-[color:var(--bg-secondary)] shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
                    key={comic.id}
                  >
                    <div className="relative h-[260px] w-full overflow-hidden bg-[color:var(--neutral-200)]">
                      <img
                        alt="漫画封面"
                        className="h-full w-full object-cover"
                        src={comic.cover}
                      />
                      <button
                        className={cx(
                          "absolute right-[10px] top-[10px] flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-110",
                          favorites[comic.id]
                            ? "text-[color:var(--secondary)]"
                            : "text-[color:var(--text-secondary)] hover:text-[color:var(--secondary)]",
                        )}
                        onClick={() => toggleFavorite(comic.id)}
                        type="button"
                      >
                        <HeartIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="p-[15px]">
                      <a
                        className="mb-2 block text-[16px] font-semibold text-[color:var(--text-primary)] no-underline transition-colors duration-300 hover:text-[color:var(--secondary)]"
                        href="#"
                      >
                        {comic.title}
                      </a>
                      <div className="flex justify-between text-[14px] text-[color:var(--text-secondary)]">
                        <span>{comic.category}</span>
                        <span>{comic.views}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[25px] min-[769px]:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                {templates.map((template) => (
                  <article
                    className="overflow-hidden rounded-2xl bg-[color:var(--bg-secondary)] shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
                    key={template.id}
                  >
                    <div className="relative h-[180px] w-full overflow-hidden bg-[color:var(--neutral-200)]">
                      <img
                        alt="模板"
                        className="h-full w-full object-cover"
                        src={template.cover}
                      />
                      <button
                        className={cx(
                          "absolute right-[10px] top-[10px] flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-110",
                          favorites[template.id]
                            ? "text-[color:var(--secondary)]"
                            : "text-[color:var(--text-secondary)] hover:text-[color:var(--secondary)]",
                        )}
                        onClick={() => toggleFavorite(template.id)}
                        type="button"
                      >
                        <HeartIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="p-5">
                      <a
                        className="mb-2 block text-[16px] font-semibold text-[color:var(--text-primary)] no-underline transition-colors duration-300 hover:text-[color:var(--secondary)]"
                        href="#"
                      >
                        {template.name}
                      </a>
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
                        className="w-full rounded-lg bg-[color:var(--secondary)] px-[10px] py-[10px] text-[14px] font-semibold text-white transition-all duration-300 hover:bg-[color:var(--accent-600)]"
                        onClick={() => window.alert("使用此模板")}
                        type="button"
                      >
                        使用此模板
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
