import { BeforeAfterItem, RollingEvent } from './types.ts';

export const INITIAL_FAQS = [
  {
    id: 'faq-1',
    question: '예약은 최소 며칠 전에 해야 하나요?',
    answer: '원활한 검수 및 프리미엄 일정 조율을 위해 최소 1~2주 전 예약을 권장해 드립니다. 특히 손 없는 날이나 주말, 월말의 경우 마감이 빨리 진행되므로 여유 있게 예약 상담을 등록해 주시면 감사하겠습니다.'
  },
  {
    id: 'faq-2',
    question: '청소 시간은 얼마나 걸리나요?',
    answer: '건물의 면적이나 오염도에 따라 상이하지만 기본적으로 20~30평대 아파트 기준 4~5시간 정도 소요됩니다. 꼼꼼희는 시간에 구애받지 않고 오염도가 심한 부위를 철저히 세척 및 검수하는 것을 원칙으로 합니다.'
  },
  {
    id: 'faq-3',
    question: '친환경 세제와 고온스팀 살균은 추가금이 있나요?',
    answer: '아닙니다! 꼼꼼희는 가족 구성원의 건강과 친환경 라이프를 위해 추가 요금 없이 100% 천연 및 안전 인증 환경 세제를 기본 사용합니다. 주방/욕실 기본 99.9% 초고온 스팀 안심 살균 서비스도 기본 패키지에 전액 무상 포함되어 있습니다.'
  },
  {
    id: 'faq-4',
    question: '청소 인원은 몇 명이 오나요? 하청 팀인가요?',
    answer: '꼼꼼희는 본사 소속 정규 전문 마스터들이 직접 팀을 이루어 배정됩니다. 하청 및 유료 중개 수수료가 일절 없어 신뢰할 수 있으며, 주거 평형에 맞추어 기본 2~4명의 전문 직영 팀원들이 파트너와 함께 팀장 인솔 하에 꼼꼼하게 시공합니다.'
  },
  {
    id: 'faq-5',
    question: '청소 후 마음에 안 들면 피드백이나 A/S가 가능한가요?',
    answer: '네, 전적 보장합니다! 시공 완료 단계에서 반드시 고객님과 동석하여 고품격 대면 검수를 전체 한 바퀴 진행합니다. 미진한 부분이 즉석에서 발견될 시 즉각 현장 보강 조치하며, 검수 후 복귀한 이후라도 7일 이내 보강 문제 발생 시 책임적인 철저 처리를 보상해 드립니다.'
  },
  {
    id: 'faq-6',
    question: '전체 소독(피톤치드)은 정말 서비스인가요?',
    answer: '네, 현재 진행 중인 한정 광고 프로모션 신청 기간 내에 예약을 접수해 주신 모든 분께 실내 공기 안심 환기(새집증후군, 미세먼지 입자 탈취)를 위한 이탈리아식 피톤치드 오일 초미립자 분무 살균 시공(정가 15만원 이내)을 전액 무료로 책임 서비스해 드립니다.'
  }
];

export const BEFORE_AFTER_ITEMS: BeforeAfterItem[] = [
  {
    id: 'ba-1',
    category: '주방 찌든 때 & 환풍기',
    title: '가스레인지 후드 및 주방 기름때 박멸',
    beforeImg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600&blur=3',
    afterImg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600',
    desc: '기름때로 누렇게 찌든 가스레인지 필터와 주방 가벽의 눌어붙은 그을음을 친환경 천연 전용 세제와 초고온 직수형 스팀으로 메탈릭 화이트 본래의 고운 빛으로 복구해 드립니다.'
  },
  {
    id: 'ba-2',
    category: '욕실 곰팡이 & 논슬립',
    title: '화장실 물때 및 타일 줄눈 정화',
    beforeImg: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600&blur=3',
    afterImg: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
    desc: '배수구 내부 머리카락 점막, 변기 안쪽 누런 요석, 거울 및 파티션 샤워 부스의 뿌연 석회질 백화 현상까지 깔끔하게 제거하여 반짝이는 욕호텔 상태를 유지해 드립니다.'
  },
  {
    id: 'ba-3',
    category: '베란다 & 세시 창틀',
    title: '베란다 창틀 틈새 미세먼지 박멸',
    beforeImg: 'https://images.unsplash.com/photo-1603796846097-bee99e4a60c9?auto=format&fit=crop&q=80&w=600&blur=3',
    afterImg: 'https://images.unsplash.com/photo-1603796846097-bee99e4a60c9?auto=format&fit=crop&q=80&w=600',
    desc: '수년간 비바람과 외부 매연으로 온통 시꺼멓게 뒤덮여 있던 하단 레일 좁은 창문 구석구석을 강력 고성능 분사 진공 흡입 및 고온 스팀 습식 세척으로 하얗게 본연 복원 시킵니다.'
  },
  {
    id: 'ba-4',
    category: '바닥 스파클 크리닝',
    title: '거실 마루 틈새 및 오염물 딥클렌징',
    beforeImg: 'https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&q=80&w=600&blur=3',
    afterImg: 'https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&q=80&w=600',
    desc: '공사 잔여 가루, 페인트 및 도배 풀 자국, 미세 도포 정전기 먼지 필름을 안전 무해 살균 원액과 정밀 마찰 분당 회전 클리너 장비를 사용해 자극 없이 투명하게 건조 딥케어합니다.'
  }
];

