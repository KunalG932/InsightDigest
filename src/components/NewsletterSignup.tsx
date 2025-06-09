"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check, AlertCircle, Send } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      if (email.includes('@')) {
        setStatus('success');
        setMessage('Thank you for subscribing! Check your email for confirmation.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage('Please enter a valid email address.');
      }
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }, 1000);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-slate-700">
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl 
                           flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
                Stay in the Loop
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Get the latest news summaries and insights delivered straight to your inbox. 
                Join thousands of informed readers who trust InsightDigest.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="max-w-md mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl 
                             text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 
                             focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    disabled={status === 'loading'}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading' || !email}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 
                           hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-600 text-white 
                           font-medium rounded-xl transition-all duration-300 flex items-center 
                           justify-center gap-2 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Subscribe
                    </>
                  )}
                </button>
              </div>

              {/* Status Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                    status === 'success' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {status === 'success' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="text-sm">{message}</span>
                </motion.div>
              )}
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-8 text-sm text-slate-500"
            >
              <p>
                By subscribing, you agree to our privacy policy. Unsubscribe at any time.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}