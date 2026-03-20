import { useState, useEffect } from 'react';

const PLAN_OPTIONS = [
  { key: 'chronic',  label: '만성질환 관리 교육함.', defaultOn: true },
  { key: 'diet',     label: '식이요법 교육함.',       defaultOn: false },
  { key: 'exercise', label: '운동요법 교육함.',       defaultOn: false },
  { key: 'smoking',  label: '금연 교육함.',           defaultOn: false },
  { key: 'alcohol',  label: '금주 교육함.',           defaultOn: false },
  { key: 'labCheck', label: '정기적 검사 안내함.',     defaultOn: false },
];

function buildInitial() {
  const checks = {};
  PLAN_OPTIONS.forEach(o => { checks[o.key] = o.defaultOn; });
  return checks;
}

function generatePText(checks, extraPlan) {
  const lines = PLAN_OPTIONS.filter(o => checks[o.key]).map(o => o.label);
  if (extraPlan.trim()) {
    extraPlan.trim().split('\n').forEach(line => {
      if (line.trim()) lines.push(line.trim());
    });
  }
  return lines.join('\n');
}

export default function PSection({ onChange }) {
  const [checks, setChecks] = useState(buildInitial);
  const [extraPlan, setExtraPlan] = useState('');

  function toggle(key) {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  }

  useEffect(() => {
    onChange?.(generatePText(checks, extraPlan));
  }, [checks, extraPlan, onChange]);

  return (
    <div className="space-y-3">
      {/* 체크박스 목록 */}
      <div className="space-y-1">
        {PLAN_OPTIONS.map(o => (
          <label
            key={o.key}
            className="flex items-center gap-2 py-0.5 px-2 rounded text-sm text-slate-700 cursor-pointer hover:bg-slate-50"
          >
            <input
              type="checkbox"
              checked={checks[o.key]}
              onChange={() => toggle(o.key)}
              className="accent-blue-600"
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>

      {/* 자유입력 */}
      <div>
        <label className="text-xs text-slate-500 block mb-1">추가 계획 (선택)</label>
        <input
          type="text"
          value={extraPlan}
          onChange={e => setExtraPlan(e.target.value)}
          placeholder="예: 다음 외래 3개월 후"
          className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
