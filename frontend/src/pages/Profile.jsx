import React, { useState } from 'react';

const Profile = () => {
  // Local state to handle form inputs (Mock data based on Aditya's profile)
  const [userProfile, setUserProfile] = useState({
    name: "Aditya",
    age: 32,
    bloodType: "O+",
    weight: 82,
    height: 180,
    physician: "Dr. Sarah Mitchell",
    conditions: ["Hypertension", "Type 2 Diabetes"]
  });

  const syncPlatforms = [
    { 
      name: "Apple Health", 
      status: "Live Syncing", 
      connected: true, 
      desc: "Steps, Heart Rate, Sleep", 
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.05 20.28c-.98.95-2.05 1.72-3.21 1.72-1.12 0-1.46-.71-2.77-.71-1.33 0-1.74.69-2.77.71-1.11.02-2.18-.73-3.14-1.68C3.12 18.3 2 15.65 2 13.06c0-4.04 2.62-6.17 5.17-6.17 1.34 0 2.45.85 3.23.85.76 0 1.96-.91 3.51-.91 1.63 0 3.03.88 3.86 2.15-3.39 1.63-2.84 6.27.78 7.74-.63 1.55-1.5 3.56-2.5 5.56zM11.97 6.1c0-2.32 1.9-4.1 4.2-4.1.04 2.37-1.93 4.26-4.2 4.1z"></path>
        </svg>
      )
    },
    { 
      name: "Samsung Health", 
      status: "Inactive", 
      connected: false, 
      desc: "Import activity and calorie tracking data.", 
      icon: <span className="material-symbols-outlined text-[32px]">directions_run</span> 
    },
    { 
      name: "Google Fit", 
      status: "Inactive", 
      connected: false, 
      desc: "Centralize your fitness metrics.", 
      icon: (
        <div className="grid grid-cols-2 gap-1">
          <div className="size-3 bg-red-500 rounded-full"></div>
          <div className="size-3 bg-blue-500 rounded-full"></div>
          <div className="size-3 bg-green-500 rounded-full"></div>
          <div className="size-3 bg-yellow-500 rounded-full"></div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-[#101922] text-slate-900 dark:text-slate-100 min-h-screen font-sans">
      <div className="flex flex-col grow">
        
        {/* Top Navigation */}
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-10 py-3 sticky top-0 z-50">
          <div className="flex items-center gap-8 text-blue-600">
            <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold">HealthAI Nurse</h2>
            <nav className="flex items-center gap-9">
              {['Dashboard', 'Patients', 'Reports', 'Profile'].map((link) => (
                <a 
                  key={link} 
                  href="#" 
                  className={`text-sm transition-colors ${link === 'Profile' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-1' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 font-medium'}`}
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="rounded-full size-10 ring-2 ring-blue-600/20 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDpqhJZT0mrZ-QeS_9T3O6U7OnnZacpKnA8OKlFRU4MhRfT4m8yvntLAI8oLj7lue5NzQQnrwcLUP-Jsl7QXJW9IqEcw9eyhk9id6FJxreYjZ3s8ZYesD0ZiWrCy9fszzwsOA3v3yUOsDze2vDTEC6FbwoGP7K5DADyy7vHweRV7oD8m9CzW13proucGjO0THqCtVzRwJ0nfeJTcg9sopOGiPcAopzeIEoCDF-IOvRRuZrfunefz14w80_ZylIfQTFZFo2G6gsBdVcm")' }}></div>
          </div>
        </header>

        <main className="flex flex-1 justify-center py-10 px-4 md:px-10 lg:px-40">
          <div className="flex flex-col max-w-[1100px] flex-1 gap-8">
            
            {/* Profile Header Card */}
            <section className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="h-32 w-32 rounded-full border-4 border-blue-600/10 shadow-lg bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBnKfiq7SXs3ytNAmAIKa3D9VFLMo86Gsv3UXQuB6D2SgjSeTMiqF0mDTKMCkFuY0CUUrhCSve7tfeByLeAbzFRSV80ZzvZ4R5vmpjCmDa2aq1S6Dy1MRZlR1Vs0e9itt9m9mIcTy2ddmQ4AfsbrsiepdiqLAQwKLwLt7vcSF_-_Rc6kbRGOJPw6-G_LEflyabupSWPEApjnEAFsxuG5tTcOw6iKeZ54rTlaHIIdIBA_-Cu2FwiqGhhP_gkk7dm3Bs5xTGKQP_cbC8h")' }}></div>
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors">
                      <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    </button>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold">{userProfile.name}</h1>
                      <span className="bg-green-100 text-green-700 dark:bg-green-900/30 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase">Active</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">{userProfile.age} years old • Male • {userProfile.bloodType} Positive</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {userProfile.conditions.map(c => (
                        <span key={c} className="bg-blue-600/10 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-600/20 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">medical_services</span> {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:opacity-90 transition-all">Save Changes</button>
                </div>
              </div>
            </section>

            {/* Forms Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6">
                <h3 className="text-lg font-bold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <span className="material-symbols-outlined text-blue-600">person</span> Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase text-slate-500">Weight (kg)</span>
                    <input className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-sm focus:ring-blue-600" type="number" defaultValue={userProfile.weight} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase text-slate-500">Height (cm)</span>
                    <input className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-sm focus:ring-blue-600" type="number" defaultValue={userProfile.height} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase text-slate-500">Primary Physician</span>
                  <input className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-sm focus:ring-blue-600" type="text" defaultValue={userProfile.physician} />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6">
                <h3 className="text-lg font-bold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <span className="material-symbols-outlined text-red-500">emergency</span> Emergency Contacts
                </h3>
                <div className="flex flex-col gap-4">
                  <input className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-sm" placeholder="Contact Name" defaultValue="Jane Doe" />
                  <input className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-sm" placeholder="Relationship" defaultValue="Spouse" />
                </div>
              </div>
            </div>

            {/* Data Sync Hub */}
            <section className="flex flex-col gap-6 pb-20">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-600 text-3xl">sync_alt</span> Data Sync Hub
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {syncPlatforms.map((platform) => (
                  <div key={platform.name} className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 transition-all hover:scale-[1.02] ${platform.connected ? 'border-blue-600/40 shadow-lg shadow-blue-600/5' : 'border-slate-200 dark:border-slate-800 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className={`${platform.connected ? 'bg-black text-white' : 'bg-slate-100 dark:bg-slate-800 text-blue-600'} p-3 rounded-xl`}>
                        {platform.icon}
                      </div>
                      <div className={`w-11 h-6 rounded-full relative transition-colors ${platform.connected ? 'bg-blue-600' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 left-1 bg-white size-4 rounded-full transition-all ${platform.connected ? 'translate-x-5' : ''}`} />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold">{platform.name}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{platform.desc}</p>
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${platform.connected ? 'text-green-500' : 'text-slate-400'}`}>
                        {platform.connected && <span className="material-symbols-outlined text-[16px]">check_circle</span>}
                        {platform.status}
                      </span>
                      <button className="text-slate-400 hover:text-blue-600 transition-colors">
                        <span className="material-symbols-outlined">settings</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;