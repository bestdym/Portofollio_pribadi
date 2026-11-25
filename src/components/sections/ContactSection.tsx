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
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 mb-2">
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-950 mb-4 tracking-tight">
            Let&apos;s Connect
          </h2>
          <p className="text-neutral-500 text-sm md:text-base">
            Have a project in mind or just want to say hi? Drop a message below.
          </p>
        </ScrollReveal>

        {/* Scroll-linked Scale (Kecil -> Besar) + Subtle 3D Pitch */}
        <ScrollZoomSection>
          <div className="bg-neutral-50/80 border border-neutral-200 shadow-[0_18px_50px_rgba(0,0,0,0.06)] rounded-3xl p-8 md:p-12">
            {status === 'success' && (
              <div className="mb-6 p-4 bg-white border border-neutral-300 text-neutral-900 rounded-xl text-center font-medium text-sm">
                Message sent successfully! I&apos;ll get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div className="mb-6 p-4 bg-neutral-100 border border-neutral-300 text-neutral-800 rounded-xl text-center font-medium text-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-neutral-800">
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
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15 focus:border-neutral-900 transition-all text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-neutral-800">
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
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15 focus:border-neutral-900 transition-all text-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-neutral-800">
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
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15 focus:border-neutral-900 transition-all resize-none text-sm"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl font-semibold tracking-wide transition-all duration-300 disabled:opacity-70 shadow-[0_10px_24px_rgba(0,0,0,0.14)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
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
