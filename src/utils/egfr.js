/**
 * eGFR 계산: CKD-EPI Creatinine 2021 (race-free)
 * @param {number} scr - 혈청 크레아티닌 (mg/dL)
 * @param {number} age - 나이
 * @param {string} sex - 성별 ('male' | 'female')
 * @returns {string|null} eGFR 값 (소수점 1자리 문자열) 또는 null
 */
export function calcEGFR(scr, age, sex) {
  if (!scr || !age || !sex) return null;

  const kappa = sex === 'female' ? 0.7 : 0.9;
  const alpha = sex === 'female' ? -0.241 : -0.302;

  const minRatio = Math.min(scr / kappa, 1);
  const maxRatio = Math.max(scr / kappa, 1);

  let egfr = 142 * Math.pow(minRatio, alpha) * Math.pow(maxRatio, -1.200) * Math.pow(0.9938, age);

  if (sex === 'female') {
    egfr *= 1.012;
  }

  return egfr.toFixed(1);
}
