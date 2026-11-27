import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { siteProfile } from '../config/siteProfile';

function GitHubSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0.297C5.37 0.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function WhatsAppSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.031 2C6.508 2 2.02 6.487 2.02 12.01c0 1.763.461 3.485 1.337 5.002L2 22l5.125-1.344a9.975 9.975 0 0 0 4.906 1.284h.004c5.522 0 10.01-4.487 10.01-10.01 0-2.674-1.041-5.188-2.931-7.079A9.946 9.946 0 0 0 12.031 2Zm5.822 14.236c-.246.693-1.434 1.325-1.984 1.406-.508.076-1.15.107-1.856-.117-.428-.136-.978-.318-1.683-.622-2.962-1.279-4.896-4.265-5.044-4.462-.147-.197-1.203-1.602-1.203-3.056 0-1.454.763-2.169 1.033-2.464.271-.295.591-.369.788-.369.197 0 .394.002.566.01.182.009.426-.069.666.509.246.591.837 2.044.911 2.192.074.148.123.32.025.517-.099.197-.148.32-.295.492-.148.172-.311.385-.443.517-.148.147-.302.307-.13.603.173.295.768 1.267 1.649 2.052 1.133 1.01 2.088 1.324 2.383 1.471.295.148.468.123.64-.074.172-.197.739-.862.936-1.157.197-.295.394-.246.665-.148.271.099 1.724.813 2.019.961.295.148.492.222.566.345.074.123.074.714-.172 1.407Z" />
    </svg>
  );
}

function InstagramSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
    </svg>
  );
}

const SOCIAL_ITEMS = [
  {
    key: 'github',
    ...siteProfile.socials.github,
    icon: GitHubSvg,
    external: true,
  },
  {
    key: 'whatsapp',
    ...siteProfile.socials.whatsapp,
    icon: WhatsAppSvg,
    external: true,
  },
  {
    key: 'email',
    ...siteProfile.socials.email,
    icon: Mail,
    external: false,
  },
  {
    key: 'instagram',
    ...siteProfile.socials.instagram,
    icon: InstagramSvg,
    external: true,
  },
];

export function SocialLinksBar({
  variant = 'hero',
}: {
  variant?: 'hero' | 'cards' | 'footer';
}) {
  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {SOCIAL_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.key}
              href={item.url}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className="group flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50/80 hover:bg-white border border-neutral-200 hover:border-neutral-400 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.07)] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-neutral-950 border border-neutral-200 group-hover:border-neutral-950 text-neutral-700 group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-300">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  {item.label}
                </p>
                <p className="text-xs font-semibold text-neutral-900 truncate">
                  {item.handle}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="flex items-center gap-2">
        {SOCIAL_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.key}
              href={item.url}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              title={`${item.label}: ${item.handle}`}
              aria-label={item.label}
              className="w-8 h-8 rounded-full border border-neutral-200 bg-neutral-50 hover:bg-neutral-950 hover:border-neutral-950 text-neutral-500 hover:text-white flex items-center justify-center transition-all duration-200"
            >
              <Icon className="w-3.5 h-3.5" />
            </a>
          );
        })}
      </div>
    );
  }

  // Default: 'hero' — crisp frosted glass icon pills
  return (
    <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
      {SOCIAL_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <motion.a
            key={item.key}
            href={item.url}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            title={`${item.label}: ${item.handle}`}
            aria-label={item.label}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/75 hover:bg-neutral-950 backdrop-blur-md border border-neutral-200/90 hover:border-neutral-950 shadow-[0_4px_14px_rgba(0,0,0,0.04)] text-neutral-600 hover:text-white text-xs font-medium transition-colors duration-250"
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </motion.a>
        );
      })}
    </div>
  );
}
