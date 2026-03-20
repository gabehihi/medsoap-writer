# MedSOAP Writer

## 프로젝트 개요
일차의료 외래 진료 의사를 위한 SOAP 의무기록 자동작성 웹앱.
브라우저에서만 동작 (서버/DB 없음). 입력 → 실시간 미리보기 → 복사 → OCS/EMR 붙여넣기.

## 기술 스택
- React + Vite (v7)
- Tailwind CSS v4 (`@tailwindcss/postcss` 방식)
- 배포: GitHub Pages (gh-pages)

## 핵심 자동계산 로직
- BMI: 체중(kg) / 키(m)² → `utils/bmi.js` (구현 완료)
- eGFR: CKD-EPI Creatinine 2021 (race-free) → `utils/egfr.js` (구현 완료)
- ASCVD 위험도: 한국지질·동맥경화학회 이상지질혈증 진료지침 제5판 (2022) → `utils/ascvd.js` (구현 완료)
- KDIGO Statin 권고: KDIGO 2024 CKD Guideline Rec. 3.15.1 → `utils/kdigo_statin.js` (구현 완료)
- CKD stage: KDIGO 2024 GFR category → `utils/ckd_stage.js` (v3 신규)
- HTN 위험군: 2022 대한고혈압학회 진료지침 → `utils/htn_risk.js` (v3 신규)

## 개발 범위 (v2)
- 만성질환군: HTN, DM, Dyslipidemia, Osteoporosis, CKD, Thyroid
- 감기/장염군
- 두 군 동시 사용 가능

## 개발 범위 (v3)
- F1: 감기/장염 진단명 9종으로 확장
- F2: CKD — KDIGO 2024 기반 CKD stage 자동 분류 + A) 자동 반영
- F3: CKD — ACR 입력칸 추가 (선택 입력)
- F4: DM — 식사 인슐린 아침-점심-저녁 3칸 분리
- F5: HTN — 2022 대한고혈압학회 심뇌혈관위험군 분류 + 혈압 조절 목표

## 개발 범위 (v3.1)
- F6: 만성질환 S) — "기타 증상" textarea 추가 (otherSymptoms 필드)
- F7: 만성질환 A) — 추가 진단명 단일 입력 → 동적 배열 입력으로 교체 (extraDxList)
- F8: 만성질환 O) — 기타 검사 수치 동적 입력 추가 (otherLabs)
- F9: 감기/장염 S) — 증상 시작일/지속 기간 입력 추가 (onsetType·duration·onsetDate)

## 개발 범위 (v3.2)
- F10: 감기/장염 S) — 주증상(CC) 단일 선택 기능 추가 (chiefComplaint state)
  - (+) 토글된 증상 중 하나를 CC로 지정 → onset line에 "X일 전부터 [CC] 호소" 반영
  - CC 미지정 시 onset line: "X일 전부터 증상 시작."
  - CC로 지정된 증상을 un-toggle 시 CC 자동 초기화

## 출력 포맷
- S / O / A / P 줄바꿈 형태
- O)에 이전값 없음 (v2는 DB 없음)
- 복사 버튼으로 전체 텍스트 클립보드 복사

## 폴더 구조
```
aro/src/
├── components/
│   ├── PatientInfo.jsx          ← 환자 기본정보 (나이, 성별)
│   ├── ChronicSection/
│   │   ├── DiseaseSelector.jsx  ← 만성질환 pill 선택 + Thyroid 세부
│   │   ├── SSection.jsx         ← S) 주관적 증상 (HTN·DM·공통)
│   │   ├── OSection.jsx         ← O) 객관적 소견 + ASCVD·KDIGO·CKD stage·HTN 위험군 자동평가
│   │   ├── ASection.jsx         ← A) 진단명 자동 나열 + 추가 진단
│   │   └── PSection.jsx         ← P) 교육/관리 체크박스 + 추가 계획
│   ├── AcuteSection/
│   │   ├── SymptomSelector.jsx  ← S) 증상 (+)/(-) pill 토글 (6카테고리 26증상)
│   │   ├── OSection.jsx         ← O) 신체검진 세그먼트 컨트롤 (V/S·외관·PI/PTH·호흡음·복부·CVAT)
│   │   ├── ASection.jsx         ← A) 퀵 진단명 버튼 + 자유입력
│   │   └── PSection.jsx         ← P) 계획 체크박스 + 자유입력
│   ├── SoapPreview.jsx          ← SOAP 미리보기 (sticky, S/O/A/P 라벨 bold, CopyButton 내장)
│   └── CopyButton.jsx           ← 클립보드 복사 + "복사됨!" 피드백
├── utils/
│   ├── egfr.js                  ← calcEGFR(scr, age, sex) — CKD-EPI 2021
│   ├── bmi.js                   ← calcBMI(weightKg, heightCm)
│   ├── ascvd.js                 ← classifyASCVD(), isAgeRisk()
│   ├── kdigo_statin.js          ← getKDIGOStatin()
│   ├── ckd_stage.js             ← getCKDStage() — KDIGO 2024 CKD stage 분류
│   ├── htn_risk.js              ← classifyHTNRisk() — 2022 대한고혈압학회 위험군
│   └── soapFormatter.js         ← formatSOAP() — 만성+감기 통합 SOAP 텍스트 생성
├── App.jsx
└── main.jsx
```

