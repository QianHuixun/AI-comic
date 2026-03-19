import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  type SVGProps,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./index.module.css";

type AuthTab = "login" | "register";

type NoticeState = {
  message: string;
  tone: "error" | "success";
} | null;

type LoginForm = {
  password: string;
  phone: string;
  remember: boolean;
};
type RegisterForm = {
  agreement: boolean;
  confirmPassword: string;
  password: string;
  phone: string;
};

type FormErrors = Partial<
  Record<"agreement" | "confirmPassword" | "password" | "phone", string>
>;

type FeatureItem = {
  description: string;
  title: string;
};

type SocialItem = {
  badgeClass: string;
  badgeText: string;
  label: string;
};

type IconProps = SVGProps<SVGSVGElement>;

const featureItems: FeatureItem[] = [
  {
    title: "海量漫画资源",
    description: "每日持续更新热门作品、专题栏目和精选推荐。",
  },
  {
    title: "多设备同步",
    description: "阅读记录、收藏和创作偏好在不同设备之间自动同步。",
  },
  {
    title: "个性化推荐",
    description: "根据你的浏览和创作偏好，推荐更相关的内容。",
  },
  {
    title: "社区互动",
    description: "与创作者和读者交流，分享作品和阅读感受。",
  },
];

const socialItems: SocialItem[] = [
  { badgeText: "微", badgeClass: styles.badgeWechat, label: "微信" },
  { badgeText: "Q", badgeClass: styles.badgeQq, label: "QQ" },
  { badgeText: "博", badgeClass: styles.badgeWeibo, label: "微博" },
];

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

function ArrowLeftIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
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

function LockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect height="11" rx="2" width="14" x="5" y="11" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </IconBase>
  );
}

function BookIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" />
    </IconBase>
  );
}

function SparkIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7Z" />
      <path d="M5 17h.01" />
      <path d="M19 17h.01" />
    </IconBase>
  );
}

function MessageIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 10h10" />
      <path d="M7 14h6" />
      <path d="M21 12a8 8 0 0 1-8 8H5l-3 3V12a8 8 0 0 1 8-8h3a8 8 0 0 1 8 8Z" />
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

function featureIcon(index: number) {
  if (index === 0) {
    return <BookIcon className="h-4 w-4" />;
  }

  if (index === 1) {
    return <PhoneIcon className="h-4 w-4" />;
  }

  if (index === 2) {
    return <SparkIcon className="h-4 w-4" />;
  }

  return <MessageIcon className="h-4 w-4" />;
}

