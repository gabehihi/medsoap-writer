import CopyButton from './CopyButton';

function formatPreview(text) {
  if (!text) return null;

  const lines = text.split('\n');
  return lines.map((line, i) => {
    const isLabel = /^[SOAP]\)/.test(line);
    return (
      <span key={i}>
        {isLabel ? <strong className="text-slate-900 text-sm">{line}</strong> : line}
        {i < lines.length - 1 ? '\n' : ''}
      </span>
    );
  });
}

export default function SoapPreview({ soapText, compact = false }) {
  return (
    <div className={compact ? '' : 'lg:sticky lg:top-16'}>
      <div className={`bg-white rounded-lg shadow-sm border border-slate-200 ${compact ? 'p-4' : 'p-5'}`}>
        <h2 className={`font-semibold text-slate-800 ${compact ? 'text-sm mb-2' : 'text-base mb-3'}`}>
          SOAP 미리보기
        </h2>
        <div className={`bg-slate-50 rounded-md p-3 font-mono text-xs text-slate-700 border border-slate-100 whitespace-pre-wrap leading-relaxed ${
          compact ? 'max-h-48 overflow-y-auto' : 'min-h-48'
        }`}>
          {soapText
            ? formatPreview(soapText)
            : <span className="text-slate-400 font-sans text-sm">좌측에서 진료 정보를 입력하면 여기에 SOAP 노트가 생성됩니다.</span>
          }
        </div>
        {!compact && <CopyButton text={soapText} />}
      </div>
    </div>
  );
}
