import { useDashboardStats, useRenewableSites } from '../../hooks/useRenewableSites';
import { Wind, Sun, Zap, TrendingUp, DollarSign, Home, Leaf } from 'lucide-react';
import { DashboardCharts } from './DashboardCharts';

export function Dashboard() {
    const { data: stats, isLoading: statsLoading } = useDashboardStats();
    const { data: sites, isLoading: sitesLoading } = useRenewableSites();

    if (statsLoading || sitesLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
        return num.toFixed(0);
    };

    return (
        <div className="h-full overflow-y-auto bg-gray-50">
            <div className="p-6 max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
                    <p className="text-gray-600 mt-1">India Renewable Energy Infrastructure</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

                    {/* Total Sites */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Sites</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalSites}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Zap className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2 text-xs">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {stats.sitesByType.wind} Wind
                            </span>
                            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                {stats.sitesByType.solar} Solar
                            </span>
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                {stats.sitesByType.hybrid} Hybrid
                            </span>
                        </div>
                    </div>

                    {/* Total Capacity */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Capacity</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {formatNumber(stats.totalCapacity)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">MW</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Annual Generation */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Annual Generation</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {formatNumber(stats.totalGeneration)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">MWh/year</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <Zap className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    {/* Total Investment */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Investment</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    ${formatNumber(stats.totalInvestment)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">USD (millions)</p>
                            </div>
                            <div className="bg-indigo-100 p-3 rounded-lg">
                                <DollarSign className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Impact Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <Leaf className="w-8 h-8" />
                            <div>
                                <p className="text-sm opacity-90">CO₂ Saved Annually</p>
                                <p className="text-3xl font-bold">
                                    {formatNumber(stats.totalCO2Saved)}
                                </p>
                                <p className="text-xs opacity-75">tons/year</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <Home className="w-8 h-8" />
                            <div>
                                <p className="text-sm opacity-90">Homes Powered</p>
                                <p className="text-3xl font-bold">
                                    {formatNumber(stats.totalHomesSupported)}
                                </p>
                                <p className="text-xs opacity-75">equivalent homes</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-8 h-8" />
                            <div>
                                <p className="text-sm opacity-90">Average ROI</p>
                                <p className="text-3xl font-bold">
                                    {stats.averageROI.toFixed(1)}%
                                </p>
                                <p className="text-xs opacity-75">
                                    {stats.averagePayback.toFixed(1)} yr payback
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Charts Section */}
                {sites && sites.length > 0 && (
                    <DashboardCharts sites={sites} />
                )}

                {/* Top Sites Table */}
                <div className="bg-white rounded-lg shadow mb-6">

                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-900">Top Performing Sites</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Sorted by suitability score
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">

                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Site Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generation</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ROI</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {stats.topSites.map((site) => (
                                    <tr key={site.id} className="hover:bg-gray-50">

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">
                                                    {site.type === 'wind' ? '💨' : site.type === 'solar' ? '☀️' : '⚡'}
                                                </span>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {site.name}
                                                    </div>

                                                    {site.isAiSuggested && (
                                                        <div className="text-xs text-green-600">
                                                            🤖 AI Recommended
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                                            {site.type}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {site.capacity} MW
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">

                                                <div className="w-16 bg-gray-200 rounded-full h-2">

                                                    <div
                                                        className={`h-2 rounded-full ${
                                                            site.suitabilityScore >= 90
                                                                ? 'bg-green-600'
                                                                : site.suitabilityScore >= 75
                                                                ? 'bg-blue-600'
                                                                : 'bg-yellow-600'
                                                        }`}
                                                        style={{
                                                            width: `${site.suitabilityScore}%`
                                                        }}
                                                    />

                                                </div>

                                                <span className="text-sm font-semibold">
                                                    {site.suitabilityScore}
                                                </span>

                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {site.annualGeneration
                                                ? `${formatNumber(site.annualGeneration)} MWh`
                                                : 'N/A'}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-semibold text-green-600">
                                            {site.roiPercentage
                                                ? `${parseFloat(site.roiPercentage).toFixed(1)}%`
                                                : 'N/A'}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}