function validatePhone(phone: string) {
  return /^[0-9+\-\s()]{7,20}$/.test(phone.trim());
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [notice, setNotice] = useState<NoticeState>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState<LoginForm>({
    phone: "",
    password: "",
    remember: false,
  });
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    phone: "",
    password: "",
    confirmPassword: "",
    agreement: false,
  });
  const [loginErrors, setLoginErrors] = useState<FormErrors>({});
  const [registerErrors, setRegisterErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setNotice(null);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [notice]);

  const handleFocus = (name: string) => () => setFocusedField(name);

  const handleBlur = () => {
    setFocusedField(null);
  };

  const updateLoginField =
    (field: keyof LoginForm) => (event: ChangeEvent<HTMLInputElement>) => {
      const value =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;

      setLoginForm((current) => ({
        ...current,
        [field]: value,
      }));

      setLoginErrors((current) => {
        if (!current.phone && !current.password) {
          return current;
        }

        return {
          ...current,
          [field]: undefined,
        };
      });
    };

  const updateRegisterField =
    (field: keyof RegisterForm) => (event: ChangeEvent<HTMLInputElement>) => {
      const value =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;

      setRegisterForm((current) => ({
        ...current,
        [field]: value,
      }));

      setRegisterErrors((current) => {
        if (
          !current.phone &&
          !current.password &&
          !current.confirmPassword &&
          !current.agreement
        ) {
          return current;
        }

        return {
          ...current,
          [field]: undefined,
        };
      });
    };

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (!loginForm.phone.trim()) {
      nextErrors.phone = "请输入手机号。";
    } else if (!validatePhone(loginForm.phone)) {
      nextErrors.phone = "请输入有效的手机号。";
    }

    if (!loginForm.password.trim()) {
      nextErrors.password = "请输入密码。";
    }

    setLoginErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setNotice({
        tone: "error",
        message: "登录失败，请检查手机号和密码是否填写完整。",
      });
      return;
    }

    setNotice({
      tone: "success",
      message: "登录成功，正在跳转首页。",
    });

    window.setTimeout(() => {
      navigate("/");
    }, 900);
  };

  const handleRegisterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (!registerForm.phone.trim()) {
      nextErrors.phone = "请输入手机号。";
    } else if (!validatePhone(registerForm.phone)) {
      nextErrors.phone = "请输入有效的手机号。";
    }

    if (!registerForm.password.trim()) {
      nextErrors.password = "请设置密码。";
    } else if (registerForm.password.trim().length < 8) {
      nextErrors.password = "密码至少需要 8 位字符。";
    }

    if (!registerForm.confirmPassword.trim()) {
      nextErrors.confirmPassword = "请再次输入密码。";
    } else if (registerForm.confirmPassword !== registerForm.password) {
      nextErrors.confirmPassword = "两次输入的密码不一致。";
    }

    if (!registerForm.agreement) {
      nextErrors.agreement = "请先勾选用户协议与隐私政策。";
    }

    setRegisterErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setNotice({
        tone: "error",
        message: "注册失败，请先修正表单中的问题。",
      });
      return;
    }

    setNotice({
      tone: "success",
      message: "注册成功，正在跳转首页。",
    });

    window.setTimeout(() => {
      navigate("/");
    }, 900);
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.brandBar}>
          <Link className={styles.logo} to="/">
            <span className={styles.logoIcon}>
              <PencilIcon className="h-5 w-5" />
            </span>
            <span className={styles.logoText}>AI漫画</span>
          </Link>

          <Link className={styles.backLink} to="/">
            <ArrowLeftIcon className="mr-1 inline h-4 w-4" />
            返回首页
          </Link>
        </div>

        <section className={styles.card}>
          <div className={styles.visualPanel}>
            <div className={styles.visualInner}>
              <div className={styles.heroBlock}>
                <span className={styles.eyebrow}>WELCOME</span>
                <h1 className={styles.heroTitle}>欢迎来到 AI漫画</h1>
                <p className={styles.heroText}>
                  探索无限精彩的漫画世界，开始你的阅读、收藏和创作旅程。
                </p>
              </div>

              <div className={styles.featureList}>
                {featureItems.map((item, index) => (
                  <article className={styles.featureItem} key={item.title}>
                    <div className={styles.featureIcon}>
                      {featureIcon(index)}
                    </div>
                    <div>
                      <h2 className={styles.featureTitle}>{item.title}</h2>
                      <p className={styles.featureText}>{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.formPanel}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>
                {activeTab === "login" ? "账号登录" : "创建账号"}
              </h2>
              <p className={styles.formSubtitle}>
                {activeTab === "login"
                  ? "登录后即可继续你的阅读和创作进度。"
                  : "注册后可同步收藏、模板和 AI 生成偏好。"}
              </p>
            </div>

            <div className={styles.tabs} role="tablist">
              <button
                aria-selected={activeTab === "login"}
                className={cn(
                  styles.tabButton,
                  activeTab === "login" && styles.tabButtonActive,
                )}
                onClick={() => {
                  setActiveTab("login");
                  setNotice(null);
                }}
                role="tab"
                type="button"
              >
                登录
              </button>

              <button
                aria-selected={activeTab === "register"}
                className={cn(
                  styles.tabButton,
                  activeTab === "register" && styles.tabButtonActive,
                )}
                onClick={() => {
                  setActiveTab("register");
                  setNotice(null);
                }}
                role="tab"
                type="button"
              >
                注册
              </button>
            </div>

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

            {activeTab === "login" ? (
              <form className={styles.form} onSubmit={handleLoginSubmit}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="login-phone">
                    手机号
                  </label>
                  <div
                    className={cn(
                      styles.fieldWrap,
                      focusedField === "login-phone" && styles.fieldWrapFocused,
                    )}
                  >
                    <PhoneIcon className={styles.fieldIcon} />
                    <input
                      className={styles.fieldInput}
                      id="login-phone"
                      onBlur={handleBlur}
                      onChange={updateLoginField("phone")}
                      onFocus={handleFocus("login-phone")}
                      placeholder="请输入手机号"
                      type="tel"
                      value={loginForm.phone}
                    />
                  </div>
                  {loginErrors.phone ? (
                    <p className={styles.errorText}>{loginErrors.phone}</p>
                  ) : null}
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="login-password">
                    密码
                  </label>
                  <div
                    className={cn(
                      styles.fieldWrap,
                      focusedField === "login-password" &&
                        styles.fieldWrapFocused,
                    )}
                  >
                    <LockIcon className={styles.fieldIcon} />
                    <input
                      className={styles.fieldInput}
                      id="login-password"
                      onBlur={handleBlur}
                      onChange={updateLoginField("password")}
                      onFocus={handleFocus("login-password")}
                      placeholder="请输入密码"
                      type="password"
                      value={loginForm.password}
                    />
                  </div>
                  {loginErrors.password ? (
                    <p className={styles.errorText}>{loginErrors.password}</p>
                  ) : null}
                </div>

                <div className={styles.row}>
                  <label className={styles.checkbox}>
                    <input
                      checked={loginForm.remember}
                      className={styles.checkboxInput}
                      onChange={updateLoginField("remember")}
                      type="checkbox"
                    />
                    记住我
                  </label>

                  <a className={styles.link} href="#">
                    忘记密码？
                  </a>
                </div>

                <button className={styles.submitButton} type="submit">
                  <CheckCircleIcon className={styles.buttonIcon} />
                  登录
                </button>

                <div className={styles.divider}>或使用以下方式登录</div>

                <div className={styles.socialGrid}>
                  {socialItems.map((item) => (
                    <button
                      className={styles.socialButton}
                      key={item.label}
                      type="button"
                    >
                      <span className={cn(styles.socialBadge, item.badgeClass)}>
                        {item.badgeText}
                      </span>
                      {item.label}
                    </button>
                  ))}
                </div>

                <p className={styles.tabFootnote}>
                  还没有账号？
                  <button
                    className={styles.tabSwitchLink}
                    onClick={() => setActiveTab("register")}
                    type="button"
                  >
                    立即注册
                  </button>
                </p>
              </form>
            ) : (
              <form className={styles.form} onSubmit={handleRegisterSubmit}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="register-phone">
                    手机号
                  </label>
                  <div
                    className={cn(
                      styles.fieldWrap,
                      focusedField === "register-phone" &&
                        styles.fieldWrapFocused,
                    )}
                  >
                    <PhoneIcon className={styles.fieldIcon} />
                    <input
                      className={styles.fieldInput}
                      id="register-phone"
                      onBlur={handleBlur}
                      onChange={updateRegisterField("phone")}
                      onFocus={handleFocus("register-phone")}
                      placeholder="请输入手机号"
                      type="tel"
                      value={registerForm.phone}
                    />
                  </div>
                  {registerErrors.phone ? (
                    <p className={styles.errorText}>{registerErrors.phone}</p>
                  ) : null}
                </div>

                <div className={styles.fieldGroup}>
                  <label
                    className={styles.fieldLabel}
                    htmlFor="register-password"
                  >
                    设置密码
                  </label>
                  <div
                    className={cn(
                      styles.fieldWrap,
                      focusedField === "register-password" &&
                        styles.fieldWrapFocused,
                    )}
                  >
                    <LockIcon className={styles.fieldIcon} />
                    <input
                      className={styles.fieldInput}
                      id="register-password"
                      onBlur={handleBlur}
                      onChange={updateRegisterField("password")}
                      onFocus={handleFocus("register-password")}
                      placeholder="请设置 8-20 位密码"
                      type="password"
                      value={registerForm.password}
                    />
                  </div>
                  <p className={styles.helperText}>
                    建议使用字母、数字和符号组合。
                  </p>
                  {registerErrors.password ? (
                    <p className={styles.errorText}>
                      {registerErrors.password}
                    </p>
                  ) : null}
                </div>

                <div className={styles.fieldGroup}>
                  <label
                    className={styles.fieldLabel}
                    htmlFor="register-confirm-password"
                  >
                    确认密码
                  </label>
                  <div
                    className={cn(
                      styles.fieldWrap,
                      focusedField === "register-confirm-password" &&
                        styles.fieldWrapFocused,
                    )}
                  >
                    <LockIcon className={styles.fieldIcon} />
                    <input
                      className={styles.fieldInput}
                      id="register-confirm-password"
                      onBlur={handleBlur}
                      onChange={updateRegisterField("confirmPassword")}
                      onFocus={handleFocus("register-confirm-password")}
                      placeholder="请再次输入密码"
                      type="password"
                      value={registerForm.confirmPassword}
                    />
                  </div>
                  {registerErrors.confirmPassword ? (
                    <p className={styles.errorText}>
                      {registerErrors.confirmPassword}
                    </p>
                  ) : null}
                </div>

                <label className={styles.agreement}>
                  <input
                    checked={registerForm.agreement}
                    className={styles.checkboxInput}
                    onChange={updateRegisterField("agreement")}
                    type="checkbox"
                  />
                  <span>
                    我已阅读并同意{" "}
                    <a className={styles.link} href="#">
                      用户协议
                    </a>{" "}
                    与{" "}
                    <a className={styles.link} href="#">
                      隐私政策
                    </a>
                  </span>
                </label>
                {registerErrors.agreement ? (
                  <p className={styles.errorText}>{registerErrors.agreement}</p>
                ) : null}

                <button className={styles.submitButton} type="submit">
                  <CheckCircleIcon className={styles.buttonIcon} />
                  注册
                </button>

                <p className={styles.tabFootnote}>
                  已有账号？
                  <button
                    className={styles.tabSwitchLink}
                    onClick={() => setActiveTab("login")}
                    type="button"
                  >
                    直接登录
                  </button>
                </p>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
