import { useState } from 'react';
import { getPatient, updatePatient, deleteVisit } from '../../utils/patientDb';
import LabChart from './LabChart';
import VisitHistory from './VisitHistory';
import PatientForm from './PatientForm';

export default function PatientDetail({ patientId, onBack }) {
  const [patient, setPatient] = useState(() => getPatient(patientId));
  const [editing, setEditing] = useState(false);
  const currentYear = new Date().getFullYear();

  function reload() {
    setPatient(getPatient(patientId));
  }

  function handleSaveEdit(data) {
    updatePatient(patientId, data);
    reload();
    setEditing(false);
  }

  function handleDeleteVisit(visitId) {
    if (window.confirm('이 방문 기록을 삭제하시겠습니까?')) {
      deleteVisit(patientId, visitId);
      reload();
    }
  }

  if (!patient) {
    return <p className="text-sm text-red-500">환자를 찾을 수 없습니다.</p>;
  }

  if (editing) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <PatientForm
          initial={patient}
          onSave={handleSaveEdit}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  const latestVisit = patient.visits[0];

  return (
    <div className="space-y-4">
      {/* 뒤로가기 */}
      <button
        onClick={onBack}
        className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors"
      >
        ← 목록으로
      </button>

      {/* 환자 헤더 */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-800">{patient.name}</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {currentYear - patient.birthYear}세 · {patient.sex}
              {patient.chartNo ? ` · 차트번호: ${patient.chartNo}` : ''}
            </p>
            {patient.diseases.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {patient.diseases.map(d => (
                  <span key={d} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                    {d}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setEditing(true)}
            className="shrink-0 text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            편집
          </button>
        </div>
      </div>

      {/* 최근 수치 */}
      {latestVisit && (
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-slate-600 mb-3">
            최근 수치{' '}
            <span className="font-normal text-slate-400 text-xs">({latestVisit.date})</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
            {[
              { label: 'BP', value: latestVisit.sbp && latestVisit.dbp ? `${latestVisit.sbp}/${latestVisit.dbp} mmHg` : null },
              { label: 'PR', value: latestVisit.pr ? `${latestVisit.pr} bpm` : null },
              { label: 'BMI', value: latestVisit.bmi || null },
              { label: '허리둘레', value: latestVisit.waist ? `${latestVisit.waist} cm` : null },
              { label: 'HbA1c', value: latestVisit.hba1c ? `${latestVisit.hba1c}%` : null },
              { label: 'LDL', value: latestVisit.ldl ? `${latestVisit.ldl} mg/dL` : null },
              { label: 'eGFR', value: latestVisit.egfr || null },
              { label: 'TSH', value: latestVisit.tsh || null },
              { label: 'AST/ALT', value: (latestVisit.ast || latestVisit.alt) ? `${latestVisit.ast || '-'}/${latestVisit.alt || '-'}` : null },
              { label: 'Vit D', value: latestVisit.vitD ? `${latestVisit.vitD} ng/mL` : null },
              { label: 'Hb', value: latestVisit.hb ? `${latestVisit.hb} g/dL` : null },
            ].filter(item => item.value).map(item => (
              <div key={item.label} className="flex justify-between items-center text-xs">
                <span className="text-slate-400">{item.label}</span>
                <span className="font-medium text-slate-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 시계열 차트 */}
      {patient.visits.length >= 2 && (
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-slate-600 mb-4">시계열 추세</h4>
          <LabChart visits={patient.visits} patientDiseases={patient.diseases} />
        </div>
      )}

      {/* 방문 내역 */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-slate-600 mb-3">
          방문 내역{' '}
          <span className="text-slate-400 font-normal">({patient.visits.length}회)</span>
        </h4>
        <VisitHistory visits={patient.visits} onDelete={handleDeleteVisit} />
      </div>
    </div>
  );
}
