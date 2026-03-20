import { useState, useEffect, useRef } from 'react';
import { searchPatients, deletePatient, exportJSON, importJSON } from '../../utils/patientDb';

export default function PatientList({ onSelect, onAdd, refreshKey }) {
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const fileInputRef = useRef(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setPatients(searchPatients(query));
  }, [query, refreshKey]);

  function handleDelete(e, id, name) {
    e.stopPropagation();
    if (window.confirm(`"${name}" 환자를 삭제하시겠습니까?\n방문 기록도 함께 삭제됩니다.`)) {
      deletePatient(id);
      setPatients(searchPatients(query));
    }
  }

  function handleExport() {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medsoap_patients_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        importJSON(ev.target.result);
        setPatients(searchPatients(query));
        alert('가져오기 완료!');
      } catch {
        alert('파일 형식이 올바르지 않습니다.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="space-y-4">
      {/* 검색 + 신규 등록 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="이름 또는 차트번호 검색..."
          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + 신규
        </button>
      </div>

      {/* JSON 백업/복원 */}
      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors border border-slate-200"
        >
          JSON 내보내기
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors border border-slate-200"
        >
          JSON 가져오기
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </div>

      {/* 환자 목록 */}
      {patients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-slate-400 italic">
            {query ? '검색 결과가 없습니다.' : '등록된 환자가 없습니다.'}
          </p>
          {!query && (
            <p className="text-xs text-slate-300 mt-1">
              "+ 신규" 버튼으로 첫 환자를 등록하세요.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {patients.map(patient => (
            <div
              key={patient.id}
              className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => onSelect(patient)}
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-slate-800">{patient.name}</span>
                  <span className="text-xs text-slate-400">
                    {currentYear - patient.birthYear}세 · {patient.sex}
                    {patient.chartNo ? ` · #${patient.chartNo}` : ''}
                  </span>
                  <span className="text-xs text-slate-300 ml-auto shrink-0">
                    {patient.visits.length > 0 ? `${patient.visits.length}회 방문` : '방문 없음'}
                  </span>
                </div>
                {patient.diseases.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {patient.diseases.map(d => (
                      <span key={d} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                        {d}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={e => handleDelete(e, patient.id, patient.name)}
                className="shrink-0 text-slate-300 hover:text-red-500 transition-colors text-sm w-7 h-7 flex items-center justify-center rounded hover:bg-red-50"
                aria-label="삭제"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
