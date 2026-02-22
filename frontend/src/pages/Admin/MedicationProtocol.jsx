import React from 'react';

const MedicationProtocol = () => {
  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col font-inter">
      <Header />
      
      <main className="flex flex-col gap-6 max-w-[1920px] p-8 w-full">
        <ProtocolTitleSection />
        <DateNavigator />

        {/* Kanban Board */}
        <div className="flex gap-6 pb-20 overflow-x-auto">
          <Column title="Morning" timeRange="08:00 - 10:00" icon={<MorningIcon />}>
            <MedCard 
              name="Metoprolol" 
              dosage="50mg • Oral Tablet" 
              status="verified" 
              time="08:15" 
              inventory={80} 
              inventoryLabel="Good (24 days)" 
            />
            <MedCard 
              name="Aspirin" 
              dosage="81mg • Enteric Coated" 
              status="verified" 
              time="08:15" 
              inventory={15} 
              inventoryLabel="Low (4 days)" 
              isLowStock 
            />
            <OptionalMed name="Vitamin D3" dosage="2000 IU" />
          </Column>

          <Column title="Noon" timeRange="12:00 - 14:00" icon={<NoonIcon />}>
            <MedCard 
              name="Metformin" 
              dosage="500mg • With Food" 
              status="pending" 
              inventory={45} 
              inventoryLabel="OK (12 days)" 
            />
          </Column>

          <Column title="Evening" timeRange="18:00 - 20:00" icon={<EveningIcon />} isFuture>
            <MedCard 
              name="Atorvastatin" 
              dosage="20mg • Oral" 
              status="locked" 
              time="19:00" 
              inventory={90} 
              inventoryLabel="OK (30 days)" 
            />
            <MedCard 
              name="Melatonin" 
              dosage="5mg • Dissolvable" 
              status="locked" 
              time="21:00" 
              inventory={20} 
              inventoryLabel="Refill Soon" 
            />
          </Column>

          <Column title="PRN / As Needed" icon={<PRNIcon />}>
            <PRNCard name="Nitroglycerin" dosage="0.4mg • Sublingual" lastTaken="2 days ago" supply={90} supplyLabel="28 tabs" />
            <PRNCard name="Ibuprofen" dosage="400mg • Pain" lastTaken="Today 09:30" supply={95} supplyLabel="Full" />
          </Column>
        </div>

        <LegendFooter />
      </main>
    </div>
  );
};

// --- Sub-Components ---

const Header = () => (
  <header className="bg-[#f8f8fc] border-b border-[#e7e7f3] flex items-center justify-between px-10 py-3 shrink-0">
    <div className="flex items-center gap-3">
      <LogoIcon />
      <span className="font-mono font-bold text-lg tracking-tight uppercase text-[#0d0d1b]">
        SMART MONITOR // CLINICAL HUD v2.4
      </span>
    </div>
    <div className="flex items-center gap-6">
      <div className="bg-white border border-[#e2e8f0] flex gap-2 items-center px-3.5 py-1 rounded-sm">
        <div className="w-2 h-2 bg-[#10b981] rounded-full"></div>
        <span className="font-mono font-medium text-xs text-[#64748b]">SYSTEM ONLINE</span>
      </div>
      <button className="bg-[#ef4444] h-9 flex items-center justify-center px-4 rounded-sm font-grotesk font-bold text-xs text-white tracking-wider uppercase">
        Escalate
      </button>
      <div className="relative w-9 h-9 rounded-full border border-[#e2e8f0] overflow-hidden">
        <img src="https://www.figma.com/api/mcp/asset/8e1df802-dc4a-4575-ac53-8ec01d3da896" alt="User" className="object-cover" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10b981] border-2 border-white rounded-full"></div>
      </div>
    </div>
  </header>
);

