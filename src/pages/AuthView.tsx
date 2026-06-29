import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, ShieldAlert, ArrowRight, Lock, Mail, Signature, Store } from 'lucide-react';

interface AuthViewProps {
  onNavigate: (view: string) => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthView({ onNavigate, defaultMode = 'login' }: AuthViewProps) {
  const { login, register, loginWithGoogle, loading } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'login') {
      const success = await login(email, password);
      if (success) {
        onNavigate('home');
      } else {
        setErrorMessage('Invalid registered email address or password combination.');
      }
    } else {
      if (!name) {
        setErrorMessage('Name coordinates are required.');
        return;
      }
      const success = await register(name, email, password, role);
      if (success) {
        onNavigate('home');
      } else {
        setErrorMessage('User with this email address may already be registered on ShpNex.');
      }
    }
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 transition-colors duration-300 min-h-screen py-16 flex items-center justify-center font-sans">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-8 max-w-md w-full shadow-xl relative">
        {/* Brand header banner */}
        <div className="text-center mb-8">
          <div className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Shp</span>Nex
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            {mode === 'login' ? 'Welcome back! Sign in to continue shopping.' : 'Register now for 20% off and express coordinates shipping.'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 text-xs font-semibold flex items-center gap-2 border border-rose-100 dark:border-rose-900/50">
            <ShieldAlert className="h-5 w-5" /> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tushar Mendhule"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs pl-9 pr-3 py-3 outline-none focus:border-emerald-500 font-semibold placeholder-zinc-400"
                  />
                  <Signature className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-2">Account Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      role === 'customer'
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 shadow-sm'
                        : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('seller')}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      role === 'seller'
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 shadow-sm'
                        : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    <Store className="h-4 w-4" />
                    Seller
                  </button>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@shpnex.com"
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs pl-9 pr-3 py-3 outline-none focus:border-emerald-500 font-semibold placeholder-zinc-400"
              />
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-zinc-500">Password</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Forgot password email verification placeholder triggered! Check backend configs.')}
                  className="text-[10px] font-bold text-emerald-500 hover:underline"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs pl-9 pr-3 py-3 outline-none focus:border-emerald-500 font-semibold placeholder-zinc-400"
              />
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-extrabold uppercase tracking-widest transition-all shadow shadow-zinc-950/10 flex items-center justify-center gap-1.5 active:scale-95"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white dark:border-zinc-900 border-t-transparent rounded-full animate-spin" />
            ) : mode === 'login' ? (
              <>
                Sign In <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                Create Account <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-400 font-bold text-[10px] tracking-wider">or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={async () => {
            setErrorMessage('');
            const success = await loginWithGoogle();
            if (success) {
              onNavigate('home');
            } else {
              setErrorMessage('Google Authentication was cancelled or failed.');
            }
          }}
          disabled={loading}
          className="w-full py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950/50 text-zinc-700 dark:text-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 0, 0)">
              <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.56h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.48c0,-0.64 -0.06,-1.25 -0.17,-1.88z" fill="#4285F4" />
              <path d="M12,20.6c2.43,0 4.47,-0.8 5.96,-2.18l-3.3,-2.56c-0.9,0.6 -2.06,0.98 -3.3,0.98c-2.35,0 -4.33,-1.58 -5.04,-3.72H2.9v2.64c1.48,2.94 4.52,4.84 8.02,4.84z" fill="#34A853" />
              <path d="M6.96,13.12c-0.18,-0.54 -0.28,-1.11 -0.28,-1.7s0.1,-1.16 0.28,-1.7V7.08H2.9c-0.61,1.21 -0.96,2.58 -0.96,4.02s0.35,2.81 0.96,4.02l4.06,-3z" fill="#FBBC05" />
              <path d="M12,6.52c1.32,0 2.51,0.45 3.44,1.35l2.58,-2.58C16.46,3.84 14.43,3 12,3c-3.5,0 -6.54,1.9 -8.02,4.84l4.06,3.12C8.75,8.1 10.73,6.52 12,6.52z" fill="#EA4335" />
            </g>
          </svg>
          Google Account
        </button>




        {/* Form view toggle footer */}
        <div className="border-t border-zinc-150 dark:border-zinc-800 my-6 pt-5 text-center text-xs">
          {mode === 'login' ? (
            <p className="text-zinc-500">
              New to ShpNex?{' '}
              <button onClick={() => setMode('register')} className="text-emerald-500 font-bold hover:underline">
                Create Account
              </button>
            </p>
          ) : (
            <p className="text-zinc-500">
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-emerald-500 font-bold hover:underline">
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
