# 환자 데이터베이스 설계 스펙

**날짜:** 2026-03-19
**프로젝트:** MedSOAP Writer (ARO)
**버전:** v4.0

---

## 1. 개요

일차의료 외래 만성질환 관리 환자를 위한 환자 데이터베이스를 추가한다.
브라우저 전용(서버/DB 없음) 원칙을 유지하며, JSON 파일 기반 내보내기/불러오기로 기기 간 데이터 이동을 지원한다.

---

## 2. 아키텍처

### 전체 구조

```
App.jsx
├── Header (탭 바: [SOAP 작성 | 환자 관리])
├── SOAPView (activeTab === 'soap')
│   ├── 현재 환자 바 (이름, 차트번호, 만성질환 뱃지) + "환자 변경" 버튼
│   ├── PatientInfo (생년월일 → 나이 자동계산, 성별 자동채우기)
│   └── 기존 ChronicSection / AcuteSection / SoapPreview
│       └── OSection: 이전 수치 참고 표시 + "이전값 채우기" 버튼
└── PatientDBView (activeTab === 'patients')
    ├── 환자 목록 (검색 + 정렬)
    ├── 환자 카드 클릭 → 상세 / 수정 / 이력
    ├── 신규 등록 버튼
    └── JSON 내보내기 / 불러오기 버튼
```

### 상태 흐름

- `localStorage` 키 `medsoap_patients`에 환자 DB 자동저장 (새로고침 시 유지)
- JSON 내보내기/불러오기로 기기 간 이동
- 환자 선택 → SOAP 탭 자동 전환 + 기본정보/질환 자동 입력
- SOAP 완료 후 "진료 기록 저장" → 해당 환자 visits[]에 추가

---

## 3. 데이터 구조

### 환자 스키마 (Patient)

```js
{
  id: string,           // UUID v4 (crypto.randomUUID())
  name: string,         // 환자명
  chartNo: string,      // 차트번호 (병원 등록번호)
  birthDate: string,    // "YYYY-MM-DD" (나이 자동계산에 사용)
  sex: '남' | '여',
  diseases: string[],   // 만성질환 목록 예: ['HTN', 'DM', 'Hypothyroidism']

  lastVisit: {          // 가장 최근 방문 스냅샷 (없으면 null)
    date: string,       // "YYYY-MM-DD"
    oValues: OValues,   // O) 섹션 수치 스냅샷
    soapText: string,   // 전체 SOAP 텍스트
  } | null,

  visits: Visit[],      // 전체 방문 이력 (최신순 정렬)
  createdAt: string,    // "YYYY-MM-DD"
}
```

### OValues 스키마

```js
{
  vs_sbp: string, vs_dbp: string, vs_pr: string, vs_bt: string,
  height: string, weight: string,
  dm_hba1c: string, dm_bst: string,
  lipid_tc: string, lipid_tg: string, lipid_hdl: string, lipid_ldl: string,
  osteo_tscore: string,
  ckd_bun: string, ckd_cr: string, ckd_acr: string,
  thyroid_tsh: string, thyroid_ft4: string,
}
```

### Visit 스키마

```js
{
  date: string,         // "YYYY-MM-DD"
  oValues: OValues,
  soapText: string,
}
```

### localStorage 구조

- 키: `medsoap_patients`
- 값: `Patient[]` (JSON 직렬화)

---

## 4. 신규 파일 구조

```
src/
├── db/
│   └── patientDb.js              ← CRUD + localStorage + JSON export/import
└── components/
    └── PatientDB/
        ├── PatientDBView.jsx     ← 환자 관리 탭 전체 뷰
        ├── PatientList.jsx       ← 목록 + 검색(이름/차트번호) + 정렬
        ├── PatientForm.jsx       ← 등록/수정 모달
        ├── PatientCard.jsx       ← 환자 카드 컴포넌트
        └── VisitHistory.jsx      ← 방문 이력 목록 + SOAP 텍스트 조회
```

---

## 5. 기존 파일 수정 범위

