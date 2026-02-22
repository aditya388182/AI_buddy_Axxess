import React from 'react';

const NurseConsultInterface = () => {
  // Mock data for the schedule - easily replaceable with API data
  const morningTasks = [
    { 
      id: 1, 
      name: "Lisinopril", 
      type: "Medication", 
      time: "08:00 AM", 
      detail: "10mg Tablet", 
      status: "completed", 
      loggedTime: "08:05 AM", 
      icon: "check_circle", 
      color: "text-emerald-600", 
      bgColor: "bg-emerald-500/10" 
    },
    { 
      id: 2, 
      name: "Blood Pressure Check", 
      type: "Health Task", 
      time: "10:30 AM (Due Now)", 
      detail: "Standard measurement", 
      status: "due", 
      icon: "monitor_heart", 
      color: "text-blue-600", 
      bgColor: "bg-blue-600/10" 
    },
  ];

  const afternoonTasks = [
    { 
      id: 3, 
      name: "Atorvastatin", 
      type: "Medication", 
      time: "01:00 PM", 
      detail: "20mg Capsule", 
      status: "pending", 
      icon: "pill" 
    },
  ];

  const eveningTasks = [
    { 
      id: 4, 
      name: "Metformin", 
      type: "Medication", 
      time: "06:00 PM", 
      detail: "500mg Tablet", 
      status: "pending", 
      icon: "pill" 
    },
    { 
      id: 5, 
      name: "Glucose Level Check", 
      type: "Health Task", 
      time: "08:00 PM", 
      detail: "Fasting reading", 
      status: "pending", 
      icon: "water_drop" 
    },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0f1923] text-slate-900 dark:text-slate-100 font-sans">
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
            { n: 'Dashboard', i: 'dashboard' },
            { n: 'AI Chat', i: 'chat' },
            { n: 'Reminders', i: 'notifications', active: true },
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
          <div className="bg-blue-600/10 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold">Stable Condition</span>
            </div>
            <button className="w-full py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 uppercase tracking-wider">Emergency SOS</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold">Today's Schedule</h2>
            <p className="text-sm text-slate-500">Manage medications and health tasks</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-white dark:bg-slate-700 shadow-sm text-blue-600">Day</button>
              <button className="px-4 py-1.5 text-sm font-medium text-slate-500">Week</button>
            </div>
            <img alt="User" className="size-10 rounded-full border-2 border-blue-600/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbzXycHVwfbJI52orKb65GqL8-lvikhJchkOZaC1oTeLVZnqjpWxX2jnvQSyHn4Dae8FFC0Mjl5_-85CeZJEZfGVc_r1OkkB6SOn8SfGREOTfp-zYHYc3bI_rev_mCdCWkQa8c_5e9JT3UFxojoCCNSfMv4tI1Zg8zZoA2IC1JwP9TqzON8pdo4lQvwnMGYRRCQmX9TjQT3nmDgkd4-CtQLko8QbIpMGOWYR-CVlNodpvHn9EIuYapILpb0t0ehmMSWtc8JVLqo8Nd" />
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto w-full">
          {/* Calendar View */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 mb-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <h3 className="text-xl font-bold">June 2024</h3>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={day} className="text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">{day}</p>
                  <div className={`size-12 mx-auto flex items-center justify-center rounded-xl text-lg font-bold ${day === 'Fri' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:border-blue-600/30 border border-transparent'}`}>
                    {20 + i}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-6 pl-10 space-y-12">
            
            {/* Morning Section */}
            <section className="relative">
              <div className="absolute -left-[49px] top-1 bg-white dark:bg-slate-900 border-2 border-blue-600 size-4 rounded-full z-10" />
              <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-6">Morning Schedule</h4>
              <div className="space-y-4">
                {morningTasks.map((task) => (
                  <div key={task.id} className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border ${task.status === 'due' ? 'border-blue-600/20 border-2' : 'border-slate-100 dark:border-slate-800'} flex items-center justify-between shadow-sm`}>
                    <div className="flex items-center gap-5">
                      <div className={`size-14 rounded-xl ${task.bgColor || 'bg-slate-100 dark:bg-slate-800'} ${task.color || 'text-slate-500'} flex items-center justify-center`}>
                        <span className="material-symbols-outlined text-3xl">{task.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="text-lg font-bold">{task.name}</h5>
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase rounded">{task.type}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className={`flex items-center gap-1 ${task.status === 'due' ? 'text-blue-600 font-bold' : ''}`}>
                            <span className="material-symbols-outlined text-sm">schedule</span> {task.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    {task.status === 'completed' ? (
                      <span className="text-emerald-600 font-bold text-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-lg">verified</span> Logged at {task.loggedTime}
                      </span>
                    ) : (
                      <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl">add_chart</span> Log
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Afternoon/Evening Sections would follow same pattern */}
            <section className="relative opacity-75">
               <div className="absolute -left-[49px] top-1 bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 size-4 rounded-full z-10" />
               <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Later Today</h4>
               {/* Simplified mapping for demonstration */}
               {[...afternoonTasks, ...eveningTasks].map(task => (
                 <div key={task.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-5">
                      <div className="size-14 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">{task.icon}</span>
                      </div>
                      <h5 className="text-lg font-bold">{task.name}</h5>
                    </div>
                    <button className="px-6 py-3 border-2 border-slate-200 dark:border-slate-700 text-slate-600 font-bold rounded-xl hover:text-blue-600 hover:border-blue-600 transition-all">Confirm</button>
                 </div>
               ))}
            </section>

          </div>

          {/* AI Insight Card */}
          <div className="mt-8 bg-blue-600 text-white rounded-2xl p-8 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-6">
              <div className="size-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="material-symbols-outlined text-4xl">auto_awesome</span>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-1">Medication Adherence Insight</h4>
                <p className="text-blue-100 opacity-90 max-w-xl">You've completed all morning meds for 14 days straight. Great consistency, Aditya!</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NurseConsultInterface;