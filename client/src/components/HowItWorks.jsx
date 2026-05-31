import React from 'react';
import { FileUp, Search, CalendarClock } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <FileUp className="w-7 h-7 text-black" />,
      title: "Upload your data",
      description: "Drag-and-drop a CSV export or paste transaction fields directly into the editor. We recognize 'state', 'revenue', and 'transactions' instantly."
    },
    {
      number: "02",
      icon: <Search className="w-7 h-7 text-black" />,
      title: "Instant nexus scan",
      description: "Our compliance engine scans all 50 states against individual economic thresholds. We calculate exact percentages in real time."
    },
    {
      number: "03",
      icon: <CalendarClock className="w-7 h-7 text-black" />,
      title: "Get your action plan",
      description: "Instantly pinpoint states requiring immediate registration, review approaching risks, and download a customized roadmap."
    }
  ];

  return (
    <section 
      id="how-it-works" 
      className="bg-creamNeutral text-black py-24 px-[72px] xl:px-[100px] md:px-12 px-6 border-y border-border200"
      aria-label="Process Outline"
    >
      <div className="w-full max-w-[2500px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16 max-w-[700px] text-left">
          <span className="font-mono text-[11px] uppercase tracking-[-0.06em] text-black/50 mb-3 font-semibold">
            THE PROCESS
          </span>
          <h2 
            className="font-sans leading-[0.9] tracking-[-0.03em] font-normal text-black"
            style={{ fontSize: 'clamp(30px, 4.2vw, 60px)' }}
          >
            Three steps from data to compliance
          </h2>
        </div>

        {/* Bento Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="card-bento p-8 flex flex-col items-start text-left relative transition-all duration-200 hover:border-black/35 hover:-translate-y-1 shadow-sm"
            >
              {/* Card Header row */}
              <div className="w-full flex items-center justify-between mb-8">
                <span className="font-mono text-sm font-bold bg-black text-[#F5F5F5] rounded px-3 py-1 select-none">
                  {step.number}
                </span>
                <div className="p-3 bg-[#E4E4E4] rounded-lg border border-[#cbcbcb]/40">
                  {step.icon}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-sans text-[23px] sm:text-[25px] font-semibold text-black/80 tracking-[-0.025em] mb-4">
                {step.title}
              </h3>
              <p className="font-mono text-sm leading-[22px] tracking-[-0.02em] text-[#302F37]/80">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
