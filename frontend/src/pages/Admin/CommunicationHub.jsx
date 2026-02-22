import React, { useState } from 'react';

const CommunicationHub = () => {
  const [message, setMessage] = useState('');

  return (
    <div className="bg-[#f8fafc] h-screen flex flex-col overflow-hidden font-inter">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Left + Center: Chat & Actions */}
        <div className="flex-1 bg-white/40 relative flex flex-col">
          <QuickActionHeader />
          
          {/* Thread View */}
          <div className="flex-1 overflow-y-auto bg-[#f8fafc]/50 p-6 flex flex-col gap-6 items-center">
            <DateDivider date="Today, October 24" />
            
            <SystemLog 
              eventId="9942" 
              time="08:00 AM" 
              vitals="STABLE (HR: 72, BP: 120/80)" 
              meds="PENDING VERIFICATION" 
            />

            <ChatMessage 
              name="Dr. Chen" 
              role="Cardiologist" 
              time="09:15 AM" 
              image="https://www.figma.com/api/mcp/asset/c756233a-28ef-4f7f-b99c-72907fb7a396"
              text="I've reviewed the overnight heart rate variability data. There's a slight uptick in irregularity around 3 AM, but it correlates with the reported restlessness. Let's keep the current dosage but monitor O2 levels closely today."
              isOnline
            />

            <ChatMessage 
              name="You" 
              role="Case Manager" 
              time="09:18 AM" 
              image="https://www.figma.com/api/mcp/asset/3ba433a9-f26e-46dd-a1ad-87491b084b6d"
              text="Understood, Dr. Chen. I'll set a custom alert threshold for O2 saturation below 94% for today."
              isMe
            />

            <AnomalyAlert 
              time="10:05 AM"
              title="HR DEVIATION DETECTED"
              description="HR spiked to 110 BPM (resting)."
              analysis="Potential anxiety or missed medication."
            />

            <ChatMessage 
              name="Sarah Doe" 
              role="Daughter" 
              time="10:07 AM" 
              initials="SD"
              text="I'm seeing the alert on my app. Is Dad okay? I can drive over if needed."
            />
            
            <div className="h-4" />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-[#e2e8f0] px-28 py-6 shrink-0">
            <div className="max-w-3xl flex gap-4 items-start mx-auto">
              <button className="w-11 h-11 border border-[#cbd5e1] rounded flex items-center justify-center shrink-0 hover:bg-gray-50">
                <PlusIcon />
              </button>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type message to care team..." 
                  className="w-full h-11 bg-[#f8fafc] border border-[#cbd5e1] rounded px-4 pr-12 font-grotesk text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none focus:border-[#6366f1]"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]">
                  <MicIcon />
                </button>
              </div>
              <button className="bg-[#1414eb] h-11 rounded shadow-sm flex gap-2 items-center px-6 hover:bg-[#1010d0]">
                <span className="font-grotesk font-bold text-xs text-white tracking-wider uppercase">Send</span>
                <SendIcon />
              </button>
            </div>
          </div>
        </div>

        <CareTeamSidebar />
      </div>
    </div>
  );
};

// Sub-components
const Header = () => (
  <header className="backdrop-blur-md bg-white/80 border-b border-[#e2e8f0] flex h-16 items-center justify-between px-6 shrink-0 z-20">
    <div className="flex gap-4 items-center">
      <LogoIcon />
      <span className="font-mono font-bold text-lg tracking-tight uppercase">
        <span className="text-[#0f172a]">SMART MONITOR </span>
        <span className="text-[#94a3b8] font-normal">|</span>
        <span className="text-[#0f172a]"> V 2.4</span>
      </span>
    </div>
    <div className="flex-1 flex gap-8 items-center justify-end">
      <nav className="flex gap-8 items-center h-16">
        {['Dashboard', 'Analysis', 'Protocol'].map(item => (
          <a key={item} href="#" className="font-grotesk font-medium text-sm text-[#64748b] tracking-wider uppercase hover:text-[#0f172a]">{item}</a>
        ))}
        <a href="#" className="font-grotesk font-bold text-sm text-[#1414eb] tracking-wider uppercase border-b-2 border-[#1414eb] pb-5 pt-5">Comm Hub</a>
      </nav>
      <div className="border-l border-[#e2e8f0] pl-6 flex gap-3 items-center h-full">
        <div className="text-right">
          <div className="font-grotesk font-bold text-xs text-[#0f172a] uppercase">Patient: John Doe</div>
          <div className="flex gap-1 items-center justify-end">
            <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></div>
            <span className="font-mono text-[10px] text-[#10b981]">MONITORING ACTIVE</span>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#e2e8f0] border border-[#cbd5e1] overflow-hidden">
          <img src="https://www.figma.com/api/mcp/asset/f8054f39-5a46-420b-8c7b-fc4914f52795" alt="User" />
        </div>
      </div>
    </div>
  </header>
);

