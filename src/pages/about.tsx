import { motion } from 'framer-motion';
import { Footer } from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-16"
      >
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold text-slate-100 mb-8"
        >
          About InsightDigest
        </motion.h1>

        <div className="prose prose-invert max-w-none">
          <div className="bg-slate-800/50 rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Our Mission</h2>
            <p className="text-slate-300">
              InsightDigest is dedicated to delivering curated, AI-enhanced news summaries that keep you informed without overwhelming you. 
              We combine cutting-edge AI technology with human insight to bring you the most relevant and digestible news content.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">What We Do</h2>
            <p className="text-slate-300 mb-4">
              Our platform aggregates news from various trusted sources and uses advanced AI to:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Generate concise, accurate summaries of news articles</li>
              <li>Categorize content for easy navigation</li>
              <li>Deliver real-time updates via Telegram</li>
              <li>Provide AI-powered insights and analysis</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Contact Us</h2>
            <p className="text-slate-300 mb-4">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <div className="flex flex-col space-y-2">
              <a 
                href="https://t.me/BrainBuffering" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Telegram Channel
              </a>
              <a 
                href="https://github.com/KunalG932" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
}
