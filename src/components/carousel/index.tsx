import { useState } from 'react';

export const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      img: "https://picsum.photos/1400/400?random=1",
      title: "🔥 星际穿越者",
      desc: "AI科幻巨作，跨越星际的史诗冒险"
    },
    {
      img: "https://picsum.photos/1400/400?random=2",
      title: "💜 魔法少女的日常",
      desc: "轻松治愈的魔法日常，带给你温暖与欢乐"
    },
    {
      img: "https://picsum.photos/1400/400?random=3",
      title: "⚔️ 王者之战",
      desc: "热血战斗，强者为王的奇幻世界"
    },
    {
      img: "https://picsum.photos/1400/400?random=4",
      title: "🌸 樱花下的约定",
      desc: "浪漫唯美的青春恋爱故事"
    }
  ];

  const moveCarousel = (direction:any) => {
    const newSlide = (currentSlide + direction + slides.length) % slides.length;
    setCurrentSlide(newSlide);
  };

  const goToSlide = (index :any) => {
    setCurrentSlide(index);
  };

  return (
    <section className="my-7.5">
      <div className="relative rounded-2xl overflow-hidden h-[400px] shadow-lg md:h-[280px]">
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="min-w-full h-full relative">
              <img
                src={slide.img}
                alt={`carousel-${index}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-10 md:p-7.5 text-white">
                <h2 className="text-3xl mb-2.5 text-shadow md:text-2xl">{slide.title}</h2>
                <p className="text-base opacity-90 md:text-sm">{slide.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 轮播箭头 */}
        <button 
          className="absolute top-1/2 -translate-y-1/2 left-5 w-12.5 h-12.5 bg-white/20 border-0 rounded-full text-white text-xl cursor-pointer transition-all backdrop-blur-lg hover:bg-primary-600 hover:scale-110"
          onClick={() => moveCarousel(-1)}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <button 
          className="absolute top-1/2 -translate-y-1/2 right-5 w-12.5 h-12.5 bg-white/20 border-0 rounded-full text-white text-xl cursor-pointer transition-all backdrop-blur-lg hover:bg-primary-600 hover:scale-110"
          onClick={() => moveCarousel(1)}
        >
          <i className="fas fa-chevron-right"></i>
        </button>

        {/* 轮播指示器 */}
        <div className="absolute bottom-5 right-10 flex gap-2.5">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                currentSlide === index ? 'bg-white w-7.5 rounded-lg' : 'bg-white/50'
              }`}
              onClick={() => goToSlide(index)}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;