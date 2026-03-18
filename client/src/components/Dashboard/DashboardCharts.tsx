import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { RenewableSite } from '../../lib/api';

interface DashboardChartsProps {
  sites: RenewableSite[];
}

export function DashboardCharts({ sites }: DashboardChartsProps) {
  // Prepare data for Capacity by Type chart
  const capacityByType = [
    {
      type: 'Wind',
      capacity: sites
        .filter((s) => s.type === 'wind')
        .reduce((sum, s) => sum + s.capacity, 0),
      count: sites.filter((s) => s.type === 'wind').length,
    },
    {
      type: 'Solar',
      capacity: sites
        .filter((s) => s.type === 'solar')
        .reduce((sum, s) => sum + s.capacity, 0),
      count: sites.filter((s) => s.type === 'solar').length,
    },
    {
      type: 'Hybrid',
      capacity: sites
        .filter((s) => s.type === 'hybrid')
        .reduce((sum, s) => sum + s.capacity, 0),
      count: sites.filter((s) => s.type === 'hybrid').length,
    },
  ];

  // Prepare data for Portfolio Distribution pie chart
  const portfolioDistribution = [
    { name: 'Wind', value: sites.filter((s) => s.type === 'wind').length, color: '#3b82f6' },
    { name: 'Solar', value: sites.filter((s) => s.type === 'solar').length, color: '#f59e0b' },
    { name: 'Hybrid', value: sites.filter((s) => s.type === 'hybrid').length, color: '#8b5cf6' },
  ].filter((item) => item.value > 0);

  // Prepare data for ROI Comparison line chart
  const roiComparison = sites
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
    .slice(0, 5)
    .map((site) => ({
      name: site.name.length > 20 ? site.name.substring(0, 20) + '...' : site.name,
      roi: parseFloat(site.roiPercentage || '0'),
      score: site.suitabilityScore,
      capacity: site.capacity,
    }));

  const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Capacity by Type - Bar Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Capacity by Energy Type</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={capacityByType}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="type" stroke="#6b7280" />
            <YAxis stroke="#6b7280" label={{ value: 'Capacity (MW)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'capacity') return [`${value} MW`, 'Capacity'];
                return [value, name];
              }}
            />
            <Legend />
            <Bar dataKey="capacity" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          {capacityByType.map((item, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">{item.type}</p>
              <p className="text-xl font-bold text-gray-900">{item.capacity} MW</p>
              <p className="text-xs text-gray-500">{item.count} sites</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two-column layout for Pie and Line charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Distribution - Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Portfolio Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={portfolioDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {portfolioDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {portfolioDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {item.value} {item.value === 1 ? 'site' : 'sites'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ROI vs Suitability - Line Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Top Sites: ROI & Suitability
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={roiComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                tick={{ fontSize: 11 }}
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'roi') return [`${value.toFixed(1)}%`, 'ROI'];
                  if (name === 'score') return [value, 'Score'];
                  if (name === 'capacity') return [`${value} MW`, 'Capacity'];
                  return [value, name];
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="roi"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Generation Timeline Projection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Projected Annual Generation (Next 5 Years)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={[
              { year: 'Year 1', generation: sites.reduce((sum, s) => sum + (s.annualGeneration || 0), 0) },
              { year: 'Year 2', generation: sites.reduce((sum, s) => sum + (s.annualGeneration || 0), 0) * 0.98 },
              { year: 'Year 3', generation: sites.reduce((sum, s) => sum + (s.annualGeneration || 0), 0) * 0.97 },
              { year: 'Year 4', generation: sites.reduce((sum, s) => sum + (s.annualGeneration || 0), 0) * 0.96 },
              { year: 'Year 5', generation: sites.reduce((sum, s) => sum + (s.annualGeneration || 0), 0) * 0.95 },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" stroke="#6b7280" />
            <YAxis
              stroke="#6b7280"
              label={{ value: 'Generation (MWh)', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [
                `${(value / 1000000).toFixed(2)}M MWh`,
                'Generation',
              ]}
            />
            <Line
              type="monotone"
              dataKey="generation"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-600 mt-4 text-center">
          * Projection includes 0.5-1% annual degradation factor
        </p>
      </div>
    </div>
  );
}