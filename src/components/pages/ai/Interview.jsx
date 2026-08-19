import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';

// Sample interview data defined directly inside the file for easy standalone usage and integration
const SAMPLE_INTERVIEW_DATA = {
  "matchScore": 65,
  "technicalQuestion": [
    {
      "question": "How do you handle dependency injection and middleware in a PHP framework like Laravel or Symfony compared to Node.js/Express?",
      "intention": "To assess if the candidate has practical experience with the required PHP stack, as their current expertise is heavily focused on the MERN stack.",
      "answer": "The candidate should discuss how Laravel/Symfony handle Service Containers for dependency injection and how PHP's request lifecycle differs from Node.js's event loop, noting how middleware serves similar request-filtering purposes in both environments."
    },
    {
      "question": "Describe your process for optimizing a slow-loading MySQL query in a high-traffic application.",
      "intention": "To verify the candidate's understanding of relational database optimization, a key requirement which is absent from their MERN-centric resume.",
      "answer": "Candidate should mention using 'EXPLAIN' to analyze query execution plans, indexing strategies, avoiding N+1 queries, denormalization where necessary, and perhaps caching common result sets."
    }
  ],
  "behavioralQuestion": [
    {
      "question": "Can you describe a time you had to mentor a junior developer, and how did you approach the transfer of knowledge?",
      "intention": "To evaluate the 'Senior' level requirement for mentoring skills as specified in the job description.",
      "answer": "The candidate should describe a specific scenario, focusing on empathy, code reviews, setting up clear documentation, and pair programming rather than just solving the problem for the junior dev."
    }
  ],
  "skillGap": [
    {
      "skill": "PHP/Laravel",
      "severity": "high"
    },
    {
      "skill": "MySQL (Relational Database Design)",
      "severity": "high"
    },
    {
      "skill": "Professional Experience (7+ years)",
      "severity": "medium"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "PHP Fundamentals",
      "tasks": [
        "Review modern PHP 8.x features",
        "Set up a local Laravel environment",
        "Understand Laravel's Eloquent ORM vs Mongoose"
      ]
    },
    {
      "day": 2,
      "focus": "Relational Databases",
      "tasks": [
        "Study MySQL indexing and query optimization",
        "Practice database normalization techniques",
        "Learn about SQL JOINs vs NoSQL aggregation"
      ]
    },
    {
      "day": 3,
      "focus": "AI Integration and Prompt Engineering",
      "tasks": [
        "Explore GitHub Copilot and ChatGPT for PHP code generation",
        "Build a small feature using AI-assisted unit testing",
        "Document workflow automation techniques"
      ]
    }
  ],
  "user": {
    "$oid": "6a824d82d3834fc215c8b6f0"
  },
  "createdAt": {
    "$date": "2026-08-18T15:04:33.874Z"
  },
  "updatedAt": {
    "$date": "2026-08-18T15:04:33.874Z"
  },
  "__v": 0
};

/**
 * Interview Component
 * @param {Object} props.interviewData - Optional interview data object. If not provided, uses SAMPLE_INTERVIEW_DATA.
 */
