import React from 'react';

const MainDashBoard = () => {
  // Mock data for Vitals - Easy to replace with API data later
  const vitals = [
    { label: "Sleep", value: "7.5", unit: "hrs", trend: "+12% from avg", icon: "bedtime", color: "text-indigo-500", trendColor: "text-green-500" },
    { label: "Heart Rate", value: "72", unit: "bpm", trend: "Resting: Stable", icon: "favorite", color: "text-red-500", trendColor: "text-green-500" },
    { label: "Stress", value: "Low", unit: "", trend: "Level 2/10", icon: "psychology", color: "text-amber-500", trendColor: "text-slate-400" },
    { label: "BMI", value: "23.4", unit: "", trend: "Normal Range", icon: "monitor_weight", color: "text-teal-500", trendColor: "text-green-500" },
    { label: "Water Intake", value: "1.8", unit: "L", trend: "Goal: 2.5L", icon: "water_drop", color: "text-sky-500", trendColor: "text-amber-500" },
    { label: "Blood Pressure", value: "120/80", unit: "", trend: "Optimal Range", icon: "blood_pressure", color: "text-rose-500", trendColor: "text-green-500" },
  ];

  return (
    <div className="bg-slate-50 dark:bg-[#0f1923] text-slate-900 dark:text-slate-100 min-h-screen flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 rounded-lg p-2 text-white">
            <span className="material-symbols-outlined text-2xl">medical_services</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">HealthAI</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Nurse Platform</p>
          </div>
        </div>
        
        <nav className="flex-1 mt-4 px-3 space-y-1">
          {[
            { n: 'Dashboard', i: 'dashboard', active: true },
            { n: 'AI Chat', i: 'chat' },
            { n: 'Reminders', i: 'notifications' },
            { n: 'Reports', i: 'description' },
            { n: 'Settings', i: 'settings' }
          ].map((item) => (
            <a 
              key={item.n}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${item.active ? 'bg-blue-600/10 text-blue-600 border-r-4 border-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} 
              href="#"
            >
              <span className="material-symbols-outlined">{item.i}</span>
              <span className={item.active ? 'font-semibold' : 'font-medium'}>{item.n}</span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="bg-blue-600/10 rounded-xl p-4">
            <p className="text-xs text-blue-600 font-bold uppercase mb-1">Upgrade Plan</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 leading-snug">Get premium access to advanced metrics.</p>
            <button className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700">Upgrade Now</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, Aditya</h2>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
              <span className="material-symbols-outlined text-sm">sync</span>
              <span>Last synced: 2 mins ago</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20">
              <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-bold">Status: Stable</span>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all text-sm">
              <span className="material-symbols-outlined text-lg">emergency</span> EMERGENCY
            </button>
            <img alt="User" className="size-10 rounded-full border-2 border-blue-600/20 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbzXycHVwfbJI52orKb65GqL8-lvikhJchkOZaC1oTeLVZnqjpWxX2jnvQSyHn4Dae8FFC0Mjl5_-85CeZJEZfGVc_r1OkkB6SOn8SfGREOTfp-zYHYc3bI_rev_mCdCWkQa8c_5e9JT3UFxojoCCNSfMv4tI1Zg8zZoA2IC1JwP9TqzON8pdo4lQvwnMGYRRCQmX9TjQT3nmDgkd4-CtQLko8QbIpMGOWYR-CVlNodpvHn9EIuYapILpb0t0ehmMSWtc8JVLqo8Nd" />
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Hero CTA */}
          <section>
            <div className="relative overflow-hidden bg-blue-600 rounded-2xl p-8 text-white shadow-xl flex items-center min-h-[220px]">
              <div className="relative z-10 max-w-2xl">
                <h3 className="text-3xl font-black mb-3 leading-tight">Start Your AI Consultation</h3>
                <p className="text-lg opacity-90 mb-6 leading-relaxed">
                  Have questions about your vitals or medication? Our HealthAI Nurse is ready to assist.
                </p>
                <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-3">
                  <span className="material-symbols-outlined">forum</span> Launch Chat
                </button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-12 gap-6">
            {/* Activity Card */}
            <div className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-bold text-xl flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-blue-600">directions_run</span> Activity
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                <div><p className="text-2xl font-black">842</p><p className="text-[10px] text-slate-500 uppercase font-bold">Kcal</p></div>
                <div className="border-x border-slate-100 dark:border-slate-800"><p className="text-2xl font-black">6,432</p><p className="text-[10px] text-slate-500 uppercase font-bold">Steps</p></div>
                <div><p className="text-2xl font-black">45</p><p className="text-[10px] text-slate-500 uppercase font-bold">Mins</p></div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="size-10 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">pool</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Morning Swim</p>
                    <p className="text-xs text-slate-500">30 mins • 320 kcal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vitals Grid */}
            <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-bold text-xl flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-blue-600">vital_signs</span> Health Vitals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {vitals.map((v, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-600/30 transition-colors bg-slate-50/30 dark:bg-slate-800/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`material-symbols-outlined ${v.color} text-sm`}>{v.icon}</span>
                      <span className="text-xs font-bold text-slate-500 uppercase">{v.label}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black">{v.value}</span>
                      <span className="text-sm text-slate-400 font-medium">{v.unit}</span>
                    </div>
                    <p className={`text-[10px] ${v.trendColor} font-medium mt-1`}>{v.trend}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Tracking Section */}
            <div className="col-span-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="relative flex items-center justify-center">
                    <svg className="size-32" viewBox="0 0 100 100">
                      <circle className="text-slate-100 dark:text-slate-800" cx="50" cy="50" fill="transparent" r="44" stroke="currentColor" strokeWidth="8" />
                      <circle className="text-blue-600" cx="50" cy="50" fill="transparent" r="44" stroke="currentColor" strokeWidth="8" strokeDasharray="276" strokeDashoffset="69" strokeLinecap="round" />
                    </svg>
                    <div className="absolute text-center">
                      <span className="block text-2xl font-black">1,850</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">of 2.4k</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold">Daily Calorie Goal</h4>
                    <p className="text-sm text-slate-500">550 kcal remaining for today.</p>
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 w-full max-w-xl">
                  {[['Protein', '70%', 'bg-blue-500'], ['Carbs', '60%', 'bg-amber-500'], ['Fats', '55%', 'bg-rose-500'], ['Vitamins', '92%', 'bg-teal-500']].map(([label, width, color]) => (
                    <div key={label} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                        <span>{label}</span>
                        <span className="text-slate-900 dark:text-white">{width}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full">
                        <div className={`h-full ${color} rounded-full`} style={{ width }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainDashBoard;