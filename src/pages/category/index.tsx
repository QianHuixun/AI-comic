import { FaThLarge, FaGlobe, FaFire, FaEye, FaComment, FaHeart } from "react-icons/fa"

export default function Category(){
    return(<>
     <main className="max-w-[1400px] mx-auto px-5">
        {/* Category Section */}
        <section className="my-7.5">
          <div className="bg-white rounded-[16px] p-[25px_30px] mb-7.5 shadow-[0_2px_15px_rgba(0,0,0,0.05)]">
            <h1 className="text-[24px] font-bold text-text-primary mb-5 flex items-center gap-3">
              <FaThLarge className="text-primary-600" />
              漫画分类
            </h1>
            <p className="text-text-secondary text-[15px] leading-[1.6]">
              探索不同类型的漫画，找到您喜欢的内容。从热血战斗到温馨日常，从科幻冒险到浪漫爱情，这里应有尽有。
            </p>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6.25 mb-10">
            {/* 全部分类 */}
            <div className="bg-white rounded-[16px] p-6.25 shadow-card text-center cursor-pointer transition-all duration-300 hover:-translate-y-1.25 hover:shadow-card-hover">
              <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center text-white text-[32px] transition-all duration-300 hover:scale-110 bg-gradient-to-br from-[#2d3436] to-[#636e72]">
                <FaGlobe />
              </div>
              <h3 className="text-[18px] font-bold text-text-primary mb-2.5">全部</h3>
              <p className="text-[14px] text-text-secondary">10000+ 部漫画</p>
            </div>

            {/* 热血分类 */}
            <div className="bg-white rounded-[16px] p-6.25 shadow-card text-center cursor-pointer transition-all duration-300 hover:-translate-y-1.25 hover:shadow-card-hover">
              <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center text-white text-[32px] transition-all duration-300 hover:scale-110 bg-gradient-to-br from-[#ff6b6b] to-[#ee5a6f]">
                <FaFire />
              </div>
              <h3 className="text-[18px] font-bold text-text-primary mb-2.5">热血</h3>
              <p className="text-[14px] text-text-secondary">2500+ 部漫画</p>
            </div>

            {/* 可继续补充其他分类卡片，与原HTML一致 */}
          </div>

          {/* Subcategory Section */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-[20px] font-bold text-text-primary flex items-center gap-2.5">
                <FaFire className="text-accent-500" />
                热血漫画
              </h2>
              <div className="flex gap-2.5">
                <button className="px-4 py-2 border border-border rounded-full bg-white text-text-secondary text-[13px] cursor-pointer transition-all duration-300 hover:bg-primary-600 hover:text-white hover:border-primary-600 active:bg-primary-600 active:text-white active:border-primary-600">最新</button>
                <button className="px-4 py-2 border border-border rounded-full bg-white text-text-secondary text-[13px] cursor-pointer transition-all duration-300 hover:bg-primary-600 hover:text-white hover:border-primary-600">最热</button>
                <button className="px-4 py-2 border border-border rounded-full bg-white text-text-secondary text-[13px] cursor-pointer transition-all duration-300 hover:bg-primary-600 hover:text-white hover:border-primary-600">评分</button>
              </div>
            </div>

            {/* Comic Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6.25">
              {/* Comic Card 示例 */}
              <div className="bg-white rounded-[16px] overflow-hidden shadow-card cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-comic-hover">
                <div className="relative w-full pt-[130%] overflow-hidden">
                  <img
                    src="https://picsum.photos/300/400?random=1"
                    alt="漫画封面"
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-[6px] text-[11px] font-bold text-white bg-gradient-to-br from-error to-accent-400 z-10">热门</div>
                </div>
                <div className="p-4">
                  <h3 className="text-[15px] font-bold text-text-primary mb-2 whitespace-nowrap overflow-hidden text-ellipsis">热血少年漫：勇者的征途</h3>
                  <p className="text-[13px] text-text-secondary mb-3 flex items-center gap-1.5">
                    <span>作者：</span>
                    <span>漫画大师</span>
                  </p>
                  <div className="flex justify-between pt-3 border-t border-bg-secondary">
                    <div className="flex items-center gap-1.25 text-[12px] text-text-secondary">
                      <FaEye className="text-[13px] text-primary-600" />
                      <span>12.5万</span>
                    </div>
                    <div className="flex items-center gap-1.25 text-[12px] text-text-secondary">
                      <FaComment className="text-[13px] text-accent-500" />
                      <span>328</span>
                    </div>
                    <div className="flex items-center gap-1.25 text-[12px] text-text-secondary">
                      <FaHeart className="text-[13px] text-art-700" />
                      <span>896</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 可继续补充其他漫画卡片，与原HTML一致 */}
            </div>
          </section>

          {/* Stats Footer */}
          <div className="bg-gradient-to-br from-primary-700 to-primary-800 rounded-[20px] p-10 mb-10 text-white">
            <div className="flex flex-wrap justify-between items-center gap-7.5">
              <div>
                <h3 className="text-[24px] font-bold mb-2">平台数据统计</h3>
                <p className="opacity-90 text-[15px]">感谢每一位用户的支持，我们持续更新优质内容</p>
              </div>
              <div className="flex gap-15 sm:gap-7.5">
                <div className="text-center">
                  <div className="text-[36px] font-extrabold flex items-baseline justify-center gap-1.25">
                    10万+ <span className="text-[18px] opacity-0.8">部</span>
                  </div>
                  <p className="text-[14px] opacity-0.9 mt-1.25">总漫画数</p>
                </div>
                <div className="text-center">
                  <div className="text-[36px] font-extrabold flex items-baseline justify-center gap-1.25">
                    500万+ <span className="text-[18px] opacity-0.8">次</span>
                  </div>
                  <p className="text-[14px] opacity-0.9 mt-1.25">总阅读量</p>
                </div>
                <div className="text-center">
                  <div className="text-[36px] font-extrabold flex items-baseline justify-center gap-1.25">
                    10万+ <span className="text-[18px] opacity-0.8">位</span>
                  </div>
                  <p className="text-[14px] opacity-0.9 mt-1.25">注册用户</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

    </>)
}