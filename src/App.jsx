import { useState } from 'react'
import Spline from '@splinetool/react-spline'

function App() {
  const [authed, setAuthed] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleAuth = (data) => {
    setAuthed(data)
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      {/* Hero with 3D Spline */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Spline scene="https://prod.spline.design/hGDm7Foxug7C6E8s/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
        {/* Gradient overlay to improve text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/40 to-slate-950 pointer-events-none" />

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-6xl mx-auto w-full px-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                Data Science Student Hub
              </h1>
              <p className="mt-4 text-slate-200 text-lg">
                A futuristic playground to showcase projects, learn interactively, and build your portfolio.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="#auth" className="inline-flex items-center rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-2.5 font-semibold transition">
                  Get Started
                </a>
                <a href="/test" className="inline-flex items-center rounded-lg bg-white/10 hover:bg-white/20 px-5 py-2.5 font-semibold transition">
                  Check Connection
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth section */}
      <section id="auth" className="relative py-14 sm:py-20 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_0%,rgba(59,130,246,0.15),transparent)] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">Your AI-powered learning studio</h2>
              <p className="mt-3 text-slate-300">
                Create an account to save progress, track projects, and unlock personalized learning paths for machine learning, stats, and data viz.
              </p>
              <ul className="mt-6 space-y-3 text-slate-200">
                <li className="flex items-start gap-3"><span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-400" />Interactive 3D hero scene to make your portfolio pop</li>
                <li className="flex items-start gap-3"><span className="mt-1.5 h-2 w-2 rounded-full bg-blue-400" />Secure login and sign up with persistent storage</li>
                <li className="flex items-start gap-3"><span className="mt-1.5 h-2 w-2 rounded-full bg-fuchsia-400" />Built for students exploring AI/ML, data engineering, and analytics</li>
              </ul>
            </div>

            <div>
              {authed ? (
                <LoggedInPanel data={authed} onSignOut={() => setAuthed(null)} />
              ) : (
                <AuthCard onAuth={handleAuth} baseUrl={baseUrl} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-slate-400">
        Built for students — Explore, learn, and showcase your journey.
      </footer>
    </div>
  )
}

function AuthCard({ onAuth, baseUrl }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', field_of_study: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup'
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, field_of_study: form.field_of_study }

      const res = await fetch(`${baseUrl}${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error((await res.json())?.detail || 'Authentication failed')
      const data = await res.json()
      onAuth?.(data)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md ml-auto bg-white/10 backdrop-blur rounded-2xl shadow-2xl p-6 border border-white/10">
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center bg-white/10 rounded-lg p-1 border border-white/10">
          <button onClick={() => setMode('login')} className={`px-4 py-2 text-sm font-medium rounded-md transition ${mode==='login' ? 'bg-white text-slate-900' : 'text-white hover:bg-white/10'}`}>Login</button>
          <button onClick={() => setMode('signup')} className={`px-4 py-2 text-sm font-medium rounded-md transition ${mode==='signup' ? 'bg-white text-slate-900' : 'text-white hover:bg-white/10'}`}>Sign up</button>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-slate-200">Full Name</label>
            <input name="name" value={form.name} onChange={onChange} className="mt-1 w-full rounded-md bg-white/90 text-slate-900 border border-white/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ada Lovelace" required />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-200">Email</label>
          <input type="email" name="email" value={form.email} onChange={onChange} className="mt-1 w-full rounded-md bg-white/90 text-slate-900 border border-white/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200">Password</label>
          <input type="password" name="password" value={form.password} onChange={onChange} className="mt-1 w-full rounded-md bg-white/90 text-slate-900 border border-white/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" required />
        </div>
        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-slate-200">Field of Study</label>
            <input name="field_of_study" value={form.field_of_study} onChange={onChange} className="mt-1 w-full rounded-md bg-white/90 text-slate-900 border border-white/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Machine Learning" />
          </div>
        )}

        {error && <p className="text-sm text-red-300">{error}</p>}

        <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-md transition disabled:opacity-50">
          {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Create account')}
        </button>
      </form>
    </div>
  )
}

function LoggedInPanel({ data, onSignOut }) {
  return (
    <div className="w-full max-w-md ml-auto bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-6">
      <h3 className="text-2xl font-semibold text-emerald-300">Welcome!</h3>
      <p className="mt-1 text-slate-200">You are now signed in.</p>
      <div className="mt-4 space-y-2 text-sm">
        <div className="bg-white/10 rounded p-3 break-all"><span className="text-slate-300">Token: </span>{data.token}</div>
        {data.user && (
          <div className="bg-white/10 rounded p-3">
            <div><span className="text-slate-300">Name:</span> {data.user.name}</div>
            <div><span className="text-slate-300">Email:</span> {data.user.email}</div>
          </div>
        )}
      </div>
      <button onClick={onSignOut} className="mt-6 w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 rounded-md transition">Sign out</button>
    </div>
  )
}

export default App
