import { RobotIcon, SearchIcon } from '../Icon/rankingIcon';
export const Header = () => {
  const navLinks: ReadonlyArray<{
  active?: boolean;
  href: string;
  label: string;
}> = [
  { href: "/", label: "首页" },
  { href: "#", label: "分类" },
  { active: true, href: "/ranking", label: "排行榜" },
  { href: "#", label: "AI创作" },
  { href: "#", label: "论坛" },
] as const;
  return (
   <header className=" z-[10] fixed bg-[linear-gradient(135deg,var(--primary-700),var(--primary-800))] py-5 shadow-[0_4px_20px_rgba(0,0,0,0.1)] w-[100vw]">
        <div className="m-0 px-10">
          <div className="flex flex-col items-center justify-between gap-5 min-[769px]:flex-row">
            <div className="flex items-center gap-[10px] text-[28px] font-extrabold text-white">
              <div className="flex h-[45px] w-[45px] items-center justify-center rounded-xl bg-white text-[color:var(--primary-700)]">
                <RobotIcon className="h-6 w-6" />
              </div>
              <span>AI漫画</span>
            </div>

            <div className="flex w-full items-center rounded-[50px] bg-white px-5 py-[10px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] min-[769px]:w-[300px] min-[993px]:w-[400px]">
              <SearchIcon className="h-4 w-4 shrink-0 text-[color:var(--text-secondary)]" />
              <input
                className="min-w-0 flex-1 border-none bg-transparent px-[10px] py-[5px] text-[15px] outline-none placeholder:text-[color:var(--text-secondary)]"
                placeholder="搜索漫画、作者..."
                type="text"
              />
              <button
                className="rounded-[25px] bg-[color:var(--secondary)] px-5 py-2 text-[14px] text-white transition-all duration-300 hover:scale-105 hover:bg-[color:var(--accent-600)]"
                type="button"
              >
                搜索
              </button>
            </div>

            <nav className="flex flex-wrap justify-center gap-[30px]">
              {navLinks.map((link) => (
                <a
                  className={[
                    "rounded-lg px-4 py-2 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-white/20",
                    link.active ? "bg-white/30" : "",
                  ].join(" ")}
                  href={link.href}
                  key={link.label}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="relative">
              <a
                className="rounded-lg bg-white/10 px-4 py-2 text-[15px] font-semibold text-white no-underline transition-all duration-300"
                href="login.html"
              >
                登录/注册
              </a>
            </div>
          </div>
        </div>
      </header>
  );
};

export default Header;
