import React from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import AnalyzerTool from './components/AnalyzerTool';
import CTABar from './components/CTABar';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-bodyColor text-black selection:bg-zampBlue selection:text-white font-sans">
      {/* Sticky Header Nav */}
      <Nav />

      {/* Hero Section */}
      <Hero />

      {/* Informational How It Works Section */}
      <HowItWorks />

      {/* Core Embedded Nexus Exposure Analyzer */}
      <AnalyzerTool />

      {/* Lead Generation CTA Banner */}
      <CTABar />

      {/* Company Navigation Footer */}
      <Footer />
    </div>
  );
}
