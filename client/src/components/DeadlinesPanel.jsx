import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, Calendar, DollarSign, ListOrdered, ArrowRight } from 'lucide-react';
import { useNexusStore } from '../store/useNexusStore';

export default function DeadlinesPanel({ data }) {
  const thresholds = useNexusStore((state) => state.thresholds);
  const statesList = Object.values(data);

  if (statesList.length === 0) return null;

  // Immediate Action: Nexus is triggered
  const immediateStates = statesList
    .filter(s => s.nexus)
    .sort((a, b) => b.revenue - a.revenue);

  // Monitor Closely: Nexus not triggered, but maxPct >= 80% (approaching)
  const monitorStates = statesList
    .filter(s => !s.nexus && s.maxPct >= 80)
    .sort((a, b) => b.maxPct - a.maxPct);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        damping: 18, 
        stiffness: 100 
      } 
    }
  };

  return (
    <div className="w-full text-left relative z-10" aria-label="Filing deadlines and roadmap panel">
      
      {/* 1. Immediate Action Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
          <div className="w-6 h-6 rounded-full bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-500">
            <AlertCircle size={14} />
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white">
            Immediate Action <span className="text-red-400">({immediateStates.length})</span>
          </h3>
        </div>

        {immediateStates.length === 0 ? (
          <div className="p-8 border border-white/5 bg-white/[0.01] rounded-lg text-center text-white/40 font-mono text-sm">
            No states require immediate action. All transaction volumes are currently below economic thresholds.
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {immediateStates.map((s) => (
              <motion.div 
                key={s.state}
                variants={cardVariants}
                className="bg-darkPill border-l-[3px] border-l-red-500 border-y border-r border-white/5 p-6 rounded-r-lg relative overflow-hidden flex flex-col justify-between hover:border-white/10 transition-colors shadow-lg"
              >
                {/* Glow Accent */}
                <div className="absolute top-0 left-0 w-8 h-full bg-red-500/5 blur-md pointer-events-none" />

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-display text-xl font-bold text-white">{s.state}</h4>
                    <span className="bg-red-950/50 border border-red-900/30 text-red-400 text-xs font-mono px-2 py-0.5 rounded">
                      {s.frequency}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5 font-mono text-xs text-white/60 mb-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                      <span>Total Revenue</span>
                      <span className="text-white">${s.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                      <span>Transactions</span>
                      <span className="text-white">{s.transactions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Date Milestones */}
                <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded flex flex-col gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 flex items-center gap-1.5">
                      <Calendar size={12} className="text-red-400" /> Register By
                    </span>
                    <span className="font-mono text-white font-semibold">{s.registerByHuman}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 flex items-center gap-1.5">
                      <Calendar size={12} className="text-red-400" /> First Filing
                    </span>
                    <span className="font-mono text-white font-semibold">{s.firstFilingHuman}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* 2. Monitor Closely Section */}
      <div>
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
          <div className="w-6 h-6 rounded-full bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Eye size={14} />
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white">
            Monitor Closely <span className="text-amber-400">({monitorStates.length})</span>
          </h3>
        </div>

        {monitorStates.length === 0 ? (
          <div className="p-8 border border-white/5 bg-white/[0.01] rounded-lg text-center text-white/40 font-mono text-sm">
            No states currently require close monitoring. All other states are well below thresholds.
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {monitorStates.map((s) => {
              const revGap = Math.max(0, thresholds.revenue - s.revenue);
              const txnGap = Math.max(0, thresholds.transactions - s.transactions);
              
              return (
                <motion.div 
                  key={s.state}
                  variants={cardVariants}
                  className="bg-darkPill border-l-[3px] border-l-amber-500 border-y border-r border-white/5 p-6 rounded-r-lg relative overflow-hidden flex flex-col justify-between hover:border-white/10 transition-colors shadow-lg"
                >
                  {/* Glow Accent */}
                  <div className="absolute top-0 left-0 w-8 h-full bg-amber-500/5 blur-md pointer-events-none" />

                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-display text-xl font-bold text-white">{s.state}</h4>
                      <span className="bg-amber-950/50 border border-amber-900/30 text-amber-400 text-xs font-mono px-2 py-0.5 rounded">
                        {s.maxPct}% exposed
                      </span>
                    </div>

                    <div className="flex flex-col gap-2.5 font-mono text-xs text-white/60 mb-6">
                      <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                        <span>Current Revenue</span>
                        <span className="text-white">${s.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                        <span>Current Transactions</span>
                        <span className="text-white">{s.transactions.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Remaining gaps to trigger nexus */}
                  <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded flex flex-col gap-2 text-xs">
                    <div className="text-[10px] text-white/30 uppercase font-mono tracking-wider mb-0.5">Remaining Gap to Nexus</div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 flex items-center gap-1.5">
                        <DollarSign size={12} className="text-amber-400" /> Revenue Gap
                      </span>
                      <span className="font-mono text-white font-semibold">${revGap.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 flex items-center gap-1.5">
                        <ListOrdered size={12} className="text-amber-400" /> Transaction Gap
                      </span>
                      <span className="font-mono text-white font-semibold">{txnGap.toLocaleString()} txn</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

    </div>
  );
}
