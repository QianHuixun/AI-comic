import { useState, type ChangeEvent, type ReactNode, type SVGProps } from "react";
import { useNavigate } from "react-router-dom";

type AuthTab = "login" | "register";

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

type FeatureItem = {
  description: string;
  icon: "book" | "comment" | "phone" | "user";
};

type IconProps = SVGProps<SVGSVGElement>;

const featureItems: ReadonlyArray<FeatureItem> = [
  { description: "海量漫画资源，每日更新", icon: "book" },
  { description: "多设备同步，随时随地阅读", icon: "phone" },
  { description: "个性化推荐，发现更多精彩", icon: "user" },
  { description: "社区互动，分享阅读感受", icon: "comment" },
] as const;

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

function BookIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" />
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

function UserIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
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

function renderFeatureIcon(icon: FeatureItem["icon"]) {
  const className = "h-3 w-3";
  if (icon === "book") {
    return <BookIcon className={className} />;
  }
  if (icon === "phone") {
    return <PhoneIcon className={className} />;
  }
  if (icon === "user") {
    return <UserIcon className={className} />;
  }
  return <MessageIcon className={className} />;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [loginForm, setLoginForm] = useState<LoginForm>({
    password: "",
    phone: "",
    remember: false,
  });
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    agreement: false,
    confirmPassword: "",
    password: "",
    phone: "",
  });

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
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg-secondary)] px-5 py-10 text-[color:var(--text-primary)]">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mx-auto grid w-full max-w-[500px] overflow-hidden rounded-[20px] bg-white shadow-[0_10px_50px_rgba(0,0,0,0.1)] min-[993px]:max-w-[900px] min-[993px]:grid-cols-2">
          <div className="relative hidden items-center justify-center overflow-hidden bg-[linear-gradient(135deg,var(--primary-700),var(--primary-800))] px-10 py-10 min-[993px]:flex">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{
                backgroundImage:
                  'url("https://picsum.photos/600/800?random=100")',
              }}
            />

            <div className="relative z-[1] text-center text-white">
              <h2 className="mb-5 text-[32px] font-extrabold">
                欢迎来到 AI漫画
              </h2>
              <p className="mb-10 text-[16px] opacity-90">
                探索无限精彩的漫画世界，开启您的阅读之旅
              </p>

              <ul className="list-none text-left">
                {featureItems.map((item) => (
                  <li
                    className="mb-5 flex items-center gap-[15px] text-[14px] opacity-90"
                    key={item.description}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                      {renderFeatureIcon(item.icon)}
                    </span>
                    <span>{item.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="px-5 py-[30px] min-[769px]:px-[30px] min-[769px]:py-10 min-[993px]:px-[50px] min-[993px]:py-[60px]">
            <div className="mb-10 text-center">
              <h2 className="mb-[10px] text-[24px] font-bold text-[color:var(--text-primary)] min-[769px]:text-[28px]">
                账号登录
              </h2>
              <p className="text-[14px] text-[color:var(--text-secondary)]">
                登录后享受更多优质内容
              </p>
            </div>

            <div className="mb-[30px] flex border-b border-b-[color:var(--border)]">
              {(["login", "register"] as const).map((tab) => (
                <button
                  className={cn(
                    "flex-1 border-b-2 border-b-transparent px-0 py-[15px] text-center text-[16px] font-semibold transition-all duration-300",
                    activeTab === tab
                      ? "border-b-[color:var(--primary-600)] text-[color:var(--primary-600)]"
                      : "text-[color:var(--text-secondary)]",
                  )}
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                >
                  {tab === "login" ? "登录" : "注册"}
                </button>
              ))}
            </div>

            {activeTab === "login" ? (
              <div>
                <div className="mb-5">
                  <label className="mb-2 block text-[14px] font-semibold text-[color:var(--text-primary)]">
                    手机号
                  </label>
                  <input
                    className="w-full rounded-[10px] border-2 border-[color:var(--border)] px-4 py-3 text-[15px] transition-all duration-300 outline-none placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--primary-500)] focus:shadow-[0_0_0_3px_rgba(96,96,96,0.1)]"
                    onChange={updateLoginField("phone")}
                    placeholder="请输入手机号"
                    type="text"
                    value={loginForm.phone}
                  />
                </div>

                <div className="mb-5">
                  <label className="mb-2 block text-[14px] font-semibold text-[color:var(--text-primary)]">
                    密码
                  </label>
                  <input
                    className="w-full rounded-[10px] border-2 border-[color:var(--border)] px-4 py-3 text-[15px] transition-all duration-300 outline-none placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--primary-500)] focus:shadow-[0_0_0_3px_rgba(96,96,96,0.1)]"
                    onChange={updateLoginField("password")}
                    placeholder="请输入密码"
                    type="password"
                    value={loginForm.password}
                  />
                </div>

                <div className="mb-[30px] flex items-center justify-between text-[14px]">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      checked={loginForm.remember}
                      className="h-4 w-4 accent-[color:var(--primary-600)]"
                      onChange={updateLoginField("remember")}
                      type="checkbox"
                    />
                    <span>记住我</span>
                  </label>

                  <a
                    className="text-[color:var(--primary-600)] no-underline transition-colors duration-300 hover:text-[color:var(--primary-700)] hover:underline"
                    href="#"
                  >
                    忘记密码？
                  </a>
                </div>

                <button
                  className="mb-5 w-full rounded-[10px] bg-[linear-gradient(135deg,var(--primary-600),var(--primary-700))] px-[14px] py-[14px] text-[16px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
                  onClick={() => navigate("/home")}
                  type="button"
                >
                  登录
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-5">
                  <label className="mb-2 block text-[14px] font-semibold text-[color:var(--text-primary)]">
                    手机号
                  </label>
                  <input
                    className="w-full rounded-[10px] border-2 border-[color:var(--border)] px-4 py-3 text-[15px] transition-all duration-300 outline-none placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--primary-500)] focus:shadow-[0_0_0_3px_rgba(96,96,96,0.1)]"
                    onChange={updateRegisterField("phone")}
                    placeholder="请输入手机号"
                    type="tel"
                    value={registerForm.phone}
                  />
                </div>

                <div className="mb-5">
                  <label className="mb-2 block text-[14px] font-semibold text-[color:var(--text-primary)]">
                    设置密码
                  </label>
                  <input
                    className="w-full rounded-[10px] border-2 border-[color:var(--border)] px-4 py-3 text-[15px] transition-all duration-300 outline-none placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--primary-500)] focus:shadow-[0_0_0_3px_rgba(96,96,96,0.1)]"
                    onChange={updateRegisterField("password")}
                    placeholder="请设置6-20位密码"
                    type="password"
                    value={registerForm.password}
                  />
                </div>

                <div className="mb-5">
                  <label className="mb-2 block text-[14px] font-semibold text-[color:var(--text-primary)]">
                    确认密码
                  </label>
                  <input
                    className="w-full rounded-[10px] border-2 border-[color:var(--border)] px-4 py-3 text-[15px] transition-all duration-300 outline-none placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--primary-500)] focus:shadow-[0_0_0_3px_rgba(96,96,96,0.1)]"
                    onChange={updateRegisterField("confirmPassword")}
                    placeholder="请再次输入密码"
                    type="password"
                    value={registerForm.confirmPassword}
                  />
                </div>

                <label className="mb-5 flex cursor-pointer items-start gap-2 text-[14px] leading-[1.6]">
                  <input
                    checked={registerForm.agreement}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--primary-600)]"
                    onChange={updateRegisterField("agreement")}
                    type="checkbox"
                  />
                  <span>
                    我已阅读并同意{" "}
                    <a
                      className="text-[color:var(--primary-600)] no-underline transition-colors duration-300 hover:text-[color:var(--primary-700)] hover:underline"
                      href="#"
                    >
                      用户协议
                    </a>{" "}
                    和{" "}
                    <a
                      className="text-[color:var(--primary-600)] no-underline transition-colors duration-300 hover:text-[color:var(--primary-700)] hover:underline"
                      href="#"
                    >
                      隐私政策
                    </a>
                  </span>
                </label>

                <button
                  className="mb-5 w-full rounded-[10px] bg-[linear-gradient(135deg,var(--primary-600),var(--primary-700))] px-[14px] py-[14px] text-[16px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
                  onClick={() => navigate("/home")}
                  type="button"
                >
                  注册
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
