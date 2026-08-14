"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'; // Using <a> for standalone compatibility
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Send, 
  Clock, 
  Users, 
  ArrowRight, 
  Linkedin, 
  Instagram, 
  Github, 
  Twitter, 
  Globe,
  Sparkles
} from 'lucide-react';

// --- Custom CSS for Animations ---
const styleTag = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  .animate-blob {
    animation: blob 20s infinite cubic-bezier(0.4, 0, 0.2, 1);
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  .animate-pulse-glow {
    animation: pulse-glow 3s ease-in-out infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
  .glass-panel {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const AnimatedBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <style>{styleTag}</style>
    <div className="absolute bg-black" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
    
    {/* Animated Blobs */}
    <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />
    <div className="absolute -bottom-32 left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000" />
  </div>
);

const SocialButton = ({ icon: Icon, href, color }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`group relative p-3 rounded-xl glass-panel overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]`}
  >
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${color}`} />
    <Icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors relative z-10" />
  </a>
);

const ContactInfoCard = ({ icon: Icon, title, value, href, delay = 0 }) => {
  return (
    <div 
      className="group relative p-6 rounded-2xl glass-panel transition-all duration-500 hover:bg-white/5 hover:border-white/20"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      <div className="flex items-start gap-5">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 blur-lg opacity-40 group-hover:opacity-70 transition-opacity" />
          <div className="relative w-12 h-12 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-medium text-white/50 mb-1 uppercase tracking-wider">{title}</h3>
          {href ? (
            <a href={href} className="text-lg font-semibold text-white hover:text-pink-400 transition-colors flex items-center gap-2 group/link">
              {value}
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
            </a>
          ) : (
            <p className="text-lg font-semibold text-white">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const ContactPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({ type: 'success', message: data.message || 'Message sent successfully! We will get back to you soon.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus({ type: 'error', message: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear status when user starts typing
    if (submitStatus.type) {
      setSubmitStatus({ type: '', message: '' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-pink-500/30 selection:text-white">
      <AnimatedBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Header Section */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold tracking-widest text-white/80 uppercase">Open for Collaborations</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Let's Build Something <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-text-shimmer bg-[length:200%_auto]">
              Extraordinary
            </span>
          </h1>
          
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you're a student, sponsor, or fellow developer — we're always excited to connect. 
            Drop us a line and let's spark some innovation.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Info & Visuals */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <ContactInfoCard 
                icon={Mail}
                title="Email Us"
                value="ieee_sb@rgipt.ac.in"
                href="mailto:ieee_sb@rgipt.ac.in"
                delay={100}
              />
              <ContactInfoCard 
                icon={Phone}
                title="Call Us"
                value="+91 7870304944"
                href="tel:+917870304944"
                delay={200}
              />
              <ContactInfoCard 
                icon={MapPin}
                title="Visit HQ"
                value="RGIPT, Jais, Amethi, UP, India"
                delay={300}
              />
            </div>

            {/* Socials */}
            <div className="p-6 rounded-2xl glass-panel">
              <h3 className="text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">Connect on Socials</h3>
              <div className="flex gap-4">
                <SocialButton icon={Linkedin} href="https://www.linkedin.com/company/ieeergipt" color="bg-blue-600" />
                <SocialButton icon={Instagram} href="https://www.instagram.com/ieee_rgipt" color="bg-pink-600" />
                <SocialButton icon={Twitter} href="#" color="bg-sky-500" />
                <SocialButton icon={Github} href="https://github.com/ieeergiptsb" color="bg-zinc-700" />
                <SocialButton icon={Globe} href="#" color="bg-emerald-600" />
              </div>
            </div>

            {/* 3D Map Visual Placeholder */}
            <div className="relative h-64 rounded-2xl overflow-hidden border border-white/10 group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                
                {/* Floating Pin Animation */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                        <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse-glow relative z-10 shadow-[0_0_20px_rgba(236,72,153,0.6)]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-pink-500/30 rounded-full animate-ping" />
                    </div>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Jais, Uttar Pradesh</span>
                        <ArrowRight className="w-3 h-3 text-pink-400" />
                    </div>
                </div>
            </div>
          </div>

          {/* Right Column: The Form */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-white/10 to-transparent">
                <div className="bg-[#0a0a0a] rounded-[22px] p-8 md:p-10 border border-white/5 relative overflow-hidden">
                    
                    {/* Form Glow Effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] pointer-events-none" />
                    
                    <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Send a Message</h2>
                    <p className="text-white/50 mb-8 text-sm relative z-10">We usually respond within 24 hours.</p>

                    {submitStatus.type && (
                      <div className={`mb-6 p-4 rounded-xl border ${
                        submitStatus.type === 'success' 
                          ? 'bg-green-500/10 border-green-500/30 text-green-200' 
                          : 'bg-red-500/10 border-red-500/30 text-red-200'
                      } relative z-10`}>
                        <p className="text-sm font-medium">{submitStatus.message}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all duration-300"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all duration-300"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1">Subject</label>
                            <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all duration-300 appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-zinc-900">Select a topic...</option>
                                <option value="General Inquiry" className="bg-zinc-900">General Inquiry</option>
                                <option value="Collaboration" className="bg-zinc-900">Collaboration / Sponsorship</option>
                                <option value="Technical Support" className="bg-zinc-900">Technical Support</option>
                                <option value="Join IEEE" className="bg-zinc-900">Membership Query</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all duration-300 resize-none"
                                placeholder="Tell us about your project or inquiry..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full relative group overflow-hidden rounded-xl p-[1px]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative bg-black/80 backdrop-blur-xl rounded-[11px] px-6 py-4 flex items-center justify-center gap-3 transition-all group-hover:bg-transparent">
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span className="font-bold text-white">Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="font-bold text-white group-hover:scale-105 transition-transform">Send Message</span>
                                        <Send className="w-5 h-5 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;