## 현재 개발 상태
- [x] Phase 1: 프로젝트 셋업
- [x] Phase 2: 환자 기본정보 + 만성질환 선택 UI
- [x] Phase 3: 만성질환 S/O/A/P 입력
  - [x] Phase 3-1: S) 섹션 — HTN, DM, 공통 항목
  - [x] Phase 3-2: O) 섹션 — V/S, 신체계측(BMI자동), 질환별 검사(eGFR자동)
  - [x] Phase 3-3: ASCVD 위험도 + KDIGO Statin 권고 (O 섹션 내 통합)
  - [x] Phase 3-4: A) 섹션 — 진단명 자동 나열 + 추가 진단
  - [x] Phase 3-5: P) 섹션 — 교육/관리 체크박스 + 추가 계획
- [x] Phase 4: 감기/장염 S/O/A/P 입력
- [x] Phase 5: 실시간 미리보기 + 복사
- [x] Phase 6: UI 개선 + 반응형
- [x] Phase 7: 테스트 + 버그 수정
- [x] Phase 8: GitHub Pages 배포
- [x] Phase 9: v3.0 업그레이드
  - [x] F1: 감기/장염 진단명 9종으로 확장
  - [x] F2: CKD — KDIGO 2024 기반 CKD stage 자동 분류 + A) 자동 반영
  - [x] F3: CKD — ACR 입력칸 추가 (선택 입력)
  - [x] F4: DM — 식사 인슐린 아침-점심-저녁 3칸 분리
  - [x] F5: HTN — 2022 대한고혈압학회 심뇌혈관위험군 분류 + 혈압 조절 목표
- [x] Phase 10: v3.1 업그레이드
  - [x] F6: 만성질환 S) — "기타 증상" textarea 추가 (otherSymptoms 필드)
  - [x] F7: 만성질환 A) — 추가 진단명 단일 입력 → 동적 배열 입력으로 교체 (extraDxList)
  - [x] F8: 만성질환 O) — 기타 검사 수치 동적 입력 추가 (otherLabs)
  - [x] F9: 감기/장염 S) — 증상 시작일/지속 기간 입력 추가 (onsetType·duration·onsetDate)
- [x] Phase 11: v3.2 업그레이드
  - [x] F10: 감기/장염 S) — 주증상(CC) 단일 선택 기능 추가 (chiefComplaint state + CC selector UI)

## App.jsx 전역 상태 구조
```javascript
const [patientInfo, setPatientInfo] = useState({ age: '', sex: '' });
const [selectedDiseases, setSelectedDiseases] = useState([]);
// selectedDiseases 예시: ['HTN', 'DM', 'Hypothyroidism']
// Thyroid는 'Thyroid'가 아닌 'Hypothyroidism' | 'Hyperthyroidism'으로 저장됨

const [showAcute, setShowAcute] = useState(false);

// 만성질환 텍스트
const [chronicSText, setChronicSText] = useState('');
const [chronicOText, setChronicOText] = useState('');
const [chronicAText, setChronicAText] = useState('');
const [chronicPText, setChronicPText] = useState('');

// 감기/장염 텍스트
const [acuteSText, setAcuteSText] = useState('');
const [acuteOText, setAcuteOText] = useState('');
const [acuteAText, setAcuteAText] = useState('');
const [acutePText, setAcutePText] = useState('');

// 만성질환 V/S → 감기/장염으로 전달용
const [chronicVS, setChronicVS] = useState(null);
// chronicVS 형태: { sbp, dbp, pr, bt } — ChronicSection OSection onChange 2번째 인자로 전달됨

// CKD stage label — OSection onChange 3번째 인자로 수신 (v3 추가)
const [ckdStageLabel, setCkdStageLabel] = useState('');

const [resetKey, setResetKey] = useState(0);

// 모바일 미리보기 토글
const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

// 최종 SOAP 텍스트 (soapFormatter 사용, useMemo로 캐싱)
const soapText = useMemo(() => formatSOAP({
  chronicS: chronicSText, chronicO: chronicOText,
  chronicA: chronicAText, chronicP: chronicPText,
  acuteS: acuteSText, acuteO: acuteOText,
  acuteA: acuteAText, acuteP: acutePText,
  showChronic: hasChronicDiseases, showAcute,
}), [chronicSText, chronicOText, ..., showAcute]);
```

## 컴포넌트 Props 인터페이스 (구현 완료분)
```javascript
// PatientInfo.jsx
<PatientInfo
  patientInfo={{ age: string, sex: '' | '남' | '여' }}
  setPatientInfo={fn}
/>

// DiseaseSelector.jsx
<DiseaseSelector
  selected={string[]}   // 예: ['HTN', 'Hypothyroidism']
  setSelected={fn}
/>

// SSection.jsx
<SSection
  key={`s-${resetKey}`}              // 초기화 시 리마운트
  selectedDiseases={string[]}        // 선택된 질환 목록
  onChange={(sText: string) => void} // 생성된 S) 텍스트 콜백
/>

// OSection.jsx (만성질환)
<OSection
  key={`o-${resetKey}`}
  selectedDiseases={string[]}
  patientInfo={{ age, sex }}
  onChange={(oText: string, vs: { sbp, dbp, pr, bt }, extra: { ckdStageLabel: string }) => void}
  // onChange 2번째 인자: V/S 데이터 → App에서 chronicVS로 저장
  // onChange 3번째 인자: { ckdStageLabel } → App에서 setCkdStageLabel (v3 추가)
/>

// ASection.jsx
<ASection
  key={`a-${resetKey}`}              // 초기화 시 리마운트
  selectedDiseases={string[]}        // 선택된 질환 목록 (고정 순서로 나열)
  ckdStageLabel={string}             // 예: 'CKD stage IIIb (eGFR 43 ml/min/1.73m²)' (v3 추가)
  onChange={(aText: string) => void} // 생성된 A) 텍스트 콜백
/>

// PSection.jsx (만성질환)
<PSection
  key={`p-${resetKey}`}
  onChange={(pText: string) => void}
/>

// ── AcuteSection ──

// SymptomSelector.jsx
<SymptomSelector
  key={`acute-s-${resetKey}`}
  onChange={(sText: string) => void}  // 카테고리별 증상(+)/(-) 텍스트
/>

// AcuteSection/OSection.jsx
<AcuteOSection
  key={`acute-o-${resetKey}`}
  chronicVS={{ sbp, dbp, pr, bt } | null}  // 만성질환 V/S (가져오기용)
  onChange={(oText: string) => void}
/>

// AcuteSection/ASection.jsx
<AcuteASection
  key={`acute-a-${resetKey}`}
  onChange={(aText: string) => void}  // "# 진단명" 형태
/>

// AcuteSection/PSection.jsx
<AcutePSection
  key={`acute-p-${resetKey}`}
  onChange={(pText: string) => void}
/>

// ── 미리보기 + 복사 ──

// SoapPreview.jsx
<SoapPreview
  soapText={string}       // formatSOAP() 반환값
  compact={boolean}       // true=모바일용 (max-h-48, CopyButton 숨김). 기본 false
/>
// PC: lg:sticky lg:top-16, CopyButton 내장
// 모바일: compact=true로 하단 패널에서 사용

// CopyButton.jsx
<CopyButton
  text={string}  // 복사할 텍스트 (빈 문자열이면 disabled)
/>
```

## SSection 내부 상태 구조
```javascript
// 각 항목은 { ox: 'O'|'X', ...세부필드 } 형태
// set(key, patch) 헬퍼로 부분 업데이트
// ※ otherSymptoms만 예외: 단순 string이므로 set() 미사용, setFormData 직접 호출
const INITIAL_FORM = {
  // 공통
  specialSymptom:   { ox: 'X', text: '' },
  sideEffect:       { ox: 'X', text: '' },
  // HTN
  htn_homeBP:       { ox: 'X', sbp: '', dbp: '' },
  htn_orthostatic:  { ox: 'X', text: '' },
  // DM
  dm_homeGlucose:   { ox: 'X', fbs: '', ppg: '' },
  dm_hypoglycemia:  { ox: 'X', symptoms: [], time: '' },
  dm_insulin:       { ox: 'X', basal: '', mealAM: '', mealMD: '', mealPM: '' },
  // 기타 증상 (v3.1 추가) — 단순 string, OX 토글 없음
  otherSymptoms:    '',
};
```

## OSection 내부 상태 구조
```javascript
// O 섹션은 단순 키-값 (OX 토글 없이 직접 입력)
// set(key, value) 헬퍼로 업데이트
const INITIAL_FORM = {
  // V/S
  vs_sbp: '', vs_dbp: '', vs_pr: '', vs_bt: '',
  // 신체 계측
  height: '', weight: '',
  // DM
  dm_hba1c: '', dm_bst: '',
  // Dyslipidemia
  lipid_tc: '', lipid_tg: '', lipid_hdl: '', lipid_ldl: '',
  // Osteoporosis
  osteo_tscore: '',
  // CKD
  ckd_bun: '', ckd_cr: '',
  ckd_acr: '',                  // ACR (선택 입력, v3 추가)
  ckd_dialysis: false,          // 투석 여부 (KDIGO 분기)
  // Thyroid
  thyroid_tsh: '', thyroid_ft4: '',
  // ASCVD 위험인자 (수동 체크)
  ascvd_veryHighRisk: false,    // 초고위험군 별도 체크
  ascvd_familyHistory: false,   // 조기 심혈관질환 가족력
  ascvd_smoking: false,         // 흡연
  // HTN 심뇌혈관위험군 (v3 추가)
  htn_cardiovascular: false,   // 심혈관질환 기왕력
  // 기타 검사 수치 (v3.1 추가)
  otherLabs: [{ name: '', value: '', unit: '' }],  // 최대 15개
};
// BMI, eGFR, CKD stage, ASCVD 분류, KDIGO 권고, HTN 위험군은 useMemo로 실시간 자동계산
```

