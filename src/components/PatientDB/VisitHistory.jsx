import { useState } from 'react';

export default function VisitHistory({ visits, onDelete }) {
  const [openId, setOpenId] = useState(null);

  if (visits.length === 0) {
    return <p className="text-sm text-slate-400 italic">방문 기록이 없습니다.</p>;
  }

  return (
    <div className="space-y-2">
      {visits.map(visit => (
        <div key={visit.id} className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenId(prev => prev === visit.id ? null : visit.id)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
          >
            <span className="text-sm font-medium text-slate-700">{visit.date}</span>
            <div className="flex items-center gap-3">
              {visit.sbp && visit.dbp && (
                <span className="text-xs text-slate-500">BP {visit.sbp}/{visit.dbp}</span>
              )}
              {visit.hba1c && (
                <span className="text-xs text-slate-500">HbA1c {visit.hba1c}%</span>
              )}
              {visit.egfr && (
                <span className="text-xs text-slate-500">eGFR {visit.egfr}</span>
              )}
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform ${openId === visit.id ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {openId === visit.id && (
            <div className="px-4 py-3 bg-white space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
                {visit.sbp && <span className="text-slate-600">BP: {visit.sbp}/{visit.dbp} mmHg</span>}
                {visit.pr && <span className="text-slate-600">PR: {visit.pr} bpm</span>}
                {visit.bt && <span className="text-slate-600">BT: {visit.bt}℃</span>}
                {visit.weight && <span className="text-slate-600">체중: {visit.weight}kg</span>}
                {visit.bmi && <span className="text-slate-600">BMI: {visit.bmi}</span>}
                {visit.waist && <span className="text-slate-600">허리: {visit.waist}cm</span>}
                {visit.hba1c && <span className="text-slate-600">HbA1c: {visit.hba1c}%</span>}
                {visit.bst && <span className="text-slate-600">BST: {visit.bst} mg/dL</span>}
                {visit.ldl && <span className="text-slate-600">LDL: {visit.ldl} mg/dL</span>}
                {visit.egfr && <span className="text-slate-600">eGFR: {visit.egfr}</span>}
                {visit.acr && <span className="text-slate-600">ACR: {visit.acr}</span>}
                {visit.tsh && <span className="text-slate-600">TSH: {visit.tsh}</span>}
                {visit.ft4 && <span className="text-slate-600">FT4: {visit.ft4}</span>}
                {visit.ast && <span className="text-slate-600">AST: {visit.ast}</span>}
                {visit.alt && <span className="text-slate-600">ALT: {visit.alt}</span>}
                {visit.vitD && <span className="text-slate-600">Vit D: {visit.vitD} ng/mL</span>}
                {visit.hb && <span className="text-slate-600">Hb: {visit.hb} g/dL</span>}
                {visit.tscore && <span className="text-slate-600">T-score: {visit.tscore}</span>}
              </div>

              {visit.soapText && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500 mb-1.5">SOAP 기록</p>
                  <pre className="text-xs text-slate-600 whitespace-pre-wrap bg-slate-50 p-2.5 rounded-lg leading-relaxed">
                    {visit.soapText}
                  </pre>
                </div>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(visit.id)}
                  className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                >
                  이 방문 기록 삭제
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
