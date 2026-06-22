import { useState, useRef, MouseEvent, TouchEvent } from 'react';
import { BEFORE_AFTER_ITEMS } from '../constants.ts';
import { ArrowLeftRight, Check, AlertCircle } from 'lucide-react';

export default function BeforeAfterSlider() {
  const [activeItem, setActiveItem] = useState(BEFORE_AFTER_ITEMS[0]);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 to 100)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let position = (x / rect.width) * 100;
    if (position < 0) position = 0;
    if (position > 100) position = 100;
    setSliderPosition(position);
  };

  const handleMouseMove = (e: MouseEvent) => {
    // Also support hover movement to make it super frictionless for desktop users
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div className="bg-slate-50 py-12 px-4 rounded-3xl border border-slate-100 max-w-5xl mx-auto my-12 shadow-inner">
      <div className="text-center mb-8">
        <span className="text-indigo-600 bg-indigo-50 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest">
          실제 시공 타임랩스
        </span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2 tracking-tight font-display">
          꼼꼼희가 지나간 자리, 완결의 클래스
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          마우스를 이미지 위에서 움직이거나 드래그해 보세요. 오염된 공간이 새것처럼 정화됩니다.
        </p>

        {/* Tab buttons to toggle rooms */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {BEFORE_AFTER_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item);
                setSliderPosition(50);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 ${
                activeItem.id === item.id
                  ? 'bg-slate-800 text-white shadow-md shadow-slate-300 transform -translate-y-0.5'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {item.category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-center">
        {/* Slider Showcase column */}
        <div className="md:col-span-7">
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            className="relative h-[250px] sm:h-[350px] rounded-2xl overflow-hidden cursor-ew-resize shadow-2xl border-4 border-white select-none group"
          >
            {/* Before state (Base image with high brightness/saturate reduction to look dirty, plus a dark-ish filter) */}
            <div className="absolute inset-0 bg-slate-900">
              <img
                src={activeItem.beforeImg}
                alt="Before cleaning"
                className="w-full h-full object-cover filter contrast-75 brightness-75 sepia-[0.15]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-extrabold px-3 py-1 rounded-md shadow-lg flex items-center gap-1.5">
                <AlertCircle size={12} />
                <span>청소 전 (Before)</span>
              </div>
            </div>

            {/* After state (Absolute overlapping div with clipPath) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ clipPath: `inset(0px ${100 - sliderPosition}% 0px 0px)` }}
            >
              <img
                src={activeItem.afterImg}
                alt="After cleaning"
                className="w-full h-full object-cover filter brightness-105 saturate-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-teal-600 text-white text-xs font-extrabold px-3 py-1 rounded-md shadow-lg flex items-center gap-1.5">
                <Check size={12} />
                <span>꼼꼼희 스팀완료 (After)</span>
              </div>
            </div>

            {/* Slider bar line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Central drag handle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-slate-800 shadow-xl border-2 border-indigo-600 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-100">
                <ArrowLeftRight size={18} className="text-indigo-600 animate-pulse" />
              </div>
            </div>

            {/* Subtle instructional visual helper */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/70 backdrop-blur-sm text-white text-xs font-medium py-1.5 px-4 rounded-full pointer-events-none transition-opacity duration-300 opacity-70 group-hover:opacity-0">
              👈 스와이프를 움직여 비교 하세요 👉
            </div>
          </div>
        </div>

        {/* Detailed description column */}
        <div className="md:col-span-5 flex flex-col justify-center">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-md">
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full inline-block">
              {activeItem.category}
            </span>
            <h4 className="text-lg md:text-xl font-extrabold text-slate-800 mt-2 font-display">
              {activeItem.title}
            </h4>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mt-4">
              {activeItem.desc}
            </p>

            <ul className="mt-6 flex flex-col gap-2 border-t border-slate-100 pt-5">
              <li className="flex items-start gap-2 text-xs text-slate-600">
                <span className="text-green-600 font-bold shrink-0">✓</span>
                <span>보건인증 친환경 다용도 무독 세정제 도포 작업</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-slate-600">
                <span className="text-green-600 font-bold shrink-0">✓</span>
                <span>틈새 멸균용 130℃ 초고압 고온 스팀 토출 케어</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-slate-600">
                <span className="text-green-600 font-bold shrink-0">✓</span>
                <span>미세 공사 잔여물 흡입 및 향균 보호막 피팅 안심 밀봉</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
