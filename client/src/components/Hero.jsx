import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PixelArrow } from './PixelArrow';
import { useNexusStore } from '../store/useNexusStore';

function CountUp({ to, duration = 1.5, suffix = "", decimals = 0 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = parseFloat(to);
      if (isNaN(end)) return;
      
      const totalMs = duration * 1000;
      const startTime = performance.now();
      let animationFrameId;

      const updateCount = (timestamp) => {
        const elapsed = timestamp - startTime;
        if (elapsed >= totalMs) {
          setVal(end);
        } else {
          const progress = elapsed / totalMs;
          const easeProgress = progress * (2 - progress);
          const currentVal = start + (end - start) * easeProgress;
          setVal(currentVal);
          animationFrameId = requestAnimationFrame(updateCount);
        }
      };

      animationFrameId = requestAnimationFrame(updateCount);
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [inView, to, duration]);

  return <span ref={ref}>{val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{suffix}</span>;
}

export default function Hero() {
  const setActiveTab = useNexusStore((state) => state.setActiveTab);

  const headlineWords = [
    { text: "Find" }, { text: "out" }, { text: "where" }, { text: "you" }, { text: "owe" },
    { text: "sales", highlight: true }, { text: "tax", highlight: true }, { text: "—" }, 
    { text: "before" }, { text: "the" }, { text: "IRS" }, { text: "does." }
  ];

  const handleCTA = (e, tab) => {
    e.preventDefault();
    setActiveTab(tab);
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
    <section 
      id="hero" 
      className="relative bg-bodyColor overflow-hidden pt-36 pb-16"
      aria-label="Welcome Introduction"
    >
      <div className="w-full max-w-[2500px] mx-auto px-[72px] xl:px-[100px] md:px-12 px-6 relative z-10 flex flex-col items-start">
        
        {/* Frosted badge with Geist Mono, 11px uppercase, tight tracking, no pulsing dot */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 bg-[#FCFCFC]/80 border border-[#d9d9d9] px-4 py-1.5 rounded-full mb-8 font-mono text-[11px] uppercase tracking-[-0.06em] text-black backdrop-blur-md shadow-sm select-none"
        >
          <span>Free economic nexus exposure scanner</span>
        </motion.div>

        {/* Headline clamp typography, black, font-weight 400 (except "sales tax" which is semibold 600) */}
        <h1 
          className="font-sans leading-[0.95] tracking-[-0.02em] font-normal text-left mb-6 text-black select-none max-w-[1200px]"
          style={{ fontSize: 'clamp(44px, 6.6vw, 95px)' }}
        >
          {headlineWords.map((word, idx) => (
            <span 
              key={idx} 
              className={`inline-block mr-[0.18em] ${word.highlight ? 'font-semibold text-black' : 'font-normal text-black'}`}
            >
              {word.text}
            </span>
          ))}
        </h1>

        {/* Subheadline Geist Mono 16px, 50% opacity, max-width 560px */}
        <p className="font-mono text-sm leading-[22px] tracking-[-0.02em] text-black/50 max-w-[560px] mb-12 text-left">
          Paste your transaction data. We scan all 50 states against economic nexus thresholds and tell you exactly where you're exposed — and what to do next.
        </p>

        {/* CTA Double Pill Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-24">
          <a 
            href="#analyzer" 
            onClick={(e) => handleCTA(e, 'analyze')}
            className="btn-primary flex items-center justify-center gap-2 group w-full sm:w-auto"
          >
            Analyze my exposure <PixelArrow className="w-[13px] h-[11px] text-white" />
          </a>
          
          <a 
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('how-it-works');
              if (element) {
                window.scrollTo({
                  top: element.getBoundingClientRect().top + window.pageYOffset - 98,
                  behavior: 'smooth'
                });
              }
            }}
            className="btn-secondary w-full sm:w-auto text-center"
          >
            See a live demo
          </a>
        </div>

        {/* Stats Row sitting on light #EFEFEF, separated by thin 1px dividers */}
        <div className="w-full border-t border-black/10 pt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-left font-mono">
          <div className="md:border-r md:border-black/10 md:pr-8">
            <div className="font-sans font-normal text-black mb-1 select-none" style={{ fontSize: 'clamp(30px, 4vw, 60px)', letterSpacing: '-0.03em' }}>
              <CountUp to={50} suffix=" states analyzed" />
            </div>
            <p className="text-black/50 text-[13px] uppercase tracking-[-0.06em] font-mono leading-none">Full US geographic coverage</p>
          </div>
          
          <div className="md:border-r md:border-black/10 md:pr-8">
            <div className="font-sans font-normal text-black mb-1 select-none" style={{ fontSize: 'clamp(30px, 4vw, 60px)', letterSpacing: '-0.03em' }}>
              $<CountUp to={100} suffix="K Wayfair Threshold" />
            </div>
            <p className="text-black/50 text-[13px] uppercase tracking-[-0.06em] font-mono leading-none">Economic nexus baseline rule</p>
          </div>
          
          <div>
            <div className="font-sans font-normal text-black mb-1 select-none" style={{ fontSize: 'clamp(30px, 4vw, 60px)', letterSpacing: '-0.03em' }}>
              <CountUp to={97.8} suffix="%" decimals={1} />
            </div>
            <p className="text-black/50 text-[13px] uppercase tracking-[-0.06em] font-mono leading-none">Zamp client retention rate</p>
          </div>
        </div>

      </div>
    </section>
  );
}
