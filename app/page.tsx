'use client'
import { useState } from 'react'

function fmt(n: number): string {
  if (n >= 1e8) return (n / 1e8).toFixed(1) + '억'
  if (n >= 1e4) return (n / 1e4).toFixed(1) + '만'
  return n.toLocaleString()
}

export default function GMVSimulation() {
  const [gmv, setGmv] = useState(100)           // 억원
  const [months, setMonths] = useState(3)
  const [unitPrice, setUnitPrice] = useState(300) // 만원
  const [cvr, setCvr] = useState(1)              // %
  const [guestFee, setGuestFee] = useState(3)    // %
  const [hostFee, setHostFee] = useState(7)      // %

  // 계산
  const totalFeeRate = guestFee + hostFee
  const guestActual = unitPrice * (1 + guestFee / 100)
  const hostActual = unitPrice * (1 - hostFee / 100)
  const platformPerDeal = unitPrice * (totalFeeRate / 100)
  const totalDeals = Math.ceil((gmv * 1e8) / (unitPrice * 1e4))
  const monthlyDeals = Math.ceil(totalDeals / months)
  const monthlyVisitors = Math.ceil(monthlyDeals / (cvr / 100))
  const weeklyVisitors = Math.ceil(monthlyVisitors / 4)
  const monthlyRevenue = monthlyDeals * platformPerDeal * 1e4
  const totalRevenue = monthlyRevenue * months
  const roomsNeeded = Math.ceil(monthlyDeals * 1.5)
  const roomMultiple = (roomsNeeded / 489).toFixed(1)

  // 퍼널
  const fView = Math.ceil(monthlyVisitors * 0.3)
  const fConsult = Math.ceil(fView * 0.1)

  const SliderRow = ({
    label, hint, value, min, max, step, color, unit, onChange,
  }: {
    label: string; hint?: string; value: number; min: number; max: number;
    step: number; color: string; unit: string; onChange: (v: number) => void;
  }) => (
    <div className="space-y-1">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-gray-700">{label}</span>
          {hint && <span className="text-[10px] text-gray-400 ml-1.5">{hint}</span>}
        </div>
        <span className="text-sm font-black tabular-nums" style={{ color }}>{value.toLocaleString()}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-200"
        style={{ accentColor: color }}
      />
      <div className="flex justify-between text-[9px] text-gray-400">
        <span>{min.toLocaleString()}{unit}</span>
        <span>{max.toLocaleString()}{unit}</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* ── 헤더 배너 ── */}
        <div className="relative overflow-hidden rounded-2xl p-8 text-white"
          style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #0f766e 100%)' }}>
          {/* 장식 원 */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #6ee7b7, transparent)' }} />
          <div className="absolute top-4 right-8 w-32 h-32 rounded-full opacity-5 bg-white" />

          <p className="text-[10px] font-semibold tracking-[0.2em] text-emerald-300 uppercase mb-2">
            GMV TARGET SIMULATION
          </p>
          <div className="flex items-end gap-3 mb-1">
            <h1 className="text-5xl font-black">{gmv}억</h1>
            <span className="text-emerald-200 text-lg mb-2">/ {months}개월 목표</span>
          </div>
          <p className="text-emerald-300 text-sm mb-6">슬라이더로 가정을 바꾸면 결과가 실시간으로 계산됩니다</p>

          <div className="grid grid-cols-4 gap-6 pt-5 border-t border-white/10">
            <div>
              <p className="text-[10px] text-emerald-400 mb-1">평균 객단가</p>
              <p className="text-xl font-bold">₩{unitPrice}만</p>
            </div>
            <div>
              <p className="text-[10px] text-emerald-400 mb-1">플랫폼 수익</p>
              <p className="text-xl font-bold text-emerald-300">₩{fmt(totalRevenue)}</p>
            </div>
            <div>
              <p className="text-[10px] text-emerald-400 mb-1">총 수수료율</p>
              <p className="text-xl font-bold">{totalFeeRate}%</p>
            </div>
            <div>
              <p className="text-[10px] text-emerald-400 mb-1">총 결제 건수</p>
              <p className="text-xl font-bold">{totalDeals.toLocaleString()}건</p>
            </div>
          </div>
        </div>

        {/* ── 본문 ── */}
        <div className="grid grid-cols-5 gap-5">

          {/* 왼쪽: 가정 설정 */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5 space-y-5">
            <p className="text-sm font-bold text-gray-900">가정 설정</p>

            {/* 목표 */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">목표</p>
              <SliderRow
                label="목표 거래액 (GMV)" value={gmv} min={10} max={1000} step={10}
                color="#10b981" unit="억원" onChange={setGmv}
              />
              <SliderRow
                label="기간" hint={`월 ${Math.round(gmv / months)}억 기준`}
                value={months} min={1} max={24} step={1}
                color="#6366f1" unit="개월" onChange={setMonths}
              />
            </div>

            <div className="border-t border-gray-100" />

            {/* 단가 & 전환 */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">단가 &amp; 전환</p>
              <SliderRow
                label="평균 객단가" hint="임대료 기준 직접 설정"
                value={unitPrice} min={50} max={2000} step={50}
                color="#8b5cf6" unit="만원" onChange={setUnitPrice}
              />
              <SliderRow
                label="전환율 (방문 → 계약)"
                value={cvr} min={0.1} max={5} step={0.1}
                color="#f59e0b" unit="%" onChange={setCvr}
              />
            </div>

            <div className="border-t border-gray-100" />

            {/* 수수료 구조 */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">수수료 구조</p>
              <SliderRow
                label="게스트 수수료" hint="게스트가 추가 부담"
                value={guestFee} min={0} max={15} step={0.5}
                color="#3b82f6" unit="%" onChange={setGuestFee}
              />
              <SliderRow
                label="호스트 수수료" hint="호스트 수익에서 차감"
                value={hostFee} min={0} max={20} step={0.5}
                color="#ec4899" unit="%" onChange={setHostFee}
              />
              <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">게스트 실 부담액</span>
                  <span className="font-bold text-blue-600">₩{guestActual.toFixed(0)}만/건</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">호스트 실 수취액</span>
                  <span className="font-bold text-pink-600">₩{hostActual.toFixed(0)}만/건</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-gray-200">
                  <span className="font-bold text-gray-700">플랫폼 수익/건</span>
                  <span className="font-black text-emerald-600">₩{platformPerDeal.toFixed(0)}만</span>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 결과 */}
          <div className="col-span-3 space-y-4">

            {/* KPI 카드 4개 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-5 border" style={{ background: '#f0f0ff', borderColor: 'rgba(99,102,241,0.2)' }}>
                <p className="text-[10px] text-gray-500 font-medium mb-1">월 결제 건수</p>
                <p className="text-3xl font-black" style={{ color: '#6366f1' }}>{monthlyDeals.toLocaleString()}건</p>
                <p className="text-[10px] text-gray-400 mt-1">{months}개월 기준 / 월</p>
              </div>
              <div className="rounded-xl p-5 border" style={{ background: '#fff0f0', borderColor: 'rgba(239,68,68,0.2)' }}>
                <p className="text-[10px] text-gray-500 font-medium mb-1">필요 월 방문자</p>
                <p className="text-3xl font-black" style={{ color: '#ef4444' }}>{fmt(monthlyVisitors)}명</p>
                <p className="text-[10px] text-gray-400 mt-1">전환율 {cvr}% / 주 {fmt(weeklyVisitors)}명</p>
              </div>
              <div className="rounded-xl p-5 border" style={{ background: '#f0fdf4', borderColor: 'rgba(16,185,129,0.2)' }}>
                <p className="text-[10px] text-gray-500 font-medium mb-1">월 플랫폼 수익</p>
                <p className="text-3xl font-black" style={{ color: '#10b981' }}>₩{fmt(monthlyRevenue)}</p>
                <p className="text-[10px] text-gray-400 mt-1">연 환산 ₩{fmt(monthlyRevenue * 12)}</p>
              </div>
              <div className="rounded-xl p-5 border" style={{ background: '#fffbeb', borderColor: 'rgba(245,158,11,0.2)' }}>
                <p className="text-[10px] text-gray-500 font-medium mb-1">필요 동시 입주 호실</p>
                <p className="text-3xl font-black" style={{ color: '#f59e0b' }}>{roomsNeeded.toLocaleString()}호+</p>
                <p className="text-[10px] text-gray-400 mt-1">현재 489호 대비 {roomMultiple}배</p>
              </div>
            </div>

            {/* 퍼널 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-bold text-gray-800 mb-4">월 트래픽 → 결제 퍼널</p>
              <div className="space-y-2.5">
                {[
                  { label: '월 방문자', val: monthlyVisitors, display: fmt(monthlyVisitors) + '명', color: '#6366f1', pct: 100 },
                  { label: '매물 조회 (30%)', val: fView, display: fmt(fView) + '명', color: '#3b82f6', pct: 30 },
                  { label: '상담/문의 (10%)', val: fConsult, display: fConsult.toLocaleString() + '명', color: '#14b8a6', pct: Math.max((fConsult / monthlyVisitors) * 100, 3) },
                  { label: '계약 완료', val: monthlyDeals, display: monthlyDeals.toLocaleString() + '명', color: '#f59e0b', pct: Math.max((monthlyDeals / monthlyVisitors) * 100, 3) },
                ].map((row, i, arr) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-500 w-28 text-right shrink-0">{row.label}</span>
                    <div className="flex-1 h-9 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="h-full flex items-center px-3 rounded-lg text-white text-[11px] font-bold transition-all duration-300"
                        style={{ width: row.pct + '%', background: row.color, minWidth: 56 }}
                      >
                        {row.display}
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <span className="text-[10px] text-gray-300 shrink-0">↓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 갭 분석 */}
            <div className="rounded-xl border border-amber-200 p-4" style={{ background: '#fffbeb' }}>
              <p className="text-xs font-bold text-amber-800 mb-3">💡 지금 상태와의 갭</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '🏠', label: '호실', current: '489호', target: roomsNeeded.toLocaleString() + '호+' },
                  { icon: '👥', label: '월 방문자', current: '미집계', target: fmt(monthlyVisitors) + '명' },
                  { icon: '⚙️', label: '전환율', current: '미측정', target: cvr + '%' },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-lg p-3 border border-amber-100 text-center">
                    <p className="text-base mb-1">{item.icon} <span className="text-xs font-bold text-gray-700">{item.label}</span></p>
                    <p className="text-[10px] text-gray-400">현재 <span className="font-bold text-gray-600">{item.current}</span></p>
                    <p className="text-[10px] text-gray-400">목표 <span className="font-bold text-amber-600">{item.target}</span></p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
