import React from 'react';
import { NavLink } from 'react-router';
import { Building2, ArrowRight } from 'lucide-react';

const CompanyCard = ({ companyName, slug, stats }) => {
  const { total = 0, solved = 0, percentage = 0 } = stats || {};

  const getCompanyBrand = () => {
    switch (slug) {
      case 'google':
        return {
          bg: 'from-blue-600/10 via-cyan-600/10 to-emerald-600/5',
          border: 'border-blue-500/20 hover:border-blue-500/60',
          badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          barColor: 'bg-blue-500'
        };
      case 'amazon':
        return {
          bg: 'from-orange-600/10 via-amber-600/10 to-slate-900/5',
          border: 'border-orange-500/20 hover:border-orange-500/60',
          badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
          barColor: 'bg-orange-500'
        };
      case 'microsoft':
        return {
          bg: 'from-indigo-600/10 via-teal-600/10 to-slate-900/5',
          border: 'border-indigo-500/20 hover:border-indigo-500/60',
          badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
          barColor: 'bg-indigo-500'
        };
      case 'meta':
        return {
          bg: 'from-blue-700/10 via-indigo-700/10 to-slate-900/5',
          border: 'border-blue-600/20 hover:border-blue-600/60',
          badge: 'bg-blue-600/10 text-blue-400 border-blue-600/20',
          barColor: 'bg-blue-600'
        };
      default:
        return {
          bg: 'from-slate-900 via-slate-800 to-slate-900',
          border: 'border-slate-800 hover:border-indigo-500/50',
          badge: 'bg-slate-800 text-slate-400 border-slate-700',
          barColor: 'bg-indigo-500'
        };
    }
  };

  const brand = getCompanyBrand();

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${brand.bg} border ${brand.border} p-6 shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 text-slate-800 opacity-5 pointer-events-none">
        <Building2 size={120} />
      </div>

      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${brand.badge}`}>
            {companyName} Sheet
          </span>
          <h3 className="text-xl font-bold text-slate-200 mt-2">{companyName}</h3>
        </div>
        <Building2 size={24} className="text-slate-500" />
      </div>

      {/* Progress Stats */}
      <div className="space-y-3 mt-6">
        <div className="flex justify-between text-xs font-semibold text-slate-400">
          <span>Progress</span>
          <span>{percentage}% ({solved}/{total} solved)</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${brand.barColor}`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-end">
        <NavLink 
          to={`/sheets/${slug}`} 
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View DSA Sheet <ArrowRight size={14} />
        </NavLink>
      </div>
    </div>
  );
};

export default CompanyCard;
