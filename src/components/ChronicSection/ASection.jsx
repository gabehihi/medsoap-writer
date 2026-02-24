import { useState, useEffect } from 'react';

// 질환 표시 고정 순서
const DISEASE_ORDER = ['HTN', 'DM', 'Dyslipidemia', 'Osteoporosis', 'CKD', 'Hypothyroidism', 'Hyperthyroidism'];

function sortDiseases(selected) {
  return DISEASE_ORDER.filter(d => selected.includes(d));
}

function generateAText(selectedDiseases, extraDxList, ckdStageLabel) {
  const lines = sortDiseases(selectedDiseases).map(d => {
    if (d === 'CKD' && ckdStageLabel) {
      return `# ${ckdStageLabel}`;
    }
    return `# ${d}`;
  });

  extraDxList.filter(dx => dx.trim()).forEach(dx => lines.push(`# ${dx.trim()}`));

  return lines.join('\n');
}

export default function ASection({ selectedDiseases, ckdStageLabel = '', onChange }) {
  const [extraDxList, setExtraDxList] = useState(['']);

  useEffect(() => {
    onChange?.(generateAText(selectedDiseases, extraDxList, ckdStageLabel));
  }, [selectedDiseases, extraDxList, ckdStageLabel, onChange]);

  const sorted = sortDiseases(selectedDiseases);

  function addDx() {
    if (extraDxList.length < 10) {
      setExtraDxList(prev => [...prev, '']);
    }
  }

  function updateDx(idx, val) {
    setExtraDxList(prev => prev.map((dx, i) => (i === idx ? val : dx)));
  }

  function removeDx(idx) {
    setExtraDxList(prev => prev.filter((_, i) => i !== idx));
  }

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
      <div className="space-y-2">
        <label className="text-xs text-slate-500 block">추가 진단명 (선택)</label>
        {extraDxList.map((dx, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <input
              type="text"
              value={dx}
              onChange={e => updateDx(idx, e.target.value)}
              placeholder="추가 진단명 입력 (예: GERD, Anemia, CKD stage 3)"
              aria-label={`추가 진단명 ${idx + 1}`}
              className="flex-1 px-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {extraDxList.length > 1 && (
              <button
                type="button"
                onClick={() => removeDx(idx)}
                aria-label="진단명 삭제"
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        {extraDxList.length < 10 && (
          <button
            type="button"
            onClick={addDx}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
          >
            + 진단명 추가
          </button>
        )}
      </div>
    </div>
  );
}
