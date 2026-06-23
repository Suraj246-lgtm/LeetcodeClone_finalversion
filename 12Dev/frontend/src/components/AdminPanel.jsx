import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';

// Zod schema matching the backend problem schema (lowercase languages)
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

function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      difficulty: 'easy',
      tags: 'array',
      visibleTestCases: [{ input: '', output: '', explanation: '' }],
      hiddenTestCases: [{ input: '', output: '' }],
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

  const onSubmit = async (data) => {
    try {
      // Filter out entries with empty code before sending
      const payload = {
        ...data,
        startCode: data.startCode.filter(sc => sc.initialCode.trim() !== ''),
        referenceSolution: data.referenceSolution.filter(rs => rs.completeCode.trim() !== '')
      };

      if (payload.startCode.length === 0) {
        alert('Please provide at least one starter code template.');
        return;
      }
      if (payload.referenceSolution.length === 0) {
        alert('Please provide at least one reference solution.');
        return;
      }

      await axiosClient.post('/problem/create', payload);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-slate-100">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/admin')} 
            className="btn btn-sm btn-outline border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
            Create New Problem
          </h1>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
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
                {errors.title && (
                  <span className="text-rose-500 text-xs mt-1">{errors.title.message}</span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-slate-300">Description</span>
                </label>
                <textarea
                  {...register('description')}
                  className="textarea textarea-bordered h-32 bg-slate-900 border-slate-800 text-slate-200 focus:outline-none"
                />
                {errors.description && (
                  <span className="text-rose-500 text-xs mt-1">{errors.description.message}</span>
                )}
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
            
            {/* Visible Test Cases */}
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
                <div key={field.id} className="border border-slate-800 p-4 rounded-xl space-y-3 bg-slate-900/20">
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

            {/* Hidden Test Cases */}
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
                <div key={field.id} className="border border-slate-800 p-4 rounded-xl space-y-3 bg-slate-900/20">
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

          {/* Code Templates */}
          <div className="card bg-slate-950/40 border border-slate-800/80 p-6 rounded-2xl space-y-6">
            <h2 className="text-xl font-bold text-slate-200">Code Templates</h2>
            <div className="space-y-6">
              {LANGUAGES.map((lang, index) => (
                <div key={lang.value} className="space-y-2 border-b border-slate-800/60 pb-6 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-indigo-400">{lang.label}</h3>
                  <input type="hidden" {...register(`startCode.${index}.language`)} value={lang.value} />
                  <input type="hidden" {...register(`referenceSolution.${index}.language`)} value={lang.value} />
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-slate-400 text-xs">Starter Code</span>
                    </label>
                    <textarea
                      {...register(`startCode.${index}.initialCode`)}
                      className="textarea textarea-bordered font-mono bg-slate-900 border-slate-800 text-slate-200 w-full"
                      rows={6}
                      placeholder={`// ${lang.label} starter code...`}
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-slate-400 text-xs">Reference Solution (Judge0 validated)</span>
                    </label>
                    <textarea
                      {...register(`referenceSolution.${index}.completeCode`)}
                      className="textarea textarea-bordered font-mono bg-slate-900 border-slate-800 text-slate-200 w-full"
                      rows={6}
                      placeholder={`// ${lang.label} reference solution...`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn btn-primary w-full bg-indigo-600 hover:bg-indigo-500 border-none text-white rounded-xl py-3 font-bold"
          >
            {isSubmitting ? <span className="loading loading-spinner"></span> : 'Create Problem'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;