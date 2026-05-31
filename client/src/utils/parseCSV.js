import Papa from 'papaparse';

export function parseTransactionCSV(input) {
  return new Promise((resolve, reject) => {
    if (input instanceof File && input.size > 5 * 1024 * 1024) {
      reject(new Error("That CSV is too large. Keep it under 5MB, please."));
      return;
    }

    Papa.parse(input, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          const firstErr = results.errors[0];
          const errorRow = firstErr.row !== undefined ? firstErr.row + 2 : 'unknown';
          reject(new Error(`CSV parsing error at Row ${errorRow}: ${firstErr.message}`));
          return;
        }

        const rawRows = results.data;
        if (!rawRows || rawRows.length === 0) {
          reject(new Error("We couldn't find any data rows in this CSV."));
          return;
        }

        const headers = Object.keys(rawRows[0]);
        let stateKey = null;
        let revenueKey = null;
        let transactionsKey = null;

        for (const header of headers) {
          const hLower = header.toLowerCase().trim();
          if (!stateKey && (hLower.includes('state') || hLower === 'st' || hLower.includes('region'))) {
            stateKey = header;
          }
          if (!revenueKey && (hLower.includes('rev') || hLower.includes('sale') || hLower.includes('amount') || hLower.includes('gmv'))) {
            revenueKey = header;
          }
          if (!transactionsKey && (hLower.includes('trans') || hLower.includes('order') || hLower.includes('count') || hLower.includes('txn'))) {
            transactionsKey = header;
          }
        }

        if (!stateKey) {
          reject(new Error("Couldn't detect a State column. Make sure your header has 'state', 'st', or 'region'."));
          return;
        }
        if (!revenueKey) {
          reject(new Error("Couldn't detect a Revenue column. Make sure your header has 'revenue', 'sales', 'amount', or 'gmv'."));
          return;
        }
        if (!transactionsKey) {
          reject(new Error("Couldn't detect a Transactions column. Make sure your header has 'transactions', 'orders', 'count', or 'txn'."));
          return;
        }

        const parsedRows = [];
        for (let i = 0; i < rawRows.length; i++) {
          const row = rawRows[i];
          const stateVal = row[stateKey];
          const revVal = row[revenueKey];
          const txnVal = row[transactionsKey];

          if (stateVal === undefined || stateVal === null || String(stateVal).trim() === '') {
            continue;
          }

          let revenue = 0;
          if (typeof revVal === 'number') {
            revenue = revVal;
          } else if (revVal !== undefined && revVal !== null) {
            revenue = parseFloat(String(revVal).replace(/[^0-9.-]+/g, ''));
          }

          let transactions = 0;
          if (typeof txnVal === 'number') {
            transactions = txnVal;
          } else if (txnVal !== undefined && txnVal !== null) {
            transactions = parseInt(String(txnVal).replace(/[^0-9]+/g, ''), 10);
          }

          if (isNaN(revenue)) {
            reject(new Error(`Invalid revenue amount at Row ${i + 2}: "${revVal}"`));
            return;
          }
          if (isNaN(transactions)) {
            reject(new Error(`Invalid transaction count at Row ${i + 2}: "${txnVal}"`));
            return;
          }

          parsedRows.push({
            state: String(stateVal).trim(),
            revenue,
            transactions
          });
        }

        if (parsedRows.length === 0) {
          reject(new Error("We couldn't parse any valid data from your CSV. Check your formatting."));
          return;
        }

        resolve(parsedRows);
      },
      error: (error) => {
        reject(new Error(`CSV Parsing failed: ${error.message}`));
      }
    });
  });
}
