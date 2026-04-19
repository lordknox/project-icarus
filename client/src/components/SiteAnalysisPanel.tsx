import { useState } from 'react';
import { useSaveSite } from '../hooks/useRenewableSites';
import { Save, Check, X, Zap, MapPin, DollarSign, Leaf, Home, AlertTriangle, CheckCircle } from 'lucide-react';
import { RenewableSite, SiteAnalysis } from '../lib/api';

interface SiteAnalysisPanelProps {
  site?: RenewableSite;
  analysis?: SiteAnalysis;
  onClose: () => void;
  isOpen: boolean;
  coordinates?: { lat: number; lng: number }; 
}

export function SiteAnalysisPanel({ site, analysis, onClose, isOpen, coordinates }: SiteAnalysisPanelProps) {
  if (!isOpen) return null;
  
  const [siteName, setSiteName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const saveSiteMutation = useSaveSite();

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-blue-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toFixed(0);
  };

  const handleSaveSite = async () => {
    if (!analysis || !coordinates) return;
    
    if (!showNameInput) {
      setShowNameInput(true);
      return;
    }

    if (!siteName.trim()) {
      alert('Please enter a site name');
      return;
    }

    try {
      await saveSiteMutation.mutateAsync({
        name: siteName,
        type: analysis.energyType,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        capacity: analysis.technicalMetrics.estimatedCapacity,
        analysis,
      });
      setIsSaved(true);
      setShowNameInput(false);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      alert('Failed to save site. Please try again.');
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-[1000] transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[500px] bg-white shadow-2xl z-[1001] transform transition-transform overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Save Button - Only show for new analyzed sites */}
          {!site && analysis && coordinates && (
            <button
              onClick={handleSaveSite}
              disabled={isSaved || saveSiteMutation.isPending}
              className={`absolute top-4 right-16 p-2 rounded-lg transition-colors ${
                isSaved
                  ? 'bg-green-500 text-white'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              {isSaved ? (
                <Check className="w-5 h-5" />
              ) : (
                <Save className="w-5 h-5" />
              )}
            </button>
          )}

          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              {site?.type === 'wind' ? '💨' : site?.type === 'solar' ? '☀️' : '⚡'}
            </div>
            <div>
              <h2 className="text-xl font-bold">{site?.name || 'New Site Analysis'}</h2>
              <p className="text-blue-100 text-sm capitalize">
                {site?.type || analysis?.energyType} Energy Site
              </p>
            </div>
          </div>

          {site?.isAiSuggested && (
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-100 px-3 py-1 rounded-full text-sm">
              <CheckCircle className="w-4 h-4" />
              Higly recommended
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Save Site Name Input */}
          {showNameInput && !site && (
            <div className="p-4 bg-blue-50 border-b border-blue-100 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="e.g., Kutch Solar Farm"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSaveSite}
                  disabled={saveSiteMutation.isPending}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  {saveSiteMutation.isPending ? 'Saving...' : 'Save Site'}
                </button>
                <button
                  onClick={() => setShowNameInput(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {isSaved && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <Check className="w-5 h-5" />
              <span className="font-medium">Site saved successfully!</span>
            </div>
          )}

          {/* Overall Score */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Overall Suitability</h3>
              <span className="text-3xl font-bold text-blue-600">
                {site?.suitabilityScore || analysis?.suitabilityScore}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className={`h-3 rounded-full transition-all ${getScoreColor(
                  site?.suitabilityScore || analysis?.suitabilityScore || 0
                )}`}
                style={{ width: `${site?.suitabilityScore || analysis?.suitabilityScore}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {getScoreLabel(site?.suitabilityScore || analysis?.suitabilityScore || 0)} site for{' '}
              {site?.type || analysis?.energyType} energy production
            </p>
          </div>

          {/* Key Metrics */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Technical Metrics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Capacity</span>
                <span className="font-semibold">
                  {site?.capacity || analysis?.technicalMetrics?.estimatedCapacity} MW
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Annual Generation</span>
                <span className="font-semibold">
                  {site?.annualGeneration
                    ? `${formatNumber(site.annualGeneration)} MWh`
                    : analysis?.technicalMetrics?.annualGeneration
                    ? `${formatNumber(analysis.technicalMetrics.annualGeneration)} MWh`
                    : 'N/A'}
                </span>
              </div>
              {(site?.capacityFactor || analysis?.technicalMetrics?.capacityFactor) && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Capacity Factor</span>
                  <span className="font-semibold">
                    {site?.capacityFactor ||
                      `${analysis?.technicalMetrics?.capacityFactor?.toFixed(1)}%`}
                  </span>
                </div>
              )}
              {(site?.gridDistance || analysis?.technicalMetrics?.gridDistance) && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Grid Distance</span>
                  <span className="font-semibold">
                    {site?.gridDistance || analysis?.technicalMetrics?.gridDistance} km
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Economic Analysis */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Economic Analysis
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                <span className="text-sm text-gray-600">Investment Required</span>
                <span className="font-bold text-green-700">
                  $
                  {site?.investmentRequired || analysis?.economicMetrics?.investmentRequired}M
                </span>
              </div>
              {(site?.roiPercentage || analysis?.economicMetrics?.roi) && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">ROI</span>
                  <span className="font-semibold text-green-600">
                    {site?.roiPercentage
                      ? `${parseFloat(site.roiPercentage).toFixed(1)}%`
                      : `${analysis?.economicMetrics?.roi?.toFixed(1)}%`}
                  </span>
                </div>
              )}
              {(site?.paybackYears || analysis?.economicMetrics?.paybackPeriod) && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Payback Period</span>
                  <span className="font-semibold">
                    {site?.paybackYears
                      ? `${parseFloat(site.paybackYears).toFixed(1)} years`
                      : `${analysis?.economicMetrics?.paybackPeriod?.toFixed(1)} years`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Environmental Impact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Environmental Impact
            </h3>
            <div className="space-y-3">
              {(site?.co2SavedAnnually || analysis?.impactMetrics?.co2SavedAnnually) && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">CO₂ Saved Annually</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatNumber(
                      site?.co2SavedAnnually || analysis?.impactMetrics?.co2SavedAnnually || 0
                    )}{' '}
                    tons
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Equivalent to{' '}
                    {formatNumber(
                      (site?.co2SavedAnnually || analysis?.impactMetrics?.co2SavedAnnually || 0) /
                        4.6
                    )}{' '}
                    cars off the road
                  </p>
                </div>
              )}
              {(site?.homesSupported || analysis?.impactMetrics?.homesSupported) && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Home className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Homes Powered</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatNumber(
                      site?.homesSupported || analysis?.impactMetrics?.homesSupported || 0
                    )}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Equivalent Indian households</p>
                </div>
              )}
            </div>
          </div>

          {/* Scoring Factors */}
          {analysis?.factors && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Detailed Scoring</h3>
              <div className="space-y-3">
                <ScoreFactor
                  label="Resource Quality"
                  score={analysis.factors.resourceQuality}
                  maxScore={100}
                />
                <ScoreFactor
                  label="Grid Proximity"
                  value={analysis.factors.gridProximity}
                />
                <ScoreFactor
                  label="Land Availability"
                  value={analysis.factors.landAvailability}
                />
                <ScoreFactor
                  label="Economic Viability"
                  value={analysis.factors.economicViability}
                />
                <ScoreFactor
                  label="Environmental Impact"
                  value={analysis.factors.environmentalImpact}
                />
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis?.recommendations && analysis.recommendations.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Recommendations
              </h3>
              <div className="space-y-2">
                {analysis.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 p-3 bg-green-50 rounded-lg border border-green-100"
                  >
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {analysis?.warnings && analysis.warnings.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Considerations
              </h3>
              <div className="space-y-2">
                {analysis.warnings.map((warning, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 p-3 bg-orange-50 rounded-lg border border-orange-100"
                  >
                    <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{warning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Location
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Latitude</span>
                <span className="font-mono">
                  {site?.latitude 
                    ? parseFloat(site.latitude).toFixed(4)
                    : coordinates?.lat.toFixed(4) || 'N/A'}°
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Longitude</span>
                <span className="font-mono">
                  {site?.longitude 
                    ? parseFloat(site.longitude).toFixed(4)
                    : coordinates?.lng.toFixed(4) || 'N/A'}°
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ScoreFactor({
  label,
  score,
  maxScore = 100,
  value,
}: {
  label: string;
  score?: number;
  maxScore?: number;
  value?: string;
}) {
  const percentage = score ? (score / maxScore) * 100 : null;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        {value ? (
          <span className="font-medium">{value}</span>
        ) : (
          <span className="font-medium">{score}/{maxScore}</span>
        )}
      </div>
      {percentage !== null && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              percentage >= 80
                ? 'bg-green-500'
                : percentage >= 60
                ? 'bg-blue-500'
                : percentage >= 40
                ? 'bg-yellow-500'
                : 'bg-orange-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}