const ProtocolTitleSection = () => (
  <div className="border-b border-[#e2e8f0] flex items-end justify-between pb-3">
    <div className="flex flex-col gap-1">
      <div className="flex gap-3 items-center">
        <ProtocolIcon />
        <span className="font-mono text-xs text-[#94a3b8] tracking-[1.2px] uppercase">Protocol Management</span>
      </div>
      <h1 className="font-grotesk font-bold text-3xl text-[#0f172a] tracking-tight uppercase">Medication & Protocol</h1>
      <p className="font-grotesk font-medium text-sm text-[#64748b]">Daily regimen compliance, inventory logistics, and controlled substance verification.</p>
    </div>

    <div className="backdrop-blur bg-white/60 border border-[#e2e8f0] rounded-sm shadow-sm flex gap-6 items-center p-4">
      <div className="text-right">
        <div className="font-mono text-xs text-[#64748b] tracking-wider uppercase">Weekly Adherence</div>
        <div className="font-mono font-bold text-3xl text-[#0f172a] tracking-tight">98%</div>
      </div>
      <AdherenceCircle percentage={98} />
      <div className="px-2"><div className="w-px h-10 bg-[#e2e8f0]"></div></div>
      <div>
        <div className="font-mono text-xs text-[#64748b] tracking-wider uppercase">Doses Verified</div>
        <div className="flex gap-1 items-baseline">
          <span className="font-mono font-bold text-2xl text-[#0f172a]">24</span>
          <span className="font-mono text-sm text-[#94a3b8]">/25</span>
        </div>
      </div>
    </div>
  </div>
);

const AdherenceCircle = ({ percentage }) => (
  <div className="w-14 h-14 relative">
    <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
      <circle cx="28" cy="28" r="24" fill="none" stroke="#e2e8f0" strokeWidth="4"/>
      <circle cx="28" cy="28" r="24" fill="none" stroke="#10b981" strokeWidth="4" 
              strokeDasharray="150.8" strokeDashoffset={150.8 * (1 - percentage/100)} strokeLinecap="round"/>
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M2 6L6 10L14 2" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
  </div>
);

const DateNavigator = () => (
  <div className="bg-white border border-[#e2e8f0] rounded-sm shadow-sm flex items-center justify-between px-2.5 py-2.5">
    <button className="p-2 hover:bg-gray-50 rounded-sm">
      <svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d="M7 1L2 6L7 11" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
    <div className="flex gap-3 items-center">
      <CalendarIcon />
      <span className="font-mono font-medium text-sm text-[#0f172a] uppercase">Wednesday, October 24, 2023</span>
      <span className="bg-[#10b9811a] border border-[#10b98133] rounded-sm px-2.5 py-0.5 font-grotesk font-bold text-[10px] text-[#10b981] tracking-wider uppercase">Today</span>
    </div>
    <button className="p-2 hover:bg-gray-50 rounded-sm">
      <svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d="M1 1L6 6L1 11" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  </div>
);

const Column = ({ title, timeRange, icon, children, isFuture }) => (
  <div className="flex-1 flex flex-col gap-4 min-w-[300px]">
    <div className={`border-b-2 flex items-center justify-between pb-2.5 ${isFuture ? 'border-[#e2e8f0]' : 'border-[#0f172a33]'}`}>
      <div className="flex gap-2 items-center">
        {icon}
        <span className={`font-mono font-bold text-sm tracking-[1.4px] uppercase ${isFuture ? 'text-[#64748b]' : 'text-[#0f172a]'}`}>{title}</span>
      </div>
      {timeRange && <span className="font-mono text-xs text-[#94a3b8]">{timeRange}</span>}
    </div>
    {children}
  </div>
);

