import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink, useNavigate } from 'react-router';
import { fetchContestDetails, fetchContestRegistration, clearActiveContest } from '../slices/contestSlice';
import ContestTimer from '../components/contest/ContestTimer';
import Editor from '@monaco-editor/react';
import axiosClient from '../utils/axiosClient';
import { ChevronLeft, Trophy, CheckCircle, AlertTriangle, Play, HelpCircle, Terminal } from 'lucide-react';

const ContestArena = () => {
  const { contestId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { activeContest, registration, loading } = useSelector((state) => state.contest);
  const { user } = useSelector((state) => state.auth);

  const [activeProblem, setActiveProblem] = useState(null);
  const [code, setCode] = useState('');
  const [languageId, setLanguageId] = useState(63); // default to JavaScript
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState(null);

  useEffect(() => {
    if (contestId) {
      dispatch(fetchContestDetails(contestId));
      dispatch(fetchContestRegistration(contestId));
    }
    return () => {
      dispatch(clearActiveContest());
    };
  }, [dispatch, contestId]);

  // Set the first problem as active once contest is loaded
  useEffect(() => {
    if (activeContest?.problems?.length > 0) {
      setActiveProblem(activeContest.problems[0]);
    }
  }, [activeContest]);

  // Handle template code setup
  useEffect(() => {
    if (activeProblem) {
      // Find template or default placeholder code
      const templates = activeProblem.startCode || [];
      const lang = getLanguageSlug(languageId);
      const match = templates.find(t => t.language.toLowerCase() === lang.toLowerCase());
      setCode(match ? match.completeCode : '// Write your solution here');
      setOutput(null);
    }
  }, [activeProblem, languageId]);

  const getLanguageSlug = (id) => {
    if (id === 54) return 'cpp';
    if (id === 62) return 'java';
    return 'javascript';
  };

  const handleRunSubmit = async (type = 'submit') => {
    if (!activeProblem) return;
    setRunning(true);
    setOutput(null);
    try {
      const response = await axiosClient.post(
        `/contest/${contestId}/submit/${activeProblem._id}`, 
        { code, languageId }
      );
      setOutput(response.data);
      // Refresh registration scores
      dispatch(fetchContestRegistration(contestId));
    } catch (err) {
      setOutput({
        accepted: false,
        status: 'error',
        errorMessage: err.response?.data?.message || 'Submission failed.'
      });
    } finally {
      setRunning(false);
    }
  };

  const isProblemSolved = (probId) => {
    return registration?.solvedProblems?.some(sp => sp.problemId.toString() === probId.toString() && !!sp.solvedAt);
  };

  if (loading || !activeContest) {
    return (
      <div className="min-h-screen bg-[#08080c] flex items-center justify-center text-white">
        <span className="loading loading-spinner loading-lg text-indigo-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080c] text-slate-100 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="bg-[#0a0a0f] border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <NavLink to="/contests" className="p-2 bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors border border-slate-850">
            <ChevronLeft size={16} />
          </NavLink>
          <div>
            <h1 className="text-md font-bold text-slate-200">{activeContest.title}</h1>
            <p className="text-[10px] text-slate-500 mt-0.5">SaaS Competitive Arena</p>
          </div>
        </div>

        {/* Timer */}
        <ContestTimer 
          endTime={activeContest.endTime} 
          duration={activeContest.duration} 
          startedAt={registration?.startedAt} 
          onTimeUp={() => navigate('/contests')} 
        />

        {/* Scoreboard info */}
        <div className="flex items-center gap-6 text-xs bg-slate-900 border border-slate-850 rounded-xl px-4 py-2">
          <div>
            <span className="text-slate-500 font-semibold">My Score:</span>
            <span className="ml-1.5 text-emerald-400 font-extrabold">{registration?.score || 0} pts</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <NavLink to={`/contest/${contestId}/leaderboard`} className="text-indigo-400 hover:underline font-bold">
            Leaderboard
          </NavLink>
        </div>
      </header>

      {/* Main Workspace (Split Screen) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Contest Problems & active description */}
        <div className="w-full lg:w-[45%] border-r border-slate-800/60 flex flex-col h-[50vh] lg:h-auto overflow-y-auto p-6 space-y-6">
          
          {/* Problems List */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Contest Problems</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {activeContest.problems.map((prob, idx) => {
                const isActive = activeProblem?._id === prob._id;
                const solved = isProblemSolved(prob._id);
                return (
                  <button
                    key={prob._id}
                    onClick={() => {
                      setActiveProblem(prob);
                      setOutput(null);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-semibold transition-all ${
                      isActive 
                        ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 font-bold' 
                        : 'bg-slate-950/40 border-slate-850 hover:border-slate-800 text-slate-300'
                    }`}
                  >
                    <span>{idx + 1}. {prob.title.slice(0, 15)}...</span>
                    {solved ? (
                      <CheckCircle size={14} className="text-emerald-400" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-900/60 my-2" />

          {/* Active Problem Details */}
          {activeProblem ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">{activeProblem.title}</h2>
                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                  activeProblem.difficulty.toLowerCase() === 'easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                  activeProblem.difficulty.toLowerCase() === 'medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                  'text-rose-500 bg-rose-500/10 border-rose-500/20'
                }`}>
                  {activeProblem.difficulty}
                </span>
              </div>

              <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans bg-slate-950/20 border border-slate-900 p-4 rounded-xl">
                {activeProblem.description}
              </div>

              {/* Examples */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Test Cases</h3>
                <div className="space-y-3">
                  {activeProblem.visibleTestCases.slice(0, 2).map((tc, idx) => (
                    <div key={idx} className="bg-slate-950/60 border border-slate-900 p-3.5 rounded-xl font-mono text-xs space-y-1.5">
                      <p className="font-bold text-slate-400">Example {idx + 1}:</p>
                      <div><span className="text-slate-500">Input: </span>{tc.input}</div>
                      <div><span className="text-slate-500">Output: </span>{tc.output}</div>
                      {tc.explanation && <div><span className="text-slate-500">Explanation: </span>{tc.explanation}</div>}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">Select a problem to begin.</div>
          )}

        </div>

        {/* Right Side: Code Editor & Exec Output */}
        <div className="flex-1 flex flex-col bg-[#050508]">
          {/* Lang Selector & Action panel */}
          <div className="bg-[#08080c] border-b border-slate-800/80 px-6 py-3 flex items-center justify-between gap-4">
            <select
              className="select select-bordered select-xs bg-slate-900 border-slate-800 text-slate-300 rounded-lg focus:outline-none"
              value={languageId}
              onChange={(e) => setLanguageId(Number(e.target.value))}
            >
              <option value={63}>JavaScript (Node.js)</option>
              <option value={54}>C++ (GCC 9.2.0)</option>
              <option value={62}>Java (OpenJDK 13.0.1)</option>
            </select>

            <button
              onClick={() => handleRunSubmit()}
              disabled={running || !activeProblem}
              className="btn btn-xs sm:btn-sm bg-indigo-600 hover:bg-indigo-500 text-white border-none rounded-xl font-bold flex items-center gap-1.5"
            >
              {running ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <>Submit Solution <Play size={12} /></>
              )}
            </button>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-[300px] border-b border-slate-800/80">
            <Editor
              height="100%"
              theme="vs-dark"
              language={getLanguageSlug(languageId) === 'cpp' ? 'cpp' : getLanguageSlug(languageId) === 'java' ? 'java' : 'javascript'}
              value={code}
              onChange={(val) => setCode(val)}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollbar: { vertical: 'auto', horizontal: 'auto' },
                lineNumbers: 'on',
                automaticLayout: true,
              }}
            />
          </div>

          {/* Console / Output Drawer */}
          <div className="bg-[#09090e] p-5 h-44 overflow-y-auto border-t border-slate-850 flex flex-col space-y-2">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <Terminal size={14} className="text-indigo-400" />
              <span>Console Output</span>
            </div>

            {output ? (
              <div className="space-y-2 text-xs font-mono">
                {output.accepted ? (
                  <div className="text-emerald-400 flex items-center gap-2 font-bold">
                    <CheckCircle size={16} />
                    <span>Accepted! All test cases passed (+100 pts)</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="text-rose-400 flex items-center gap-2 font-bold">
                      <AlertTriangle size={16} />
                      <span>Submission Failed: {output.status.toUpperCase()}</span>
                    </div>
                    {output.errorMessage && (
                      <pre className="bg-slate-950 p-3 rounded-lg border border-slate-900 text-rose-500/80 max-h-24 overflow-y-auto whitespace-pre-wrap">
                        {output.errorMessage}
                      </pre>
                    )}
                  </div>
                )}
                <div className="text-slate-400">
                  Passed Cases: {output.testCasesPassed} / {output.totalTestCases}
                </div>
              </div>
            ) : (
              <div className="text-slate-600 text-xs font-mono">
                Run or Submit code to see real-time compile and execution results.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContestArena;
