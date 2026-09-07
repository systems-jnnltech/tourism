import React, { useState } from 'react';
import {
  X,
  Star,
  Sparkles,
  MapPin,
  Smile,
  ShieldCheck,
  Building,
  HeartHandshake,
  DollarSign,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { TouristFeedback } from '../../types';

interface AddFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddFeedbackModal: React.FC<AddFeedbackModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addFeedback, destinations } = useTourism();

  const [touristName, setTouristName] = useState('');
  const [touristOrigin, setTouristOrigin] = useState('');
  const [destinationVisited, setDestinationVisited] = useState(
    destinations.length > 0 ? destinations[0].siteName : 'Kalon Barak Skyline Ridge'
  );
  const [overallRating, setOverallRating] = useState<number>(5);
  const [ratings, setRatings] = useState({
    cleanliness: 5,
    safetySecurity: 5,
    hospitalityFriendliness: 5,
    facilitiesAmenities: 4,
    valueForMoney: 5,
    accessibilitySignages: 4,
  });
  const [npsScore, setNpsScore] = useState<number>(10);
  const [positiveRemarks, setPositiveRemarks] = useState('');
  const [areasForImprovement, setAreasForImprovement] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [submissionChannel, setSubmissionChannel] = useState<TouristFeedback['submissionChannel']>('TIAC Kiosk');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newFeedback: Omit<TouristFeedback, 'id'> = {
      referenceNumber: `CSAT-2026-0${Math.floor(100 + Math.random() * 900)}`,
      dateSubmitted: new Date().toISOString().substring(0, 10),
      touristName: touristName.trim() || 'Anonymous Visitor',
      touristOrigin: touristOrigin.trim() || 'General Santos City, Philippines',
      destinationVisited,
      overallRating,
      ratings,
      npsScore,
      artaSQD: {
        responsiveness: ratings.hospitalityFriendliness,
        reliability: ratings.safetySecurity,
        facilityAccess: ratings.facilitiesAmenities,
        communication: ratings.accessibilitySignages,
        costsFairness: ratings.valueForMoney,
        integrity: 5,
        safetyAssurance: ratings.safetySecurity,
        outcomeOverall: overallRating,
      },
      positiveRemarks: positiveRemarks.trim() || 'Enjoyed the peaceful mountain landscape and friendly local staff.',
      areasForImprovement: areasForImprovement.trim() || 'Add more shaded resting pavilions along the walkway.',
      wouldRecommend,
      submissionChannel,
      status: 'Reviewed',
    };

    addFeedback(newFeedback);
    onClose();
  };

  const handleRatingChange = (field: keyof typeof ratings, val: number) => {
    setRatings((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-300">
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">Record Tourist Satisfaction Survey (CSAT / ARTA)</h3>
              <p className="text-xs text-emerald-200">
                Collect structured visitor feedback and Net Promoter Score (NPS)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Survey Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Section: Tourist Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Tourist / Visitor Name (or Anonymous):
              </label>
              <input
                type="text"
                placeholder="e.g., Katherine Joyce Cruz"
                value={touristName}
                onChange={(e) => setTouristName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Origin / Residence:
              </label>
              <input
                type="text"
                placeholder="e.g., Davao City or Metro Manila"
                value={touristOrigin}
                onChange={(e) => setTouristOrigin(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Destination Visited:
              </label>
              <select
                value={destinationVisited}
                onChange={(e) => setDestinationVisited(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.siteName}>
                    {d.siteName} ({d.barangay})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Survey Collection Channel:
              </label>
              <select
                value={submissionChannel}
                onChange={(e) => setSubmissionChannel(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="On-Site Survey Station">On-Site Survey Station</option>
                <option value="TIAC Kiosk">TIAC Center Kiosk</option>
                <option value="Digital Mobile Form">Digital Mobile Form</option>
                <option value="Paper Exit Survey">Paper Exit Survey</option>
              </select>
            </div>
          </div>

          {/* Section: Overall Experience Star Rating */}
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-center">
            <label className="block font-bold text-slate-900 text-sm mb-1.5">
              Overall Tourism Experience Rating (1 to 5 Stars):
            </label>
            <div className="flex items-center justify-center gap-2 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setOverallRating(star)}
                  className="p-1.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= overallRating
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-amber-900">
              {overallRating === 5 && 'Outstanding / World-Class (5.0)'}
              {overallRating === 4 && 'Very Satisfied (4.0)'}
              {overallRating === 3 && 'Average / Moderate (3.0)'}
              {overallRating === 2 && 'Needs Improvement (2.0)'}
              {overallRating === 1 && 'Poor / Dissatisfied (1.0)'}
            </p>
          </div>

          {/* Section: Detailed Service Quality Dimensions (1-5) */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Service Dimensions & Amenity Scorecard</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Cleanliness & Waste Mgmt', key: 'cleanliness' as const },
                { label: 'Safety & Security Patrols', key: 'safetySecurity' as const },
                { label: 'Staff & Guide Hospitality', key: 'hospitalityFriendliness' as const },
                { label: 'Facilities & Restrooms', key: 'facilitiesAmenities' as const },
                { label: 'Value for Money / Pricing', key: 'valueForMoney' as const },
                { label: 'Signage & Road Access', key: 'accessibilitySignages' as const },
              ].map(({ label, key }) => (
                <div key={key} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="font-medium text-slate-700">{label}:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => handleRatingChange(key, v)}
                        className={`w-6 h-6 rounded text-[11px] font-bold transition-colors ${
                          ratings[key] === v
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-300'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Net Promoter Score (NPS) 0-10 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-800">
                Net Promoter Score (NPS): Likelihood to recommend Malungon to friends/family?
              </label>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                npsScore >= 9 ? 'bg-emerald-100 text-emerald-800' : npsScore >= 7 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {npsScore >= 9 ? 'Promoter' : npsScore >= 7 ? 'Passive' : 'Detractor'} ({npsScore}/10)
              </span>
            </div>
            <div className="flex items-center justify-between gap-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setNpsScore(score)}
                  className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors ${
                    npsScore === score
                      ? score >= 9
                        ? 'bg-emerald-700 text-white'
                        : score >= 7
                        ? 'bg-amber-600 text-white'
                        : 'bg-rose-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0 = Not at all likely</span>
              <span>10 = Extremely likely</span>
            </div>
          </div>

          {/* Qualitative Feedback */}
          <div className="space-y-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                What did you like most about your visit? (Positive Highlights)
              </label>
              <textarea
                rows={2}
                placeholder="e.g., Incredible mountain views, cool weather, delicious native coffee..."
                value={positiveRemarks}
                onChange={(e) => setPositiveRemarks(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Suggestions for Improvement / Next Visit:
              </label>
              <textarea
                rows={2}
                placeholder="e.g., Add more rest benches, install digital pos cashless pay at souvenir shops..."
                value={areasForImprovement}
                onChange={(e) => setAreasForImprovement(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Visitor Feedback</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
