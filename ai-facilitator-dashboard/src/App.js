import React, { useState, useEffect } from 'react';
import { 
  Activity, Settings, CheckCircle, Users, 
  AlertTriangle, MessageSquare, Bell, ShieldCheck, Search,
  Globe, Languages, Send, AlertCircle, X
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('flow');
  const [alerts, setAlerts] = useState([]);
  const [isGuided, setIsGuided] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [isThaiEnabled, setIsThaiEnabled] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [qaStatus, setQaStatus] = useState('pending');

  // Mock Data for Questions
  const [questions, setQuestions] = useState([
    { id: 1, student: "Jaylen", query: "What is a producer?", status: "AI Answered", time: "2m ago", auto: true },
    { id: 2, student: "Sophia", query: "Is grass a producer?", status: "AI Answered", time: "1m ago", auto: true },
    { id: 3, student: "Prakash", query: "Which is bigger, 0.75 or 0.8?", status: "Flagged", type: "Math Error", auto: false },
    { id: 4, student: "Marcus", query: "...", status: "Inactive", type: "Low Engagement", auto: false }
  ]);

  // Handle routing a question to the teacher (Scene 5)
  const routeToTeacher = (query) => {
    const newAlert = { 
      id: Date.now(), 
      msg: `Shared to Teacher: "${query}"`, 
      type: "pushed" 
    };
    setAlerts([newAlert, ...alerts]);
  };

  const triggerPatternAlert = () => {
    const newAlert = { 
      id: Date.now(), 
      msg: "Pattern Alert: 5 students asking about Consumers vs Producers", 
      type: "pedagogical" 
    };
    setAlerts([newAlert, ...alerts]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans overflow-hidden">
      
      {/* Sidebar */}
      <nav className="w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col z-20">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/40">
            <Activity size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">AI Facilitator</h1>
        </div>

        <div className="space-y-1 flex-1">
          <NavItem icon={<Settings size={18}/>} label="Configuration" active={activeTab === 'config'} onClick={() => setActiveTab('config')} />
          <NavItem icon={<MessageSquare size={18}/>} label="Question Flow" active={activeTab === 'flow'} onClick={() => setActiveTab('flow')} />
          <NavItem icon={<ShieldCheck size={18}/>} label="Quality Review" active={activeTab === 'quality'} onClick={() => setActiveTab('quality')} />
          <NavItem icon={<Users size={18}/>} label="Student Coaching" active={activeTab === 'coaching'} onClick={() => setActiveTab('coaching')} />
        </div>

        <div className="mt-auto p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20">
          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Live Session</p>
          <p className="text-sm font-semibold">Sec 2 Biology: Ecosystems</p>
          <p className="text-xs text-slate-500 mt-1">Teacher: Mr. Tan</p>
        </div>
      </nav>

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col relative">
        
        {/* Header */}
        <header className="h-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800 w-80">
            <Search size={16} className="text-slate-500" />
            <input type="text" placeholder="Search logs..." className="bg-transparent border-none outline-none text-xs w-full" />
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={triggerPatternAlert} className="bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500 hover:text-white transition-all px-4 py-2 rounded-lg text-[10px] font-bold uppercase">
              Debug Alert
            </button>
            <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
              <div className="text-right">
                <p className="text-sm font-bold">David Lee</p>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter text-right">Facilitation Specialist</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-blue-500"></div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-8 overflow-y-auto flex-1 relative">
          
          {/* SCENE 2 & 3: CONFIGURATION */}
          {activeTab === 'config' && (
            <div className="max-w-4xl space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
                  <h3 className="font-bold text-lg border-b border-slate-800 pb-4">Agent Settings</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Guided Inquiry Mode</p>
                      <p className="text-xs text-slate-500">Socratic questioning enabled</p>
                    </div>
                    <button onClick={() => setIsGuided(!isGuided)} className={`w-12 h-6 rounded-full transition-all relative ${isGuided ? 'bg-blue-600' : 'bg-slate-700'}`}>
                      <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${isGuided ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Language Switching</p>
                      <p className="text-xs text-slate-500">Enable Thai/Malay support</p>
                    </div>
                    <button onClick={() => setIsThaiEnabled(!isThaiEnabled)} className={`w-12 h-6 rounded-full transition-all relative ${isThaiEnabled ? 'bg-green-600' : 'bg-slate-700'}`}>
                      <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${isThaiEnabled ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                  <h3 className="font-bold text-lg mb-4">Seating Chart (Individual Config)</h3>
                  <div className="grid grid-cols-3 gap-3 text-[10px]">
                    {['Jaylen', 'Sophia', 'Marcus', 'Prakash', 'Siti', 'Wei'].map(name => (
                      <div key={name} className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-blue-500 cursor-pointer text-center">
                        <p className="font-bold mb-1 uppercase">{name}</p>
                        <span className="text-blue-400">Standard</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 5: QUESTION FLOW */}
          {activeTab === 'flow' && (
            <div className="grid grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="col-span-8 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold flex items-center gap-2">Live Stream</h3>
                  <div className="bg-green-500/10 text-green-500 text-[10px] px-2 py-1 rounded-md font-bold animate-pulse">SYSTEM ACTIVE</div>
                </div>
                {questions.map(q => (
                  <div key={q.id} className="group bg-slate-900/50 p-5 rounded-2xl border border-slate-800 flex justify-between items-center transition-all hover:bg-slate-900">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-blue-500 uppercase">{q.student}</span>
                        <span className="text-[8px] text-slate-600">{q.time}</span>
                      </div>
                      <p className="text-md text-slate-200 font-medium leading-tight">"{q.query}"</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {q.auto ? (
                         <span className="bg-slate-800 text-slate-500 text-[8px] font-bold px-2 py-1 rounded tracking-tighter uppercase italic">AI Handled</span>
                      ) : (
                        <button onClick={() => routeToTeacher(q.query)} className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-all shadow-lg shadow-blue-900/20">
                          <Send size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="col-span-4 space-y-6">
                <h3 className="text-lg font-bold">Routing to Mr. Tan</h3>
                <div className="space-y-3">
                  {alerts.map(a => (
                    <div key={a.id} className={`p-4 rounded-2xl border flex gap-3 animate-in slide-in-from-right-4 ${a.type === 'pedagogical' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>
                      <AlertCircle size={20} className="shrink-0" />
                      <p className="text-xs font-semibold leading-relaxed">{a.msg}</p>
                    </div>
                  ))}
                  {alerts.length === 0 && <div className="text-slate-600 text-center py-10 italic text-sm">Dashboard clear...</div>}
                </div>
              </div>
            </div>
          )}

          {/* SCENE 7: QUALITY REVIEW */}
          {activeTab === 'quality' && (
            <div className="animate-in fade-in duration-500">
               <div className={`p-8 rounded-3xl border transition-all ${qaStatus === 'resolved' ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h4 className={`font-bold text-xl ${qaStatus === 'resolved' ? 'text-green-500' : 'text-red-500'}`}>
                        {qaStatus === 'resolved' ? 'Error Logged & Student Notified' : 'QA Alert: Accuracy Mismatch'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 tracking-wider uppercase">Sampled Class 4B | Node ID: PX-99</p>
                    </div>
                    <div className="bg-slate-900 px-4 py-2 rounded-xl text-xs font-mono border border-slate-800">
                      Sample Rate: <span className="text-blue-400">15%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                       <p className="text-[10px] font-bold text-slate-500 uppercase">Input (Prakash)</p>
                       <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 italic font-medium">"Which is bigger, 0.75 or 0.8?"</div>
                    </div>
                    <div className="space-y-2 text-right">
                       <p className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">AI Output (Incorrect)</p>
                       <div className="bg-slate-950 p-4 rounded-2xl border border-red-500/20 italic font-medium text-red-200">"0.75 is bigger because it has more digits."</div>
                    </div>
                  </div>

                  {qaStatus === 'pending' && (
                    <div className="flex gap-4">
                      <button onClick={() => setShowErrorModal(true)} className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-red-900/20">
                        Report Error
                      </button>
                      <button className="bg-slate-800 px-6 py-3 rounded-2xl font-bold text-sm">Ignore (False Positive)</button>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* SCENE 9: EQUITY HEATMAP */}
          {activeTab === 'coaching' && (
            <div className="grid grid-cols-2 gap-10 animate-in zoom-in-95 duration-500">
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                  <h4 className="font-bold text-lg mb-6 flex items-center gap-2"><Globe className="text-cyan-500" /> Interaction Heatmap</h4>
                  <div className="grid grid-cols-4 gap-4 aspect-square">
                     {Array.from({length: 16}).map((_, i) => (
                       <div key={i} className={`rounded-xl transition-all border border-white/5 flex items-center justify-center text-[8px] font-bold ${i === 2 ? 'bg-blue-600/60 shadow-[0_0_20px_rgba(37,99,235,0.5)] border-blue-400 animate-pulse' : 'bg-amber-500/20'}`}>
                          {i === 2 ? 'MARCUS (COLD)' : 'NODE'}
                       </div>
                     ))}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-6 text-center italic tracking-wide font-bold">Blue = No interaction for 20+ mins</p>
               </div>

               <div className="space-y-6">
                 <div className="bg-cyan-500/10 border border-cyan-500/20 p-6 rounded-3xl">
                    <h4 className="font-bold text-cyan-500 mb-2 tracking-tight flex items-center gap-2 uppercase text-xs underline underline-offset-4">Coaching Task</h4>
                    <p className="text-sm font-semibold mb-4 leading-relaxed italic">"Marcus Lim has 0 prompts this unit. Language level: English (Intermediate). Confidence: Low."</p>
                    <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-bold transition-all text-xs">Open Student Coaching Screen</button>
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* INTERACTIVE MODAL FOR SCENE 7 */}
        {showErrorModal && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center z-50 p-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-800 p-8 shadow-2xl relative">
              <button onClick={() => setShowErrorModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
              <h3 className="text-xl font-bold mb-2">Internal Error Report</h3>
              <p className="text-xs text-slate-500 mb-6">This logs the factual error to the AI vendor and prepares a student correction.</p>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Issue Description</label>
                  <textarea defaultValue="Decimal comparison error. AI incorrectly stated 0.75 > 0.8." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-blue-500 outline-none h-24" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Priority</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm"><option>Medium</option><option>High</option></select>
                </div>
              </div>

              <button 
                onClick={() => { setShowErrorModal(false); setQaStatus('resolved'); }} 
                className="w-full bg-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-500 shadow-lg shadow-blue-900/20"
              >
                Log Error & Email Student
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// NavItem Component
const NavItem = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all font-semibold text-xs mb-1 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
        : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    {icon}
    {label}
  </div>
);

export default App;