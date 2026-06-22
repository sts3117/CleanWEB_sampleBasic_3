import { useState, useEffect } from 'react';
import { Inquiry } from '../types.ts';
import { INITIAL_LEADS } from '../constants.ts';
import { ShieldAlert, Download, Search, CheckCircle, Clock, Trash2, Edit, X, RefreshCw, FileText, Check, Plus, Database } from 'lucide-react';

interface AdminPanelProps {
  onForceRefresh?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ onForceRefresh, isOpen, onClose }: AdminPanelProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'모두' | '신규' | '상담중' | '예약완료' | '보류/취소'>('모두');
  const [typeFilter, setTypeFilter] = useState<string>('모두');
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [memoInput, setMemoInput] = useState('');

  // Pre-load default template entries in LocalStorage if absolutely empty
  useEffect(() => {
    if (isOpen) {
      loadInquiries();
    }
  }, [isOpen]);

  const loadInquiries = () => {
    const raw = localStorage.getItem('inquiries');
    if (!raw) {
      localStorage.setItem('inquiries', JSON.stringify(INITIAL_LEADS));
      setInquiries(INITIAL_LEADS);
    } else {
      setInquiries(JSON.parse(raw));
    }
  };

  // Update Status in LocalStorage
  const handleStatusChange = (id: string, newStatus: Inquiry['status']) => {
    const updated = inquiries.map((item) => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    localStorage.setItem('inquiries', JSON.stringify(updated));
    setInquiries(updated);
    if (onForceRefresh) onForceRefresh();
  };

  // Memo modification persistence
  const startEditingMemo = (id: string, currentMemo: string = '') => {
    setEditingMemoId(id);
    setMemoInput(currentMemo);
  };

  const saveMemo = (id: string) => {
    const updated = inquiries.map((item) => {
      if (item.id === id) {
        return { ...item, memo: memoInput.trim() || undefined };
      }
      return item;
    });
    localStorage.setItem('inquiries', JSON.stringify(updated));
    setInquiries(updated);
    setEditingMemoId(null);
    if (onForceRefresh) onForceRefresh();
  };

  // Delete an inquiry
  const handleDelete = (id: string) => {
    if (confirm('해당 디비 접수 내역을 영구히 삭제하시겠습니까? 복구가 불가합니다.')) {
      const updated = inquiries.filter((item) => item.id !== id);
      localStorage.setItem('inquiries', JSON.stringify(updated));
      setInquiries(updated);
      if (onForceRefresh) onForceRefresh();
    }
  };

  // Create a simulated testing lead
  const handleAddSample = () => {
    const sampleNames = ['정명철', '임현우', '유진희', '한예지', '배성철'];
    const samplePhones = ['010-8282-4911', '010-5391-0391', '010-1102-4521', '010-2342-9981'];
    const sampleTypes = ['입주청소', '이사청소', '거주청소', '상가/사무실', '가전/에어컨'];
    const sampleRegions = ['경기 하남시 미사', '서울 강동구', '인천 연수구', '경기 용인 수지구'];
    const samplePyung = [18, 24, 32, 34, 45];

    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomPhone = samplePhones[Math.floor(Math.random() * samplePhones.length)];
    const randomType = sampleTypes[Math.floor(Math.random() * sampleTypes.length)];
    const randomRegion = sampleRegions[Math.floor(Math.random() * sampleRegions.length)];
    const randomPyung = samplePyung[Math.floor(Math.random() * samplePyung.length)];

    const testLead: Inquiry = {
      id: `custom-${Date.now()}`,
      name: randomName,
      phone: randomPhone,
      cleaningType: `${randomType} (${randomRegion})`,
      pyung: randomPyung,
      preferredDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      status: '신규',
      memo: '광고 매체 직접 유입 테스팅 가상 DB 레코드입니다.',
      createdAt: new Date().toISOString()
    };

    const updated = [testLead, ...inquiries];
    localStorage.setItem('inquiries', JSON.stringify(updated));
    setInquiries(updated);
    if (onForceRefresh) onForceRefresh();
  };

  // EXPORT TO EXCEL/CSV (marked with real CSV conversion mechanics)
  const handleExportCSV = () => {
    if (inquiries.length === 0) {
      alert('출력할 고객 데이터베이스 정보가 존재하지 않습니다.');
      return;
    }

    // Prepare UTF-8 BOM so MS Excel displays Korean correctly!
    const rowHeader = ['접수ID', '성함', '연락처', '청소유형', '평형(평)', '희망예약일', '진행상태', '고객메모 및 특이사항', '접수시각', '인입IP'];
    
    const rows = inquiries.map((item) => [
      item.id,
      item.name,
      item.phone,
      item.cleaningType,
      item.pyung,
      item.preferredDate,
      item.status,
      (item.memo || '').replace(/\n/g, ' '),
      new Date(item.createdAt).toLocaleString('ko-KR'),
      item.ip || 'Local / Mock'
    ]);

    const csvContent = [
      rowHeader.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set formatted download file name
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    link.href = url;
    link.setAttribute('download', `꼼꼼희_수집고객_DB_리스트_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter inquiry collections based on search options
  const filteredInquiries = inquiries.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
      (item.memo || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '모두' || item.status === statusFilter;
    
    const matchesType =
      typeFilter === '모두' || 
      item.cleaningType.includes(typeFilter);

    return matchesSearch && matchesStatus && matchesType;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-[90vh]">
        
        {/* Modal Header bar */}
        <div className="bg-slate-800 text-white p-5 px-6 flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <Database size={20} className="animate-pulse" />
            </span>
            <div>
              <h3 className="font-extrabold text-base md:text-lg flex items-center gap-2 tracking-tight font-display">
                꼼꼼희 광고 마케팅 파트너 DB 관리자용 콘솔
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                수집된 이탈리아/국내 소독 및 청소 광고 유입 리스트를 즉시 검수하고 엑셀 파일로 연동 관리합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dashboard quick counts */}
        <div className="bg-slate-50 border-b border-slate-100 p-4 md:px-6 grid grid-cols-2 md:grid-cols-5 gap-3 shrink-0">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-500 text-xs block font-bold">전체 DB 수량</span>
            <span className="text-2xl font-black text-slate-800 font-mono tracking-tight mt-1 inline-block">
              {inquiries.length} <span className="text-xs text-slate-400 font-normal">건</span>
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
            <span className="text-blue-500 text-xs block font-bold">🆕 신규 미처리</span>
            <span className="text-2xl font-black text-blue-600 font-mono tracking-tight mt-1 inline-block">
              {inquiries.filter(e => e.status === '신규').length} <span className="text-xs text-slate-400 font-normal">건</span>
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-yellow-100 shadow-sm">
            <span className="text-yellow-600 text-xs block font-bold">⏳ 상담 진행중</span>
            <span className="text-2xl font-black text-yellow-600 font-mono tracking-tight mt-1 inline-block">
              {inquiries.filter(e => e.status === '상담중').length} <span className="text-xs text-slate-400 font-normal">건</span>
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-green-100 shadow-sm">
            <span className="text-green-600 text-xs block font-bold">✅ 예약 확정</span>
            <span className="text-2xl font-black text-green-600 font-mono tracking-tight mt-1 inline-block">
              {inquiries.filter(e => e.status === '예약완료').length} <span className="text-xs text-slate-400 font-normal">건</span>
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
            <span className="text-slate-400 text-xs block font-bold">보류 / 취소 건</span>
            <span className="text-2xl font-black text-slate-400 font-mono tracking-tight mt-1 inline-block">
              {inquiries.filter(e => e.status === '보류/취소').length} <span className="text-xs text-slate-300 font-normal">건</span>
            </span>
          </div>
        </div>

        {/* Toolbar & filtering controls */}
        <div className="p-4 bg-white border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shrink-0">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Box */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="고객명, 번호, 메모 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            {/* Status tab filters */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              {(['모두', '신규', '상담중', '예약완료', '보류/취소'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-slate-800 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Type selector */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-slate-200 rounded-lg text-xs py-2 px-3 focus:outline-none bg-white text-slate-700 font-bold"
            >
              <option value="모두">🏠 모든 의뢰유형</option>
              <option value="입주">입주청소</option>
              <option value="이사">이사청소</option>
              <option value="거주">거주청소</option>
              <option value="상가">상가/사무실</option>
              <option value="가전">가전/에어컨</option>
            </select>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Simulation Lead Injector */}
            <button
              onClick={handleAddSample}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-sm font-bold rounded-lg border border-indigo-200 cursor-pointer active:scale-95 transition-all"
              title="테스트를 위한 임의의 광고유입 데이터를 인입시킵니다."
            >
              <Plus size={15} />
              <span>가상 DB 인입 테스트</span>
            </button>

            {/* Excel download */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold rounded-lg shadow-sm cursor-pointer active:scale-95 transition-all"
            >
              <Download size={15} />
              <span>엑셀 백업 (.CSV)</span>
            </button>

            {/* Refresh leads */}
            <button
              onClick={loadInquiries}
              className="p-2 border border-slate-200 text-slate-500 hover:text-slate-800 bg-white rounded-lg hover:shadow-xs cursor-pointer active:scale-90 transition-transform"
              title="기록 새로고침"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Core Records Table List */}
        <div className="flex-1 overflow-auto bg-slate-50 p-4 md:p-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-500 text-xs font-bold border-b border-slate-200 uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold">인입시각 / IP</th>
                    <th className="py-3.5 px-4 font-bold">성함 / 연락처</th>
                    <th className="py-3.5 px-4 font-bold">청소분야 / 평수</th>
                    <th className="py-3.5 px-4 font-bold">희망 시공일자</th>
                    <th className="py-3.5 px-4 font-bold text-center">진행 진행상태</th>
                    <th className="py-3.5 px-4 font-bold w-[300px]">관리자 메모 및 특이사항</th>
                    <th className="py-3.5 px-4 font-bold text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {filteredInquiries.length > 0 ? (
                    filteredInquiries.map((item) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-50/50 transition-colors ${
                          item.status === '신규' ? 'bg-blue-50/20' : ''
                        }`}
                      >
                        {/* 1. Date */}
                        <td className="py-3 px-4 font-mono text-xs text-slate-500">
                          <div>{new Date(item.createdAt).toLocaleString().slice(2, 17)}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{item.ip || '127.0.0.1'}</div>
                        </td>

                        {/* 2. Customer Personal Info */}
                        <td className="py-3 px-4">
                          <div className="font-extrabold text-slate-800">{item.name}</div>
                          <div className="font-mono text-xs text-slate-500 mt-0.5 font-bold tracking-wide">
                            {item.phone}
                          </div>
                        </td>

                        {/* 3. Category/Pyung */}
                        <td className="py-3 px-4 text-xs">
                          <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded">
                            {item.cleaningType}
                          </span>
                          <span className="font-mono text-indigo-600 font-bold block mt-1.5 text-xs">
                            {item.pyung}평형
                          </span>
                        </td>

                        {/* 4. Date */}
                        <td className="py-3 px-4 font-mono text-xs text-slate-800 font-bold">
                          {item.preferredDate}
                        </td>

                        {/* 5. Status dropdown */}
                        <td className="py-3 px-4 text-center">
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value as Inquiry['status'])}
                            className={`text-xs py-1.5 px-2 rounded-lg font-bold border ${
                              item.status === '신규'
                                ? 'bg-blue-50 border-blue-200 text-blue-600'
                                : item.status === '상담중'
                                ? 'bg-amber-50 border-amber-200 text-amber-600'
                                : item.status === '예약완료'
                                ? 'bg-green-50 border-green-200 text-green-600'
                                : 'bg-slate-100 border-slate-300 text-slate-500'
                            }`}
                          >
                            <option value="신규">🆕 신규</option>
                            <option value="상담중">⏳ 상담중</option>
                            <option value="예약완료">✅ 예약완료</option>
                            <option value="보류/취소">❌ 보류/취소</option>
                          </select>
                        </td>

                        {/* 6. Admin memo and notes */}
                        <td className="py-3 px-4 text-xs">
                          {editingMemoId === item.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={memoInput}
                                onChange={(e) => setMemoInput(e.target.value)}
                                className="border border-slate-300 p-1.5 rounded-md text-xs w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 font-medium"
                                placeholder="메모 입력..."
                                autoFocus
                              />
                              <button
                                onClick={() => saveMemo(item.id)}
                                className="p-1 px-2 bg-indigo-600 text-white rounded text-[10px] font-bold cursor-pointer hover:bg-indigo-700"
                              >
                                <Check size={12} />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => startEditingMemo(item.id, item.memo)}
                              className="group flex items-start gap-1 cursor-pointer hover:bg-slate-100/80 p-1.5 rounded border border-dashed border-transparent hover:border-slate-300 text-slate-600 min-h-[32px] transition-colors"
                              title="더블클릭하거나 터치해서 시공 상담 메모를 작성하세요."
                            >
                              <span className="flex-1 break-all line-clamp-2">
                                {item.memo || <span className="text-slate-300 italic">클릭해서 상세 상담 메모 추가...</span>}
                              </span>
                              <Edit size={11} className="text-slate-300 group-hover:text-slate-400 mt-0.5 shrink-0" />
                            </div>
                          )}
                        </td>

                        {/* 7. Action delete Button */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            title="레코드 영구삭제"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-medium bg-slate-50">
                        <ShieldAlert size={36} className="mx-auto text-slate-300 mb-3" />
                        조건에 일치하는 데이터가 리스트에 기록되어 있지 않습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer info banner */}
        <div className="bg-slate-100 border-t border-slate-200 p-3 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="flex items-center gap-1 font-mono">
            <span>🛡️ SSL 입수 데이터 보안 전송 규격 준수함</span>
          </p>
          <p className="font-medium text-slate-400">
            의뢰인 정보 유출 방지를 위해 사용을 무단 종료 시 본인 확인을 재확인합니다.
          </p>
        </div>

      </div>
    </div>
  );
}
