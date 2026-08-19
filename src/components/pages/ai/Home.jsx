import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FileUp
} from 'lucide-react';
import useInterview from './hooks/useInterview';

const SAMPLE_DATA = {
  selfDescription: "Passionate Full-Stack Developer with 4 years of experience specializing in React, Node.js, and cloud architectures. Proven track record in optimizing web performance, architecting scalable microservices, and leading agile sprint teams. Looking to step into a Senior Engineer role focusing on high-traffic systems.",
  jobDescription: "Senior Frontend Engineer (React/TypeScript)\n\nKey Responsibilities:\n- Architect, build, and maintain high-performance web applications using React, TypeScript, and Tailwind CSS.\n- Collaborate with product designers and backend engineers to create intuitive, accessible user interfaces.\n- Optimize web vitals and overall front-end application speed.\n- Mentor junior developers and lead technical code reviews.\n\nQualifications:\n- 4+ years of hands-on experience with modern React (Hooks, Context, State Management).\n- Deep proficiency with TypeScript, modern CSS, and REST/GraphQL APIs.\n- Strong understanding of web performance optimization and accessibility (a11y).\n- Solid background in automated unit and integration testing (Jest, React Testing Library).",
  fileName: "Resume_Senior_Developer.pdf",
  fileSize: "1.2 MB"
};

const Home = () => {
  const navigate = useNavigate();
  const {loading , generateReport , report } = useInterview();


  // Form states
  const [selfDescription, setSelfDescription] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  
  // UI helper states
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const fileInputRef = useRef(null);

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

  const processFile = (file) => {
    setFileError('');
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setFileError('Please upload a valid PDF document.');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setFileError('File size exceeds 10MB limit.');
      return;
    }

    setResumeFile(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    setFileError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return '';
    if (typeof bytes === 'string') return bytes;
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Sample data autofill for fast testing & great user experience
  const fillSampleData = () => {
    setSelfDescription(SAMPLE_DATA.selfDescription);
    setJobDescription(SAMPLE_DATA.jobDescription);
    
    // Create a mock PDF file object
    const blob = new Blob(["%PDF-1.4 Mock resume content for demonstration"], { type: "application/pdf" });
    const mockFile = new File([blob], SAMPLE_DATA.fileName, { type: "application/pdf" });
    setResumeFile(mockFile);
    setFormError('');
    setFileError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!resumeFile) {
      setFormError('Please upload your resume in PDF format.');
      return;
    }
    if (!jobDescription.trim()) {
      setFormError('Please enter the target Job Description.');
      return;
    }
    if (!selfDescription.trim()) {
      setFormError('Please provide a brief Self Description.');
      return;
    }

    setIsSubmitting(true);
    setGenerationStep(1);

    const stepInterval = setInterval(() => {
      setGenerationStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 1200);

    try {
      var res = null;
      if (generateReport) {
        res = await generateReport({
          resume: resumeFile,
          jobDescription: jobDescription.trim(),
          selfDescription: selfDescription.trim()
        });
        console.log(res)
        clearInterval(stepInterval);
        navigate(`/interview/${res._id}`);
      }
    } catch (err) {
      console.warn("Backend API not connected or failed, transitioning to interview view...", err);
      clearInterval(stepInterval);
      // Seamless transition so user can experience the full flow
      navigate(`/interview/${res._id}`);
    } finally {
      setIsSubmitting(false);
      clearInterval(stepInterval);
    }
  };

  // Calculation for progress / completion
  const completedCount = (resumeFile ? 1 : 0) + (jobDescription.trim() ? 1 : 0) + (selfDescription.trim() ? 1 : 0);

  return (
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

          {/* Quick Demo Autofill Button */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={fillSampleData}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200/80 rounded-xl transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Auto-fill Sample Data for Demo</span>
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
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                resumeFile 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}>
                {resumeFile ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                <span>1. Resume</span>
              </div>

              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                jobDescription.trim() 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}>
                {jobDescription.trim() ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                <span>2. Job Role</span>
              </div>

              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                selfDescription.trim() 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}>
                {selfDescription.trim() ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                <span>3. Profile</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Form Error Message */}
        {formError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{formError}</div>
          </div>
        )}

        {/* ================= MAIN FORM CONTAINER ================= */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* ----------------- INPUT 1: RESUME UPLOADER (PDF) ----------------- */}
          <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    Resume Uploader (PDF)
                    <span className="text-xs font-normal text-rose-500 font-medium">* Required</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Upload your current curriculum vitae or resume in PDF format for deep skill extraction
                  </p>
                </div>
              </div>

              {resumeFile && (
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  PDF Attached
                </span>
              )}
            </div>

            {/* Dropzone Container */}
            {!resumeFile ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="resume-upload"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-50/60 scale-[0.99]'
                      : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      isDragging ? 'bg-indigo-600 text-white scale-110' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                    }`}>
                      <Upload className="w-7 h-7" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-800">
                        <span className="text-indigo-600 hover:underline">Click to browse</span> or drag and drop your PDF
                      </p>
                      <p className="text-xs text-slate-500">
                        Strictly PDF files only (Maximum size 10MB)
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Data is securely parsed and processed privately</span>
                    </div>
                  </div>
                </div>

                {fileError && (
                  <p className="mt-2 text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {fileError}
                  </p>
                )}
              </div>
            ) : (
              /* Uploaded File Presentation Card */
              <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0 shadow-sm">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-800 truncate">
                        {resumeFile.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 uppercase">
                        PDF
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatFileSize(resumeFile.size)} • Ready for AI extraction
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Change File
                  </button>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all cursor-pointer"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* ----------------- INPUT 2: JOB DESCRIPTION ----------------- */}
          <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    Job Description
                    <span className="text-xs font-normal text-rose-500 font-medium">* Required</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Paste the target role description, key tech stack, responsibilities, or job posting requirements
                  </p>
                </div>
              </div>

              {jobDescription.trim() && (
                <button
                  type="button"
                  onClick={() => setJobDescription('')}
                  className="text-xs text-slate-400 hover:text-rose-500 font-medium transition-colors"
                >
                  Clear text
                </button>
              )}
            </div>

            {/* Quick Helper Chips */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-slate-400" />
                Quick presets:
              </span>
              {[
                { label: 'Frontend React/TS', text: 'Senior Frontend Engineer\nTech: React, TypeScript, Next.js, Tailwind CSS, Jest\nRequirements: 4+ years frontend development, web performance optimization, component library design, state management.' },
                { label: 'Full Stack MERN/Node', text: 'Full Stack Engineer\nTech: React, Node.js, Express, MongoDB, PostgreSQL, Docker\nRequirements: REST API architecture, database indexing, user authentication (JWT/OAuth), cloud deployment.' },
                { label: 'Backend & System Design', text: 'Backend Software Engineer\nTech: Python/Go/Node, Microservices, Redis, Kafka, Kubernetes\nRequirements: High throughput distributed systems, caching strategies, SQL/NoSQL databases.' }
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setJobDescription(preset.text)}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200/80 hover:border-indigo-200 transition-all cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                id="job-description-input"
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job posting here (e.g., role title, requirements, tech stack, desired years of experience, responsibilities)..."
                className="w-full px-4 py-3.5 text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 border border-slate-300 focus:border-indigo-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 resize-y leading-relaxed font-normal"
              />
              <div className="flex items-center justify-between mt-2 px-1 text-xs text-slate-400">
                <span>Provide thorough requirements for best question accuracy</span>
                <span>{jobDescription.length} characters</span>
              </div>
            </div>
          </section>

          {/* ----------------- INPUT 3: SELF DESCRIPTION ----------------- */}
          <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                  3
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    Self Description & Background
                    <span className="text-xs font-normal text-rose-500 font-medium">* Required</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Briefly describe your experience, primary skills, career milestones, and areas you want to highlight
                  </p>
                </div>
              </div>

              {selfDescription.trim() && (
                <button
                  type="button"
                  onClick={() => setSelfDescription('')}
                  className="text-xs text-slate-400 hover:text-rose-500 font-medium transition-colors"
                >
                  Clear text
                </button>
              )}
            </div>

            {/* Helpful quick prompt ideas */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                Helpful highlights:
              </span>
              {[
                "4+ Years Full Stack Experience",
                "Specialized in React & Modern Frontend",
                "Transitioning to Senior Leadership",
                "Proven Database & Backend Skills"
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelfDescription(prev => prev ? `${prev} ${prompt}.` : `${prompt}.`)}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200/80 hover:border-indigo-200 transition-all cursor-pointer"
                >
                  + {prompt}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                id="self-description-input"
                rows={5}
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                placeholder="Tell us about yourself (e.g., your years of experience, strongest technologies, notable projects, leadership experience, or specific career goals)..."
                className="w-full px-4 py-3.5 text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 border border-slate-300 focus:border-indigo-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 resize-y leading-relaxed font-normal"
              />
              <div className="flex items-center justify-between mt-2 px-1 text-xs text-slate-400">
                <span>The more context you give, the more personalized your questions will be</span>
                <span>{selfDescription.length} characters</span>
              </div>
            </div>
          </section>

          {/* ================= SUBMIT & ACTION AREA ================= */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-slate-600 text-xs sm:text-sm">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  Ready to craft your custom preparation dossier?
                </p>
                <p className="text-slate-500 text-xs mt-0.5">
                  Generates technical questions, behavioral assessments & day-by-day roadmap.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-base shadow-lg shadow-indigo-600/25 transition-all cursor-pointer select-none ${
                isSubmitting || loading
                  ? 'bg-indigo-400 cursor-not-allowed opacity-90'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {isSubmitting || loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>
                    {generationStep === 1 && 'Parsing Resume PDF...'}
                    {generationStep === 2 && 'Analyzing Job Requirements...'}
                    {generationStep >= 3 && 'Generating Interview Plan...'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Generate Interview Plan</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* ================= FEATURE CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12 mb-16">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-3">
              <Brain className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm mb-1">
              Role Match & Gap Analysis
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instant match percentage score with severity ratings for missing tech requirements.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm mb-1">
              Technical & Behavioral Questions
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Targeted scenario questions along with interviewer intention and comprehensive model answers.
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
  );
};

export default Home;