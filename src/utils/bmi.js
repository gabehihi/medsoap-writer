/**
 * BMI 계산: 체중(kg) / 키(m)²
 * @param {number} weightKg - 체중 (kg)
 * @param {number} heightCm - 키 (cm)
 * @returns {string|null} BMI 값 (소수점 1자리 문자열) 또는 null
 */
export function calcBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || heightCm === 0) return null;
  const heightM = heightCm / 100;
  return (weightKg / (heightM * heightM)).toFixed(1);
}
