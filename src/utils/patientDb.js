const STORAGE_KEY = 'medsoap_patients';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(patients) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}

export function getAllPatients() {
  return load();
}

export function getPatient(id) {
  return load().find(p => p.id === id) ?? null;
}

export function addPatient(data) {
  const patients = load();
  const patient = {
    id: crypto.randomUUID(),
    name: data.name ?? '',
    birthYear: data.birthYear ?? 0,
    sex: data.sex ?? '남',
    chartNo: data.chartNo ?? '',
    diseases: data.diseases ?? [],
    createdAt: new Date().toISOString(),
    visits: [],
  };
  patients.push(patient);
  save(patients);
  return patient;
}

export function updatePatient(id, patch) {
  const patients = load();
  const idx = patients.findIndex(p => p.id === id);
  if (idx === -1) return null;
  patients[idx] = { ...patients[idx], ...patch };
  save(patients);
  return patients[idx];
}

export function deletePatient(id) {
  const patients = load().filter(p => p.id !== id);
  save(patients);
}

export function addVisit(patientId, visit) {
  const patients = load();
  const idx = patients.findIndex(p => p.id === patientId);
  if (idx === -1) return null;
  const newVisit = { id: crypto.randomUUID(), ...visit };
  patients[idx].visits = [newVisit, ...patients[idx].visits]
    .sort((a, b) => b.date.localeCompare(a.date));
  save(patients);
  return newVisit;
}

export function deleteVisit(patientId, visitId) {
  const patients = load();
  const idx = patients.findIndex(p => p.id === patientId);
  if (idx === -1) return;
  patients[idx].visits = patients[idx].visits.filter(v => v.id !== visitId);
  save(patients);
}

export function searchPatients(query) {
  const all = load();
  if (!query) return all;
  const q = query.toLowerCase();
  return all.filter(p =>
    p.name.toLowerCase().includes(q) || p.chartNo.toLowerCase().includes(q)
  );
}

export function exportJSON() {
  return JSON.stringify(load(), null, 2);
}

export function importJSON(jsonStr) {
  const data = JSON.parse(jsonStr);
  if (!Array.isArray(data)) throw new Error('올바른 형식이 아닙니다.');
  save(data);
}
