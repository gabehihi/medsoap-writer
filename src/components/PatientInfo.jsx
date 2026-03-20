export default function PatientInfo({ patientInfo, setPatientInfo }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
      <h2 className="text-sm font-semibold text-slate-700 mb-3">환자 기본정보</h2>
      <div className="flex gap-3 items-center flex-wrap">
        <div className="flex items-center gap-1.5">
          <label htmlFor="patient-age" className="text-xs text-slate-500">나이</label>
          <input
            id="patient-age"
            type="number"
            value={patientInfo.age}
            onChange={e => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
            placeholder="세"
            min="0"
            max="120"
            className="w-16 px-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-xs text-slate-400">세</span>
        </div>
        <fieldset className="flex gap-1" role="radiogroup" aria-label="성별">
          {['남', '여'].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setPatientInfo(prev => ({ ...prev, sex: prev.sex === s ? '' : s }))}
              aria-pressed={patientInfo.sex === s}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                patientInfo.sex === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </fieldset>
      </div>
    </div>
  );
}