const QuickActionHeader = () => (
  <div className="backdrop-blur bg-white/60 border-b border-[#e2e8f0] p-6 flex flex-col gap-4 shrink-0 z-10">
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-grotesk font-bold text-2xl text-[#0f172a] tracking-tight uppercase">Communication Hub</h1>
        <p className="font-grotesk text-sm text-[#64748b]">Coordination & Crisis Escalation Protocol</p>
      </div>
      <div className="flex gap-3 items-center">
        <StatusBadge label="Signal: Strong" />
        <StatusBadge label="Encryption: AES-256" />
      </div>
    </div>
    <div className="flex gap-4">
      <ActionButton icon={<VideoIcon />} title="Video Call Patient" subtitle="Instant connection to bedside unit" />
      <ActionButton icon={<EscalateIcon />} title="Escalate to Clinician" subtitle="Priority line for emergencies" isAlert />
      <ActionButton icon={<ReportIcon />} title="Generate Report" subtitle="Compile last 24h vitals log" />
    </div>
  </div>
);

const ChatMessage = ({ name, role, time, text, image, initials, isMe, isOnline }) => (
  <div className={`max-w-3xl w-full flex gap-4 ${isMe ? 'pl-24 justify-end' : ''}`}>
    {!isMe && (
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded border border-[#e2e8f0] overflow-hidden bg-[#e2e8f0] flex items-center justify-center">
          {image ? <img src={image} alt={name} className="w-full h-full object-cover" /> : <span className="font-grotesk font-bold text-sm text-[#64748b]">{initials}</span>}
        </div>
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${isOnline ? 'bg-[#10b981]' : 'bg-[#94a3b8]'}`}></div>
      </div>
    )}
    <div className={`flex flex-col gap-1 max-w-[614px] ${isMe ? 'items-end' : ''}`}>
      <div className="flex gap-2 items-baseline">
        {!isMe && <span className="font-grotesk font-bold text-sm text-[#0f172a]">{name}</span>}
        <span className="font-mono text-[10px] text-[#94a3b8]">{role} • {time}</span>
        {isMe && <span className="font-grotesk font-bold text-sm text-[#0f172a]">{name}</span>}
      </div>
      <div className={`rounded-md shadow-sm p-4 ${isMe ? 'bg-[#1414eb] text-white rounded-tr-none' : 'bg-white border border-[#e2e8f0] rounded-tl-none'}`}>
        <p className="font-grotesk text-sm leading-5 m-0">{text}</p>
      </div>
    </div>
    {isMe && (
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded border border-[#e2e8f0] overflow-hidden">
          <img src={image} alt="Me" className="w-full h-full object-cover" />
        </div>
      </div>
    )}
  </div>
);

const SystemLog = ({ eventId, time, vitals, meds }) => (
  <div className="max-w-3xl w-full flex flex-col gap-1">
    <div className="pb-1 flex gap-2 items-center">
      <SystemIcon />
      <span className="font-grotesk font-bold text-xs text-[#64748b] uppercase">System Log</span>
      <span className="font-mono text-[10px] text-[#94a3b8]">{time}</span>
    </div>
    <div className="bg-[#f1f5f9] border border-[#e2e8f0] rounded p-3.5">
      <pre className="font-mono text-xs leading-[19.5px] m-0">
        <span className="font-bold text-[#6366f1]">EVENT_ID: {eventId}</span><br/>
        <span className="text-[#334155]">&gt; ROUTINE_CHECK_COMPLETE</span><br/>
        <span className="text-[#334155]">&gt; VITALS: {vitals}</span><br/>
        <span className="text-[#334155]">&gt; MEDICATION: '{meds}'</span>
      </pre>
    </div>
  </div>
);

const AnomalyAlert = ({ time, title, description, analysis }) => (
  <div className="max-w-3xl w-full flex flex-col gap-1">
    <div className="pb-1 flex gap-2 items-center">
      <AlertTriangleIcon />
      <span className="font-grotesk font-bold text-xs text-[#f59e0b] uppercase">Anomaly Detected</span>
      <span className="font-mono text-[10px] text-[#94a3b8]">{time}</span>
    </div>
    <div className="bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.3)] rounded p-3 flex gap-4">
      <div className="pt-0.5"><StethoscopeIcon /></div>
      <pre className="font-mono text-xs leading-[19.5px] m-0">
        <span className="font-bold text-[#f59e0b]">{title}</span><br/>
        <span className="text-[#1e293b]">&gt; {description}</span><br/>
        <span className="text-[#1e293b]">&gt; AI ANALYSIS: {analysis}</span><br/>
        <span className="text-[#1e293b]">&gt; ACTION: <span className="font-bold underline cursor-pointer">View Vitals Analysis</span></span>
      </pre>
    </div>
  </div>
);

const CareTeamSidebar = () => (
  <aside className="bg-white border-l border-[#e2e8f0] w-72 flex flex-col shrink-0">
    <div className="border-b border-[#e2e8f0] p-5">
      <div className="font-grotesk font-bold text-sm text-[#0f172a] tracking-wider uppercase mb-2">Care Team</div>
      <div className="flex gap-2 items-center">
        <div className="flex-1 bg-[#f1f5f9] h-1 rounded overflow-hidden">
          <div className="bg-[#10b981] h-full rounded" style={{ width: '75%' }}></div>
        </div>
        <span className="font-mono text-[10px] text-[#64748b]">3/4 ONLINE</span>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
      <TeamSection title="Medical Staff">
        <TeamMember name="Dr. Chen" role="Cardiologist" status="online" image="https://www.figma.com/api/mcp/asset/6ea8d1d9-0271-421e-8685-368a05c195bc" />
        <TeamMember name="Emergency Resp." role="On Call" status="online" isSystem />
        <TeamMember name="Nurse Ratched" role="Home Care" status="offline" image="https://www.figma.com/api/mcp/asset/af0610ee-8dcc-4dc0-8e25-c97de0073d31" />
      </TeamSection>
      <TeamSection title="Family">
        <TeamMember name="Sarah Doe" role="Daughter" status="offline" initials="SD" />
        <TeamMember name="You" role="Case Manager" status="online" image="https://www.figma.com/api/mcp/asset/0a59007e-a4df-4ea8-bf27-7e0b2f7adb61" />
      </TeamSection>
    </div>
    <div className="bg-[#f8fafc] border-t border-[#e2e8f0] p-4">
      <button className="w-full border border-[#cbd5e1] rounded py-2.5 flex gap-2 items-center justify-center hover:bg-white text-[#475569] font-grotesk font-bold text-xs uppercase">
        <InviteIcon /> Invite Member
      </button>
    </div>
  </aside>
);

const StatusBadge = ({ label }) => (
  <div className="bg-[#f1f5f9] border border-[#e2e8f0] rounded px-2.5 py-1">
    <span className="font-mono text-xs text-[#475569] tracking-wider uppercase">{label}</span>
  </div>
);

const ActionButton = ({ icon, title, subtitle, isAlert }) => (
  <button className={`bg-white border border-[#e2e8f0] rounded flex gap-4 items-center px-4 py-4 hover:bg-gray-50 flex-1 ${isAlert ? 'bg-[rgba(239,68,68,0.05)] border-[rgba(239,68,68,0.3)]' : ''}`}>
    <div className={`w-10 h-10 rounded flex items-center justify-center ${isAlert ? 'bg-[rgba(239,68,68,0.1)]' : 'bg-[rgba(20,20,235,0.1)]'}`}>
      {icon}
    </div>
    <div className="text-left">
      <div className={`font-grotesk font-bold text-sm tracking-wider uppercase ${isAlert ? 'text-[#ef4444]' : 'text-[#0f172a]'}`}>{title}</div>
      <div className="font-grotesk text-xs text-[#64748b]">{subtitle}</div>
    </div>
  </button>
);

const TeamSection = ({ title, children }) => (
  <div className="flex flex-col gap-3">
    <div className="pl-2 font-grotesk font-bold text-[10px] text-[#94a3b8] tracking-widest uppercase">{title}</div>
    <div className="flex flex-col gap-1">{children}</div>
  </div>
);

const TeamMember = ({ name, role, status, image, initials, isSystem }) => (
  <div className={`flex gap-3 items-center p-2 rounded hover:bg-gray-50 ${status === 'offline' ? 'opacity-60' : ''}`}>
    <div className="relative shrink-0">
      <div className="w-10 h-10 rounded border border-[#e2e8f0] overflow-hidden bg-[#f1f5f9] flex items-center justify-center">
        {image ? <img src={image} alt={name} className="w-full h-full object-cover" /> : isSystem ? <StarIcon /> : <span className="font-grotesk font-bold text-sm text-[#64748b]">{initials}</span>}
      </div>
      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border border-white rounded-full ${status === 'online' ? 'bg-[#10b981]' : 'bg-[#94a3b8]'}`}></div>
    </div>
    <div>
      <div className="font-grotesk font-bold text-sm text-[#0f172a]">{name}</div>
      <div className="bg-[#f1f5f9] rounded px-1.5 py-0.5 inline-block font-mono text-[10px] text-[#64748b] uppercase">{role}</div>
    </div>
  </div>
);

const DateDivider = ({ date }) => (
  <div className="flex items-center justify-center w-full">
    <div className="bg-[rgba(226,232,240,0.6)] rounded px-3 py-1">
      <span className="font-mono text-[10px] text-[#64748b] tracking-wider uppercase">{date}</span>
    </div>
  </div>
);

// Icons
const LogoIcon = () => <svg width="22" height="16" viewBox="0 0 22 16" fill="none"><path d="M11 0L13.5 4.5L18.5 5.5L15 9.5L16 14.5L11 12L6 14.5L7 9.5L3.5 5.5L8.5 4.5L11 0Z" fill="#6366f1"/><path d="M4 14L6 12M18 14L16 12M11 15V13" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const VideoIcon = () => <svg width="20" height="16" viewBox="0 0 20 16" fill="none"><rect x="1" y="1" width="18" height="14" rx="2" stroke="#1414eb" strokeWidth="1.5"/><circle cx="7" cy="8" r="2" stroke="#1414eb" strokeWidth="1.2"/><path d="M14 6L16 8L14 10" stroke="#1414eb" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const EscalateIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1L11 6H16L12 9.5L13.5 15L9 11.5L4.5 15L6 9.5L2 6H7L9 1Z" fill="#ef4444"/></svg>;
const ReportIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="1.5" stroke="#6366f1" strokeWidth="1.3"/><line x1="5" y1="6" x2="13" y2="6" stroke="#6366f1" strokeWidth="1.2"/><line x1="5" y1="9" x2="13" y2="9" stroke="#6366f1" strokeWidth="1.2"/><line x1="5" y1="12" x2="10" y2="12" stroke="#6366f1" strokeWidth="1.2"/></svg>;
const SystemIcon = () => <svg width="13" height="11" viewBox="0 0 13 11" fill="none"><path d="M6.5 1V4M2 8H11M3 5L6.5 1L10 5" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><rect x="1" y="5" width="11" height="5" rx="1" stroke="#64748b" strokeWidth="1.2"/></svg>;
const AlertTriangleIcon = () => <svg width="13" height="11" viewBox="0 0 13 11" fill="none"><path d="M6.5 1L12 10H1L6.5 1Z" stroke="#f59e0b" strokeWidth="1.2"/><line x1="6.5" y1="4.5" x2="6.5" y2="7" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round"/><circle cx="6.5" cy="8.5" r="0.5" fill="#f59e0b"/></svg>;
const StethoscopeIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L1 5L3 6.5V11L7 13L11 11V6.5L13 5L7 1Z" stroke="#f59e0b" strokeWidth="1.2" strokeLinejoin="round"/></svg>;
const StarIcon = () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1L9 5H13L10 8L11 12L7.5 9.5L4 12L5 8L2 5H6L7.5 1Z" stroke="#64748b" strokeWidth="1" strokeLinejoin="round"/></svg>;
const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><line x1="7" y1="1" x2="7" y2="13" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/><line x1="1" y1="7" x2="13" y2="7" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const MicIcon = () => <svg width="12" height="16" viewBox="0 0 12 16" fill="none"><rect x="3" y="1" width="6" height="9" rx="3" stroke="currentColor" strokeWidth="1.3"/><path d="M1 8C1 11 3 13 6 13C9 13 11 11 11 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><line x1="6" y1="13" x2="6" y2="15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
const SendIcon = () => <svg width="13" height="11" viewBox="0 0 13 11" fill="none"><path d="M1 5.5L11 1L7 5.5M1 5.5L11 10L7 5.5M1 5.5H7" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const InviteIcon = () => <svg width="15" height="11" viewBox="0 0 15 11" fill="none"><path d="M10 1H14V5M1 5.5C2 3 4.5 1 7.5 1" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="5" cy="7" r="3" stroke="#475569" strokeWidth="1.2"/><line x1="9" y1="7" x2="14" y2="7" stroke="#475569" strokeWidth="1.2" strokeLinecap="round"/></svg>;

export default CommunicationHub;