const MedCard = ({ name, dosage, status, time, inventory, inventoryLabel, isLowStock }) => {
  const isVerified = status === 'verified';
  const isPending = status === 'pending';
  const isLocked = status === 'locked';

  return (
    <div className={`bg-white border rounded-sm shadow-sm p-4 flex flex-col gap-4 relative ${isLocked ? 'opacity-75' : ''} ${isPending ? 'border-l-4 border-l-[#e2e8f0]' : 'border-[#e2e8f0]'}`}>
      {isLowStock && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#f59e0b] rounded-full shadow-sm flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="3" stroke="white" strokeWidth="1.2"/><path d="M5 3.5V5.5" stroke="white" strokeWidth="1" strokeLinecap="round"/><circle cx="5" cy="7" r="0.5" fill="white"/></svg>
        </div>
      )}
      <div className="flex justify-between">
        <div>
          <h4 className={`font-grotesk font-bold text-lg ${isLocked ? 'text-[#475569]' : 'text-[#0f172a]'}`}>{name}</h4>
          <p className="font-mono text-xs text-[#64748b]">{dosage}</p>
        </div>
        <button className="w-6 h-6 bg-[#f8fafc] border border-[#f1f5f9] rounded-full flex items-center justify-center">
          {isLocked ? <LockIcon /> : <InfoIcon />}
        </button>
      </div>
      <div className="pt-1">
        <div className="flex justify-between items-end mb-1">
          <span className="font-grotesk font-bold text-[10px] text-[#94a3b8] tracking-wider uppercase">Inventory</span>
          <span className={`font-mono font-medium text-[10px] ${isLowStock ? 'text-[#f59e0b]' : isVerified ? 'text-[#10b981]' : 'text-[#475569]'}`}>
            {inventoryLabel}
          </span>
        </div>
        <div className="bg-[#f1f5f9] h-1.5 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${isLowStock ? 'bg-[#f59e0b]' : isVerified ? 'bg-[#10b981]' : 'bg-[#0f172a99]'}`} style={{ width: `${inventory}%` }}></div>
        </div>
      </div>
      
      {isVerified && (
        <button className="bg-[#10b9811a] border border-[#10b98133] h-9 rounded-sm flex gap-2 items-center justify-center">
          <CheckCircleIcon />
          <span className="font-grotesk font-bold text-xs text-[#10b981] tracking-wider uppercase">Verified {time}</span>
        </button>
      )}
      {isPending && (
        <button className="bg-white border border-[#0f172a] h-9 rounded-sm shadow-sm flex gap-2 items-center justify-center hover:bg-gray-50">
          <CheckIcon />
          <span className="font-grotesk font-bold text-xs text-[#0f172a] tracking-wider uppercase">Confirm</span>
        </button>
      )}
      {isLocked && (
        <button className="bg-[#f1f5f9] border border-[#e2e8f0] h-9 rounded-sm flex gap-2 items-center justify-center">
          <ClockIcon />
          <span className="font-grotesk font-bold text-xs text-[#94a3b8] tracking-wider uppercase">Scheduled {time}</span>
        </button>
      )}
    </div>
  );
};

const PRNCard = ({ name, dosage, lastTaken, supply, supplyLabel }) => (
  <div className="bg-white border border-[#e2e8f0] rounded-sm shadow-sm p-4 flex flex-col gap-4">
    <div className="flex justify-between">
      <div>
        <h4 className="font-grotesk font-bold text-lg text-[#0f172a]">{name}</h4>
        <p className="font-mono text-xs text-[#64748b]">{dosage}</p>
      </div>
      <button className="w-6 h-6 bg-[#f8fafc] border border-[#f1f5f9] rounded-full flex items-center justify-center">
        <PRNSymbol />
      </button>
    </div>
    <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-sm p-2.5 flex gap-2 items-center">
      <ClockIcon small />
      <span className="font-mono text-[10px] text-[#64748b]">Last Taken: <span className="font-bold text-[#334155]">{lastTaken}</span></span>
    </div>
    <div className="pt-1">
      <div className="flex justify-between items-end mb-1">
        <span className="font-grotesk font-bold text-[10px] text-[#94a3b8] tracking-wider uppercase">Supply</span>
        <span className="font-mono font-medium text-[10px] text-[#475569]">{supplyLabel}</span>
      </div>
      <div className="bg-[#f1f5f9] h-1.5 rounded-full overflow-hidden">
        <div className="bg-[#6366f1] h-full rounded-full" style={{ width: `${supply}%` }}></div>
      </div>
    </div>
    <button className="bg-white border border-[#cbd5e1] h-9 rounded-sm flex gap-2 items-center justify-center hover:bg-gray-50 text-[#475569] font-grotesk font-bold text-xs tracking-wider uppercase">
      <PlusIcon /> Record Dose
    </button>
  </div>
);

const OptionalMed = ({ name, dosage }) => (
  <div className="bg-white/50 border border-dashed border-[#e2e8f0] rounded-sm p-4 flex flex-col gap-3">
    <div className="opacity-70">
      <h4 className="font-grotesk font-medium text-base text-[#475569]">{name}</h4>
      <p className="font-mono text-xs text-[#94a3b8]">{dosage}</p>
    </div>
    <button className="bg-white border border-[#e2e8f0] h-8 rounded-sm font-grotesk font-bold text-[10px] text-[#64748b] tracking-wider uppercase">
      Log Intake
    </button>
  </div>
);

