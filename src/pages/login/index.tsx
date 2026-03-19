import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthTab, LoginForm, RegisterForm, FeatureItem } from "../../lib/types/login";
import { BookIcon, PhoneIcon, UserIcon, MessageIcon } from "../../components/Icon/login";
import { Form, Input, Checkbox, Button, message } from "antd";
const featureItems: ReadonlyArray<FeatureItem> = [
  { description: "海量漫画资源，每日更新", icon: "book" },
  { description: "多设备同步，随时随地阅读", icon: "phone" },
  { description: "个性化推荐，发现更多精彩", icon: "user" },
  { description: "社区互动，分享阅读感受", icon: "comment" },
] as const;

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

export default function LoginPage() {
  const navigate = useNavigate();
  // 添加 activeTab 的 state 定义
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loginForm, setLoginForm] = useState({
    phone: "",
    password: "",
    remember: false
  });

  // 添加注册表单的 state（因为下面用了 registerForm）
  const [registerForm, setRegisterForm] = useState({
    phone: "",
    password: "",
    confirmPassword: "",
    agreement: false
  });

  // 更新登录表单字段的函数
  const updateLoginField = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setLoginForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 添加更新注册表单字段的函数
  const updateRegisterField = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setRegisterForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理登录
  const handleLogin = (values) => {
    console.log("登录信息：", values);
    if (!values.phone) {
      message.error("请输入手机号");
      return;
    }
    if (!values.password) {
      message.error("请输入密码");
      return;
    }
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(values.phone)) {
      message.error("请输入正确的手机号");
      return;
    }
    message.success("登录成功");
    navigate("/");
  };

  // 处理注册
  const handleRegister = () => {
    // 注册逻辑
    if (!registerForm.phone) {
      message.error("请输入手机号");
      return;
    }
    if (!registerForm.password) {
      message.error("请设置密码");
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      message.error("两次输入的密码不一致");
      return;
    }
    if (registerForm.agreement) {
      message.error("请阅读并同意用户协议和隐私政策");
      return;
    }
    message.success("注册成功");
    navigate("/");
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
                <Form
                  layout="vertical"
                  initialValues={{ remember: loginForm.remember }}
                  onFinish={handleLogin}  // 表单提交时触发
                  onValuesChange={(changedValues) => {
                    // 同步到 state
                    if (changedValues.phone !== undefined) {
                      updateLoginField("phone")({
                        target: { value: changedValues.phone }
                      });
                    }
                    if (changedValues.password !== undefined) {
                      updateLoginField("password")({
                        target: { value: changedValues.password }
                      });
                    }
                    if (changedValues.remember !== undefined) {
                      updateLoginField("remember")({
                        target: { checked: changedValues.remember }
                      });
                    }
                  }}
                >
                  <Form.Item
                    name="phone"
                    className="mb-5"
                    label={
                      <label className="mb-2 block text-[14px] font-semibold text-[color:var(--text-primary)]">
                        手机号
                      </label>
                    }
                    rules={[
                      { required: true, message: "请输入手机号" },
                      { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号 11位" }
                    ]}
                  >
                    <Input
                      className="w-full rounded-[10px] border-2 border-[color:var(--border)] px-4 py-3 text-[15px] transition-all duration-300 outline-none placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--primary-500)] focus:shadow-[0_0_0_3px_rgba(96,96,96,0.1)]"
                      placeholder="请输入手机号"
                      maxLength={11}
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    className="mb-5"
                    label={
                      <label className="mb-2 block text-[14px] font-semibold text-[color:var(--text-primary)]">
                        密码
                      </label>
                    }
                    rules={[
                      { required: true, message: "请输入密码" },
                      { min: 6, message: "密码至少6位" }
                    ]}
                  >
                    <Input.Password
                      className="w-full rounded-[10px] border-2 border-[color:var(--border)] px-4 py-3 text-[15px] transition-all duration-300 outline-none placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--primary-500)] focus:shadow-[0_0_0_3px_rgba(96,96,96,0.1)]"
                      placeholder="请输入密码"
                    />
                  </Form.Item>

                  <div className="mb-[30px] flex items-center justify-between text-[14px]">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox className="flex cursor-pointer items-center gap-2">
                        <span>记住我</span>
                      </Checkbox>
                    </Form.Item>

                    <a
                      className="text-[color:var(--primary-600)] no-underline transition-colors duration-300 hover:text-[color:var(--primary-700)] hover:underline"
                      href="#"
                    >
                      忘记密码？
                    </a>
                  </div>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"  // 改为 submit 类型
                      block
                      className="mb-5 w-full rounded-[10px] bg-[linear-gradient(135deg,var(--primary-600),var(--primary-700))] px-[14px] py-[14px] text-[16px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
                    >
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            ) : (
              <div>
                <Form
                  layout="vertical"
                  onFinish={handleRegister}
                  initialValues={{
                    phone: registerForm.phone,
                    password: registerForm.password,
                    confirmPassword: registerForm.confirmPassword,
                    agreement: registerForm.agreement
                  }}
                  onValuesChange={(changedValues) => {
                    if (changedValues.phone !== undefined) {
                      updateRegisterField("phone")({
                        target: { value: changedValues.phone }
                      });
                    }
                    if (changedValues.password !== undefined) {
                      updateRegisterField("password")({
                        target: { value: changedValues.password }
                      });
                    }
                    if (changedValues.confirmPassword !== undefined) {
                      updateRegisterField("confirmPassword")({
                        target: { value: changedValues.confirmPassword }
                      });
                    }
                    if (changedValues.agreement !== undefined) {
                      updateRegisterField("agreement")({
                        target: { checked: changedValues.agreement }
                      });
                    }
                  }}
                >
                  <Form.Item
                    name="phone"
                    className="mb-5"
                    label={
                      <label className="mb-2 block text-[14px] font-semibold text-[color:var(--text-primary)]">
                        手机号
                      </label>
                    }
                    rules={[
                      { required: true, message: "请输入手机号" },
                      { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号" }
                    ]}
                  >
                    <Input
                      className="w-full rounded-[10px] border-2 border-[color:var(--border)] px-4 py-3 text-[15px] transition-all duration-300 outline-none placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--primary-500)] focus:shadow-[0_0_0_3px_rgba(96,96,96,0.1)]"
                      placeholder="请输入手机号"
                      maxLength={11}
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    className="mb-5"
                    label={
                      <label className="mb-2 block text-[14px] font-semibold text-[color:var(--text-primary)]">
                        设置密码
                      </label>
                    }
                    rules={[
                      { required: true, message: "请输入密码" },
                      { min: 6, message: "密码至少6位" },
                      { max: 20, message: "密码最多20位" }
                    ]}
                  >
                    <Input.Password
                      className="w-full rounded-[10px] border-2 border-[color:var(--border)] px-4 py-3 text-[15px] transition-all duration-300 outline-none placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--primary-500)] focus:shadow-[0_0_0_3px_rgba(96,96,96,0.1)]"
                      placeholder="请设置6-20位密码"
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    className="mb-5"
                    label={
                      <label className="mb-2 block text-[14px] font-semibold text-[color:var(--text-primary)]">
                        确认密码
                      </label>
                    }
                    dependencies={['password']}
                    rules={[
                      { required: true, message: "请确认密码" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('两次输入的密码不一致'));
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
                    name="agreement"
                    className="mb-5"
                    valuePropName="checked"
                    getValueFromEvent={(e) => {
                      // 确保返回正确的布尔值
                      return e.target.checked;
                    }}
                    rules={[
                      {
                        validator: (_, value) => {
                          console.log("验证时的值:", value, "类型:", typeof value);
                          // 严格检查是否为 true
                          if (value === true) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('请阅读并同意用户协议和隐私政策'));
                        }
                      }
                    ]}
                  >
                    <Checkbox>
                      <span className="text-[14px] leading-[1.6]">
                        我已阅读并同意{" "}
                        <a
                          className="text-[color:var(--primary-600)] no-underline transition-colors duration-300 hover:text-[color:var(--primary-700)] hover:underline"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          用户协议
                        </a>{" "}
                        和{" "}
                        <a
                          className="text-[color:var(--primary-600)] no-underline transition-colors duration-300 hover:text-[color:var(--primary-700)] hover:underline"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          隐私政策
                        </a>
                      </span>
                    </Checkbox>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      className="mb-5 w-full rounded-[10px] bg-[linear-gradient(135deg,var(--primary-600),var(--primary-700))] px-[14px] py-[14px] text-[16px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
                    >
                      注册
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
