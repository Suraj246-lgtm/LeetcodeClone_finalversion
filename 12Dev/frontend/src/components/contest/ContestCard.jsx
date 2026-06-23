import React from 'react';
import { NavLink } from 'react-router';
import { Calendar, Clock, Trophy, Play } from 'lucide-react';

const ContestCard = ({ contest, registration, onRegister, onStartVirtual }) => {
  const { _id, title, description, startTime, endTime, duration, status } = contest;

  const isRegistered = !!registration;
  const isPast = status === 'ended';
  const isActive = status === 'active';
  const isUpcoming = status === 'upcoming';

  const formatContestTime = (timeStr) => {
    const d = new Date(timeStr);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-slate-950/60 p-6 shadow-xl transition-all duration-300 ${
      isActive 
        ? 'border-indigo-500/40 bg-indigo-950/10 shadow-[0_0_20px_rgba(99,102,241,0.08)]' 
        : 'border-slate-800 hover:border-slate-700'
    }`}>
      {/* Glow on active */}
      {isActive && (
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {isActive && (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            )}
            <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${
              isActive 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : isUpcoming 
                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {status}
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-200 mt-2">{title}</h3>
        </div>
        <Trophy size={20} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-6 max-w-xl">
        {description || "Join this online competitive coding event to test your engineering capability and track your global ranking."}
      </p>

      {/* Meta data */}
      <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-900/60 py-4 mb-6 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-indigo-400" />
          <div>
            <p className="font-semibold text-slate-300">Starts At</p>
            <p className="mt-0.5">{formatContestTime(startTime)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-indigo-400" />
          <div>
            <p className="font-semibold text-slate-300">Duration</p>
            <p className="mt-0.5">{duration} mins</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {isPast ? (
          <>
            <button
              onClick={() => onStartVirtual(_id)}
              className="btn btn-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border-none rounded-xl font-bold flex items-center gap-1.5"
            >
              <Play size={12} /> Start Virtual Contest
            </button>
            <NavLink
              to={`/contest/${_id}/leaderboard`}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View Leaderboard
            </NavLink>
          </>
        ) : isUpcoming ? (
          <>
            <button
              onClick={() => !isRegistered && onRegister(_id)}
              disabled={isRegistered}
              className={`btn btn-sm border-none rounded-xl font-bold ${
                isRegistered 
                  ? 'bg-slate-900 text-slate-500 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
              }`}
            >
              {isRegistered ? 'Registered ✓' : 'Register Now'}
            </button>
            <span className="text-xs text-slate-500">Starts in 2 days</span>
          </>
        ) : (
          // Active Contest
          <>
            {isRegistered ? (
              <NavLink
                to={`/contest/${_id}`}
                className="btn btn-sm bg-indigo-600 hover:bg-indigo-500 text-white border-none rounded-xl font-bold flex items-center gap-1"
              >
                Enter Arena <Play size={12} />
              </NavLink>
            ) : (
              <button
                onClick={() => onRegister(_id)}
                className="btn btn-sm bg-indigo-600 hover:bg-indigo-500 text-white border-none rounded-xl font-bold"
              >
                Register & Enter
              </button>
            )}
            <NavLink
              to={`/contest/${_id}/leaderboard`}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Real-time Standings
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default ContestCard;
