import React from 'react';
import { Award, Zap, AwardIcon, Trophy } from 'lucide-react';

const Leaderboard = ({ leaderboard = [] }) => {
  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy size={18} className="text-amber-400" />;
      case 2:
        return <Trophy size={18} className="text-slate-300" />;
      case 3:
        return <Trophy size={18} className="text-amber-600" />;
      default:
        return <span className="text-xs font-semibold text-slate-500">{rank}</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Award className="text-indigo-400" />
        <h2 className="text-lg font-bold text-slate-200">Current Standings</h2>
      </div>

      <div className="overflow-x-auto">
        {leaderboard.length === 0 ? (
          <div className="text-center py-12 text-slate-500 border border-slate-900/60 rounded-2xl">
            No submissions recorded yet. Be the first to submit!
          </div>
        ) : (
          <table className="table w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                <th className="py-4 text-left w-16">Rank</th>
                <th className="py-4 text-left">Contestant</th>
                <th className="py-4 text-center w-24">Solved</th>
                <th className="py-4 text-right w-28">Score</th>
                <th className="py-4 text-right w-32">Penalty (Mins)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-sm">
              {leaderboard.map((row) => (
                <tr 
                  key={row.rank} 
                  className={`hover:bg-slate-900/20 transition-colors ${
                    row.rank <= 3 ? 'bg-indigo-950/5' : ''
                  }`}
                >
                  <td className="py-4 text-left font-bold pl-4">
                    <div className="flex items-center justify-start w-6 h-6">
                      {getRankBadge(row.rank)}
                    </div>
                  </td>
                  <td className="py-4 text-left font-semibold text-slate-200">
                    {row.name}
                  </td>
                  <td className="py-4 text-center font-semibold text-slate-300">
                    {row.solvedCount}
                  </td>
                  <td className="py-4 text-right text-emerald-400 font-bold">
                    {row.score}
                  </td>
                  <td className="py-4 text-right text-slate-400 font-mono">
                    {row.penalty} m
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
