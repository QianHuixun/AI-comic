import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import type { FormValues, FormErrors } from "../../lib/types/edit-profile";
import { EditIcon, ArrowLeftIcon, UserIcon, CameraIcon, MailIcon, PhoneIcon, InfoIcon, SaveIcon, CloseIcon, CheckCircleIcon } from "../../components/Icon/edit-profile";
import { Footer } from "../../components/footer";
import Header from "../../components/header";

const defaultValues: FormValues = {
  bio: "热爱漫画创作，喜欢AI技术",
  email: "user@example.com",
  phone: "138****8888",
  username: "用户名称",
};

function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function validateForm(values: FormValues) {
  const nextErrors: FormErrors = {};
  const username = values.username.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const bio = values.bio.trim();

  if (!username) {
    nextErrors.username = "请输入用户名";
  } else if (username.length < 4 || username.length > 20) {
    nextErrors.username = "用户名长度应为4-20个字符";
  }

  if (!email) {
    nextErrors.email = "请输入邮箱";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    nextErrors.email = "请输入有效的邮箱地址";
  }

  if (phone && !/^[0-9*+\-\s()]{7,20}$/.test(phone)) {
    nextErrors.phone = "请输入有效的手机号或联系电话";
  }

  if (bio.length > 200) {
    nextErrors.bio = "个人简介长度不能超过200个字符";
  }

  return nextErrors;
}

