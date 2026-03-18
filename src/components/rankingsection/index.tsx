export  const RankingSection = () => {
  // 阅读量排行数据
  const readingRank = [
    { rank: 1, img: "https://picsum.photos/45/60?random=10", name: "星际穿越者", read: "125.6万", comment: "3.2万" },
    { rank: 2, img: "https://picsum.photos/45/60?random=11", name: "魔法少女的日常", read: "98.3万", comment: "2.8万" },
    { rank: 3, img: "https://picsum.photos/45/60?random=12", name: "王者之战", read: "86.5万", comment: "1.9万" },
    { rank: 4, img: "https://picsum.photos/45/60?random=13", name: "樱花下的约定", read: "72.1万", comment: "1.5万" },
    { rank: 5, img: "https://picsum.photos/45/60?random=14", name: "都市猎手", read: "65.8万", comment: "1.2万" },
  ];

  // 评论排行数据
  const commentRank = [
    { rank: 1, img: "https://picsum.photos/45/60?random=15", name: "斗破苍穹", comment: "5.6万", like: "2.3万" },
    { rank: 2, img: "https://picsum.photos/45/60?random=16", name: "全职高手", comment: "4.8万", like: "1.9万" },
    { rank: 3, img: "https://picsum.photos/45/60?random=17", name: "一人之下", comment: "4.2万", like: "1.7万" },
    { rank: 4, img: "https://picsum.photos/45/60?random=18", name: "灵笼", comment: "3.6万", like: "1.4万" },
    { rank: 5, img: "https://picsum.photos/45/60?random=19", name: "秦时明月", comment: "3.1万", like: "1.2万" },
  ];


  // 渲染排行项
  const renderRankItem = (item:any, type:any) => {
    const rankClass = item.rank === 1 
      ? 'bg-gradient-to-r from-rank-gold to-accent-300 text-white' 
      : item.rank === 2 
        ? 'bg-gradient-to-r from-rank-silver to-primary-500 text-white' 
        : item.rank === 3 
          ? 'bg-gradient-to-r from-rank-bronze to-accent-800 text-white' 
          : 'bg-neutral-50 text-neutral-600';

    return (
      <li 
        key={item.rank} 
        className="flex items-center py-3 border-b border-neutral-50 hover:bg-neutral-50 hover:mx-[-10px] hover:px-2.5 hover:rounded-lg transition-all cursor-pointer last:border-0"
      >
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[14px] mr-3.5 ${rankClass}`}>
          {item.rank}
        </span>
        <img 
          src={item.img} 
          className="w-[45px] h-[60px] rounded-lg object-cover mr-3.5" 
          alt={item.name} 
        />
        <div className="flex-1">
          <div className="font-semibold text-[14px] text-neutral-900 mb-1 truncate">{item.name}</div>
          <div className="text-[12px] text-neutral-600 flex gap-3.75">
            {type === 'reading' && (
              <>
                <span className="flex items-center gap-1"><i className="fas fa-eye"></i> {item.read}</span>
                <span className="flex items-center gap-1"><i className="fas fa-comment"></i> {item.comment}</span>
              </>
            )}
            {type === 'like' && (
              <>
                <span className="flex items-center gap-1"><i className="fas fa-heart text-accent-500"></i> {item.like}</span>
                <span className="flex items-center gap-1"><i className="fas fa-star text-accent-500"></i> {item.score}</span>
              </>
            )}
          </div>
        </div>
      </li>
    );
  };

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6.25 flex items-center gap-3">
        <i className="fas fa-trophy text-primary-600"></i>
        漫画排行榜
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-12">
        {/* 阅读量排行 */}
        <div className="bg-white rounded-xl p-6.25 shadow-md hover:translate-y-[-5px] hover:shadow-lg transition-all">
          <div className="flex justify-between items-center mb-5 pb-3.75 border-b-2 border-neutral-50">
            <h3 className="text-lg font-bold flex items-center gap-2.5 text-primary-600">
              <i className="fas fa-eye"></i>
              阅读量排行
            </h3>
            <div className="flex gap-1.25 bg-neutral-50 p-1 rounded-lg">
              <button className="px-3 py-1.5 text-[12px] rounded-md bg-white text-primary-600 shadow-sm">周榜</button>
              <button className="px-3 py-1.5 text-[12px] rounded-md text-neutral-600">月榜</button>
              <button className="px-3 py-1.5 text-[12px] rounded-md text-neutral-600">总榜</button>
            </div>
          </div>
          <ul className="list-none">
            {readingRank.map(item => renderRankItem(item, 'reading'))}
          </ul>
        </div>

        {/* 评论排行 */}
        <div className="bg-white rounded-xl p-6.25 shadow-md hover:translate-y-[-5px] hover:shadow-lg transition-all">
          <div className="flex justify-between items-center mb-5 pb-3.75 border-b-2 border-neutral-50">
            <h3 className="text-lg font-bold flex items-center gap-2.5 text-accent-500">
              <i className="fas fa-comments"></i>
              最热评论
            </h3>
          </div>
          <ul className="list-none">
            {commentRank.map(item => renderRankItem(item, 'comment'))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RankingSection;