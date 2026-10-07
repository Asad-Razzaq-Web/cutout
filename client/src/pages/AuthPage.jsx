import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useSeo } from '../hooks/useSeo.js';

const COPY = {
  login: {
    title: 'Log in',
    seoTitle: 'Log in | Cutout',
    submit: 'Log in',
    alt: ['No account yet?', 'Sign up', '/signup'],
  },
  signup: {
    title: 'Create your account',
    seoTitle: 'Sign up | Cutout',
    submit: 'Create account',
    alt: ['Already have an account?', 'Log in', '/login'],
  },
};

export default function AuthPage({ mode }) {
  const copy = COPY[mode];
  useSeo({
    title: copy.seoTitle,
    description: 'Save your background-removed images and download them again any time.',
    path: `/${mode}`,
    noindex: true,
  });

  const { authenticate } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await authenticate(mode, form);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    /* 
      Responsive Card Wrapper:
      - `w-full max-w-md mx-auto`: Ensures full width fluid stretching on mobile with a clean desktop boundary box max width.
      - `mt-6 sm:mt-12`: Reduces harsh whitespace gap parameters on smaller viewports.
    */
    <section className="panel mx-auto mt-6 sm:mt-12 w-full max-w-md p-5 sm:p-8 transition-all duration-200" aria-labelledby="auth-title">
      <h1 
        id="auth-title" 
        className="font-display text-2xl font-extrabold tracking-tight text-ink dark:text-mist sm:text-3xl"
      >
        {copy.title}
      </h1>

      <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === 'signup' && (
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink dark:text-mist">Name (optional)</label>
            <input 
              id="name" 
              type="text"
              className="input w-full min-h-[42px]" 
              autoComplete="name" 
              value={form.name} 
              onChange={set('name')} 
            />
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink dark:text-mist">Email address</label>
          <input 
            id="email" 
            type="email" 
            required 
            className="input w-full min-h-[42px]" 
            autoComplete="email" 
            value={form.email} 
            onChange={set('email')} 
          />
        </div>
        
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink dark:text-mist">Password</label>
          <div className="relative mt-1">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={mode === 'signup' ? 8 : undefined}
              className="input pr-10 w-full min-h-[42px]"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={form.password}
              onChange={set('password')}
            />
            {/* Touch-Friendly Visibility Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-soft dark:text-mist-soft hover:text-ink dark:hover:text-mist focus:outline-none min-h-[42px]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                /* Eye Slash Icon (Hide) - Standard XMLNS namespace corrected */
                <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                /* Eye Icon (Show) - Standard XMLNS namespace corrected */
                <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          {mode === 'signup' && <p className="mt-1.5 text-xs text-ink-soft dark:text-mist-soft">Must be at least 8 characters long.</p>}
        </div>

        {/* Semantic Responsive Alert Message Block */}
        {error && (
          <div role="alert" className="rounded-lg bg-red-50 p-3 text-xs sm:text-sm font-medium text-red-800 dark:bg-red-950/20 dark:text-red-300 transition-all">
            <div className="flex gap-2">
              <svg className="h-4 w-4 shrink-0 stroke-current mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <button 
          type="submit" 
          disabled={busy} 
          className={`btn-primary w-full min-h-[44px] flex items-center justify-center font-semibold transition-all ${
            busy ? 'opacity-70 pointer-events-none' : ''
          }`}
        >
          {busy ? (
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Processing…</span>
            </div>
          ) : (
            copy.submit
          )}
        </button>
      </form>

      {/* Alternative Option Navigation Footer links */}
      <p className="mt-6 text-center text-sm text-ink-soft dark:text-mist-soft">
        {copy.alt[0]}{' '}
        <Link to={copy.alt[2]} className="font-semibold text-cobalt underline hover:text-cobalt/80 dark:text-cobalt-light dark:hover:text-cobalt-light/80 transition-colors">
          {copy.alt[1]}
        </Link>
      </p>
    </section>
  );
}