export const SAMPLE_REGIONS = [
  '서울 마포구', '서울 강남구', '서울 송파구', '서울 서초구', '서울 강서구',
  '경기 성남 분당구', '경기 수원 영통구', '경기 일산동구', '경기 안양 동안구',
  '인천 연수구 송도', '서울 성동구', '경기 용인 수지구', '부산 해운대구',
  '대구 수성구', '대전 유성구', '광주 광산구', '울산 남구', '경기 하남 미사'
];

export const SAMPLE_NAMES = [
  '김*진', '이*호', '박*현', '최*우', '정*윤', '한*수', '오*희', '신*민', '임*주', '송*석', '조*아', '윤*원'
];

export const MOCK_ROLLING_EVENTS: RollingEvent[] = [
  { id: 're-1', name: '김*현', region: '서울 마포구', cleaningType: '입주청소', pyung: 34, timeText: '방금 전', status: '접수완료' },
  { id: 're-2', name: '박*서', region: '경기 성남 분당구', cleaningType: '이사청소', pyung: 24, timeText: '2분 전', status: '상담중' },
  { id: 're-3', name: '이*민', region: '서울 강남구', cleaningType: '입주청소', pyung: 42, timeText: '5분 전', status: '배정완료' },
  { id: 're-4', name: '최*호', region: '인천 연수구 송도', cleaningType: '상가/사무실', pyung: 58, timeText: '11분 전', status: '청소완료' },
  { id: 're-5', name: '한*지', region: '경기 하남 미사', cleaningType: '이사청소', pyung: 32, timeText: '15분 전', status: '접수완료' },
  { id: 're-6', name: '윤*준', region: '서울 서초구', cleaningType: '거주청소', pyung: 28, timeText: '22분 전', status: '배정완료' },
  { id: 're-7', name: '정*은', region: '경기 수원 영통구', cleaningType: '입주청소', pyung: 30, timeText: '28분 전', status: '상담중' },
  { id: 're-8', name: '오*영', region: '서울 성동구', cleaningType: '가전/에어컨', pyung: 15, timeText: '35분 전', status: '청소완료' },
  { id: 're-9', name: '임*혁', region: '부산 해운대구', cleaningType: '입주청소', pyung: 38, timeText: '40분 전', status: '접수완료' }
];

export const INITIAL_LEADS: any[] = [
  {
    id: 'lead-1',
    name: '김정우',
    phone: '010-4821-3991',
    cleaningType: '입주청소',
    pyung: 34,
    preferredDate: '2026-07-01',
    status: '신규',
    memo: '새집 증후군 소독(피톤치드 무료 서비스) 적용 대상 희망. 오전에 일찍 청소 시작 가능한지 확인 부탁드립니다.',
    createdAt: '2026-06-21T18:34:02'
  },
  {
    id: 'lead-2',
    name: '이지현',
    phone: '010-9182-4112',
    cleaningType: '이사청소',
    pyung: 24,
    preferredDate: '2026-06-29',
    status: '상담중',
    memo: '대면검수 확인 필수. 물때와 오염도가 심해서 주방 가스레인지만 특별 살균 소독 부탁드려요.',
    createdAt: '2026-06-21T14:15:30'
  },
  {
    id: 'lead-3',
    name: '박민석',
    phone: '010-3882-9981',
    cleaningType: '상가/사무실',
    pyung: 55,
    preferredDate: '2026-07-10',
    status: '예약완료',
    memo: '사무실 바닥 왁스코팅 별도 유료 상품 추가 계약 협의 완료. 꼼꼼한 마감 체크 요청.',
    createdAt: '2026-06-20T11:05:44'
  }
];
