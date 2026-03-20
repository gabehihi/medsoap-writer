import { useState, useEffect } from 'react';

// ── UI 헬퍼 ───────────────────────────────────────────────────

function NumInput({ value, onChange, placeholder, className = '' }) {
  return (
    <input
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      step="any"
      min="0"
      aria-label={placeholder}
      className={`w-16 px-2 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${className}`}
    />
  );
}

function SectionLabel({ label }) {
  return (
    <div className="flex items-center gap-2 mb-2 mt-3 first:mt-0">
      <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
        {label}
      </span>
      <div className="flex-1 border-t border-slate-100" />
    </div>
  );
}

function SegmentGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
            value === opt
              ? 'bg-orange-100 text-orange-700 border-orange-300'
              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function FieldRow({ label, children }) {
  return (
    <div className="flex items-start gap-3 py-1">
      <span className="shrink-0 w-20 text-xs font-medium text-slate-600 pt-1">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

// ── 초기 상태 ─────────────────────────────────────────────────

const INITIAL_FORM = {
  vs_sbp: '', vs_dbp: '', vs_pr: '', vs_bt: '',
  appearance: 'Not so ill-looking',
  pi: '-', pth: '-',
  breath_base: 'Clear', breath_extra: 'without',
  abd_soft: 'Soft', abd_shape: 'Flat', abd_bs: 'normoactive',
  abd_td: 'no', abd_td_location: '',
  cvat: 'Neg', cvat_detail: '',
  extra: '',
};

// ── 텍스트 생성 ───────────────────────────────────────────────

function generateOText(f) {
  const lines = [];

  // V/S
  if (f.vs_sbp || f.vs_dbp || f.vs_pr || f.vs_bt) {
    const bp = (f.vs_sbp || f.vs_dbp) ? `${f.vs_sbp || '___'}/${f.vs_dbp || '___'}` : '';
    const parts = [bp, f.vs_pr, f.vs_bt ? `${f.vs_bt}℃` : ''].filter(Boolean);
    if (parts.length) lines.push(`V/S : ${parts.join(' - ')}`);
  }

  // Appearance
  lines.push(`${f.appearance} appearance`);

  // PI/PTH
  lines.push(`PI ${f.pi}/PTH ${f.pth}`);

  // Breath sound
  const breathExtra = f.breath_extra === 'without'
    ? 'without adventitious sound'
    : f.breath_extra;
  lines.push(`${f.breath_base} breath sound, ${breathExtra}`);

  // Abdomen
  const tdText = f.abd_td === 'no'
    ? 'no abd Td/rTd'
    : `Td (+)${f.abd_td_location ? ` at ${f.abd_td_location}` : ''}`;
  lines.push(`${f.abd_soft}, ${f.abd_shape}, ${f.abd_bs} BS, ${tdText}`);

  // CVAT
  if (f.cvat === 'Neg') {
    lines.push('CVAT Neg');
  } else {
    lines.push(`CVAT Pos${f.cvat_detail ? `: ${f.cvat_detail}` : ''}`);
  }

  // Extra
  if (f.extra.trim()) lines.push(f.extra.trim());

  return lines.join('\n');
}

// ── 컴포넌트 ──────────────────────────────────────────────────

export default function AcuteOSection({ chronicVS, onChange }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [useChronicVS, setUseChronicVS] = useState(false);

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  // 만성질환 V/S 가져오기
  useEffect(() => {
    if (useChronicVS && chronicVS) {
      setForm(prev => ({
        ...prev,
        vs_sbp: chronicVS.sbp || '',
        vs_dbp: chronicVS.dbp || '',
        vs_pr: chronicVS.pr || '',
        vs_bt: chronicVS.bt || '',
      }));
    }
  }, [useChronicVS, chronicVS]);

  useEffect(() => {
    onChange?.(generateOText(form));
  }, [form, onChange]);

  const hasChronicVS = chronicVS && (chronicVS.sbp || chronicVS.dbp || chronicVS.pr || chronicVS.bt);

  return (
    <div className="space-y-1">
      {/* V/S */}
      <SectionLabel label="V/S" />
      {hasChronicVS && (
        <label className="flex items-center gap-2 text-xs text-slate-500 mb-1 cursor-pointer">
          <input
            type="checkbox"
            checked={useChronicVS}
            onChange={e => setUseChronicVS(e.target.checked)}
            className="accent-orange-500"
          />
          만성질환 V/S 가져오기
        </label>
      )}
      <div className="flex items-center gap-1.5 text-sm">
        <NumInput value={form.vs_sbp} onChange={v => set('vs_sbp', v)} placeholder="SBP" />
        <span className="text-slate-400">/</span>
        <NumInput value={form.vs_dbp} onChange={v => set('vs_dbp', v)} placeholder="DBP" />
        <span className="text-slate-400 mx-1">-</span>
        <NumInput value={form.vs_pr} onChange={v => set('vs_pr', v)} placeholder="PR" />
        <span className="text-slate-400 mx-1">,</span>
        <NumInput value={form.vs_bt} onChange={v => set('vs_bt', v)} placeholder="BT" className="w-14" />
        <span className="text-xs text-slate-400">℃</span>
      </div>

      {/* Appearance */}
      <SectionLabel label="전반 상태" />
      <SegmentGroup
        options={['Acute ill-looking', 'Chronic ill-looking', 'Not so ill-looking']}
        value={form.appearance}
        onChange={v => set('appearance', v)}
      />

      {/* PI/PTH */}
      <SectionLabel label="인두/편도" />
      <FieldRow label="PI">
        <SegmentGroup
          options={['-', '+', '++', '+++']}
          value={form.pi}
          onChange={v => set('pi', v)}
        />
      </FieldRow>
      <FieldRow label="PTH">
        <SegmentGroup
          options={['-', '+', '++', '+++']}
          value={form.pth}
          onChange={v => set('pth', v)}
        />
      </FieldRow>

      {/* Breath sound */}
      <SectionLabel label="호흡음" />
      <FieldRow label="기본">
        <SegmentGroup
          options={['Clear', 'Coarse']}
          value={form.breath_base}
          onChange={v => set('breath_base', v)}
        />
      </FieldRow>
      <FieldRow label="추가">
        <SegmentGroup
          options={['without', 'with crackle', 'with wheezing', 'with crackle & wheezing']}
          value={form.breath_extra}
          onChange={v => set('breath_extra', v)}
        />
      </FieldRow>

      {/* Abdomen */}
      <SectionLabel label="복부" />
      <FieldRow label="긴장도">
        <SegmentGroup
          options={['Soft', 'Rigid']}
          value={form.abd_soft}
          onChange={v => set('abd_soft', v)}
        />
      </FieldRow>
      <FieldRow label="형태">
        <SegmentGroup
          options={['Flat', 'Obese', 'Distended']}
          value={form.abd_shape}
          onChange={v => set('abd_shape', v)}
        />
      </FieldRow>
      <FieldRow label="장음">
        <SegmentGroup
          options={['normoactive', 'hypoactive', 'hyperactive']}
          value={form.abd_bs}
          onChange={v => set('abd_bs', v)}
        />
      </FieldRow>
      <FieldRow label="압통">
        <div className="space-y-1.5">
          <SegmentGroup
            options={['no', 'Td (+)']}
            value={form.abd_td}
            onChange={v => set('abd_td', v)}
          />
          {form.abd_td === 'Td (+)' && (
            <input
              type="text"
              value={form.abd_td_location}
              onChange={e => set('abd_td_location', e.target.value)}
              placeholder="위치 (예: RLQ, epigastric)"
              className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          )}
        </div>
      </FieldRow>

      {/* CVAT */}
      <SectionLabel label="CVAT" />
      <SegmentGroup
        options={['Neg', 'Pos']}
        value={form.cvat}
        onChange={v => set('cvat', v)}
      />
      {form.cvat === 'Pos' && (
        <input
          type="text"
          value={form.cvat_detail}
          onChange={e => set('cvat_detail', e.target.value)}
          placeholder="세부 소견"
          className="mt-1.5 w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      )}

      {/* Extra */}
      <SectionLabel label="기타" />
      <input
        type="text"
        value={form.extra}
        onChange={e => set('extra', e.target.value)}
        placeholder="추가 소견 입력"
        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
    </div>
  );
}
