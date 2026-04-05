import React, { useState } from 'react';
import { 
  Activity, Settings, CheckCircle, Users, 
  AlertTriangle, MessageSquare, Bell, ShieldCheck, Search 
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('flow');
  const [alerts, setAlerts] = useState([]);
  
  // Mock Data aligned with your Skit Script
  const [questions] = useState([
    { id: 1, student: "Jaylen", query: "What is a producer?", status: "AI Answered", time: "2m ago" },
    { id: 2, student: "Sophia", query: "Is grass a producer?", status: "AI Answered", time: "1m ago" },
    { id: 3, student: "Prakash", query: "Which is bigger, 0.75 or 0.8?", status: "Flagged", type: "Math Error" },
    { id: 4, student: "Marcus", query: "...", status: "Inactive", type: "Low Engagement" }
  ]);

  const triggerPatternAlert = () => {
    const newAlert = { 
      id: Date.now(), 
      msg: "Pattern Alert: 5 students asking about Consumers vs Producers", 
      type: "pedagogical" 
    };
    setAlerts([newAlert, ...alerts]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      
      {/* Sidebar - David's Control Panel */}
      <nav className="w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">AI Facilitator</h1>
        </div>

        <div className="space-y-2 flex-1">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4 px-2">Main Menu</p>
          
          <NavItem 
            icon={<Settings size={20}/>} 
            label="Configuration" 
            active={activeTab === 'config'} 
            onClick={() => setActiveTab('config')} 
          />
          <NavItem 
            icon={<MessageSquare size={20}/>} 
            label="Question Flow" 
            active={activeTab === 'flow'} 
            onClick={() => setActiveTab('flow')} 
          />
          <NavItem 
            icon={<ShieldCheck size={20}/>} 
            label="Quality Review" 
            active={activeTab === 'quality'} 
            onClick={() => setActiveTab('quality')} 
          />
          <NavItem 
            icon={<Users size={20}/>} 
            label="Student Coaching" 
            active={activeTab === 'coaching'} 
            onClick={() => setActiveTab('coaching')} 
          />
        </div>

        <div className="mt-auto p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-400">Current Session</p>
          <p className="text-sm font-semibold text-blue-400">Class 4B: Ecosystems</p>
          <p className="text-[10px] text-slate-500 mt-1 italic">Teacher: Mr. Tan</p>
        </div>
      </nav>

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-20 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-8">
          <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-full border border-slate-800 w-96">
            <Search size={18} className="text-slate-500" />
            <input type="text" placeholder="Search students or logs..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={triggerPatternAlert}
              className="bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500 hover:text-white transition-all px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
            >
              Simulate Pattern
            </button>
            <div className="relative cursor-pointer">
              <Bell size={20} className="text-slate-400" />
              <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border-2 border-slate-950"></span>
            </div>
            <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
              <div className="text-right">
                <p className="text-sm font-bold tracking-tight">David Lee</p>
                <p className="text-[10px] text-blue-400 uppercase font-bold">Specialist</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 border-2 border-slate-800"></div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-8 overflow-y-auto flex-1">
          {activeTab === 'flow' && (
            <div className="grid grid-cols-12 gap-8 animate-in fade-in duration-500">
              {/* Question Feed */}
              <div className="col-span-8 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                   Live Dashboard <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter animate-pulse">Live</span>
                </h3>
                <div className="space-y-4">
                  {questions.map(q => (
                    <div key={q.id} className="group bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                            {q.student[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{q.student}</p>
                            <p className="text-[10px] text-slate-600">{q.time}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          q.status === 'Flagged' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {q.status}
                        </span>
                      </div>
                      <p className="text-lg text-slate-200">"{q.query}"</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Teacher Alerts Sidebar */}
              <div className="col-span-4 space-y-6">
                <h3 className="text-lg font-bold">Smart Alerts</h3>
                <div className="space-y-4">
                  {alerts.length === 0 && (
                    <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-8 text-center">
                       <p className="text-slate-500 text-sm">Monitoring classroom patterns...</p>
                    </div>
                  )}
                  {alerts.map(a => (
                    <div key={a.id} className="bg-amber-950/20 border border-amber-500/30 p-5 rounded-2xl animate-in slide-in-from-right-4 duration-300">
                      <div className="flex items-center gap-2 text-amber-500 mb-2">
                        <AlertTriangle size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Pattern Detected</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed mb-4">{a.msg}</p>
                      <button className="w-full bg-amber-500 text-white py-2 rounded-xl text-xs font-bold hover:bg-amber-600 transition-all">
                        Route to Mr. Tan
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="max-w-3xl space-y-8 animate-in fade-in duration-500">
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                <h3 className="text-xl font-bold mb-6">Pre-Lesson AI Configuration</h3>
                <div className="space-y-6">
                  <ConfigOption label="Instructional Persona" value="Guided Inquiry (Socratic)" />
                  <ConfigOption label="Subject Material" value="Secondary 2 Biology: Ecosystems" />
                  <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                    <div>
                      <p className="font-semibold">Language Packs</p>
                      <p className="text-xs text-slate-500">Enable Malay and Thai translation/support</p>
                    </div>
                    <div className="w-12 h-6 bg-blue-600 rounded-full relative shadow-inner shadow-blue-900">
                      <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20">
                    Apply to Student Nodes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quality' && (
             <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl">
                   <div className="flex items-center gap-3 text-red-500 mb-4">
                      <AlertTriangle />
                      <h4 className="font-bold">QA Alert: Conceptual Hallucination</h4>
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-900">
                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-widest">Student Query (Prakash)</p>
                        <p className="italic text-slate-300">"Which is bigger, 0.75 or 0.8?"</p>
                      </div>
                      <div className="bg-slate-950 p-6 rounded-2xl border border-red-900/30">
                        <p className="text-[10px] uppercase font-bold text-red-500/50 mb-2 tracking-widest text-right">AI Response (Failed)</p>
                        <p className="text-right italic text-red-200">"0.75 is bigger because it has more digits."</p>
                      </div>
                   </div>
                   <div className="mt-8 flex gap-4">
                      <button className="bg-red-600 px-6 py-2 rounded-xl text-sm font-bold">Report to Vendor</button>
                      <button className="bg-slate-800 px-6 py-2 rounded-xl text-sm font-bold">Draft Correction Email</button>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'coaching' && (
             <div className="grid grid-cols-2 gap-8 animate-in fade-in duration-500">
                <div className="bg-slate-900 p-8 rounded-3xl border-t-4 border-cyan-500">
                   <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                     <Users size={20} className="text-cyan-500" /> 
                     Equity & Engagement Map
                   </h4>
                   <p className="text-sm text-slate-400 mb-6">Students showing low AI interaction frequency.</p>
                   <div className="space-y-3">
                      {['Marcus Lim', 'Siti Aminah', 'Chen Wei'].map(name => (
                        <div key={name} className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800 group hover:border-cyan-500/50 transition-all">
                           <span className="font-medium">{name}</span>
                           <button className="text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full group-hover:bg-cyan-500 group-hover:text-white">
                             Prepare Nudge
                           </button>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Helper Components for Cleaner Code
const NavItem = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all font-medium text-sm ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
    }`}
  >
    {icon}
    {label}
  </div>
);

const ConfigOption = ({ label, value }) => (
  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{label}</p>
    <p className="font-semibold text-slate-200">{value}</p>
  </div>
);

export default App;