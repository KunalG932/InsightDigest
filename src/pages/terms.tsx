import { motion } from 'framer-motion';
import { Footer } from '../components/Footer';

export default function Terms() {
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
          Terms & Conditions
        </motion.h1>

        <div className="prose prose-invert max-w-none space-y-8">
          <div className="bg-slate-800/50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">1. Terms of Use</h2>
            <p className="text-slate-300">
              By accessing and using InsightDigest, you accept and agree to be bound by the terms and conditions outlined here. 
              If you disagree with any part of these terms, you may not access the service.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">2. Content Usage</h2>
            <p className="text-slate-300 mb-4">
              Our service provides AI-generated summaries and aggregated news content. Users agree to:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Use content for personal, non-commercial purposes only</li>
              <li>Not redistribute content without proper attribution</li>
              <li>Not attempt to bypass any security features</li>
              <li>Not use the service for any illegal purposes</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">3. Privacy Policy</h2>
            <p className="text-slate-300 mb-4">
              We respect your privacy and are committed to protecting your personal information. Our service:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Collects minimal user data necessary for service operation</li>
              <li>Does not share personal information with third parties</li>
              <li>Uses cookies to enhance user experience</li>
              <li>Allows users to opt-out of non-essential data collection</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">4. Disclaimer</h2>
            <p className="text-slate-300">
              InsightDigest provides AI-generated summaries and news aggregation as an informational service. 
              We make no warranties about the accuracy, reliability, or completeness of the content. 
              Users should verify critical information from primary sources.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">5. Contact</h2>
            <p className="text-slate-300">
              For any questions or concerns regarding these terms, please contact us through our Telegram channel or GitHub.
            </p>
            <div className="flex flex-col space-y-2 mt-4">
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
