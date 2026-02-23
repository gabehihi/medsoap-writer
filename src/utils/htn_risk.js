/**
 * 2022 대한고혈압학회 고혈압 진료지침 기반
 * 심뇌혈관 위험군 분류 및 혈압 조절 목표 반환
 *
 * @param {object} params
 * @param {number}  params.sbp          - 수축기혈압 (mmHg)
 * @param {number}  params.dbp          - 이완기혈압 (mmHg)
 * @param {number}  params.age          - 나이
 * @param {string}  params.sex          - '남' | '여'
 * @param {boolean} params.hasDM        - 당뇨 선택 여부
 * @param {boolean} params.hasCKD       - CKD 선택 여부
 * @param {boolean} params.hasCardiovascular - 심혈관질환 기왕력 (수동 체크)
 * @param {boolean} params.hasSmoking   - 흡연
 * @param {boolean} params.hasFamilyHistory - 조기 심혈관질환 가족력
 * @param {number}  params.riskFactorCount  - 위험인자 수 (자동 계산)
 *
 * @returns {{ riskGroup: string, bpTarget: string, description: string }}
 */
export function classifyHTNRisk({ sbp, dbp, age, sex, hasDM, hasCKD,
                                  hasCardiovascular, hasSmoking,
                                  hasFamilyHistory, riskFactorCount }) {

  const isStage2 = sbp >= 160 || dbp >= 100;

  if (hasCardiovascular) {
    return {
      riskGroup: '초고위험군',
      bpTarget: '<130/80 mmHg',
      description: '심혈관질환 기왕력 (관상동맥질환, 뇌졸중, 심부전 등)',
    };
  }

  if (hasDM || hasCKD) {
    return {
      riskGroup: '고위험군',
      bpTarget: '<130/80 mmHg',
      description: hasDM && hasCKD ? '당뇨 + CKD' : (hasDM ? '당뇨 동반' : 'CKD 동반'),
    };
  }

  if (riskFactorCount >= 3 || isStage2) {
    return {
      riskGroup: '고위험군',
      bpTarget: '<140/90 mmHg',
      description: `위험인자 ${riskFactorCount}개${isStage2 ? ' / 2기 고혈압' : ''}`,
    };
  }

  if (riskFactorCount === 2) {
    return {
      riskGroup: '중등도위험군',
      bpTarget: '<140/90 mmHg',
      description: `위험인자 ${riskFactorCount}개`,
    };
  }

  return {
    riskGroup: '저위험군',
    bpTarget: '<140/90 mmHg',
    description: `위험인자 ${riskFactorCount}개`,
  };
}
