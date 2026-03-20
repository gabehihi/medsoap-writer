import { useState, useEffect } from 'react';

const PLAN_OPTIONS = [
  { key: 'antibiotics', label: '항생제 포함하여 약물 복용.', defaultOn: false },
  { key: 'revisit',     label: '호전 없거나 증상 악화 시 재내원.', defaultOn: true },
  { key: 'hydration',   label: '적절한 수분 섭취 격려.', defaultOn: true },
];

function buildInitial() {
  const checks = {};
  PLAN_OPTIONS.forEach(o => { checks[o.key] = o.defaultOn; });
  return checks;
}

function generatePText(checks, extra) {
  const lines = PLAN_OPTIONS.filter(o => checks[o.key]).map(o => o.label);
  if (extra.trim()) {
    extra.trim().split('\n').forEach(line => {
      if (line.trim()) lines.push(line.trim());
    });
  }
  return lines.join('\n');
}

export default function AcutePSection({ onChange }) {
  const [checks, setChecks] = useState(buildInitial);
  const [extra, setExtra] = useState('');

  function toggle(key) {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  }

  useEffect(() => {
    onChange?.(generatePText(checks, extra));
  }, [checks, extra, onChange]);

  return (
    <div className="space-y-3">
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
              className="accent-orange-500"
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>

      <div>
        <label className="text-xs text-slate-500 block mb-1">추가 계획 (선택)</label>
        <input
          type="text"
          value={extra}
          onChange={e => setExtra(e.target.value)}
          placeholder="예: 3일 후 경과 관찰"
          className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
