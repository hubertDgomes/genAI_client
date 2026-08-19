import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Code2, 
  MessageSquare, 
  Compass, 
  ChevronUp, 
  ChevronDown, 
  CheckCircle2, 
  Circle, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowLeft, 
  Briefcase, 
  Layers, 
  Award, 
  AlertTriangle, 
  FileText, 
  RotateCcw, 
  Zap, 
  Clock, 
  User, 
  Calendar,
  ExternalLink
} from 'lucide-react';
import useInterview from './hooks/useInterview';

/**
 * Interview Component dynamically rendering real report data from the server
 */
const Interview = ({ interviewData }) => {
  const { id } = useParams();
  const { loading, getReportById, report } = useInterview();

  // Active view tab & interaction states
  const [activeSection, setActiveSection] = useState('technical'); // 'technical' | 'behavioral' | 'roadmap' | 'details'
  const [expandedQuestions, setExpandedQuestions] = useState({ 0: true }); // First question open by default
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});

  // Fetch report by ID when accessed via /interview/:id
  useEffect(() => {
    if (id && getReportById) {
      getReportById(id);
    }
  }, [id]);

  // Resolve actual data from props or context report
  const data = interviewData || report;

  const technicalQuestions = data?.technicalQuestion || [];
  const behavioralQuestions = data?.behavioralQuestion || [];
  const skillGaps = data?.skillGap || [];
  const preparationPlan = data?.preparationPlan || [];
  const matchScore = data?.matchScore ?? 0;
  const title = data?.title || "Personalized Interview Assessment & Question Bank";

  const toggleQuestion = (index) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const expandAllQuestions = (items) => {
    const all = {};
    items.forEach((_, idx) => { all[idx] = true; });
    setExpandedQuestions(all);
  };

  const collapseAllQuestions = () => {
    setExpandedQuestions({});
  };

  const handleCopy = (text, idKey) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedIndex(idKey);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const toggleTask = (dayIndex, taskIndex) => {
    const key = `${dayIndex}-${taskIndex}`;
    setCompletedTasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Calculate task completion progress
  const totalTasks = preparationPlan.reduce((acc, curr) => acc + (curr.tasks?.length || 0), 0);
  const finishedTasksCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? Math.round((finishedTasksCount / totalTasks) * 100) : 0;

  // Circular gauge calculations
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (matchScore / 100) * circumference;

  // Severity pill styling for white theme
  const getSeverityStyle = (severity) => {
    const sev = severity?.toLowerCase();
    if (sev === 'high') {
      return "bg-rose-50 border-rose-200 text-rose-700 hover:border-rose-300";
    }
    if (sev === 'medium') {
      return "bg-amber-50 border-amber-200 text-amber-800 hover:border-amber-300";
    }
    return "bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-300";
  };

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

  // Loading State
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-10 max-w-md w-full text-center shadow-lg space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-7 h-7 animate-spin" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Loading Interview Report...</h2>
          <p className="text-sm text-slate-500">
            Retrieving customized questions, roadmap, and AI skill gap analysis.
          </p>
        </div>
      </div>
    );
  }

  // Not Found or Empty State
  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-10 max-w-md w-full text-center shadow-lg space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900">No Report Found</h2>
          <p className="text-sm text-slate-500">
            We couldn't locate this interview report. Start a new analysis from the home page.
          </p>
          <Link
            to="/home"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Setup Page</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative subtle ambient glow matching Home.jsx */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-indigo-100/60 via-purple-50/40 to-blue-50/60 rounded-full blur-3xl opacity-70" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/40 to-indigo-50/30 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ================= TOP HEADER BANNER ================= */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <Link
              to="/home"
              className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200/80 transition-all shadow-sm active:scale-95 shrink-0"
              title="Return to Setup"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  AI Interview Plan
                </span>
                {data.createdAt && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(data.createdAt)}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Custom evaluation report targeting your selected job specifications and skills.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <Link
              to="/home"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl transition-all shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>New Assessment</span>
            </Link>
          </div>
        </div>

        {/* ================= 3-COLUMN MAIN LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ================= LEFT SIDEBAR: SECTIONS ================= */}
          <aside className="lg:col-span-3">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm sticky top-6 space-y-6">
              
              <div>
                <h2 className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase px-2 mb-3">
                  SECTIONS
                </h2>

                <nav className="flex flex-col gap-2.5">
                  {/* Technical Questions Tab */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection('technical');
                      setExpandedQuestions({ 0: true });
                    }}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all text-left w-full cursor-pointer ${
                      activeSection === 'technical'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Code2 className={`w-4 h-4 ${activeSection === 'technical' ? 'text-white' : 'text-slate-400'}`} />
                      <span>Technical Questions</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      activeSection === 'technical' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {technicalQuestions.length}
                    </span>
                  </button>

                  {/* Behavioral Questions Tab */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection('behavioral');
                      setExpandedQuestions({ 0: true });
                    }}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all text-left w-full cursor-pointer ${
                      activeSection === 'behavioral'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className={`w-4 h-4 ${activeSection === 'behavioral' ? 'text-white' : 'text-slate-400'}`} />
                      <span>Behavioral Questions</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      activeSection === 'behavioral' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {behavioralQuestions.length}
                    </span>
                  </button>

                  {/* Road Map Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveSection('roadmap')}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all text-left w-full cursor-pointer ${
                      activeSection === 'roadmap'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Compass className={`w-4 h-4 ${activeSection === 'roadmap' ? 'text-white' : 'text-slate-400'}`} />
                      <span>Road Map</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      activeSection === 'roadmap' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {preparationPlan.length} Days
                    </span>
                  </button>

                  {/* Job & Profile Overview Tab */}
                  {(data.jobDescription || data.selfDescription) && (
                    <button
                      type="button"
                      onClick={() => setActiveSection('overview')}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all text-left w-full cursor-pointer ${
                        activeSection === 'overview'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className={`w-4 h-4 ${activeSection === 'overview' ? 'text-white' : 'text-slate-400'}`} />
                        <span>Source Overview</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        activeSection === 'overview' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        Info
                      </span>
                    </button>
                  )}
                </nav>
              </div>

              {/* Roadmap Progress Status widget */}
              <div className="pt-5 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Prep Tasks Progress</span>
                  <span className="text-indigo-600 font-bold">{finishedTasksCount} of {totalTasks}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Check off items in your roadmap as you study to track readiness.
                </p>
              </div>

            </div>
          </aside>

          {/* ================= CENTER: MAIN CONTENT ================= */}
          <main className="lg:col-span-6 space-y-6">
            
            {/* ----------------- TECHNICAL QUESTIONS VIEW ----------------- */}
            {activeSection === 'technical' && (
              <div className="space-y-5">
                {/* Header card with expand / collapse controls */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                      Technical Questions
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                        {technicalQuestions.length} Questions
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Targeted scenario questions based on your profile and role stack
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => expandAllQuestions(technicalQuestions)}
                      className="px-2.5 py-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    >
                      Expand all
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={collapseAllQuestions}
                      className="px-2.5 py-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    >
                      Collapse
                    </button>
                  </div>
                </div>

                {/* Questions Accordion List */}
                <div className="space-y-4">
                  {technicalQuestions.map((item, idx) => {
                    const isExpanded = !!expandedQuestions[idx];
                    return (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl p-5 sm:p-6 transition-all shadow-sm"
                      >
                        {/* Header Row */}
                        <div
                          onClick={() => toggleQuestion(idx)}
                          className="flex items-start justify-between gap-3 cursor-pointer select-none"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-extrabold px-2.5 py-1 rounded-xl shrink-0 mt-0.5">
                              Q{idx + 1}
                            </span>
                            <h3 className="text-slate-900 font-bold text-[15px] leading-snug">
                              {item.question}
                            </h3>
                          </div>
                          <div className={`p-1.5 rounded-xl transition-colors shrink-0 ${
                            isExpanded ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400 hover:text-slate-600'
                          }`}>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>

                        {/* Collapsible Content */}
                        {isExpanded && (
                          <div className="mt-5 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                            {/* Intention */}
                            {item.intention && (
                              <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4">
                                <span className="inline-block bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase">
                                  INTERVIEWER INTENTION
                                </span>
                                <p className="text-slate-700 text-xs sm:text-sm mt-2 leading-relaxed font-normal">
                                  {item.intention}
                                </p>
                              </div>
                            )}

                            {/* Model Answer */}
                            {item.answer && (
                              <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase">
                                    MODEL ANSWER & KEY TAKEAWAYS
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(item.answer, `t-${idx}`)}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors py-1 px-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-indigo-50 cursor-pointer"
                                  >
                                    {copiedIndex === `t-${idx}` ? (
                                      <>
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                        <span className="text-emerald-600">Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy Answer</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
                                  {item.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ----------------- BEHAVIORAL QUESTIONS VIEW ----------------- */}
            {activeSection === 'behavioral' && (
              <div className="space-y-5">
                {/* Header card with expand / collapse controls */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                      Behavioral Questions
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-full">
                        {behavioralQuestions.length} Questions
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Assessments on teamwork, mentorship, adaptability, and leadership
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => expandAllQuestions(behavioralQuestions)}
                      className="px-2.5 py-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    >
                      Expand all
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={collapseAllQuestions}
                      className="px-2.5 py-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    >
                      Collapse
                    </button>
                  </div>
                </div>

                {/* Questions Accordion List */}
                <div className="space-y-4">
                  {behavioralQuestions.map((item, idx) => {
                    const isExpanded = !!expandedQuestions[idx];
                    return (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl p-5 sm:p-6 transition-all shadow-sm"
                      >
                        {/* Header Row */}
                        <div
                          onClick={() => toggleQuestion(idx)}
                          className="flex items-start justify-between gap-3 cursor-pointer select-none"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-extrabold px-2.5 py-1 rounded-xl shrink-0 mt-0.5">
                              Q{idx + 1}
                            </span>
                            <h3 className="text-slate-900 font-bold text-[15px] leading-snug">
                              {item.question}
                            </h3>
                          </div>
                          <div className={`p-1.5 rounded-xl transition-colors shrink-0 ${
                            isExpanded ? 'bg-purple-50 text-purple-600' : 'bg-slate-50 text-slate-400 hover:text-slate-600'
                          }`}>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>

                        {/* Collapsible Content */}
                        {isExpanded && (
                          <div className="mt-5 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                            {/* Intention */}
                            {item.intention && (
                              <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4">
                                <span className="inline-block bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase">
                                  ASSESSMENT INTENTION
                                </span>
                                <p className="text-slate-700 text-xs sm:text-sm mt-2 leading-relaxed font-normal">
                                  {item.intention}
                                </p>
                              </div>
                            )}

                            {/* Model Answer */}
                            {item.answer && (
                              <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase">
                                    MODEL STAR STRUCTURE
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(item.answer, `b-${idx}`)}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors py-1 px-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-indigo-50 cursor-pointer"
                                  >
                                    {copiedIndex === `b-${idx}` ? (
                                      <>
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                        <span className="text-emerald-600">Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy Answer</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
                                  {item.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ----------------- ROAD MAP VIEW ----------------- */}
            {activeSection === 'roadmap' && (
              <div className="space-y-5">
                {/* Header card */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                      Preparation Road Map
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                        {preparationPlan.length} Days
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Day-by-day structured curriculum to prepare and close skill gaps
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl">
                      {progressPercent}% Done
                    </span>
                  </div>
                </div>

                {/* Day-by-Day Cards */}
                <div className="space-y-5">
                  {preparationPlan.map((dayPlan, dayIdx) => {
                    const tasks = dayPlan.tasks || [];
                    return (
                      <div
                        key={dayIdx}
                        className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-black px-3 py-1 rounded-xl uppercase tracking-wider">
                            Day {dayPlan.day || dayIdx + 1}
                          </span>
                          <h3 className="text-base font-bold text-slate-900">
                            {dayPlan.focus}
                          </h3>
                        </div>

                        <div className="space-y-2.5 mt-3">
                          {tasks.map((task, taskIdx) => {
                            const isChecked = !!completedTasks[`${dayIdx}-${taskIdx}`];
                            return (
                              <button
                                key={taskIdx}
                                type="button"
                                onClick={() => toggleTask(dayIdx, taskIdx)}
                                className={`w-full flex items-start gap-3.5 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                                  isChecked
                                    ? 'bg-emerald-50/60 border-emerald-200 text-slate-400'
                                    : 'bg-slate-50/70 hover:bg-slate-50 border-slate-200/80 hover:border-indigo-200 text-slate-800 shadow-2xs'
                                }`}
                              >
                                <div className="mt-0.5 shrink-0">
                                  {isChecked ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-500 transition-colors" />
                                  )}
                                </div>
                                <span className={`text-xs sm:text-sm font-medium leading-relaxed ${
                                  isChecked ? 'line-through text-slate-400' : 'text-slate-800'
                                }`}>
                                  {task}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ----------------- SOURCE OVERVIEW TAB ----------------- */}
            {activeSection === 'overview' && (
              <div className="space-y-5">
                {data.jobDescription && (
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-3">
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-base font-bold text-slate-900">
                        Target Job Description
                      </h3>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs sm:text-sm text-slate-700 font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                      {data.jobDescription}
                    </div>
                  </div>
                )}

                {data.selfDescription && (
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-3">
                    <div className="flex items-center gap-2.5">
                      <User className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-base font-bold text-slate-900">
                        Candidate Background & Self Description
                      </h3>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                      {data.selfDescription}
                    </div>
                  </div>
                )}
              </div>
            )}

          </main>

          {/* ================= RIGHT SIDEBAR: SCORE & SKILL GAPS ================= */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* MATCH SCORE CARD */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm text-center space-y-4">
              <h2 className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                ROLE MATCH SCORE
              </h2>

              <div className="flex flex-col items-center justify-center pt-2 pb-1">
                {/* SVG Radial Gauge */}
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      className="text-slate-100"
                      strokeWidth="9"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      stroke={matchScore >= 70 ? "#10b981" : matchScore >= 50 ? "#6366f1" : "#f59e0b"}
                      strokeWidth="9"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>

                  {/* Percentage in Center */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-900">
                      {matchScore}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 -mt-1">
                      % FIT
                    </span>
                  </div>
                </div>

                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  {matchScore >= 70 ? 'Strong Match Potential' : matchScore >= 50 ? 'Moderate Match' : 'High Prep Needed'}
                </div>

                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Calculated based on your skill alignment with the job description.
                </p>
              </div>
            </div>

            {/* SKILL GAPS CARD */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                  IDENTIFIED SKILL GAPS
                </h2>
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md">
                  {skillGaps.length} Gaps
                </span>
              </div>

              <div className="space-y-2.5">
                {skillGaps.map((item, idx) => {
                  const cardStyle = getSeverityStyle(item.severity);
                  return (
                    <div
                      key={idx}
                      className={`border rounded-2xl p-3.5 text-xs font-semibold flex items-center justify-between shadow-2xs transition-all ${cardStyle}`}
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 opacity-80" />
                        <span className="truncate">{item.skill}</span>
                      </div>
                      <span className="uppercase text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded bg-white/80 border border-current/20">
                        {item.severity}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-100">
                Focus on high-severity items first during your interview preparation.
              </p>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
};

export default Interview;