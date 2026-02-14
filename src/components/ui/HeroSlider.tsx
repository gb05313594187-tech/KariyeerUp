// src/components/ui/HeroSlider.tsx
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Slide {
  id: number;
  image: string;
  title: string;
  highlight: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

interface HeroSliderProps {
  slides: Slide[];
  autoPlayInterval?: number;
  height?: string;
}

export default function HeroSlider({
  slides,
  autoPlayInterval = 5000,
  height = "h-[600px] md:h-[700px]",
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));

  // Preload next image
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % slides.length;
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;

    [nextIndex, prevIndex].forEach((idx) => {
      if (!loadedImages.has(idx)) {
        const img = new Image();
        img.src = slides[idx].image;
        img.onload = () => {
          setLoadedImages((prev) => new Set([...prev, idx]));
        };
      }
    });
  }, [currentIndex, slides, loadedImages]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning]
  );

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % slides.length);
  }, [currentIndex, slides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + slides.length) % slides.length);
  }, [currentIndex, slides.length, goToSlide]);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [nextSlide, autoPlayInterval, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch/Swipe support
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) >= minSwipeDistance) {
      if (distance > 0) nextSlide();
      else prevSlide();
    }
  };

  // Progress bar width
  const progressPercent = ((currentIndex + 1) / slides.length) * 100;

  return (
    <div
      className={`relative ${height} w-full overflow-hidden group`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-label="Hero Slider"
      aria-roledescription="carousel"
    >
      {/* ===== SLIDES ===== */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
            }`}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} / ${slides.length}`}
            aria-hidden={!isActive}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
              {/* Multi-layer overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  {/* Slide number badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                      bg-white/10 backdrop-blur-md border border-white/20 
                      text-white/90 text-xs font-medium mb-6
                      transition-all duration-700 delay-200
                      ${isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                    {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                  </div>

                  {/* Title */}
                  <h1
                    className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white 
                      leading-[1.1] tracking-tight
                      transition-all duration-700 delay-300
                      ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                  >
                    {slide.title}{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                      {slide.highlight}
                    </span>
                  </h1>

                  {/* Description */}
                  <p
                    className={`mt-6 text-lg md:text-xl text-white/80 max-w-xl leading-relaxed
                      transition-all duration-700 delay-[400ms]
                      ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                  >
                    {slide.description}
                  </p>

                  {/* CTAs */}
                  <div
                    className={`mt-8 flex flex-col sm:flex-row gap-4
                      transition-all duration-700 delay-500
                      ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                  >
                    <a
                      href={slide.ctaLink}
                      className="inline-flex items-center justify-center gap-2 
                        bg-gradient-to-r from-red-600 to-orange-500 
                        hover:from-red-500 hover:to-orange-400
                        text-white font-bold text-lg
                        h-14 px-8 rounded-xl shadow-lg shadow-red-600/30
                        transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      {slide.ctaText}
                      <ChevronRight className="h-5 w-5" />
                    </a>

                    {slide.secondaryCtaText && (
                      <a
                        href={slide.secondaryCtaLink || "#"}
                        className="inline-flex items-center justify-center gap-2
                          bg-white/10 backdrop-blur-md border border-white/30
                          text-white font-semibold text-lg
                          h-14 px-8 rounded-xl
                          transition-all duration-300 hover:bg-white/20 hover:scale-105"
                      >
                        {slide.secondaryCtaText}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ===== NAVIGATION ARROWS ===== */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20
          w-12 h-12 md:w-14 md:h-14 rounded-full
          bg-white/10 backdrop-blur-md border border-white/20
          text-white flex items-center justify-center
          opacity-0 group-hover:opacity-100 transition-all duration-300
          hover:bg-white/25 hover:scale-110
          disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Önceki slayt"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20
          w-12 h-12 md:w-14 md:h-14 rounded-full
          bg-white/10 backdrop-blur-md border border-white/20
          text-white flex items-center justify-center
          opacity-0 group-hover:opacity-100 transition-all duration-300
          hover:bg-white/25 hover:scale-110
          disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Sonraki slayt"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* ===== BOTTOM BAR: Dots + Progress ===== */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        {/* Progress bar */}
        <div className="h-1 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Dots + counter */}
        <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-gradient-to-t from-black/40 to-transparent">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full
                  ${
                    index === currentIndex
                      ? "w-8 h-2.5 bg-gradient-to-r from-red-500 to-orange-400"
                      : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                aria-label={`Slayt ${index + 1}`}
                aria-current={index === currentIndex ? "true" : "false"}
              />
            ))}
          </div>

          {/* Pause indicator */}
          <div className="flex items-center gap-3 text-white/60 text-sm">
            {isPaused && (
              <span className="flex items-center gap-1 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                Duraklatıldı
              </span>
            )}
            <span className="font-mono text-xs">
              {String(currentIndex + 1).padStart(2, "0")}/{String(slides.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* ===== DECORATIVE ELEMENTS ===== */}
      <div className="absolute top-8 right-8 z-10 hidden lg:block">
        <div className="w-32 h-32 border border-white/10 rounded-full" />
        <div className="w-20 h-20 border border-white/5 rounded-full absolute top-6 left-6" />
      </div>
    </div>
  );
}
