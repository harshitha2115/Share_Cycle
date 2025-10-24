import React, { useState, useMemo } from 'react';
import { Donation, Request, MatchResult } from '../types';
import { findDonationMatches } from '../services/geminiService';
import Spinner from './Spinner';

interface AdminMatcherProps {
  donations: Donation[];
  requests: Request[];
}

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

const ConfidenceBar: React.FC<{ confidence: MatchResult['confidence'] }> = ({ confidence }) => {
  const confidenceLevels = {
    low: { width: '33%', color: 'bg-orange-400', textColor: 'text-orange-500', label: 'Low' },
    medium: { width: '66%', color: 'bg-yellow-400', textColor: 'text-yellow-500', label: 'Medium' },
    high: { width: '100%', color: 'bg-green-500', textColor: 'text-green-600', label: 'High' },
  };

  const level = confidence ? confidenceLevels[confidence] : null;

  if (!level) {
    return (
        <div className="text-center">
             <span className="text-xs font-semibold uppercase px-2 py-1 rounded-full bg-neutral-200 text-neutral-600">
                Not Matched
            </span>
        </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className={`text-sm font-bold ${level.textColor}`}>{level.label}</span>
        <span className="text-xs text-neutral-500">Confidence</span>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-2.5">
        <div
          className={`${level.color} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: level.width }}
        ></div>
      </div>
    </div>
  );
};

const MatchItemCard: React.FC<{ item: Donation | Request | null; type: 'Donation' | 'Request' }> = ({ item, type }) => {
    if (!item) {
        return (
            <div className="bg-neutral-100 p-4 rounded-lg h-full flex flex-col justify-center border border-dashed border-neutral-300">
                <h4 className="font-bold text-neutral-700 mb-2">{type}:</h4>
                <p className="text-neutral-500 italic text-center py-4">No suitable item found.</p>
            </div>
        )
    }
    
    return (
        <div className="bg-neutral-100 p-4 rounded-lg h-full border border-neutral-200">
            <h4 className="font-bold text-neutral-700 mb-2">{type}:</h4>
            <p className="text-sm text-neutral-500 mb-1">Category: {item.category}</p>
            <p className="text-neutral-800 text-sm">"{item.description}"</p>
        </div>
    )
  }

const AdminMatcher: React.FC<AdminMatcherProps> = ({ donations, requests }) => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const successfulMatches = useMemo(() => matches.filter(m => m.donationId).length, [matches]);
  const totalRequests = requests.length;

  const handleFindMatches = async () => {
    setIsLoading(true);
    setError(null);
    setMatches([]);
    try {
      const results = await findDonationMatches(donations, requests);
      setMatches(results);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const donationsById = useMemo(() => 
    donations.reduce((acc, d) => {
        acc[d.id] = d;
        return acc;
    }, {} as Record<string, Donation>), [donations]);

  const requestsById = useMemo(() =>
    requests.reduce((acc, r) => {
        acc[r.id] = r;
        return acc;
    }, {} as Record<string, Request>), [requests]);
  

  return (
    <div className="space-y-8">
      <div className="text-center p-6 bg-neutral-50 rounded-xl border border-neutral-200">
        <h3 className="text-xl font-bold text-neutral-800 mb-2">Ready to Match?</h3>
        <p className="text-neutral-600 mb-4 max-w-lg mx-auto">Click the button below to use our AI assistant to find the best matches between the current list of donations and requests.</p>
        <button
          onClick={handleFindMatches}
          disabled={isLoading || donations.length === 0 || requests.length === 0}
          className="px-8 py-3 bg-primary-DEFAULT text-white font-bold rounded-lg shadow-md hover:bg-primary-dark disabled:bg-neutral-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
        >
          {isLoading ? 'Finding Matches...' : '✨ Find Matches with AI'}
        </button>
        {(donations.length === 0 || requests.length === 0) && (
            <p className="text-sm text-neutral-500 mt-2">You need at least one donation and one request to find matches.</p>
        )}
      </div>

      {isLoading && <Spinner />}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">{error}</div>}

      {matches.length > 0 && (
        <div className="space-y-8">
            <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
                <h3 className="text-xl font-bold text-neutral-800 mb-4">Matching Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                    <p className="text-3xl font-bold text-primary-dark">{totalRequests}</p>
                    <p className="text-sm text-neutral-600">Total Requests</p>
                    </div>
                    <div>
                    <p className="text-3xl font-bold text-green-600">{successfulMatches}</p>
                    <p className="text-sm text-neutral-600">Successful Matches</p>
                    </div>
                    <div>
                    <p className="text-3xl font-bold text-red-600">{totalRequests - successfulMatches}</p>
                    <p className="text-sm text-neutral-600">Unmatched Requests</p>
                    </div>
                </div>
                {totalRequests > 0 && (
                    <div className="mt-4">
                        <div className="w-full bg-red-200 rounded-full h-4 flex overflow-hidden" title={`${totalRequests - successfulMatches} Unmatched`}>
                            <div 
                            className="bg-green-500 h-4" 
                            style={{ width: `${(successfulMatches / totalRequests) * 100}%` }}
                            title={`${successfulMatches} Matched`}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            <h3 className="text-2xl font-bold text-neutral-800">Matching Results</h3>
            <div className="space-y-6">
            {matches.map(match => {
                const request = requestsById[match.requestId];
                const donation = match.donationId ? donationsById[match.donationId] : null;
                return (
                    <div key={match.requestId} className="bg-neutral-50 p-4 sm:p-6 rounded-xl shadow-sm border border-neutral-200 transition-all duration-300 hover:shadow-md">
                        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-stretch">
                            <div className="lg:col-span-5">
                                <MatchItemCard item={request} type="Request" />
                            </div>
                            
                            <div className="lg:col-span-1 hidden lg:flex items-center justify-center">
                                <ArrowRightIcon className="w-8 h-8 text-neutral-300" />
                            </div>

                            <div className="lg:col-span-5">
                                <MatchItemCard item={donation} type="Donation" />
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-neutral-200">
                            <h4 className="font-semibold text-sm text-neutral-600 mb-3 text-center">AI Assessment</h4>
                            <div className="max-w-md mx-auto space-y-3">
                                <ConfidenceBar confidence={match.confidence} />
                                <p className="text-neutral-700 text-sm italic text-center">"{match.reasoning}"</p>
                            </div>
                        </div>
                    </div>
                );
            })}
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminMatcher;