import { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import PatientInfo from './components/PatientInfo';
import DiseaseSelector from './components/ChronicSection/DiseaseSelector';
import SSection from './components/ChronicSection/SSection';
import OSection from './components/ChronicSection/OSection';
import ASection from './components/ChronicSection/ASection';
import PSection from './components/ChronicSection/PSection';
import SymptomSelector from './components/AcuteSection/SymptomSelector';
import AcuteOSection from './components/AcuteSection/OSection';
import AcuteASection from './components/AcuteSection/ASection';
import AcutePSection from './components/AcuteSection/PSection';
import SoapPreview from './components/SoapPreview';
import PatientSelector from './components/PatientSelector';
import { formatSOAP } from './utils/soapFormatter';
import { calcBMI } from './utils/bmi';
import { calcEGFR } from './utils/egfr';
import { addVisit } from './utils/patientDb';

const PatientDBView = lazy(() => import('./components/PatientDB/PatientDBView'));

const INITIAL_PATIENT_INFO = { age: '', sex: '' };

// ── 접기/펼치기 카드 ──────────────────────────────────────────

function CollapsibleCard({ title, defaultOpen = true, accentColor = 'blue', children }) {
  const [open, setOpen] = useState(defaultOpen);
  const borderColor = accentColor === 'orange' ? 'border-orange-200' : 'border-slate-200';
  const titleColor = accentColor === 'orange' ? 'text-orange-700' : 'text-slate-700';

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${borderColor} transition-shadow`}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <h2 className={`text-sm font-semibold ${titleColor}`}>{title}</h2>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

// ── 메인 앱 ───────────────────────────────────────────────────

function App() {
  const [activeTab, setActiveTab] = useState('soap'); // 'soap' | 'db'
  const [patientInfo, setPatientInfo] = useState(INITIAL_PATIENT_INFO);
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [showAcute, setShowAcute] = useState(false);
  const [chronicSText, setChronicSText] = useState('');
  const [chronicOText, setChronicOText] = useState('');
  const [chronicAText, setChronicAText] = useState('');
  const [chronicPText, setChronicPText] = useState('');
  const [acuteSText, setAcuteSText] = useState('');
  const [acuteOText, setAcuteOText] = useState('');
  const [acuteAText, setAcuteAText] = useState('');
  const [acutePText, setAcutePText] = useState('');
  const [chronicVS, setChronicVS] = useState(null);
  const [ckdStageLabel, setCkdStageLabel] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

  // 환자 DB 연동
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prefillData, setPrefillData] = useState(null);
  const [prefillTrigger, setPrefillTrigger] = useState(0);
  const [chronicOFormData, setChronicOFormData] = useState(null);

  const hasChronicDiseases = selectedDiseases.length > 0;

  // ── 핸들러 ────────────────────────────────────────────────────

  const handleSChange = useCallback((text) => setChronicSText(text), []);
  const handleOChange = useCallback((text, vs, extra) => {
    setChronicOText(text);
    if (vs) setChronicVS(vs);
    if (extra?.ckdStageLabel !== undefined) setCkdStageLabel(extra.ckdStageLabel);
  }, []);
  const handleOFormDataChange = useCallback((formData) => {
    setChronicOFormData(formData);
  }, []);
  const handleAChange = useCallback((text) => setChronicAText(text), []);
  const handlePChange = useCallback((text) => setChronicPText(text), []);

  const handleAcuteSChange = useCallback((text) => setAcuteSText(text), []);
  const handleAcuteOChange = useCallback((text) => setAcuteOText(text), []);
  const handleAcuteAChange = useCallback((text) => setAcuteAText(text), []);
  const handleAcutePChange = useCallback((text) => setAcutePText(text), []);

  // 환자 선택: patientInfo 자동 채우기
  function handlePatientSelect(patient) {
    setSelectedPatient(patient);
    setPrefillData(patient.visits[0] ?? null);
    const age = String(new Date().getFullYear() - patient.birthYear);
    setPatientInfo({ age, sex: patient.sex });
  }

  function handlePatientDeselect() {
    setSelectedPatient(null);
    setPrefillData(null);
    setPrefillTrigger(0);
  }

  // 채우기 버튼: prefillTrigger 증가 → OSection useEffect 발동
  function handlePrefill() {
    setPrefillTrigger(t => t + 1);
  }

  // 방문 기록 저장
  function handleSaveVisit() {
    if (!selectedPatient || !chronicOFormData) {
      alert('환자를 선택하고 수치를 입력한 후 저장해주세요.');
      return;
    }
    const sexForCalc = patientInfo.sex === '남' ? 'male' : patientInfo.sex === '여' ? 'female' : null;
    const egfr = calcEGFR(Number(chronicOFormData.ckd_cr), Number(patientInfo.age), sexForCalc);
    const bmi = calcBMI(Number(chronicOFormData.weight), Number(chronicOFormData.height));
    const today = new Date().toISOString().split('T')[0];

    const visit = {
      date: today,
      sbp: chronicOFormData.vs_sbp,
      dbp: chronicOFormData.vs_dbp,
      pr:  chronicOFormData.vs_pr,
      bt:  chronicOFormData.vs_bt,
      height: chronicOFormData.height,
      weight: chronicOFormData.weight,
      waist:  chronicOFormData.waist,
      bmi: bmi ?? '',
      hba1c: chronicOFormData.dm_hba1c,
      bst:   chronicOFormData.dm_bst,
      tc:  chronicOFormData.lipid_tc,
      tg:  chronicOFormData.lipid_tg,
      hdl: chronicOFormData.lipid_hdl,
      ldl: chronicOFormData.lipid_ldl,
      bun: chronicOFormData.ckd_bun,
      cr:  chronicOFormData.ckd_cr,
      acr: chronicOFormData.ckd_acr,
      egfr: egfr ?? '',
      tscore: chronicOFormData.osteo_tscore,
      tsh: chronicOFormData.thyroid_tsh,
      ft4: chronicOFormData.thyroid_ft4,
      vitD: chronicOFormData.vitD,
      ast:  chronicOFormData.ast,
      alt:  chronicOFormData.alt,
      hb:   chronicOFormData.hb,
      otherLabs: chronicOFormData.otherLabs,
      soapText: soapText,
      note: '',
    };

    addVisit(selectedPatient.id, visit);
    // selectedPatient 최신 데이터 반영
    setSelectedPatient(prev => ({
      ...prev,
      visits: [visit, ...prev.visits].sort((a, b) => b.date.localeCompare(a.date)),
    }));
    setPrefillData(visit);
    alert(`${selectedPatient.name} 방문 기록이 저장되었습니다.`);
  }

  function handleReset() {
    if (window.confirm('모든 입력을 초기화하시겠습니까?')) {
      setPatientInfo(INITIAL_PATIENT_INFO);
      setSelectedDiseases([]);
      setShowAcute(false);
      setChronicSText('');
      setChronicOText('');
      setChronicAText('');
      setChronicPText('');
      setAcuteSText('');
      setAcuteOText('');
      setAcuteAText('');
      setAcutePText('');
      setChronicVS(null);
      setCkdStageLabel('');
      setSelectedPatient(null);
      setPrefillData(null);
      setPrefillTrigger(0);
      setChronicOFormData(null);
      setResetKey(k => k + 1);
      setMobilePreviewOpen(false);
    }
  }

  const soapText = useMemo(() => formatSOAP({
    chronicS: chronicSText,
    chronicO: chronicOText,
    chronicA: chronicAText,
    chronicP: chronicPText,
    acuteS: acuteSText,
    acuteO: acuteOText,
    acuteA: acuteAText,
    acuteP: acutePText,
    showChronic: hasChronicDiseases,
    showAcute,
  }), [
    chronicSText, chronicOText, chronicAText, chronicPText,
    acuteSText, acuteOText, acuteAText, acutePText,
    hasChronicDiseases, showAcute,
  ]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl" role="img" aria-label="병원">🏥</span>
            <div>
              <h1 className="text-xl font-bold text-blue-700 leading-tight">MedSOAP Writer</h1>
              <p className="text-xs text-slate-400 hidden sm:block">일차의료 외래 SOAP 의무기록 자동작성</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">v4.0</span>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-slate-200"
            >
              초기화
            </button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <nav className="max-w-screen-xl mx-auto px-4 flex gap-0 border-t border-slate-100">
          {[
            { key: 'soap', label: 'SOAP 작성' },
            { key: 'db',   label: '환자 DB' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'border-b-2 border-blue-600 text-blue-700'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-screen-xl mx-auto px-4 py-5">

        {/* ── 환자 DB 탭 ── */}
        {activeTab === 'db' && (
          <Suspense fallback={<div className="text-sm text-slate-400 py-8 text-center">로딩 중...</div>}>
            <PatientDBView />
          </Suspense>
        )}

        {/* ── SOAP 작성 탭 ── */}
        {activeTab === 'soap' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] gap-5 items-start">

            {/* 왼쪽: 입력 영역 */}
            <div className="space-y-3">
              {/* 환자 DB 연동 */}
              <PatientSelector
                selectedPatient={selectedPatient}
                onSelect={handlePatientSelect}
                onDeselect={handlePatientDeselect}
                onPrefill={handlePrefill}
              />

              <PatientInfo patientInfo={patientInfo} setPatientInfo={setPatientInfo} />
              <DiseaseSelector selected={selectedDiseases} setSelected={setSelectedDiseases} />

              {/* 만성질환 S/O/A/P */}
              {hasChronicDiseases && (
                <>
                  <CollapsibleCard title="S) 주관적 증상">
                    <SSection
                      key={`s-${resetKey}`}
                      selectedDiseases={selectedDiseases}
                      onChange={handleSChange}
                    />
                  </CollapsibleCard>

                  <CollapsibleCard title="O) 객관적 소견">
                    <OSection
                      key={`o-${resetKey}`}
                      selectedDiseases={selectedDiseases}
                      patientInfo={patientInfo}
                      onChange={handleOChange}
                      onFormDataChange={handleOFormDataChange}
                      prefillData={prefillData}
                      prefillTrigger={prefillTrigger}
                    />
                  </CollapsibleCard>

                  <CollapsibleCard title="A) 진단">
                    <ASection
                      key={`a-${resetKey}`}
                      selectedDiseases={selectedDiseases}
                      ckdStageLabel={ckdStageLabel}
                      onChange={handleAChange}
                    />
                  </CollapsibleCard>

                  <CollapsibleCard title="P) 계획">
                    <PSection
                      key={`p-${resetKey}`}
                      onChange={handlePChange}
                    />
                  </CollapsibleCard>

                  {/* 방문 기록 저장 버튼 */}
                  {selectedPatient && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          {selectedPatient.name} 방문 기록
                        </p>
                        <p className="text-xs text-green-600 mt-0.5">
                          현재 SOAP과 수치를 DB에 저장합니다.
                        </p>
                      </div>
                      <button
                        onClick={handleSaveVisit}
                        className="shrink-0 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        방문 기록 저장
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* 감기/장염 토글 + 섹션 */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAcute(prev => !prev)}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                    showAcute
                      ? 'bg-orange-50 text-orange-700 border-orange-300'
                      : 'bg-white text-slate-500 border-dashed border-slate-300 hover:border-slate-400 hover:text-slate-600'
                  }`}
                >
                  {showAcute ? '▲ 감기/장염 섹션 닫기' : '+ 감기/장염 추가'}
                </button>

                {showAcute && (
                  <div className="mt-3 space-y-3">
                    <CollapsibleCard title="S) 증상 선택" accentColor="orange">
                      <SymptomSelector
                        key={`acute-s-${resetKey}`}
                        onChange={handleAcuteSChange}
                      />
                    </CollapsibleCard>

                    <CollapsibleCard title="O) 신체검진" accentColor="orange">
                      <AcuteOSection
                        key={`acute-o-${resetKey}`}
                        chronicVS={chronicVS}
                        onChange={handleAcuteOChange}
                      />
                    </CollapsibleCard>

                    <CollapsibleCard title="A) 진단" accentColor="orange">
                      <AcuteASection
                        key={`acute-a-${resetKey}`}
                        onChange={handleAcuteAChange}
                      />
                    </CollapsibleCard>

                    <CollapsibleCard title="P) 계획" accentColor="orange">
                      <AcutePSection
                        key={`acute-p-${resetKey}`}
                        onChange={handleAcutePChange}
                      />
                    </CollapsibleCard>
                  </div>
                )}
              </div>
            </div>

            {/* 오른쪽: 미리보기 (PC) */}
            <div className="hidden lg:block">
              <SoapPreview soapText={soapText} />
            </div>

          </div>
        )}
      </main>

      {/* 모바일: 하단 플로팅 바 (SOAP 탭에서만) */}
      {activeTab === 'soap' && (
        <div className="fixed bottom-0 inset-x-0 lg:hidden z-40">
          {mobilePreviewOpen && (
            <div className="bg-white border-t border-slate-200 shadow-lg max-h-[60vh] overflow-y-auto">
              <SoapPreview soapText={soapText} compact />
            </div>
          )}
          <div className="bg-white border-t border-slate-200 px-4 py-2 flex gap-2 shadow-lg">
            <button
              type="button"
              onClick={() => setMobilePreviewOpen(prev => !prev)}
              className="flex-1 px-3 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
            >
              {mobilePreviewOpen ? '▼ 닫기' : '▲ 미리보기'}
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!soapText) return;
                try {
                  await navigator.clipboard.writeText(soapText);
                  alert('복사되었습니다!');
                } catch {
                  const ta = document.createElement('textarea');
                  ta.value = soapText;
                  ta.style.position = 'fixed';
                  ta.style.opacity = '0';
                  document.body.appendChild(ta);
                  ta.select();
                  document.execCommand('copy');
                  document.body.removeChild(ta);
                  alert('복사되었습니다!');
                }
              }}
              disabled={!soapText}
              className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                soapText
                  ? 'bg-blue-600 text-white border border-blue-600'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
            >
              📋 복사하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
