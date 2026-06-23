import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { Search, CheckCircle, Circle, BarChart } from 'lucide-react';

const SheetProblemList = ({ problems = [], solvedIds = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const isSolved = (problemId) => {
    return solvedIds.includes(problemId.toString());
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'hard': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  // Filter problems
  const filteredProblems = problems.filter(p => {
    const title = p.title || '';
    const difficulty = p.difficulty || 'easy';

    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    
    let matchesStatus = true;
    if (statusFilter === 'solved') {
      matchesStatus = isSolved(p._id);
    } else if (statusFilter === 'unsolved') {
      matchesStatus = !isSolved(p._id);
    }

    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search problems in this sheet..." 
            className="input input-bordered w-full pl-10 pr-4 py-2 text-sm bg-slate-900 border-slate-800 text-slate-200 rounded-xl focus:border-indigo-500/50 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Difficulty */}
          <select 
            className="select select-bordered text-sm bg-slate-900 border-slate-800 text-slate-300 rounded-xl focus:border-indigo-500/50 focus:outline-none flex-1 md:flex-none"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Status */}
          <select 
            className="select select-bordered text-sm bg-slate-900 border-slate-800 text-slate-300 rounded-xl focus:border-indigo-500/50 focus:outline-none flex-1 md:flex-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filteredProblems.length === 0 ? (
          <div className="text-center py-12 text-slate-500 border border-slate-850 rounded-2xl">
            No problems found matching the filters.
          </div>
        ) : (
          <table className="table w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-4 text-left w-12">Status</th>
                <th className="py-4 text-left">Title</th>
                <th className="py-4 text-left w-32">Difficulty</th>
                <th className="py-4 text-left w-36">Topic</th>
                <th className="py-4 text-right w-24">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredProblems.map((prob) => {
                const solved = isSolved(prob._id);
                return (
                  <tr key={prob._id} className="hover:bg-slate-900/35 transition-colors">
                    <td className="py-4 text-left">
                      {solved ? (
                        <CheckCircle size={18} className="text-emerald-400" />
                      ) : (
                        <Circle size={18} className="text-slate-700" />
                      )}
                    </td>
                    <td className="py-4 text-left font-semibold">
                      <NavLink to={`/problem/${prob._id}`} className="hover:text-indigo-400 transition-colors">
                        {prob.title}
                      </NavLink>
                    </td>
                    <td className="py-4 text-left">
                      <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getDifficultyColor(prob.difficulty)}`}>
                        {prob.difficulty.charAt(0).toUpperCase() + prob.difficulty.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 text-left">
                      <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                        {prob.tags === 'linkedList' ? 'Linked List' : prob.tags.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400 text-xs">
                        <BarChart size={14} className="text-indigo-500" />
                        <span>{prob.frequency || 50}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SheetProblemList;