| 파일 | 변경 내용 |
|------|-----------|
| `App.jsx` | `activeTab`, `patients`, `currentPatient` 상태 추가. 탭 바, 환자 바, "진료 기록 저장" 버튼 추가 |
| `ChronicSection/OSection.jsx` | `prevOValues` prop 추가. 이전값 참고 표시(회색) + "이전값 채우기" 버튼 |
| `PatientInfo.jsx` | 생년월일→나이 자동계산 지원. 환자 선택 시 읽기 전용 모드 |

---

## 6. 진료 워크플로우

### 환자 선택 흐름

```
1. 앱 진입 → [SOAP 작성] 탭 (기본)
   - 환자 미선택: "환자를 선택하세요" 안내 바 (환자 없이도 기존처럼 작성 가능)

2. [환자 관리] 탭 → 환자 카드 → "진료 시작" 버튼
   - [SOAP 작성] 탭으로 자동 전환
   - 나이(생년월일→자동계산), 성별, 만성질환 자동 입력
   - OSection에 이전 수치 회색 참고값 표시
   - "이전값 채우기" 버튼으로 선택적 자동입력

3. SOAP 작성 완료 → "진료 기록 저장" 버튼
   - 오늘 날짜 + 현재 oValues + SOAP 텍스트 → visits[] 앞에 추가
   - lastVisit 업데이트
   - localStorage 자동 저장
```

### JSON 내보내기/불러오기

```
내보내기: "📥 내보내기" 버튼
  → medsoap_patients_YYYYMMDD.json 다운로드

불러오기: "📤 불러오기" 버튼
  → JSON 파일 선택
  → chartNo 기준 중복 체크
  → 중복 시: "덮어쓰기 / 건너뛰기" 선택 다이얼로그
```

---

## 7. PatientDB 컴포넌트 상세

### PatientList.jsx
- 검색: 이름 또는 차트번호 실시간 필터
- 정렬: 이름순 / 마지막 방문일순
- 빈 상태: "등록된 환자가 없습니다. 신규 등록하세요." 안내

### PatientForm.jsx (등록/수정 모달)
- 필드: 이름*, 차트번호*, 생년월일*, 성별*, 만성질환 선택(DiseaseSelector 재사용)
- 유효성: 필수 필드 모두 입력 후 저장 가능
- 수정 시: 기존 visits[] 유지, 기본정보만 변경

### PatientCard.jsx
- 표시: 이름, 차트번호, 나이(자동계산), 성별, 질환 뱃지, 마지막 방문일
- 버튼: "진료 시작" / "수정" / "이력 보기" / "삭제"

### VisitHistory.jsx
- 방문 목록: 날짜 + SOAP 텍스트 미리보기 (첫 줄)
- 클릭 시: 전체 SOAP 텍스트 펼치기 + 복사 버튼
- 삭제: 개별 방문 기록 삭제 가능

---

## 8. patientDb.js API

```js
// CRUD
loadPatients()                    // localStorage에서 Patient[] 로드
savePatients(patients)            // localStorage에 저장
addPatient(patient)               // 신규 등록 (id, createdAt 자동 생성)
updatePatient(id, patch)          // 수정
deletePatient(id)                 // 삭제
addVisit(patientId, visit)        // 방문 기록 추가 + lastVisit 업데이트

// JSON
exportPatients(patients)          // JSON 파일 다운로드
importPatients(file, existing)    // JSON 파일 파싱 + 중복 체크 → {toAdd, duplicates}
```

---

## 9. 하위 호환성

- 환자 미선택 상태에서도 기존 SOAP 작성 워크플로우 완전히 동작
- 기존 PatientInfo.jsx의 나이/성별 수동 입력 유지 (환자 미선택 시)
- "진료 기록 저장" 버튼: 환자 선택 시에만 활성화

---

## 10. 보안 / 개인정보

- 모든 데이터는 로컬 브라우저(localStorage)에만 저장
- 외부 서버 전송 없음
- JSON 파일에 환자 개인정보(이름, 생년월일) 포함 → 파일 관리 주의 안내 문구 추가
- PHI 로그 출력 금지 (console.log에 환자 데이터 미포함)