## ASection 내부 구조
```javascript
// 질환 표시 고정 순서 (선택된 것만 필터)
const DISEASE_ORDER = ['HTN', 'DM', 'Dyslipidemia', 'Osteoporosis', 'CKD', 'Hypothyroidism', 'Hyperthyroidism'];

// 출력: "# HTN\n# DM\n# GERD\n# Anemia" 형태
//   - 자동 질환 + 추가 진단 모두 각 줄 "# 진단명" 형태로 통일
//   - 추가 진단: 빈 값 제외 후 각각 "# " prefix 붙여 lines 배열에 push → join('\n')

// extraDxList: string[] — 동적 배열 (v3.1 변경)
//   초기값: ['']  /  최대 10개  /  리셋 시 [''] 로 복원
//   각 항목은 단순 string (OX 토글 없음)
const [extraDxList, setExtraDxList] = useState(['']);

// 헬퍼 함수
function addDx()              // 끝에 '' 추가 (length < 10 조건)
function updateDx(idx, val)   // idx번 항목 값 교체
function removeDx(idx)        // idx번 항목 제거 (length > 1 조건, UI에서 ✕ 버튼으로 호출)
```

## PSection 내부 구조
```javascript
const PLAN_OPTIONS = [
  { key: 'chronic',  label: '만성질환 관리 교육함.', defaultOn: true },
  { key: 'diet',     label: '식이요법 교육함.',       defaultOn: false },
  { key: 'exercise', label: '운동요법 교육함.',       defaultOn: false },
  { key: 'smoking',  label: '금연 교육함.',           defaultOn: false },
  { key: 'alcohol',  label: '금주 교육함.',           defaultOn: false },
  { key: 'labCheck', label: '정기적 검사 안내함.',     defaultOn: false },
];
// extraPlan: 자유 텍스트 (한 줄 input)
// 출력: 체크된 항목 label + extraPlan 줄바꿈 결합
```

## AcuteSection 내부 구조

### SymptomSelector (S 섹션)
```javascript
// 6개 카테고리, 총 26개 증상
const CATEGORIES = [
  { label: '전신',   symptoms: ['Fever', 'Chill', 'Myalgia', 'General weakness', 'Weight change'] },
  { label: '두경부', symptoms: ['Headache', 'Dizziness', 'Sore throat', 'Hoarseness'] },
  { label: '호흡기', symptoms: ['Cough', 'Sputum', 'Rhinorrhea', 'Nasal obstruction', 'Dyspnea', 'Chest pain'] },
  { label: '복부',   symptoms: ['Abd pain', 'Flank pain'] },
  { label: '소화기', symptoms: ['Anorexia', 'Nausea', 'Vomiting', 'Constipation', 'Diarrhea'] },
  { label: '비뇨기', symptoms: ['Frequency', 'Urgency', 'Nocturia', 'Dysuria'] },
];
// toggles: { [symptom]: boolean } — true=(+), false=(-)
// 출력: 카테고리별 한 줄, "Fever(+), Chill(-), ..." 형태

// 내부 state (모두 컴포넌트 내부 useState, App.jsx 전역 state 아님)
// const [onsetType, setOnsetType]           = useState('duration');  // 'duration' | 'date'
// const [duration, setDuration]             = useState('');           // 숫자 문자열 (일 단위)
// const [onsetDate, setOnsetDate]           = useState('');           // 'YYYY-MM-DD' 문자열
// const [chiefComplaint, setChiefComplaint] = useState('');           // '' | 증상명 단일값 (v3.2)

// positiveSymptoms: 렌더 body에서만 계산, text 생성에 미사용 (CC selector UI 표시 전용)
// const positiveSymptoms = CATEGORIES.flatMap(cat => cat.symptoms.filter(s => toggles[s]));

// generateSText() 시그니처 (v3.2 갱신):
// generateSText(toggles, onsetType, duration, onsetDate, chiefComplaint)

// onset line 출력 형식 (CC + onset 조합)
// CC 있음 + duration=3:          "3일 전부터 Fever 호소"
// CC 없음 + duration=3:          "3일 전부터 증상 시작."
// CC 있음 + date=2026-02-21:     "2026-02-21부터 (4일간) Cough 호소"
// onset 미입력:                  onset 줄 없음, toggle 줄만 출력 (하위 호환)
```

