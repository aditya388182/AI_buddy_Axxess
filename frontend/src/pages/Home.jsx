import React from 'react';

const Home = () => {
  return (
    <div className="bg-slate-50 dark:bg-[#101922] min-h-screen flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 lg:px-10 py-3 z-10">
        <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
          <div className="size-8 text-blue-600">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
              <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">HealthAI Nurse</h2>
        </div>
        <div className="flex items-center gap-4 lg:gap-8">
          <nav className="hidden md:flex items-center gap-6">
            <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-blue-600 transition-colors" href="#">Features</a>
            <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-blue-600 transition-colors" href="#">How it Works</a>
            <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-blue-600 transition-colors" href="#">Support</a>
          </nav>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
          <p className="text-sm text-slate-600 dark:text-slate-400 hidden sm:block">New user?</p>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-bold tracking-wide hover:bg-blue-700 transition-all shadow-sm">
            Sign Up
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Hero Section */}
        <section className="hidden lg:flex flex-1 flex-col justify-center px-12 xl:px-24 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600 blur-[120px]"></div>
            <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] rounded-full bg-blue-300 blur-[100px]"></div>
          </div>
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Trusted by 50k+ Patients
            </div>
            <h1 className="text-slate-900 dark:text-slate-100 text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight mb-6">
              Your 24/7 AI Health Companion
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg xl:text-xl leading-relaxed mb-10">
              Proactive care for chronic condition management. Professional preventive healthcare at your fingertips.
            </p>
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800">
              <div 
                className="w-full h-full bg-cover bg-center" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC9IjHmYB4iIE-x8YOHEZbqFGBh19HrlTunqw3k8PC577fxnrtI9LWc_BKZq47vBR35AO6PCmi7ge8fWc5uAMmxt2iIsF5TZN9FYdhdaCNdhfkptcq8-A__Rttcz_CVKtH8ZjLGmc6LQkODNPua3jZM2PvsZKbrTluSjHwbxoFU9EbvV2sb-tSQ8t-Xt3tjnvNmMJBBodgUgoCN0ubx58DcTRsalFVbmXsdcf2xyBQybb099Rp4jFmRwA3B9GQtru5ZvdLJXPSK_v8k")' }}
              ></div>
            </div>
          </div>
        </section>

        {/* Right Auth Section */}
        <section className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-50 dark:bg-[#101922]">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 xl:p-10">
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-2xl xl:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Welcome Back</h2>
              <p className="text-slate-500 dark:text-slate-400">Sign in to manage your health journey</p>
            </div>

            {/* Social Login */}
            <button className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg h-12 px-4 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all mb-6">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Continue with Google
            </button>

            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <span className="relative px-4 bg-white dark:bg-slate-900 text-xs text-slate-400 uppercase font-semibold tracking-widest">Or email</span>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="email">Email Address</label>
                <input 
                  className="w-full h-12 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
                  id="email" 
                  placeholder="e.g. name@company.com" 
                  type="email"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
                  <a className="text-xs font-bold text-blue-600 hover:underline" href="#">Forgot password?</a>
                </div>
                <div className="relative">
                  <input 
                    className="w-full h-12 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
                    id="password" 
                    type="password" 
                    defaultValue="password"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" type="button">
                    <span className="material-symbols-outlined text-xl">visibility</span>
                  </button>
                </div>
              </div>
              <button className="w-full h-12 bg-blue-600 text-white font-bold rounded-lg shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all" type="submit">
                Sign In
              </button>
            </form>
            <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Don't have an account? <a className="text-blue-600 font-bold hover:underline" href="#">Start free trial</a>
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 px-10">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>© 2026 HealthAI Nurse. All rights reserved.</div>
          <div className="flex gap-6">
            <a className="hover:text-blue-600" href="#">Privacy Policy</a>
            <a className="hover:text-blue-600" href="#">Terms of Service</a>
            <a className="hover:text-blue-600" href="#">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;