import React, { useEffect, useRef } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import { PixelArrow } from './PixelArrow';

export default function Nav() {
  const setActiveTab = useNexusStore((state) => state.setActiveTab);
  const navRef = useRef(null);

  useEffect(() => {
    let lastY = 0;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (navRef.current) {
        navRef.current.style.transform = currentY > lastY && currentY > 80
          ? 'translateY(-100%)' : 'translateY(0)';
      }
      lastY = currentY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, targetId, tabToSelect) => {
    e.preventDefault();
    
    if (tabToSelect) {
      setActiveTab(tabToSelect);
    }

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerOffset = 98; // Adjusted to exact nav height
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav 
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 h-[98px] py-10 px-11 bg-bodyColor backdrop-blur-md flex items-center justify-between border-b border-border200"
    >
      <div className="w-full max-w-[2500px] mx-auto flex items-center justify-between">
        
        {/* Zamp Parallelogram Logo */}
        <a 
          href="#" 
          onClick={(e) => handleLinkClick(e, 'hero')}
          className="flex items-center gap-3 focus-ring rounded" 
          aria-label="Zamp Home"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="38" 
            height="30" 
            viewBox="0 0 49 40" 
            fill="none"
            className="text-black fill-current"
            aria-hidden="true"
          >
            <path d="M0 16.815L9.23561 0H49L39.7644 16.815H0Z" />
            <path d="M0 39.1603L9.23561 22.3438H49L39.7644 39.1603H0Z" />
          </svg>
          <span className="font-sans font-bold tracking-tight text-xl text-black">
            zamp <span className="text-zampBlue">nexus</span>
          </span>
        </a>

        {/* Navigation links with font-synthesis none and pure black overrides */}
        <div className="hidden md:flex items-center gap-8">
          <a 
            href="#how-it-works" 
            onClick={(e) => handleLinkClick(e, 'how-it-works')}
            className="nav-link-custom focus-ring rounded"
          >
            How it works
          </a>
          <a 
            href="#analyzer" 
            onClick={(e) => handleLinkClick(e, 'analyzer', 'analyze')}
            className="nav-link-custom focus-ring rounded"
          >
            Analyzer
          </a>
          <a 
            href="#analyzer" 
            onClick={(e) => handleLinkClick(e, 'analyzer', 'deadlines')}
            className="nav-link-custom focus-ring rounded"
          >
            Deadlines
          </a>
        </div>

        {/* Double Pill Buttons */}
        <div className="flex items-center gap-3">
          <a 
            href={import.meta.env.VITE_PORTFOLIO_URL || "https://rajveers-portfolio-eta.vercel.app/"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-secondary hidden sm:inline-flex"
          >
            Hire Me
          </a>
          <a 
            href="#analyzer" 
            onClick={(e) => handleLinkClick(e, 'analyzer', 'analyze')}
            className="btn-primary"
          >
            Book Demo
          </a>
        </div>

      </div>
    </nav>
  );
}
