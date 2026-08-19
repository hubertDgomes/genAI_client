import React from 'react'
import { Globe, Heart, Sparkles, Code, User } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-slate-200/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm text-slate-800">
              Job <span className="text-indigo-600">Cheker</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Portfolio</span>
            </a>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>© {currentYear} Created with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by</span>
            <span className="font-semibold text-slate-800">Hubert Gomes</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer