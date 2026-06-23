import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router';
import { fetchContests, registerForContest, startVirtualContest } from '../slices/contestSlice';
import ContestCard from '../components/contest/ContestCard';
import { Trophy, ChevronLeft, User, Calendar } from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const ContestsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { contestsList, loading } = useSelector((state) => state.contest);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('active');
  const [registrations, setRegistrations] = useState({});

  useEffect(() => {
    dispatch(fetchContests());
  }, [dispatch]);

  // Fetch all registrations of the current user to display correct states
  useEffect(() => {
    const fetchUserRegistrations = async () => {
      try {
        const temp = {};
        for (const contest of contestsList) {
          const { data } = await axiosClient.get(`/contest/${contest._id}/registration`);
          if (data) {
            temp[contest._id] = data;
          }
        }
        setRegistrations(temp);
      } catch (err) {
        console.error("Failed to fetch user registrations:", err);
      }
    };
    if (contestsList.length > 0) {
      fetchUserRegistrations();
    }
  }, [contestsList]);

  const handleRegister = async (contestId) => {
    try {
      const action = await dispatch(registerForContest(contestId));
      if (registerForContest.fulfilled.match(action)) {
        setRegistrations(prev => ({ ...prev, [contestId]: action.payload }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartVirtual = async (contestId) => {
    try {
      const action = await dispatch(startVirtualContest(contestId));
      if (startVirtualContest.fulfilled.match(action)) {
        setRegistrations(prev => ({ ...prev, [contestId]: action.payload }));
        navigate(`/contest/${contestId}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeContests = contestsList.filter(c => c.status === 'active');
  const upcomingContests = contestsList.filter(c => c.status === 'upcoming');
  const endedContests = contestsList.filter(c => c.status === 'ended');

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
        
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <NavLink to="/" className="hover:text-indigo-400 transition-colors">Dashboard</NavLink>
            <span>/</span>
            <span className="text-slate-200">Contests</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Trophy className="text-indigo-400" /> Contest Arena
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Register and compete in real-time or practice with past virtual contests to challenge yourself.
          </p>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-bordered bg-slate-950/40 border-b border-slate-800 p-1 rounded-xl inline-flex gap-2 mb-4">
          <button 
            className={`tab px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'active' 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Live & Upcoming ({activeContests.length + upcomingContests.length})
          </button>
          <button 
            className={`tab px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'past' 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setActiveTab('past')}
          >
            Past Events ({endedContests.length})
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <span className="loading loading-spinner loading-lg text-indigo-500"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTab === 'active' ? (
              <>
                {/* Active Contests */}
                {activeContests.map((c) => (
                  <ContestCard 
                    key={c._id} 
                    contest={c} 
                    registration={registrations[c._id]}
                    onRegister={handleRegister}
                    onStartVirtual={handleStartVirtual}
                  />
                ))}
                {/* Upcoming Contests */}
                {upcomingContests.map((c) => (
                  <ContestCard 
                    key={c._id} 
                    contest={c} 
                    registration={registrations[c._id]}
                    onRegister={handleRegister}
                    onStartVirtual={handleStartVirtual}
                  />
                ))}
                {activeContests.length === 0 && upcomingContests.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-slate-500 border border-slate-800 rounded-2xl">
                    No active or upcoming contests at this time. Check back later!
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Ended Contests */}
                {endedContests.map((c) => (
                  <ContestCard 
                    key={c._id} 
                    contest={c} 
                    registration={registrations[c._id]}
                    onRegister={handleRegister}
                    onStartVirtual={handleStartVirtual}
                  />
                ))}
                {endedContests.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-slate-500 border border-slate-800 rounded-2xl">
                    No past contests found.
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default ContestsPage;
