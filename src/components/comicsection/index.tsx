const ComicSection = () => {
  // 漫画数据
  const comics = [
    { id: 1, img: "https://picsum.photos/200/260?random=30", title: "星际穿越者", author: "科幻大师", read: "125.6万", comment: "3.2万", like: "8.5万", badge: "hot" },
    { id: 2, img: "https://picsum.photos/200/260?random=31", title: "魔法少女的日常", author: "治愈系画师", read: "98.3万", comment: "2.8万", like: "7.2万", badge: "new" },
    { id: 3, img: "https://picsum.photos/200/260?random=32", title: "王者之战", author: "热血漫画家", read: "86.5万", comment: "1.9万", like: "6.8万", badge: "recommend" },
    { id: 4, img: "https://picsum.photos/200/260?random=33", title: "樱花下的约定", author: "浪漫派作家", read: "72.1万", comment: "1.5万", like: "5.9万", badge: "hot" },
    { id: 5, img: "https://picsum.photos/200/260?random=34", title: "都市猎手", author: "都市派大师", read: "65.8万", comment: "1.2万", like: "4.7万", badge: "new" },
    { id: 6, img: "https://picsum.photos/200/260?random=35", title: "斗破苍穹", author: "玄幻大神", read: "156.2万", comment: "5.6万", like: "12.3万", badge: "recommend" },
    { id: 7, img: "https://picsum.photos/200/260?random=36", title: "全职高手", author: "电竞作家", read: "132.8万", comment: "4.8万", like: "10.5万", badge: "hot" },
    { id: 8, img: "https://picsum.photos/200/260?random=37", title: "一人之下", author: "国漫大师", read: "118.5万", comment: "4.2万", like: "9.8万", badge: "new" },
    { id: 9, img: "https://picsum.photos/200/260?random=38", title: "灵笼", author: "科幻导演", read: "98.7万", comment: "3.6万", like: "8.2万", badge: "recommend" },
    { id: 10, img: "https://picsum.photos/200/260?random=39", title: "秦时明月", author: "历史漫画家", read: "89.4万", comment: "3.1万", like: "7.5万", badge: "hot" },
  ];

  // 渲染漫画卡片
  const renderComicCard = (comic:any) => {
    const badgeClass = comic.badge === 'hot' 
      ? 'bg-gradient-to-r from-accent-700 to-accent-400' 
      : comic.badge === 'new' 
        ? 'bg-gradient-to-r from-art-600 to-art-500' 
        : 'bg-gradient-to-r from-accent-500 to-accent-400';

    return (
      <div key={comic.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:translate-y-[-8px] hover:shadow-xl transition-all cursor-pointer">
        <div className="relative w-full pt-[130%] overflow-hidden">
          <img 
            src={comic.img} 
            alt={comic.title}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform hover:scale-110"
          />
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold text-white z-10 ${badgeClass}`}>
            {comic.badge === 'hot' ? '热门' : comic.badge === 'new' ? '新作' : '推荐'}
          </div>
          <div className="absolute top-3 right-3 w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-[12px] z-10">
            {comic.id}
          </div>
        </div>
        <div className="p-4">
          <div className="text-[15px] font-bold text-neutral-900 mb-2 truncate">{comic.title}</div>
          <div className="text-[13px] text-neutral-600 mb-3 flex items-center gap-1.5">
            <i className="fas fa-user"></i>
            {comic.author}
          </div>
          <div className="flex justify-between pt-3 border-t border-neutral-50">
            <div className="flex items-center gap-1.25 text-[12px] text-neutral-600">
              <i className="fas fa-eye text-primary-600 text-[13px]"></i>
              {comic.read}
            </div>
            <div className="flex items-center gap-1.25 text-[12px] text-neutral-600">
              <i className="fas fa-comment text-accent-500 text-[13px]"></i>
              {comic.comment}
            </div>
            <div className="flex items-center gap-1.25 text-[12px] text-neutral-600">
              <i className="fas fa-heart text-art-700 text-[13px]"></i>
              {comic.like}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6.25 flex items-center gap-3">
        <i className="fas fa-book text-primary-600"></i>
        热门漫画
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
        {comics.map(comic => renderComicCard(comic))}
      </div>
    </section>
  );
};

export default ComicSection;