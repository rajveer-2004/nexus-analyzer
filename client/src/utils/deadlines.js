export const FILING_FREQUENCY = {
  California: 'Monthly', Texas: 'Monthly', 'New York': 'Monthly',
  Florida: 'Monthly', Washington: 'Monthly', Illinois: 'Monthly',
  Pennsylvania: 'Monthly', Ohio: 'Quarterly', Georgia: 'Quarterly',
  Colorado: 'Monthly', Nevada: 'Quarterly', Arizona: 'Quarterly',
  Massachusetts: 'Monthly', Michigan: 'Monthly', 'New Jersey': 'Monthly',
  Virginia: 'Monthly', 'North Carolina': 'Quarterly', Minnesota: 'Quarterly',
  Tennessee: 'Quarterly', Oregon: 'Quarterly',
  _default: 'Quarterly'
};

/**
 * Formats a Date object as YYYY-MM-DD.
 * @param {Date} date 
 * @returns {string}
 */
export function formatISODate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Formats a Date object as human-readable "MMM DD, YYYY" (e.g., "Jun 30, 2026").
 * @param {Date} date 
 * @returns {string}
 */
export function formatHumanDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Computes registration and first filing deadlines based on filing frequency.
 * @param {string} stateName - Name of the US state
 * @param {Date} [today] - Baseline date, default is new Date()
 * @returns {{ frequency: string, registerByISO: string, registerByHuman: string, firstFilingISO: string, firstFilingHuman: string }}
 */
export function calculateDeadlines(stateName, today = new Date()) {
  const frequency = FILING_FREQUENCY[stateName] || FILING_FREQUENCY._default;
  
  const registerDate = new Date(today);
  const filingDate = new Date(today);
  
  if (frequency === 'Monthly') {
    // Monthly filers: register within 30 days, first filing ~60 days out
    registerDate.setDate(today.getDate() + 30);
    filingDate.setDate(today.getDate() + 60);
  } else {
    // Quarterly filers: register within 45 days, first filing ~90 days out
    registerDate.setDate(today.getDate() + 45);
    filingDate.setDate(today.getDate() + 90);
  }
  
  return {
    frequency,
    registerByISO: formatISODate(registerDate),
    registerByHuman: formatHumanDate(registerDate),
    firstFilingISO: formatISODate(filingDate),
    firstFilingHuman: formatHumanDate(filingDate)
  };
}
