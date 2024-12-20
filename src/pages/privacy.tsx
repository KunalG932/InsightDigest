import { motion } from 'framer-motion';
import { Footer } from '../components/Footer';

export default function Privacy() {
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
          Privacy Policy
        </motion.h1>

        <div className="prose prose-invert max-w-none space-y-8">
          <div className="bg-slate-800/50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Overview</h2>
            <p className="text-slate-300">
              This Privacy Policy outlines how InsightDigest collects, uses, and protects any information obtained through our service. 
              We are committed to ensuring your privacy is protected and maintaining transparency about our data practices.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Information Collection</h2>
            <p className="text-slate-300 mb-4">We may collect the following information:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Usage statistics and preferences</li>
              <li>Technical information about your device and browser</li>
              <li>Telegram channel subscription status</li>
              <li>Feedback and communications you provide</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Data Usage</h2>
            <p className="text-slate-300 mb-4">
              We use this information to:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Improve our services and user experience</li>
              <li>Customize content based on preferences</li>
              <li>Send relevant news updates via Telegram</li>
              <li>Analyze service performance and usage patterns</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Data Protection</h2>
            <p className="text-slate-300 mb-4">
              We implement various security measures to maintain the safety of your information:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Secure SSL encryption for data transmission</li>
              <li>Regular security assessments and updates</li>
              <li>Limited access to personal information</li>
              <li>Secure data storage practices</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Third-Party Services</h2>
            <p className="text-slate-300">
              We use third-party services for news aggregation and delivery. These services may collect information 
              as specified in their respective privacy policies. We encourage users to review the privacy policies 
              of any third-party services linked to from our service.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Contact Information</h2>
            <p className="text-slate-300">
              If you have any questions about this Privacy Policy, please contact us through:
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
