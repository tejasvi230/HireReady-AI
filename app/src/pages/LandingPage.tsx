import { motion } from 'framer-motion';
import { 
  Brain, 
  Briefcase, 
  Sparkles, 
  Layers,
  Lightbulb,
  Pin,
  Database,
  Rocket,
  PlayCircle,
  Atom,
  Server,
  Github,
  Twitter,
  Linkedin,
  Code
} from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Briefcase,
    title: 'Role-Based Sessions',
    description: 'Generate questions tailored to specific job roles and experience levels. From entry to expert, we\'ve got you covered.',
    color: 'bg-violet-500/20 text-violet-400'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Q&A',
    description: 'Google Gemini API generates high-quality technical questions and comprehensive answers for effective learning.',
    color: 'bg-fuchsia-500/20 text-fuchsia-400'
  },
  {
    icon: Layers,
    title: 'Accordion Learning UI',
    description: 'Clean, expandable interface for focused study. Expand questions to reveal answers and explanations seamlessly.',
    color: 'bg-blue-500/20 text-blue-400'
  },
  {
    icon: Lightbulb,
    title: 'Dynamic AI Explanations',
    description: 'Get on-demand concept breakdowns using AI. Deep dive into any topic with detailed explanations.',
    color: 'bg-green-500/20 text-green-400'
  },
  {
    icon: Pin,
    title: 'Pin Important Questions',
    description: 'Pin questions for quick access and review. Build your personal collection of must-know topics.',
    color: 'bg-orange-500/20 text-orange-400'
  },
  {
    icon: Database,
    title: 'MongoDB Storage',
    description: 'Save and manage sessions and questions for future review. Your progress is always preserved.',
    color: 'bg-cyan-500/20 text-cyan-400'
  }
];

const steps = [
  {
    number: '1',
    title: 'Create Session',
    description: 'Enter your job role, select experience level, and choose the interview category.'
  },
  {
    number: '2',
    title: 'AI Generates Questions',
    description: 'Our AI instantly creates tailored questions and comprehensive answers for you.'
  },
  {
    number: '3',
    title: 'Study & Practice',
    description: 'Review questions, get AI explanations, and pin important topics for quick access.'
  }
];

const techStack = [
  { icon: Atom, name: 'React 18', role: 'Frontend', color: 'bg-blue-500/20 text-blue-400' },
  { icon: Server, name: 'Node.js', role: 'Backend', color: 'bg-green-500/20 text-green-400' },
  { icon: Database, name: 'MongoDB', role: 'Database', color: 'bg-cyan-500/20 text-cyan-400' },
  { icon: Brain, name: 'Gemini AI', role: 'AI Engine', color: 'bg-violet-500/20 text-violet-400' }
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">AI Interview</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">How It Works</a>
              <a href="#tech-stack" className="text-slate-300 hover:text-white transition-colors">Tech Stack</a>
            </div>
            <Link 
              to="/app" 
              className="px-6 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/30 rounded-full mb-8"
          >
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
            <span className="text-violet-300 text-sm font-medium">Powered by Google Gemini AI</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Master Your Interviews with{' '}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              AI-Powered
            </span>{' '}
            Preparation
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-3xl mx-auto mb-10"
          >
            Generate tailored interview questions, get instant AI explanations, and track your progress. 
            The smartest way to prepare for your dream job.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link 
              to="/app" 
              className="px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Get Started Free
            </Link>
            <a 
              href="#features" 
              className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-2xl font-semibold text-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Learn More
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-1">AI</div>
              <div className="text-slate-400 text-sm">Powered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-1">5+</div>
              <div className="text-slate-400 text-sm">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-1">∞</div>
              <div className="text-slate-400 text-sm">Questions</div>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 w-16 h-16 bg-violet-500/20 rounded-2xl hidden lg:flex items-center justify-center"
        >
          <Code className="w-8 h-8 text-violet-400" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 right-10 w-16 h-16 bg-fuchsia-500/20 rounded-2xl hidden lg:flex items-center justify-center"
        >
          <Brain className="w-8 h-8 text-fuchsia-400" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 left-20 w-16 h-16 bg-blue-500/20 rounded-2xl hidden lg:flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-blue-400" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Everything you need to ace your interviews, powered by cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/10"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-violet-900/10 to-slate-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-slate-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech-stack" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Modern Tech Stack</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Built with the latest technologies for performance and scalability
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center hover:border-violet-500/50 transition-colors"
              >
                <div className={`w-16 h-16 ${tech.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <tech.icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold">{tech.name}</h3>
                <p className="text-slate-400 text-sm mt-1">{tech.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Ace Your Interview?</h2>
          <p className="text-slate-400 text-lg mb-10">
            Start preparing smarter with AI-powered interview questions and explanations. 
            It's free to get started!
          </p>
          <Link 
            to="/app" 
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            <Rocket className="w-6 h-6" />
            Launch Application
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">AI Interview Prep</span>
            </div>
            <div className="text-slate-400 text-sm">
              Built with ❤️ using React, Node.js, and Google Gemini AI
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
