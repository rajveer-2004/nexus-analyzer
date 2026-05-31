import { formatISODate } from './deadlines';

/**
 * Exports the analyzed nexus data to a download-friendly CSV file.
 * @param {Array<Object>} statesData - The list of fully evaluated state metrics
 */
export function exportNexusAnalysis(statesData) {
  const headers = [
    'State',
    'Revenue ($)',
    'Transactions',
    'Rev % of Threshold',
    'Txn % of Threshold',
    'Nexus Triggered',
    'Risk Level',
    'Filing Frequency',
    'Register By',
    'First Filing Date'
  ];

  const csvRows = [headers.join(',')];

  for (const row of statesData) {
    const fields = [
      `"${row.state}"`,
      row.revenue,
      row.transactions,
      `"${row.revPct}%"`,
      `"${row.txnPct}%"`,
      row.nexus ? 'TRUE' : 'FALSE',
      `"${row.risk.toUpperCase()}"`,
      `"${row.frequency}"`,
      `"${row.registerByISO}"`,
      `"${row.firstFilingISO}"`
    ];
    csvRows.push(fields.join(','));
  }

  const csvContent = '\uFEFF' + csvRows.join('\n'); // Add UTF-8 BOM for proper Excel rendering
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const today = formatISODate(new Date());
  const filename = `nexus-analysis-${today}.csv`;
  
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
