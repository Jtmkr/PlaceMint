import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";

const STAGES = ['To Apply', 'Applied', 'Interviewing', 'Offered', 'Rejected'];
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/jobs';

export default function App() {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ company: '', role: '', notes: '', deadline: '' });

  useEffect(() => { 
    if (user) fetchJobs(); 
  }, [user]);

  const fetchJobs = async () => {
    const res = await axios.get(`${API_URL}?userId=${user.id}`);
    setJobs(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(API_URL, { ...form, userId: user.id });
    setForm({ company: '', role: '', notes: '', deadline: '' });
    fetchJobs();
  };

  const updateStatus = async (id, newStatus) => {
    await axios.patch(`${API_URL}/${id}`, { status: newStatus });
    fetchJobs();
  };

  const deleteJob = async (id) => {
    if (window.confirm("Remove this entry?")) {
      await axios.delete(`${API_URL}/${id}`);
      fetchJobs();
    }
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Stats Logic
  const total = jobs.length;
  const interviews = jobs.filter(j => j.status === 'Interviewing').length;
  const offers = jobs.filter(j => j.status === 'Offered').length;
  const rate = total > 0 ? ((offers / total) * 100).toFixed(1) : 0;

  const filtered = jobs.filter(j => 
    j.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      {/* 🟢 GUEST VIEW */}
      <SignedOut>
        <div className="h-screen flex flex-col items-center justify-center text-center p-6 bg-white">
          <h1 className="text-5xl font-black mb-4 tracking-tighter">PlaceMint 🚀</h1>
          <p className="text-slate-500 mb-8 max-w-md text-lg">Securely track and manage your internship pipeline.</p>
          <div className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-700 cursor-pointer transition-all">
            <SignInButton mode="modal" />
          </div>
        </div>
      </SignedOut>

      {/* 🔵 USER DASHBOARD */}
      <SignedIn>
        <div className="p-6 md:p-10">
          <header className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black tracking-tight">PlaceMint 🚀</h1>
              <p className="text-sm text-indigo-500 font-bold uppercase tracking-widest">Dashboard for {user?.firstName}</p>
            </div>
            <UserButton afterSignOutUrl="/" />
          </header>

          {/* 📊 STATS CARDS */}
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Total Tracked', value: total, color: 'text-blue-600' },
              { label: 'Interviews', value: interviews, color: 'text-amber-600' },
              { label: 'Offers', value: offers, color: 'text-green-600' },
              { label: 'Success Rate', value: `${rate}%`, color: 'text-indigo-600' },
            ].map(s => (
              <div key={s.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* 🕹️ CONTROLS */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white p-7 rounded-3xl shadow-sm border border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input className="p-3 bg-slate-50 rounded-xl text-sm border-2 border-transparent focus:border-indigo-500 outline-none transition-all" placeholder="Company" value={form.company} onChange={e => setForm({...form, company: e.target.value})} required />
                <input className="p-3 bg-slate-50 rounded-xl text-sm border-2 border-transparent focus:border-indigo-500 outline-none transition-all" placeholder="Role" value={form.role} onChange={e => setForm({...form, role: e.target.value})} required />
                <input type="date" className="p-3 bg-slate-50 rounded-xl text-sm outline-none" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <textarea className="flex-grow p-3 bg-slate-50 rounded-xl text-sm h-12 outline-none" placeholder="Notes..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                <button className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-black text-xs uppercase hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Add to Pipeline</button>
              </div>
            </form>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-center">
               <input className="p-4 bg-slate-50 rounded-2xl w-full text-center text-xl font-bold border-none outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          {/* 📋 KANBAN BOARD */}
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
            {STAGES.map(stage => (
              <div key={stage} className="bg-slate-200/40 p-5 rounded-[2.5rem] min-h-[600px] border border-slate-200/50">
                <h2 className="uppercase tracking-[0.2em] font-black text-slate-400 text-[10px] mb-6 flex justify-between items-center px-2">
                  {stage} <span className="bg-white text-slate-500 w-7 h-7 flex items-center justify-center rounded-full shadow-sm text-[10px]">{filtered.filter(j => j.status === stage).length}</span>
                </h2>
                {filtered.filter(j => j.status === stage).map(job => (
                  <div key={job._id} className="bg-white p-6 rounded-2xl shadow-sm border border-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-black text-slate-800 text-sm">{job.company}</h4>
                      <button onClick={() => deleteJob(job._id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all text-sm">✕</button>
                    </div>
                    <p className="text-[10px] font-black text-indigo-500 mb-4 tracking-wider uppercase">{job.role}</p>
                    {job.deadline && (
                      <div className={`text-[10px] font-black py-2 px-4 rounded-full mb-5 inline-block shadow-sm ${getDaysRemaining(job.deadline) < 3 ? 'bg-red-500 text-white shadow-red-100 animate-pulse' : 'bg-indigo-50 text-indigo-600'}`}>
                        {getDaysRemaining(job.deadline) <= 0 ? 'EXPIRED' : `${getDaysRemaining(job.deadline)} DAYS LEFT`}
                      </div>
                    )}
                    <div className="flex flex-col gap-2 border-t border-slate-50 pt-5 mt-2">
                      {STAGES.filter(s => s !== stage).map(s => (
                        <button key={s} onClick={() => updateStatus(job._id, s)} className="text-[9px] font-black text-slate-400 bg-slate-50 py-2.5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-tighter">
                          Move to {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </SignedIn>
    </div>
  );
}