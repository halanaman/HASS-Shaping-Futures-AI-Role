import React, { useState, useEffect } from 'react';
import { 
  Activity, Settings, Users, ShieldCheck, Search, 
  Globe, Send, AlertCircle, X, Zap, MessageSquare, 
  UserPlus, ShieldAlert, CheckCircle2
} from 'lucide-react';

const App = () => {
  const [view, setView] = useState('david'); 
  const [activeTab, setActiveTab] = useState('flow');
  const [alerts, setAlerts] = useState([]);
  const [resolvedQaIds, setResolvedQaIds] = useState([]);
  const [selectedQaId, setSelectedQaId] = useState(2);
  const [showQaCorrectionForm, setShowQaCorrectionForm] = useState(false);
  const [qaCorrectionDraft, setQaCorrectionDraft] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showCoachingSim, setShowCoachingSim] = useState(false);
  const [coachResponse, setCoachResponse] = useState("");
  const [guidedInquiryMode, setGuidedInquiryMode] = useState(true);
  const [coachAttemptLogged, setCoachAttemptLogged] = useState(false);

  const qaSamples = [
    {
      id: 1,
      student: "Sophia",
      prompt: "Is grass a producer?",
      answer: "Yes. Grass is a producer because it makes its own food through photosynthesis.",
      hasIssue: false,
      issueLabel: "No issue detected",
      correction: ""
    },
    {
      id: 2,
      student: "Prakash",
      prompt: "Which is bigger, 0.75 or 0.8?",
      answer: "0.75 is bigger because it has more digits.",
      hasIssue: true,
      issueLabel: "Decimal comparison error",
      correction: "I made a mistake earlier. 0.8 is bigger than 0.75. Here's why: 0.8 = 0.80, and 80 is greater than 75. Sorry for the confusion!"
    },
    {
      id: 3,
      student: "Wei",
      prompt: "So a cow is a consumer?",
      answer: "Yes. A cow is a consumer because it eats plants instead of making its own food.",
      hasIssue: false,
      issueLabel: "No issue detected",
      correction: ""
    },
    {
      id: 4,
      student: "Siti",
      prompt: "Why does this matter in real life?",
      answer: "Understanding producers and consumers helps explain food chains and how ecosystems stay balanced.",
      hasIssue: false,
      issueLabel: "No issue detected",
      correction: ""
    },
    {
      id: 5,
      student: "Marcus",
      prompt: "Im feeling very worthless",
      answer: "Feeling worthless is common during stressful periods. Try focusing on your achievements to make yourself worthy",
      hasIssue: false,
      issueLabel: "Well-being support",
      correction: ""
    }
  ];

  const selectedQaSample = qaSamples.find(sample => sample.id === selectedQaId) || qaSamples[0];
  const selectedQaResolved = resolvedQaIds.includes(selectedQaId);

  const resolveQaSample = (id) => {
    setResolvedQaIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  };

  const openQaCorrectionForm = () => {
    setShowQaCorrectionForm(true);
    setQaCorrectionDraft("");
  };

  const submitQaCorrection = (event) => {
    event.preventDefault();
    const correctionText = qaCorrectionDraft.trim() || selectedQaSample.correction;

    if (selectedQaSample.hasIssue) {
      setResolvedQaIds(prev => (prev.includes(selectedQaId) ? prev : [...prev, selectedQaId]));
      setAlerts([{ id: Date.now(), msg: `Correction sent for ${selectedQaSample.student}: ${correctionText}`, type: 'pattern' }, ...alerts]);
    } else {
      resolveQaSample(selectedQaId);
    }

    setShowQaCorrectionForm(false);
    setQaCorrectionDraft("");
  };

  // Scene 3: Individual Student Configs
  const [studentConfigs, setStudentConfigs] = useState([
    { id: 1, name: "Jaylen", eng: 0, config: ["TTS"], lang: "English" },
    { id: 2, name: "Sophia", eng: 8, config: ["Simple Vocab"], lang: "English" },
    { id: 3, name: "Marcus", eng: 6, config: ["Extension"], lang: "Thai" },
    { id: 4, name: "Prakash", eng: 7, config: [], lang: "English" },
    { id: 5, name: "Siti", eng: 4, config: ["Malay Pack"], lang: "Malay" },
    { id: 6, name: "Wei", eng: 6, config: [], lang: "English" },
  ]);

  // Scene 5: Live Feed Simulation
  const allQuestions = [
    { id: 1, student: "Wei", query: "What is a producer?", time: "Just now" },
    { id: 2, student: "Sophia", query: "Is grass a producer?", time: "Just now" },
    { id: 3, student: "Siti", query: "Define consumer.", time: "Just now" },
    { id: 4, student: "Marcus", query: "Producer vs consumer difference?", time: "Just now" },
    { id: 5, student: "Jaylen", query: "So a cow is a consumer?", time: "Just now" },
    // { id: 6, student: "Prakash", query: "Why does this matter in real life?", time: "Just now" },
  ];
  const [visibleQuestions, setVisibleQuestions] = useState([]);

  useEffect(() => {
    if (activeTab === 'flow' && visibleQuestions.length < allQuestions.length) {
      const timer = setTimeout(() => {
        setVisibleQuestions(prev => [...prev, allQuestions[prev.length]]);
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [activeTab, visibleQuestions]);

  const sendToTan = (msg, type = "pattern") => {
    setAlerts([{ id: Date.now(), msg, type }, ...alerts]);
  };

  const updateStudentConfig = (id, toggle) => {
    setStudentConfigs(prev => prev.map(s => {
      if (s.id === id) {
        const newConfigs = s.config.includes(toggle) 
          ? s.config.filter(c => c !== toggle) 
          : [...s.config, toggle];
        return { ...s, config: newConfigs };
      }
      return s;
    }));
    // Update local selection so the UI reflects the change immediately
    if (selectedStudent && selectedStudent.id === id) {
      const isRemoving = selectedStudent.config.includes(toggle);
      setSelectedStudent({
        ...selectedStudent,
        config: isRemoving 
          ? selectedStudent.config.filter(c => c !== toggle) 
          : [...selectedStudent.config, toggle]
      });
    }
  };

  const updateStudentLanguage = (id, lang) => {
    setStudentConfigs(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, lang };
      }
      return s;
    }));

    // Keep the details pane in sync with the latest language selection.
    if (selectedStudent && selectedStudent.id === id) {
      setSelectedStudent({ ...selectedStudent, lang });
    }
  };

  // Heatmap Color Logic: Red (Hot/High) to Blue (Cold/Low)
  const getHeatColor = (val) => {
    if (val === 0) return "bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.7)] animate-pulse border-blue-400";
    if (val < 4) return "bg-blue-400/60 border-blue-300/30";
    if (val < 7) return "bg-orange-500 border-orange-400";
    return "bg-red-600 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans overflow-hidden">
      
      {/* Role Switcher */}
      <div className="fixed top-4 right-4 z-50 flex bg-slate-900 border border-slate-800 rounded-full p-1 shadow-2xl">
        <button onClick={() => setView('david')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${view === 'david' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>SPECIALIST</button>
        <button onClick={() => setView('tan')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${view === 'tan' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>MR. TAN'S TABLET</button>
      </div>

      {view === 'david' ? (
        <>
          <nav className="w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col z-20">
            <div className="flex items-center gap-3 mb-10 px-2 text-blue-500">
              <Zap size={28} fill="currentColor" />
              <h1 className="text-xl font-black italic tracking-tighter text-slate-100">AI OPS</h1>
            </div>
            <div className="space-y-1 flex-1">
              <NavItem icon={<Settings size={18}/>} label="Configuration" active={activeTab === 'config'} onClick={() => setActiveTab('config')} />
              <NavItem icon={<MessageSquare size={18}/>} label="Live Question Flow" active={activeTab === 'flow'} onClick={() => setActiveTab('flow')} />
              <NavItem icon={<ShieldCheck size={18}/>} label="Quality Assurance" active={activeTab === 'quality'} onClick={() => setActiveTab('quality')} />
              <NavItem icon={<Activity size={18}/>} label="Equity Heatmap" active={activeTab === 'coaching'} onClick={() => setActiveTab('coaching')} />
            </div>
          </nav>

          <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
            <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/40 backdrop-blur-xl">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Live Session: Sec 2 Biology (Ecosystems)</h2>
            </header>

            <div className="p-8 overflow-y-auto flex-1">
              {/* CONFIGURATION */}
              {activeTab === 'config' && (
                <div className="grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="col-span-7 bg-slate-900/50 p-8 rounded-[2rem] border border-slate-800 backdrop-blur-sm">
                    <h3 className="font-bold mb-8 text-blue-400 uppercase text-[10px] tracking-widest">Seating Plan: Interactive</h3>
                    <div className="grid grid-cols-3 gap-6">
                      {studentConfigs.map(s => (
                        <div 
                          key={s.id} 
                          onClick={() => setSelectedStudent(s)}
                          className={`aspect-square rounded-3xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-xl ${selectedStudent?.id === s.id ? 'border-blue-500 bg-blue-500/10 scale-105 ring-4 ring-blue-500/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-600'}`}
                        >
                          <div className={`p-3 rounded-full mb-2 ${selectedStudent?.id === s.id ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                            <Users size={20} />
                          </div>
                          <p className="font-bold text-xs">{s.name}</p>
                          <div className="flex gap-1 mt-2">
                            {s.config.map(c => <div key={c} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-5">
                    {selectedStudent ? (
                      <div className="bg-slate-900 p-8 rounded-[2rem] border border-blue-500/30 animate-in slide-in-from-right-4">
                        <div className="flex justify-between items-start mb-6">
                           <div>
                              <h3 className="font-black text-2xl tracking-tighter">{selectedStudent.name}</h3>
                              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Active Profile</p>
                           </div>
                           <div className="bg-slate-950 px-3 py-1 rounded-full text-[10px] font-mono text-slate-500 border border-slate-800">ID: 00{selectedStudent.id}</div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="p-5 bg-blue-600/10 rounded-2xl border border-blue-500/30">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Class Setting</p>
                                <p className="text-xs font-bold text-slate-300 mt-1">Guided Inquiry Mode</p>
                              </div>
                              <button
                                onClick={() => setGuidedInquiryMode(prev => !prev)}
                                className={`w-14 h-7 rounded-full relative transition-all duration-300 ${guidedInquiryMode ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-700'}`}
                              >
                                <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all duration-300 ${guidedInquiryMode ? 'right-1.5' : 'left-1.5'}`} />
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
                              {guidedInquiryMode
                                ? 'Students must submit an attempt before the AI reveals a full answer.'
                                : 'AI can provide direct answers without a student attempt first.'}
                            </p>
                          </div>
                          <ConfigToggle label="Text-to-Speech" active={selectedStudent.config.includes("TTS")} onToggle={() => updateStudentConfig(selectedStudent.id, "TTS")} />
                          <ConfigToggle label="Simplified Vocab" active={selectedStudent.config.includes("Simple Vocab")} onToggle={() => updateStudentConfig(selectedStudent.id, "Simple Vocab")} />
                          <ConfigToggle label="Extension Mode" active={selectedStudent.config.includes("Extension")} onToggle={() => updateStudentConfig(selectedStudent.id, "Extension")} />
                          <div className="pt-6 mt-4 border-t border-slate-800">
                            <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block tracking-widest">Language Support</label>
                            <select
                              value={selectedStudent.lang}
                              onChange={(e) => updateStudentLanguage(selectedStudent.id, e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition-all"
                            >
                              <option value="English">English (Primary)</option>
                              <option value="Malay">Malay (Secondary)</option>
                              <option value="Thai">Thai (Secondary)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full border-2 border-dashed border-slate-800 rounded-[2rem] flex flex-col items-center justify-center text-slate-600 p-10 text-center">
                        <Users size={48} className="mb-4 opacity-20" />
                        <p className="text-sm font-medium italic">Select a student desk to modify individual AI parameters</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* LIVE FLOW */}
              {activeTab === 'flow' && (
                <div className="grid grid-cols-12 gap-8 max-w-5xl mx-auto animate-in fade-in duration-700">
                  <div className="col-span-8 space-y-4">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-black text-xl italic tracking-tight text-slate-300 underline underline-offset-8 decoration-blue-500/50">Live Stream</h3>
                      <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></div>
                        <span className="text-[10px] text-green-500 font-black uppercase">Socket: Connected</span>
                      </div>
                    </div>
                    {visibleQuestions.map((q, i) => (
                      <div key={i} className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-2xl flex justify-between items-center animate-in slide-in-from-left-8 duration-500 group hover:border-blue-500/50 transition-all">
                        <div>
                          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{q.student}</p>
                          <p className="text-lg font-medium text-slate-200 tracking-tight leading-snug">"{q.query}"</p>
                        </div>
                        <button 
                          onClick={() => sendToTan(`Whole-Class Discussion: "${q.query}"`, "discussion")}
                          className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 opacity-0 group-hover:opacity-100"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    ))}
                    {visibleQuestions.length >= 5 && (
                      <button 
                        onClick={() => sendToTan("Pattern Alert: 5 students asking about Producers/Consumers. Review required.", "pattern")}
                        className="w-full py-6 border-2 border-dashed border-amber-500/40 rounded-2xl text-amber-500 font-black text-xs uppercase tracking-widest hover:bg-amber-500/10 transition-all"
                      >
                        Push Pattern Alert to Mr. Tan
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* QUALITY ASSURANCE (Fixed/Updated) */}
              {activeTab === 'quality' && (
                <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
                  <div className={`p-10 rounded-[2.5rem] border-2 shadow-2xl transition-all duration-500 ${selectedQaResolved ? 'bg-green-500/5 border-green-500/30' : selectedQaSample.hasIssue ? 'bg-red-500/5 border-red-500/30' : 'bg-blue-500/5 border-blue-500/30'}`}>
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                           <ShieldAlert className={selectedQaResolved ? 'text-green-500' : selectedQaSample.hasIssue ? 'text-red-500' : 'text-blue-400'} size={32} />
                           <h4 className={`text-3xl font-black italic tracking-tighter ${selectedQaResolved ? 'text-green-500' : selectedQaSample.hasIssue ? 'text-red-500' : 'text-blue-400'}`}>
                             {selectedQaResolved ? 'Review Complete' : selectedQaSample.hasIssue ? 'Issue Requires Action' : 'Awaiting Teacher Review'}
                           </h4>
                        </div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest ml-11">Class 4B Sample Rate: 15%</p>
                      </div>
                      <span className="bg-slate-900 px-4 py-2 rounded-xl text-xs font-mono text-blue-400 border border-slate-800">Node ID: PX-99</span>
                    </div>

                    <div className="max-h-64 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                      {qaSamples.map(sample => (
                        <button
                          key={sample.id}
                          onClick={() => {
                            setSelectedQaId(sample.id);
                            setShowQaCorrectionForm(false);
                            setQaCorrectionDraft("");
                          }}
                          className={`text-left p-4 rounded-2xl border transition-all ${selectedQaId === sample.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-900/40 hover:border-slate-600'}`}
                        >
                          <p className="text-[10px] uppercase tracking-widest font-black text-blue-400 mb-1">{sample.student}</p>
                          <p className="text-sm font-bold text-slate-200 leading-tight">"{sample.prompt}"</p>
                          <p className={`text-[10px] font-black uppercase tracking-widest mt-3 ${resolvedQaIds.includes(sample.id) ? 'text-green-500' : sample.hasIssue ? 'text-red-400' : 'text-blue-400'}`}>
                            {resolvedQaIds.includes(sample.id) ? 'Resolved' : sample.hasIssue ? sample.issueLabel : 'Pending review'}
                          </p>
                        </button>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 mb-10">
                      <div className="space-y-3">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Student Input ({selectedQaSample.student})</p>
                        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 italic font-medium text-lg">
                          "{selectedQaSample.prompt}"
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${selectedQaResolved ? 'text-green-500' : selectedQaSample.hasIssue ? 'text-red-500' : 'text-blue-400'}`}>
                          {selectedQaSample.hasIssue ? 'AI Output (Needs Review)' : 'AI Output'}
                        </p>
                        <div className={`p-6 rounded-3xl border italic font-medium text-lg ${selectedQaResolved ? 'bg-green-500/10 border-green-500/20 text-green-200' : selectedQaSample.hasIssue ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-blue-500/10 border-blue-500/20 text-blue-100'}`}>
                          "{selectedQaSample.answer}"
                        </div>
                      </div>
                    </div>

                    {!selectedQaResolved ? (
                      selectedQaSample.hasIssue && showQaCorrectionForm ? (
                        <form onSubmit={submitQaCorrection} className="space-y-4">
                          <div className="bg-slate-950 border border-amber-500/30 rounded-3xl p-5">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-amber-400 mb-3">
                              Enter correction for {selectedQaSample.student}
                            </label>
                            <textarea
                              value={qaCorrectionDraft}
                              onChange={(e) => setQaCorrectionDraft(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  submitQaCorrection(e);
                                }
                              }}
                              placeholder={selectedQaSample.correction}
                              rows={5}
                              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500 resize-none"
                            />
                            <p className="text-[10px] text-slate-500 mt-3 font-bold uppercase tracking-widest">
                              Press Enter to submit. Leave it blank to use the suggested correction.
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <button
                              type="submit"
                              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-amber-900/30"
                            >
                              Send Correction
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowQaCorrectionForm(false);
                                setQaCorrectionDraft("");
                              }}
                              className="bg-slate-800 text-slate-300 px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-700 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                      <div className="flex gap-4">
                        <button 
                          onClick={() => {
                            if (selectedQaSample.hasIssue) {
                              openQaCorrectionForm();
                              return;
                            }
                            resolveQaSample(selectedQaId);
                          }}
                          className="bg-red-600 hover:bg-red-500 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-red-900/30"
                        >
                          {selectedQaSample.hasIssue ? 'Resolve Issue' : 'Mark Reviewed'}
                        </button>
                        <button
                          onClick={() => setSelectedQaId((selectedQaId % qaSamples.length) + 1)}
                          className="bg-slate-800 text-slate-300 px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-700 transition-all"
                        >
                          Next Item
                        </button>
                      </div>
                      )
                    ) : (
                      <div className="bg-green-500/20 p-6 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4">
                        <CheckCircle2 className="text-green-500" size={24} />
                        <div>
                          <p className="text-green-400 font-black text-sm">
                            {selectedQaSample.hasIssue
                              ? `Success: ${selectedQaSample.student} notified and logic report sent to vendor.`
                              : `Review logged: ${selectedQaSample.student}'s response marked as acceptable.`}
                          </p>
                          {selectedQaSample.hasIssue && selectedQaSample.correction && (
                            <p className="text-green-200 text-xs font-medium mt-2 leading-relaxed">"{selectedQaSample.correction}"</p>
                          )}
                          <p className="text-green-600 text-xs font-bold uppercase mt-1">Status: Closed</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* HEATMAP */}
              {activeTab === 'coaching' && (
                <div className="grid grid-cols-2 gap-12 max-w-5xl mx-auto animate-in zoom-in-95 duration-500">
                  <div className="bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-800 backdrop-blur-sm">
                    <h3 className="font-black mb-10 text-slate-300 uppercase text-xs tracking-[0.3em] flex items-center gap-3">
                       <Activity className="text-red-500" /> Interaction Heatmap
                    </h3>
                    <div className="grid grid-cols-3 gap-8">
                      {studentConfigs.map(s => (
                        <div key={s.id} className="text-center group">
                          <div className={`aspect-square rounded-[2rem] border-4 flex items-center justify-center font-black text-xl transition-all duration-500 group-hover:scale-110 ${getHeatColor(s.eng)}`}>
                            {s.eng > 0 ? `${s.eng * 10}` : '!!'}
                          </div>
                          <p className="mt-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">{s.name}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-12 flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-600 border-t border-slate-800 pt-6">
                       <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600 rounded-sm"></div> Cold (0-2)</div>
                       <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-sm"></div> Active (4-7)</div>
                       <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-600 rounded-sm"></div> Peak (8-10)</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center space-y-8">
                    <div className="bg-blue-600/10 border-2 border-blue-500/20 p-10 rounded-[2.5rem] shadow-2xl">
                      <h4 className="text-blue-400 font-black text-xs uppercase mb-4 tracking-widest flex items-center gap-2">
                        <UserPlus size={16} /> Intervention Suggested
                      </h4>
                      <p className="text-2xl font-bold leading-tight mb-8 text-slate-200 italic">"Jaylen has gone quiet. Confidence: Low. Language: English."</p>
                      <button onClick={() => setShowCoachingSim(true)} className="w-full bg-blue-600 hover:bg-blue-500 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-900/40 transition-all hover:-translate-y-1">
                        Open Coaching Screen
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </>
      ) : (
        /* MR. TAN'S TABLET VIEW */
        <div className="flex-1 bg-white text-slate-900 flex flex-col p-12 animate-in fade-in duration-500 overflow-y-auto">
           <header className="flex justify-between items-center border-b-4 border-slate-100 pb-8 mb-12">
              <div>
                <h2 className="text-4xl font-black italic tracking-tighter">Teacher View</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Unit: Ecosystems</p>
              </div>
              <div className="flex items-center gap-3 bg-green-50 px-6 py-3 rounded-full border border-green-100">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">David Connected</span>
              </div>
           </header>
           
           <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto w-full">
              {alerts.length === 0 ? (
                <div className="h-96 border-8 border-dashed border-slate-50 rounded-[3rem] flex flex-col items-center justify-center text-slate-200 text-center p-10">
                  <Activity size={64} className="mb-4 opacity-20" />
                  <p className="text-2xl font-black uppercase tracking-tighter opacity-30">Monitoring Feed...</p>
                </div>
              ) : (
                alerts.map(a => (
                  <div key={a.id} className={`p-10 rounded-[3rem] border-l-[16px] shadow-2xl animate-in slide-in-from-bottom-12 duration-500 ${a.type === 'pattern' ? 'border-amber-500 bg-amber-50/50 shadow-amber-200/40' : 'border-blue-500 bg-blue-50/50 shadow-blue-200/40'}`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-3 rounded-2xl ${a.type === 'pattern' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'}`}>
                        {a.type === 'pattern' ? <AlertCircle size={24} /> : <MessageSquare size={24} />}
                      </div>
                      <span className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-400">Push Notification</span>
                    </div>
                    <p className="text-3xl font-black text-slate-800 leading-tight tracking-tight italic">"{a.msg}"</p>
                  </div>
                ))
              )}
           </div>
        </div>
      )}

      {/* COACHING MODAL */}
      {showCoachingSim && (
        <div className="fixed inset-0 bg-slate-950/98 z-[60] flex items-center justify-center p-6 backdrop-blur-xl">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl border-b-[12px] border-b-blue-600 animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black italic tracking-tight">Jaylen's Screen</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">Live Coaching Sync</p>
              </div>
              <button onClick={() => {setShowCoachingSim(false); setCoachResponse(""); setCoachAttemptLogged(false)}} className="bg-slate-800 p-3 rounded-full hover:bg-red-600 transition-all"><X size={20} /></button>
            </div>
            
            <div className="p-12 space-y-10">
              <div className="bg-blue-600/10 border-2 border-dashed border-blue-500/40 p-8 rounded-[2rem]">
                <p className="text-[10px] text-blue-400 font-black mb-4 uppercase tracking-widest italic">David's Suggestion to Jaylen:</p>
                <p className="text-2xl font-bold leading-tight text-slate-200">"Try typing: <span className="underline decoration-blue-500 decoration-8 underline-offset-4 font-black text-white px-2">Explain consumer again but simpler</span>"</p>
              </div>

              {guidedInquiryMode && !coachAttemptLogged && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl">
                  <p className="text-[10px] text-amber-400 font-black uppercase tracking-widest mb-2">Guided Inquiry Check</p>
                  <p className="text-sm text-slate-300 font-bold">Student must submit their own attempt before AI gives the final explanation.</p>
                </div>
              )}

              {coachResponse && (
                <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500">
                  <div className="bg-slate-800/50 p-5 rounded-2xl text-slate-400 font-bold flex items-center gap-4 border border-slate-700">
                    <Users size={20} className="text-blue-500" /> <span className="text-sm italic">Jaylen types: "Explain consumer again but simpler"</span>
                  </div>
                  <div className="bg-white text-slate-900 p-10 rounded-[2.5rem] font-bold shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                    <p className="text-[10px] uppercase opacity-40 mb-4 font-black tracking-widest">AI Response (Guided Mode)</p>
                    <p className="text-xl leading-relaxed italic">"{coachResponse}"</p>
                  </div>
                </div>
              )}

              {!coachResponse && guidedInquiryMode && !coachAttemptLogged && (
                <button
                  onClick={() => setCoachAttemptLogged(true)}
                  className="w-full bg-amber-500 text-slate-950 py-6 rounded-2xl font-black text-lg uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-amber-900/30"
                >
                  Mark Student Attempt Entered
                </button>
              )}

              {!coachResponse && (!guidedInquiryMode || coachAttemptLogged) && (
                <button 
                  onClick={() => setCoachResponse("A consumer is a living thing that eats other things (like plants or animals) because it can't make its own food.")}
                  className="w-full bg-blue-600 py-6 rounded-2xl font-black text-lg uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-900/50"
                >
                  {guidedInquiryMode ? 'Send Guided Prompt' : 'Send Direct AI Answer'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// UI Components
const NavItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-4 cursor-pointer p-5 rounded-2xl transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em] mb-2 ${active ? 'bg-blue-600 text-white shadow-2xl shadow-blue-900/40 scale-105' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}>
    {icon} {label}
  </div>
);

const ConfigToggle = ({ label, active, onToggle }) => (
  <div className="flex items-center justify-between p-5 bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
    <span className="text-xs font-black uppercase tracking-widest text-slate-300">{label}</span>
    <button onClick={onToggle} className={`w-14 h-7 rounded-full relative transition-all duration-300 ${active ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-700'}`}>
      <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all duration-300 ${active ? 'right-1.5' : 'left-1.5'}`} />
    </button>
  </div>
);

export default App;