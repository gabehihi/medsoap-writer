import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const FIELD_COLORS = {
  sbp: '#ef4444', dbp: '#f97316',
  hba1c: '#8b5cf6', bst: '#6366f1',
  tc: '#f59e0b', tg: '#84cc16', hdl: '#10b981', ldl: '#ef4444',
  egfr: '#3b82f6', acr: '#14b8a6',
  tsh: '#a855f7', ft4: '#ec4899',
  bmi: '#6366f1', waist: '#84cc16',
  ast: '#f59e0b', alt: '#ef4444',
  vitD: '#eab308', hb: '#dc2626',
};

const CHART_GROUPS = [
  { title: 'Blood Pressure', fields: ['sbp', 'dbp'], diseases: ['HTN'] },
  { title: 'DM', fields: ['hba1c', 'bst'], diseases: ['DM'] },
  { title: 'Lipid', fields: ['tc', 'tg', 'hdl', 'ldl'], diseases: ['Dyslipidemia'] },
  { title: 'CKD', fields: ['egfr', 'acr'], diseases: ['CKD'] },
  { title: 'Thyroid', fields: ['tsh', 'ft4'], diseases: ['Hypothyroidism', 'Hyperthyroidism'] },
  { title: 'BMI / 허리둘레', fields: ['bmi', 'waist'], diseases: ['Obesity', 'MASLD'] },
  { title: 'Liver (MASLD)', fields: ['ast', 'alt'], diseases: ['MASLD'] },
  { title: 'Vit D / Hb', fields: ['vitD', 'hb'], diseases: ['Osteoporosis', 'MASLD'] },
];

export default function LabChart({ visits, patientDiseases }) {
  if (visits.length < 2) return null;

  // 차트는 오래된 것 먼저 (날짜 오름차순)
  const chartData = [...visits]
    .reverse()
    .map(v => {
      const entry = { date: v.date };
      CHART_GROUPS.forEach(g => {
        g.fields.forEach(f => {
          const val = v[f];
          entry[f] = val !== '' && val !== undefined ? Number(val) || undefined : undefined;
        });
      });
      return entry;
    });

  const relevantGroups = CHART_GROUPS.filter(g =>
    g.diseases.some(d => patientDiseases.includes(d))
  );

  if (relevantGroups.length === 0) return null;

  return (
    <div className="space-y-6">
      {relevantGroups.map(group => {
        const hasData = chartData.some(d => group.fields.some(f => d[f] !== undefined));
        if (!hasData) return null;

        return (
          <div key={group.title} className="overflow-x-auto">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              {group.title}
            </h4>
            <div style={{ minWidth: 280 }}>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData} margin={{ top: 5, right: 16, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {group.fields.map(field => (
                    <Line
                      key={field}
                      type="monotone"
                      dataKey={field}
                      stroke={FIELD_COLORS[field] || '#94a3b8'}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}
