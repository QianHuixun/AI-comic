import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  type SVGProps,
} from "react";
import { Link } from "react-router-dom";
import styles from "./index.module.css";

type SettingsTab = "account" | "ai";

type NavLinkItem = {
  href: string;
  label: string;
};

type FooterColumn = {
  links: Array<{ href: string; label: string }>;
  title: string;
};

type NoticeState = {
  message: string;
  tone: "error" | "success";
} | null;

type AccountForm = {
  confirmPassword: string;
  currentPassword: string;
  newPassword: string;
  phone: string;
};

type AccountErrors = Partial<Record<keyof AccountForm, string>>;

type ModelKey = "v1" | "v2";

type AiState = {
  autoSave: boolean;
  enableHistory: boolean;
  selectedModel: ModelKey;
  v1Creativity: string;
  v1Quality: string;
  v2Creativity: string;
  v2Quality: string;
  v2Speed: string;
};

type IconProps = SVGProps<SVGSVGElement>;

const navLinks: NavLinkItem[] = [
  { href: "/", label: "首页" },
  { href: "#", label: "分类" },
  { href: "/ranking", label: "排行榜" },
  { href: "#", label: "AI创作" },
  { href: "#", label: "论坛" },
];

const footerColumns: FooterColumn[] = [
  {
    title: "关于我们",
    links: [
      { href: "#", label: "平台介绍" },
      { href: "#", label: "团队成员" },
      { href: "#", label: "联系方式" },
      { href: "#", label: "加入我们" },
    ],
  },
  {
    title: "帮助中心",
    links: [
      { href: "#", label: "使用指南" },
      { href: "#", label: "常见问题" },
      { href: "#", label: "意见反馈" },
      { href: "#", label: "隐私政策" },
    ],
  },
  {
    title: "资源下载",
    links: [
      { href: "#", label: "客户端" },
      { href: "#", label: "素材库" },
      { href: "#", label: "模板下载" },
      { href: "#", label: "API 文档" },
    ],
  },
];

const defaultAccountForm: AccountForm = {
  phone: "138****8888",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const defaultAiState: AiState = {
  selectedModel: "v2",
  v2Quality: "高质量",
  v2Creativity: "平衡",
  v2Speed: "标准",
  v1Quality: "高质量",
  v1Creativity: "平衡",
  autoSave: true,
  enableHistory: true,
};

function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function IconBase({
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
      strokeWidth="1.8"
      viewBox={viewBox}
      {...props}
    >
      {children}
    </svg>
  );
}

function PencilIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
    </IconBase>
  );
}

function SearchIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconBase>
  );
}

function CogIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c0 .7.4 1.4 1.1 1.6H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1.1Z" />
    </IconBase>
  );
}

function ArrowLeftIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </IconBase>
  );
}

function UserIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </IconBase>
  );
}

function RobotIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect height="10" rx="2" width="14" x="5" y="9" />
      <path d="M12 5v4" />
      <path d="M8 3h8" />
      <circle cx="10" cy="13" r="1" />
      <circle cx="14" cy="13" r="1" />
      <path d="M9 17h6" />
    </IconBase>
  );
}

function SaveIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 21h14a1 1 0 0 0 1-1V7.4a1 1 0 0 0-.3-.7l-2.4-2.4a1 1 0 0 0-.7-.3H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 4v5h8" />
    </IconBase>
  );
}

function RefreshIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M21 12a9 9 0 1 1-2.6-6.4" />
      <path d="M21 3v6h-6" />
    </IconBase>
  );
}

function CheckCircleIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 5-5" />
    </IconBase>
  );
}

function AlertCircleIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </IconBase>
  );
}

