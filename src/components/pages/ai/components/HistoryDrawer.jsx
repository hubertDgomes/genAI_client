import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Clock, 
  Plus, 
  X, 
  FileText, 
  ChevronRight, 
  Search, 
  Sparkles,
  Award,
  Calendar,
  Layers
} from 'lucide-react';
import useInterview from '../hooks/useInterview';

/**
 * Slide-over History Drawer for browsing past interview assessments
 */
const HistoryDrawer = ({ isOpen, onClose }) => {
  const { id } = useParams();
  const { reports, getAllInterviews, loading } = useInterview();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch reports when drawer is opened
  useEffect(() => {
    if (isOpen && getAllInterviews) {
      getAllInterviews();
    }
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredReports = (reports || []).filter(item => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-over Drawer Panel */}
      <div className="absolute inset-y-0 left-0 max-w-md w-full bg-white shadow-2xl border-r border-slate-200/90 flex flex-col z-10 animate-in slide-in-from-left duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
                Assessment History
              </h3>
              <p className="text-xs text-slate-500">
                {reports?.length || 0} saved interview preparation dossier{reports?.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button & Search */}
        <div className="p-5 border-b border-slate-100 space-y-3 bg-slate-50/50">
          <Link
            to="/home"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Interview Assessment</span>
          </Link>

          {reports?.length > 3 && (
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        {/* List of Reports */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {loading && (!reports || reports.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <Sparkles className="w-6 h-6 text-indigo-500 animate-spin" />
              <p className="text-xs text-slate-400 font-medium">Loading your assessments...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">No assessments found</p>
              <p className="text-xs text-slate-400 max-w-xs">
                {searchTerm ? "No reports match your search query." : "Generate your first interview preparation plan to see it saved here."}
              </p>
            </div>
          ) : (
            filteredReports.map((item) => {
              const isActive = item._id === id;
              return (
                <Link
                  key={item._id}
                  to={`/interview/${item._id}`}
                  onClick={onClose}
                  className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-50/80 border-indigo-200 shadow-sm'
                      : 'bg-white hover:bg-slate-50 hover:border-slate-300 border-slate-200/80 shadow-2xs'
                  }`}
                >
                  {/* Left Active Accent Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-600 rounded-r-full" />
                  )}

                  <div className="flex items-start gap-3.5 min-w-0 pr-2">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                    }`}>
                      <FileText className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <h4 className={`text-xs font-bold truncate ${
                        isActive ? 'text-indigo-950 font-extrabold' : 'text-slate-800 group-hover:text-indigo-600'
                      }`}>
                        {item.title || "Interview Assessment Report"}
                      </h4>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        {item.createdAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-300" />
                            {formatDate(item.createdAt)}
                          </span>
                        )}
                        {isActive && (
                          <span className="bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.2 rounded text-[9px] uppercase tracking-wider">
                            Viewing Now
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                    isActive ? 'text-indigo-600' : 'text-slate-300 group-hover:text-indigo-500'
                  }`} />
                </Link>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
          <p className="text-[11px] text-slate-400">
            Reports are permanently saved to your account.
          </p>
        </div>

      </div>
    </div>
  );
};

export default HistoryDrawer;
