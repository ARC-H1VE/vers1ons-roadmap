import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, ReferenceLine } from 'recharts';

// Roadmap data with phases
const features = [
  {
    id: 1,
    name: "NuMeta Build Out",
    category: "core",
    phases: [
      { start: "2026-02-15", end: "2026-04-01", devUnits: 2, label: "Main Build" },
      { start: "2026-04-01", end: "2026-04-15", devUnits: 0.5, label: "Tail Support" }
    ]
  },
  {
    id: 2,
    name: "Feedback & Iteration",
    category: "maintenance",
    phases: [
      { start: "2026-02-09", end: "2026-03-15", devUnits: 3, label: "MVP Support" },
      { start: "2026-03-15", end: "2026-07-01", devUnits: 1, label: "Standard" },
      { start: "2026-07-01", end: "2026-12-31", devUnits: 0.5, label: "Maintenance" }
    ]
  },
  {
    id: 3,
    name: "Invite System",
    category: "core",
    phases: [{ start: "2026-01-06", end: "2026-03-31", devUnits: 1 }]
  },
  {
    id: 4,
    name: "On-platform Curation",
    category: "core",
    phases: [{ start: "2026-01-06", end: "2026-03-31", devUnits: 1 }]
  },
  {
    id: 5,
    name: "Custom e-Signature Flow",
    category: "contracts",
    phases: [
      { start: "2026-02-15", end: "2026-03-01", devUnits: 2, label: "Initial" },
      { start: "2026-03-01", end: "2026-04-05", devUnits: 1, label: "Completion" }
    ]
  },
  {
    id: 6,
    name: "Multi-Profile Account Experience",
    category: "accounts",
    phases: [{ start: "2026-02-15", end: "2026-04-01", devUnits: 1 }]
  },
  {
    id: 7,
    name: "Global View Extension",
    category: "accounts",
    phases: [{ start: "2026-04-01", end: "2026-04-22", devUnits: 1 }]
  },
  {
    id: 8,
    name: "Label Account Mode",
    category: "accounts",
    phases: [
      { start: "2026-04-15", end: "2026-04-22", devUnits: 2, label: "Setup" },
      { start: "2026-04-22", end: "2026-06-30", devUnits: 1, label: "Development" }
    ]
  },
  {
    id: 9,
    name: "NuMeta Audit Support",
    category: "core",
    phases: [{ start: "2026-02-15", end: "2026-05-15", devUnits: 2 }]
  },
  {
    id: 10,
    name: "Actual Royalty Splitting",
    category: "financials",
    phases: [{ start: "2026-04-01", end: "2026-06-30", devUnits: 2 }]
  },
  {
    id: 11,
    name: "Approvals (non-200% Tracks)",
    category: "workflow",
    phases: [{ start: "2026-05-15", end: "2026-07-15", devUnits: 1.5 }]
  },
  {
    id: 12,
    name: "Bulk Licensing DRAMLA",
    category: "licensing",
    phases: [
      { start: "2026-05-15", end: "2026-07-01", devUnits: 1, label: "Initial" },
      { start: "2026-07-01", end: "2026-08-01", devUnits: 2, label: "Main Dev" },
      { start: "2026-08-01", end: "2026-08-15", devUnits: 1, label: "Wrap-up" }
    ]
  },
  {
    id: 13,
    name: "Mobile Optimization",
    category: "platform",
    phases: [{ start: "2026-06-30", end: "2026-09-30", devUnits: 2 }]
  },
  {
    id: 14,
    name: "Apply to License",
    category: "licensing",
    phases: [{ start: "2026-07-01", end: "2026-08-15", devUnits: 1 }]
  },
  {
    id: 15,
    name: "Mashups",
    category: "features",
    phases: [{ start: "2026-08-15", end: "2026-11-15", devUnits: 2 }]
  }
];

const categoryColors = {
  core: { bg: '#FEE2E2', border: '#DC2626', text: '#991B1B' },
  maintenance: { bg: '#D1FAE5', border: '#059669', text: '#065F46' },
  accounts: { bg: '#E9D5FF', border: '#9333EA', text: '#6B21A8' },
  contracts: { bg: '#FCE7F3', border: '#DB2777', text: '#9D174D' },
  financials: { bg: '#DBEAFE', border: '#2563EB', text: '#1E40AF' },
  workflow: { bg: '#FED7AA', border: '#EA580C', text: '#9A3412' },
  licensing: { bg: '#FEF3C7', border: '#D97706', text: '#92400E' },
  platform: { bg: '#CCFBF1', border: '#0D9488', text: '#115E59' },
  features: { bg: '#FFE4E6', border: '#F43F5E', text: '#BE123C' }
};

const categoryLabels = {
  core: 'Core Platform',
  maintenance: 'Maintenance',
  accounts: 'Accounts',
  contracts: 'Contracts',
  financials: 'Financials',
  workflow: 'Workflow',
  licensing: 'Licensing',
  platform: 'Platform',
  features: 'Features'
};

// Timeline constants
const startDate = new Date('2026-01-01');
const endDate = new Date('2026-12-31');
const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
const devMultiplier = 1.25;

const parseDate = (dateStr) => new Date(dateStr);
const daysSinceStart = (date) => (parseDate(date) - startDate) / (1000 * 60 * 60 * 24);
const daysWidth = (start, end) => (parseDate(end) - parseDate(start)) / (1000 * 60 * 60 * 24);

// Generate weekly resource data
const generateResourceData = () => {
  const data = [];
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  let current = new Date(startDate);

  while (current <= endDate) {
    const weekStart = current.toISOString().split('T')[0];
    const weekData = {
      week: weekStart,
      date: new Date(current),
      label: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };

    let totalDevs = 0;
    Object.keys(categoryColors).forEach(cat => {
      weekData[cat] = 0;
    });

    features.forEach(feature => {
      feature.phases.forEach(phase => {
        const phaseStart = parseDate(phase.start);
        const phaseEnd = parseDate(phase.end);
        if (current >= phaseStart && current < phaseEnd) {
          const devs = phase.devUnits * devMultiplier;
          weekData[feature.category] += devs;
          totalDevs += devs;
        }
      });
    });

    weekData.total = totalDevs;
    data.push(weekData);
    current = new Date(current.getTime() + weekMs);
  }
  return data;
};

const resourceData = generateResourceData();

