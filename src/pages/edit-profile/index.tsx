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

type NavLinkItem = {
  active?: boolean;
  href: string;
  label: string;
};

type FooterColumn = {
  links: Array<{ href: string; label: string }>;
  title: string;
};

type FormValues = {
  bio: string;
  email: string;
  phone: string;
  username: string;
};

type FormErrorKey = keyof FormValues | "avatar";

type FormErrors = Partial<Record<FormErrorKey, string>>;

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

const defaultValues: FormValues = {
  username: "漫画作者001",
  email: "user@example.com",
  phone: "138****8888",
  bio: "热爱漫画创作，喜欢用 AI 把脑海里的故事拆成镜头和分镜。",
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

function EditIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m4 20 4.5-1 9-9a2.12 2.12 0 0 0-3-3l-9 9L4 20Z" />
      <path d="M13.5 6.5 17 10" />
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

function CameraIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 8h3l2-3h6l2 3h3v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <circle cx="12" cy="13" r="3" />
    </IconBase>
  );
}

function MailIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect height="14" rx="2" width="18" x="3" y="5" />
      <path d="m4 7 8 6 8-6" />
    </IconBase>
  );
}

function PhoneIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.3 19.3 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6.3 6.3l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6A2 2 0 0 1 22 16.9Z" />
    </IconBase>
  );
}

function InfoIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
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

function CloseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m18 6-12 12" />
      <path d="m6 6 12 12" />
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

function validateForm(values: FormValues) {
  const nextErrors: FormErrors = {};
  const username = values.username.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const bio = values.bio.trim();

  if (!username) {
    nextErrors.username = "请输入用户名。";
  } else if (username.length < 4 || username.length > 20) {
    nextErrors.username = "用户名长度需在 4 到 20 个字符之间。";
  }

  if (!email) {
    nextErrors.email = "请输入邮箱地址。";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    nextErrors.email = "请输入有效的邮箱地址。";
  }

  if (phone && !/^[0-9*+\-\s()]{7,20}$/.test(phone)) {
    nextErrors.phone = "请输入有效的手机号或联系电话。";
  }

  if (bio.length > 200) {
    nextErrors.bio = "个人简介最多填写 200 个字符。";
  }

  return nextErrors;
}

export default function EditProfilePage() {
  const [formValues, setFormValues] = useState<FormValues>(defaultValues);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  useEffect(() => {
    if (!isSuccessVisible) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setIsSuccessVisible(false);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [isSuccessVisible]);

  const updateField =
    (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      setFormValues((current) => ({
        ...current,
        [field]: value,
      }));

      setFormErrors((current) => {
        if (!current[field]) {
          return current;
        }

        const nextErrors = { ...current };
        delete nextErrors[field];
        return nextErrors;
      });
    };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFormErrors((current) => ({
        ...current,
        avatar: "图片大小不能超过 2MB。",
      }));
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);

    setFormErrors((current) => {
      if (!current.avatar) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors.avatar;
      return nextErrors;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm(formValues);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setIsSuccessVisible(false);
      return;
    }

    setIsSuccessVisible(true);
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
              <a
                className={cn(
                  styles.navLink,
                  item.active && styles.navLinkActive,
                )}
                href={item.href}
                key={item.label}
              >
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
              <EditIcon className={styles.titleIcon} />
              编辑资料
            </h1>

            <Link className={styles.backLink} to="/my">
              <ArrowLeftIcon className={styles.buttonIcon} />
              返回我的主页
            </Link>
          </div>

          <section className={styles.card}>
            {isSuccessVisible ? (
              <div className={styles.successMessage}>
                <CheckCircleIcon className={styles.successIcon} />
                资料更新成功，已保存你的最新信息。
              </div>
            ) : null}

            <div className={styles.cardHeader}>
              <div className={styles.avatarSection}>
                <label className={styles.avatarButton} htmlFor="avatar-upload">
                  {avatarPreview ? (
                    <img
                      alt="头像预览"
                      className={styles.avatarImage}
                      src={avatarPreview}
                    />
                  ) : (
                    <UserIcon className={styles.avatarFallback} />
                  )}
                </label>

                <label className={styles.uploadLabel} htmlFor="avatar-upload">
                  <CameraIcon className={styles.buttonIcon} />
                  更换头像
                </label>

                <input
                  accept="image/*"
                  className={styles.avatarInput}
                  id="avatar-upload"
                  onChange={handleAvatarChange}
                  type="file"
                />

                <p className={styles.avatarHint}>
                  支持 JPG、PNG 格式，文件大小不超过 2MB。
                </p>

                {formErrors.avatar ? (
                  <p className={styles.avatarError}>{formErrors.avatar}</p>
                ) : null}
              </div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="username">
                  <UserIcon className={styles.labelIcon} />
                  用户名
                </label>
                <input
                  className={styles.formInput}
                  id="username"
                  onChange={updateField("username")}
                  placeholder="请输入用户名"
                  type="text"
                  value={formValues.username}
                />
                <p className={styles.formHint}>
                  4 到 20 个字符，建议使用易识别的名称。
                </p>
                {formErrors.username ? (
                  <p className={styles.errorText}>{formErrors.username}</p>
                ) : null}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="email">
                  <MailIcon className={styles.labelIcon} />
                  邮箱
                </label>
                <input
                  className={styles.formInput}
                  id="email"
                  onChange={updateField("email")}
                  placeholder="请输入邮箱地址"
                  type="email"
                  value={formValues.email}
                />
                {formErrors.email ? (
                  <p className={styles.errorText}>{formErrors.email}</p>
                ) : null}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="phone">
                  <PhoneIcon className={styles.labelIcon} />
                  手机号
                </label>
                <input
                  className={styles.formInput}
                  id="phone"
                  onChange={updateField("phone")}
                  placeholder="请输入手机号"
                  type="tel"
                  value={formValues.phone}
                />
                {formErrors.phone ? (
                  <p className={styles.errorText}>{formErrors.phone}</p>
                ) : null}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="bio">
                  <InfoIcon className={styles.labelIcon} />
                  个人简介
                </label>
                <textarea
                  className={cn(styles.formInput, styles.textarea)}
                  id="bio"
                  onChange={updateField("bio")}
                  placeholder="介绍一下你自己..."
                  value={formValues.bio}
                />
                <p className={styles.formHint}>
                  最多 200 个字符，当前 {formValues.bio.trim().length} 个字符。
                </p>
                {formErrors.bio ? (
                  <p className={styles.errorText}>{formErrors.bio}</p>
                ) : null}
              </div>

              <div className={styles.formActions}>
                <button className={styles.primaryButton} type="submit">
                  <SaveIcon className={styles.buttonIcon} />
                  保存修改
                </button>

                <Link className={styles.secondaryButton} to="/my">
                  <CloseIcon className={styles.buttonIcon} />
                  取消
                </Link>
              </div>
            </form>
          </section>
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
