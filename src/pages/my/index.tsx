import { useState, type ReactNode, type SVGProps } from "react";
import styles from "./index.module.css";

type TabKey = "comics" | "templates";

type NavLinkItem = {
  active?: boolean;
  href: string;
  label: string;
};

type ProfileStat = {
  label: string;
  value: string;
};

type ComicItem = {
  category: string;
  cover: string;
  id: string;
  title: string;
  views: string;
};

type TemplateItem = {
  cover: string;
  id: string;
  name: string;
  rating: string;
  views: string;
};

type FooterColumn = {
  links: Array<{ href: string; label: string }>;
  title: string;
};

type IconProps = SVGProps<SVGSVGElement>;

const navLinks: NavLinkItem[] = [
  { href: "/", label: "首页" },
  { href: "#", label: "分类" },
  { href: "/ranking", label: "排行榜" },
  { href: "#", label: "AI创作" },
  { href: "#", label: "论坛" },
];

const profileStats: ProfileStat[] = [
  { label: "收藏漫画", value: "12" },
  { label: "收藏模板", value: "8" },
  { label: "创作作品", value: "5" },
  { label: "积分", value: "128" },
];

const comics: ComicItem[] = [
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
    title: "樱花树下的约定",
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
];

const templates: TemplateItem[] = [
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
];

const footerColumns: FooterColumn[] = [
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
      { href: "#", label: "API 文档" },
    ],
    title: "资源下载",
  },
];

const defaultFavorites = [...comics, ...templates].reduce<
  Record<string, boolean>
>((result, item) => {
  result[item.id] = true;
  return result;
}, {});

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function SvgIcon({
  children,
  className,
  viewBox = "0 0 24 24",
  ...props
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox={viewBox}
      {...props}
    >
      {children}
    </svg>
  );
}

function PencilIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </SvgIcon>
  );
}

function SearchIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </SvgIcon>
  );
}

function UserIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </SvgIcon>
  );
}

function HeartIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m12 20-1.2-1.1C5.3 14 2 11 2 7.5A4.5 4.5 0 0 1 6.5 3C8.2 3 9.9 3.8 11 5.1 12.1 3.8 13.8 3 15.5 3A4.5 4.5 0 0 1 20 7.5c0 3.5-3.3 6.5-8.8 11.4L12 20Z" />
    </SvgIcon>
  );
}

function EyeIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </SvgIcon>
  );
}

function StarIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9Z" />
    </SvgIcon>
  );
}

export default function MyPage() {
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
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.logo} href="/">
            <span className={styles.logoIcon}>
              <PencilIcon className={styles.logoIconSvg} />
            </span>
            <span>AI漫画</span>
          </a>

          <div className={styles.searchBox}>
            <SearchIcon className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="搜索漫画、作者..."
              type="text"
            />
            <button className={styles.searchButton} type="button">
              搜索
            </button>
          </div>

          <nav className={styles.navMenu}>
            {navLinks.map((link) => (
              <a
                className={cx(
                  styles.navLink,
                  link.active && styles.navLinkActive,
                )}
                href={link.href}
                key={link.label}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a className={styles.userMenuLink} href="#">
            登录/注册
          </a>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.profileSection}>
          <div className={styles.profileAvatar}>
            <UserIcon className={styles.profileAvatarIcon} />
          </div>

          <div className={styles.profileInfo}>
            <div>
              <h1 className={styles.profileName}>用户名</h1>
              <p className={styles.profileSubtitle}>
                管理你的收藏、模板和个人创作记录。
              </p>
            </div>

            <div className={styles.profileStats}>
              {profileStats.map((stat) => (
                <div className={styles.profileStat} key={stat.label}>
                  <span className={styles.profileStatValue}>{stat.value}</span>
                  <span className={styles.profileStatLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.profileActions}>
            <button
              className={cx(styles.actionButton, styles.primaryButton)}
              type="button"
            >
              编辑资料
            </button>
          </div>
        </section>

        <section className={styles.collectionSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>
              <HeartIcon className={styles.sectionIcon} />
              我的收藏
            </h2>
          </div>

          <div className={styles.tabs} role="tablist">
            <button
              aria-selected={activeTab === "comics"}
              className={cx(
                styles.tab,
                activeTab === "comics" && styles.tabActive,
              )}
              onClick={() => setActiveTab("comics")}
              role="tab"
              type="button"
            >
              收藏漫画
            </button>
            <button
              aria-selected={activeTab === "templates"}
              className={cx(
                styles.tab,
                activeTab === "templates" && styles.tabActive,
              )}
              onClick={() => setActiveTab("templates")}
              role="tab"
              type="button"
            >
              收藏模板
            </button>
          </div>

          {activeTab === "comics" ? (
            <div className={styles.comicGrid}>
              {comics.map((comic) => (
                <article className={styles.collectionCard} key={comic.id}>
                  <div className={styles.coverWrapper}>
                    <img
                      alt={`${comic.title}封面`}
                      className={styles.coverImage}
                      src={comic.cover}
                    />
                    <button
                      aria-label={favorites[comic.id] ? "取消收藏" : "收藏"}
                      className={cx(
                        styles.favoriteButton,
                        favorites[comic.id] && styles.favoriteButtonActive,
                      )}
                      onClick={() => toggleFavorite(comic.id)}
                      type="button"
                    >
                      <HeartIcon className={styles.favoriteIcon} />
                    </button>
                  </div>
                  <div className={styles.cardBody}>
                    <a className={styles.cardTitle} href="#">
                      {comic.title}
                    </a>
                    <div className={styles.cardMeta}>
                      <span>{comic.category}</span>
                      <span>{comic.views}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.templateGrid}>
              {templates.map((template) => (
                <article className={styles.collectionCard} key={template.id}>
                  <div className={styles.templateCoverWrapper}>
                    <img
                      alt={`${template.name}模板封面`}
                      className={styles.coverImage}
                      src={template.cover}
                    />
                    <button
                      aria-label={favorites[template.id] ? "取消收藏" : "收藏"}
                      className={cx(
                        styles.favoriteButton,
                        favorites[template.id] && styles.favoriteButtonActive,
                      )}
                      onClick={() => toggleFavorite(template.id)}
                      type="button"
                    >
                      <HeartIcon className={styles.favoriteIcon} />
                    </button>
                  </div>
                  <div className={styles.cardBodyLarge}>
                    <a className={styles.cardTitle} href="#">
                      {template.name}
                    </a>
                    <div className={styles.templateStats}>
                      <span className={styles.templateStat}>
                        <EyeIcon className={styles.templateStatIcon} />
                        {template.views}
                      </span>
                      <span className={styles.templateStat}>
                        <StarIcon className={styles.templateStatIcon} />
                        {template.rating}
                      </span>
                    </div>
                    <button
                      className={styles.useTemplateButton}
                      onClick={() => window.alert(`使用模板：${template.name}`)}
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
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <a className={styles.logo} href="/">
                <span className={styles.logoIcon}>
                  <PencilIcon className={styles.logoIconSvg} />
                </span>
                <span>AI漫画</span>
              </a>
              <p className={styles.footerDescription}>
                AI漫画是一个面向创作者的智能漫画平台，提供高质量的漫画生成、
                模板复用和作品管理能力。
              </p>
            </div>

            {footerColumns.map((column) => (
              <div className={styles.footerColumn} key={column.title}>
                <h3 className={styles.footerColumnTitle}>{column.title}</h3>
                <ul className={styles.footerList}>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a className={styles.footerLink} href={link.href}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.footerBottom}>
            <p>&copy; 2026 AI漫画. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
