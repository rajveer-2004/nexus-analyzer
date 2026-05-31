import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import { Loader2, MapPin } from 'lucide-react';

export default function NexusMap() {
  const analysisData = useNexusStore((state) => state.analysisData);
  
  const [geoData, setGeoData] = useState(null);
  const [d3Lib, setD3Lib] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredState, setHoveredState] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    let active = true;
    
    const loadLibsAndMap = async () => {
      try {
        setLoading(true);
        const d3 = await import('d3');
        const topojson = await import('topojson-client');
        
        const response = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json');
        if (!response.ok) throw new Error("Failed to load map data");
        const us = await response.json();
        
        if (!active) return;
        
        const geojson = topojson.feature(us, us.objects.states);
        setD3Lib(d3);
        setGeoData(geojson);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load map or libraries:", err);
        setLoading(false);
      }
    };
    
    loadLibsAndMap();
    
    return () => {
      active = false;
    };
  }, []);

  const { paths, width, height } = useMemo(() => {
    if (!geoData || !d3Lib) return { paths: [], width: 960, height: 500 };
    
    const w = 960;
    const h = 500;
    
    // AlbersUSA projection automatically handles scaling/positioning of Alaska and Hawaii as insets
    const projection = d3Lib.geoAlbersUsa().fitSize([w, h], geoData);
    const pathGenerator = d3Lib.geoPath().projection(projection);
    
    const list = geoData.features.map(feature => ({
      feature,
      path: pathGenerator(feature),
      name: feature.properties.name
    }));
    
    return { paths: list, width: w, height: h };
  }, [geoData, d3Lib]);

  const getStateStatus = (stateName) => {
    const s = analysisData[stateName];
    if (!s) return { color: '#1a1a2e', label: 'No Data', risk: 'none', raw: null };
    
    if (s.nexus) {
      return { color: '#dc2626', label: 'Nexus Triggered', risk: 'High', raw: s };
    }
    if (s.maxPct >= 80) {
      return { color: '#f59e0b', label: 'Approaching', risk: 'High', raw: s };
    }
    if (s.maxPct >= 40) {
      return { color: '#005eff', label: 'Watch', risk: 'Medium', raw: s };
    }
    return { color: '#edf4ff', label: 'Safe', risk: 'Low', raw: s };
  };

  const handleStateClick = (stateName, event) => {
    const status = getStateStatus(stateName);
    
    if (window.innerWidth < 768) {
      setSelectedState({
        name: stateName,
        ...status
      });
    }
  };

  const handleMouseMove = (stateName, event) => {
    if (window.innerWidth >= 768) {
      const status = getStateStatus(stateName);
      const containerRect = mapContainerRef.current.getBoundingClientRect();
      
      const x = event.clientX - containerRect.left + 15;
      const y = event.clientY - containerRect.top + 15;
      
      setHoveredState({
        name: stateName,
        x,
        y,
        ...status
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredState(null);
  };

  if (loading) {
    return (
      <div className="w-full h-[450px] border border-white/5 bg-[#171717]/20 rounded-lg flex flex-col items-center justify-center gap-3 py-12 select-none">
        <Loader2 className="w-8 h-8 text-zampBlue animate-spin" />
        <span className="font-mono text-xs text-white/40 tracking-wider">Compiling map components...</span>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full border border-white/5 bg-[#0a0a16] rounded-lg p-4 md:p-8 flex flex-col items-center justify-center relative select-none"
      role="img"
      aria-label="Economic sales tax nexus choropleth map of the United States"
    >
      <title>Sales Tax Nexus Map</title>
      <desc>A US map coloring states based on economic nexus thresholds: red for triggered, amber for approaching, blue for watch, light grey-blue for safe.</desc>

      <div className="w-full aspect-[960/500] max-h-[500px]">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full"
          role="presentation"
        >
          <g>
            {paths.map(({ path, name }) => {
              const status = getStateStatus(name);
              const isHovered = hoveredState?.name === name;
              const isSelected = selectedState?.name === name;
              
              return (
                <path
                  key={name}
                  d={path}
                  fill={status.color}
                  stroke="#0d0d1a"
                  strokeWidth={isHovered || isSelected ? "2.5" : "0.75"}
                  className="transition-all duration-150 cursor-pointer focus:outline-none"
                  style={{
                    opacity: isHovered || isSelected ? 0.95 : 1,
                    filter: isHovered || isSelected ? 'drop-shadow(0px 0px 4px rgba(0,94,255,0.4))' : 'none'
                  }}
                  onMouseMove={(e) => handleMouseMove(name, e)}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => handleStateClick(name, e)}
                  role="button"
                  aria-label={`${name}: ${status.label}`}
                />
              );
            })}
          </g>
        </svg>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-8 border-t border-white/5 pt-6 w-full max-w-[800px] text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-[#dc2626]" />
          <span className="text-white/60">Nexus Triggered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-[#f59e0b]" />
          <span className="text-white/60">Approaching (&ge;80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-[#005eff]" />
          <span className="text-white/60">Watch (&ge;40%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-[#edf4ff]" />
          <span className="text-white/60">Safe (&lt;40%)</span>
        </div>
        <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
          <div className="w-3.5 h-3.5 rounded bg-[#1a1a2e]" />
          <span className="text-white/60">No Data</span>
        </div>
      </div>

      {hoveredState && (
        <div 
          className="absolute z-30 bg-[#0f0f24] border border-white/10 p-4 rounded shadow-2xl flex flex-col text-left font-mono pointer-events-none w-[220px]"
          style={{ 
            left: `${hoveredState.x}px`, 
            top: `${hoveredState.y}px`
          }}
        >
          <div className="font-display font-bold text-white text-base mb-2 flex items-center gap-1.5 border-b border-white/5 pb-1">
            <MapPin size={14} className="text-zampBlue" /> {hoveredState.name}
          </div>
          
          {hoveredState.raw ? (
            <div className="flex flex-col gap-1.5 text-xs text-white/70">
              <div className="flex justify-between">
                <span>Revenue:</span>
                <span className="text-white">${hoveredState.raw.revenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Transactions:</span>
                <span className="text-white">{hoveredState.raw.transactions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-1.5 mt-0.5">
                <span>Status:</span>
                <span 
                  className="font-bold" 
                  style={{ color: hoveredState.color }}
                >
                  {hoveredState.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Risk Level:</span>
                <span className="text-white uppercase font-bold">{hoveredState.risk}</span>
              </div>
            </div>
          ) : (
            <span className="text-white/40 text-xs">No transactions reported for this state.</span>
          )}
        </div>
      )}

      {selectedState && (
        <div className="fixed inset-x-0 bottom-0 z-50 bg-[#0f0f24] border-t border-zampBlue/20 p-6 shadow-2xl flex flex-col md:hidden text-left rounded-t-xl">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
            <div className="font-display font-extrabold text-white text-lg flex items-center gap-1.5">
              <MapPin size={16} className="text-zampBlue" /> {selectedState.name}
            </div>
            <button 
              onClick={() => setSelectedState(null)} 
              className="text-white/40 hover:text-white text-xs uppercase font-mono tracking-wider border border-white/10 px-2.5 py-1 rounded"
              aria-label="Close details"
            >
              Close
            </button>
          </div>

          {selectedState.raw ? (
            <div className="flex flex-col gap-3 text-sm font-mono text-white/70">
              <div className="flex justify-between">
                <span>Total Revenue:</span>
                <span className="text-white font-semibold">${selectedState.raw.revenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Transactions:</span>
                <span className="text-white font-semibold">{selectedState.raw.transactions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Economic Status:</span>
                <span className="font-bold" style={{ color: selectedState.color }}>
                  {selectedState.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Exposure Risk:</span>
                <span className="text-white uppercase font-bold">{selectedState.risk}</span>
              </div>
            </div>
          ) : (
            <span className="text-white/40 text-sm py-2">No transactions reported in this state.</span>
          )}
        </div>
      )}

    </div>
  );
}
