import { useState, useEffect } from 'react';
import { RollingEvent } from '../types.ts';
import { MOCK_ROLLING_EVENTS, SAMPLE_NAMES, SAMPLE_REGIONS } from '../constants.ts';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, RefreshCw, Sparkles, Trophy } from 'lucide-react';

interface LiveRollingFeedProps {
  customEvents?: RollingEvent[];
}

export default function LiveRollingFeed({ customEvents = [] }: LiveRollingFeedProps) {
  const [events, setEvents] = useState<RollingEvent[]>(MOCK_ROLLING_EVENTS);
  const [scrollIndex, setScrollIndex] = useState(0);

  // Combine static mock events and real-time submitted events
  useEffect(() => {
    if (customEvents.length > 0) {
      // Put custom events at the very beginning to highlight them immediately
      setEvents([...customEvents, ...MOCK_ROLLING_EVENTS]);
    } else {
      setEvents(MOCK_ROLLING_EVENTS);
    }
  }, [customEvents]);

  // Periodically insert random fake inquiries to simulate active traffic
  useEffect(() => {
    const types = ['입주청소', '이사청소', '거주청소', '상가/사무실', '가전/에어컨'];
    const statuses: ('접수완료' | '상담중' | '배정완료' | '청소완료')[] = [
      '접수완료', '상담중', '배정완료'
    ];

    const interval = setInterval(() => {
      const randomName = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
      const randomRegion = SAMPLE_REGIONS[Math.floor(Math.random() * SAMPLE_REGIONS.length)];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomPyung = Math.floor(Math.random() * 30) + 15; // 15 to 45평
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      const newEvent: RollingEvent = {
        id: `fake-event-${Date.now()}`,
        name: randomName,
        region: randomRegion,
        cleaningType: randomType,
        pyung: randomPyung,
        timeText: '방금 전',
        status: randomStatus,
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 15)]);
    }, 12000); // add a fake event every 12 seconds

    return () => clearInterval(interval);
  }, []);

  // Set up index rotators for dual-line viewport rolling
  useEffect(() => {
    const visibleCount = 3;
    const interval = setInterval(() => {
      setScrollIndex((prev) => {
        if (events.length <= visibleCount) return 0;
        return (prev + 1) % (events.length - visibleCount + 1);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [events]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '접수완료':
        return <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold border border-blue-200">접수완료</span>;
      case '상담중':
        return <span className="bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full text-xs font-bold border border-yellow-200 animate-pulse">상담중</span>;
      case '배정완료':
        return <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-xs font-bold border border-green-200">배정완료</span>;
      case '청소완료':
        return <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full text-xs font-bold border border-purple-200">👑 청소완료</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">접수중</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-6 max-w-4xl mx-auto my-8">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <h3 className="font-bold text-slate-800 text-base md:text-lg flex items-center gap-1.5 font-display">
            실시간 전국 안심접수 및 완료현황
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full font-medium">
          <RefreshCw size={12} className="animate-spin" />
          <span>실시간 자동 갱신 중</span>
        </div>
      </div>

      {/* Grid container with rolling table styling */}
      <div className="relative overflow-hidden h-[190px] md:h-[210px] bg-slate-50 rounded-xl p-3">
        <div className="grid grid-cols-12 text-slate-400 text-xs font-bold px-4 py-2 border-b border-slate-100 uppercase tracking-wider">
          <div className="col-span-3">접수지역 / 고객</div>
          <div className="col-span-3">서비스종류</div>
          <div className="col-span-2 text-center">주거평수</div>
          <div className="col-span-2 text-center">구분</div>
          <div className="col-span-2 text-right">상태</div>
        </div>

        <div className="relative h-[150px] overflow-hidden mt-1">
          <motion.div
            className="flex flex-col gap-2.5 absolute w-full"
            animate={{ y: -scrollIndex * 46 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`grid grid-cols-12 items-center px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  event.id.startsWith('custom-')
                    ? 'bg-amber-50 hover:bg-amber-100/80 border border-amber-200' 
                    : 'bg-white hover:bg-slate-100/50 border border-slate-100'
                }`}
              >
                <div className="col-span-3 font-medium text-slate-800 flex items-center gap-1.5">
                  {event.id.startsWith('custom-') && (
                    <Sparkles size={13} className="text-amber-500 animate-bounce shrink-0" />
                  )}
                  <span className="truncate">{event.region} <span className="text-slate-400 font-normal">{event.name}</span></span>
                </div>
                <div className="col-span-3 text-slate-600 font-medium text-xs md:text-sm">
                  {event.cleaningType}
                </div>
                <div className="col-span-2 text-center text-slate-500 font-mono text-xs md:text-sm">
                  {event.pyung}평형
                </div>
                <div className="col-span-2 text-center text-slate-400 text-xs">
                  {event.timeText}
                </div>
                <div className="col-span-2 text-right">
                  {getStatusBadge(event.status)}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <p className="flex items-center gap-1">
          <CheckCircle2 size={13} className="text-teal-500" />
          <span>꼼꼼희는 엄격한 소음 관리 및 민원 예방 매뉴얼을 준수합니다.</span>
        </p>
        <span className="hidden sm:flex items-center gap-1 text-slate-600 font-mono font-medium">
          <Trophy size={13} className="text-amber-500" /> 누적 시공기록 12,842건 돌파!
        </span>
      </div>
    </div>
  );
}
