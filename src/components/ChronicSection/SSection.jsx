import { useState, useEffect } from 'react';

// ── 공통 UI 컴포넌트 ────────────────────────────────────────

function OXToggle({ value, onChange }) {
  return (
    <div className="flex gap-1 shrink-0">
      {['O', 'X'].map(v => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`w-7 h-6 rounded-full text-xs font-bold transition-colors ${
            value === v
              ? v === 'O'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-400 text-white'
              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

function SubInput({ children }) {
  return (
    <div className="mt-2 ml-2 pl-3 border-l-2 border-blue-200 space-y-2">
      {children}
    </div>
  );
}

function Row({ label, toggle, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 py-1">
        <span className="text-sm text-slate-600 flex-1">{label}</span>
        {toggle}
      </div>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, className = '' }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`px-2 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    />
  );
}

function NumInput({ value, onChange, placeholder }) {
  return (
    <input
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      min="0"
      className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  );
}

function SectionLabel({ label }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
        {label}
      </span>
      <div className="flex-1 border-t border-slate-100" />
    </div>
  );
}

// ── HTN S 섹션 ──────────────────────────────────────────────

function HTNSection({ data, set }) {
  return (
    <div className="space-y-0.5">
      <SectionLabel label="HTN" />

      <Row
        label="가정혈압 측정"
        toggle={
          <OXToggle
            value={data.htn_homeBP.ox}
            onChange={v => set('htn_homeBP', { ox: v })}
          />
        }
      >
        {data.htn_homeBP.ox === 'O' && (
          <SubInput>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500">SBP</span>
              <NumInput
                value={data.htn_homeBP.sbp}
                onChange={v => set('htn_homeBP', { sbp: v })}
                placeholder="120"
              />
              <span className="text-xs text-slate-400">/</span>
              <span className="text-xs text-slate-500">DBP</span>
              <NumInput
                value={data.htn_homeBP.dbp}
                onChange={v => set('htn_homeBP', { dbp: v })}
                placeholder="80"
              />
              <span className="text-xs text-slate-400">mmHg</span>
            </div>
          </SubInput>
        )}
      </Row>

      <Row
        label="기립성저혈압 증상"
        toggle={
          <OXToggle
            value={data.htn_orthostatic.ox}
            onChange={v => set('htn_orthostatic', { ox: v })}
          />
        }
      >
        {data.htn_orthostatic.ox === 'O' && (
          <SubInput>
            <TextInput
              value={data.htn_orthostatic.text}
              onChange={v => set('htn_orthostatic', { text: v })}
              placeholder="증상 기술"
              className="w-full"
            />
          </SubInput>
        )}
      </Row>
    </div>
  );
}

// ── DM S 섹션 ───────────────────────────────────────────────

const HYPO_SYMPTOMS = ['어지러움', '두근거림', '손떨림', '발한', '의식저하'];

function DMSection({ data, set }) {
  function toggleSymptom(sym) {
    const prev = data.dm_hypoglycemia.symptoms;
    set('dm_hypoglycemia', {
      symptoms: prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym],
    });
  }

  return (
    <div className="space-y-0.5">
      <SectionLabel label="DM" />

      <Row
        label="가정혈당 측정"
        toggle={
          <OXToggle
            value={data.dm_homeGlucose.ox}
            onChange={v => set('dm_homeGlucose', { ox: v })}
          />
        }
      >
        {data.dm_homeGlucose.ox === 'O' && (
          <SubInput>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500">FBS</span>
              <NumInput
                value={data.dm_homeGlucose.fbs}
                onChange={v => set('dm_homeGlucose', { fbs: v })}
                placeholder="100"
              />
              <span className="text-xs text-slate-400">/</span>
              <span className="text-xs text-slate-500">PPG</span>
              <NumInput
                value={data.dm_homeGlucose.ppg}
                onChange={v => set('dm_homeGlucose', { ppg: v })}
                placeholder="140"
              />
              <span className="text-xs text-slate-400">mg/dL</span>
            </div>
          </SubInput>
        )}
      </Row>

      <Row
        label="저혈당 증상"
        toggle={
          <OXToggle
            value={data.dm_hypoglycemia.ox}
            onChange={v => set('dm_hypoglycemia', { ox: v })}
          />
        }
      >
        {data.dm_hypoglycemia.ox === 'O' && (
          <SubInput>
            <div className="flex flex-wrap gap-1.5">
              {HYPO_SYMPTOMS.map(sym => {
                const active = data.dm_hypoglycemia.symptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    onClick={() => toggleSymptom(sym)}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                      active
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-500 border-slate-300 hover:border-blue-400'
                    }`}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500 shrink-0">발생 시간</span>
              <TextInput
                value={data.dm_hypoglycemia.time}
                onChange={v => set('dm_hypoglycemia', { time: v })}
                placeholder="오전 7시경"
                className="flex-1 min-w-0"
              />
            </div>
          </SubInput>
        )}
      </Row>

      <Row
        label="인슐린 사용"
        toggle={
          <OXToggle
            value={data.dm_insulin.ox}
            onChange={v => set('dm_insulin', { ox: v })}
          />
        }
      >
        {data.dm_insulin.ox === 'O' && (
          <SubInput>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500">기저</span>
              <NumInput
                value={data.dm_insulin.basal}
                onChange={v => set('dm_insulin', { basal: v })}
                placeholder="10"
              />
              <span className="text-xs text-slate-400">U</span>
              <span className="text-xs text-slate-400">/</span>
              <span className="text-xs text-slate-500">식사</span>
              <NumInput
                value={data.dm_insulin.meal}
                onChange={v => set('dm_insulin', { meal: v })}
                placeholder="6"
              />
              <span className="text-xs text-slate-400">U</span>
            </div>
          </SubInput>
        )}
      </Row>
    </div>
  );
}

// ── 공통 S 섹션 ─────────────────────────────────────────────

function CommonSection({ data, set }) {
  return (
    <div className="space-y-0.5">
      <SectionLabel label="공통" />

      <Row
        label="특이증상"
        toggle={
          <OXToggle
            value={data.specialSymptom.ox}
            onChange={v => set('specialSymptom', { ox: v })}
          />
        }
      >
        {data.specialSymptom.ox === 'O' && (
          <SubInput>
            <TextInput
              value={data.specialSymptom.text}
              onChange={v => set('specialSymptom', { text: v })}
              placeholder="증상 기술"
              className="w-full"
            />
          </SubInput>
        )}
      </Row>

      <Row
        label="약제 부작용"
        toggle={
          <OXToggle
            value={data.sideEffect.ox}
            onChange={v => set('sideEffect', { ox: v })}
          />
        }
      >
        {data.sideEffect.ox === 'O' && (
          <SubInput>
            <TextInput
              value={data.sideEffect.text}
              onChange={v => set('sideEffect', { text: v })}
              placeholder="부작용 내용"
              className="w-full"
            />
          </SubInput>
        )}
      </Row>
    </div>
  );
}

// ── 텍스트 생성 ─────────────────────────────────────────────

function generateSText(data, selectedDiseases) {
  const lines = [];

  if (selectedDiseases.includes('HTN')) {
    lines.push(
      data.htn_homeBP.ox === 'O'
        ? `가정혈압 측정함. BP ${data.htn_homeBP.sbp || '__'}/${data.htn_homeBP.dbp || '__'}.`
        : '가정혈압 측정하지 않음.'
    );
    lines.push(
      data.htn_orthostatic.ox === 'O'
        ? `기립성저혈압 증상(+): ${data.htn_orthostatic.text}`
        : '기립성저혈압 증상 없음.'
    );
  }

  if (selectedDiseases.includes('DM')) {
    lines.push(
      data.dm_homeGlucose.ox === 'O'
        ? `가정혈당 측정함. FBS ${data.dm_homeGlucose.fbs || '__'} / PPG ${data.dm_homeGlucose.ppg || '__'}.`
        : '가정혈당 측정하지 않음.'
    );
    if (data.dm_hypoglycemia.ox === 'O') {
      const syms = data.dm_hypoglycemia.symptoms.join(', ');
      const time = data.dm_hypoglycemia.time ? ` / ${data.dm_hypoglycemia.time}` : '';
      lines.push(`저혈당 증상(+): ${syms}${time}`);
    } else {
      lines.push('저혈당 증상 없음.');
    }
    if (data.dm_insulin.ox === 'O') {
      lines.push(
        `인슐린 사용 중 (기저 ${data.dm_insulin.basal || '__'}U / 식사 ${data.dm_insulin.meal || '__'}U).`
      );
    }
  }

  lines.push(
    data.specialSymptom.ox === 'O'
      ? `특이증상: ${data.specialSymptom.text}`
      : '특이증상 없음.'
  );
  lines.push(
    data.sideEffect.ox === 'O'
      ? `약제 부작용: ${data.sideEffect.text}`
      : '약제 부작용 없음.'
  );

  return lines.join('\n');
}

// ── 초기 상태 ────────────────────────────────────────────────

const INITIAL_FORM = {
  specialSymptom:   { ox: 'X', text: '' },
  sideEffect:       { ox: 'X', text: '' },
  htn_homeBP:       { ox: 'X', sbp: '', dbp: '' },
  htn_orthostatic:  { ox: 'X', text: '' },
  dm_homeGlucose:   { ox: 'X', fbs: '', ppg: '' },
  dm_hypoglycemia:  { ox: 'X', symptoms: [], time: '' },
  dm_insulin:       { ox: 'X', basal: '', meal: '' },
};

// ── 메인 컴포넌트 ────────────────────────────────────────────

export default function SSection({ selectedDiseases, onChange }) {
  const [formData, setFormData] = useState(INITIAL_FORM);

  function set(key, patch) {
    setFormData(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  useEffect(() => {
    onChange?.(generateSText(formData, selectedDiseases));
  }, [formData, selectedDiseases, onChange]);

  return (
    <div className="space-y-4">
      {selectedDiseases.includes('HTN') && (
        <HTNSection data={formData} set={set} />
      )}
      {selectedDiseases.includes('DM') && (
        <DMSection data={formData} set={set} />
      )}
      <CommonSection data={formData} set={set} />
    </div>
  );
}
