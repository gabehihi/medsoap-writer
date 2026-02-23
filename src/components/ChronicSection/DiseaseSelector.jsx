const NON_THYROID_DISEASES = [
  { id: 'HTN',          label: '고혈압' },
  { id: 'DM',           label: '당뇨병' },
  { id: 'Dyslipidemia', label: '이상지질혈증' },
  { id: 'Osteoporosis', label: '골다공증' },
  { id: 'CKD',          label: '만성콩팥병' },
];

const THYROID_TYPES = [
  { id: 'Hypothyroidism', label: '갑상선기능저하증' },
  { id: 'Hyperthyroidism', label: '갑상선기능항진증' },
];

export default function DiseaseSelector({ selected, setSelected }) {
  const thyroidSelected =
    selected.includes('Hypothyroidism') || selected.includes('Hyperthyroidism');
  const thyroidType = selected.includes('Hyperthyroidism')
    ? 'Hyperthyroidism'
    : 'Hypothyroidism';

  function toggleDisease(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  }

  function toggleThyroid() {
    if (thyroidSelected) {
      setSelected(prev =>
        prev.filter(d => d !== 'Hypothyroidism' && d !== 'Hyperthyroidism')
      );
    } else {
      setSelected(prev => [...prev, 'Hypothyroidism']);
    }
  }

  function changeThyroidType(type) {
    setSelected(prev => [
      ...prev.filter(d => d !== 'Hypothyroidism' && d !== 'Hyperthyroidism'),
      type,
    ]);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
      <h2 className="text-base font-semibold text-slate-700 mb-3">만성질환 선택</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {NON_THYROID_DISEASES.map(({ id, label }) => {
          const active = selected.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggleDisease(id)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors text-left ${
                active
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <div className="font-semibold">{id}</div>
              <div className={`text-xs mt-0.5 ${active ? 'text-blue-100' : 'text-slate-400'}`}>
                {label}
              </div>
            </button>
          );
        })}

        {/* Thyroid 버튼 */}
        <button
          onClick={toggleThyroid}
          className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors text-left ${
            thyroidSelected
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <div className="font-semibold">Thyroid</div>
          <div className={`text-xs mt-0.5 ${thyroidSelected ? 'text-blue-100' : 'text-slate-400'}`}>
            갑상선
          </div>
        </button>
      </div>

      {/* Thyroid 세부 선택 */}
      {thyroidSelected && (
        <div className="mt-3 pl-3 border-l-2 border-blue-300">
          <p className="text-xs text-slate-500 mb-2">갑상선 질환 유형 선택</p>
          <div className="flex gap-4">
            {THYROID_TYPES.map(({ id, label }) => (
              <label key={id} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="thyroid-type"
                  value={id}
                  checked={thyroidType === id}
                  onChange={() => changeThyroidType(id)}
                  className="accent-blue-600"
                />
                <span className="text-sm text-slate-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
