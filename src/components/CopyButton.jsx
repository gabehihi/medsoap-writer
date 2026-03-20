import { useState } from 'react';

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text}
      className={`w-full mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        copied
          ? 'bg-green-100 text-green-700 border border-green-300'
          : text
            ? 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600'
            : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
      }`}
    >
      {copied ? '✅ 복사됨!' : '📋 복사하기'}
    </button>
  );
}
