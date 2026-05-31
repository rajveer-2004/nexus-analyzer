import { create } from 'zustand';
import { analyzeState, DEFAULT_THRESHOLDS } from '../utils/nexusEngine';
import { calculateDeadlines } from '../utils/deadlines';
import { exportNexusAnalysis } from '../utils/exportCSV';



export const useNexusStore = create((set, get) => ({
  rawRows: [],           // Parsed CSV rows { state, revenue, transactions }
  analysisData: {},      // Keyed by state name: { state, revenue, transactions, nexus, risk, revPct, txnPct, maxPct, frequency, registerByISO, registerByHuman, firstFilingISO, firstFilingHuman }
  thresholds: { ...DEFAULT_THRESHOLDS },
  isAnalyzing: false,
  aiBrief: null,         // String | null
  aiBriefLoading: false,
  aiBriefError: null,    // String | null
  activeTab: 'analyze',  // 'analyze' | 'map' | 'deadlines'
  hasRunAnalysis: false, // Checks if user has successfully submitted analysis

  setRawRows: (rows) => set({ rawRows: rows }),

  runAnalysis: () => {
    const { rawRows, thresholds } = get();
    if (rawRows.length === 0) return;

    set({ isAnalyzing: true });

    const analyzed = {};
    for (const row of rawRows) {
      const stats = analyzeState(row, thresholds);
      const dates = calculateDeadlines(row.state);
      
      analyzed[row.state] = {
        state: row.state,
        ...stats,
        ...dates
      };
    }

    set({ 
      analysisData: analyzed, 
      isAnalyzing: false,
      hasRunAnalysis: true
    });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setAIBrief: (text) => set({ aiBrief: text }),

  fetchAIBrief: async () => {
    const { analysisData } = get();
    const statesArray = Object.values(analysisData);
    if (statesArray.length === 0) return;

    set({ aiBriefLoading: true, aiBrief: null, aiBriefError: null });

    // Calculate Summary parameters
    let totalRevenue = 0;
    let nexusCount = 0;
    let approachingCount = 0;
    const nexusStates = [];
    const approachingStates = [];

    const formattedStates = statesArray.map(s => {
      totalRevenue += s.revenue;
      if (s.nexus) {
        nexusCount++;
        nexusStates.push(s.state);
      } else if (s.maxPct >= 80) {
        approachingCount++;
        approachingStates.push(s.state);
      }

      return {
        state: s.state,
        revenue: s.revenue,
        transactions: s.transactions,
        nexus: s.nexus,
        revPct: s.revPct,
        risk: s.risk
      };
    });

    const payload = {
      states: formattedStates,
      summary: {
        totalRevenue,
        nexusCount,
        approachingCount,
        nexusStates,
        approachingStates
      }
    };

    try {
      const response = await fetch('/api/brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a minute before trying again.");
        }
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      set({ aiBrief: data.brief, aiBriefLoading: false });
    } catch (error) {
      console.error("AI Risk Brief fetch failed:", error);
      set({ 
        aiBriefError: error.message || "Failed to generate AI brief.", 
        aiBriefLoading: false,
        // Fallback offline assessment
        aiBrief: `Your analysis shows immediate compliance risk. You have triggered tax nexus in ${nexusCount} state${nexusCount !== 1 ? 's' : ''} (including ${nexusStates.slice(0, 3).join(', ')}${nexusStates.length > 3 ? ' and others' : ''}), and are approaching nexus thresholds in ${approachingCount} state${approachingCount !== 1 ? 's' : ''} (including ${approachingStates.slice(0, 3).join(', ')}${approachingStates.length > 3 ? ' and others' : ''}). Zamp highly recommends scheduling a demo to review these states and establish proper registration and automation.`
      });
    }
  },

  exportCSV: () => {
    const { analysisData } = get();
    const statesArray = Object.values(analysisData);
    if (statesArray.length === 0) return;
    exportNexusAnalysis(statesArray);
  },

  reset: () => set({
    rawRows: [],
    analysisData: {},
    isAnalyzing: false,
    aiBrief: null,
    aiBriefLoading: false,
    aiBriefError: null,
    hasRunAnalysis: false
  })
}));