**UI 레이아웃 (위→아래 순서)**
```
[모드 탭: 지속 기간 | 날짜 직접 입력]
[조건부 입력: 숫자(일수) 또는 date picker]
[구분선 border-t]
[주증상 선택 pills — positiveSymptoms.length > 0 일 때만 표시]  ← v3.2 추가
[증상 토글 (카테고리별 (+)/(-) pills)]
```

### AcuteOSection (O 섹션)
```javascript
const INITIAL_FORM = {
  vs_sbp: '', vs_dbp: '', vs_pr: '', vs_bt: '',
  appearance: 'Not so ill-looking',    // 3택 1
  pi: '-', pth: '-',                   // 각각 4택 1 (-/+/++/+++)
  breath_base: 'Clear',               // 2택 1
  breath_extra: 'without',            // 4택 1
  abd_soft: 'Soft',                   // 2택 1
  abd_shape: 'Flat',                  // 3택 1
  abd_bs: 'normoactive',             // 3택 1
  abd_td: 'no',                      // no | Td (+)
  abd_td_location: '',               // Td (+) 시 위치
  cvat: 'Neg',                       // 2택 1
  cvat_detail: '',                   // Pos 시 세부 소견
  extra: '',                         // 기타 자유입력
};
// chronicVS prop으로 만성질환 V/S 가져오기 가능 (체크박스 ON 시)
// UI: SegmentGroup (세그먼트 컨트롤 스타일)
```

### AcuteASection (A 섹션)
```javascript
const QUICK_DX = [
  'Acute pharyngotonsillitis', 'Acute nasopharyngitis', 'Acute pharyngitis',
  'Influenza', 'Acute bronchitis', 'Pneumonia', 'Acute sinusitis',
  'Acute gastroenteritis', 'Infectious enterocolitis',
];
// 퀵 버튼 클릭 → 입력칸에 자동 입력, 직접 수정 가능
// 출력: "# 진단명"
```

### AcutePSection (P 섹션)
```javascript
const PLAN_OPTIONS = [
  { key: 'antibiotics', label: '항생제 포함하여 약물 복용.', defaultOn: false },
  { key: 'revisit',     label: '호전 없거나 증상 악화 시 재내원.', defaultOn: true },
  { key: 'hydration',   label: '적절한 수분 섭취 격려.', defaultOn: true },
];
```

## SSection UI 패턴
```
SSection 내부에 정의된 재사용 헬퍼 컴포넌트:
- OXToggle({ value, onChange })   — O/X pill 토글 (O=blue, X=gray)
- SubInput({ children })          — 들여쓰기 + border-l-2 blue 래퍼
- Row({ label, toggle, children })— 라벨+토글+서브입력 한 행
- TextInput / NumInput            — 텍스트/숫자 입력
- SectionLabel({ label })         — 질환별 배지 + 구분선
→ 공통 UI 추출 필요 시 src/components/ui/ 폴더로 분리 가능
```

## 주의사항
- Tailwind v4: `tailwind.config.js` 불필요, `index.css`에 `@import "tailwindcss"` 한 줄로 설정
- Tailwind v4: PostCSS 플러그인은 `@tailwindcss/postcss` 사용 (구버전 `tailwindcss` 플러그인 아님)
- 모든 상태는 App.jsx의 React useState로 관리, 하위 컴포넌트는 props만 사용
- Thyroid 질환은 selectedDiseases에 'Thyroid'가 아닌 세부 타입으로 저장됨
  - 기능저하증: 'Hypothyroidism', 기능항진증: 'Hyperthyroidism'
  - OSection에서 Thyroid 표시 조건: `selectedDiseases.includes('Hypothyroidism') || selectedDiseases.includes('Hyperthyroidism')`
- 성별 토글은 같은 버튼 재클릭 시 선택 해제됨 (sex: '' 로 초기화)
- 외부 API 호출 없음
- vite.config.js: `base: '/aro/'` (GitHub Pages 배포 경로)
- SSection/OSection 등 내부 상태를 가진 컴포넌트 초기화: `resetKey` 변경으로 key를 바꿔 강제 리마운트
  - key 형식: `s-${resetKey}`, `o-${resetKey}` 등 섹션별 prefix 사용
- SSection → App 텍스트 전달: useEffect + onChange 콜백 패턴 사용 (useCallback으로 참조 안정화)
- SSection의 폼 상태는 질환 해제 시 UI만 숨기고 데이터는 보존 (재선택 시 복원됨)
- DM 인슐린 항목은 X 선택 시 출력 자체가 없음 (다른 항목과 달리 "~없음" 문구 미출력)
- OSection은 patientInfo props 필요 (eGFR + ASCVD 나이위험 + KDIGO에서 나이/성별 사용)
  - 성별 변환: '남' → 'male', '여' → 'female' (OSection 내부에서 처리)
