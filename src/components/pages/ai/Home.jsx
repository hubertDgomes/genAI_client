import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  FileCheck,
  Trash2,
  Sparkles,
  ArrowRight,
  Briefcase,
  User,
  AlertCircle,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Brain,
  Info,
  Layers,
  ChevronRight,
  FileUp,
  Clock
} from 'lucide-react';
import useInterview from './hooks/useInterview';
import HistoryDrawer from './components/HistoryDrawer';

const SAMPLE_DATA = {
  selfDescription: "Passionate Full-Stack Developer with 4 years of experience specializing in React, Node.js, and cloud architectures. Proven track record in optimizing web performance, architecting scalable microservices, and leading agile sprint teams. Looking to step into a Senior Engineer role focusing on high-traffic systems.",
  jobDescription: "Senior Frontend Engineer (React/TypeScript)\n\nKey Responsibilities:\n- Architect, build, and maintain high-performance web applications using React, TypeScript, and Tailwind CSS.\n- Collaborate with product designers and backend engineers to create intuitive, accessible user interfaces.\n- Optimize web vitals and overall front-end application speed.\n- Mentor junior developers and lead technical code reviews.\n\nQualifications:\n- 4+ years of hands-on experience with modern React (Hooks, Context, State Management).\n- Deep proficiency with TypeScript, modern CSS, and REST/GraphQL APIs.\n- Strong understanding of web performance optimization and accessibility (a11y).\n- Solid background in automated unit and integration testing (Jest, React Testing Library).",
  fileName: "Resume_Senior_Developer.pdf",
  fileSize: "1.2 MB"
};