// Quarter markers
const quarters = [
  { label: 'Q1', start: 0, end: 90 },
  { label: 'Q2', start: 91, end: 181 },
  { label: 'Q3', start: 182, end: 273 },
  { label: 'Q4', start: 274, end: 365 }
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function RoadmapVisualization() {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredFeatures = selectedCategory
    ? features.filter(f => f.category === selectedCategory)
    : features;

  const maxDevs = Math.max(...resourceData.map(d => d.total));

  // Calculate totals by category
  const categoryTotals = {};
  Object.keys(categoryColors).forEach(cat => {
    const catFeatures = features.filter(f => f.category === cat);
    let totalDevWeeks = 0;
    catFeatures.forEach(f => {
      f.phases.forEach(p => {
        const weeks = daysWidth(p.start, p.end) / 7;
        totalDevWeeks += weeks * p.devUnits * devMultiplier;
      });
    });
    categoryTotals[cat] = Math.round(totalDevWeeks);
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Product Roadmap 2026</h1>
        <div className="flex items-center gap-6 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            MVP Launch: Feb 9, 2026
          </span>
          <span>Dev Unit = 1.25 developers</span>
          <span>Peak Capacity: <strong>{maxDevs.toFixed(1)}</strong> developers</span>
        </div>
      </div>

      {/* Category Legend & Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700">Categories</h3>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Clear filter
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryColors).map(([cat, colors]) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'ring-2 ring-offset-2 ring-slate-400'
                  : 'hover:scale-105'
              }`}
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.border,
                color: colors.text,
                border: `1px solid ${colors.border}`
              }}
            >
              {categoryLabels[cat]} ({categoryTotals[cat]} dev-wks)
            </button>
          ))}
        </div>
      </div>

      {/* Resource Allocation Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Developer Allocation Over Time</h3>
        <p className="text-sm text-slate-500 mb-4">Stacked by category • Hover for details</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={resourceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#64748B' }}
              interval={3}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#64748B' }}
              label={{ value: 'Developers', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748B' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              labelStyle={{ color: '#F8FAFC', fontWeight: 'bold', marginBottom: '4px' }}
              itemStyle={{ color: '#F8FAFC', padding: '2px 0' }}
              formatter={(value, name) => [value.toFixed(1) + ' devs', categoryLabels[name]]}
            />
            <ReferenceLine x="Feb 9" stroke="#DC2626" strokeDasharray="5 5" label={{ value: 'MVP', fill: '#DC2626', fontSize: 10 }} />
            {Object.entries(categoryColors).map(([cat, colors]) => (
              <Area
                key={cat}
                type="monotone"
                dataKey={cat}
                stackId="1"
                stroke={colors.border}
                fill={colors.bg}
                fillOpacity={0.8}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Gantt Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Timeline View</h3>
        <p className="text-sm text-slate-500 mb-4">Bar height indicates dev units • Click categories above to filter</p>

        {/* Timeline Header */}
        <div className="relative mb-2">
          {/* Quarter labels */}
          <div className="flex border-b border-slate-200">
            {quarters.map(q => (
              <div
                key={q.label}
                className="flex-1 text-center py-2 font-semibold text-slate-700 border-r border-slate-200 last:border-r-0"
                style={{ backgroundColor: q.label === 'Q1' ? '#FEF3C7' : q.label === 'Q2' ? '#DBEAFE' : q.label === 'Q3' ? '#D1FAE5' : '#FCE7F3' }}
              >
                {q.label}
              </div>
            ))}
          </div>
          {/* Month labels */}
          <div className="flex border-b border-slate-300">
            {months.map((m, i) => (
              <div
                key={m}
                className="flex-1 text-center py-1 text-xs text-slate-500 border-r border-slate-100 last:border-r-0"
              >
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* Gantt Rows */}
        <div className="relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex pointer-events-none">
            {months.map((_, i) => (
              <div key={i} className="flex-1 border-r border-slate-100 last:border-r-0"></div>
            ))}
          </div>

          {/* MVP marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
            style={{ left: `${(daysSinceStart('2026-02-09') / totalDays) * 100}%` }}
          >
            <div className="absolute -top-6 -left-3 text-xs text-red-600 font-medium whitespace-nowrap">MVP</div>
          </div>

          {/* Feature rows */}
          {filteredFeatures.map((feature, idx) => {
            const colors = categoryColors[feature.category];
            const isHovered = hoveredFeature === feature.id;

            return (
              <div
                key={feature.id}
                className={`relative h-12 flex items-center border-b border-slate-100 transition-colors ${
                  isHovered ? 'bg-slate-50' : ''
                }`}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Feature name */}
                <div
                  className="absolute left-0 z-20 px-2 py-1 text-xs font-medium rounded shadow-sm whitespace-nowrap"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                    transform: 'translateY(-50%)',
                    top: '50%'
                  }}
                >
                  {feature.name}
                </div>

                {/* Phase bars */}
                {feature.phases.map((phase, phaseIdx) => {
                  const left = (daysSinceStart(phase.start) / totalDays) * 100;
                  const width = (daysWidth(phase.start, phase.end) / totalDays) * 100;
                  const height = Math.min(40, Math.max(16, phase.devUnits * 14));

                  return (
                    <div
                      key={phaseIdx}
                      className="absolute rounded-md shadow-sm transition-all hover:shadow-md hover:scale-y-110 cursor-pointer"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        height: `${height}px`,
                        backgroundColor: colors.bg,
                        border: `2px solid ${colors.border}`,
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                      title={`${feature.name}${phase.label ? ` (${phase.label})` : ''}: ${phase.devUnits} units (${(phase.devUnits * devMultiplier).toFixed(2)} devs)`}
                    >
                      {width > 8 && (
                        <div
                          className="absolute inset-0 flex items-center justify-center text-xs font-medium overflow-hidden"
                          style={{ color: colors.text }}
                        >
                          {phase.devUnits}×
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {quarters.map(q => {
          const qStart = new Date(2026, Math.floor(q.start / 30.5), 1);
          const qEnd = new Date(2026, Math.floor(q.end / 30.5) + 1, 0);

          let totalDevWeeks = 0;
          let featureCount = 0;

          features.forEach(f => {
            f.phases.forEach(p => {
              const pStart = parseDate(p.start);
              const pEnd = parseDate(p.end);
              if (pStart < qEnd && pEnd > qStart) {
                const overlapStart = Math.max(pStart, qStart);
                const overlapEnd = Math.min(pEnd, qEnd);
                const overlapWeeks = (overlapEnd - overlapStart) / (7 * 24 * 60 * 60 * 1000);
                totalDevWeeks += overlapWeeks * p.devUnits * devMultiplier;
              }
            });

            const hasPhaseInQ = f.phases.some(p => {
              const pStart = parseDate(p.start);
              const pEnd = parseDate(p.end);
              return pStart < qEnd && pEnd > qStart;
            });
            if (hasPhaseInQ) featureCount++;
          });

          const avgDevs = totalDevWeeks / 13;

          return (
            <div
              key={q.label}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
            >
              <div className="text-2xl font-bold text-slate-800">{q.label}</div>
              <div className="text-sm text-slate-500 mb-3">
                {q.label === 'Q1' ? 'Jan - Mar' : q.label === 'Q2' ? 'Apr - Jun' : q.label === 'Q3' ? 'Jul - Sep' : 'Oct - Dec'}
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Features Active</span>
                  <span className="font-semibold text-slate-800">{featureCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Dev-Weeks</span>
                  <span className="font-semibold text-slate-800">{Math.round(totalDevWeeks)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Avg Devs/Week</span>
                  <span className="font-semibold text-slate-800">{avgDevs.toFixed(1)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Detail Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Feature Details</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Feature</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Category</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Start</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">End</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Duration</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Dev-Weeks</th>
              <th className="px-4 py-3 text-left text-slate-600 font-medium">Phases</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeatures.map((feature, idx) => {
              const colors = categoryColors[feature.category];
              const firstPhase = feature.phases[0];
              const lastPhase = feature.phases[feature.phases.length - 1];
              const totalDuration = daysWidth(firstPhase.start, lastPhase.end);
              const totalDevWeeks = feature.phases.reduce((sum, p) => {
                return sum + (daysWidth(p.start, p.end) / 7) * p.devUnits * devMultiplier;
              }, 0);

              return (
                <tr key={feature.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{feature.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {categoryLabels[feature.category]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(firstPhase.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(lastPhase.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{Math.round(totalDuration / 7)} weeks</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{Math.round(totalDevWeeks)}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {feature.phases.map((p, i) => (
                      <span key={i} className="inline-block mr-2">
                        {p.devUnits}×{p.label ? ` ${p.label}` : ''}
                        {i < feature.phases.length - 1 && ' →'}
                      </span>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-slate-500">
        Total Dev-Weeks: <strong>{Object.values(categoryTotals).reduce((a, b) => a + b, 0)}</strong> •
        Features: <strong>{features.length}</strong> •
        Generated from roadmap.md
      </div>
    </div>
  );
}
