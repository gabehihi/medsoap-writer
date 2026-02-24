import { useState, useEffect } from 'react';

const CATEGORIES = [
  { label: '전신',   symptoms: ['Fever', 'Chill', 'Myalgia', 'General weakness', 'Weight change'] },
  { label: '두경부', symptoms: ['Headache', 'Dizziness', 'Sore throat', 'Hoarseness'] },
  { label: '호흡기', symptoms: ['Cough', 'Sputum', 'Rhinorrhea', 'Nasal obstruction', 'Dyspnea', 'Chest pain'] },
  { label: '복부',   symptoms: ['Abd pain', 'Flank pain'] },
  { label: '소화기', symptoms: ['Anorexia', 'Nausea', 'Vomiting', 'Constipation', 'Diarrhea'] },
  { label: '비뇨기', symptoms: ['Frequency', 'Urgency', 'Nocturia', 'Dysuria'] },
];

// 오늘 기준 날짜까지 며칠인지 계산 (음수 = 미래 날짜, null = 미입력)
function calcDaysAgo(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const onset = new Date(dateStr);
  onset.setHours(0, 0, 0, 0);
  const diff = Math.round((today - onset) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : null;
}

function generateSText(toggles, onsetType, duration, onsetDate, chiefComplaint) {
  const lines = [];

  const ccStr = chiefComplaint ? `${chiefComplaint} 호소` : '증상 시작.';

  // 증상 시작 정보 (입력된 경우에만 첫 줄에 추가)
  if (onsetType === 'duration' && duration) {
    lines.push(`${duration}일 전부터 ${ccStr}`);
  } else if (onsetType === 'date' && onsetDate) {
    const days = calcDaysAgo(onsetDate);
    const daysStr = days !== null ? ` (${days}일간)` : '';
    lines.push(`${onsetDate}부터${daysStr} ${ccStr}`);
  }

  // 카테고리별 증상 (+)/(-) 토글 (상세 기록)
  for (const cat of CATEGORIES) {
    const parts = cat.symptoms.map(s => `${s}(${toggles[s] ? '+' : '-'})`);
    lines.push(parts.join(', '));
  }

  return lines.join('\n');
}

export default function SymptomSelector({ onChange }) {
  const [toggles, setToggles] = useState(() => {
    const init = {};
    CATEGORIES.forEach(cat => cat.symptoms.forEach(s => { init[s] = false; }));
    return init;
  });
  const [onsetType, setOnsetType]         = useState('duration');
  const [duration, setDuration]           = useState('');
  const [onsetDate, setOnsetDate]         = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');

  function toggle(symptom) {
    setToggles(prev => {
      const newVal = !prev[symptom];
      if (!newVal && chiefComplaint === symptom) {
        setChiefComplaint('');
      }
      return { ...prev, [symptom]: newVal };
    });
  }

  useEffect(() => {
    onChange?.(generateSText(toggles, onsetType, duration, onsetDate, chiefComplaint));
  }, [toggles, onsetType, duration, onsetDate, chiefComplaint, onChange]);

  const daysAgo = calcDaysAgo(onsetDate);
  const todayStr = new Date().toISOString().split('T')[0]; // date input max 제한용
  const positiveSymptoms = CATEGORIES.flatMap(cat => cat.symptoms.filter(s => toggles[s]));

  return (
    <div className="space-y-3">

      {/* ── 증상 시작 정보 ── */}
      <div className="space-y-2">
        {/* 모드 탭 */}
        <div className="flex gap-1">
          {[
            { value: 'duration', label: '지속 기간' },
            { value: 'date',     label: '날짜 직접 입력' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setOnsetType(opt.value)}
              className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
                onsetType === opt.value
                  ? 'bg-orange-100 text-orange-700 border-orange-300'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* 지속 기간 입력 */}
        {onsetType === 'duration' && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="일수"
              min={1}
              max={30}
              aria-label="증상 지속 기간 (일)"
              className="w-20 px-2 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <span className="text-sm text-slate-600">일 전부터</span>
          </div>
        )}

        {/* 날짜 직접 입력 */}
        {onsetType === 'date' && (
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="date"
              value={onsetDate}
              onChange={e => setOnsetDate(e.target.value)}
              max={todayStr}
              aria-label="증상 시작 날짜"
              className="px-2 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {daysAgo !== null && (
              <span className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                {daysAgo}일 전
              </span>
            )}
          </div>
        )}
      </div>

      {/* 구분선 */}
      <div className="border-t border-slate-100" />

      {/* ── 주증상 (Chief Complaint) 선택 ── */}
      {positiveSymptoms.length > 0 && (
        <div className="space-y-1">
          <span className="text-xs text-slate-500 font-medium">주증상 선택</span>
          <div className="flex flex-wrap gap-1.5">
            {positiveSymptoms.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setChiefComplaint(prev => prev === s ? '' : s)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  chiefComplaint === s
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-orange-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 증상 토글 ── */}
      <div className="space-y-2.5">
        {CATEGORIES.map(cat => (
          <div key={cat.label} className="flex gap-2">
            <div className="shrink-0 w-14 pt-1">
              <span className="text-xs font-bold text-slate-500">{cat.label}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cat.symptoms.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggle(s)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    toggles[s]
                      ? 'bg-blue-100 text-blue-700 border-blue-300'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {s} {toggles[s] ? '(+)' : '(-)'}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
