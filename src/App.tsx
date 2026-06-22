import { useState, FormEvent } from 'react';
import { Inquiry, RollingEvent } from './types.ts';
import LiveRollingFeed from './components/LiveRollingFeed.tsx';
import BeforeAfterSlider from './components/BeforeAfterSlider.tsx';
import LeadForm from './components/LeadForm.tsx';
import FloatingCTAs from './components/FloatingCTAs.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import { INITIAL_FAQS } from './constants.ts';
import { 
  Sparkles, ShieldCheck, HeartHandshake, Award, Timer, HardHat,
  ChevronDown, ChevronUp, CheckCircle, Flame, Star, Trophy, ArrowRight,
  Settings, KeyRound, HelpCircle, PhoneCall
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isSamplePopupOpen, setIsSamplePopupOpen] = useState(true);
  const [customEvents, setCustomEvents] = useState<RollingEvent[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showPasscodePrompt, setShowPasscodePrompt] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  
  // FAQ accordion open states
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  // When a user registers a lead on the landing page form, let's append it to rolling feed!
  const handleNewSubmission = (newInquiry: Inquiry) => {
    // Generate a new rolling event record
    const regionParts = newInquiry.memo?.match(/서울\s\S+|경기\s\S+|인천\s\S+/);
    const mockRegion = regionParts ? regionParts[0] : '서울 마포구';
    const initials = newInquiry.name.length > 2 
      ? `${newInquiry.name[0]}*${newInquiry.name[newInquiry.name.length - 1]}`
      : `${newInquiry.name[0]}*`;

    const newEvent: RollingEvent = {
      id: `custom-${newInquiry.id}`,
      name: initials,
      region: mockRegion,
      cleaningType: newInquiry.cleaningType,
      pyung: newInquiry.pyung,
      timeText: '방금 전',
      status: '접수완료'
    };

    setCustomEvents((prev) => [newEvent, ...prev]);
  };

  const handleAdminVerify = (e: FormEvent) => {
    e.preventDefault();
    if (passcode === '1234') {
      setIsAdminOpen(true);
      setShowPasscodePrompt(false);
      setPasscode('');
      setPasscodeError('');
    } else {
      setPasscodeError('비밀번호가 올바르지 않습니다. (기본비밀번호: 1234)');
    }
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const scrollToLeadForm = () => {
    const el = document.getElementById('lead-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="font-sans min-h-screen bg-slate-50 text-slate-800 antialiased overflow-x-hidden selection:bg-indigo-600 selection:text-white pb-16 sm:pb-0">
      
      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 z-30 transition-all">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
              <Sparkles size={20} className="animate-spin" />
            </span>
            <span className="text-xl font-black text-slate-900 tracking-tight font-display flex items-center gap-1.5">
              꼼꼼희 <span className="text-xs bg-indigo-50 text-indigo-600 font-extrabold px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-widest hidden xs:inline">Premium</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="tel:1644-8888" 
              className="text-xs md:text-sm font-bold text-slate-700 hover:text-indigo-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 flex items-center gap-1.5 transition-all shrink-0"
            >
              <PhoneCall size={14} className="text-indigo-500 animate-pulse" />
              <span className="hidden sm:inline">고객센터:</span> 1644-8888
            </a>
            
            <button
              onClick={scrollToLeadForm}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs md:text-sm font-extrabold rounded-xl shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer shrink-0"
            >
              실시간 견적신청
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Interactive Campaign Banner (메인 비너) */}
      <main className="relative bg-slate-900 overflow-hidden text-white py-16 md:py-24">
        {/* Ambient abstract backgrounds */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div 
          className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1603796846097-bee99e4a60c9?auto=format&fit=crop&q=80&w=1200")' }}
        />

        <div className="max-w-6xl mx-auto px-4 md:px-6 relative grid md:grid-cols-12 gap-10 items-center">
          
          {/* Main Campaign Hook copy */}
          <div className="md:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600/20 text-indigo-400 font-bold text-xs rounded-full border border-indigo-500/30 animate-pulse tracking-wide font-display">
              <Trophy size={13} className="text-yellow-400" />
              수비 부담 제로! 100% 본사 직영 책임 매칭 청소
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight font-display text-white">
              엄선된 전문가들이 <span className="text-indigo-400">꼼꼼하게 해주는</span><br />
              프리미엄 정직한 청소, 꼼꼼희 
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-lg">
              하업 협회에서 인증받은 안심 천연 친환경 세제만을 아기 피부처럼 기본 사용합니다.
              주방, 욕실 안심 고온 스팀 토출 살균 소독이 추가 청구금 없이 전액 패키지 무상 장착!
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-2xl">
                <span className="text-teal-400"><ShieldCheck size={20} /></span>
                <div>
                  <span className="text-[11px] text-slate-400 font-bold block leading-none">신뢰도 100%</span>
                  <span className="text-xs font-extrabold text-slate-200 mt-1 inline-block">외국 국적 하청 금지</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-2xl">
                <span className="text-indigo-400"><HeartHandshake size={20} /></span>
                <div>
                  <span className="text-[11px] text-slate-400 font-bold block leading-none">보상 시스템</span>
                  <span className="text-xs font-extrabold text-slate-200 mt-1 inline-block">A/S 보증서 전격 발급</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-2xl">
                <span className="text-yellow-400"><Award size={20} /></span>
                <div>
                  <span className="text-[11px] text-slate-400 font-bold block leading-none">행사 혜택</span>
                  <span className="text-xs font-extrabold text-slate-200 mt-1 inline-block">무상 피톤치드 분사 소독</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={scrollToLeadForm}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 active:scale-95 transition-all text-sm md:text-base cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>3초 간편 예상 견적 신청하기</span>
                <ArrowRight size={16} />
              </button>
              <a
                href="tel:1644-8888"
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm md:text-base font-extrabold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>간편 직통 전화 상담</span>
              </a>
            </div>
          </div>

          {/* Clean Apartment Visual Illustration Column */}
          <div className="md:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-8 border-slate-800 shadow-2xl h-[280px] md:h-[380px] group">
              <img
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800"
                alt="꼼꼼희 프리미엄 클리닝 시공"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-5">
                <div className="bg-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-1.5 text-xs text-yellow-400 font-bold mb-1">
                    <Star size={13} className="fill-current text-yellow-400" />
                    <Star size={13} className="fill-current text-yellow-400" />
                    <Star size={13} className="fill-current text-yellow-400" />
                    <Star size={13} className="fill-current text-yellow-400" />
                    <Star size={13} className="fill-current text-yellow-400" />
                    <span>(평점 4.9/5)</span>
                  </div>
                  <blockquote className="text-xs text-slate-300 font-medium leading-relaxed">
                    "주방 기름때랑 욕실 물때 때문에 아내가 엄청 걱정했는데, 퇴근하고 가보니 완전히 호텔처럼 반짝거렸어요! 친절한 팀장님 정말 추천합니다."
                  </blockquote>
                  <p className="text-[10px] text-slate-500 font-bold mt-2 text-right">- 서울 마포 아현 아이파크 34평형 김*정 고객님 후기</p>
                </div>
              </div>
            </div>
            
            {/* Absolute hovering badge */}
            <div className="absolute -top-4 -right-4 bg-teal-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-xl border-2 border-white flex flex-col items-center">
              <span className="text-[10px] text-teal-100 font-bold font-display uppercase tracking-wider leading-none">피톤치드</span>
              <span className="text-sm font-extrabold mt-0.5 font-display leading-none">무료 살균소독</span>
            </div>
          </div>

        </div>
      </main>

      {/* 3. Live real-time reception status rolling feed component */}
      <section className="px-4 md:px-6 -mt-8 relative z-20">
        <LiveRollingFeed customEvents={customEvents} />
      </section>

      {/* 4. Service Core Values & Difference section */}
      <section className="py-16 max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="text-indigo-600 bg-indigo-50 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest block w-fit mx-auto">
            왜 꼼꼼희 일까요?
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 tracking-tight mt-3 font-display">
            꼼꼼희가 집계하는 <span className="text-indigo-600">3가지 독보적 원칙</span>
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto">
            하청을 주는 타 업체들과의 비교를 완격히 불허합니다.
            정령된 기준과 정성의 차이가 당신의 새로운 시작을 산뜻하게 돕습니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center p-3">
                <HardHat size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-extrabold text-slate-800 font-display">
                1. 100% 직영 정직 관리 제도
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                일자리 소개 하청을 주어 수수료를 떼어가지 않기에, 마스터들의 임무 책임도가 차원이 다릅니다.
                본사 소속 안심 신원 마스터가 전담 동행합니다.
              </p>
            </div>
            <ul className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-xs font-bold text-indigo-600">
              <li className="flex items-center gap-1">✓ 전원 본사 안심 신원 교육 이수</li>
              <li className="flex items-center gap-1">✓ 외국인 하청/용역 파견 전면 배제</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center p-3">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-extrabold text-slate-800 font-display">
                2. 무해한 보건인증 친환경 세제
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                강한 독성의 화공약품 세제를 쓰면 시공은 빠르지만 목조나 타일이 상하고 가족의 호흡기로 남게 됩니다.
                시간이 더 걸려도 무독 친환경 친환경 세제를 무료 사용합니다.
              </p>
            </div>
            <ul className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-xs font-bold text-teal-600">
              <li className="flex items-center gap-1">✓ 아기 및 반려동물 안심 보장 원칙</li>
              <li className="flex items-center gap-1">✓ 추가 가산금 없이 전 주거 적용</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center p-3 animate-pulse">
                <Flame size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-extrabold text-slate-800 font-display">
                3. 130도 고압 스팀 멸균 무료
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                배수구, 후드, 변기 물줄기, 가스레인지 등 세균 번식이 극심하고 기름때가 응결된 부분에 고출력 고온 스팀 안성 처리를 기본 적용합니다.
              </p>
            </div>
            <ul className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-xs font-bold text-red-500">
              <li className="flex items-center gap-1">✓ 싱크대 배수구 및 세면대 살균소독</li>
              <li className="flex items-center gap-1">✓ 대장균 완벽 사멸 99.9% 인증</li>
            </ul>
          </div>

        </div>
      </section>

      {/* 5. Interactive Before & After comparison slider section */}
      <section className="bg-white py-12">
        <BeforeAfterSlider />
      </section>

      {/* 6. Lead form and quote calculator section */}
      <section className="py-16 max-w-4xl mx-auto px-4 md:px-6">
        <LeadForm onSubmitSuccess={handleNewSubmission} />
      </section>

      {/* 7. FAQs section with clean toggle state */}
      <section className="py-16 max-w-4xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <HelpCircle size={32} className="mx-auto text-indigo-500 mb-2" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight font-display">
            무엇이든 물어보세요 (자주 묻는 질문)
          </h2>
          <p className="text-slate-500 text-sm mt-1">꼼꼼희에 대해 가장 많이 문의 주시는 내용을 모았습니다.</p>
        </div>

        <div className="space-y-3">
          {INITIAL_FAQS.map((faq) => (
            <div 
              key={faq.id} 
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                type="button"
                className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:text-indigo-600 decoration-transparent cursor-pointer transition-colors"
              >
                <span className="text-sm md:text-base pr-4">{faq.question}</span>
                {openFaqId === faq.id ? <ChevronUp size={16} className="text-indigo-500" /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>

              <AnimatePresence initial={false}>
                {openFaqId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden bg-slate-50 border-t border-slate-100"
                  >
                    <div className="p-5 text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Corporate Trust Marks banner */}
      <section className="bg-slate-200 py-12 px-4 text-center border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="font-extrabold text-xs md:text-sm text-slate-500 tracking-wider">
            꼼꼼희는 현대해상 화재 최고 1억원 영업배상 책임 보험에 전격 정식 가입되어 있습니다
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 opacity-60 text-slate-400 text-xs font-bold">
            <span className="border-r border-slate-300 pr-6">가입번호: 12026048191</span>
            <span className="border-r border-slate-300 pr-6">신원 보증 100% 안심 마크 인증</span>
            <span>한국 실내 환경 클린 협회 정회원사</span>
          </div>
        </div>
      </section>

      {/* 9. Footers and developer metadata toggle admin panel access */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-10 px-4 md:px-6 relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch md:items-start justify-between gap-8">
          
          <div className="space-y-3.5">
            <div className="flex items-center gap-1.5 text-white font-extrabold text-base">
              <Sparkles size={16} className="text-indigo-400" />
              <span>꼼꼼희 청소전문 기업</span>
            </div>
            <p className="leading-relaxed max-w-md font-mono text-[11px]">
              주식회사 꼼꼼희 | 대표이사: 김꼼꼼 | 서울특별시 마포구 아현동 꼼꼼희 빌딩 4F<br />
              사업자등록번호: 220-81-12345 | 통신판매업신고: 제 2026-서울마포-0104호<br />
              고객안내 직통번호: <a href="tel:1644-8888" className="text-white hover:underline">1644-8888</a> | 전자우편: help@kkomkkomhe.kr
            </p>
            <p className="text-slate-600 text-[10px]">
              본 꼼꼼희 랜딩페이지는 유포 광고 마케팅 및 오차 정보 수집 목적용으로 제작되었습니다.<br />
              Copyright &copy; 2026 KKOMKKOMHE Corp. All Rights Reserved.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            {/* Direct Admin toggle passcode widget trigger */}
            <button
              onClick={() => setShowPasscodePrompt(!showPasscodePrompt)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Settings size={13} className="text-slate-400" />
              <span>꼼꼼희 파트너 로그인 (어드민)</span>
            </button>

            {/* Passcode entry widget */}
            {showPasscodePrompt && (
              <form onSubmit={handleAdminVerify} className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col gap-2 w-56 shadow-xl animate-fade-in">
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                  <KeyRound size={10} className="text-indigo-400" />
                  비밀번호 4자리 입력 (기본: 1234)
                </span>
                <div className="flex gap-1.5">
                  <input
                    type="password"
                    placeholder="••••"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    maxLength={4}
                    className="bg-slate-950 border border-slate-800 rounded text-xs p-1.5 text-center text-white focus:outline-none focus:border-slate-600 flex-1 font-mono tracking-widest font-black"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-3 rounded cursor-pointer transition-colors"
                  >
                    확인
                  </button>
                </div>
                {passcodeError && (
                  <p className="text-[9px] text-red-400 leading-tight block">{passcodeError}</p>
                )}
              </form>
            )}
          </div>

        </div>
      </footer>

      {/* 10. Floating Kakao/Phone & bottom fixed CTAs */}
      <FloatingCTAs />

      {/* 11. Hidden/Toggleable Admin Dashboard Panel Modal */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        onForceRefresh={() => {
          // No complex syncing needed, loaded reactively inside AdminPanel on reopen
        }}
      />

      {/* 12. "This site is a basic type sample_3 website." Advisory Popup */}
      <AnimatePresence>
        {isSamplePopupOpen && (
          <div className="fixed inset-0 bg-slate-900/35 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 max-w-sm w-full text-center relative"
            >
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                <Sparkles size={20} className="animate-pulse" />
              </div>

              <p className="text-lg md:text-xl text-slate-800 leading-snug font-extrabold tracking-tight mb-6">
                This site is a basic type sample_3 website.
              </p>

              <button
                type="button"
                onClick={() => setIsSamplePopupOpen(false)}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:translate-y-0.5 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer transition-all"
              >
                확인 및 둘러보기
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
