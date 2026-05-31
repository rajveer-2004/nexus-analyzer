import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, AlertCircle, AlertTriangle, Eye, ShieldCheck } from 'lucide-react';

export default function ResultsTable({ data }) {
  const [sortField, setSortField] = useState('revenue');
  const [sortDirection, setSortDirection] = useState('desc');

  const statesList = Object.values(data);
  if (statesList.length === 0) return null;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedStates = [...statesList].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'pct') {
      aVal = Math.max(a.revPct, a.txnPct);
      bVal = Math.max(b.revPct, b.txnPct);
    }

    if (typeof aVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    } else {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
  });

  const getStatusBadge = (s) => {
    if (s.nexus) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-red-950/60 text-red-400 border border-red-800/40 px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase select-none">
          <AlertCircle size={12} /> Nexus Triggered
        </span>
      );
    }
    if (s.maxPct >= 80) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-amber-950/60 text-amber-400 border border-amber-800/40 px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase select-none">
          <AlertTriangle size={12} /> Approaching
        </span>
      );
    }
    if (s.maxPct >= 40) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-blue-950/60 text-gray550 border border-blue-800/40 px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase select-none">
          <Eye size={12} className="text-zampBlue" /> Watch
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 bg-[#FCFCFC]/10 text-white/80 border border-white/10 px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase select-none">
        <ShieldCheck size={12} /> Safe
      </span>
    );
  };

  const getProgressBarColor = (s) => {
    if (s.nexus) return 'bg-red-500';
    if (s.maxPct >= 80) return 'bg-amber-500';
    if (s.maxPct >= 40) return 'bg-zampBlue';
    return 'bg-white/30';
  };

  return (
    <div className="w-full flex flex-col items-start mt-8 relative z-10" aria-label="Analysis breakdown table">
      <div className="w-full overflow-x-auto border border-white/5 rounded-lg bg-[#0f0f24]/40 backdrop-blur-sm no-scrollbar">
        <table className="w-full border-collapse text-left text-sm" role="table">
          <thead>
            <tr className="border-b border-white/10 text-white/50 font-mono text-xs uppercase" role="row">
              <th 
                onClick={() => handleSort('state')} 
                className="py-4 px-6 font-semibold cursor-pointer hover:text-white select-none transition-colors"
                role="columnheader"
                aria-sort={sortField === 'state' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="flex items-center gap-1">State <ArrowUpDown size={12} /></div>
              </th>
              <th 
                onClick={() => handleSort('revenue')} 
                className="py-4 px-6 font-semibold cursor-pointer hover:text-white select-none transition-colors"
                role="columnheader"
                aria-sort={sortField === 'revenue' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="flex items-center gap-1">Revenue <ArrowUpDown size={12} /></div>
              </th>
              <th 
                onClick={() => handleSort('transactions')} 
                className="py-4 px-6 font-semibold cursor-pointer hover:text-white select-none transition-colors"
                role="columnheader"
                aria-sort={sortField === 'transactions' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="flex items-center gap-1">Transactions <ArrowUpDown size={12} /></div>
              </th>
              <th 
                onClick={() => handleSort('pct')} 
                className="py-4 px-6 font-semibold cursor-pointer hover:text-white select-none transition-colors"
                role="columnheader"
                aria-sort={sortField === 'pct' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="flex items-center gap-1">Threshold Exposure <ArrowUpDown size={12} /></div>
              </th>
              <th className="py-4 px-6 font-semibold text-white/50 select-none" role="columnheader">Filing Freq</th>
              <th className="py-4 px-6 font-semibold text-white/50 select-none" role="columnheader">Status</th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {sortedStates.map((s, idx) => {
              const maxVal = Math.min(s.maxPct, 100);
              return (
                <tr 
                  key={s.state}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  role="row"
                >
                  <td className="py-4 px-6 font-sans font-bold text-white text-base" role="cell">{s.state}</td>
                  <td className="py-4 px-6 font-mono text-white/80" role="cell">${s.revenue.toLocaleString()}</td>
                  <td className="py-4 px-6 font-mono text-white/80" role="cell">{s.transactions.toLocaleString()}</td>
                  <td className="py-4 px-6 max-w-[200px]" role="cell">
                    <div className="flex flex-col gap-1.5 w-full">
                      <div className="flex justify-between items-center text-xs font-mono text-white/55">
                        <span>{s.maxPct}% of threshold</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(s)}`}
                          style={{ width: `${maxVal}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-white/70" role="cell">
                    <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/80">
                      {s.frequency}
                    </span>
                  </td>
                  <td className="py-4 px-6" role="cell">{getStatusBadge(s)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