- OSection의 자동계산값(BMI, eGFR)은 useMemo로 캐싱, blue Badge 컴포넌트로 시각적 구분
- O) 텍스트 생성: 값이 입력된 항목만 출력 (빈 필드는 행 자체를 생략)
- ASCVD 위험인자 5개 중 3개는 자동 체크 (나이·HTN·HDL<40), 2개는 수동 (가족력·흡연)
  - 자동 체크 항목: disabled + "자동" 라벨, 수동 변경 불가
  - 초고위험군 체크 시 위험인자 목록 UI 숨김, 바로 "초고위험군" 판정
  - DM은 위험인자에 미포함, 별도로 고위험군 조건으로 판정
- ASCVD 분류 기준: 초고위험(별도체크) > 고위험(DM 또는 인자≥3) > 중등도(인자=2) > 저위험(인자≤1)
- KDIGO Statin: CKD 선택 + eGFR 계산 시 자동 표시, 투석 체크 시 "새로 시작 비권고" 분기
- ASCVD 결과는 색상 코딩 badge (red/orange/yellow/green), KDIGO는 purple/blue/slate badge
- ASection 진단 나열 순서는 DISEASE_ORDER 배열 고정 (HTN→DM→Dyslipidemia→Osteoporosis→CKD→Hypothyroidism→Hyperthyroidism)
- ASection 추가 진단명은 각 줄 앞에 `# ` prefix 자동 추가
- PSection의 '만성질환 관리 교육함.'은 defaultOn: true (초기 로딩 시 자동 체크)
- PSection은 selectedDiseases props 불필요 (질환 무관하게 공통 계획 항목)
- A/P 섹션은 S/O와 달리 OX 토글 패턴 미사용 (체크박스 + 자유입력 패턴)
- 감기/장염 섹션은 orange 테마 (만성질환은 blue), border-orange-200, accent-orange-500 등
- 감기/장염 V/S는 만성질환 V/S와 별도 입력 (독립 상태), "가져오기" 체크박스로 선택적 복사
  - ChronicSection OSection의 onChange 콜백이 2번째 인자로 `{ sbp, dbp, pr, bt }` 전달
  - App.jsx에서 chronicVS 상태로 저장 → AcuteOSection chronicVS prop으로 전달
- 감기/장염 AcuteOSection은 SegmentGroup 컴포넌트로 세그먼트 컨트롤 UI 구현 (라디오 대체)
- 미리보기 통합: 만성 + 감기를 각 SOAP 섹션별로 합침 (S는 만성S + 감기S, O도 마찬가지)
  - S/O/P는 `\n\n`으로 구분, A는 `\n`으로 구분 (같은 섹션 내 두 출처 합산)
- 감기/장염 컴포넌트 key prefix: `acute-s-`, `acute-o-`, `acute-a-`, `acute-p-`
- showAcute가 false면 감기/장염 텍스트는 미리보기에서 제외 (상태는 보존)
- 미리보기 텍스트 생성은 App.jsx 인라인 로직 → `utils/soapFormatter.js` formatSOAP()로 분리
  - showChronic은 `hasChronicDiseases` (selectedDiseases.length > 0)로 판단
  - useMemo로 캐싱 (의존성: 8개 텍스트 + showChronic + showAcute)
- SoapPreview는 `lg:sticky lg:top-6` 포지션, S)/O)/A)/P) 라벨은 정규식 `/^[SOAP]\)/`로 감지하여 bold 처리
- CopyButton은 `navigator.clipboard.writeText()` 사용, 실패 시 fallback (textarea + execCommand)
  - 복사 성공 시 "복사됨!" 2초 표시 후 원래 텍스트로 복원 (setTimeout)
  - 텍스트가 빈 문자열이면 disabled 상태 (cursor-not-allowed)
- App.jsx에서 기존 인라인 미리보기 div를 `<SoapPreview soapText={soapText} />`로 교체
- 반응형 레이아웃: PC `grid-cols-[1fr_420px]` / xl `grid-cols-[1fr_480px]`, 모바일 단일 컬럼
  - 모바일: 미리보기는 `hidden lg:block`, 하단 플로팅 바 (미리보기 토글 + 복사) 제공
  - 하단 바: `fixed bottom-0 inset-x-0 lg:hidden z-40`
  - 접히는 미리보기 패널: `max-h-[60vh] overflow-y-auto`, SoapPreview compact prop
  - 모바일 시 `pb-20`으로 플로팅 바 겹침 방지
- CollapsibleCard 컴포넌트: App.jsx 내부에 정의, 모든 S/O/A/P 섹션을 접기/펼치기 카드로 래핑
  - `CollapsibleCard({ title, defaultOpen=true, accentColor='blue', children })`
  - accentColor: 'blue' (만성질환) / 'orange' (감기/장염)
  - 화살표 아이콘 `rotate-180` 트랜지션
- 헤더: sticky top-0 z-30, 🏥 아이콘, v3.2 표시, 컴팩트 py-3
  - max-w-screen-xl (1280px)
  - 부제목은 `hidden sm:block`으로 모바일에서 숨김
