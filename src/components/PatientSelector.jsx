import { useState, useEffect, useRef } from 'react';
import { searchPatients } from '../utils/patientDb';

export default function PatientSelector({ selectedPatient, onSelect, onDeselect, onPrefill }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleMouseDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  function handleQueryChange(e) {
    const q = e.target.value;
    setQuery(q);
    const found = searchPatients(q);
    setResults(found);
    setDropdownOpen(found.length > 0);
  }

  function handleSelect(patient) {
    onSelect(patient);
    setQuery('');
    setDropdownOpen(false);
    setResults([]);
  }

  const latestVisit = selectedPatient?.visits?.[0] ?? null;
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4 space-y-3">
      <h2 className="text-sm font-semibold text-blue-700">환자 DB 연동</h2>

      {!selectedPatient ? (
        <div ref={containerRef} className="relative">
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => { if (results.length > 0) setDropdownOpen(true); }}
            placeholder="이름 또는 차트번호로 환자 검색..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {dropdownOpen && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {results.map(patient => (
                <button
                  key={patient.id}
                  onClick={() => handleSelect(patient)}
                  className="w-full text-left px-3 py-2.5 hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-slate-800">{patient.name}</span>
                    <span className="text-xs text-slate-400">
                      {patient.chartNo ? `#${patient.chartNo} · ` : ''}{currentYear - patient.birthYear}세 · {patient.sex}
                    </span>
                  </div>
                  {patient.diseases.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.diseases.map(d => (
                        <span key={d} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                          {d}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
          {query && results.length === 0 && (
            <p className="text-xs text-slate-400 mt-2">검색 결과가 없습니다. DB 탭에서 환자를 먼저 등록하세요.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* 선택된 환자 배지 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {selectedPatient.name}
            </span>
            <span className="text-xs text-slate-500">
              {currentYear - selectedPatient.birthYear}세 · {selectedPatient.sex}
              {selectedPatient.chartNo ? ` · #${selectedPatient.chartNo}` : ''}
            </span>
            <button
              onClick={onDeselect}
              className="ml-auto text-slate-400 hover:text-slate-600 text-sm px-2 py-0.5 rounded hover:bg-slate-100 transition-colors"
            >
              × 해제
            </button>
          </div>

          {/* 이전 수치 패널 */}
          {latestVisit ? (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-xs font-medium text-slate-500 mb-2">
                이전 수치 ({latestVisit.date})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-slate-700">
                {latestVisit.sbp && latestVisit.dbp && (
                  <span>BP: {latestVisit.sbp}/{latestVisit.dbp}</span>
                )}
                {latestVisit.pr && <span>PR: {latestVisit.pr}</span>}
                {latestVisit.bt && <span>BT: {latestVisit.bt}℃</span>}
                {latestVisit.bmi && <span>BMI: {latestVisit.bmi}</span>}
                {latestVisit.waist && <span>허리: {latestVisit.waist}cm</span>}
                {latestVisit.hba1c && <span>HbA1c: {latestVisit.hba1c}%</span>}
                {latestVisit.ldl && <span>LDL: {latestVisit.ldl}</span>}
                {latestVisit.egfr && <span>eGFR: {latestVisit.egfr}</span>}
                {latestVisit.tsh && <span>TSH: {latestVisit.tsh}</span>}
                {(latestVisit.ast || latestVisit.alt) && (
                  <span>AST/ALT: {latestVisit.ast || '-'}/{latestVisit.alt || '-'}</span>
                )}
                {latestVisit.vitD && <span>VitD: {latestVisit.vitD}</span>}
                {latestVisit.hb && <span>Hb: {latestVisit.hb}</span>}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">방문 기록이 없습니다.</p>
          )}

          {/* 채우기 버튼 */}
          {latestVisit && (
            <button
              onClick={onPrefill}
              className="w-full px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              O) 이전 수치 채우기
            </button>
          )}
        </div>
      )}
    </div>
  );
}