const LegendFooter = () => (
  <div className="border-t border-[#e2e8f0] pt-6 flex gap-6 items-center">
    <span className="font-mono font-bold text-xs text-[#334155] tracking-wider uppercase">Legend:</span>
    <LegendItem color="bg-[#10b981]" label="Verified" />
    <LegendItem color="border border-[#0f172a]" label="Pending Action" />
    <LegendItem color="bg-[#f59e0b]" label="Low Inventory (<5 days)" />
    <LegendItem color="bg-[#cbd5e1]" label="Future/Locked" />
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex gap-2 items-center">
    <div className={`w-2 h-2 rounded-full ${color}`}></div>
    <span className="font-mono text-xs text-[#64748b]">{label}</span>
  </div>
);

// --- SVG Icons ---
const LogoIcon = () => <svg width="20" height="24" viewBox="0 0 20 18" fill="none"><path d="M10 0L12.5 4.5L17.5 5.5L14 9.5L15 14.5L10 12L5 14.5L6 9.5L2.5 5.5L7.5 4.5L10 0Z" fill="#6366f1"/><path d="M3 15L5 13M17 15L15 13M10 16V14" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const ProtocolIcon = () => <svg width="11" height="14" viewBox="0 0 11 14" fill="none"><rect x="1" y="1" width="9" height="12" rx="1" stroke="currentColor" strokeWidth="1.2"/><line x1="3" y1="4" x2="8" y2="4" stroke="currentColor"/><line x1="3" y1="7" x2="8" y2="7" stroke="currentColor"/></svg>;
const CalendarIcon = () => <svg width="15" height="17" viewBox="0 0 15 17" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="1" y="3" width="13" height="13" rx="1.5"/><line x1="1" y1="7" x2="14" y2="7"/><line x1="4" y1="1" x2="4" y2="4"/><line x1="11" y1="1" x2="11" y2="4"/></svg>;
const MorningIcon = () => <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="8.5" cy="8.5" r="4"/><path d="M8.5 1V3M8.5 14V16M1 8.5H3M14 8.5H16" strokeLinecap="round"/></svg>;
const NoonIcon = () => <svg width="15" height="12" viewBox="0 0 15 12" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="7.5" cy="6" r="3"/><path d="M7.5 1V3M7.5 9V11M1 6H3M12 6H14" strokeLinecap="round"/></svg>;
const EveningIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M10 3C8 1 5 1 3.5 3C2 5 3 8 5.5 9.5C8 11 11 10 12 7.5" strokeLinecap="round"/></svg>;
const PRNIcon = () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="1" y="2" width="13" height="11" rx="1.5"/><path d="M5 1V3M10 1V3M5 7H10M7.5 5V9" strokeLinecap="round"/></svg>;
const LockIcon = () => <svg width="13" height="15" viewBox="0 0 13 15" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="6" width="9" height="8" rx="1"/><path d="M4 6V4a3 3 0 016 0v2" strokeLinecap="round"/></svg>;
const InfoIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor"><circle cx="7" cy="7" r="5"/><path d="M7 5V9M7 4h.01" strokeLinecap="round"/></svg>;
const CheckCircleIcon = () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="7.5" cy="7.5" r="5.5"/><path d="M5 7.5l2 2 3-4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const CheckIcon = () => <svg width="12" height="9" viewBox="0 0 12 9" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 4.5L4.5 8L11 1" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ClockIcon = ({ small }) => <svg width={small ? "12" : "15"} height={small ? "12" : "15"} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="7.5" cy="7.5" r="5.5"/><path d="M7.5 4v3.5l2.5 1.5" strokeLinecap="round"/></svg>;
const PRNSymbol = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor"><path d="M6 1v3M6 8v3M1 6h3M8 6h3" strokeLinecap="round"/></svg>;
const PlusIcon = () => <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M5.5 1v9M1 5.5h9" strokeLinecap="round"/></svg>;

export default MedicationProtocol;