import { useState } from 'react';
import { addPatient } from '../../utils/patientDb';
import PatientList from './PatientList';
import PatientForm from './PatientForm';
import PatientDetail from './PatientDetail';

export default function PatientDBView() {
  const [view, setView] = useState('list'); // 'list' | 'form' | 'detail'
  const [selectedId, setSelectedId] = useState(null);
  const [listRefreshKey, setListRefreshKey] = useState(0);

  function refreshList() {
    setListRefreshKey(k => k + 1);
  }

  function handleAddPatient(data) {
    addPatient(data);
    refreshList();
    setView('list');
  }

  function handleSelectPatient(patient) {
    setSelectedId(patient.id);
    setView('detail');
  }

  return (
    <div>
      {view === 'list' && (
        <PatientList
          onSelect={handleSelectPatient}
          onAdd={() => setView('form')}
          refreshKey={listRefreshKey}
        />
      )}
      {view === 'form' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <PatientForm
            onSave={handleAddPatient}
            onCancel={() => setView('list')}
          />
        </div>
      )}
      {view === 'detail' && selectedId && (
        <PatientDetail
          patientId={selectedId}
          onBack={() => { setView('list'); refreshList(); }}
        />
      )}
    </div>
  );
}
