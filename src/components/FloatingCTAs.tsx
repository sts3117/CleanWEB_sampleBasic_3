import { useState, useEffect } from 'react';
import { Phone, MessageSquare, ArrowUp, Calendar, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FloatingCTAs() {
  const [showBottomBar, setShowBottomBar] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show bottom persistent CTA bar after scrolling 450px
      if (window.scrollY > 450) {
        setShowBottomBar(true);
      } else {
        setShowBottomBar(false);
      }

      // Show scroll-to-top button after 600px
      if (window.scrollY > 600) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCall = () => {
    // Standard phone click
    window.location.href = 'tel:1644-8888'; // Mock company line
  };

  const handleKakao = () => {
    // Open standard Kakao open chat or simulated contact popup
    window.open('https://open.kakao.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Right side floating buttons */}
      <div className="fixed bottom-24 right-5 md:right-8 z-40 flex flex-col gap-3.5 items-end">
        
        {/* Kakao Talk Floating CTA Button */}
        <button
          onClick={handleKakao}
          className="relative group bg-[#FEE500] text-[#191919] p-3.5 md:p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm font-extrabold flex items-center gap-2 cursor-pointer border border-yellow-400"
        >
          {/* Subtle overlay badge */}
          <span className="absolute -top-6 right-0 bg-red-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-md animate-bounce whitespace-nowrap">
            카톡 한정 5% 추가할인
          </span>
          <MessageSquare className="w-5 h-5 fill-current fill-[#191919] group-hover:rotate-12 transition-transform" />
          <span className="hidden md:inline-block pr-1 font-display">실시간 카톡상담</span>
        </button>

        {/* Immediate Direct Phone Floating Call Button */}
        <button
          onClick={handleCall}
          className="bg-indigo-600 text-white p-3.5 md:p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm font-extrabold flex items-center gap-2 cursor-pointer border border-indigo-500"
        >
          <Phone className="w-5 h-5 animate-wiggle group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline-block pr-1 font-display">긴급 전화문의</span>
        </button>

        {/* Scroll back to top pointer */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-slate-800/90 hover:bg-slate-900 border border-slate-700 text-white p-3 rounded-full shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
              title="맨 위로 이동"
            >
              <ArrowUp size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom persistent bar (하단 고정 CTA) */}
      <AnimatePresence>
        {showBottomBar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 py-3.5 px-4 md:px-8 shadow-[0_-10px_25px_rgba(0,0,0,0.08)]"
          >
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              
              {/* Marketing promotional text column */}
              <div className="hidden sm:flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="bg-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                    오늘 한정 EVENT
                  </span>
                  <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                    <Sparkles size={12} className="animate-spin" />
                    피톤치드 수동소독 무료제공
                  </span>
                </div>
                <p className="text-slate-800 text-sm md:text-base font-extrabold tracking-tight mt-1">
                  100% 본사 직영 책임 매칭, 빈자리 있을 때 예약하세요!
                </p>
              </div>

              {/* Action trigger button column */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCall}
                  className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Phone size={15} />
                  <span className="hidden xs:inline-block">전화: 1644-8888</span>
                </button>
                <button
                  onClick={() => scrollToSection('lead-form-section')}
                  className="flex-1 sm:px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-teal-500 hover:opacity-95 text-white font-extrabold text-sm md:text-base rounded-xl shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <Calendar size={16} />
                  <span>실시간 견적 신청 및 무료 소독 예약하기</span>
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
