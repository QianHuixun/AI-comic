export const StatsFooter = () => {
  return (
    <section className="bg-gradient-to-r from-primary-700 to-primary-800 rounded-2xl p-10 mb-10 text-white">
      <div className="flex flex-wrap justify-between items-center gap-7.5">
        <div>
          <h3 className="text-2xl font-bold mb-2">平台数据总览</h3>
          <p className="opacity-90 text-[15px]">AI漫画平台运营数据实时更新</p>
        </div>
        <div className="flex gap-15">
          <div className="text-center">
            <div className="text-4xl font-extrabold flex items-baseline justify-center gap-1.25">
              2580<span className="text-xl opacity-80">万+</span>
            </div>
            <div className="text-[14px] opacity-90 mt-1.25">总阅读量</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold flex items-baseline justify-center gap-1.25">
              126<span className="text-xl opacity-80">万+</span>
            </div>
            <div className="text-[14px] opacity-90 mt-1.25">总评论数</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold flex items-baseline justify-center gap-1.25">
              89<span className="text-xl opacity-80">万+</span>
            </div>
            <div className="text-[14px] opacity-90 mt-1.25">总点赞数</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsFooter;