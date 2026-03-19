import { useState, type ChangeEvent } from "react";
import type { SettingsTab, AccountForm, AiState} from "../../lib/types/settings";
import { CogIcon, UserIcon, RobotIcon } from "../../components/Icon/settings";
import Header from "../../components/header";
import { Footer } from "../../components/footer";

const defaultAccountForm: AccountForm = {
  confirmPassword: "",
  currentPassword: "",
  newPassword: "",
  phone: "138****8888",
};

const defaultAiState: AiState = {
  autoSave: true,
  enableHistory: true,
  selectedModel: "v2",
  v1Creativity: "平衡",
  v1Quality: "高质量",
  v2Creativity: "平衡",
  v2Quality: "高质量",
  v2Speed: "标准",
};

function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [accountForm, setAccountForm] = useState<AccountForm>(defaultAccountForm);
  const [aiState, setAiState] = useState<AiState>(defaultAiState);

  const updateAccountField =
    (field: keyof AccountForm) => (event: ChangeEvent<HTMLInputElement>) => {
      setAccountForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const updateAiField =
    (field: keyof AiState) =>
    (
      event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
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

  return (
    <div className="min-h-screen bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)]">
      <Header></Header>
      <main className="px-0 py-10">
        <div className="mx-auto max-w-[1400px] px-5">
          <h2 className="mb-[30px] flex items-center gap-[10px] text-[24px] font-bold text-[color:var(--text-primary)] max-[480px]:text-[20px]">
            <CogIcon className="h-6 w-6 text-[color:var(--secondary)]" />
            个人设置
          </h2>

          <div className="flex gap-[30px] max-[992px]:flex-col">
            <aside className="h-fit w-[250px] rounded-[20px] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] max-[992px]:mb-[30px] max-[992px]:w-full">
              <h3 className="mb-5 text-[18px] font-semibold text-[color:var(--text-primary)]">
                设置菜单
              </h3>

              <ul className="list-none max-[992px]:flex max-[992px]:gap-[10px] max-[992px]:overflow-x-auto max-[992px]:pb-[10px]">
                <li className="mb-[10px] max-[992px]:mb-0">
                  <button
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[15px] transition-all duration-300",
                      activeTab === "account"
                        ? "bg-[color:var(--accent-50)] font-semibold text-[color:var(--secondary)]"
                        : "text-[color:var(--text-primary)] hover:bg-[color:var(--bg-secondary)]",
                    )}
                    onClick={() => setActiveTab("account")}
                    type="button"
                  >
                    <UserIcon className="h-5 w-5 shrink-0" />
                    个人账号
                  </button>
                </li>
                <li className="mb-[10px] max-[992px]:mb-0">
                  <button
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[15px] transition-all duration-300",
                      activeTab === "ai"
                        ? "bg-[color:var(--accent-50)] font-semibold text-[color:var(--secondary)]"
                        : "text-[color:var(--text-primary)] hover:bg-[color:var(--bg-secondary)]",
                    )}
                    onClick={() => setActiveTab("ai")}
                    type="button"
                  >
                    <RobotIcon className="h-5 w-5 shrink-0" />
                    AI配置
                  </button>
                </li>
              </ul>
            </aside>

            <div className="flex-1 rounded-[20px] bg-white p-[30px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] max-[768px]:p-5 max-[480px]:p-[15px]">
              {activeTab === "account" ? (
                <section>
                  <h3 className="text-[24px] font-bold text-[color:var(--text-primary)]">
                    个人账号设置
                  </h3>
                  <p className="mb-[30px] mt-2 text-[16px] text-[color:var(--text-secondary)]">
                    管理您的个人信息和账号安全
                  </p>

                  <div className="mb-6">
                    <label className="mb-2 block text-[14px] font-semibold text-[color:var(--text-primary)]">
                      手机号码
                    </label>
                    <input
                      className="w-full rounded-xl border-2 border-[color:var(--border)] px-4 py-3 text-[15px] transition-all duration-300 outline-none focus:border-[color:var(--secondary)] focus:shadow-[0_0_0_3px_rgba(255,153,51,0.1)]"
                      onChange={updateAccountField("phone")}
                      type="tel"
                      value={accountForm.phone}
                    />
                  </div>

                  <h4 className="my-[30px] mb-5 text-[18px] font-semibold">
                    密码设置
                  </h4>

                  <div className="mb-6">
                    <label className="mb-2 block text-[14px] font-semibold text-[color:var(--text-primary)]">
                      当前密码
                    </label>
                    <input
                      className="w-full rounded-xl border-2 border-[color:var(--border)] px-4 py-3 text-[15px] transition-all duration-300 outline-none placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--secondary)] focus:shadow-[0_0_0_3px_rgba(255,153,51,0.1)]"
                      onChange={updateAccountField("currentPassword")}
                      placeholder="请输入当前密码"
                      type="password"
                      value={accountForm.currentPassword}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="mb-2 block text-[14px] font-semibold text-[color:var(--text-primary)]">
                      新密码
                    </label>
                    <input
                      className="w-full rounded-xl border-2 border-[color:var(--border)] px-4 py-3 text-[15px] transition-all duration-300 outline-none placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--secondary)] focus:shadow-[0_0_0_3px_rgba(255,153,51,0.1)]"
                      onChange={updateAccountField("newPassword")}
                      placeholder="请输入新密码"
                      type="password"
                      value={accountForm.newPassword}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="mb-2 block text-[14px] font-semibold text-[color:var(--text-primary)]">
                      确认新密码
                    </label>
                    <input
                      className="w-full rounded-xl border-2 border-[color:var(--border)] px-4 py-3 text-[15px] transition-all duration-300 outline-none placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--secondary)] focus:shadow-[0_0_0_3px_rgba(255,153,51,0.1)]"
                      onChange={updateAccountField("confirmPassword")}
                      placeholder="请再次输入新密码"
                      type="password"
                      value={accountForm.confirmPassword}
                    />
                  </div>

                  <div className="mt-[30px] flex gap-[15px] max-[768px]:flex-col">
                    <button
                      className="rounded-xl bg-[color:var(--secondary)] px-6 py-3 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[color:var(--accent-600)]"
                      onClick={() => window.alert("保存成功！")}
                      type="button"
                    >
                      保存更改
                    </button>
                    <button
                      className="rounded-xl border-2 border-[color:var(--border)] bg-[color:var(--bg-secondary)] px-6 py-3 text-[15px] font-semibold text-[color:var(--text-primary)] transition-all duration-300 hover:border-[color:var(--secondary)] hover:text-[color:var(--secondary)]"
                      onClick={() => setAccountForm(defaultAccountForm)}
                      type="button"
                    >
                      取消
                    </button>
                  </div>
                </section>
              ) : (
                <section>
                  <h3 className="text-[24px] font-bold text-[color:var(--text-primary)]">
                    AI配置设置
                  </h3>
                  <p className="mb-[30px] mt-2 text-[16px] text-[color:var(--text-secondary)]">
                    配置AI模型和生成参数
                  </p>

                  <h4 className="mb-5 text-[16px] font-semibold">选择AI模型</h4>

                  <article
                    className={cn(
                      "mb-5 rounded-2xl border-2 p-5 transition-all duration-300 hover:border-[color:var(--secondary)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)]",
                      aiState.selectedModel === "v2"
                        ? "border-[color:var(--secondary)] bg-[color:var(--accent-50)]"
                        : "border-[color:var(--border)] bg-[color:var(--bg-secondary)]",
                    )}
                  >
                    <div className="mb-[15px] flex items-center justify-between gap-3">
                      <div className="text-[16px] font-semibold text-[color:var(--text-primary)]">
                        AI漫画生成模型 v2.0
                      </div>
                      <input
                        checked={aiState.selectedModel === "v2"}
                        className="h-[18px] w-[18px] accent-[color:var(--secondary)]"
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
                    <div className="mb-[15px] text-[14px] text-[color:var(--text-secondary)]">
                      最新版本的AI漫画生成模型，支持多种风格和场景
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[15px] max-[768px]:grid-cols-1">
                      <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-[color:var(--text-primary)]">
                          生成质量
                        </label>
                        <select
                          className="w-full rounded-lg border-2 border-[color:var(--border)] px-3 py-2 text-[14px] transition-all duration-300 outline-none focus:border-[color:var(--secondary)] focus:shadow-[0_0_0_3px_rgba(255,153,51,0.1)]"
                          onChange={updateAiField("v2Quality")}
                          value={aiState.v2Quality}
                        >
                          <option>标准</option>
                          <option>高质量</option>
                          <option>超高质量</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-[color:var(--text-primary)]">
                          创意程度
                        </label>
                        <select
                          className="w-full rounded-lg border-2 border-[color:var(--border)] px-3 py-2 text-[14px] transition-all duration-300 outline-none focus:border-[color:var(--secondary)] focus:shadow-[0_0_0_3px_rgba(255,153,51,0.1)]"
                          onChange={updateAiField("v2Creativity")}
                          value={aiState.v2Creativity}
                        >
                          <option>保守</option>
                          <option>平衡</option>
                          <option>激进</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-[color:var(--text-primary)]">
                          生成速度
                        </label>
                        <select
                          className="w-full rounded-lg border-2 border-[color:var(--border)] px-3 py-2 text-[14px] transition-all duration-300 outline-none focus:border-[color:var(--secondary)] focus:shadow-[0_0_0_3px_rgba(255,153,51,0.1)]"
                          onChange={updateAiField("v2Speed")}
                          value={aiState.v2Speed}
                        >
                          <option>快速</option>
                          <option>标准</option>
                          <option>慢速</option>
                        </select>
                      </div>
                    </div>
                  </article>

                  <article
                    className={cn(
                      "mb-5 rounded-2xl border-2 p-5 transition-all duration-300 hover:border-[color:var(--secondary)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)]",
                      aiState.selectedModel === "v1"
                        ? "border-[color:var(--secondary)] bg-[color:var(--accent-50)]"
                        : "border-[color:var(--border)] bg-[color:var(--bg-secondary)]",
                    )}
                  >
                    <div className="mb-[15px] flex items-center justify-between gap-3">
                      <div className="text-[16px] font-semibold text-[color:var(--text-primary)]">
                        AI漫画生成模型 v1.5
                      </div>
                      <input
                        checked={aiState.selectedModel === "v1"}
                        className="h-[18px] w-[18px] accent-[color:var(--secondary)]"
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
                    <div className="mb-[15px] text-[14px] text-[color:var(--text-secondary)]">
                      稳定版本的AI漫画生成模型，适合大多数场景
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[15px] max-[768px]:grid-cols-1">
                      <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-[color:var(--text-primary)]">
                          生成质量
                        </label>
                        <select
                          className="w-full rounded-lg border-2 border-[color:var(--border)] px-3 py-2 text-[14px] transition-all duration-300 outline-none focus:border-[color:var(--secondary)] focus:shadow-[0_0_0_3px_rgba(255,153,51,0.1)]"
                          onChange={updateAiField("v1Quality")}
                          value={aiState.v1Quality}
                        >
                          <option>标准</option>
                          <option>高质量</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-[color:var(--text-primary)]">
                          创意程度
                        </label>
                        <select
                          className="w-full rounded-lg border-2 border-[color:var(--border)] px-3 py-2 text-[14px] transition-all duration-300 outline-none focus:border-[color:var(--secondary)] focus:shadow-[0_0_0_3px_rgba(255,153,51,0.1)]"
                          onChange={updateAiField("v1Creativity")}
                          value={aiState.v1Creativity}
                        >
                          <option>保守</option>
                          <option>平衡</option>
                        </select>
                      </div>
                    </div>
                  </article>

                  <label className="mb-3 flex items-center gap-[10px] text-[14px] text-[color:var(--text-primary)]">
                    <input
                      checked={aiState.autoSave}
                      className="h-[18px] w-[18px] accent-[color:var(--secondary)]"
                      onChange={updateAiField("autoSave")}
                      type="checkbox"
                    />
                    自动保存生成的漫画
                  </label>

                  <label className="mb-3 flex items-center gap-[10px] text-[14px] text-[color:var(--text-primary)]">
                    <input
                      checked={aiState.enableHistory}
                      className="h-[18px] w-[18px] accent-[color:var(--secondary)]"
                      onChange={updateAiField("enableHistory")}
                      type="checkbox"
                    />
                    启用生成历史记录
                  </label>

                  <div className="mt-[30px] flex gap-[15px] max-[768px]:flex-col">
                    <button
                      className="rounded-xl bg-[color:var(--secondary)] px-6 py-3 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[color:var(--accent-600)]"
                      onClick={() => window.alert("保存成功！")}
                      type="button"
                    >
                      保存配置
                    </button>
                    <button
                      className="rounded-xl border-2 border-[color:var(--border)] bg-[color:var(--bg-secondary)] px-6 py-3 text-[15px] font-semibold text-[color:var(--text-primary)] transition-all duration-300 hover:border-[color:var(--secondary)] hover:text-[color:var(--secondary)]"
                      onClick={() => setAiState(defaultAiState)}
                      type="button"
                    >
                      恢复默认
                    </button>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
}
