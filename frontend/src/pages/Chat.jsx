import React from 'react';

const chat = () => {
  return (
    <div className="bg-slate-50 dark:bg-[#101722] font-sans text-slate-900 dark:text-slate-100 antialiased overflow-hidden">
      <div className="flex h-screen w-full flex-col">
        
        {/* Top Navigation Bar */}
        <header className="flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 z-20">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <span className="material-symbols-outlined text-3xl">medical_services</span>
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight tracking-tight">HealthAI Nurse</h2>
              <p className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">Preventive Care v2.4</p>
            </div>
          </div>

          <div className="hidden md:flex items-center px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-sm mr-2">error</span>
            <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
              Disclaimer: AI Assistant. Not for emergencies. Call 911 for urgent care.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center rounded-xl h-10 px-4 bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
              <span className="material-symbols-outlined text-lg mr-2">emergency_home</span>
              Escalate to Doctor
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
            <button className="flex size-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="size-10 rounded-full border-2 border-blue-600/20 p-0.5">
              <img 
                alt="User Profile" 
                className="h-full w-full rounded-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOzY3PPy9a8LnnrYvvks9i37bJL3p4ognNXP-ZlNYFQ8fwOgs94Sl9Z3Mc1g-j9LnBHpmuxqxij4LViiWRSfWM568vyEwHT_W7XuKMxFr_Sad-6Wa6l7u09HhyTRJIiTG973mypOLLNurJcPxpNYXJCZGUuOpdx6EYaa9hXTDP-AUDBjivxg44qeSgiM86OQeXizwflAY4vEmAaXJmK2U-pi-bDkfVpdxANDe7zZq32nrWK4X1kIvAjGotodIHYof1VQQpvVeA9WrP" 
              />
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar: Recent Topics */}
          <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col hidden lg:flex">
            <div className="p-6">
              <button className="flex w-full items-center justify-between rounded-xl bg-slate-100 dark:bg-slate-800 p-4 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span>New Consultation</span>
                <span className="material-symbols-outlined">add_circle</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4">
              <h3 className="px-2 mb-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Recent Consultations</h3>
              <div className="space-y-1">
                {/* Active Item */}
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 cursor-pointer">
                  <span className="material-symbols-outlined text-blue-600">glucose</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Glucose Level Review</p>
                    <p className="text-[11px] text-slate-500">Today, 10:30 AM</p>
                  </div>
                </div>
                {/* Sidebar Items */}
                {['Morning BP Analysis', 'Sleep Cycle Report', 'Medication Adjustment'].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 transition-colors">history</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{text}</p>
                      <p className="text-[11px] text-slate-500">Oct {24-i}, 2025</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="material-symbols-outlined text-slate-500">verified_user</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight">Your data is encrypted and HIPAA compliant.</p>
              </div>
            </div>
          </aside>

          {/* Main Chat Interface */}
          <main className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0f172a] relative">
            <div className="flex-1 overflow-y-auto p-6 lg:p-12">
              <div className="max-w-4xl mx-auto space-y-8">
                
                {/* AI Message */}
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                    <img alt="Nurse Avatar" className="rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN8970-Ap3IVu3zYE_8L1ozEb0mj26QY43-_Jra7HhhWoqG13OopimIqlCzIb-wurnT41U8ljr_CKALG7holm41xZT3EF-61OeKYH_JkEO6s1Nrcy5MjAZQZg4c_dveyGgWVse-wInlvmxkqddKPNxb-y8yZAhhHxQ9c7Tzp30rJW5jOEd4iRDiEUm4Rtq01ctnQEFlkOzVN6YRa9f14EyenVrKOqel89fcTPRZnLBFNA_YvT3NyPGs4Hr4C6aoEC2BqX9-K4Kb7Dh" />
                  </div>
                  <div className="flex flex-col gap-2 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">HealthAI Nurse</span>
                      <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-600 text-[10px] font-bold rounded uppercase">Verified AI</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700 leading-relaxed text-slate-800 dark:text-slate-200">
                      Hello! I've analyzed your glucose data. Your readings are currently at <strong className="text-blue-600 font-bold">142 mg/dL</strong>.
                      <br /><br />
                      Have you consumed any meals in the last hour?
                    </div>
                    <span className="text-[11px] text-slate-400 ml-1">10:31 AM</span>
                  </div>
                </div>

                {/* User Message */}
                <div className="flex items-start gap-4 justify-end">
                  <div className="flex flex-col gap-2 max-w-[80%] items-end">
                    <div className="bg-blue-600 p-5 rounded-2xl rounded-tr-none shadow-lg shadow-blue-600/10 text-white leading-relaxed">
                      Yes, I had a bowl of oatmeal with blueberries about 45 minutes ago.
                    </div>
                    <span className="text-[11px] text-slate-400 mr-1">10:33 AM</span>
                  </div>
                  <div className="size-10 rounded-full border-2 border-blue-600/20 p-0.5 shrink-0">
                    <img alt="User" className="rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQm2NuUNQjlxtJVAZutjg1RtmsxJe11e5wmvSmRafJk1StS_OtUYbMN2_mNlpHW2KPpnOKm7Q-sMMcmeeNB4_lnboqyE2gA4DzdIwagFvvGWjbfqsZyI5NtSCG7PzCxl_LcyMcHNslA8gWytOOpFibqURaHiU-YauFd-Jhx5J5NWp2P-CSc_qalzkHUNh-JFi9cDiaTLnmFACZPXz6DsU425CsOOGP_j8SNicw9qbCwUxUcALGxU7n744FqtpOlEgpj1lbN1iFVhIm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Input Area */}
            <div className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 lg:p-6">
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap mr-2">Quick Prompts:</span>
                  {['Analyze glucose', 'Log heart rate', 'Exercise advice'].map((chip) => (
                    <button key={chip} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-500/10 hover:text-blue-600 transition-all rounded-full text-xs font-semibold whitespace-nowrap border border-transparent hover:border-blue-500/20">
                      {chip}
                    </button>
                  ))}
                </div>

                <div className="relative flex items-end gap-3 bg-slate-50 dark:bg-slate-800 rounded-2xl p-2 border border-slate-200 dark:border-slate-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                  <button className="flex size-10 items-center justify-center rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
                    <span className="material-symbols-outlined">attach_file</span>
                  </button>
                  <textarea 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 dark:text-slate-200 py-3 resize-none max-h-40" 
                    placeholder="Describe how you're feeling..." 
                    rows="1"
                  ></textarea>
                  <div className="flex items-center gap-1 pr-1 pb-1">
                    <button className="flex size-10 items-center justify-center rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
                      <span className="material-symbols-outlined">mic</span>
                    </button>
                    <button className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all">
                      <span className="material-symbols-outlined">send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default chat;