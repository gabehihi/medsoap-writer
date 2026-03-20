/**
 * ASCVD 위험도 분류
 * 한국지질·동맥경화학회 이상지질혈증 진료지침 제5판 (2022)
 *
 * @param {object} params
 * @param {boolean} params.isVeryHighRisk - 초고위험군 해당 여부 (관상동맥질환 등)
 * @param {boolean} params.hasDM          - DM 동반 여부 (위험인자에는 미포함)
 * @param {number}  params.riskFactorCount - 체크된 위험인자 수 (0~5, DM 제외)
 * @returns {{ grade: string, color: string }}
 */
export function classifyASCVD({ isVeryHighRisk, hasDM, riskFactorCount }) {
  if (isVeryHighRisk) return { grade: '초고위험군', color: 'red' };
  if (hasDM || riskFactorCount >= 3) return { grade: '고위험군', color: 'orange' };
  if (riskFactorCount === 2) return { grade: '중등도위험군', color: 'yellow' };
  return { grade: '저위험군', color: 'green' };
}

/**
 * 나이 위험인자 자동 판정
 * 남 ≥ 45세, 여 ≥ 55세
 */
export function isAgeRisk(age, sex) {
  if (!age || !sex) return false;
  const n = Number(age);
  if (sex === '남') return n >= 45;
  if (sex === '여') return n >= 55;
  return false;
}
