import React, { useState, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';
import { Lock, Unlock, HelpCircle, AlertCircle } from 'lucide-react';

const HintPanel = ({ problemId }) => {
  const [hints, setHints] = useState({ 1: null, 2: null, 3: null });
  const [loading, setLoading] = useState({ 1: false, 2: false, 3: false });
  const [error, setError] = useState(null);

  // Fetch already unlocked hints for this problem
  useEffect(() => {
    const fetchUnlockedHints = async () => {
      try {
        const response = await axiosClient.get(`/ai/hint/${problemId}/revealed`);
        const newHints = { 1: null, 2: null, 3: null };
        response.data.forEach(item => {
          newHints[item.level] = item.hint;
        });
        setHints(newHints);
      } catch (err) {
        console.error("Failed to fetch revealed hints:", err);
      }
    };
    if (problemId) {
      fetchUnlockedHints();
    }
  }, [problemId]);

  const handleReveal = async (level) => {
    setLoading(prev => ({ ...prev, [level]: true }));
    setError(null);
    try {
      const response = await axiosClient.post(`/ai/hint/${problemId}`, { level });
      setHints(prev => ({ ...prev, [level]: response.data.hint }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate AI hint. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, [level]: false }));
    }
  };

  const hintLevels = [
    {
      level: 1,
      title: "Hint 1: Conceptual Nudge",
      description: "Get a high-level conceptual hint about the category, data structures, or patterns of this problem."
    },
    {
      level: 2,
      title: "Hint 2: Algorithmic Approach",
      description: "Understand the detailed logic and step-by-step approach to solve the problem theoretically."
    },
    {
      level: 3,
      title: "Hint 3: Logic & Pseudocode",
      description: "See the pseudocode outline or logical structure of the optimal solution."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle size={22} className="text-indigo-400" />
        <h2 className="text-xl font-bold text-slate-200">AI Hint Assistant</h2>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-4">
        Hints are tiered to help you solve the problem step-by-step without spoiling the solution. Try to solve the problem with the lowest level hint before revealing the next!
      </p>

      {error && (
        <div className="alert alert-error bg-rose-500/10 border-rose-500/30 text-rose-400 p-4 rounded-xl flex gap-2 items-center text-xs">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {hintLevels.map((hl) => {
          const isUnlocked = !!hints[hl.level];
          const isLoading = loading[hl.level];

          return (
            <div 
              key={hl.level} 
              className={`p-5 rounded-2xl border transition-all duration-300 ${
                isUnlocked 
                  ? 'bg-slate-900/40 border-indigo-500/20' 
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    {isUnlocked ? (
                      <Unlock size={14} className="text-indigo-400" />
                    ) : (
                      <Lock size={14} className="text-slate-500" />
                    )}
                    {hl.title}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xl">{hl.description}</p>
                </div>

                {!isUnlocked && (
                  <button
                    onClick={() => handleReveal(hl.level)}
                    disabled={isLoading}
                    className="btn btn-sm bg-indigo-600 hover:bg-indigo-500 text-white border-none rounded-xl font-semibold shadow-lg shadow-indigo-600/20"
                  >
                    {isLoading ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      "Reveal Hint"
                    )}
                  </button>
                )}
              </div>

              {isUnlocked && (
                <div className="mt-4 pt-4 border-t border-slate-800/60">
                  <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono prose prose-invert max-w-none">
                    {hints[hl.level]}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HintPanel;
