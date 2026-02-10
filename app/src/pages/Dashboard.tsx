import { useState, useEffect } from 'react';
import { 
  Brain, 
  Briefcase, 
  BookOpen, 
  Pin, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Plus,
  Trash2,
  Lightbulb,
  X,
  Menu,
  Wand2,
  MessageSquare,
  Code,
  Users,
  Layers,
  Cpu,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';

// API base URL
const API_URL = 'http://localhost:5000/api';

// Types
interface Question {
  _id?: string;
  question: string;
  answer: string;
  category: string;
  difficulty: string;
  isPinned: boolean;
  aiExplanation?: string;
  tags?: string[];
  createdAt?: string;
}

interface Session {
  _id?: string;
  title: string;
  jobRole: string;
  experienceLevel: string;
  category: string;
  questions: Question[];
  isActive: boolean;
  createdAt?: string;
}

// Experience levels
const experienceLevels = [
  { value: 'entry', label: 'Entry Level (0-2 years)', color: 'bg-green-500' },
  { value: 'mid', label: 'Mid Level (2-5 years)', color: 'bg-blue-500' },
  { value: 'senior', label: 'Senior Level (5-8 years)', color: 'bg-purple-500' },
  { value: 'expert', label: 'Expert Level (8+ years)', color: 'bg-red-500' }
];

// Categories
const categories = [
  { value: 'technical', label: 'Technical', icon: Code },
  { value: 'behavioral', label: 'Behavioral', icon: Users },
  { value: 'system-design', label: 'System Design', icon: Layers },
  { value: 'coding', label: 'Coding', icon: Cpu },
  { value: 'mixed', label: 'Mixed', icon: Sparkles }
];

// Difficulty levels
const difficultyLevels = [
  { value: 'easy', label: 'Easy', color: 'text-green-400 bg-green-400/10' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400 bg-yellow-400/10' },
  { value: 'hard', label: 'Hard', color: 'text-orange-400 bg-orange-400/10' },
  { value: 'expert', label: 'Expert', color: 'text-red-400 bg-red-400/10' }
];

function Dashboard() {
  // State
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [pinnedQuestions, setPinnedQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState<'sessions' | 'pinned' | 'generate'>('sessions');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    jobRole: '',
    experienceLevel: 'mid',
    category: 'technical',
    numQuestions: 5
  });

  // Expanded question state
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [aiExplanationLoading, setAiExplanationLoading] = useState<string | null>(null);

  // Fetch sessions on mount
  useEffect(() => {
    fetchSessions();
    fetchPinnedQuestions();
  }, []);

  // API Functions
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/sessions`);
      setSessions(response.data.data);
    } catch (err) {
      setError('Failed to fetch sessions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPinnedQuestions = async () => {
    try {
      const response = await axios.get(`${API_URL}/questions/pinned`);
      setPinnedQuestions(response.data.data);
    } catch (err) {
      console.error('Failed to fetch pinned questions:', err);
    }
  };

  const createSession = async () => {
    try {
      setLoading(true);
      
      // First, generate questions using AI
      const aiResponse = await axios.post(`${API_URL}/ai/generate-questions`, {
        jobRole: newSession.jobRole,
        experienceLevel: newSession.experienceLevel,
        category: newSession.category,
        numQuestions: newSession.numQuestions
      });

      const generatedQuestions = aiResponse.data.data;

      // Create session with generated questions
      const sessionResponse = await axios.post(`${API_URL}/sessions`, {
        title: newSession.title,
        jobRole: newSession.jobRole,
        experienceLevel: newSession.experienceLevel,
        category: newSession.category,
        questions: generatedQuestions
      });

      const createdSession = sessionResponse.data.data;
      setSessions([createdSession, ...sessions]);
      setCurrentSession(createdSession);
      setShowCreateModal(false);
      setActiveTab('sessions');
      
      // Reset form
      setNewSession({
        title: '',
        jobRole: '',
        experienceLevel: 'mid',
        category: 'technical',
        numQuestions: 5
      });
    } catch (err) {
      setError('Failed to create session');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    
    try {
      await axios.delete(`${API_URL}/sessions/${sessionId}`);
      setSessions(sessions.filter(s => s._id !== sessionId));
      if (currentSession?._id === sessionId) {
        setCurrentSession(null);
      }
    } catch (err) {
      setError('Failed to delete session');
      console.error(err);
    }
  };

  const togglePinQuestion = async (questionId: string) => {
    try {
      const response = await axios.put(`${API_URL}/questions/${questionId}/pin`);
      const updatedQuestion = response.data.data;
      
      // Update current session questions
      if (currentSession) {
        setCurrentSession({
          ...currentSession,
          questions: currentSession.questions.map(q => 
            q._id === questionId ? updatedQuestion : q
          )
        });
      }
      
      // Refresh pinned questions
      fetchPinnedQuestions();
    } catch (err) {
      setError('Failed to toggle pin');
      console.error(err);
    }
  };

  const generateAIExplanation = async (question: Question) => {
    if (!question._id) return;
    
    try {
      setAiExplanationLoading(question._id);
      
      const response = await axios.post(`${API_URL}/ai/explain`, {
        concept: question.question,
        context: question.answer
      });

      const explanation = response.data.data.explanation;
      
      // Save explanation to question
      await axios.put(`${API_URL}/questions/${question._id}/explanation`, {
        aiExplanation: explanation
      });

      // Update local state
      if (currentSession) {
        setCurrentSession({
          ...currentSession,
          questions: currentSession.questions.map(q => 
            q._id === question._id ? { ...q, aiExplanation: explanation } : q
          )
        });
      }
    } catch (err) {
      setError('Failed to generate explanation');
      console.error(err);
    } finally {
      setAiExplanationLoading(null);
    }
  };

  const deleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      await axios.delete(`${API_URL}/questions/${questionId}`);
      
      if (currentSession) {
        setCurrentSession({
          ...currentSession,
          questions: currentSession.questions.filter(q => q._id !== questionId)
        });
      }
      
      fetchPinnedQuestions();
    } catch (err) {
      setError('Failed to delete question');
      console.error(err);
    }
  };

  // Render functions
  const renderSidebar = () => (
    <motion.div 
      initial={{ x: -280 }}
      animate={{ x: sidebarOpen ? 0 : -280 }}
      className="fixed left-0 top-0 h-full w-72 bg-slate-900 border-r border-slate-800 z-50 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Interview</h1>
            <p className="text-xs text-slate-400">Prep Smarter</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => { setActiveTab('sessions'); setCurrentSession(null); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeTab === 'sessions' && !currentSession
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-medium">My Sessions</span>
        </button>

        <button
          onClick={() => { setActiveTab('pinned'); setCurrentSession(null); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeTab === 'pinned' 
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Pin className="w-5 h-5" />
          <span className="font-medium">Pinned</span>
          {pinnedQuestions.length > 0 && (
            <span className="ml-auto bg-violet-500 text-white text-xs px-2 py-1 rounded-full">
              {pinnedQuestions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => { setActiveTab('generate'); setCurrentSession(null); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeTab === 'generate' 
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="font-medium">Generate New</span>
        </button>
      </nav>

      {/* Stats */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Your Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Sessions</span>
              <span className="text-white font-medium">{sessions.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Pinned</span>
              <span className="text-white font-medium">{pinnedQuestions.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Total Qs</span>
              <span className="text-white font-medium">
                {sessions.reduce((acc, s) => acc + (s.questions?.length || 0), 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="p-4 border-t border-slate-800">
        <Link 
          to="/" 
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>
    </motion.div>
  );

  const renderCreateModal = () => (
    <AnimatePresence>
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Session</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Session Title
                </label>
                <input
                  type="text"
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                  placeholder="e.g., Senior React Developer Interview"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Job Role
                </label>
                <input
                  type="text"
                  value={newSession.jobRole}
                  onChange={(e) => setNewSession({ ...newSession, jobRole: e.target.value })}
                  placeholder="e.g., Frontend Developer"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={newSession.experienceLevel}
                    onChange={(e) => setNewSession({ ...newSession, experienceLevel: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    {experienceLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newSession.category}
                    onChange={(e) => setNewSession({ ...newSession, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Number of Questions: {newSession.numQuestions}
                </label>
                <input
                  type="range"
                  min="3"
                  max="15"
                  value={newSession.numQuestions}
                  onChange={(e) => setNewSession({ ...newSession, numQuestions: parseInt(e.target.value) })}
                  className="w-full accent-violet-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createSession}
                disabled={!newSession.title || !newSession.jobRole || loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate with AI
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderSessionsList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">My Interview Sessions</h2>
          <p className="text-slate-400 mt-1">Practice and prepare with AI-generated questions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Session
        </button>
      </div>

      {/* Sessions Grid */}
      {sessions.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No sessions yet</h3>
          <p className="text-slate-400 mb-6">Create your first interview session to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transition-colors"
          >
            Create Session
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-violet-500/50 transition-colors cursor-pointer group"
              onClick={() => setCurrentSession(session)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  categories.find(c => c.value === session.category)?.icon === Code ? 'bg-blue-500/20 text-blue-400' :
                  categories.find(c => c.value === session.category)?.icon === Users ? 'bg-green-500/20 text-green-400' :
                  categories.find(c => c.value === session.category)?.icon === Layers ? 'bg-purple-500/20 text-purple-400' :
                  categories.find(c => c.value === session.category)?.icon === Cpu ? 'bg-orange-500/20 text-orange-400' :
                  'bg-violet-500/20 text-violet-400'
                }`}>
                  {(() => {
                    const Icon = categories.find(c => c.value === session.category)?.icon || Sparkles;
                    return <Icon className="w-6 h-6" />;
                  })()}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session._id!);
                  }}
                  className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{session.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{session.jobRole}</p>

              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300`}>
                  {experienceLevels.find(l => l.value === session.experienceLevel)?.label}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">
                  {session.questions?.length || 0} questions
                </span>
              </div>

              <div className="text-xs text-slate-500">
                Created {new Date(session.createdAt!).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSessionDetail = () => {
    if (!currentSession) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <button
              onClick={() => setCurrentSession(null)}
              className="text-slate-400 hover:text-white mb-4 flex items-center gap-2"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
              Back to Sessions
            </button>
            <h2 className="text-3xl font-bold text-white">{currentSession.title}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-slate-400">{currentSession.jobRole}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">
                {experienceLevels.find(l => l.value === currentSession.experienceLevel)?.label}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-violet-500/20 text-violet-300 rounded-xl text-sm">
              {currentSession.questions?.length || 0} Questions
            </span>
          </div>
        </div>

        {/* Questions Accordion */}
        <div className="space-y-4">
          {currentSession.questions?.map((question, index) => (
            <motion.div
              key={question._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden"
            >
              {/* Question Header */}
              <div
                className="p-6 flex items-start gap-4 cursor-pointer hover:bg-slate-800 transition-colors"
                onClick={() => setExpandedQuestion(
                  expandedQuestion === question._id ? null : question._id!
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      difficultyLevels.find(d => d.value === question.difficulty)?.color
                    }`}>
                      {difficultyLevels.find(d => d.value === question.difficulty)?.label}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300 capitalize">
                      {question.category}
                    </span>
                    {question.isPinned && (
                      <span className="text-xs px-2 py-1 rounded-full bg-violet-500/20 text-violet-300 flex items-center gap-1">
                        <Pin className="w-3 h-3" />
                        Pinned
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-white">{question.question}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePinQuestion(question._id!);
                    }}
                    className={`p-2 rounded-xl transition-colors ${
                      question.isPinned 
                        ? 'bg-violet-500 text-white' 
                        : 'bg-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Pin className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuestion(question._id!);
                    }}
                    className="p-2 rounded-xl bg-slate-700 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {expandedQuestion === question._id ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedQuestion === question._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-700"
                  >
                    <div className="p-6 space-y-6">
                      {/* Answer */}
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Answer
                        </h4>
                        <div className="bg-slate-900/50 rounded-xl p-4 text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {question.answer}
                        </div>
                      </div>

                      {/* Tags */}
                      {question.tags && question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {question.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs px-3 py-1 rounded-full bg-slate-700 text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* AI Explanation */}
                      {question.aiExplanation && (
                        <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-xl p-4">
                          <h4 className="text-sm font-medium text-violet-300 mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            AI Explanation
                          </h4>
                          <div className="text-slate-300 whitespace-pre-wrap">
                            {question.aiExplanation}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => generateAIExplanation(question)}
                          disabled={aiExplanationLoading === question._id}
                          className="px-4 py-2 bg-violet-500/20 text-violet-300 rounded-xl hover:bg-violet-500/30 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          {aiExplanationLoading === question._id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-violet-300/30 border-t-violet-300 rounded-full animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              {question.aiExplanation ? 'Regenerate Explanation' : 'Get AI Explanation'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderPinnedQuestions = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Pinned Questions</h2>
        <p className="text-slate-400 mt-1">Your important questions for quick review</p>
      </div>

      {pinnedQuestions.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Pin className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No pinned questions</h3>
          <p className="text-slate-400 mb-6">Pin important questions during your sessions for quick access</p>
          <button
            onClick={() => setActiveTab('sessions')}
            className="px-6 py-3 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transition-colors"
          >
            Browse Sessions
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {pinnedQuestions.map((question, index) => (
            <motion.div
              key={question._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/50 border border-violet-500/30 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    difficultyLevels.find(d => d.value === question.difficulty)?.color
                  }`}>
                    {difficultyLevels.find(d => d.value === question.difficulty)?.label}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300 capitalize">
                    {question.category}
                  </span>
                </div>
                <button
                  onClick={() => togglePinQuestion(question._id!)}
                  className="p-2 rounded-xl bg-violet-500 text-white"
                >
                  <Pin className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-lg font-medium text-white mb-4">{question.question}</h3>

              <div className="bg-slate-900/50 rounded-xl p-4 text-slate-300 leading-relaxed whitespace-pre-wrap mb-4">
                {question.answer}
              </div>

              {question.aiExplanation && (
                <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-violet-300 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Explanation
                  </h4>
                  <div className="text-slate-300 whitespace-pre-wrap text-sm">
                    {question.aiExplanation}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderGenerateTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Generate New Session</h2>
        <p className="text-slate-400 mt-1">Create AI-powered interview questions tailored to your needs</p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Session Title
            </label>
            <input
              type="text"
              value={newSession.title}
              onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
              placeholder="e.g., Senior React Developer Interview"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Job Role
            </label>
            <input
              type="text"
              value={newSession.jobRole}
              onChange={(e) => setNewSession({ ...newSession, jobRole: e.target.value })}
              placeholder="e.g., Frontend Developer"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Experience Level
              </label>
              <select
                value={newSession.experienceLevel}
                onChange={(e) => setNewSession({ ...newSession, experienceLevel: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {experienceLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category
              </label>
              <select
                value={newSession.category}
                onChange={(e) => setNewSession({ ...newSession, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Number of Questions: {newSession.numQuestions}
            </label>
            <input
              type="range"
              min="3"
              max="15"
              value={newSession.numQuestions}
              onChange={(e) => setNewSession({ ...newSession, numQuestions: parseInt(e.target.value) })}
              className="w-full accent-violet-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>3</span>
              <span>15</span>
            </div>
          </div>

          <button
            onClick={createSession}
            disabled={!newSession.title || !newSession.jobRole || loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg font-medium"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <Wand2 className="w-6 h-6" />
                Generate with AI
              </>
            )}
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
        <div className="bg-slate-800/30 rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-violet-400" />
          </div>
          <h3 className="text-white font-medium mb-1">AI-Powered</h3>
          <p className="text-slate-400 text-sm">Gemini API generates high-quality questions</p>
        </div>
        <div className="bg-slate-800/30 rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-white font-medium mb-1">Role-Based</h3>
          <p className="text-slate-400 text-sm">Tailored to specific job roles</p>
        </div>
        <div className="bg-slate-800/30 rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Lightbulb className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-white font-medium mb-1">Smart Explanations</h3>
          <p className="text-slate-400 text-sm">Get AI explanations on demand</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar */}
      {renderSidebar()}

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 p-2 bg-slate-800 rounded-xl text-white hover:bg-slate-700 transition-colors"
        style={{ marginLeft: sidebarOpen ? '288px' : '0' }}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Main Content */}
      <main 
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? '288px' : '0' }}
      >
        <div className="p-8 max-w-6xl mx-auto">
          {/* Error Toast */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-4 right-4 bg-red-500/90 text-white px-6 py-4 rounded-xl shadow-lg z-50 flex items-center gap-3"
              >
                <span>{error}</span>
                <button onClick={() => setError(null)}>
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          {currentSession ? renderSessionDetail() : (
            activeTab === 'sessions' ? renderSessionsList() :
            activeTab === 'pinned' ? renderPinnedQuestions() :
            renderGenerateTab()
          )}
        </div>
      </main>

      {/* Create Modal */}
      {renderCreateModal()}
    </div>
  );
}

export default Dashboard;
