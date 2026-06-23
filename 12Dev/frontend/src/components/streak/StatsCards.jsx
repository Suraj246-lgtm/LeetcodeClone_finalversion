import React from 'react';
import { CheckCircle2, Award, Zap, Percent } from 'lucide-react';

const StatsCards = ({ totalSolved = 0, problemSolved = [], allProblems = [] }) => {
  // Calculate distribution by difficulty
  const solvedSet = new Set(problemSolved.map(p => p._id));
  
  const difficultyCounts = allProblems.reduce((acc, prob) => {
    const isSolved = solvedSet.has(prob._id);
    const diff = prob.difficulty.toLowerCase();
    
    if (!acc.total[diff]) acc.total[diff] = 0;
    acc.total[diff]++;
    
    if (isSolved) {
      if (!acc.solved[diff]) acc.solved[diff] = 0;
      acc.solved[diff]++;
    }
    return acc;
  }, { total: { easy: 0, medium: 0, hard: 0 }, solved: { easy: 0, medium: 0, hard: 0 } });

  const easySolved = difficultyCounts.solved.easy || 0;
  const easyTotal = difficultyCounts.total.easy || 0;
  const mediumSolved = difficultyCounts.solved.medium || 0;
  const mediumTotal = difficultyCounts.total.medium || 0;
  const hardSolved = difficultyCounts.solved.hard || 0;
  const hardTotal = difficultyCounts.total.hard || 0;

  const totalProblemsCount = allProblems.length || 1;
  const overallPercentage = Math.round((totalSolved / totalProblemsCount) * 100) || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Solved Card */}
      <div className="card bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden transition-all duration-300 hover:border-indigo-500/50">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 text-slate-800 opacity-20 pointer-events-none">
          <CheckCircle2 size={120} />
        </div>
        <div className="flex items-center gap-3 text-emerald-400 mb-2">
          <CheckCircle2 size={20} />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Solved</span>
        </div>
        <div className="text-3xl font-extrabold text-slate-200">{totalSolved}</div>
        <div className="text-xs text-slate-500 mt-1">out of {totalProblemsCount} available questions</div>
      </div>

      {/* Easy Solved Card */}
      <div className="card bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden transition-all duration-300 hover:border-indigo-500/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Easy Tasks</span>
          <span className="text-xs font-bold text-emerald-400">{easySolved}/{easyTotal}</span>
        </div>
        <div className="text-3xl font-extrabold text-emerald-400">{easySolved}</div>
        <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
          <div 
            className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
            style={{ width: `${easyTotal ? (easySolved / easyTotal) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Medium Solved Card */}
      <div className="card bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden transition-all duration-300 hover:border-indigo-500/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Medium Tasks</span>
          <span className="text-xs font-bold text-amber-400">{mediumSolved}/{mediumTotal}</span>
        </div>
        <div className="text-3xl font-extrabold text-amber-400">{mediumSolved}</div>
        <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
          <div 
            className="bg-amber-500 h-full rounded-full transition-all duration-500" 
            style={{ width: `${mediumTotal ? (mediumSolved / mediumTotal) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Hard Solved Card */}
      <div className="card bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden transition-all duration-300 hover:border-indigo-500/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hard Tasks</span>
          <span className="text-xs font-bold text-rose-500">{hardSolved}/{hardTotal}</span>
        </div>
        <div className="text-3xl font-extrabold text-rose-500">{hardSolved}</div>
        <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
          <div 
            className="bg-rose-500 h-full rounded-full transition-all duration-500" 
            style={{ width: `${hardTotal ? (hardSolved / hardTotal) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
