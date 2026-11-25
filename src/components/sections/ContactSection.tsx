import React, { useState } from 'react';
import { submitContactMessage } from '../../services/contactService';
import {
  ScrollReveal,
  ScrollZoomSection,
  ParallaxSectionBackdrop,
} from '../motion/ScrollMotion';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    try {
      setStatus('loading');
      await submitContactMessage(formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Terjadi kesalahan.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <ParallaxSectionBackdrop label="CONNECT" direction="right" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <ScrollReveal variant="scale" className="text-center mb-12">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8C6239] mb-2">
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-4 tracking-tight">
            Let&apos;s Connect
          </h2>
          <p className="text-[#57534E] text-sm md:text-base">
            Have a project in mind or just want to say hi? Drop a message below.
          </p>
        </ScrollReveal>

        {/* Scroll-linked Scale (Kecil -> Besar) + Subtle 3D Pitch */}
        <ScrollZoomSection>
          <div className="bg-[#FFFDF9] border border-[#E7E1D8] shadow-[0_18px_50px_rgba(28,25,23,0.07)] rounded-3xl p-8 md:p-12">
            {status === 'success' && (
              <div className="mb-6 p-4 bg-[#F6F3EE] border border-[#D6C7B2] text-[#1C1917] rounded-xl text-center font-medium text-sm">
                Message sent successfully! I&apos;ll get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center font-medium text-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-[#292524]">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 rounded-xl border border-[#E7E1D8] bg-[#F6F3EE]/60 text-[#1C1917] placeholder:text-[#A8A29E] focus:bg-[#FFFDF9] focus:outline-none focus:ring-2 focus:ring-[#8C6239]/25 focus:border-[#8C6239] transition-all text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-[#292524]">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 rounded-xl border border-[#E7E1D8] bg-[#F6F3EE]/60 text-[#1C1917] placeholder:text-[#A8A29E] focus:bg-[#FFFDF9] focus:outline-none focus:ring-2 focus:ring-[#8C6239]/25 focus:border-[#8C6239] transition-all text-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-[#292524]">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={status === 'loading'}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-[#E7E1D8] bg-[#F6F3EE]/60 text-[#1C1917] placeholder:text-[#A8A29E] focus:bg-[#FFFDF9] focus:outline-none focus:ring-2 focus:ring-[#8C6239]/25 focus:border-[#8C6239] transition-all resize-none text-sm"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-[#1C1917] hover:bg-[#8C6239] text-[#FFFDF9] rounded-xl font-semibold tracking-wide transition-all duration-300 disabled:opacity-70 shadow-[0_10px_24px_rgba(28,25,23,0.14)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </ScrollZoomSection>
      </div>
    </section>
  );
}
