import { useState, useEffect } from 'react';

// 질환 표시 고정 순서
const DISEASE_ORDER = ['HTN', 'DM', 'Dyslipidemia', 'Osteoporosis', 'CKD', 'Hypothyroidism', 'Hyperthyroidism'];

function sortDiseases(selected) {
  return DISEASE_ORDER.filter(d => selected.includes(d));
}

function generateAText(selectedDiseases, extraDx, ckdStageLabel) {
  const lines = sortDiseases(selectedDiseases).map(d => {
    if (d === 'CKD' && ckdStageLabel) {
      return `# ${ckdStageLabel}`;
    }
    return `# ${d}`;
  });
  if (extraDx.trim()) {
    extraDx.trim().split('\n').forEach(line => {
      if (line.trim()) lines.push(`# ${line.trim()}`);
    });
  }
  return lines.join('\n');
}

export default function ASection({ selectedDiseases, ckdStageLabel = '', onChange }) {
  const [extraDx, setExtraDx] = useState('');

  useEffect(() => {
    onChange?.(generateAText(selectedDiseases, extraDx, ckdStageLabel));
  }, [selectedDiseases, extraDx, ckdStageLabel, onChange]);

  const sorted = sortDiseases(selectedDiseases);

  return (
    <div className="space-y-3">
      {/* 자동 나열 */}
      <div className="space-y-1">
        {sorted.map(d => (
          <div key={d} className="flex items-center gap-2 py-0.5 px-2 rounded bg-slate-50 text-sm text-slate-700">
            <span className="text-blue-500 font-bold">#</span>
            <span>{d === 'CKD' && ckdStageLabel ? ckdStageLabel : d}</span>
          </div>
        ))}
      </div>

      {/* 추가 진단명 */}
      <div>
        <label className="text-xs text-slate-500 block mb-1">추가 진단명 (선택)</label>
        <input
          type="text"
          value={extraDx}
          onChange={e => setExtraDx(e.target.value)}
          placeholder="예: GERD, Insomnia"
          aria-label="추가 진단명"
          className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
