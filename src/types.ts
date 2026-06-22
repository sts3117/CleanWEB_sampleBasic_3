export type CleaningType = 'move-in' | '이사' | '거주_resident' | '상가_office' | '가전_appliance';

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  cleaningType: string;
  pyung: number;
  preferredDate: string;
  status: '신규' | '상담중' | '예약완료' | '보류/취소';
  memo?: string;
  createdAt: string;
  ip?: string; // Standard DB log detail
}

export interface RollingEvent {
  id: string;
  name: string;
  region: string;
  cleaningType: string;
  pyung: number;
  timeText: string;
  status: '접수완료' | '상담중' | '배정완료' | '청소완료';
}

export interface BeforeAfterItem {
  id: string;
  title: string;
  category: string;
  beforeImg: string;
  afterImg: string;
  desc: string;
}
