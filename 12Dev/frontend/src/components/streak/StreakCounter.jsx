import React from 'react';
import { Flame, Trophy, Calendar } from 'lucide-react';

const StreakCounter = ({ currentStreak = 0, longestStreak = 0, lastSolvedDate }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never solved';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isActiveToday = () => {
    if (!lastSolvedDate) return false;
    const todayStr = new Date().toISOString().split('T')[0];
    const lastSolvedStr = new Date(lastSolvedDate).toISOString().split('T')[0];
    return todayStr === lastSolvedStr;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 p-6 shadow-2xl transition-all duration-300 hover:border-indigo-500/50">
      {/* Decorative background glow */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Current Streak */}
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl transition-all duration-500 ${
            isActiveToday() 
              ? 'bg-orange-500/20 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.2)] animate-pulse' 
              : 'bg-slate-800 text-slate-400'
          }`}>
            <Flame size={36} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">Current Streak</p>
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-extrabold tracking-tight ${
                isActiveToday() ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300' : 'text-slate-200'
              }`}>
                {currentStreak}
              </span>
              <span className="text-sm font-medium text-slate-400">days</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isActiveToday() ? 'Active today! Keep it up 🔥' : 'Solve a problem today to continue!'}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-[1px] h-12 bg-slate-800" />

        {/* Longest Streak */}
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400">
            <Trophy size={36} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">Longest Streak</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold tracking-tight text-amber-300">
                {longestStreak}
              </span>
              <span className="text-sm font-medium text-slate-400">days</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Personal best record</p>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-[1px] h-12 bg-slate-800" />

        {/* Last Solved Date */}
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400">
            <Calendar size={36} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">Last Solved</p>
            <p className="text-lg font-bold text-slate-200 mt-1">
              {formatDate(lastSolvedDate)}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Time of last accepted solution</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StreakCounter;
