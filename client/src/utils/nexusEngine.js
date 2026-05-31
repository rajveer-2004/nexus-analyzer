// Default thresholds (South Dakota v. Wayfair standard)
export const DEFAULT_THRESHOLDS = { revenue: 100000, transactions: 200 };

export function analyzeState(row, thresholds = DEFAULT_THRESHOLDS) {
  const revenue = Number(row.revenue) || 0;
  const transactions = Number(row.transactions) || 0;
  
  const nexus = revenue >= thresholds.revenue || transactions >= thresholds.transactions;
  const revPct = Math.round((revenue / thresholds.revenue) * 100);
  const txnPct = Math.round((transactions / thresholds.transactions) * 100);
  const maxPct = Math.max(revPct, txnPct);
  
  let risk = 'low';
  if (nexus) {
    risk = 'high';
  } else if (maxPct >= 80) {
    risk = 'high'; // "Approaching" has high risk exposure
  } else if (maxPct >= 40) {
    risk = 'medium'; // "Watch" has medium risk exposure
  }
  
  return { 
    nexus, 
    risk, 
    revPct, 
    txnPct, 
    maxPct,
    revenue,
    transactions
  };
}
