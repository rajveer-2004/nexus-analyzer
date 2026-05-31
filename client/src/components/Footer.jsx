import React from 'react';
import { PixelArrow } from './PixelArrow';

export default function Footer() {
  const columns = [
    {
      title: "Find us",
      links: [
        { label: "LinkedIn", href: "https://www.linkedin.com/company/zamp-ai" },
        { label: "Twitter", href: "https://twitter.com/zamp_ai" },
        { label: "YouTube", href: "https://www.youtube.com/" },
        { label: "Spotify", href: "https://www.spotify.com/" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Security", href: "https://www.zamp.ai/security" },
        { label: "Blog", href: "https://www.zamp.ai/blog" },
        { label: "Terms", href: "https://www.zamp.ai/terms" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "Manifesto", href: "https://www.zamp.ai/manifesto" },
        { label: "Investors", href: "https://www.zamp.ai/investors" },
        { label: "Careers", href: "https://www.zamp.ai/careers" }
      ]
    }
  ];

  const handleScrollToAnalyzer = (e) => {
    e.preventDefault();
    const analyzerElement = document.getElementById('analyzer');
    if (analyzerElement) {
      const headerOffset = 98;
      const elementPosition = analyzerElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer 
      style={{
        background: '#005eff',
        padding: '60px 72px 0 72px',
        color: '#ffffff',
        fontFamily: '"Geist Mono", monospace',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 10,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}
      role="contentinfo"
      aria-label="Footer"
    >
      {/* Top row containing columns */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: '100%',
          flexWrap: 'wrap',
          gap: '40px'
        }}
      >
        {/* Column 1: Z logo mark, tagline, book demo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', maxWidth: '450px' }}>
          {/* Z logo mark (white fill) */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="49" 
            height="40" 
            viewBox="0 0 49 40" 
            fill="none"
            className="text-white fill-current mb-8"
            style={{ marginBottom: '32px' }}
            aria-hidden="true"
          >
            <path d="M0 16.815L9.23561 0H49L39.7644 16.815H0Z" />
            <path d="M0 39.1603L9.23561 22.3438H49L39.7644 39.1603H0Z" />
          </svg>

          {/* Tagline: Geist Mono, 21px, uppercase */}
          <p className="font-mono text-[21px] font-medium uppercase tracking-[-0.06em] text-white leading-tight mb-8" style={{ marginBottom: '32px' }}>
            Velocity is Survival
          </p>

          {/* Book Demo link with dither arrow */}
          <a 
            href="#analyzer" 
            onClick={handleScrollToAnalyzer}
            className="footer-link inline-flex items-center gap-2 tracking-tight group hover:opacity-90"
          >
            BOOK DEMO <PixelArrow className="w-[13px] h-[11px] text-white transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Columns 2, 3, 4: FIND US, RESOURCES, COMPANY */}
        <div style={{ display: 'flex', gap: '80px', flexWrap: 'wrap' }}>
          {columns.map((col, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', width: '160px' }}>
              <h4 className="font-mono text-[21px] font-medium uppercase tracking-[-0.06em] text-white mb-6" style={{ marginBottom: '24px' }}>
                {col.title}
              </h4>
              
              <ul className="flex flex-col gap-4 font-sans text-base text-white/90" style={{ display: 'flex', flexDirection: 'column', gap: '16px', listStyle: 'none', padding: 0, margin: 0 }}>
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a 
                      href={link.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 hover:underline transition-all duration-100"
                      style={{ color: '#ffffff', textDecoration: 'none' }}
                    >
                      {link.label} 
                      <PixelArrow className="w-[13px] h-[11px] text-white/40 group-hover:text-white transition-opacity opacity-0 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wordmark + copyright block */}
      <div 
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: '64px',
          paddingTop: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          width: '100%'
        }}
      >
        {/* Copyright bar above the massive wordmark */}
        <div 
          className="font-mono text-xs text-white/50"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            width: '100%',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '12px'
          }}
        >
          <span>&copy; {new Date().getFullYear()} Zamp &middot; All Rights Reserved.</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="https://www.zamp.ai/privacy" style={{ color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }} className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="https://www.zamp.ai/terms" style={{ color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }} className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

        {/* Massive Wordmark Logo - sits snug at the absolute bottom of page container */}
        <span 
          className="font-sans font-semibold tracking-[-0.04em] text-white leading-[0.75] select-none block overflow-hidden mt-6 mb-[-0.15em]"
          style={{ 
            fontSize: 'clamp(80px, 15vw, 240px)', 
            display: 'block', 
            marginTop: '24px', 
            marginBottom: '-0.15em', 
            lineHeight: 0.75, 
            overflow: 'hidden' 
          }}
        >zamp</span>
      </div>
    </footer>
  );
}