- 접근성 개선:
  - 모든 숫자 input: `min=0` (T-score만 min=-10), `aria-label` 추가
  - 성별 버튼: `aria-pressed`, `fieldset` + `role="radiogroup"`
  - 나이 input: `id="patient-age"` + `<label htmlFor>`
  - 전체 focus 스타일: `focus:ring-2 focus:ring-{color}-500 focus:border-transparent` 통일
    - 만성질환: ring-blue-500 / 감기/장염: ring-orange-500
- UI 정리:
  - 전체 border-radius: `rounded-lg` 통일 (기존 `rounded` 혼용 제거)
  - 숫자 input 스피너(화살표) CSS로 숨김 (index.css)
  - SoapPreview sticky 위치: `lg:top-16` (헤더 높이 고려, 기존 top-6)
- index.css: `@import "tailwindcss"` + 숫자 input 스피너 숨김 CSS 추가
- Phase 7 테스트 결과:
  - 자동계산 검증 완료: BMI(24.9 ✓), eGFR(CKD-EPI 2021 구현 정확), ASCVD(고위험군 ✓), KDIGO(Statin 권고 ✓)
  - 3개 시나리오(만성만/감기만/혼합) 모두 텍스트 생성 정상 확인
  - 버그 수정: AcuteOSection 호흡음 "without" → "without adventitious sound"로 문법 완성, 콤마 추가
  - 코드 품질: console.log 없음, 미사용 import 없음, 보안 취약점 없음
  - `npx vite build` exit code 127은 Windows 환경 이슈 (모듈 변환 정상 완료, 코드 문제 아님)
- v3 추가 주의사항:
  - CKD stage label 형태: 'CKD stage IIIb (eGFR 43 ml/min/1.73m²)' (소수 1자리 반올림)
  - HTN 위험군 분류는 V/S SBP/DBP 모두 입력된 경우에만 표시
  - ASection ckdStageLabel prop: App.jsx에서 OSection onChange 3번째 인자로 수신
    - onChange(oText, vs, { ckdStageLabel }) 시그니처
  - dm_insulin.meal → mealAM / mealMD / mealPM 으로 상태키 변경 (기존 meal 키 삭제)
  - htn_cardiovascular: INITIAL_FORM에 추가된 boolean (HTN 심혈관질환 기왕력)
  - CKD ACR: 선택 입력, 입력 시에만 O) 텍스트에 출력
  - HTN 위험군 badge 색상: 초고위험군(red), 고위험군(orange), 중등도위험군(yellow), 저위험군(green)
  - CKD stage badge 색상: bg-indigo-100 text-indigo-800
- v3.1 추가 주의사항 (Phase 10 / F6, F7):
  - SSection `otherSymptoms` 필드는 `{ ox, text }` 객체가 아닌 **단순 string**
    - 기존 `set(key, patch)` 헬퍼는 내부에서 객체 spread를 수행하므로 string에 사용 불가
    - textarea onChange에서 `setFormData(prev => ({ ...prev, otherSymptoms: e.target.value }))` 직접 호출
  - `otherSymptoms` 출력 위치: S) 텍스트의 **맨 끝에 인라인 append**
    - 형식: `[기존 S 텍스트 마지막 줄] / 기타: [입력값]` (새 줄이 아닌 동일 줄 이어쓰기)
    - 빈 값이면 append 없음 (trim() 후 falsy 체크)
  - textarea UI 위치: `CommonSection` 아래, 만성질환·DM 섹션과 무관하게 **항상 표시**
  - textarea 스타일: `resize-none` 추가하여 수동 리사이즈 비활성화
  - 리셋 처리: `INITIAL_FORM`에 `otherSymptoms: ''` 포함되므로 `resetKey` 변경 시 자동 초기화됨
- ASection extraDxList 관련 (F7):
  - 기존 `extraDx: string` → `extraDxList: string[]` 로 state 타입 변경
  - 추가 진단명 출력: 자동 질환과 동일하게 각 줄 `# 진단명` 형태로 출력 (새 줄, 인라인 아님)
    - 예: `# HTN\n# DM\n# GERD\n# Anemia`
  - 리셋 처리: ASection은 `key={a-${resetKey}}`로 리마운트되므로 useState 초기값 `['']`로 자동 복원
  - ✕ 삭제 버튼: `extraDxList.length > 1` 일 때만 렌더링 (항목 1개 시 숨김, disabled 아닌 조건부 렌더)
  - 최대 10개: `extraDxList.length < 10` 일 때만 "+ 진단명 추가" 버튼 렌더링
  - `key={idx}` 사용 주의: 항목 삭제 시 인덱스 기반 key는 재정렬 발생 가능하나 단순 텍스트 입력이므로 허용
