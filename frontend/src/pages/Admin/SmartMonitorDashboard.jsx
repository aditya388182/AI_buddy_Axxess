import React from 'react';

const SmartMonitorDashboard = () => {
  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col font-inter">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainContent />
        <LiveFeedSidebar />
      </div>
    </div>
  );
};

const Header = () => (
  <header className="backdrop-blur bg-white/85 border-b border-[#e2e8f0] flex h-16 items-center justify-between px-6 shrink-0 z-20">
    <div className="flex gap-6 items-center">
      {/* Logo */}
      <div className="flex gap-2 items-center">
        <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
          <path d="M10 0L12.5 4.5L17.5 5.5L14 9.5L15 14.5L10 12L5 14.5L6 9.5L2.5 5.5L7.5 4.5L10 0Z" fill="#6366f1" />
          <path d="M3 15L5 13M17 15L15 13M10 16V14" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="font-mono font-bold text-lg tracking-wider uppercase">
          <span className="text-[#0f172a]">Smart</span>
          <span className="text-[#6366f1]">Monitor</span>
        </span>
      </div>

      <div className="w-px h-6 bg-[#e2e8f0]"></div>

      {/* Patient Info */}
      <div className="flex gap-3 items-center">
        <div className="w-8 h-8 rounded-full bg-[#e2e8f0] overflow-hidden">
          <img src="https://www.figma.com/api/mcp/asset/baab9a45-a09d-4e95-9252-13d553185688" alt="Patient" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="font-mono font-bold text-sm text-[#0f172a]">DOE, JOHN</div>
          <div className="font-inter text-[10px] text-[#64748b] tracking-wider uppercase">ID: #892-332</div>
        </div>
      </div>

      <div className="bg-[#f0fdf4] border border-[#dcfce7] flex gap-1 items-center px-2.5 py-1 rounded">
        <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></div>
        <span className="font-mono font-medium text-xs text-[#10b981]">ACTIVE MONITORING</span>
      </div>
    </div>

    <div className="flex gap-6 items-center">
      <div className="flex gap-2 items-center">
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 8C2.5 4 5 2 7 2C9 2 11.5 4 13 8" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/><circle cx="7" cy="2" r="1.5" fill="#64748b"/></svg>
        <span className="font-mono text-xs text-[#64748b]">5G • 24ms</span>
      </div>
      <button className="p-2 rounded hover:bg-gray-100 relative">
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none"><path d="M8 1C5 1 2 3.5 2 7V12L0 15H16L14 12V7C14 3.5 11 1 8 1Z" stroke="#64748b" strokeWidth="1.5"/><path d="M6 17C6 18.1 6.9 19 8 19C9.1 19 10 18.1 10 17" stroke="#64748b" strokeWidth="1.5"/></svg>
      </button>
    </div>
  </header>
);

const Sidebar = () => (
  <aside className="backdrop-blur bg-white/50 border-r border-[#e2e8f0] flex flex-col gap-2 w-64 p-4 shrink-0">
    <div className="pb-4">
      <div className="px-2">
        <div className="font-inter font-semibold text-[10px] text-[#64748b] tracking-widest uppercase mb-3">Module Select</div>
        <nav className="flex flex-col gap-1">
          <NavItem active label="Command Dashboard" icon={<GridIcon />} />
          <NavItem label="Vitals Analysis" icon={<ChartIcon />} />
          <NavItem label="Behavioral" icon={<UserIcon />} />
          <NavItem label="Medication" icon={<PillIcon />} />
        </nav>
      </div>
    </div>

    <div className="mt-auto px-2">
      <div className="backdrop-blur border border-[#e2e8f0] rounded p-4 bg-gradient-to-br from-white to-[#f8fafc]">
        <div className="font-inter font-semibold text-[10px] text-[#64748b] tracking-widest uppercase mb-2">Care Team</div>
        <div className="flex gap-3 items-center pb-1 mb-2">
          <div className="relative">
            <img src="https://www.figma.com/api/mcp/asset/07a733df-7ed8-44dd-a09a-8bf4ad47b70e" alt="Dr. Chen" className="w-8 h-8 rounded-full object-cover" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10b981] border border-white rounded-full"></div>
          </div>
          <div>
            <div className="font-mono font-bold text-xs text-[#0f172a]">DR. CHEN</div>
            <div className="font-grotesk text-[10px] text-[#64748b]">Cardiologist</div>
          </div>
        </div>
        <button className="w-full bg-white border border-[#e2e8f0] rounded py-1.5 flex gap-2 items-center justify-center hover:bg-gray-50">
          <span className="font-grotesk font-medium text-xs text-[#0f172a]">Message</span>
        </button>
      </div>
    </div>
  </aside>
);

