'use client'
import { useState } from 'react'

function fmt(n: number): string {
  if (n >= 1e8) return (n / 1e8).toFixed(1) + '억'
  if (n >= 1e4) return (n / 1e4).toFixed(1) + '만'
  return n.toLocaleString()
}

export default function GMVSimulation() {
  const [gmv, setGmv] = useState(100)
  const [months, setMonths] = useState(3)
  const [unitPrice, setUnitPrice] = useState(200)
  const [cvr, setCvr] = useState(1)
  const [guestFee, setGuestFee] = useState(3)
  const [hostFee, setHostFee] = useState(7)

  const totalFeeRate = guestFee + hostFee
  const platformRevenuePerDeal = unitPrice * (totalFeeRate / 100)
  const guestActual = unitPrice * (1 + guestFee / 100)
  const hostActual = unitPrice * (1 - hostFee / 100)
  const totalDeals = (gmv * 1e8) / (unitPrice * 1e4)
  const monthlyDeals = Math.ceil(totalDeals / months)
  const monthlyVisitors = Math.ceil(monthlyDeals / (cvr / 100))
  const weeklyVisitors = Math.ceil(monthlyVisitors / 4)
  const monthlyRevenue = monthlyDeals * platformRevenuePerDeal * 1e4
  const monthlyRevenueAnnual = monthlyRevenue * 12
  const roomsNeeded = Math.ceil(monthlyDeals * 1.5)

  const SliderRow = ({ label, hint, value, min, max, step, color, unit, onChange }: {
    label: string, hint?: string, value: number, min: number, max: number,
    step: number, color: string, unit: string, onChange: (v: number) => void
  }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-gray-700">{label}</span>
          {hint && <span className="text-[10px] text-gray-400 ml-1.5">{hint}</span>}
        </div>
        <span className="text-sm font-black tabular-nums" style={{ color }}>{value.toLocaleString()}{unit}</span>
      </div>
      <div className="relative">
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gray-100"
          style={{ accentColor: color }} />
        <div className="flex justify-between text-[9px] text-gray-300 mt-0.5">
          <span>{min.toLocaleString()}{unit}</span><span>{max.toLocaleString()}{unit}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 p-8 text-white">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <p className="text-xs font-medium text-emerald-300 tracking-widest uppercase mb-2">GMV Target Simulation</p>
          <div className="flex items-end gap-3 mb-1">
            <h2 className="text-5xl font-black">{gmv}억</h2>
            <span className="text-emerald-300 text-lg mb-1.5">/ {months}개월 목표</span>
          </div>
          <p className="text-emerald-200 text-sm">슬라이더로 가정을 바꾸면 결과가 실시간으로 계산됩니다</p>
          <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/10">
            <div><p className="text-emerald-300 text-[10px] mb-0.5">평균 객단가</p><p className="font-bold text-lg">₩{unitPrice}만</p></div>
            <div><p className="text-emerald-300 text-[10px] mb-0.5">플랫폼 수익</p><p className="font-bold text-lg text-emerald-300">{fmt(monthlyRevenue * months)}</p></div>
            <div><p className="text-emerald-300 text-[10px] mb-0.5">총 수수료율</p><p className="font-bold text-lg">{totalFeeRate}%</p></div>
            <div><p className="text-emerald-300 text-[10px] mb-0.5">총 결제 건수</p><p className="font-bold text-lg">{Math.ceil(totalDeals).toLocaleString()}건</p></div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-5">
          {/* Left: Controls */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5 space-y-5">
            <p className="text-sm font-bold text-gray-900">가정 설정</p>
            <div className="space-y-4 pb-4 border-b border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">목표</p>
              <SliderRow label="목표 거래액 (GMV)" value={gmv} min={10} max={1000} step={10} color="#10b981" unit="억원" onChange={setGmv} />
              <SliderRow label="기간" hint={`월 ${Math.round(gmv/months)}억 기준`} value={months} min={1} max={24} step={1} color="#6366f1" unit="개월" onChange={setMonths} />
            </div>
            <div className="space-y-4 pb-4 border-b border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">단가 & 전환</p>
              <SliderRow label="평균 객단가" hint="임대료 기준 직접 설정" value={unitPrice} min={50} max={2000} step={50} color="#8b5cf6" unit="만원" onChange={setUnitPrice} />
              <SliderRow label="전환율 (방문 → 계약)" value={cvr} min={0.1} max={5} step={0.1} color="#f59e0b" unit="%" onChange={setCvr} />
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">수수료 구조</p>
              <SliderRow label="게스트 수수료" hint="게스트가 추가 부담" value={guestFee} min={0} max={15} step={0.5} color="#3b82f6" unit="%" onChange={setGuestFee} />
              <SliderRow label="호스트 수수료" hint="호스트 수익에서 차감" value={hostFee} min={0} max={20} step={0.5} color="#ec4899" unit="%" onChange={setHostFee} />
              <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 text-[11px]">
                <div className="flex justify-between"><span className="text-gray-500">게스트 실 부담액</span><span className="font-bold text-blue-600">₩{guestActual.toFixed(0)}만/건</span></div>
                <div className="flex justify-between"><span className="text-gray-500">호스트 실 수취액</span><span className="font-bold text-pink-600">₩{hostActual.toFixed(0)}만/건</span></div>
                <div className="flex justify-between border-t border-gray-200 pt-1.5"><span className="text-gray-700 font-bold">플랫폼 수익/건</span><span className="font-black text-emerald-600">₩{platformRevenuePerDeal.toFixed(0)}만</span></div>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="col-span-3 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '월 결제 건수', value: monthlyDeals.toLocaleString() + '건', sub: `${months}개월 기준 / 월`, color: '#6366f1', bg: '#eef2ff', border: 'rgba(99,102,241,0.19)' },
                { label: '필요 월 방문자', value: fmt(monthlyVisitors) + '명', sub: `전환율 ${cvr}% / 주 ${fmt(weeklyVisitors)}명`, color: '#ef4444', bg: '#fef2f2', border: 'rgba(239,68,68,0.19)' },
                { label: '월 플랫폼 수익', value: '₩' + fmt(monthlyRevenue), sub: '연 환산 ₩' + fmt(monthlyRevenueAnnual), color: '#10b981', bg: '#f0fdf4', border: 'rgba(16,185,129,0.19)' },
                { label: '필요 동시 입주 호실', value: roomsNeeded.toLocaleString() + '호+', sub: '현재 489호 대비 ' + (roomsNeeded / 489).toFixed(1) + '배', color: '#f59e0b', bg: '#fffbeb', border: 'rgba(245,158,11,0.19)' },
              ].map((item, i) => (
                <div key={i} className="rounded-xl border-2 p-4" style={{ borderColor: item.border, background: item.bg }}>
                  <p className="text-[10px] text-gray-500 font-medium">{item.label}</p>
                  <p className="text-2xl font-black mt-1" style={{ color: item.color }}>{item.value}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Funnel */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-bold text-gray-900 mb-3">월 트래픽 → 결제 퍼널</p>
              <div className="space-y-2">
                {[
                  { label: '월 방문자', value: fmt(monthlyVisitors) + '명', pct: 100, color: '#6366f1' },
                  { label: '매물 조회 (30%)', value: fmt(Math.ceil(monthlyVisitors * 0.3)) + '명', pct: 30, color: '#3b82f6' },
                  { label: '상담/문의 (10%)', value: Math.ceil(monthlyVisitors * 0.03).toLocaleString() + '명', pct: 4, color: '#10b981' },
                  { label: '계약 완료', value: monthlyDeals.toLocaleString() + '명', pct: 4, color: '#f59e0b' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-28 text-right shrink-0"><span className="text-[10px] font-medium text-gray-500">{row.label}</span></div>
                    <div className="flex-1 h-9 bg-gray-100 rounded-lg overflow-hidden">
                      <div className="h-full flex items-center px-3 rounded-lg text-white text-[11px] font-bold"
                        style={{ width: row.pct + '%', background: row.color, minWidth: 48 }}>{row.value}</div>
                    </div>
                    {i < 3 && <span className="text-[10px] text-gray-300 shrink-0">↓</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Gap Analysis */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-800 mb-3">💡 지금 상태와의 갭</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: '🏠', label: '호실', current: '489호', target: roomsNeeded.toLocaleString() + '호+' },
                  { icon: '👥', label: '월 방문자', current: '미집계', target: fmt(monthlyVisitors) + '명' },
                  { icon: '⚙️', label: '전환율', current: '미측정', target: cvr + '%' },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 border border-amber-100">
                    <div className="text-lg mb-1">{item.icon} {item.label}</div>
                    <div className="text-[10px] text-gray-400">현재 <span className="font-bold text-gray-600">{item.current}</span></div>
                    <div className="text-[10px] text-gray-400">목표 <span className="font-bold text-amber-600">{item.target}</span></div>
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