- OSection otherLabs 관련 (F8):
  - `otherLabs: [{ name, value, unit }]` — OSection INITIAL_FORM에 포함된 배열 필드
  - `set()` 헬퍼 대신 `setFormData(prev => ...)` 직접 호출 (배열 내부 업데이트 필요)
  - 핸들러 3개: `addLab()` / `updateLab(idx, field, val)` / `removeLab(idx)`
  - 출력 조건: name + value 모두 입력된 항목만 포함 (unit은 선택)
  - 출력 형식: `기타: BUN 18 mg/dL, e' 6 cm/s` — O) 텍스트 맨 마지막 줄에 추가
  - ✕ 버튼: `labs.length === 1` 시 `disabled` + `cursor-not-allowed` (숨김 아닌 비활성)
  - 최대 15개: `labs.length < 15` 조건으로 "+ 검사 항목 추가" 버튼 렌더 제어
  - 수치 필드: `type="text"` (소수점, 부등호 `<` `>` 입력 허용)
  - `OtherLabsSection` 컴포넌트: OSection.jsx 내부 정의, ThyroidOSection 다음, generateOText 이전에 위치
  - 리셋 처리: `key={o-${resetKey}}`로 OSection 리마운트 → INITIAL_FORM 초기값 자동 복원
- SymptomSelector 증상 시작 정보 관련 (F9):
  - 3개 state 모두 컴포넌트 내부 `useState` 관리 (App.jsx 전역 state 아님)
  - `calcDaysAgo(dateStr)`: `new Date()` 기준 날짜 차이 계산, 미래 날짜면 `null` 반환
    - `today.setHours(0,0,0,0)` 처리로 시간대 오차 제거
  - 출력 위치: `generateSText()` 내부에서 증상 토글 라인들 **앞에** 첫 줄로 prepend
  - 하위 호환: duration·onsetDate 모두 빈 값이면 기존 증상 토글 출력만 유지
  - date input `max={todayStr}`: 미래 날짜 선택 방지 (`new Date().toISOString().split('T')[0]`)
  - UI 배치: 모드 탭(지속 기간 | 날짜 직접 입력) → 조건부 입력 → 구분선(`border-t`) → 증상 토글
  - 모드 탭 스타일: orange 테마 (`bg-orange-100 text-orange-700 border-orange-300`)
  - 리셋 처리: `key={acute-s-${resetKey}}`로 리마운트 → useState 초기값 자동 복원
- SymptomSelector CC 선택 관련 (F10 / v3.2):
  - `chiefComplaint` state: `''` 또는 (+) 토글된 증상명 단일값 (복수 선택 불가)
  - onset line 반영: CC 있으면 `${chiefComplaint} 호소`, 없으면 `증상 시작.`
  - toggle() 내부에서 un-toggle 시 CC 자동 초기화:
    ```js
    if (!newVal && chiefComplaint === symptom) setChiefComplaint('');
    ```
  - CC 선택 UI (주증상 선택 pills):
    - `positiveSymptoms.length > 0` 일 때만 렌더링 (구분선 아래, 증상 토글 위)
    - 선택 상태: `bg-orange-500 text-white border-orange-500` (filled orange)
    - 미선택 상태: `bg-white text-slate-600 border-slate-300 hover:border-orange-400` (outlined)
    - 같은 pill 재클릭 → 선택 해제: `setChiefComplaint(prev => prev === s ? '' : s)`
  - `positiveSymptoms`는 렌더 body 계산값 — `generateSText()`에 전달하지 않음 (UI 전용)
  - `generateSText()` 시그니처: `(toggles, onsetType, duration, onsetDate, chiefComplaint)`
  - useEffect 의존성 배열에 `chiefComplaint` 포함 필수
  - 리셋 처리: `key={acute-s-${resetKey}}`로 리마운트 → `chiefComplaint` 초기값 `''` 자동 복원

## Windows 환경 배포 주의사항
- `npm run build` exit code 127 발생 가능 (Windows + Vite 환경 이슈)
  - exit 0 + vite 빌드 출력 확인될 때까지 재시도
  - 문제 지속 시: `rm -rf dist && npm run build`로 재빌드
  - dist 폴더 내 `index.html` 및 `assets/` 생성 여부로 성공 판단
- `node_modules/.bin/gh-pages`는 bash 쉘 스크립트 → Windows에서 `node`로 직접 실행 불가
  - **올바른 배포 명령**: `node node_modules/gh-pages/bin/gh-pages.js -d dist`
  - 커스텀 커밋 메시지: `-m "Deploy message"` 옵션 추가
  - 예: `node node_modules/gh-pages/bin/gh-pages.js -d dist -m "Deploy v3.2: CC selector"`
- GitHub Pages는 `gh-pages` 브랜치 루트(`/`)에서 서빙 (source: gh-pages branch, path: /)
  - `main` 브랜치 push만으로는 배포 미반영 — 반드시 gh-pages 명령 별도 실행 필요
  - 배포 후 브라우저 캐시 강제 갱신 필요: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
- `npm run deploy` 스크립트 = `npm run build` + `gh-pages -d dist` 순서 실행
  - Windows에서 스크립트 전체가 실패할 경우 두 단계를 수동으로 분리 실행
