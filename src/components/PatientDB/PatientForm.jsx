import { useState } from 'react';

const ALL_DISEASES = [
  'HTN', 'DM', 'Dyslipidemia', 'Obesity', 'MASLD',
  'Osteoporosis', 'CKD', 'Hypothyroidism', 'Hyperthyroidism',
];

export default function PatientForm({ initial, onSave, onCancel }) {
  const currentYear = new Date().getFullYear();
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    birthYear: initial?.birthYear ? String(initial.birthYear) : '',
    sex: initial?.sex ?? '남',
    chartNo: initial?.chartNo ?? '',
    diseases: initial?.diseases ?? [],
  });

  function set(key, val) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function toggleDisease(d) {
    setForm(prev => ({
      ...prev,
      diseases: prev.diseases.includes(d)
        ? prev.diseases.filter(x => x !== d)
        : [...prev.diseases, d],
    }));
  }

  function handleSave() {
    if (!form.name.trim()) { alert('이름을 입력하세요.'); return; }
    if (!form.birthYear || isNaN(Number(form.birthYear))) { alert('출생연도를 입력하세요.'); return; }
    onSave({
      name: form.name.trim(),
      birthYear: Number(form.birthYear),
      sex: form.sex,
      chartNo: form.chartNo.trim(),
      diseases: form.diseases,
    });
  }

  return (
    <div className="space-y-5">
      <h3 className="text-base font-semibold text-slate-700">
        {initial ? '환자 정보 수정' : '신규 환자 등록'}
      </h3>

      <div className="space-y-3">
        {/* 이름 */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600 w-20 shrink-0">이름 *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="홍길동"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 출생연도 */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600 w-20 shrink-0">출생연도 *</label>
          <input
            type="number"
            value={form.birthYear}
            onChange={e => set('birthYear', e.target.value)}
            placeholder="1970"
            min={currentYear - 120}
            max={currentYear}
            className="w-28 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {form.birthYear && !isNaN(Number(form.birthYear)) && (
            <span className="text-sm text-slate-500">
              {currentYear - Number(form.birthYear)}세
            </span>
          )}
        </div>

        {/* 성별 */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600 w-20 shrink-0">성별 *</label>
          <div className="flex gap-2">
            {['남', '여'].map(s => (
              <button
                key={s}
                onClick={() => set('sex', s)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  form.sex === s
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 차트번호 */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600 w-20 shrink-0">차트번호</label>
          <input
            type="text"
            value={form.chartNo}
            onChange={e => set('chartNo', e.target.value)}
            placeholder="선택 입력"
            className="w-40 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 질환 */}
        <div className="space-y-2">
          <label className="text-sm text-slate-600">만성질환 (선택)</label>
          <div className="grid grid-cols-3 gap-2">
            {ALL_DISEASES.map(d => (
              <button
                key={d}
                onClick={() => toggleDisease(d)}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors text-left ${
                  form.diseases.includes(d)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          저장
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  );
}
