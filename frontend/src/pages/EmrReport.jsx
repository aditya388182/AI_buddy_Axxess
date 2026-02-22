import React from 'react';

const EmrReport = () => {
  // Mock Data for the table - makes the JSX much cleaner
  const vitalsData = [
    { date: "Oct 24, 08:30", bp: "142 / 91", hr: "78", spo2: "98", trend: "text-red-500", icon: "trending_up" },
    { date: "Oct 23, 19:15", bp: "138 / 88", hr: "74", spo2: "99", trend: "text-slate-400", icon: "trending_flat" },
    { date: "Oct 23, 08:45", bp: "135 / 85", hr: "72", spo2: "98", trend: "text-green-500", icon: "trending_down" },
    { date: "Oct 22, 20:00", bp: "140 / 90", hr: "80", spo2: "97", trend: "text-slate-400", icon: "trending_flat" },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-50 dark:bg-[#101922] font-sans text-slate-900 dark:text-slate-100 antialiased min-h-screen">
      
      {/* Top Navigation Bar (No-Print) */}
      <header className="no-print sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#101922]/80 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-blue-700">
              <span className="material-symbols-outlined text-3xl">medical_services</span>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">HealthAI Nurse</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              {['Patients', 'Reports', 'Analytics', 'Settings'].map((item) => (
                <a key={item} href="#" className={`text-sm font-medium ${item === 'Reports' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-600'} hover:text-blue-700 transition-colors`}>
                  {item}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input 
                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-600" 
                placeholder="Search patients..." 
                type="text" 
              />
            </div>
            <button className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-800 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span className="hidden lg:inline">Generate Latest EMR Report</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sub-header Breadcrumbs */}
      <div className="no-print max-w-[1000px] mx-auto px-4 py-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <a className="hover:text-blue-700" href="#">Patient List</a>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-slate-200 font-medium">Alexander Thompson</span>
          </nav>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight text-uppercase">EMR Compatible Health Report</h2>
          <p className="text-slate-500 mt-1">Status: <span className="text-green-600 font-semibold">Verified</span> • Last sync: Today, 08:42 AM</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-lg">download</span> Export
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-lg">print</span> Print Report
          </button>
        </div>
      </div>

      {/* Main Report Container */}
      <main className="max-w-[1000px] mx-auto px-4 pb-20">
        <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden min-h-[1200px] p-10 md:p-16">
          
          {/* Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 text-[8rem] font-black text-slate-900/5 pointer-events-none z-0 whitespace-nowrap">
            CONFIDENTIAL
          </div>

          {/* Report Header */}
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start border-b-2 border-slate-900 dark:border-white pb-8 mb-8">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                <img alt="Patient" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2B9zIo-pIrqrg0AUIagKnUAw2BfVt12S4LAu3ZA3IGW_Z5RfU4SVKY6QG3B4LM6_2v0CQRApyWbl_jyd37m01WV80uOgwpNv5i5CcXWBi4g72BfOS0k5UwhwaNdJRueeAlv69o4_XXmxRAMS3TuiqNR6cICjaP_FmpIvsyW_vkIPPMS7fNPESond5egDBiRmVzaa_IRTSS3L2yqJB7grn_XUtgJu0SF_tvnOS-VwzS9pR5R8cEuid4hUpjMROE_Z-VhGjSURpyIHg" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">ALEXANDER THOMPSON</h3>
                <p className="text-sm font-bold text-blue-700 mb-2 tracking-widest">MRN: 482-991-002</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                  <p><span className="text-slate-500 uppercase text-[10px] font-bold block">DOB</span> 12/05/1978</p>
                  <p><span className="text-slate-500 uppercase text-[10px] font-bold block">Gender</span> Male</p>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-0 text-right">
              <div className="flex items-center justify-end gap-2 text-blue-700 font-bold mb-1">
                <span className="material-symbols-outlined">apartment</span>
                <span className="text-sm">Metro General Hospital</span>
              </div>
              <p className="text-xs text-slate-400">Clinical Summary Report v4.2</p>
            </div>
          </div>

          {/* AI Alerts */}
          <section className="relative z-10 mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-blue-700">psychology</span>
              <h4 className="text-lg font-bold">AI Clinical Insights</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-700 p-4 rounded-r-lg">
                <p className="text-sm font-bold text-blue-700 uppercase mb-1">Hypertension Risk</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">Detects 15% increase in resting systolic pressure. Predicted risk is High (82%).</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/10 border-l-4 border-green-600 p-4 rounded-r-lg">
                <p className="text-sm font-bold text-green-700 uppercase mb-1">Adherence</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">98% adherence rate recorded via smart-cap integration.</p>
              </div>
            </div>
          </section>

          {/* Vitals Table */}
          <section className="relative z-10 mb-10">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Recent Observations</h4>
            <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-lg">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-bold">Date/Time</th>
                    <th className="px-4 py-3 font-bold">BP (mmHg)</th>
                    <th className="px-4 py-3 font-bold">HR (bpm)</th>
                    <th className="px-4 py-3 font-bold">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {vitalsData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3">{row.date}</td>
                      <td className={`px-4 py-3 font-bold ${row.bp.includes('142') ? 'text-red-600' : ''}`}>{row.bp}</td>
                      <td className="px-4 py-3">{row.hr}</td>
                      <td className="px-4 py-3"><span className={`material-symbols-outlined ${row.trend}`}>{row.icon}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Assessment */}
          <section className="relative z-10 mb-12">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Structured AI Assessment</h4>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic">
                "Patient remains clinically stable for chronic lipid management. However, recent longitudinal BP data suggests early signs of Stage 1 Hypertension resistance..."
              </p>
            </div>
          </section>

          {/* Signatures */}
          <div className="relative z-10 mt-16 pt-10 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end">
            <div>
              <div className="h-12 border-b-2 border-slate-900 dark:border-white mb-2 flex items-end">
                <img alt="Signature" className="h-10 opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFCJRgpqAeLrVXtYPWf4hcr-gtp1wnR7R6YyJ1rPBbXZHT6Ocycx1hg8sP9SoHUlu_dL7yK_3O8Y1TkDkloXdnvtTk1ZBq0qQjPAhvkkB19vZnlMj-PYdIBn7nDjnuqQASoVNQxPVyT1TfMj2aiUcTzwuRsfiBEB2Q8bYSfKCZeiPQKecSu-y3nyHM_9yG3hqxHqcJkb9aHEcJ4PbQKf3z10ZcNSyDS2eMHm90Le_S2inEsoFkaXpdHy0gcehj-0uxjGsE0-P39dfQ" />
              </div>
              <p className="text-xs font-bold uppercase">Dr. Sarah Jenkins, MD</p>
            </div>
            <div className="text-right">
              <img alt="QR Code" className="w-16 h-16 inline-block mb-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVm59eP-maabc2iBzBAm9cXl5O_zrvQKKujj0v4gnqm6z5gfFUpflT0pK-dI1OxgZUqK1hRuounoSclNx9eHek_vq6b9lcYBuddrcK8gKyz0IzR6Teqbz_eGABqhmLhda58j-ZIq6yGuyq_-h3-xtJiTzKSyl9uxCkMElDvbERUFW2bvb55jfktTTzeM7HGJTRYulRynSiLhq-kqkEswFF3hp3SjJIlUgxVgkYH4IolyzcWwvBV6Ze7OXW3WzIyzjvPhqihTfYTBq7" />
              <p className="text-[10px] font-mono text-slate-400">9912-XA-4482-P910</p>
            </div>
          </div>

        </div>
      </main>

      {/* Print Footer */}
      <div className="hidden print:block fixed bottom-0 left-0 w-full p-8 text-[10px] text-slate-400 border-t border-slate-100">
        Page 1 of 1 • HealthAI Nurse Clinical System • {new Date().toLocaleDateString()}
      </div>

    </div>
  );
};

export default EmrReport;