const MainContent = () => (
  <main className="flex-1 bg-[#f8fafc]/50 overflow-y-auto p-6">
    <div className="flex flex-col gap-6 max-w-[896px] mx-auto">
      
      {/* Stability Score Card */}
      <div className="backdrop-blur bg-white/85 border border-[#e2e8f0] rounded-lg shadow-sm p-6 relative">
        <div className="flex flex-col items-center py-4">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div className="absolute inset-0 bg-[rgba(99,102,241,0.2)] blur-[32px] rounded-full"></div>
            {/* Custom conic gradient ring */}
            <div className="rounded-full w-48 h-48 flex items-center justify-center relative" 
                 style={{ background: 'conic-gradient(from 220deg, #6366f1 0%, #6366f1 75%, #e2e8f0 75%, #e2e8f0 100%)' }}>
              <div className="bg-white rounded-full w-[163px] h-[163px] flex flex-col items-center justify-center shadow-sm">
                <span className="font-mono font-bold text-5xl text-[#0f172a] tracking-tighter">87</span>
                <span className="font-inter text-[10px] text-[#64748b] uppercase mt-1">Stability Score</span>
              </div>
            </div>
          </div>
          <div className="mt-4 bg-[#eef2ff] border border-[#e0e7ff] rounded-full px-3.5 py-1 flex gap-2 items-center text-[#6366f1]">
            <span className="font-mono font-medium text-xs">+2pts since 08:00</span>
          </div>
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-2 gap-3">
        <VitalCard label="HR (BPM)" value="72" subValue="avg" color="#10b981" />
        <VitalCard label="SYS/DIA (mmHg)" value="128" subValue="/82" color="#f59e0b" />
        <VitalCard label="GLUCOSE (mg/dL)" value="110" trend="+2%" color="#10b981" />
        <VitalCard label="O2 SAT (%)" value="98" color="#10b981" />
      </div>

      {/* AI Insight Box */}
      <div className="backdrop-blur bg-gradient-to-r from-[#eef2ff] via-white to-white border border-[#e0e7ff] rounded-lg p-5">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-[#eef2ff] rounded-lg flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L12 7L17 8L13 12L14 17L10 14.5L6 17L7 12L3 8L8 7L10 2Z" fill="#6366f1"/></svg>
          </div>
          <div className="flex-1">
            <div className="font-inter font-semibold text-[10px] text-[#6366f1] tracking-wider uppercase mb-1">Pattern Detected</div>
            <div className="font-mono text-sm text-[#0f172a] leading-relaxed">
              Systolic pressure trending <span className="font-bold text-[#f59e0b]">+5%</span> post-medication window. Correlation with low hydration events probable.
            </div>
            <div className="flex gap-2 mt-3">
              <button className="bg-white border border-[#e2e8f0] rounded px-3.5 py-1 font-medium text-xs hover:bg-gray-50">Dismiss</button>
              <button className="bg-[#6366f1] rounded px-3 py-1 font-medium text-xs text-white shadow-sm hover:bg-[#5558e6]">View Analysis</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
);

const LiveFeedSidebar = () => (
  <aside className="backdrop-blur bg-white/50 border-l border-[#e2e8f0] w-96 flex flex-col shrink-0">
    <div className="bg-white/80 border-b border-[#e2e8f0] flex items-center justify-between px-4 py-4">
      <span className="font-mono font-bold text-sm text-[#0f172a] uppercase">Live Feed</span>
    </div>
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
      <AlertItem type="critical" time="10:42 AM" title="Fall Detected (False Positive)" description="Patient confirmed stable via voice." color="ef4444" />
      <AlertItem type="protocol" time="09:15 AM" title="Morning Meds Verified" description="Beta Blocker (50mg) intake confirmed." color="10b981" />
      <AlertItem type="sleep" time="07:30 AM" title="Sleep Cycle Complete" description="7h 42m total duration. REM efficiency 92%." color="3b82f6" />
    </div>
  </aside>
);

// Helper Components
const NavItem = ({ label, icon, active = false }) => (
  <a href="#" className={`flex gap-3 items-center px-3 py-2.5 rounded border ${active ? 'bg-black/5 border-black/10' : 'border-transparent hover:bg-gray-50'}`}>
    {icon}
    <span className={`font-medium text-sm ${active ? 'text-[#0f172a]' : 'text-[#64748b]'}`}>{label}</span>
  </a>
);

const VitalCard = ({ label, value, subValue, trend, color }) => (
  <div className="backdrop-blur bg-white/85 border border-[#e2e8f0] rounded-lg p-4 relative overflow-hidden h-32">
    <div className="flex justify-between items-start mb-2">
      <span className="font-semibold text-[10px] text-[#64748b] uppercase">{label}</span>
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}66` }}></div>
    </div>
    <div className="flex gap-2 items-end relative z-10">
      <span className="font-mono font-medium text-4xl text-[#0f172a]">{value}</span>
      {subValue && <span className="font-mono text-sm text-[#64748b] pb-1">{subValue}</span>}
      {trend && <span className="font-mono text-[10px] text-[#10b981] pb-1">{trend}</span>}
    </div>
  </div>
);

const AlertItem = ({ type, time, title, description, color }) => (
  <div className="bg-white border-l-4 rounded shadow-sm p-3 flex flex-col gap-1" style={{ borderLeftColor: `#${color}`, borderRight: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
    <div className="flex justify-between items-start">
      <span className="font-mono font-bold text-xs uppercase" style={{ color: `#${color}` }}>{type}</span>
      <span className="font-mono text-[10px] text-[#64748b]">{time}</span>
    </div>
    <span className="font-medium text-sm text-[#0f172a]">{title}</span>
    <span className="text-xs text-[#64748b]">{description}</span>
  </div>
);

// Simple Icon Components
const GridIcon = () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor"><rect x="1" y="1" width="5" height="5" rx="1" strokeWidth="1.2"/><rect x="9" y="1" width="5" height="5" rx="1" strokeWidth="1.2"/><rect x="1" y="9" width="5" height="5" rx="1" strokeWidth="1.2"/><rect x="9" y="9" width="5" height="5" rx="1" strokeWidth="1.2"/></svg>;
const ChartIcon = () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor"><path d="M1 11L4 5L7 8L10 3L14 11" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const UserIcon = () => <svg width="16" height="17" viewBox="0 0 16 17" fill="none" stroke="currentColor"><circle cx="8" cy="6" r="3" strokeWidth="1.2"/><path d="M2 16C2 12 5 10 8 10C11 10 14 12 14 16" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const PillIcon = () => <svg width="12" height="15" viewBox="0 0 12 15" fill="none" stroke="currentColor"><rect x="1" y="1" width="10" height="13" rx="2" strokeWidth="1.2"/><line x1="4" y1="5" x2="8" y2="5" /><line x1="4" y1="8" x2="8" y2="8" /></svg>;

export default SmartMonitorDashboard;