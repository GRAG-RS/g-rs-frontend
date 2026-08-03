import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../utils/validators';
import { authService } from '../services/authService';
import { useAuth } from '../auth/authHooks';
import { Button } from '../components/common/Button';
import { Building2, ShieldCheck, Lock, Mail } from 'lucide-react';
import { ROUTES } from '../constants/routes';

export default function Login() {
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError('');
    setLoading(true);

    try {
      const response = await authService.login(data.email, data.password);
      login(response.token, response.user);
      navigate(ROUTES.DASHBOARD);
    } catch {
      setServerError('Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setServerError('Password reset link is handled by IT support administrator.');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600/15 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/30 text-white mb-4">
          <Building2 className="h-7 w-7" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          CorpDash Portal
        </h2>
        <p className="mt-2 text-sm font-medium text-slate-400">
          Employee & Product Microservices Gateway
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-3xl border border-slate-800/80 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {serverError && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl text-xs font-semibold">
                {serverError}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="name@company.com"
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 font-medium transition-all"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-400 font-semibold">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 font-medium transition-all"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-400 font-semibold">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-slate-400 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500/20"
                  defaultChecked
                />
                <span className="ml-2">Remember session</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="font-semibold text-blue-400 hover:text-blue-300 transition-colors focus:outline-none"
              >
                Forgot password?
              </button>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full shadow-lg shadow-blue-600/30" size="lg" isLoading={loading}>
                Sign In to Portal
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <span className="inline-flex items-center text-[11px] font-semibold text-slate-500 gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Securing requests with JWT via ALB Gateway
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
