import { useState, useEffect } from 'react';

const CATEGORIES = [
  {
    label: '전신',
    symptoms: ['Fever', 'Chill', 'Myalgia', 'General weakness', 'Weight change'],
  },
  {
    label: '두경부',
    symptoms: ['Headache', 'Dizziness', 'Sore throat', 'Hoarseness'],
  },
  {
    label: '호흡기',
    symptoms: ['Cough', 'Sputum', 'Rhinorrhea', 'Nasal obstruction', 'Dyspnea', 'Chest pain'],
  },
  {
    label: '복부',
    symptoms: ['Abd pain', 'Flank pain'],
  },
  {
    label: '소화기',
    symptoms: ['Anorexia', 'Nausea', 'Vomiting', 'Constipation', 'Diarrhea'],
  },
  {
    label: '비뇨기',
    symptoms: ['Frequency', 'Urgency', 'Nocturia', 'Dysuria'],
  },
];

function generateSText(toggles) {
  const lines = [];
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

  function toggle(symptom) {
    setToggles(prev => ({ ...prev, [symptom]: !prev[symptom] }));
  }

  useEffect(() => {
    onChange?.(generateSText(toggles));
  }, [toggles, onChange]);

  return (
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
  );
}
