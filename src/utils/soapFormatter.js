/**
 * SOAP 노트 포맷터
 * 만성질환 + 감기/장염 텍스트를 통합하여 최종 SOAP 문자열 생성
 *
 * @param {object} params
 * @param {string} params.chronicS  - 만성질환 S) 텍스트
 * @param {string} params.chronicO  - 만성질환 O) 텍스트
 * @param {string} params.chronicA  - 만성질환 A) 텍스트
 * @param {string} params.chronicP  - 만성질환 P) 텍스트
 * @param {string} params.acuteS   - 감기/장염 S) 텍스트
 * @param {string} params.acuteO   - 감기/장염 O) 텍스트
 * @param {string} params.acuteA   - 감기/장염 A) 텍스트
 * @param {string} params.acuteP   - 감기/장염 P) 텍스트
 * @param {boolean} params.showChronic - 만성질환 섹션 활성화 여부
 * @param {boolean} params.showAcute   - 감기/장염 섹션 활성화 여부
 * @returns {string} 포맷된 SOAP 텍스트 (빈 입력 시 빈 문자열)
 */
export function formatSOAP({
  chronicS = '',
  chronicO = '',
  chronicA = '',
  chronicP = '',
  acuteS = '',
  acuteO = '',
  acuteA = '',
  acuteP = '',
  showChronic = false,
  showAcute = false,
}) {
  function merge(chronicVal, acuteVal, separator) {
    const parts = [];
    if (showChronic && chronicVal) parts.push(chronicVal);
    if (showAcute && acuteVal) parts.push(acuteVal);
    return parts.join(separator);
  }

  const s = merge(chronicS, acuteS, '\n\n');
  const o = merge(chronicO, acuteO, '\n\n');
  const a = merge(chronicA, acuteA, '\n');
  const p = merge(chronicP, acuteP, '\n\n');

  const sections = [];
  if (s) sections.push(`S)\n${s}`);
  if (o) sections.push(`O)\n${o}`);
  if (a) sections.push(`A)\n${a}`);
  if (p) sections.push(`P)\n${p}`);

  return sections.join('\n\n');
}
