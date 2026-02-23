/**
 * KDIGO Statin 권고
 * KDIGO 2024 CKD Guideline Rec. 3.15.1
 *
 * @param {object} params
 * @param {number}  params.age            - 나이
 * @param {number}  params.egfr           - eGFR (mL/min/1.73m²)
 * @param {boolean} params.hasDM          - DM 동반 여부
 * @param {boolean} params.isVeryHighRisk - 초고위험군 해당 여부
 * @param {boolean} params.isDialysis     - 투석 중 여부
 * @returns {{ recommendation: string, level: string } | null}
 */
export function getKDIGOStatin({ age, egfr, hasDM, isVeryHighRisk, isDialysis }) {
  if (!age || !egfr) return null;

  if (isDialysis) {
    return {
      recommendation: '투석 중: 새로 시작 비권고 (복용 중이면 유지)',
      level: 'gray',
    };
  }

  if (age >= 50) {
    if (egfr < 60) {
      return {
        recommendation: 'Statin 또는 Statin/Ezetimibe 권고 (\u226550세, eGFR<60)',
        level: 'strong',
      };
    }
    return {
      recommendation: 'Statin 권고 (\u226550세, eGFR\u226560)',
      level: 'moderate',
    };
  }

  // 18~49세
  if (hasDM || isVeryHighRisk) {
    return {
      recommendation: 'Statin 권고 (18~49세, 고위험)',
      level: 'moderate',
    };
  }

  return {
    recommendation: '개별 판단 필요 (18~49세, CKD)',
    level: 'neutral',
  };
}
