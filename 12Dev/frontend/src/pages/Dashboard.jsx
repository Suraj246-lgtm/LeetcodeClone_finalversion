import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { logoutUser } from '../authSlice';
import { fetchStreakStats, fetchHeatmapData } from '../slices/streakSlice';
import axiosClient from '../utils/axiosClient';
import StreakCounter from '../components/streak/StreakCounter';
import StatsCards from '../components/streak/StatsCards';
import Heatmap from '../components/streak/Heatmap';
import { Search, Filter, BookOpen, Building2, User, LogOut, Flame } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, heatmap } = useSelector((state) => state.streak);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(true);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    // Fetch streak and heatmap stats
    dispatch(fetchStreakStats());
    dispatch(fetchHeatmapData());

    // Fetch all problems
    const fetchProblems = async () => {
      try {
        setLoadingProblems(true);
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoadingProblems(false);
      }
    };

    // Fetch solved problems
    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) {
      fetchSolvedProblems();
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'hard': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const isSolved = (problemId) => {
    return solvedProblems.some(sp => sp._id === problemId);
  };

  // Filtering logic
  const filteredProblems = problems.filter(prob => {
    const title = prob.title || '';
    const difficulty = prob.difficulty || 'easy';
    const tags = prob.tags || '';

    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesTag = selectedTag === 'all' || tags.toLowerCase() === selectedTag.toLowerCase();
    
    let matchesStatus = true;
    if (selectedStatus === 'solved') {
      matchesStatus = isSolved(prob._id);
    } else if (selectedStatus === 'unsolved') {
      matchesStatus = !isSolved(prob._id);
    }

    return matchesSearch && matchesDifficulty && matchesTag && matchesStatus;
  });

  const companiesList = [
    { name: 'Google', slug: 'google', color: 'from-blue-500/20 to-emerald-500/20 border-blue-500/30 hover:border-blue-400/60' },
    { name: 'Amazon', slug: 'amazon', color: 'from-orange-500/20 to-amber-500/20 border-orange-500/30 hover:border-orange-400/60' },
    { name: 'Microsoft', slug: 'microsoft', color: 'from-indigo-500/20 to-cyan-500/20 border-indigo-500/30 hover:border-indigo-400/60' },
    { name: 'Meta', slug: 'meta', color: 'from-blue-600/20 to-indigo-600/20 border-blue-600/30 hover:border-blue-500/60' }
  ];

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
              <NavLink to="/" className="text-indigo-400">Dashboard</NavLink>
              <NavLink to="/sheets" className="hover:text-white transition-colors">DSA Sheets</NavLink>
              <NavLink to="/contests" className="hover:text-white transition-colors">Contests</NavLink>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user?.role === 'admin' && (
              <NavLink to="/admin" className="btn btn-xs sm:btn-sm btn-outline border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                Admin Panel
              </NavLink>
            )}
            
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="flex items-center gap-2 cursor-pointer bg-slate-900 border border-slate-800 rounded-full px-4 py-2 hover:border-indigo-500/50 transition-all">
                <User size={16} className="text-indigo-400" />
                <span className="text-sm font-semibold">{user?.firstName}</span>
              </label>
              <ul tabIndex={0} className="mt-2 p-2 shadow-2xl menu menu-sm dropdown-content bg-slate-950 border border-slate-800 rounded-2xl w-52">
                <li><NavLink to="/profile" className="flex gap-2"><User size={14}/> Profile</NavLink></li>
                <div className="h-[1px] bg-slate-800 my-1" />
                <li><button onClick={handleLogout} className="flex gap-2 text-rose-400 hover:bg-rose-500/10"><LogOut size={14}/> Logout</button></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.firstName}!</h1>
            <p className="text-slate-400 text-sm mt-1">Ready to tackle your coding problems today?</p>
          </div>
        </div>

        {/* Streak & Stats Section */}
        <div className="space-y-6">
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

        {/* Contribution Heatmap */}
        <Heatmap activities={heatmap} />

        {/* Company DSA Sheets Quick Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Company-wise DSA Sheets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {companiesList.map((company, index) => (
              <NavLink 
                key={index} 
                to={`/sheets/${company.slug}`}
                className={`flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br ${company.color} border transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold">{company.name} Sheet</span>
                  <Building2 size={20} className="text-slate-400" />
                </div>
                <div className="text-xs text-slate-400">
                  Targeted interview questions, curated path
                </div>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Problem Directory / Table */}
        <div className="card bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-200">Problem Directory</h2>
              <p className="text-xs text-slate-500 mt-0.5">Filter and find coding questions</p>
            </div>
            
            {/* Search & Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search problems..." 
                  className="input input-bordered pl-10 pr-4 py-2 text-sm bg-slate-900 border-slate-800 text-slate-200 rounded-xl focus:border-indigo-500/50 w-full sm:w-60 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <select 
                className="select select-bordered text-sm bg-slate-900 border-slate-800 text-slate-300 rounded-xl focus:border-indigo-500/50 focus:outline-none"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="solved">Solved</option>
                <option value="unsolved">Unsolved</option>
              </select>

              {/* Difficulty Filter */}
              <select 
                className="select select-bordered text-sm bg-slate-900 border-slate-800 text-slate-300 rounded-xl focus:border-indigo-500/50 focus:outline-none"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              {/* Tag Filter */}
              <select 
                className="select select-bordered text-sm bg-slate-900 border-slate-800 text-slate-300 rounded-xl focus:border-indigo-500/50 focus:outline-none"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="all">All Topics</option>
                <option value="array">Array</option>
                <option value="linkedList">Linked List</option>
                <option value="graph">Graph</option>
                <option value="dp">DP</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loadingProblems ? (
              <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg text-indigo-500"></span>
              </div>
            ) : filteredProblems.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                No problems matched your filters.
              </div>
            ) : (
              <table className="table w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-4 text-left w-12">Status</th>
                    <th className="py-4 text-left">Title</th>
                    <th className="py-4 text-left w-32">Difficulty</th>
                    <th className="py-4 text-left w-40">Topic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {filteredProblems.map((prob) => (
                    <tr key={prob._id} className="hover:bg-slate-900/35 transition-colors">
                      <td className="py-4 text-left">
                        {isSolved(prob._id) ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-block w-6 h-6 rounded-full border border-slate-800" />
                        )}
                      </td>
                      <td className="py-4 text-left font-semibold">
                        <NavLink to={`/problem/${prob._id}`} className="hover:text-indigo-400 transition-colors">
                          {prob.title}
                        </NavLink>
                      </td>
                      <td className="py-4 text-left">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getDifficultyBadgeColor(prob.difficulty)}`}>
                          {prob.difficulty.charAt(0).toUpperCase() + prob.difficulty.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 text-left">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                          {prob.tags === 'linkedList' ? 'Linked List' : prob.tags.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
