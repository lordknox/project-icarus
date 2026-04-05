import { X, TrendingUp, DollarSign, Zap, Leaf, Home, Award } from 'lucide-react';
import { RenewableSite } from '../lib/api';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface SiteComparisonProps {
  sites: RenewableSite[];
  onClose: () => void;
}

export function SiteComparison({ sites, onClose }: SiteComparisonProps) {
  if (sites.length === 0) return null;

  // Prepare radar chart data
  const radarData = [
    {
      metric: 'Suitability',
      ...Object.fromEntries(
        sites.map((site, idx) => [`site${idx}`, site.suitabilityScore])
      ),
    },
    {
      metric: 'Resource',
      ...Object.fromEntries(
        sites.map((site, idx) => [`site${idx}`, site.resourceQuality || 0])
      ),
    },
    {
      metric: 'ROI',
      ...Object.fromEntries(
        sites.map((site, idx) => [
          `site${idx}`,
          Math.min(parseFloat(site.roiPercentage || '0') * 10, 100),
        ])
      ),
    },
    {
      metric: 'Grid Access',
      ...Object.fromEntries(
        sites.map((site, idx) => [
          `site${idx}`,
          Math.max(0, 100 - (site.gridDistance || 0) * 2),
        ])
      ),
    },
  ];

  // Prepare bar chart data for capacity comparison
  const capacityData = sites.map((site) => ({
    name: site.name.length > 15 ? site.name.substring(0, 15) + '...' : site.name,
    capacity: site.capacity,
    generation: (site.annualGeneration || 0) / 1000, // Convert to GWh
  }));

  const colors = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981'];

  return (
    <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 shadow-lg z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">Site Comparison</h2>
          <p className="text-purple-100 text-sm mt-1">
            Comparing {sites.length} site{sites.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sites.map((site, idx) => (
              <div
                key={site.id}
                className="p-4 rounded-lg border-2"
                style={{ borderColor: colors[idx] }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[idx] }}
                  />
                  <h3 className="font-bold text-gray-900 text-sm">{site.name}</h3>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{site.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Score:</span>
                    <span className="font-bold text-blue-600">
                      {site.suitabilityScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">{site.capacity} MW</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Radar Chart - Overall Comparison */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Overall Performance Comparison
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                {sites.map((site, idx) => (
                  <Radar
                    key={site.id}
                    name={site.name}
                    dataKey={`site${idx}`}
                    stroke={colors[idx]}
                    fill={colors[idx]}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                ))}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Capacity & Generation Comparison */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Capacity & Annual Generation
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={capacityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" label={{ value: 'Capacity (MW)', angle: -90 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{ value: 'Generation (GWh)', angle: 90 }}
                />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="capacity" fill="#3b82f6" name="Capacity (MW)" />
                <Bar
                  yAxisId="right"
                  dataKey="generation"
                  fill="#10b981"
                  name="Generation (GWh)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Metrics Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <h3 className="text-lg font-bold text-gray-900 p-6 pb-4">
              Detailed Metrics Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Metric
                    </th>
                    {sites.map((site, idx) => (
                      <th
                        key={site.id}
                        className="px-6 py-3 text-left text-xs font-medium uppercase"
                        style={{ color: colors[idx] }}
                      >
                        {site.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        Suitability Score
                      </div>
                    </td>
                    {sites.map((site) => (
                      <td key={site.id} className="px-6 py-4 text-sm">
                        <span className="font-bold text-blue-600">
                          {site.suitabilityScore}/100
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        Investment Required
                      </div>
                    </td>
                    {sites.map((site) => (
                      <td key={site.id} className="px-6 py-4 text-sm">
                        ${site.investmentRequired}M
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        ROI
                      </div>
                    </td>
                    {sites.map((site) => (
                      <td key={site.id} className="px-6 py-4 text-sm">
                        <span className="font-semibold text-green-600">
                          {parseFloat(site.roiPercentage || '0').toFixed(1)}%
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        Payback Period
                      </div>
                    </td>
                    {sites.map((site) => (
                      <td key={site.id} className="px-6 py-4 text-sm">
                        {parseFloat(site.paybackYears || '0').toFixed(1)} years
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-600" />
                        Grid Distance
                      </div>
                    </td>
                    {sites.map((site) => (
                      <td key={site.id} className="px-6 py-4 text-sm">
                        {site.gridDistance} km
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-green-600" />
                        CO₂ Saved Annually
                      </div>
                    </td>
                    {sites.map((site) => (
                      <td key={site.id} className="px-6 py-4 text-sm">
                        {(site.co2SavedAnnually || 0).toLocaleString()} tons
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-blue-600" />
                        Homes Powered
                      </div>
                    </td>
                    {sites.map((site) => (
                      <td key={site.id} className="px-6 py-4 text-sm">
                        {(site.homesSupported || 0).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Winner Analysis */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              AI Recommendation
            </h3>
            {(() => {
              const bestSite = [...sites].sort(
                (a, b) => b.suitabilityScore - a.suitabilityScore
              )[0];
              const bestROI = [...sites].sort(
                (a, b) => parseFloat(b.roiPercentage || '0') - parseFloat(a.roiPercentage || '0')
              )[0];
              
              return (
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <strong className="text-purple-600">{bestSite.name}</strong> has the
                    highest overall suitability score ({bestSite.suitabilityScore}/100).
                  </p>
                  {bestROI.id !== bestSite.id && (
                    <p className="text-gray-700">
                      However, <strong className="text-green-600">{bestROI.name}</strong> offers
                      the best ROI at {parseFloat(bestROI.roiPercentage || '0').toFixed(1)}%.
                    </p>
                  )}
                  <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
                    <p className="text-sm font-medium text-gray-900 mb-2">Key Insights:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {bestSite.gridDistance && bestSite.gridDistance < 20 && (
                        <li>✓ {bestSite.name}: Excellent grid connectivity ({bestSite.gridDistance} km)</li>
                      )}
                      {bestROI.roiPercentage && parseFloat(bestROI.roiPercentage) > 10 && (
                        <li>✓ {bestROI.name}: Strong financial returns ({parseFloat(bestROI.roiPercentage).toFixed(1)}%)</li>
                      )}
                      {sites.some(s => s.co2SavedAnnually && s.co2SavedAnnually > 100000) && (
                        <li>✓ High environmental impact across portfolio</li>
                      )}
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}