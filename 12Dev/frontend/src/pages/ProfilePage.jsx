import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { fetchStreakStats, fetchHeatmapData } from '../slices/streakSlice';
import { updateUserProfile } from '../authSlice';
import axiosClient from '../utils/axiosClient';
import StreakCounter from '../components/streak/StreakCounter';
import StatsCards from '../components/streak/StatsCards';
import Heatmap from '../components/streak/Heatmap';
import { User, Mail, Award, Edit2, CheckCircle, ChevronLeft } from 'lucide-react';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, heatmap } = useSelector((state) => state.streak);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [bio, setBio] = useState(user?.bio || 'Competitive programmer & software engineer.');
  const [isEditingBio, setIsEditingBio] = useState(false);

  useEffect(() => {
    dispatch(fetchStreakStats());
    dispatch(fetchHeatmapData());

    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProblems();
    fetchSolvedProblems();
  }, [dispatch]);

  const handleSaveBio = async () => {
    try {
      await dispatch(updateUserProfile({ bio }));
      setIsEditingBio(false);
    } catch (err) {
      console.error("Failed to save bio:", err);
      setIsEditingBio(false);
    }
  };

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
              <NavLink to="/contests" className="hover:text-white transition-colors">Contests</NavLink>
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
            to="/" 
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <ChevronLeft size={14} /> Back to Dashboard
          </NavLink>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Profile Overview Card */}
            <div className="md:col-span-1 card bg-slate-950/40 border border-slate-800/80 p-6 rounded-2xl shadow-xl flex flex-col items-center text-center space-y-6">
              
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-extrabold text-3xl shadow-xl">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <div className="absolute bottom-0 right-0 p-1.5 bg-slate-900 border border-slate-850 rounded-full text-indigo-400 shadow-md">
                  <Award size={14} />
                </div>
              </div>

              {/* Names */}
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-100">{user?.firstName} {user?.lastName}</h2>
                <p className="text-xs text-indigo-400 font-semibold tracking-wider uppercase">{user?.role || 'Developer'}</p>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 border border-slate-850 px-4 py-2 rounded-full">
                <Mail size={12} className="text-indigo-400" />
                <span>{user?.email}</span>
              </div>

              <div className="border-t border-slate-900/60 w-full" />

              {/* Bio */}
              <div className="w-full text-left space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Bio</span>
                  <button 
                    onClick={() => setIsEditingBio(!isEditingBio)}
                    className="p-1 hover:bg-slate-900 rounded text-slate-500 hover:text-slate-300 transition-all"
                  >
                    <Edit2 size={12} />
                  </button>
                </div>

                {isEditingBio ? (
                  <div className="space-y-2">
                    <textarea 
                      className="textarea textarea-bordered w-full text-xs bg-slate-900 border-slate-800 text-slate-200 focus:outline-none"
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setIsEditingBio(false)} 
                        className="btn btn-xs btn-outline border-slate-800 text-slate-400 rounded"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveBio}
                        className="btn btn-xs bg-indigo-600 hover:bg-indigo-500 border-none text-white rounded"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    {bio}
                  </p>
                )}
              </div>

            </div>

            {/* Performance Stats Cards */}
            <div className="md:col-span-2 space-y-6">
              <StreakCounter 
                currentStreak={stats?.currentStreak || 0} 
                longestStreak={stats?.longestStreak || 0} 
                lastSolvedDate={stats?.lastSolvedDate} 
              />
              <StatsCards 
                totalSolved={stats?.totalSolved || 0} 
                problemSolved={solvedProblems} 
                allProblems={problems} 
              />
            </div>

          </div>
        </div>

        {/* Contribution Heatmap */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Activity Log</h2>
          <Heatmap activities={heatmap} />
        </div>

      </main>
    </div>
  );
};

export default ProfilePage;
