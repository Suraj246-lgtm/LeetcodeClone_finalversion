import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink } from 'react-router';
import { fetchContestDetails, fetchContestLeaderboard, clearActiveContest } from '../slices/contestSlice';
import Leaderboard from '../components/contest/Leaderboard';
import { ChevronLeft, Trophy, User } from 'lucide-react';

const ContestLeaderboard = () => {
  const { contestId } = useParams();
  const dispatch = useDispatch();

  const { activeContest, leaderboard, loading } = useSelector((state) => state.contest);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (contestId) {
      dispatch(fetchContestDetails(contestId));
      dispatch(fetchContestLeaderboard(contestId));
    }
    return () => {
      dispatch(clearActiveContest());
    };
  }, [dispatch, contestId]);

  return (
    <div className="min-h-screen bg-[#08080c] text-slate-100 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-slate-800/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
              LeetCode <span className="text-slate-400 text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Mini</span>
            </NavLink>
            <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
              <NavLink to="/" className="hover:text-white transition-colors">Dashboard</NavLink>
              <NavLink to="/sheets" className="hover:text-white transition-colors">DSA Sheets</NavLink>
              <NavLink to="/contests" className="text-indigo-400">Contests</NavLink>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-2">
              <User size={16} className="text-indigo-400" />
              <span className="text-sm font-semibold">{user?.firstName}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Back Link & Header */}
        <div className="space-y-4">
          <NavLink 
            to="/contests" 
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <ChevronLeft size={14} /> Back to Contests
          </NavLink>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-950/40 border border-slate-800/80 p-6 rounded-2xl">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                <Trophy className="text-amber-400" /> {activeContest?.title} - Standings
              </h1>
              <p className="text-xs text-slate-400">
                Official leaderboard. Standings are ranked by score (descending), and tie-broken by time penalty (ascending).
              </p>
            </div>

            <NavLink 
              to={`/contest/${contestId}`}
              className="btn btn-sm bg-indigo-600 hover:bg-indigo-500 text-white border-none rounded-xl font-bold"
            >
              Enter Arena
            </NavLink>
          </div>
        </div>

        {/* Leaderboard Table Card */}
        <div className="card bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <span className="loading loading-spinner loading-lg text-indigo-500"></span>
            </div>
          ) : (
            <Leaderboard leaderboard={leaderboard} />
          )}
        </div>

      </main>
    </div>
  );
};

export default ContestLeaderboard;
