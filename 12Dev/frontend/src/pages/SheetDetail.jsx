import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink } from 'react-router';
import { fetchCompanySheet, fetchCompanyProgress, clearCurrentSheet } from '../slices/sheetSlice';
import SheetProblemList from '../components/sheets/SheetProblemList';
import { ChevronLeft, Building2, User } from 'lucide-react';

const SheetDetail = () => {
  const { company } = useParams();
  const dispatch = useDispatch();
  
  const { currentSheet, currentProgress, loading } = useSelector((state) => state.sheet);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (company) {
      dispatch(fetchCompanySheet(company));
      dispatch(fetchCompanyProgress(company));
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentSheet());
    };
  }, [dispatch, company]);

  const getCompanyName = () => {
    if (!company) return '';
    return company.charAt(0).toUpperCase() + company.slice(1);
  };

  const getCompanyColor = () => {
    switch (company?.toLowerCase()) {
      case 'google': return 'text-blue-400';
      case 'amazon': return 'text-orange-400';
      case 'microsoft': return 'text-indigo-400';
      case 'meta': return 'text-blue-500';
      default: return 'text-indigo-400';
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
              <NavLink to="/sheets" className="text-indigo-400">DSA Sheets</NavLink>
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
            to="/sheets" 
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <ChevronLeft size={14} /> Back to DSA Sheets
          </NavLink>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-950/40 border border-slate-800/80 p-6 rounded-2xl">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                <Building2 className={getCompanyColor()} /> {getCompanyName()} Interview Prep Sheet
              </h1>
              <p className="text-xs text-slate-400">
                Top curated questions asked in {getCompanyName()} technical interviews.
              </p>
            </div>

            {currentProgress && (
              <div className="w-full md:w-64 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>Solved Progress</span>
                  <span>{currentProgress.progressPercentage}% ({currentProgress.solvedQuestions}/{currentProgress.totalQuestions})</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${currentProgress.progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Problem List */}
        <div className="card bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <span className="loading loading-spinner loading-lg text-indigo-500"></span>
            </div>
          ) : (
            <SheetProblemList 
              problems={currentSheet} 
              solvedIds={currentProgress?.solvedIds || []} 
            />
          )}
        </div>

      </main>
    </div>
  );
};

export default SheetDetail;
