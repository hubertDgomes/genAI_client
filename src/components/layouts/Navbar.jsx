import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Sparkles } from 'lucide-react'
import useAuth from '../pages/auth/hooks/useAuth'

const Navbar = () => {
  const { user, handleLogout } = useAuth()
  const navigate = useNavigate()

  const onLogout = async () => {
    try {
      await handleLogout()
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to={user ? "/home" : "/"} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
            Job <span className="text-indigo-600">Cheker</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                {user.email || user.username || 'User'}
              </span>
              <button
                id="navbar-logout-btn"
                onClick={onLogout}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar