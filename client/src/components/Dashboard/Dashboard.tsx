import { useState } from 'react';
import { useRenewableSites } from '../../hooks/useRenewableSites';
import { Zap, TrendingUp, DollarSign, Leaf, Home, BarChart3, Wind, Sun, Factory } from 'lucide-react';
import { DashboardCharts } from './DashboardCharts';
import { SiteComparison } from '../SiteComparision';

export function Dashboard() {
  const { data: sites, isLoading, error } = useRenewableSites();
  const [selectedSitesForComparison, setSelectedSitesForComparison] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load data</p>
          <p className="text-gray-600 text-sm">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (!sites || sites.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <Factory className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Sites Yet</h3>
          <p className="text-gray-600 mb-4">
            Start by analyzing potential sites on the map or exploring our AI recommendations.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Explore Map
          </button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalCapacity = sites.reduce((sum, site) => sum + site.capacity, 0);
  const totalGeneration = sites.reduce((sum, site) => sum + (site.annualGeneration || 0), 0);
  const totalCO2Saved = sites.reduce((sum, site) => sum + (site.co2SavedAnnually || 0), 0);
  const totalHomesSupported = sites.reduce((sum, site) => sum + (site.homesSupported || 0), 0);
  const totalInvestment = sites.reduce((sum, site) => sum + (site.investmentRequired || 0), 0);
  const averageROI = sites.length > 0
    ? sites.reduce((sum, site) => sum + parseFloat(site.roiPercentage || '0'), 0) / sites.length
    : 0;

  // Top 5 sites by suitability
  const topSites = [...sites]
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
    .slice(0, 5);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const handleToggleSiteForComparison = (siteId: string, checked: boolean) => {
    if (checked) {
      if (selectedSitesForComparison.length < 4) {
        setSelectedSitesForComparison([...selectedSitesForComparison, siteId]);
      }
    } else {
      setSelectedSitesForComparison(selectedSitesForComparison.filter(id => id !== siteId));
    }
  };

  return (
    <div className="h-full overflow-y-auto p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage and analyze your {sites.length} renewable energy site{sites.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sites</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{sites.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Factory className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Capacity</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalCapacity.toLocaleString()} MW</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Annual Generation</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {(totalGeneration / 1000000).toFixed(1)}M MWh
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Investment</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  ${totalInvestment.toLocaleString()}M
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Leaf className="w-5 h-5" />
              <p className="font-semibold">CO₂ Saved Annually</p>
            </div>
            <p className="text-3xl font-bold">{(totalCO2Saved / 1000).toFixed(1)}k tons</p>
            <p className="text-sm text-green-100 mt-1">
              = {(totalCO2Saved / 4.6).toFixed(0)} cars off the road
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Home className="w-5 h-5" />
              <p className="font-semibold">Homes Powered</p>
            </div>
            <p className="text-3xl font-bold">{totalHomesSupported.toLocaleString()}</p>
            <p className="text-sm text-blue-100 mt-1">Indian households annually</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5" />
              <p className="font-semibold">Average ROI</p>
            </div>
            <p className="text-3xl font-bold">{averageROI.toFixed(1)}%</p>
            <p className="text-sm text-purple-100 mt-1">Portfolio average return</p>
          </div>
        </div>

        {/* Charts */}
        {sites && sites.length > 0 && <DashboardCharts sites={sites} />}

        {/* Top Performing Sites */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Top Performing Sites</h2>
            <p className="text-sm text-gray-600 mt-1">Ranked by overall suitability score</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Site</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ROI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topSites.map((site, idx) => (
                  <tr key={site.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-400">#{idx + 1}</span>
                        <div>
                          <p className="font-medium text-gray-900">{site.name}</p>
                          {site.isAiSuggested && (
                            <p className="text-xs text-green-600">🤖 AI Recommended</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-sm text-gray-700">{site.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-lg font-bold ${getScoreColor(site.suitabilityScore)}`}>
                        {site.suitabilityScore}
                      </span>
                      <span className="text-gray-500">/100</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{site.capacity} MW</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-green-600">
                        {parseFloat(site.roiPercentage || '0').toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">${site.investmentRequired}M</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* All Sites with Comparison */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">All Sites</h2>
              <p className="text-sm text-gray-600 mt-1">
                {selectedSitesForComparison.length > 0
                  ? `${selectedSitesForComparison.length} site${selectedSitesForComparison.length !== 1 ? 's' : ''} selected for comparison`
                  : 'Select 2-4 sites to compare'}
              </p>
            </div>
            {selectedSitesForComparison.length >= 2 && (
              <button
                onClick={() => setShowComparison(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Compare {selectedSitesForComparison.length} Sites
              </button>
            )}
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sites.map((site) => (
                <div
                  key={site.id}
                  className="relative border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <input
                    type="checkbox"
                    checked={selectedSitesForComparison.includes(site.id)}
                    onChange={(e) => handleToggleSiteForComparison(site.id, e.target.checked)}
                    disabled={
                      !selectedSitesForComparison.includes(site.id) &&
                      selectedSitesForComparison.length >= 4
                    }
                    className="absolute top-4 right-4 w-5 h-5 rounded cursor-pointer"
                  />
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">
                      {site.type === 'wind' ? '💨' : site.type === 'solar' ? '☀️' : '⚡'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-sm pr-8">{site.name}</h3>
                      <p className="text-xs text-gray-600 capitalize">{site.type} Energy</p>
                    </div>
                  </div>
                  {site.isAiSuggested && (
                    <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs mb-2">
                      🤖 AI Recommended
                    </div>
                  )}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Score:</span>
                      <span className={`font-bold ${getScoreColor(site.suitabilityScore)}`}>
                        {site.suitabilityScore}/100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium">{site.capacity} MW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ROI:</span>
                      <span className="font-medium text-green-600">
                        {parseFloat(site.roiPercentage || '0').toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Investment:</span>
                      <span className="font-medium">${site.investmentRequired}M</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {showComparison && (
        <SiteComparison
          sites={sites.filter((s) => selectedSitesForComparison.includes(s.id))}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}