import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { fetchAllSheetsProgress } from '../slices/sheetSlice';
import CompanyCard from '../components/sheets/CompanyCard';
import { ChevronLeft, Building2, User } from 'lucide-react';

const SheetsPage = () => {
  const dispatch = useDispatch();
  const { allProgress, loading } = useSelector((state) => state.sheet);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllSheetsProgress());
  }, [dispatch]);

  const companiesList = [
    { name: 'Google', slug: 'google' },
    { name: 'Amazon', slug: 'amazon' },
    { name: 'Microsoft', slug: 'microsoft' },
    { name: 'Meta', slug: 'meta' }
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
        
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <NavLink to="/" className="hover:text-indigo-400 transition-colors">Dashboard</NavLink>
            <span>/</span>
            <span className="text-slate-200">DSA Sheets</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Building2 className="text-indigo-400" /> Company DSA Sheets
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Curated sheets containing highly targeted questions asked in top tech company interviews. Solved questions will automatically update your sheet progress.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <span className="loading loading-spinner loading-lg text-indigo-500"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companiesList.map((comp) => (
              <CompanyCard 
                key={comp.slug} 
                companyName={comp.name} 
                slug={comp.slug} 
                stats={allProgress[comp.slug]} 
              />
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default SheetsPage;
