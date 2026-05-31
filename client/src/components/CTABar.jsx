import React from 'react';
import { PixelArrow } from './PixelArrow';

export default function CTABar() {
  return (
    <section 
      id="cta-bar" 
      className="bg-bodyColor border-y border-border200 py-16 px-[72px] xl:px-[100px] md:px-12 px-6"
      aria-label="Compliance Call to Action"
    >
      <div className="w-full max-w-[2500px] mx-auto bg-[#171717] border-l-4 border-zampBlue p-8 md:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 rounded-r-lg shadow-2xl relative overflow-hidden text-left">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 left-0 w-24 h-full bg-zampBlue/5 blur-xl pointer-events-none" />

        {/* Text columns: H3 specifications */}
        <div className="flex flex-col items-start max-w-[700px] relative z-10">
          <h3 className="font-sans text-[25px] font-normal leading-[28px] tracking-[-1px] text-white/95 mb-4">
            Ready to get compliant? Zamp handles everything.
          </h3>
          <p className="font-mono text-sm leading-[22px] tracking-[-0.02em] text-white/60">
            Registration &middot; calculations &middot; filings &middot; notices — all managed for you. <span className="text-white font-semibold">If we get it wrong, we cover the penalty.</span>
          </p>
        </div>

        {/* Action Button Row */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10 shrink-0">
          <a 
            href="https://www.zamp.ai/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-blue flex items-center justify-center gap-2 group w-full sm:w-auto"
          >
            Talk to Zamp <PixelArrow className="w-[13px] h-[11px] text-white transition-transform group-hover:translate-x-1" />
          </a>
          
          <a 
            href="https://www.zamp.ai/product" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-secondary w-full sm:w-auto text-center"
          >
            Learn more
          </a>
        </div>

      </div>
    </section>
  );
}
