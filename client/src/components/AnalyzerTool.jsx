import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { useNexusStore } from '../store/useNexusStore';
import { parseTransactionCSV } from '../utils/parseCSV';
import ResultsTable from './ResultsTable';
import NexusMap from './NexusMap';
import DeadlinesPanel from './DeadlinesPanel';
import AIBrief from './AIBrief';
import { PixelArrow } from './PixelArrow';
import { 
  Upload, 
  RotateCcw, 
  Download, 
  AlertCircle, 
  AlertTriangle, 
  FileSpreadsheet, 
  Coins 
} from 'lucide-react';

const SAMPLE_CSV = `state,revenue,transactions
California,142000,310
Texas,98000,195
New York,67000,140
Florida,54000,88
Washington,112000,220
Illinois,45000,75
Pennsylvania,88000,178
Ohio,31000,55
Georgia,19000,38
Colorado,104000,205
Nevada,9000,14
Arizona,72000,150
Massachusetts,56000,99
Michigan,23000,42
New Jersey,38000,70
Virginia,15000,27
North Carolina,8000,16
Minnesota,44000,85
Tennessee,12000,22
Oregon,61000,130`;

export default function AnalyzerTool() {
  const store = useNexusStore();
  
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleParse = async (inputData) => {
    try {
      setLocalError(null);
      const parsedRows = await parseTransactionCSV(inputData);
      
      store.setRawRows(parsedRows);
      store.runAnalysis();
      store.fetchAIBrief();
    } catch (err) {
      console.error(err);
      setLocalError(err.message || "Failed to parse CSV. Please check formatting.");
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      handleParse(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1
  });

  const handlePasteSubmit = (e) => {
    e.preventDefault();
    if (!pasteText.trim()) {
      setLocalError("Please paste some transaction records first.");
      return;
    }
    handleParse(pasteText);
  };

  const loadSampleData = () => {
    setPasteText(SAMPLE_CSV);
    handleParse(SAMPLE_CSV);
  };

  const handleReset = () => {
    store.reset();
    setPasteText('');
    setLocalError(null);
  };

  const statesArray = Object.values(store.analysisData);
  const totalStates = statesArray.length;
  
  const nexusTriggeredCount = statesArray.filter(s => s.nexus).length;
  const approachingCount = statesArray.filter(s => !s.nexus && s.maxPct >= 80).length;
  const totalRevenueExposed = statesArray
    .filter(s => s.nexus)
    .reduce((sum, s) => sum + s.revenue, 0);

  const tabs = [
    { id: 'analyze', label: 'Analyze' },
    { id: 'map', label: 'Map view' },
    { id: 'deadlines', label: 'Filing deadlines' }
  ];

  return (
    <section 
      id="analyzer" 
      className="dark-section text-white py-24 px-[72px] xl:px-[100px] md:px-12 px-6 border-b border-white/5 relative"
      aria-label="Economic Analyzer Workspace"
    >
      <div className="w-full max-w-[2500px] mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-start mb-16 max-w-[700px] text-left">
          <span className="font-mono text-[11px] uppercase tracking-[-0.06em] text-zampBlue mb-3 font-semibold">
            COMPLIANCE SCANNER
          </span>
          <h2 
            className="font-sans leading-[0.9] tracking-[-0.03em] font-normal text-white"
            style={{ fontSize: 'clamp(30px, 4.2vw, 60px)' }}
          >
            Your exposure, in seconds
          </h2>
        </div>

        {/* Tab selector bar */}
        <div className="border-b border-white/10 mb-8 flex justify-start items-center">
          <div 
            className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth" 
            role="tablist"
            aria-label="Scan Nav Options"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => store.setActiveTab(tab.id)}
                role="tab"
                aria-selected={store.activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                tabIndex={store.activeTab === tab.id ? 0 : -1}
                className={`py-3 px-1 font-mono text-[11px] uppercase tracking-[-0.06em] transition-all duration-150 border-b-2 relative focus-ring select-none whitespace-nowrap ${
                  store.activeTab === tab.id 
                    ? 'border-zampBlue text-zampBlue font-bold' 
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Panels */}
        <div className="w-full">
          
          {/* TAB 1: ANALYZE */}
          <div 
            id="tabpanel-analyze"
            role="tabpanel"
            aria-labelledby="tab-btn-analyze"
            hidden={store.activeTab !== 'analyze'}
          >
            {!store.hasRunAnalysis ? (
              <div className="w-full max-w-[850px] mx-auto text-center flex flex-col items-center">
                
                {/* Upload vs Paste select */}
                <div className="flex gap-4 mb-8 font-mono text-xs">
                  <button 
                    onClick={() => setPasteMode(false)}
                    className={`px-4 py-2 border rounded transition-all duration-150 ${
                      !pasteMode 
                        ? 'border-zampBlue text-zampBlue bg-zampBlue/5' 
                        : 'border-white/10 text-white/40 hover:text-white'
                    }`}
                  >
                    CSV File Upload
                  </button>
                  <button 
                    onClick={() => setPasteMode(true)}
                    className={`px-4 py-2 border rounded transition-all duration-150 ${
                      pasteMode 
                        ? 'border-zampBlue text-zampBlue bg-zampBlue/5' 
                        : 'border-white/10 text-white/40 hover:text-white'
                    }`}
                  >
                    Paste Text Block
                  </button>
                </div>

                {/* Local errors */}
                {localError && (
                  <div className="w-full bg-red-950/60 border border-red-500/30 p-4 rounded text-red-400 font-mono text-xs mb-6 text-left flex items-start gap-2.5">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{localError}</span>
                  </div>
                )}

                {/* Dropzone upload block */}
                {!pasteMode ? (
                  <div 
                    {...getRootProps()} 
                    className={`w-full h-72 border border-dashed rounded-lg bg-[#171717]/40 flex flex-col items-center justify-center p-6 cursor-pointer focus-ring transition-all duration-200 select-none ${
                      isDragActive 
                        ? 'border-zampBlue bg-zampBlue/5' 
                        : 'border-white/10 hover:border-zampBlue/40'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-12 h-12 text-zampBlue/60 mb-4 animate-pulse" />
                    <p className="font-sans font-bold text-lg text-white mb-2">
                      {isDragActive ? "Drop your CSV here..." : "Drop your CSV here or click to upload"}
                    </p>
                    <p className="font-mono text-xs text-white/40 mb-1 leading-normal max-w-[320px]">
                      Headers required: <span className="text-white/60">state</span>, <span className="text-white/60">revenue</span>, <span className="text-white/60">transactions</span>.
                    </p>
                    <span className="font-mono text-[10px] text-white/30">Max size limit: 5MB</span>
                  </div>
                ) : (
                  <form onSubmit={handlePasteSubmit} className="w-full flex flex-col items-center">
                    <textarea 
                      value={pasteText}
                      onChange={(e) => setPasteText(e.target.value)}
                      placeholder="state,revenue,transactions&#10;California,142000,310&#10;Texas,98000,195&#10;New York,67000,140"
                      className="w-full h-72 font-mono text-sm bg-[#171717]/25 border border-white/10 p-6 rounded-lg text-white focus-ring mb-4 resize-none"
                    />
                    <button 
                      type="submit"
                      className="btn-blue flex items-center gap-2"
                    >
                      Analyze economic nexus <PixelArrow className="w-[13px] h-[11px] text-white" />
                    </button>
                  </form>
                )}

                {/* Sandbox fallback */}
                <div className="mt-8 flex flex-col items-center gap-2">
                  <span className="font-sans text-xs text-white/30">Want to see the tool in action?</span>
                  <button 
                    onClick={loadSampleData}
                    className="border border-white/10 text-white/70 hover:border-white hover:text-white px-5 py-2.5 rounded font-mono text-xs uppercase transition-all duration-150 focus-ring"
                  >
                    Load Sample Dataset (20 States)
                  </button>
                </div>

              </div>
            ) : (
              <div className="w-full">
                
                {/* Reset & Download rows */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8">
                  <button 
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 border border-white/10 text-white/60 hover:text-white hover:border-white/30 px-4 py-2.5 rounded font-mono text-xs uppercase transition-all duration-150 focus-ring"
                  >
                    <RotateCcw size={13} /> Reset analyzer
                  </button>

                  <button 
                    onClick={store.exportCSV}
                    className="btn-blue flex items-center justify-center gap-2"
                  >
                    <Download size={13} /> Export Excel / CSV
                  </button>
                </div>

                {/* 4 Metric cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 font-mono">
                  {/* Card 1: States Analyzed */}
                  <div className="bg-[#171717] border border-white/5 p-6 rounded-lg text-left">
                    <div className="flex items-center justify-between text-white/40 mb-3 text-[11px] uppercase tracking-[-0.06em]">
                      <span>States Analyzed</span>
                      <FileSpreadsheet size={14} className="text-zampBlue/60" />
                    </div>
                    <div className="font-sans font-bold text-white text-3xl sm:text-4xl">{totalStates}</div>
                    <p className="text-[10px] text-white/30 mt-1">Represented in dataset</p>
                  </div>

                  {/* Card 2: Nexus Triggered */}
                  <div className="bg-[#171717] border border-white/5 p-6 rounded-lg text-left">
                    <div className="flex items-center justify-between text-white/40 mb-3 text-[11px] uppercase tracking-[-0.06em]">
                      <span>Nexus Triggered</span>
                      <AlertCircle size={14} className="text-red-500/60" />
                    </div>
                    <div className={`font-sans font-bold text-3xl sm:text-4xl ${nexusTriggeredCount > 0 ? 'text-red-500' : 'text-white'}`}>
                      {nexusTriggeredCount}
                    </div>
                    <p className="text-[10px] text-white/30 mt-1">Liable for state registration</p>
                  </div>

                  {/* Card 3: Approaching */}
                  <div className="bg-[#171717] border border-white/5 p-6 rounded-lg text-left">
                    <div className="flex items-center justify-between text-white/40 mb-3 text-[11px] uppercase tracking-[-0.06em]">
                      <span>Approaching</span>
                      <AlertTriangle size={14} className="text-amber-500/60" />
                    </div>
                    <div className={`font-sans font-bold text-3xl sm:text-4xl ${approachingCount > 0 ? 'text-amber-500' : 'text-white'}`}>
                      {approachingCount}
                    </div>
                    <p className="text-[10px] text-white/30 mt-1">At &ge;80% threshold level</p>
                  </div>

                  {/* Card 4: Revenue Exposed */}
                  <div className="bg-[#171717] border border-white/5 p-6 rounded-lg text-left">
                    <div className="flex items-center justify-between text-white/40 mb-3 text-[11px] uppercase tracking-[-0.06em]">
                      <span>Revenue Exposed</span>
                      <Coins size={14} className="text-red-500/60" />
                    </div>
                    <div className={`font-sans font-bold text-2xl sm:text-3xl lg:text-4xl ${totalRevenueExposed > 0 ? 'text-red-500' : 'text-white'} truncate`}>
                      ${totalRevenueExposed.toLocaleString()}
                    </div>
                    <p className="text-[10px] text-white/30 mt-1">Exposed sales volume</p>
                  </div>
                </div>

                {/* Claude Risk Brief */}
                <AIBrief 
                  brief={store.aiBrief} 
                  loading={store.aiBriefLoading} 
                  error={!!store.aiBriefError} 
                />

                {/* Results List */}
                <ResultsTable data={store.analysisData} />

              </div>
            )}
          </div>

          {/* TAB 2: MAP VIEW */}
          <div 
            id="tabpanel-map"
            role="tabpanel"
            aria-labelledby="tab-btn-map"
            hidden={store.activeTab !== 'map'}
          >
            {store.hasRunAnalysis ? (
              <div className="w-full">
                <div className="flex justify-between items-center mb-6">
                  <p className="font-mono text-white/60 text-sm text-left max-w-[650px]">
                    Interactive sales tax risk map. Click states to drill down into transaction metrics and compliance risk categorization.
                  </p>
                </div>
                <NexusMap />
              </div>
            ) : (
              <div className="w-full text-center py-16 border border-white/5 bg-[#171717]/10 rounded-lg font-mono text-sm text-white/40">
                Please upload transaction data in the "Analyze" tab first to visualize economic exposure.
              </div>
            )}
          </div>

          {/* TAB 3: DEADLINES PANEL */}
          <div 
            id="tabpanel-deadlines"
            role="tabpanel"
            aria-labelledby="tab-btn-deadlines"
            hidden={store.activeTab !== 'deadlines'}
          >
            {store.hasRunAnalysis ? (
              <DeadlinesPanel data={store.analysisData} />
            ) : (
              <div className="w-full text-center py-16 border border-white/5 bg-[#171717]/10 rounded-lg font-mono text-sm text-white/40">
                Please upload transaction data in the "Analyze" tab first to generate target filing deadlines.
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
