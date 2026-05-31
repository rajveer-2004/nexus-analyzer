import React from 'react';
import { Sparkles, AlertTriangle } from 'lucide-react';

export default function AIBrief({ brief, loading, error }) {
  return (
    <div 
      className="w-full text-left mt-8 relative z-10"
      role="region"
      aria-label="AI Executive Risk Assessment"
    >
      <div className="card-chat relative shadow-sm">
        
        {/* Chat Ribbon Header */}
        <div className="flex items-center justify-between mb-4 border-b border-[#D2D2D2] pb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-zampBlue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-zampBlue"></span>
            </span>
            <span className="font-mono text-xs uppercase tracking-[-0.06em] text-black font-semibold flex items-center gap-1.5">
              <Sparkles size={12} className="text-zampBlue" /> AI Risk Brief
            </span>
          </div>
          <span className="font-mono text-[11px] text-black/45 uppercase tracking-[-0.06em]">
            Powered by Gemini
          </span>
        </div>

        {/* Dynamic Loading Shimmer */}
        {loading ? (
          <div className="flex flex-col gap-4 py-4" aria-live="polite" aria-busy="true">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-zampBlue animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 rounded-full bg-zampBlue animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 rounded-full bg-zampBlue animate-bounce" />
              <span className="font-mono text-xs text-black/55 tracking-[-0.02em]">Gemini is analyzing your risk posture...</span>
            </div>
            <div className="flex flex-col gap-2.5 mt-2">
              <div className="h-4 bg-black/5 rounded w-full animate-pulse" />
              <div className="h-4 bg-black/5 rounded w-[90%] animate-pulse" />
              <div className="h-4 bg-black/5 rounded w-[75%] animate-pulse" />
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col gap-3 py-2 text-black/80">
            <div className="flex items-center gap-2 text-amber-600 font-mono text-sm">
              <AlertTriangle size={16} />
              <span>Offline Scan Fallback Loaded</span>
            </div>
            <p className="ai-brief-body" style={{ fontStyle: 'italic' }}>
              {brief}
            </p>
          </div>
        ) : (
          <div className="py-2" aria-live="polite">
            <p className="ai-brief-body">
              {brief}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