const Interview = ({ interviewData }) => {
  // Use passed interviewData if available, otherwise fall back to SAMPLE_INTERVIEW_DATA
  const data = interviewData || SAMPLE_INTERVIEW_DATA;

  const [activeSection, setActiveSection] = useState('technical'); // 'technical' | 'behavioral' | 'roadmap'
  const [expandedQuestions, setExpandedQuestions] = useState({ 0: true }); // First question open by default
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});

  const technicalQuestions = data?.technicalQuestion || [];
  const behavioralQuestions = data?.behavioralQuestion || [];
  const skillGaps = data?.skillGap || [];
  const preparationPlan = data?.preparationPlan || [];
  const matchScore = data?.matchScore ?? 65;

  const toggleQuestion = (index) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleCopy = (text, id) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedIndex(id);
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

  // Circular gauge calculations
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (matchScore / 100) * circumference;

  // Severity color styles matching the design screenshot
  const getSeverityStyle = (severity) => {
    const sev = severity?.toLowerCase();
    if (sev === 'high') {
      return "bg-[#28131d]/90 border-rose-900/60 text-rose-300 hover:border-rose-700/80";
    }
    if (sev === 'medium') {
      return "bg-[#281e11]/90 border-amber-900/60 text-amber-300 hover:border-amber-700/80";
    }
    return "bg-[#0f281d]/90 border-emerald-900/60 text-emerald-300 hover:border-emerald-700/80";
  };

  return (
    <div className="min-h-screen bg-[#0d111d] text-slate-100 py-8 px-4 sm:px-6 lg:px-10 font-sans">
      <div className="max-w-[1360px] mx-auto bg-[#101524] border border-[#1b2337] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ================= LEFT SIDEBAR: SECTIONS ================= */}
          <aside className="lg:col-span-3">
            <h2 className="text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase px-2 mb-4">
              SECTIONS
            </h2>

            <nav className="flex flex-col gap-2">
              {/* Technical Questions */}
              <button
                type="button"
                onClick={() => {
                  setActiveSection('technical');
                  setExpandedQuestions({ 0: true });
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left w-full cursor-pointer ${
                  activeSection === 'technical'
                    ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Code2 size={18} className={activeSection === 'technical' ? 'text-pink-400' : 'text-slate-400'} />
                <span>Technical Questions</span>
              </button>

              {/* Behavioral Questions */}
              <button
                type="button"
                onClick={() => {
                  setActiveSection('behavioral');
                  setExpandedQuestions({ 0: true });
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left w-full cursor-pointer ${
                  activeSection === 'behavioral'
                    ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <MessageSquare size={18} className={activeSection === 'behavioral' ? 'text-pink-400' : 'text-slate-400'} />
                <span>Behavioral Questions</span>
              </button>

              {/* Road Map */}
              <button
                type="button"
                onClick={() => setActiveSection('roadmap')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left w-full cursor-pointer ${
                  activeSection === 'roadmap'
                    ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Compass size={18} className={activeSection === 'roadmap' ? 'text-pink-400' : 'text-slate-400'} />
                <span>Road Map</span>
              </button>
            </nav>
          </aside>

          {/* ================= CENTER: MAIN CONTENT ================= */}
          <main className="lg:col-span-6">
            
            {/* TECHNICAL QUESTIONS VIEW */}
            {activeSection === 'technical' && (
              <div>
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Technical Questions
                  </h1>
                  <span className="bg-[#182133] text-slate-400 text-xs font-semibold px-3 py-1 rounded-full border border-slate-700/60">
                    {technicalQuestions.length} questions
                  </span>
                </div>

                {/* Questions Accordion List */}
                <div className="space-y-4">
                  {technicalQuestions.map((item, idx) => {
                    const isExpanded = !!expandedQuestions[idx];
                    return (
                      <div
                        key={idx}
                        className="bg-[#141b2c] border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 transition-all shadow-md"
                      >
                        {/* Header Row (Click to toggle) */}
                        <div
                          onClick={() => toggleQuestion(idx)}
                          className="flex items-start justify-between gap-3 cursor-pointer select-none"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <span className="bg-pink-500/15 text-pink-400 border border-pink-500/30 text-xs font-bold px-2 py-0.5 rounded-md shrink-0 mt-0.5">
                              Q{idx + 1}
                            </span>
                            <h3 className="text-slate-100 font-medium text-[15px] leading-snug">
                              {item.question}
                            </h3>
                          </div>
                          <div className={`p-1 shrink-0 ${isExpanded ? 'text-pink-400' : 'text-slate-500'}`}>
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </div>

                        {/* Collapsible Content */}
                        {isExpanded && (
                          <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-4">
                            {/* Intention */}
                            {item.intention && (
                              <div>
                                <span className="inline-block bg-[#381647] text-purple-300 border border-purple-700/50 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                                  INTENTION
                                </span>
                                <p className="text-slate-300 text-sm mt-2 leading-relaxed font-normal">
                                  {item.intention}
                                </p>
                              </div>
                            )}

                            {/* Model Answer */}
                            {item.answer && (
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="inline-block bg-[#0c3826] text-emerald-400 border border-emerald-600/50 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                                    MODEL ANSWER
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(item.answer, `t-${idx}`)}
                                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors py-0.5 px-2 rounded hover:bg-slate-800/60"
                                  >
                                    {copiedIndex === `t-${idx}` ? (
                                      <>
                                        <Check size={12} className="text-emerald-400" />
                                        <span className="text-emerald-400">Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy size={12} />
                                        <span>Copy</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <p className="text-slate-300 text-sm mt-2 leading-relaxed font-normal">
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

            {/* BEHAVIORAL QUESTIONS VIEW */}
            {activeSection === 'behavioral' && (
              <div>
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Behavioral Questions
                  </h1>
                  <span className="bg-[#182133] text-slate-400 text-xs font-semibold px-3 py-1 rounded-full border border-slate-700/60">
                    {behavioralQuestions.length} {behavioralQuestions.length === 1 ? 'question' : 'questions'}
                  </span>
                </div>

                {/* Questions Accordion List */}
                <div className="space-y-4">
                  {behavioralQuestions.map((item, idx) => {
                    const isExpanded = !!expandedQuestions[idx];
                    return (
                      <div
                        key={idx}
                        className="bg-[#141b2c] border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 transition-all shadow-md"
                      >
                        {/* Header Row */}
                        <div
                          onClick={() => toggleQuestion(idx)}
                          className="flex items-start justify-between gap-3 cursor-pointer select-none"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <span className="bg-pink-500/15 text-pink-400 border border-pink-500/30 text-xs font-bold px-2 py-0.5 rounded-md shrink-0 mt-0.5">
                              Q{idx + 1}
                            </span>
                            <h3 className="text-slate-100 font-medium text-[15px] leading-snug">
                              {item.question}
                            </h3>
                          </div>
                          <div className={`p-1 shrink-0 ${isExpanded ? 'text-pink-400' : 'text-slate-500'}`}>
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </div>

                        {/* Collapsible Content */}
                        {isExpanded && (
                          <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-4">
                            {item.intention && (
                              <div>
                                <span className="inline-block bg-[#381647] text-purple-300 border border-purple-700/50 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                                  INTENTION
                                </span>
                                <p className="text-slate-300 text-sm mt-2 leading-relaxed font-normal">
                                  {item.intention}
                                </p>
                              </div>
                            )}

                            {item.answer && (
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="inline-block bg-[#0c3826] text-emerald-400 border border-emerald-600/50 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                                    MODEL ANSWER
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(item.answer, `b-${idx}`)}
                                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors py-0.5 px-2 rounded hover:bg-slate-800/60"
                                  >
                                    {copiedIndex === `b-${idx}` ? (
                                      <>
                                        <Check size={12} className="text-emerald-400" />
                                        <span className="text-emerald-400">Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy size={12} />
                                        <span>Copy</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <p className="text-slate-300 text-sm mt-2 leading-relaxed font-normal">
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

            {/* ROAD MAP VIEW */}
            {activeSection === 'roadmap' && (
              <div>
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Road Map
                  </h1>
                  <span className="bg-[#182133] text-slate-400 text-xs font-semibold px-3 py-1 rounded-full border border-slate-700/60">
                    {preparationPlan.length} Days
                  </span>
                </div>

                {/* Preparation Plan Timeline */}
                <div className="space-y-5">
                  {preparationPlan.map((dayPlan, dayIdx) => {
                    const tasks = dayPlan.tasks || [];
                    return (
                      <div
                        key={dayIdx}
                        className="bg-[#141b2c] border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-md"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-xs font-bold px-2.5 py-1 rounded-lg uppercase">
                            Day {dayPlan.day || dayIdx + 1}
                          </span>
                          <h3 className="text-base font-bold text-white">
                            {dayPlan.focus}
                          </h3>
                        </div>

                        <div className="space-y-2 mt-3">
                          {tasks.map((task, taskIdx) => {
                            const isChecked = !!completedTasks[`${dayIdx}-${taskIdx}`];
                            return (
                              <button
                                key={taskIdx}
                                type="button"
                                onClick={() => toggleTask(dayIdx, taskIdx)}
                                className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                                  isChecked
                                    ? 'bg-slate-900/40 border-emerald-900/40 text-slate-400'
                                    : 'bg-slate-900/60 border-slate-800/70 text-slate-200 hover:border-slate-700'
                                }`}
                              >
                                <div className="mt-0.5 shrink-0">
                                  {isChecked ? (
                                    <CheckCircle2 size={16} className="text-emerald-400" />
                                  ) : (
                                    <Circle size={16} className="text-slate-500" />
                                  )}
                                </div>
                                <span className={`text-sm leading-relaxed ${isChecked ? 'line-through text-slate-400' : 'text-slate-200'}`}>
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

          </main>

          {/* ================= RIGHT SIDEBAR: SCORE & SKILL GAPS ================= */}
          <aside className="lg:col-span-3 space-y-8">
            
            {/* MATCH SCORE */}
            <div>
              <h2 className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-4">
                MATCH SCORE
              </h2>

              <div className="flex flex-col items-center justify-center p-4">
                {/* SVG Gauge */}
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-28 h-28 -rotate-90 transform" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      className="text-slate-800/90"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      stroke="#22c55e"
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>

                  {/* Percentage in Center */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white">
                      {matchScore}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 -mt-1">
                      %
                    </span>
                  </div>
                </div>

                <p className="text-xs font-medium text-emerald-400 text-center mt-3">
                  Strong match for this role
                </p>
              </div>
            </div>

            {/* SKILL GAPS */}
            <div>
              <h2 className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-3">
                SKILL GAPS
              </h2>

              <div className="space-y-2.5">
                {skillGaps.map((item, idx) => {
                  const cardStyle = getSeverityStyle(item.severity);
                  return (
                    <div
                      key={idx}
                      className={`border rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all shadow-sm ${cardStyle}`}
                    >
                      {item.skill}
                    </div>
                  );
                })}
              </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
};

export default Interview;