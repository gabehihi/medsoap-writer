import { useState, useEffect } from 'react';

const QUICK_DX = [
  'Acute pharyngotonsillitis',
  'Acute nasopharyngitis',
  'Acute pharyngitis',
  'Influenza',
  'Acute bronchitis',
  'Pneumonia',
  'Acute sinusitis',
  'Acute gastroenteritis',
  'Infectious enterocolitis',
];

export default function AcuteASection({ onChange }) {
  const [dx, setDx] = useState('');

  useEffect(() => {
    onChange?.(dx.trim() ? `# ${dx.trim()}` : '');
  }, [dx, onChange]);

  return (
    <div className="space-y-3">
      {/* 퀵 버튼 */}
      <div className="flex flex-wrap gap-1.5">
        {QUICK_DX.map(d => (
          <button
            key={d}
            type="button"
            onClick={() => setDx(d)}
            className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
              dx === d
                ? 'bg-orange-100 text-orange-700 border-orange-300'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* 자유입력 */}
      <input
        type="text"
        value={dx}
        onChange={e => setDx(e.target.value)}
        placeholder="진단명 입력 (예: Acute pharyngotonsillitis)"
        aria-label="진단명"
        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
    </div>
  );
}
