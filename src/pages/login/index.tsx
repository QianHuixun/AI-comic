import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Checkbox, Button, message } from "antd";
import type { AuthTab, FeatureItem, LoginForm, RegisterForm } from "../../lib/types/login";
import { BookIcon, MessageIcon, PhoneIcon, UserIcon } from "../../components/Icon/login";
import request from "../../api";

type AuthApiResponse = {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    [key: string]: unknown;
  };
};

const featureItems: ReadonlyArray<FeatureItem> = [
  { description: "海量漫画资源，每日持续更新", icon: "book" },
  { description: "多设备同步，随时随地继续阅读", icon: "phone" },
  { description: "个性化推荐，发现更多优质内容", icon: "user" },
  { description: "社区互动交流，分享你的阅读感受", icon: "comment" },
] as const;

const phoneRules = [
  { required: true, message: "请输入手机号" },
  { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的 11 位手机号" },
];

function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
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

function getAuthErrorMessage(error: unknown) {
  if (axios.isAxiosError<AuthApiResponse>(error)) {
    return error.response?.data?.message ?? error.message ?? "请求失败，请稍后重试";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "请求失败，请稍后重试";
}

function storeSession(token: string, remember: boolean, phone: string) {
  localStorage.setItem("token", token);

  if (remember) {
    localStorage.setItem("rememberedPhone", phone);
    return;
  }

  localStorage.removeItem("rememberedPhone");
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [loginForm] = Form.useForm<LoginForm>();
  const [registerForm] = Form.useForm<RegisterForm>();

  useEffect(() => {
    const rememberedPhone = localStorage.getItem("rememberedPhone");

    if (!rememberedPhone) {
      return;
    }

    loginForm.setFieldsValue({
      phone: rememberedPhone,
      remember: true,
    });
  }, [loginForm]);

  const handleLogin = async (values: LoginForm) => {
    setIsSigningIn(true);

    try {
      const response = await request.post<AuthApiResponse>("/auth/sign-in", {
        phoneNumber: values.phone,
        passWord: values.password,
      });

      if (!response.data.success || !response.data.data?.token) {
        throw new Error(response.data.message || "登录失败");
      }

      storeSession(response.data.data.token, values.remember, values.phone);
      message.success(response.data.message || "登录成功");
      navigate("/");
    } catch (error) {
      message.error(getAuthErrorMessage(error));
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleRegister = async (values: RegisterForm) => {
    setIsSigningUp(true);

    try {
      const response = await request.post<AuthApiResponse>("/auth/sign-up", {
        phoneNumber: values.phone,
        passWord: values.password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "注册失败");
      }

      message.success(response.data.message || "注册成功，请登录");
      registerForm.resetFields();
      loginForm.setFieldsValue({
        phone: values.phone,
        password: "",
        remember: true,
      });
      localStorage.setItem("rememberedPhone", values.phone);
      setActiveTab("login");
    } catch (error) {
      message.error(getAuthErrorMessage(error));
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg-secondary)] px-5 py-10 text-[color:var(--text-primary)]">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mx-auto grid w-full max-w-[500px] overflow-hidden rounded-[20px] bg-white shadow-[0_10px_50px_rgba(0,0,0,0.1)] min-[993px]:max-w-[900px] min-[993px]:grid-cols-2">
          <div className="relative hidden items-center justify-center overflow-hidden bg-[linear-gradient(135deg,var(--primary-700),var(--primary-800))] px-10 py-10 min-[993px]:flex">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{
                backgroundImage: 'url("https://picsum.photos/600/800?random=100")',
              }}
            />

            <div className="relative z-[1] text-center text-white">
              <h2 className="mb-5 text-[32px] font-extrabold">欢迎来到 AI漫画</h2>
              <p className="mb-10 text-[16px] opacity-90">
                探索无限精彩的漫画世界，开启你的沉浸式阅读体验
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
                登录后即可享受更多优质内容
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
              <Form<LoginForm>
                form={loginForm}
                initialValues={{ phone: "", password: "", remember: false }}
                layout="vertical"
                onFinish={handleLogin}
              >
                <Form.Item
                  className="mb-5"
                  label={
                    <label className="mb-2 block text-[14px] font-semibold text-[color:var(--text-primary)]">
                      手机号
                    </label>
                  }
                  name="phone"
                  rules={phoneRules}
                >
                  <Input
                    className="w-full rounded-[10px] border-2 border-[color:var(--border)] px-4 py-3 text-[15px] transition-all duration-300 outline-none placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--primary-500)] focus:shadow-[0_0_0_3px_rgba(96,96,96,0.1)]"
                    maxLength={11}
                    placeholder="请输入手机号"
                  />
                </Form.Item>

                <Form.Item
                  className="mb-5"
                  label={
                    <label className="mb-2 block text-[14px] font-semibold text-[color:var(--text-primary)]">
                      密码
                    </label>
                  }
                  name="password"
                  rules={[
                    { required: true, message: "请输入密码" },
                    { min: 6, message: "密码至少 6 位" },
                  ]}
                >
                  <Input.Password
                    className="w-full rounded-[10px] border-2 border-[color:var(--border)] px-4 py-3 text-[15px] transition-all duration-300 outline-none placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--primary-500)] focus:shadow-[0_0_0_3px_rgba(96,96,96,0.1)]"
                    placeholder="请输入密码"
                  />
                </Form.Item>

                <div className="mb-[30px] flex items-center justify-between text-[14px]">
                  <Form.Item name="remember" noStyle valuePropName="checked">
                    <Checkbox className="flex cursor-pointer items-center gap-2">
                      <span>记住手机号</span>
                    </Checkbox>
                  </Form.Item>

                  <a
                    className="text-[color:var(--primary-600)] no-underline transition-colors duration-300 hover:text-[color:var(--primary-700)] hover:underline"
                    href="#"
                    onClick={(event) => event.preventDefault()}
                  >
                    忘记密码？
                  </a>
                </div>

                <Form.Item>
                  <Button
                    block
                    className="mb-5 w-full rounded-[10px] bg-[linear-gradient(135deg,var(--primary-600),var(--primary-700))] px-[14px] py-[14px] text-[16px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
                    htmlType="submit"
                    loading={isSigningIn}
                    type="primary"
                  >
                    登录
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <Form<RegisterForm>
                form={registerForm}
                initialValues={{
                  phone: "",
                  password: "",
                  confirmPassword: "",
                  agreement: false,
                }}
                layout="vertical"
                onFinish={handleRegister}
              >
                <Form.Item
                  className="mb-5"
                  label={
                    <label className="mb-2 block text-[14px] font-semibold text-[color:var(--text-primary)]">
                      手机号
                    </label>
                  }
                  name="phone"
                  rules={phoneRules}
                >
                  <Input
                    className="w-full rounded-[10px] border-2 border-[color:var(--border)] px-4 py-3 text-[15px] transition-all duration-300 outline-none placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--primary-500)] focus:shadow-[0_0_0_3px_rgba(96,96,96,0.1)]"
                    maxLength={11}
                    placeholder="请输入手机号"
                  />
                </Form.Item>

                <Form.Item
                  className="mb-5"
                  label={
                    <label className="mb-2 block text-[14px] font-semibold text-[color:var(--text-primary)]">
                      设置密码
                    </label>
                  }
                  name="password"
                  rules={[
                    { required: true, message: "请设置密码" },
                    { min: 6, message: "密码至少 6 位" },
                    { max: 20, message: "密码最多 20 位" },
                  ]}
                >
                  <Input.Password
                    className="w-full rounded-[10px] border-2 border-[color:var(--border)] px-4 py-3 text-[15px] transition-all duration-300 outline-none placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--primary-500)] focus:shadow-[0_0_0_3px_rgba(96,96,96,0.1)]"
                    placeholder="请设置 6-20 位密码"
                  />
                </Form.Item>

                <Form.Item
                  className="mb-5"
                  dependencies={["password"]}
                  label={
                    <label className="mb-2 block text-[14px] font-semibold text-[color:var(--text-primary)]">
                      确认密码
                    </label>
                  }
                  name="confirmPassword"
                  rules={[
                    { required: true, message: "请再次输入密码" },
                    ({ getFieldValue }) => ({
                      validator(_, value: string) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }

                        return Promise.reject(new Error("两次输入的密码不一致"));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    className="w-full rounded-[10px] border-2 border-[color:var(--border)] px-4 py-3 text-[15px] transition-all duration-300 outline-none placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--primary-500)] focus:shadow-[0_0_0_3px_rgba(96,96,96,0.1)]"
                    placeholder="请再次输入密码"
                  />
                </Form.Item>

                <Form.Item
                  className="mb-5"
                  name="agreement"
                  rules={[
                    {
                      validator: (_, value: boolean) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(new Error("请阅读并同意用户协议和隐私政策")),
                    },
                  ]}
                  valuePropName="checked"
                >
                  <Checkbox>
                    <span className="text-[14px] leading-[1.6]">
                      我已阅读并同意{" "}
                      <a
                        className="text-[color:var(--primary-600)] no-underline transition-colors duration-300 hover:text-[color:var(--primary-700)] hover:underline"
                        href="#"
                        onClick={(event) => event.preventDefault()}
                      >
                        用户协议
                      </a>{" "}
                      和{" "}
                      <a
                        className="text-[color:var(--primary-600)] no-underline transition-colors duration-300 hover:text-[color:var(--primary-700)] hover:underline"
                        href="#"
                        onClick={(event) => event.preventDefault()}
                      >
                        隐私政策
                      </a>
                    </span>
                  </Checkbox>
                </Form.Item>

                <Form.Item>
                  <Button
                    block
                    className="mb-5 w-full rounded-[10px] bg-[linear-gradient(135deg,var(--primary-600),var(--primary-700))] px-[14px] py-[14px] text-[16px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
                    htmlType="submit"
                    loading={isSigningUp}
                    type="primary"
                  >
                    注册
                  </Button>
                </Form.Item>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
