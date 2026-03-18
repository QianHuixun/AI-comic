import { RobotIcon } from "../Icon";

export function Footer(){
    const footerColumns = [
  {
    links: [
      { href: "/", label: "首页" },
      { href: "#", label: "分类" },
      { href: "/ranking", label: "排行榜" },
      { href: "#", label: "AI创作" },
      { href: "#", label: "论坛" },
    ],
    title: "快速链接",
  },
  {
    links: [
      { href: "#", label: "平台介绍" },
      { href: "#", label: "团队成员" },
      { href: "#", label: "联系方式" },
      { href: "#", label: "加入我们" },
      { href: "#", label: "隐私政策" },
    ],
    title: "关于我们",
  },
  {
    links: [
      { href: "#", label: "常见问题" },
      { href: "#", label: "使用指南" },
      { href: "#", label: "反馈建议" },
      { href: "#", label: "版权声明" },
      { href: "#", label: "用户协议" },
    ],
    title: "帮助中心",
  },
] as const;
return (<>
 <footer className="mt-10 bg-[color:var(--primary-900)] px-0 py-10 pb-5 text-white">
        <div className="mx-auto max-w-[1400px] px-5">
          <div className="mb-[30px] grid grid-cols-1 gap-10 min-[481px]:grid-cols-2 min-[769px]:grid-cols-[2fr_1fr_1fr_1fr]">
            <div>
              <div className="mb-[15px] flex items-center gap-[10px] text-[28px] font-extrabold text-white">
                <div className="flex h-[45px] w-[45px] items-center justify-center rounded-xl bg-white text-[color:var(--primary-700)]">
                  <RobotIcon className="h-6 w-6" />
                </div>
                <span>AI漫画</span>
              </div>
              <p className="text-[14px] leading-[1.8] text-[color:var(--text-secondary)]">
                AI漫画是一个专注于AI生成漫画的平台，为用户提供高质量的漫画内容和创作工具。
              </p>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title}>
                <h4 className="mb-5 text-[16px] text-white">{column.title}</h4>
                <ul className="list-none">
                  {column.links.map((link) => (
                    <li className="mb-3" key={link.label}>
                      <a
                        className="text-[14px] text-[color:var(--text-secondary)] no-underline transition-colors duration-300 hover:text-[color:var(--accent-500)]"
                        href={link.href}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-t-white/10 pt-5 text-center text-[14px] text-[color:var(--text-secondary)]">
            <p>&copy; 2024 AI漫画. 保留所有权利.</p>
          </div>
        </div>
      </footer>
</>)
}