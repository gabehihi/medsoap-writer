# MedSOAP Writer

일차의료 외래 진료 의사를 위한 SOAP 의무기록 자동작성 웹앱.

## 기능

- 만성질환 (HTN, DM, Dyslipidemia, Osteoporosis, CKD, Thyroid) SOAP 자동 생성
- 감기/장염 SOAP 자동 생성
- 자동계산: BMI, eGFR (CKD-EPI 2021), ASCVD 위험도, KDIGO Statin 권고
- 실시간 미리보기 + 클립보드 복사

## 개인정보

- 서버 없음: 모든 데이터는 브라우저에서만 처리
- 저장 없음: 새로고침 시 초기화

## 기술 스택

React + Vite + Tailwind CSS

## 로컬 실행

```bash
npm install
npm run dev
```

## 배포

```bash
npm run deploy
```
