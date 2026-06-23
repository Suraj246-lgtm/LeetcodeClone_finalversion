import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { Trash2, Edit, ChevronLeft } from 'lucide-react';

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.string().min(1, 'Language is required'),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).min(1, 'At least one language required'),
  referenceSolution: z.array(
    z.object({
      language: z.string().min(1, 'Language is required'),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).min(1, 'At least one language required')
});

const LANGUAGES = [
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript' }
];

function AdminUpdate() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState('');
  const [loadingList, setLoadingList] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'cpp', initialCode: '' },
        { language: 'java', initialCode: '' },
        { language: 'javascript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'cpp', completeCode: '' },
        { language: 'java', completeCode: '' },
        { language: 'javascript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  // Fetch problems list on mount
  useEffect(() => {
    const fetchList = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingList(false);
      }
    };
    fetchList();
  }, []);

  // Fetch specific problem details when selected
  const handleSelectProblem = async (id) => {
    setSelectedProblemId(id);
    if (!id) return;
    try {
      const { data } = await axiosClient.get(`/problem/problemById/${id}`);
      
      // Normalize language names to lowercase keys used by the backend
      const normalizeLang = (lang) => {
        const l = (lang || '').toLowerCase();
        if (l === 'c++' || l === 'cpp') return 'cpp';
        if (l === 'java') return 'java';
        if (l === 'javascript' || l === 'js') return 'javascript';
        return l;
      };

      const formattedStartCode = (data.startCode || []).map(sc => ({
        language: normalizeLang(sc.language),
        initialCode: sc.initialCode || ''
      }));

      const formattedRefSolution = (data.referenceSolution || []).map(rs => ({
        language: normalizeLang(rs.language),
        completeCode: rs.completeCode || ''
      }));

      // Ensure we always have exactly 3 language items
      const finalStartCode = [
        formattedStartCode.find(x => x.language === 'cpp') || { language: 'cpp', initialCode: '' },
        formattedStartCode.find(x => x.language === 'java') || { language: 'java', initialCode: '' },
        formattedStartCode.find(x => x.language === 'javascript') || { language: 'javascript', initialCode: '' }
      ];

      const finalRefSolution = [
        formattedRefSolution.find(x => x.language === 'cpp') || { language: 'cpp', completeCode: '' },
        formattedRefSolution.find(x => x.language === 'java') || { language: 'java', completeCode: '' },
        formattedRefSolution.find(x => x.language === 'javascript') || { language: 'javascript', completeCode: '' }
      ];

      reset({
        title: data.title || '',
        description: data.description || '',
        difficulty: data.difficulty || 'easy',
        tags: data.tags || 'array',
        visibleTestCases: data.visibleTestCases || [],
        hiddenTestCases: data.hiddenTestCases || [],
        startCode: finalStartCode,
        referenceSolution: finalRefSolution
      });
    } catch (err) {
      alert('Failed to load problem details');
      console.error(err);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Filter out entries with empty code before sending
      const payload = {
        ...data,
        startCode: data.startCode.filter(sc => sc.initialCode.trim() !== ''),
        referenceSolution: data.referenceSolution.filter(rs => rs.completeCode.trim() !== '')
      };

      if (payload.referenceSolution.length === 0) {
        alert('Please provide at least one reference solution.');
        return;
      }

      await axiosClient.put(`/problem/update/${selectedProblemId}`, payload);
      alert('Problem updated successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.response?.data || error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6 text-slate-100 min-h-screen bg-[#08080c]">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/admin')} 
          className="btn btn-sm btn-outline border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800"
        >
          <ChevronLeft size={16} /> Back
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
          Update Problem
        </h1>
      </div>

      {/* Selector dropdown */}
      <div className="card bg-slate-950/40 border border-slate-800/80 p-6 rounded-2xl mb-8">
        <label className="label">
          <span className="label-text text-slate-300 font-semibold">Select a Problem to Edit</span>
        </label>
        {loadingList ? (
          <span className="loading loading-spinner text-indigo-500"></span>
        ) : (
          <select 
            className="select select-bordered w-full bg-slate-900 border-slate-800 text-slate-200 focus:outline-none"
            value={selectedProblemId}
            onChange={(e) => handleSelectProblem(e.target.value)}
          >
            <option value="">-- Select problem --</option>
            {problems.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title} ({p.difficulty})
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedProblemId && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info */}
          <div className="card bg-slate-950/40 border border-slate-800/80 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 text-slate-200">Basic Information</h2>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-slate-300">Title</span>
                </label>
                <input
                  {...register('title')}
                  className="input input-bordered w-full bg-slate-900 border-slate-800 text-slate-200 focus:outline-none"
                />
                {errors.title && <span className="text-rose-500 text-xs mt-1">{errors.title.message}</span>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-slate-300">Description</span>
                </label>
                <textarea
                  {...register('description')}
                  className="textarea textarea-bordered h-32 bg-slate-900 border-slate-800 text-slate-200 focus:outline-none"
                />
                {errors.description && <span className="text-rose-500 text-xs mt-1">{errors.description.message}</span>}
              </div>

              <div className="flex gap-4">
                <div className="form-control w-1/2">
                  <label className="label">
                    <span className="label-text text-slate-300">Difficulty</span>
                  </label>
                  <select
                    {...register('difficulty')}
                    className="select select-bordered bg-slate-900 border-slate-800 text-slate-200 focus:outline-none"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="form-control w-1/2">
                  <label className="label">
                    <span className="label-text text-slate-300">Tag</span>
                  </label>
                  <select
                    {...register('tags')}
                    className="select select-bordered bg-slate-900 border-slate-800 text-slate-200 focus:outline-none"
                  >
                    <option value="array">Array</option>
                    <option value="linkedList">Linked List</option>
                    <option value="graph">Graph</option>
                    <option value="dp">DP</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="card bg-slate-950/40 border border-slate-800/80 p-6 rounded-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-200">Test Cases</h2>
              <p className="text-xs text-slate-500 mt-1">Make sure solutions yield exact matching outputs.</p>
            </div>

            {/* Visible */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-300">Visible Test Cases</h3>
                <button
                  type="button"
                  onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                  className="btn btn-xs btn-primary bg-indigo-600 hover:bg-indigo-500 border-none text-white rounded"
                >
                  Add Case
                </button>
              </div>

              {visibleFields.map((field, index) => (
                <div key={field.id} className="border border-slate-850 p-4 rounded-xl space-y-3 bg-slate-900/20">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Case #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeVisible(index)}
                      className="btn btn-xs btn-error bg-rose-600 hover:bg-rose-500 border-none text-white rounded"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    {...register(`visibleTestCases.${index}.input`)}
                    placeholder="Input"
                    className="input input-bordered w-full bg-slate-900 border-slate-800 text-slate-200"
                  />
                  <input
                    {...register(`visibleTestCases.${index}.output`)}
                    placeholder="Output"
                    className="input input-bordered w-full bg-slate-900 border-slate-800 text-slate-200"
                  />
                  <textarea
                    {...register(`visibleTestCases.${index}.explanation`)}
                    placeholder="Explanation"
                    className="textarea textarea-bordered w-full bg-slate-900 border-slate-800 text-slate-200"
                  />
                </div>
              ))}
            </div>

            {/* Hidden */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-300">Hidden Test Cases</h3>
                <button
                  type="button"
                  onClick={() => appendHidden({ input: '', output: '' })}
                  className="btn btn-xs btn-primary bg-indigo-600 hover:bg-indigo-500 border-none text-white rounded"
                >
                  Add Hidden Case
                </button>
              </div>

              {hiddenFields.map((field, index) => (
                <div key={field.id} className="border border-slate-850 p-4 rounded-xl space-y-3 bg-slate-900/20">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Hidden #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeHidden(index)}
                      className="btn btn-xs btn-error bg-rose-600 hover:bg-rose-500 border-none text-white rounded"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    {...register(`hiddenTestCases.${index}.input`)}
                    placeholder="Input"
                    className="input input-bordered w-full bg-slate-900 border-slate-800 text-slate-200"
                  />
                  <input
                    {...register(`hiddenTestCases.${index}.output`)}
                    placeholder="Output"
                    className="input input-bordered w-full bg-slate-900 border-slate-800 text-slate-200"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div className="card bg-slate-950/40 border border-slate-800/80 p-6 rounded-2xl space-y-6">
            <h2 className="text-xl font-bold text-slate-200">Code Templates</h2>
            <div className="space-y-6">
              {[0, 1, 2].map((index) => (
                <div key={index} className="space-y-2 border-b border-slate-850/60 pb-6 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-indigo-400">
                    {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                  </h3>
                  <input type="hidden" {...register(`startCode.${index}.language`)} />

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-slate-400 text-xs">Starter Code</span>
                    </label>
                    <textarea
                      {...register(`startCode.${index}.initialCode`)}
                      className="textarea textarea-bordered font-mono bg-slate-900 border-slate-800 text-slate-200 w-full"
                      rows={6}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-slate-400 text-xs">Reference Solution (Judge0 validated)</span>
                    </label>
                    <input type="hidden" {...register(`referenceSolution.${index}.language`)} />
                    <textarea
                      {...register(`referenceSolution.${index}.completeCode`)}
                      className="textarea textarea-bordered font-mono bg-slate-900 border-slate-800 text-slate-200 w-full"
                      rows={6}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full bg-indigo-600 hover:bg-indigo-500 border-none text-white rounded-xl py-3 font-bold">
            Update Problem Details
          </button>
        </form>
      )}
    </div>
  );
}

export default AdminUpdate;