export default function EditProfilePage() {
  const navigate = useNavigate();
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

  const handleChange =
    (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      setFormValues((current) => ({
        ...current,
        [field]: value,
      }));

      setFormErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFormErrors((current) => ({
        ...current,
        avatar: "文件大小不能超过2MB",
      }));
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(typeof reader.result === "string" ? reader.result : null);
      setFormErrors((current) => ({
        ...current,
        avatar: undefined,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm(formValues);
    if (Object.keys(nextErrors).length > 0) {
      setFormErrors((current) => ({
        ...current,
        ...nextErrors,
      }));
      setIsSuccessVisible(false);
      return;
    }

    setFormErrors((current) => ({
      ...current,
      avatar: undefined,
    }));
    setIsSuccessVisible(true);
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)]">
      <Header></Header>
      <main className="px-0 py-10">
        <div className="mx-auto max-w-[1400px] px-5">
          <div className="mb-[30px] flex flex-col items-center justify-between gap-5 text-center min-[769px]:flex-row min-[769px]:text-left">
            <h1 className="flex items-center gap-[10px] text-2xl font-bold text-[color:var(--text-primary)]">
              <EditIcon className="h-6 w-6 text-[color:var(--secondary)]" />
              编辑资料
            </h1>

            <Link
              className="flex items-center gap-2 rounded-xl border-2 border-[color:var(--border)] bg-white px-5 py-[10px] text-[14px] font-semibold text-[color:var(--text-primary)] no-underline transition-all duration-300 hover:border-[color:var(--secondary)] hover:text-[color:var(--secondary)]"
              to="/my"
            >
              <ArrowLeftIcon className="h-[16px] w-[16px]" />
              返回我的
            </Link>
          </div>

          <div className="mx-auto max-w-[800px] rounded-[20px] bg-white p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)] max-[768px]:px-5 max-[768px]:py-[30px]">
            {isSuccessVisible ? (
              <div className="mb-6 flex items-center gap-[10px] rounded-xl border-2 border-[color:var(--success)] bg-[color:var(--art-50)] p-4 text-[14px] font-semibold text-[color:var(--success)]">
                <CheckCircleIcon className="h-[18px] w-[18px]" />
                资料更新成功！
              </div>
            ) : null}

            <div className="mb-10 border-b border-b-[color:var(--border)] pb-[30px] text-center">
              <div className="flex flex-col items-center gap-[15px]">
                <label
                  className="group block cursor-pointer"
                  htmlFor="avatar-upload"
                >
                  <div className="flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,var(--secondary),var(--accent-600))] text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(255,153,51,0.3)] max-[480px]:h-[100px] max-[480px]:w-[100px]">
                    {avatarPreview ? (
                      <img
                        alt="头像"
                        className="h-full w-full object-cover"
                        src={avatarPreview}
                      />
                    ) : (
                      <UserIcon className="h-12 w-12 max-[480px]:h-10 max-[480px]:w-10" />
                    )}
                  </div>
                </label>

                <label
                  className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-[color:var(--secondary)] bg-[color:var(--accent-50)] px-5 py-[10px] text-[14px] font-semibold text-[color:var(--secondary)] transition-all duration-300 hover:bg-[color:var(--secondary)] hover:text-white"
                  htmlFor="avatar-upload"
                >
                  <CameraIcon className="h-[16px] w-[16px]" />
                  更换头像
                </label>

                <input
                  accept="image/*"
                  className="hidden"
                  id="avatar-upload"
                  onChange={handleAvatarChange}
                  type="file"
                />

                <span className="text-[13px] text-[color:var(--text-secondary)]">
                  支持 JPG、PNG 格式，大小不超过 2MB
                </span>

                {formErrors.avatar ? (
                  <span className="text-[13px] text-[color:var(--error)]">
                    {formErrors.avatar}
                  </span>
                ) : null}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="mb-2 flex items-center gap-2 text-[14px] font-semibold text-[color:var(--text-primary)]">
                  <UserIcon className="h-[16px] w-[16px] text-[color:var(--secondary)]" />
                  用户名
                </label>
                <input
                  className={cn(
                    "w-full rounded-xl border-2 bg-[color:var(--bg-secondary)] px-[18px] py-[14px] text-[15px] transition-all duration-300 outline-none",
                    formErrors.username
                      ? "border-[color:var(--error)]"
                      : "border-[color:var(--border)] focus:border-[color:var(--secondary)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,153,51,0.1)]",
                  )}
                  onChange={handleChange("username")}
                  placeholder="请输入用户名"
                  type="text"
                  value={formValues.username}
                />
                <div className="mt-2 text-[13px] text-[color:var(--text-secondary)]">
                  4-20个字符，可包含字母、数字、下划线
                </div>
                {formErrors.username ? (
                  <div className="mt-2 text-[13px] text-[color:var(--error)]">
                    {formErrors.username}
                  </div>
                ) : null}
              </div>

              <div className="mb-6">
                <label className="mb-2 flex items-center gap-2 text-[14px] font-semibold text-[color:var(--text-primary)]">
                  <MailIcon className="h-[16px] w-[16px] text-[color:var(--secondary)]" />
                  邮箱
                </label>
                <input
                  className={cn(
                    "w-full rounded-xl border-2 bg-[color:var(--bg-secondary)] px-[18px] py-[14px] text-[15px] transition-all duration-300 outline-none",
                    formErrors.email
                      ? "border-[color:var(--error)]"
                      : "border-[color:var(--border)] focus:border-[color:var(--secondary)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,153,51,0.1)]",
                  )}
                  onChange={handleChange("email")}
                  placeholder="请输入邮箱"
                  type="email"
                  value={formValues.email}
                />
                {formErrors.email ? (
                  <div className="mt-2 text-[13px] text-[color:var(--error)]">
                    {formErrors.email}
                  </div>
                ) : null}
              </div>

              <div className="mb-6">
                <label className="mb-2 flex items-center gap-2 text-[14px] font-semibold text-[color:var(--text-primary)]">
                  <PhoneIcon className="h-[16px] w-[16px] text-[color:var(--secondary)]" />
                  手机号码
                </label>
                <input
                  className={cn(
                    "w-full rounded-xl border-2 bg-[color:var(--bg-secondary)] px-[18px] py-[14px] text-[15px] transition-all duration-300 outline-none",
                    formErrors.phone
                      ? "border-[color:var(--error)]"
                      : "border-[color:var(--border)] focus:border-[color:var(--secondary)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,153,51,0.1)]",
                  )}
                  onChange={handleChange("phone")}
                  placeholder="请输入手机号码"
                  type="tel"
                  value={formValues.phone}
                />
                {formErrors.phone ? (
                  <div className="mt-2 text-[13px] text-[color:var(--error)]">
                    {formErrors.phone}
                  </div>
                ) : null}
              </div>

              <div className="mb-6">
                <label className="mb-2 flex items-center gap-2 text-[14px] font-semibold text-[color:var(--text-primary)]">
                  <InfoIcon className="h-[16px] w-[16px] text-[color:var(--secondary)]" />
                  个人简介
                </label>
                <textarea
                  className={cn(
                    "min-h-[120px] w-full resize-y rounded-xl border-2 bg-[color:var(--bg-secondary)] px-[18px] py-[14px] text-[15px] transition-all duration-300 outline-none max-[480px]:px-[15px] max-[480px]:py-3 max-[480px]:text-[14px]",
                    formErrors.bio
                      ? "border-[color:var(--error)]"
                      : "border-[color:var(--border)] focus:border-[color:var(--secondary)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,153,51,0.1)]",
                  )}
                  onChange={handleChange("bio")}
                  placeholder="介绍一下自己吧..."
                  value={formValues.bio}
                />
                <div className="mt-2 text-[13px] text-[color:var(--text-secondary)]">
                  0-200个字符
                </div>
                {formErrors.bio ? (
                  <div className="mt-2 text-[13px] text-[color:var(--error)]">
                    {formErrors.bio}
                  </div>
                ) : null}
              </div>

              <div className="mt-10 flex gap-[15px] border-t border-t-[color:var(--border)] pt-[30px] max-[768px]:flex-col">
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-none bg-[color:var(--secondary)] px-6 py-[14px] text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[color:var(--accent-600)] hover:shadow-[0_4px_15px_rgba(255,153,51,0.3)]"
                  type="submit"
                >
                  <SaveIcon className="h-[16px] w-[16px]" />
                  保存修改
                </button>
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[color:var(--border)] bg-[color:var(--bg-secondary)] px-6 py-[14px] text-[15px] font-semibold text-[color:var(--text-primary)] transition-all duration-300 hover:border-[color:var(--secondary)] hover:text-[color:var(--secondary)]"
                  onClick={() => navigate("/my")}
                  type="button"
                >
                  <CloseIcon className="h-[16px] w-[16px]" />
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
     <Footer></Footer>
    </div>
  );
}
