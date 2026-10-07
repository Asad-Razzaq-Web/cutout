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
  const [showPassword, setShowPassword] = useState(false); // State to toggle visibility
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
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel mx-auto mt-6 max-w-md p-6" aria-labelledby="auth-title">
      <h1 id="auth-title" className="font-display text-3xl font-extrabold tracking-tight">{copy.title}</h1>

      <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === 'signup' && (
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">Name (optional)</label>
            <input id="name" className="input" autoComplete="name" value={form.name} onChange={set('name')} />
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
          <input id="email" type="email" required className="input" autoComplete="email" value={form.email} onChange={set('email')} />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
          <div className="relative mt-1">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'} // Dynamically switch input type
              required
              minLength={mode === 'signup' ? 8 : undefined}
              className="input pr-10 w-full" // Added padding-right to accommodate the button
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={form.password}
              onChange={set('password')}
            />
            <button
              type="button" // Prevents form submission
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink-soft dark:text-mist-soft hover:text-ink dark:hover:text-mist focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                // Eye Slash Icon (Hide)
                <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                // Eye Icon (Show)
                <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          {mode === 'signup' && <p className="mt-1 text-xs text-ink-soft dark:text-mist-soft">At least 8 characters.</p>}
        </div>

        {error && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{error}</p>}

        <button type="submit" disabled={busy} className="btn-primary w-full">{busy ? 'Please wait…' : copy.submit}</button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-soft dark:text-mist-soft">
        {copy.alt[0]} <Link to={copy.alt[2]} className="font-semibold text-cobalt underline dark:text-cobalt-light">{copy.alt[1]}</Link>
      </p>
    </section>
  );
}
