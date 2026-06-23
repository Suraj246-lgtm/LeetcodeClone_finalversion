import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser } from '../authSlice';
import { UserPlus, ArrowRight } from 'lucide-react';

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#08080c] text-slate-200">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b')] bg-cover bg-center opacity-5 mix-blend-screen pointer-events-none"></div>
      
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="card w-full max-w-md bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 shadow-2xl rounded-3xl relative z-10 overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>
        
        <div className="card-body p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mb-4 border border-white/10">
              <UserPlus size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 text-transparent bg-clip-text">
              Create Account
            </h2>
            <p className="text-slate-400 mt-2 text-sm text-center">Join the ultimate coding platform today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name Field */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-slate-300 font-medium">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className={`input w-full bg-slate-900/50 border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-200 transition-all ${errors.firstName ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}`} 
                {...register('firstName')}
              />
              {errors.firstName && (
                <span className="text-rose-400 text-xs mt-1.5 font-medium">{errors.firstName.message}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-slate-300 font-medium">Email Address</span>
              </label>
              <input
                type="email"
                placeholder="developer@example.com"
                className={`input w-full bg-slate-900/50 border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-200 transition-all ${errors.emailId ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}`}
                {...register('emailId')}
              />
              {errors.emailId && (
                <span className="text-rose-400 text-xs mt-1.5 font-medium">{errors.emailId.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-slate-300 font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input w-full bg-slate-900/50 border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-200 transition-all pr-10 ${errors.password ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-rose-400 text-xs mt-1.5 font-medium">{errors.password.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control mt-8 pt-2"> 
              <button
                type="submit"
                className="btn w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-none text-white rounded-xl h-12 shadow-lg shadow-purple-500/25 group transition-all"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Create Account
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Login Redirect */}
          <div className="text-center mt-8 pt-6 border-t border-slate-800/60">
            <span className="text-sm text-slate-400">
              Already have an account?{' '}
              <NavLink to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Sign in instead
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;