function validateAccountForm(values: AccountForm) {
  const errors: AccountErrors = {};
  const phone = values.phone.trim();
  const currentPassword = values.currentPassword.trim();
  const newPassword = values.newPassword.trim();
  const confirmPassword = values.confirmPassword.trim();

  if (phone && !/^[0-9*+\-\s()]{7,20}$/.test(phone)) {
    errors.phone = "请输入有效的手机号或联系电话。";
  }

  if (currentPassword || newPassword || confirmPassword) {
    if (!currentPassword) {
      errors.currentPassword = "修改密码前需要先输入当前密码。";
    }

    if (!newPassword) {
      errors.newPassword = "请输入新密码。";
    } else if (newPassword.length < 8) {
      errors.newPassword = "新密码至少需要 8 位字符。";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "请再次输入新密码。";
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = "两次输入的新密码不一致。";
    }
  }

  return errors;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [accountForm, setAccountForm] =
    useState<AccountForm>(defaultAccountForm);
  const [accountErrors, setAccountErrors] = useState<AccountErrors>({});
  const [aiState, setAiState] = useState<AiState>(defaultAiState);
  const [notice, setNotice] = useState<NoticeState>(null);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setNotice(null);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [notice]);

  const updateAccountField =
    (field: keyof AccountForm) => (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setAccountForm((current) => ({
        ...current,
        [field]: value,
      }));

      setAccountErrors((current) => {
        if (!current[field]) {
          return current;
        }

        const nextErrors = { ...current };
        delete nextErrors[field];
        return nextErrors;
      });
    };

  const updateAiField =
    (field: keyof AiState) =>
    (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      const value =
        event.target instanceof HTMLInputElement &&
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;

      setAiState((current) => ({
        ...current,
        [field]: value,
      }));
    };

  const handleAccountSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateAccountForm(accountForm);
    setAccountErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setNotice({
        tone: "error",
        message: "个人账号设置未保存，请先修正表单中的问题。",
      });
      return;
    }

    setNotice({
      tone: "success",
      message: "个人账号设置已保存。",
    });
  };

  const handleAiSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice({
      tone: "success",
      message: "AI 配置已保存。",
    });
  };

  const handleResetAi = () => {
    setAiState(defaultAiState);
    setNotice({
      tone: "success",
      message: "AI 配置已恢复为默认设置。",
    });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.logo} to="/">
            <span className={styles.logoIcon}>
              <PencilIcon className="h-5 w-5" />
            </span>
            <span className={styles.logoText}>AI漫画</span>
          </Link>

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
            {navLinks.map((item) => (
              <a className={styles.navLink} href={item.href} key={item.label}>
                {item.label}
              </a>
            ))}
          </nav>

          <a className={styles.userLink} href="#">
            登录 / 注册
          </a>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>
              <CogIcon className={styles.titleIcon} />
              个人设置
            </h1>

            <Link className={styles.backLink} to="/my">
              <ArrowLeftIcon className={styles.buttonIcon} />
              返回我的主页
            </Link>
          </div>

          <div className={styles.shell}>
            <aside className={styles.sidebar}>
              <h2 className={styles.sidebarTitle}>设置菜单</h2>
              <div className={styles.tabList} role="tablist">
                <button
                  aria-selected={activeTab === "account"}
                  className={cn(
                    styles.tabButton,
                    activeTab === "account" && styles.tabButtonActive,
                  )}
                  onClick={() => setActiveTab("account")}
                  role="tab"
                  type="button"
                >
                  <UserIcon className={styles.tabIcon} />
                  个人账号
                </button>

                <button
                  aria-selected={activeTab === "ai"}
                  className={cn(
                    styles.tabButton,
                    activeTab === "ai" && styles.tabButtonActive,
                  )}
                  onClick={() => setActiveTab("ai")}
                  role="tab"
                  type="button"
                >
                  <RobotIcon className={styles.tabIcon} />
                  AI 配置
                </button>
              </div>
            </aside>

            <section className={styles.content}>
              {notice ? (
                <div
                  className={cn(
                    styles.notice,
                    notice.tone === "success"
                      ? styles.noticeSuccess
                      : styles.noticeError,
                  )}
                >
                  {notice.tone === "success" ? (
                    <CheckCircleIcon className={styles.noticeIcon} />
                  ) : (
                    <AlertCircleIcon className={styles.noticeIcon} />
                  )}
                  {notice.message}
                </div>
              ) : null}

              {activeTab === "account" ? (
                <div>
                  <div className={styles.sectionHeading}>
                    <h2 className={styles.sectionHeadingTitle}>个人账号设置</h2>
                    <p className={styles.sectionHeadingText}>
                      管理你的联系方式和密码安全信息。
                    </p>
                  </div>

                  <form className={styles.form} onSubmit={handleAccountSubmit}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel} htmlFor="phone">
                        手机号
                      </label>
                      <input
                        className={styles.fieldInput}
                        id="phone"
                        onChange={updateAccountField("phone")}
                        type="tel"
                        value={accountForm.phone}
                      />
                      {accountErrors.phone ? (
                        <p className={styles.errorText}>
                          {accountErrors.phone}
                        </p>
                      ) : null}
                    </div>

                    <h3 className={styles.subSectionTitle}>密码设置</h3>

                    <div className={styles.fieldGroup}>
                      <label
                        className={styles.fieldLabel}
                        htmlFor="current-password"
                      >
                        当前密码
                      </label>
                      <input
                        className={styles.fieldInput}
                        id="current-password"
                        onChange={updateAccountField("currentPassword")}
                        placeholder="请输入当前密码"
                        type="password"
                        value={accountForm.currentPassword}
                      />
                      {accountErrors.currentPassword ? (
                        <p className={styles.errorText}>
                          {accountErrors.currentPassword}
                        </p>
                      ) : null}
                    </div>

                    <div className={styles.fieldGroup}>
                      <label
                        className={styles.fieldLabel}
                        htmlFor="new-password"
                      >
                        新密码
                      </label>
                      <input
                        className={styles.fieldInput}
                        id="new-password"
                        onChange={updateAccountField("newPassword")}
                        placeholder="请输入新密码"
                        type="password"
                        value={accountForm.newPassword}
                      />
                      <p className={styles.fieldHint}>
                        建议至少 8 位，包含数字与字母。
                      </p>
                      {accountErrors.newPassword ? (
                        <p className={styles.errorText}>
                          {accountErrors.newPassword}
                        </p>
                      ) : null}
                    </div>

                    <div className={styles.fieldGroup}>
                      <label
                        className={styles.fieldLabel}
                        htmlFor="confirm-password"
                      >
                        确认新密码
                      </label>
                      <input
                        className={styles.fieldInput}
                        id="confirm-password"
                        onChange={updateAccountField("confirmPassword")}
                        placeholder="请再次输入新密码"
                        type="password"
                        value={accountForm.confirmPassword}
                      />
                      {accountErrors.confirmPassword ? (
                        <p className={styles.errorText}>
                          {accountErrors.confirmPassword}
                        </p>
                      ) : null}
                    </div>

                    <div className={styles.buttonRow}>
                      <button className={styles.primaryButton} type="submit">
                        <SaveIcon className={styles.buttonIcon} />
                        保存更改
                      </button>

                      <button
                        className={styles.secondaryButton}
                        onClick={() => setAccountForm(defaultAccountForm)}
                        type="button"
                      >
                        <RefreshIcon className={styles.buttonIcon} />
                        取消
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <div className={styles.sectionHeading}>
                    <h2 className={styles.sectionHeadingTitle}>AI 配置设置</h2>
                    <p className={styles.sectionHeadingText}>
                      选择常用模型，并配置默认的生成参数。
                    </p>
                  </div>

                  <form className={styles.form} onSubmit={handleAiSubmit}>
                    <div className={styles.modelList}>
                      <article
                        className={cn(
                          styles.modelCard,
                          aiState.selectedModel === "v2" &&
                            styles.modelCardActive,
                        )}
                      >
                        <div className={styles.modelHeader}>
                          <div>
                            <h3 className={styles.modelTitle}>
                              AI 漫画生成模型 v2.0
                            </h3>
                            <p className={styles.modelDescription}>
                              新一代生成模型，适合复杂叙事、风格控制和更高质量的画面输出。
                            </p>
                          </div>
                          <input
                            checked={aiState.selectedModel === "v2"}
                            className={styles.radio}
                            name="ai-model"
                            onChange={() =>
                              setAiState((current) => ({
                                ...current,
                                selectedModel: "v2",
                              }))
                            }
                            type="radio"
                          />
                        </div>

                        <div className={styles.modelGrid}>
                          <div className={styles.fieldGroup}>
                            <label
                              className={styles.fieldLabel}
                              htmlFor="v2-quality"
                            >
                              生成质量
                            </label>
                            <select
                              className={styles.fieldSelect}
                              id="v2-quality"
                              onChange={updateAiField("v2Quality")}
                              value={aiState.v2Quality}
                            >
                              <option value="标准">标准</option>
                              <option value="高质量">高质量</option>
                              <option value="超高质量">超高质量</option>
                            </select>
                          </div>

                          <div className={styles.fieldGroup}>
                            <label
                              className={styles.fieldLabel}
                              htmlFor="v2-creativity"
                            >
                              创意程度
                            </label>
                            <select
                              className={styles.fieldSelect}
                              id="v2-creativity"
                              onChange={updateAiField("v2Creativity")}
                              value={aiState.v2Creativity}
                            >
                              <option value="保守">保守</option>
                              <option value="平衡">平衡</option>
                              <option value="激进">激进</option>
                            </select>
                          </div>

                          <div className={styles.fieldGroup}>
                            <label
                              className={styles.fieldLabel}
                              htmlFor="v2-speed"
                            >
                              生成速度
                            </label>
                            <select
                              className={styles.fieldSelect}
                              id="v2-speed"
                              onChange={updateAiField("v2Speed")}
                              value={aiState.v2Speed}
                            >
                              <option value="快速">快速</option>
                              <option value="标准">标准</option>
                              <option value="精修">精修</option>
                            </select>
                          </div>
                        </div>
                      </article>

                      <article
                        className={cn(
                          styles.modelCard,
                          aiState.selectedModel === "v1" &&
                            styles.modelCardActive,
                        )}
                      >
                        <div className={styles.modelHeader}>
                          <div>
                            <h3 className={styles.modelTitle}>
                              AI 漫画生成模型 v1.5
                            </h3>
                            <p className={styles.modelDescription}>
                              稳定版本，适合常规漫画场景和批量生产流程。
                            </p>
                          </div>
                          <input
                            checked={aiState.selectedModel === "v1"}
                            className={styles.radio}
                            name="ai-model"
                            onChange={() =>
                              setAiState((current) => ({
                                ...current,
                                selectedModel: "v1",
                              }))
                            }
                            type="radio"
                          />
                        </div>

                        <div className={styles.modelGrid}>
                          <div className={styles.fieldGroup}>
                            <label
                              className={styles.fieldLabel}
                              htmlFor="v1-quality"
                            >
                              生成质量
                            </label>
                            <select
                              className={styles.fieldSelect}
                              id="v1-quality"
                              onChange={updateAiField("v1Quality")}
                              value={aiState.v1Quality}
                            >
                              <option value="标准">标准</option>
                              <option value="高质量">高质量</option>
                            </select>
                          </div>

                          <div className={styles.fieldGroup}>
                            <label
                              className={styles.fieldLabel}
                              htmlFor="v1-creativity"
                            >
                              创意程度
                            </label>
                            <select
                              className={styles.fieldSelect}
                              id="v1-creativity"
                              onChange={updateAiField("v1Creativity")}
                              value={aiState.v1Creativity}
                            >
                              <option value="保守">保守</option>
                              <option value="平衡">平衡</option>
                            </select>
                          </div>
                        </div>
                      </article>
                    </div>

                    <div className={styles.toggleList}>
                      <label className={styles.toggleItem}>
                        <span>
                          <span className={styles.toggleTitle}>
                            自动保存生成结果
                          </span>
                          <span className={styles.toggleDescription}>
                            每次生成完成后自动加入作品记录。
                          </span>
                        </span>
                        <span
                          className={cn(
                            styles.toggleControl,
                            aiState.autoSave && styles.toggleControlActive,
                          )}
                        >
                          <input
                            checked={aiState.autoSave}
                            className={styles.srOnly}
                            onChange={updateAiField("autoSave")}
                            type="checkbox"
                          />
                          <span
                            className={cn(
                              styles.toggleThumb,
                              aiState.autoSave && styles.toggleThumbActive,
                            )}
                          />
                        </span>
                      </label>

                      <label className={styles.toggleItem}>
                        <span>
                          <span className={styles.toggleTitle}>
                            启用生成历史记录
                          </span>
                          <span className={styles.toggleDescription}>
                            保留参数与结果，方便快速复用。
                          </span>
                        </span>
                        <span
                          className={cn(
                            styles.toggleControl,
                            aiState.enableHistory && styles.toggleControlActive,
                          )}
                        >
                          <input
                            checked={aiState.enableHistory}
                            className={styles.srOnly}
                            onChange={updateAiField("enableHistory")}
                            type="checkbox"
                          />
                          <span
                            className={cn(
                              styles.toggleThumb,
                              aiState.enableHistory && styles.toggleThumbActive,
                            )}
                          />
                        </span>
                      </label>
                    </div>

                    <div className={styles.buttonRow}>
                      <button className={styles.primaryButton} type="submit">
                        <SaveIcon className={styles.buttonIcon} />
                        保存配置
                      </button>

                      <button
                        className={styles.secondaryButton}
                        onClick={handleResetAi}
                        type="button"
                      >
                        <RefreshIcon className={styles.buttonIcon} />
                        恢复默认
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <Link className={styles.logo} to="/">
                <span className={styles.logoIcon}>
                  <PencilIcon className="h-5 w-5" />
                </span>
                <span className={styles.logoText}>AI漫画</span>
              </Link>
              <p className={styles.footerText}>
                AI漫画是一个面向创作者的智能漫画平台，提供高质量的生成、模板复用和作品管理能力。
              </p>
            </div>

            {footerColumns.map((column) => (
              <div className={styles.footerColumn} key={column.title}>
                <h2 className={styles.footerTitle}>{column.title}</h2>
                <div className={styles.footerList}>
                  {column.links.map((link) => (
                    <a
                      className={styles.footerLink}
                      href={link.href}
                      key={link.label}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.footerBottom}>
            &copy; 2026 AI漫画. 保留所有权利。
          </div>
        </div>
      </footer>
    </div>
  );
}
