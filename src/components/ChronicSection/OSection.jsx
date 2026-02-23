import { useState, useEffect, useMemo } from 'react';
import { calcBMI } from '../../utils/bmi';
import { calcEGFR } from '../../utils/egfr';
import { classifyASCVD, isAgeRisk } from '../../utils/ascvd';
import { getKDIGOStatin } from '../../utils/kdigo_statin';

// ── 공통 UI 컴포넌트 ────────────────────────────────────────

function NumInput({ value, onChange, placeholder, step = 'any', min = 0, className = '', label }) {
  return (
    <input
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      step={step}
      min={min}
      aria-label={label || placeholder}
      className={`w-16 px-2 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
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

function Badge({ children }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700">
      {children}
    </span>
  );
}

const RISK_BADGE_COLORS = {
  red:    'bg-red-100 text-red-700 border-red-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  green:  'bg-green-100 text-green-700 border-green-200',
};

const KDIGO_BADGE_COLORS = {
  strong:   'bg-purple-100 text-purple-700',
  moderate: 'bg-blue-100 text-blue-700',
  neutral:  'bg-slate-100 text-slate-600',
  gray:     'bg-slate-100 text-slate-500',
};

// ── 공통 V/S 섹션 ──────────────────────────────────────────

function VSSection({ data, set }) {
  return (
    <div className="space-y-0.5">
      <SectionLabel label="V/S" />
      <div className="flex items-center gap-2 flex-wrap py-1">
        <span className="text-sm text-slate-600 shrink-0">BP</span>
        <NumInput value={data.vs_sbp} onChange={v => set('vs_sbp', v)} placeholder="120" />
        <span className="text-xs text-slate-400">/</span>
        <NumInput value={data.vs_dbp} onChange={v => set('vs_dbp', v)} placeholder="80" />
        <span className="text-xs text-slate-400">mmHg</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap py-1">
        <span className="text-sm text-slate-600 shrink-0">PR</span>
        <NumInput value={data.vs_pr} onChange={v => set('vs_pr', v)} placeholder="72" />
        <span className="text-xs text-slate-400">bpm</span>
        <span className="text-sm text-slate-600 shrink-0 ml-2">BT</span>
        <NumInput value={data.vs_bt} onChange={v => set('vs_bt', v)} placeholder="36.5" step="0.1" />
        <span className="text-xs text-slate-400">{'\u2103'}</span>
      </div>
    </div>
  );
}

// ── 키/체중/BMI 섹션 ────────────────────────────────────────

function BodySection({ data, set, bmi }) {
  return (
    <div className="space-y-0.5">
      <SectionLabel label="신체 계측" />
      <div className="flex items-center gap-2 flex-wrap py-1">
        <span className="text-sm text-slate-600 shrink-0">키</span>
        <NumInput value={data.height} onChange={v => set('height', v)} placeholder="170" step="0.1" className="w-18" />
        <span className="text-xs text-slate-400">cm</span>
        <span className="text-sm text-slate-600 shrink-0 ml-2">체중</span>
        <NumInput value={data.weight} onChange={v => set('weight', v)} placeholder="70" step="0.1" className="w-18" />
        <span className="text-xs text-slate-400">kg</span>
        {bmi && (
          <span className="ml-2">
            <Badge>BMI {bmi}</Badge>
          </span>
        )}
      </div>
    </div>
  );
}

// ── DM O 섹션 ───────────────────────────────────────────────

function DMOSection({ data, set }) {
  return (
    <div className="space-y-0.5">
      <SectionLabel label="DM" />
      <div className="flex items-center gap-2 flex-wrap py-1">
        <span className="text-sm text-slate-600 shrink-0">HbA1c</span>
        <NumInput value={data.dm_hba1c} onChange={v => set('dm_hba1c', v)} placeholder="7.0" step="0.1" />
        <span className="text-xs text-slate-400">%</span>
        <span className="text-sm text-slate-600 shrink-0 ml-2">BST</span>
        <NumInput value={data.dm_bst} onChange={v => set('dm_bst', v)} placeholder="150" />
        <span className="text-xs text-slate-400">mg/dL</span>
      </div>
    </div>
  );
}

// ── ASCVD 위험인자 체크 ──────────────────────────────────────

function RiskFactorCheck({ label, checked, auto }) {
  return (
    <div className={`flex items-center gap-2 py-0.5 px-2 rounded text-sm ${
      auto ? 'bg-slate-50 text-slate-500' : 'text-slate-700'
    }`}>
      <input
        type="checkbox"
        checked={checked}
        readOnly
        disabled={auto}
        className="accent-blue-600"
      />
      <span>{label}</span>
      {auto && <span className="text-[10px] text-slate-400">자동</span>}
    </div>
  );
}

function ASCVDSection({ data, set, riskFactors, ascvdResult }) {
  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      {/* 초고위험군 체크 */}
      <label className="flex items-center gap-2 py-1 px-2 rounded text-sm text-slate-700 cursor-pointer hover:bg-slate-50">
        <input
          type="checkbox"
          checked={data.ascvd_veryHighRisk}
          onChange={() => set('ascvd_veryHighRisk', !data.ascvd_veryHighRisk)}
          className="accent-red-600"
        />
        <span className="font-medium">초고위험군 해당</span>
        <span className="text-xs text-slate-400">(관상동맥질환, 뇌졸중, 말초동맥질환)</span>
      </label>

      {/* 위험인자 체크리스트 */}
      {!data.ascvd_veryHighRisk && (
        <div className="mt-2 ml-1">
          <p className="text-xs text-slate-500 mb-1.5">위험인자 체크:</p>
          <div className="space-y-0.5">
            {riskFactors.map(f => (
              f.auto ? (
                <RiskFactorCheck key={f.key} label={f.label} checked={f.checked} auto />
              ) : (
                <label key={f.key} className="flex items-center gap-2 py-0.5 px-2 rounded text-sm text-slate-700 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={f.checked}
                    onChange={() => set(f.stateKey, !f.checked)}
                    className="accent-blue-600"
                  />
                  <span>{f.label}</span>
                </label>
              )
            ))}
          </div>
        </div>
      )}

      {/* 결과 badge */}
      {ascvdResult && (
        <div className="mt-2 ml-1">
          <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold border ${RISK_BADGE_COLORS[ascvdResult.color]}`}>
            ASCVD: {ascvdResult.grade}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Dyslipidemia O 섹션 + ASCVD ─────────────────────────────

function DyslipidemiaOSection({ data, set, riskFactors, ascvdResult }) {
  return (
    <div className="space-y-0.5">
      <SectionLabel label="Dyslipidemia" />
      <div className="flex items-center gap-2 flex-wrap py-1">
        <span className="text-sm text-slate-600 shrink-0">TC</span>
        <NumInput value={data.lipid_tc} onChange={v => set('lipid_tc', v)} placeholder="200" />
        <span className="text-xs text-slate-400">/</span>
        <span className="text-sm text-slate-600 shrink-0">TG</span>
        <NumInput value={data.lipid_tg} onChange={v => set('lipid_tg', v)} placeholder="150" />
        <span className="text-xs text-slate-400">/</span>
        <span className="text-sm text-slate-600 shrink-0">HDL</span>
        <NumInput value={data.lipid_hdl} onChange={v => set('lipid_hdl', v)} placeholder="50" />
        <span className="text-xs text-slate-400">/</span>
        <span className="text-sm text-slate-600 shrink-0">LDL</span>
        <NumInput value={data.lipid_ldl} onChange={v => set('lipid_ldl', v)} placeholder="130" />
        <span className="text-xs text-slate-400">mg/dL</span>
      </div>

      <ASCVDSection
        data={data}
        set={set}
        riskFactors={riskFactors}
        ascvdResult={ascvdResult}
      />
    </div>
  );
}

// ── Osteoporosis O 섹션 ─────────────────────────────────────

function OsteoporosisOSection({ data, set }) {
  return (
    <div className="space-y-0.5">
      <SectionLabel label="Osteoporosis" />
      <div className="flex items-center gap-2 flex-wrap py-1">
        <span className="text-sm text-slate-600 shrink-0">BMD T-score</span>
        <NumInput value={data.osteo_tscore} onChange={v => set('osteo_tscore', v)} placeholder="-2.5" step="0.1" min={-10} className="w-20" label="BMD T-score" />
      </div>
    </div>
  );
}

// ── CKD O 섹션 + KDIGO ──────────────────────────────────────

function CKDOSection({ data, set, egfr, kdigoResult }) {
  return (
    <div className="space-y-0.5">
      <SectionLabel label="CKD" />
      <div className="flex items-center gap-2 flex-wrap py-1">
        <span className="text-sm text-slate-600 shrink-0">BUN</span>
        <NumInput value={data.ckd_bun} onChange={v => set('ckd_bun', v)} placeholder="20" step="0.1" />
        <span className="text-xs text-slate-400">/</span>
        <span className="text-sm text-slate-600 shrink-0">Cr</span>
        <NumInput value={data.ckd_cr} onChange={v => set('ckd_cr', v)} placeholder="1.0" step="0.01" />
        <span className="text-xs text-slate-400">mg/dL</span>
        {egfr && (
          <span className="ml-1">
            <Badge>eGFR {egfr}</Badge>
          </span>
        )}
      </div>

      {/* 투석 체크 */}
      <label className="flex items-center gap-2 py-1 px-2 mt-1 rounded text-sm text-slate-700 cursor-pointer hover:bg-slate-50">
        <input
          type="checkbox"
          checked={data.ckd_dialysis}
          onChange={() => set('ckd_dialysis', !data.ckd_dialysis)}
          className="accent-blue-600"
        />
        <span>투석 중</span>
      </label>

      {/* KDIGO 권고 */}
      {kdigoResult && (
        <div className="mt-2 ml-1">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold ${KDIGO_BADGE_COLORS[kdigoResult.level]}`}>
            KDIGO: {kdigoResult.recommendation}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Thyroid O 섹션 ───────────────────────────────────────────

function ThyroidOSection({ data, set }) {
  return (
    <div className="space-y-0.5">
      <SectionLabel label="Thyroid" />
      <div className="flex items-center gap-2 flex-wrap py-1">
        <span className="text-sm text-slate-600 shrink-0">TSH</span>
        <NumInput value={data.thyroid_tsh} onChange={v => set('thyroid_tsh', v)} placeholder="2.5" step="0.01" className="w-20" />
        <span className="text-xs text-slate-400">mIU/L</span>
        <span className="text-sm text-slate-600 shrink-0 ml-2">FT4</span>
        <NumInput value={data.thyroid_ft4} onChange={v => set('thyroid_ft4', v)} placeholder="1.2" step="0.01" className="w-20" />
        <span className="text-xs text-slate-400">ng/dL</span>
      </div>
    </div>
  );
}

// ── 텍스트 생성 ─────────────────────────────────────────────

function generateOText(data, selectedDiseases, bmi, egfr, ascvdResult, activeFactorNames, kdigoResult) {
  const lines = [];

  // V/S
  const hasBP = data.vs_sbp || data.vs_dbp;
  const hasPR = data.vs_pr;
  const hasBT = data.vs_bt;
  if (hasBP || hasPR || hasBT) {
    const parts = [];
    if (hasBP) parts.push(`${data.vs_sbp || '__'}/${data.vs_dbp || '__'}`);
    if (hasPR) parts.push(data.vs_pr);
    let vs = 'V/S : ';
    if (hasBP && hasPR) {
      vs += `${parts[0]} - ${parts[1]}`;
    } else {
      vs += parts.join(' - ');
    }
    if (hasBT) vs += `, ${data.vs_bt}\u2103`;
    lines.push(vs);
  }

  // 키/체중/BMI
  if (data.height || data.weight) {
    let body = '';
    if (data.height) body += `키 ${data.height}cm `;
    if (data.weight) body += `체중 ${data.weight}kg `;
    if (bmi) body += `BMI ${bmi} kg/m\u00B2`;
    lines.push(body.trim());
  }

  // DM
  if (selectedDiseases.includes('DM') && (data.dm_hba1c || data.dm_bst)) {
    const parts = [];
    if (data.dm_hba1c) parts.push(`HbA1c ${data.dm_hba1c}%`);
    if (data.dm_bst) parts.push(`BST ${data.dm_bst} mg/dL`);
    lines.push(parts.join(' / '));
  }

  // Dyslipidemia
  if (selectedDiseases.includes('Dyslipidemia') &&
      (data.lipid_tc || data.lipid_tg || data.lipid_hdl || data.lipid_ldl)) {
    lines.push(
      `TC ${data.lipid_tc || '__'} / TG ${data.lipid_tg || '__'} / HDL ${data.lipid_hdl || '__'} / LDL ${data.lipid_ldl || '__'} mg/dL`
    );
  }

  // ASCVD
  if (selectedDiseases.includes('Dyslipidemia') && ascvdResult) {
    const factorsStr = activeFactorNames.length > 0
      ? ` (위험인자: ${activeFactorNames.join(', ')})`
      : '';
    lines.push(`ASCVD risk: ${ascvdResult.grade}${factorsStr}`);
  }

  // Osteoporosis
  if (selectedDiseases.includes('Osteoporosis') && data.osteo_tscore) {
    lines.push(`BMD T-score ${data.osteo_tscore}`);
  }

  // CKD
  if (selectedDiseases.includes('CKD') && (data.ckd_bun || data.ckd_cr)) {
    if (egfr) {
      lines.push(`eGFR ${egfr} mL/min/1.73m\u00B2 (BUN ${data.ckd_bun || '__'} / Cr ${data.ckd_cr || '__'} mg/dL)`);
    } else {
      lines.push(`BUN ${data.ckd_bun || '__'} / Cr ${data.ckd_cr || '__'} mg/dL`);
    }
  }

  // KDIGO
  if (selectedDiseases.includes('CKD') && kdigoResult) {
    lines.push(`KDIGO: ${kdigoResult.recommendation}`);
  }

  // Thyroid
  const hasThyroid = selectedDiseases.includes('Hypothyroidism') || selectedDiseases.includes('Hyperthyroidism');
  if (hasThyroid && (data.thyroid_tsh || data.thyroid_ft4)) {
    const parts = [];
    if (data.thyroid_tsh) parts.push(`TSH ${data.thyroid_tsh} mIU/L`);
    if (data.thyroid_ft4) parts.push(`FT4 ${data.thyroid_ft4} ng/dL`);
    lines.push(parts.join(' / '));
  }

  return lines.join('\n');
}

// ── 초기 상태 ────────────────────────────────────────────────

const INITIAL_FORM = {
  // V/S
  vs_sbp: '', vs_dbp: '', vs_pr: '', vs_bt: '',
  // 신체 계측
  height: '', weight: '',
  // DM
  dm_hba1c: '', dm_bst: '',
  // Dyslipidemia
  lipid_tc: '', lipid_tg: '', lipid_hdl: '', lipid_ldl: '',
  // Osteoporosis
  osteo_tscore: '',
  // CKD
  ckd_bun: '', ckd_cr: '',
  ckd_dialysis: false,
  // Thyroid
  thyroid_tsh: '', thyroid_ft4: '',
  // ASCVD 위험인자 (수동)
  ascvd_veryHighRisk: false,
  ascvd_familyHistory: false,
  ascvd_smoking: false,
};

// ── ASCVD 위험인자 정의 ──────────────────────────────────────

const RISK_FACTOR_SHORT_NAMES = {
  age: '나이', familyHistory: '가족력', smoking: '흡연', htn: 'HTN', hdl: 'HDL<40',
};

function buildRiskFactors(formData, patientInfo, selectedDiseases) {
  const ageRisk = isAgeRisk(patientInfo.age, patientInfo.sex);
  const htnRisk = selectedDiseases.includes('HTN');
  const hdlRisk = formData.lipid_hdl !== '' && Number(formData.lipid_hdl) < 40;

  return [
    { key: 'age', label: '나이 (남\u226545세 / 여\u226555세)', checked: ageRisk, auto: true },
    { key: 'familyHistory', label: '조기 심혈관질환 가족력', checked: formData.ascvd_familyHistory, auto: false, stateKey: 'ascvd_familyHistory' },
    { key: 'smoking', label: '흡연', checked: formData.ascvd_smoking, auto: false, stateKey: 'ascvd_smoking' },
    { key: 'htn', label: 'HTN', checked: htnRisk, auto: true },
    { key: 'hdl', label: 'HDL-C < 40 mg/dL', checked: hdlRisk, auto: true },
  ];
}

// ── 메인 컴포넌트 ────────────────────────────────────────────

export default function OSection({ selectedDiseases, patientInfo, onChange }) {
  const [formData, setFormData] = useState(INITIAL_FORM);

  function set(key, value) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  // 자동계산: BMI
  const bmi = useMemo(
    () => calcBMI(Number(formData.weight), Number(formData.height)),
    [formData.weight, formData.height]
  );

  // 자동계산: eGFR
  const sexForCalc = patientInfo.sex === '남' ? 'male' : patientInfo.sex === '여' ? 'female' : null;
  const egfr = useMemo(
    () => calcEGFR(Number(formData.ckd_cr), Number(patientInfo.age), sexForCalc),
    [formData.ckd_cr, patientInfo.age, sexForCalc]
  );

  // ASCVD 위험인자 + 분류
  const riskFactors = useMemo(
    () => buildRiskFactors(formData, patientInfo, selectedDiseases),
    [formData, patientInfo, selectedDiseases]
  );

  const ascvdResult = useMemo(() => {
    if (!selectedDiseases.includes('Dyslipidemia')) return null;
    const riskFactorCount = riskFactors.filter(f => f.checked).length;
    return classifyASCVD({
      isVeryHighRisk: formData.ascvd_veryHighRisk,
      hasDM: selectedDiseases.includes('DM'),
      riskFactorCount,
    });
  }, [selectedDiseases, riskFactors, formData.ascvd_veryHighRisk]);

  const activeFactorNames = useMemo(() => {
    if (formData.ascvd_veryHighRisk) return [];
    return riskFactors.filter(f => f.checked).map(f => RISK_FACTOR_SHORT_NAMES[f.key]);
  }, [riskFactors, formData.ascvd_veryHighRisk]);

  // KDIGO Statin 권고
  const kdigoResult = useMemo(() => {
    if (!selectedDiseases.includes('CKD')) return null;
    return getKDIGOStatin({
      age: Number(patientInfo.age),
      egfr: egfr ? Number(egfr) : null,
      hasDM: selectedDiseases.includes('DM'),
      isVeryHighRisk: formData.ascvd_veryHighRisk,
      isDialysis: formData.ckd_dialysis,
    });
  }, [patientInfo.age, egfr, selectedDiseases, formData.ascvd_veryHighRisk, formData.ckd_dialysis]);

  // 텍스트 생성 + V/S 데이터 전달
  useEffect(() => {
    const vs = { sbp: formData.vs_sbp, dbp: formData.vs_dbp, pr: formData.vs_pr, bt: formData.vs_bt };
    onChange?.(generateOText(formData, selectedDiseases, bmi, egfr, ascvdResult, activeFactorNames, kdigoResult), vs);
  }, [formData, selectedDiseases, bmi, egfr, ascvdResult, activeFactorNames, kdigoResult, onChange]);

  const hasThyroid = selectedDiseases.includes('Hypothyroidism') || selectedDiseases.includes('Hyperthyroidism');

  return (
    <div className="space-y-4">
      <VSSection data={formData} set={set} />
      <BodySection data={formData} set={set} bmi={bmi} />

      {selectedDiseases.includes('DM') && (
        <DMOSection data={formData} set={set} />
      )}
      {selectedDiseases.includes('Dyslipidemia') && (
        <DyslipidemiaOSection
          data={formData}
          set={set}
          riskFactors={riskFactors}
          ascvdResult={ascvdResult}
        />
      )}
      {selectedDiseases.includes('Osteoporosis') && (
        <OsteoporosisOSection data={formData} set={set} />
      )}
      {selectedDiseases.includes('CKD') && (
        <CKDOSection data={formData} set={set} egfr={egfr} kdigoResult={kdigoResult} />
      )}
      {hasThyroid && (
        <ThyroidOSection data={formData} set={set} />
      )}
    </div>
  );
}
