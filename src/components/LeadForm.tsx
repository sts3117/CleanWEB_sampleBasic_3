import { useState, useEffect, FormEvent } from 'react';
import { Inquiry, RollingEvent } from '../types.ts';
import { Phone, Calendar, ClipboardCheck, Clock, User, Home, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LeadFormProps {
  onSubmitSuccess: (newInquiry: Inquiry) => void;
}

export default function LeadForm({ onSubmitSuccess }: LeadFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cleaningType, setCleaningType] = useState('입주청소');
  const [pyung, setPyung] = useState(30);
  const [preferredDate, setPreferredDate] = useState('');
  const [memo, setMemo] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);

  // Success state indicators
  const [submitted, setSubmitted] = useState<Inquiry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 21, seconds: 15 });

  // Urgency logic: simple countdown that counts down
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset to 5 hours to avoid ever striking absolute zero and looking stale
          return { hours: 5, minutes: 30, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format phone number to clean "010-XXXX-XXXX" pattern
  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 3 && cleaned.length <= 7) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else if (cleaned.length > 7) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    }
    setPhone(formatted);
  };

  // Instant estimate cost calculator
  const getCalculatedPrice = () => {
    let baseRate = 12000; // Base: 12,000 KRW per pyung
    if (cleaningType === '거주청소') baseRate = 14000;
    if (cleaningType === '상가/사무실') baseRate = 11000;
    if (cleaningType === '가전/에어컨') return pyung * 8000; // Special flat standard
    
    const calculated = pyung * baseRate;
    return calculated;
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('고객명을 입력해 주세요.');
    if (phone.length < 12) return alert('정확한 연락처(010-XXXX-XXXX)를 입력해 주세요.');
    if (!preferredDate) return alert('희망 청소일을 선택해 주세요.');
    if (!agree) return alert('개인정보 수집 및 동의 항목에 체크해 주세요.');

    setIsSubmitting(true);

    // Simulate sending data to Firestore / secure server endpoint with a sweet 900ms delay
    setTimeout(() => {
      const newInquiry: Inquiry = {
        id: `custom-${Date.now()}`,
        name: name.trim(),
        phone,
        cleaningType,
        pyung,
        preferredDate,
        status: '신규',
        memo: memo.trim() || undefined,
        createdAt: new Date().toISOString(),
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.***.***`
      };

      // Save to local storage for admin query retrieval
      const existing: Inquiry[] = JSON.parse(localStorage.getItem('inquiries') || '[]');
      existing.unshift(newInquiry);
      localStorage.setItem('inquiries', JSON.stringify(existing));

      // Invoke parent callbacks (appends straight into live rolling view)
      onSubmitSuccess(newInquiry);

      setSubmitted(newInquiry);
      setIsSubmitting(false);
    }, 900);
  };

  const formattedPrice = () => {
    const base = getCalculatedPrice();
    const minStr = (base * 0.95).toLocaleString();
    const maxStr = (base * 1.08).toLocaleString();
    return `${minStr}원 ~ ${maxStr}원`;
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setCleaningType('입주청소');
    setPyung(30);
    setPreferredDate('');
    setMemo('');
    setAgree(false);
    setSubmitted(null);
  };

  return (
    <div id="lead-form-section" className="bg-slate-900 text-white rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden border border-slate-800 scroll-mt-24">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="lead-form-body"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="relative"
          >
            {/* Countdown Badge & Title Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-indigo-950 border border-indigo-700/60 px-4 py-2 rounded-full mb-4">
                <Clock size={16} className="text-red-400 animate-pulse" />
                <span className="text-xs md:text-sm text-indigo-200 font-bold tracking-wider">
                  🔥 선착순 한정 혜택 (피톤치드 무료시공) 마감
                </span>
                <span className="text-red-400 font-mono font-bold text-xs md:text-sm tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight font-display text-white">
                꼼꼼희 전 지점 <span className="text-indigo-400">실시간 다이렉트 간편 견적</span>
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xl">
                어떠한 하청 중개 수수료도 없는 정직한 다이렉트 마스터 직영 가격.
                간단한 기본 공학 입력 전송 즉시 전담 마스터가 안내 드립니다!
              </p>
            </div>

            {/* Main Interactive Interactive Input Form area */}
            <form onSubmit={handleFormSubmit} className="space-y-6 max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* 1. Cleaning classification Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 tracking-wider block flex items-center gap-1.5 uppercase">
                    <Home size={13} className="text-indigo-400" />
                    1. 청소 분야 선택
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                    {['입주청소', '이사청소', '거주청소', '상가/사무실', '가전/에어컨'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setCleaningType(type)}
                        className={`py-2.5 px-3 rounded-lg text-xs md:text-sm font-bold border transition-all ${
                          cleaningType === type
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Standard Area Size Selector (Pyung) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 tracking-wider block flex items-center gap-1.5 uppercase">
                    <Sparkles size={13} className="text-indigo-400" />
                    2. 주거/사무실 평수 ({pyung}평형)
                  </label>
                  <div className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={pyung}
                      onChange={(e) => setPyung(Number(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-900 rounded-lg appearance-none"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="5"
                        max="200"
                        value={pyung}
                        onChange={(e) => setPyung(Number(e.target.value))}
                        className="bg-slate-900 border border-slate-700 rounded-md py-1 px-2 w-16 text-center text-sm font-bold font-mono text-indigo-400"
                      />
                      <span className="text-xs text-slate-400 font-bold shrink-0">평</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instant estimate feedback screen block */}
              <div className="bg-indigo-950/80 border border-indigo-500/40 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="p-2.5 bg-indigo-900 rounded-xl text-indigo-400 shrink-0">
                    <ClipboardCheck size={20} className="animate-pulse" />
                  </span>
                  <div>
                    <span className="text-xs font-bold text-indigo-300">꼼꼼희 표준 산정 실시간 맞춤 예상견적</span>
                    <p className="text-slate-400 text-xs mt-0.5">평균 오염 기준 산지 단가 조율전 예상 가격대 입니다.</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-xs mr-2 line-through">옵션 및 피톤치드 무상 적용가</span>
                  <div className="text-xl md:text-2xl font-extrabold text-teal-400 font-mono tracking-tight">
                    {formattedPrice()}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 tracking-wider block flex items-center gap-1.5">
                    <User size={13} className="text-indigo-400" />
                    성명 (의뢰인명)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="김꼼꼼"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-slate-800/85 border border-slate-700 rounded-lg py-2.5 pl-4 pr-10 w-full text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                    />
                    <Sparkles size={14} className="text-indigo-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Phone Input with Auto Formatting */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 tracking-wider block flex items-center gap-1.5">
                    <Phone size={13} className="text-indigo-400" />
                    연락처 (정확히 입력)
                  </label>
                  <div>
                    <input
                      type="tel"
                      placeholder="010-0000-0000"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="bg-slate-800/85 border border-slate-700 rounded-lg py-2.5 px-4 w-full text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none tracking-wider font-bold"
                    />
                  </div>
                </div>

                {/* Preferred date input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 tracking-wider block flex items-center gap-1.5">
                    <Calendar size={13} className="text-indigo-400" />
                    희망 청소 시공일
                  </label>
                  <div>
                    <input
                      type="date"
                      value={preferredDate}
                      min={new Date().toISOString().split('T')[0]} // Block history dates
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="bg-slate-800/85 border border-slate-700 rounded-lg py-2.5 px-4 w-full text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 focus:outline-none text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Memo Text area */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 tracking-wider block">
                  추가 문의 및 전달사항 (선택)
                </label>
                <textarea
                  placeholder="예: 발코니에 곰팡이가 많습니다, 새집 증후군 소독은 꼭 같이 해주고 오전에 진행했으면 합니다."
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows={2}
                  className="bg-slate-800/85 border border-slate-700 rounded-lg p-3 w-full text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:text-white"
                />
              </div>

              {/* Personal Policy Protection Terms & Agreement Checkbox */}
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-slate-600 bg-slate-900 text-indigo-600 focus:ring-indigo-500/20"
                    />
                    <span className="text-xs md:text-sm font-semibold text-slate-200">
                      [필수] 개인정보 수집 및 동의 사항에 확인 및 동의합니다.
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold"
                  >
                    <span>내용보기</span>
                    {showPrivacyDetails ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                </div>

                <AnimatePresence>
                  {showPrivacyDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-3 pt-3 border-t border-slate-700/60"
                    >
                      <div className="bg-slate-900 p-3 rounded text-[11px] text-slate-400 font-medium leading-relaxed max-h-32 overflow-y-auto font-mono">
                        <p className="font-bold text-slate-200 mb-1">■ 개인정보의 수집 및 이용 목적</p>
                        <p className="-mt-1 mb-2">본사 "꼼꼼희"는 청소 상담, 견적 산출 및 시공 예약 체결 목적을 위해서 아래와 같은 고객 개인정보를 수집하고 활용합니다.</p>
                        <p className="font-bold text-slate-200 mb-1">■ 수집하는 개인정보 항목</p>
                        <ul className="list-disc pl-4 -mt-1 mb-2">
                          <li>성명, 연령정보, 희망 시공 주소지 및 평수</li>
                          <li>유선 연락처 및 상담 요구 메모 내역</li>
                        </ul>
                        <p className="font-bold text-slate-200 mb-1">■ 개인정보의 보유 및 이용 기간</p>
                        <p className="-mt-1">상담 완료 및 보강 A/S 책임 대응 보장 기한 체결 완료 시점 이후 최대 3개월 동안 백업관 보관하며 목적 완료 시 즉각 하드 디스크에서 안전 안전하게 폐기합니다. 의뢰인은 본 수령을 거부할 권리가 있으며 거부 시 견적서 제공 및 방문 상담 진행이 제한됩니다.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative py-4 px-6 bg-gradient-to-r from-teal-500 via-indigo-600 to-indigo-700 text-white font-extrabold rounded-xl shadow-lg border border-indigo-400/20 shadow-indigo-700/30 hover:scale-[1.01] active:translate-y-0.5 transition-all text-base md:text-lg flex items-center justify-center gap-2 cursor-pointer group disabled:opacity-75 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>신청 접수 정보를 안전하게 송신 중...</span>
                    </>
                  ) : (
                    <>
                      <ClipboardCheck size={20} className="group-hover:scale-110 transition-transform" />
                      <span>꼼꼼희 선착순 특전 포함 다이렉트 신청 완료하기</span>
                      <Sparkles size={16} className="text-yellow-300 animate-bounce" />
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-500 mt-2.5">
                  꼼꼼희는 엄격한 정보보안 인증 기술 및 다이중 백업으로 고객 연락처를 스팸으로부터 100% 철저 억제합니다.
                </p>
              </div>
            </form>
          </motion.div>
        ) : (
          /* Submission Completed Screen Mode */
          <motion.div
            key="lead-success-body"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 max-w-xl mx-auto flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center p-4 border border-teal-500/30 mb-6 animate-bounce">
              <Check size={40} className="stroke-[3]" />
            </div>
            
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-400 bg-teal-950/80 px-3.5 py-1.5 rounded-full border border-teal-800/60 mb-2">
              Registration Successful
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
              견적 상담 접수가 <span className="text-teal-400">성공적으로 완료</span> 되었습니다!
            </h3>
            
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 w-full text-left my-8 space-y-3">
              <p className="text-xs text-slate-400 text-center pb-2 border-b border-slate-700/60 font-medium">실시간 접수 요약 내역</p>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">의뢰인 성함</span>
                <span className="font-bold text-slate-200">{submitted.name} 고객님</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">선택 청소종류</span>
                <span className="font-bold text-teal-400">{submitted.cleaningType} ({submitted.pyung}평형)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">신청 완료일자</span>
                <span className="font-bold text-slate-200">{submitted.preferredDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">회신 연락처</span>
                <span className="font-mono font-bold text-slate-200">{submitted.phone}</span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              신속 접수 완료되어 꼼꼼희 소속 정선 전담 클린 매니저가 <strong className="text-indigo-300 font-bold">10분 이내 유선 전화상담</strong> 또는 <strong className="text-yellow-400 font-bold">카카오톡 메시지로</strong> 친절한 예상 실시간 혜택 확정 견적을 안내해 드립니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold rounded-xl transition-all cursor-pointer border border-slate-700"
              >
                새로운 청소 견적 추가 접수
              </button>
              <a
                href="tel:1588-0000" // Simulated corporate hotline block
                className="flex-1 py-3 px-5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Phone size={15} />
                <span>긴급 직통 전화로 물어보기</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