const Home = () => {
  const navigate = useNavigate();
  const { loading, generateReport, reports, getAllInterviews } = useInterview();
  const [selfDescription, setSelfDescription] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  // UI helper states
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (getAllInterviews) {
      getAllInterviews();
    }
  }, []);

  // Drag & drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateAndSetFile = (file) => {
    setFileError('');
    if (!file) return;

    // Validate type (must be PDF)
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPDF) {
      setFileError('Only PDF files are supported. Please upload a .pdf document.');
      return;
    }

    // Validate size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError('File size exceeds 10MB limit. Please upload a smaller PDF.');
      return;
    }

    setResumeFile(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    setFileError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper to autofill sample data for quick demonstration
  const fillSampleData = () => {
    setSelfDescription(SAMPLE_DATA.selfDescription);
    setJobDescription(SAMPLE_DATA.jobDescription);

    // Create a mock PDF File object so validation passes smoothly
    const mockPdfBlob = new Blob(['%PDF-1.4 Mock Resume Content for Preview'], { type: 'application/pdf' });
    const mockPdfFile = new File([mockPdfBlob], SAMPLE_DATA.fileName, { type: 'application/pdf' });
    setResumeFile(mockPdfFile);

    setFileError('');
    setFormError('');
  };

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '1.2 MB';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!resumeFile) {
      setFormError('Please upload your resume in PDF format before proceeding.');
      return;
    }
    if (!jobDescription.trim()) {
      setFormError('Please provide the target job description.');
      return;
    }
    if (!selfDescription.trim()) {
      setFormError('Please provide your self description or candidate background.');
      return;
    }

    setIsSubmitting(true);
    setGenerationStep(1);

    const stepInterval = setInterval(() => {
      setGenerationStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 1200);

    try {
      let res = null;
      if (generateReport) {
        res = await generateReport({
          resume: resumeFile,
          jobDescription: jobDescription.trim(),
          selfDescription: selfDescription.trim()
        });

        clearInterval(stepInterval);
        if (res?._id) {
          navigate(`/interview/${res._id}`);
        } else {
          navigate('/interview');
        }
      }
    } catch (err) {
      console.warn("Backend API returned an error:", err);
      clearInterval(stepInterval);
      setFormError("Failed to generate report. Please verify backend connectivity.");
    } finally {
      setIsSubmitting(false);
      clearInterval(stepInterval);
    }
  };

  // Calculation for progress / completion
  const completedCount = (resumeFile ? 1 : 0) + (jobDescription.trim() ? 1 : 0) + (selfDescription.trim() ? 1 : 0);

  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500 selection:text-white">
        {/* Background Decorative subtle gradients */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-indigo-100/60 via-purple-50/40 to-blue-50/60 rounded-full blur-3xl opacity-70" />
          <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/40 to-indigo-50/30 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="max-w-5xl mx-auto">

          {/* ================= TOP HERO HEADER ================= */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm shadow-indigo-100/50 mb-5">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                AI Interview Preparation Assistant
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Master Your Next Interview with{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                Tailored AI Analysis
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Provide your candidate profile, target job description, and PDF resume.
              Our AI generates specialized technical & behavioral questions with a step-by-step roadmap.
            </p>

            {/* Action Bar */}
            <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={fillSampleData}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200/80 rounded-xl transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Auto-fill Sample Data</span>
              </button>

              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Past Assessments ({reports?.length || 0})</span>
              </button>
            </div>
          </div>

          {/* ================= PROGRESS & STATUS BAR ================= */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                  {completedCount}/3
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    Application Information
                  </h3>
                  <p className="text-xs text-slate-500">
                    {completedCount === 3
                      ? 'All inputs completed! Ready to generate your custom interview plan.'
                      : `Complete all 3 sections below to generate your interview analysis.`}
                  </p>
                </div>
              </div>

              {/* Steps indicator badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${resumeFile
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                  {resumeFile ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                  <span>1. Resume (PDF)</span>
                </div>

                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${jobDescription.trim()
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                  {jobDescription.trim() ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                  <span>2. Job Description</span>
                </div>

                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${selfDescription.trim()
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                  {selfDescription.trim() ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                  <span>3. Self Description</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(completedCount / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* ================= FORM SECTION ================= */}
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Top error banner */}
            {formError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3 shadow-xs animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{formError}</p>
                </div>
              </div>
            )}

            {/* ----------------- 1. RESUME UPLOADER (PDF) ----------------- */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-100">
                      1
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      Upload Resume (PDF)
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 pl-9.5">
                    Upload your latest CV or resume in PDF format. We extract key skills, projects, and work experience.
                  </p>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                  Required • PDF Only
                </span>
              </div>

              {/* Upload Dropzone Container */}
              <div className="pl-0 sm:pl-9.5">
                {!resumeFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${isDragging
                        ? 'border-indigo-600 bg-indigo-50/70 scale-[0.99]'
                        : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-slate-50'
                      }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="resume-upload"
                      accept="application/pdf,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>

                    <p className="text-sm font-bold text-slate-800">
                      <span className="text-indigo-600 hover:underline">Click to browse</span> or drag and drop your PDF resume here
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5">
                      Standard PDF documents up to 10MB
                    </p>

                    <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Securely parsed and kept private</span>
                    </div>
                  </div>
                ) : (
                  /* Uploaded File Card */
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                        PDF
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {resumeFile.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>{formatFileSize(resumeFile.size)}</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Ready for parsing
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white border border-slate-200 rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer"
                      >
                        Change File
                      </button>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}

                {fileError && (
                  <p className="text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {fileError}
                  </p>
                )}
              </div>
            </div>

            {/* ----------------- 2. JOB DESCRIPTION ----------------- */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-100">
                      2
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      Job Description
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 pl-9.5">
                    Paste the target role description, responsibilities, required tech stack, and experience qualifications.
                  </p>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                  Required
                </span>
              </div>

              <div className="pl-0 sm:pl-9.5 space-y-3">
                <div className="relative">
                  <textarea
                    id="job-description-input"
                    rows={6}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job post here, e.g.:&#10;Role: Senior React Developer&#10;Key Responsibilities: Architect frontend micro-frontends, manage state with Redux Toolkit...&#10;Requirements: 4+ years of React, TypeScript, Node.js..."
                    className="w-full bg-slate-50/70 focus:bg-white border border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 rounded-2xl p-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all font-normal resize-y"
                  />
                  <div className="absolute right-3 bottom-3 text-[11px] font-mono text-slate-400 pointer-events-none bg-white/80 px-2 py-0.5 rounded-md border border-slate-100">
                    {jobDescription.length} chars
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" /> Suggestions:
                  </span>
                  <button
                    type="button"
                    onClick={() => setJobDescription("Senior Frontend Engineer (React/TypeScript)\nResponsibilities:\n- Build scalable single-page apps with React and TypeScript\n- Optimize Web Vitals and load performance\n- Write comprehensive unit tests with Vitest / RTL\nRequirements:\n- 3+ years professional React experience\n- Strong CSS3 and responsive design skills")}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 transition-colors text-xs font-medium cursor-pointer"
                  >
                    Frontend React Role
                  </button>
                  <button
                    type="button"
                    onClick={() => setJobDescription("Full-Stack Software Engineer (Node.js/React)\nResponsibilities:\n- Design RESTful APIs and microservices\n- Manage PostgreSQL / MongoDB databases\n- Build high-converting user interfaces with React & Tailwind\nRequirements:\n- Strong knowledge of Express.js, MongoDB, React Hooks")}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 transition-colors text-xs font-medium cursor-pointer"
                  >
                    Full Stack Role
                  </button>
                </div>
              </div>
            </div>

            {/* ----------------- 3. SELF DESCRIPTION ----------------- */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-100">
                      3
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      Self Description & Background
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 pl-9.5">
                    Summarize your core strengths, years of experience, unique achievements, and areas where you are looking to grow.
                  </p>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                  Required
                </span>
              </div>

              <div className="pl-0 sm:pl-9.5 space-y-3">
                <div className="relative">
                  <textarea
                    id="self-description-input"
                    rows={5}
                    value={selfDescription}
                    onChange={(e) => setSelfDescription(e.target.value)}
                    placeholder="Describe your background and career goals, e.g.:&#10;I am a software engineer with 3+ years of experience building modern React web apps and Node.js backends. I excel at problem solving, writing testable code, and collaborating with cross-functional product teams..."
                    className="w-full bg-slate-50/70 focus:bg-white border border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 rounded-2xl p-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all font-normal resize-y"
                  />
                  <div className="absolute right-3 bottom-3 text-[11px] font-mono text-slate-400 pointer-events-none bg-white/80 px-2 py-0.5 rounded-md border border-slate-100">
                    {selfDescription.length} chars
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Quick Template:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelfDescription("Full-Stack Developer with 3+ years building web applications with React, Node.js, and MongoDB. I focus on clean component architectures, robust API integrations, and fast load times.")}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 transition-colors text-xs font-medium cursor-pointer"
                  >
                    MERN Developer Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelfDescription("Junior Software Engineer graduate passionate about frontend technologies, responsive UI design, TypeScript, and modern state management. Quick learner eager to contribute to production web apps.")}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 transition-colors text-xs font-medium cursor-pointer"
                  >
                    Junior Developer Profile
                  </button>
                </div>
              </div>
            </div>

            {/* ================= SUBMIT CTA SECTION ================= */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Ready to generate your interview dossier?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Our AI models will cross-reference your resume with the job description to build your custom guide.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-base shadow-lg shadow-indigo-600/25 transition-all cursor-pointer select-none ${isSubmitting || loading
                    ? 'bg-indigo-400 cursor-not-allowed opacity-90'
                    : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0'
                  }`}
              >
                {isSubmitting || loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>
                      {generationStep === 1 && "Parsing Resume..."}
                      {generationStep === 2 && "Analyzing Match & Skill Gaps..."}
                      {generationStep === 3 && "Synthesizing Questions..."}
                      {generationStep === 0 && "Generating Dossier..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Interview Plan</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

          </form>

          {/* ================= VALUE PROPOSITION TILES ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12 pt-8 border-t border-slate-200">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-3">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">
                Deep Stack Questioning
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Technical questions formulated specifically targeting gaps between your resume and target role.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">
                Interviewer Intention & STAR
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Understand what recruiters are really testing for with structured sample responses.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">
                Interactive Roadmap Plan
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                A daily preparation plan with actionable checklist items to ace each round.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </>
  );
};

export default Home;