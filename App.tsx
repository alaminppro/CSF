import React, { useState, useMemo, useRef } from 'react';
import { 
  Users, 
  MapPin, 
  ChevronRight, 
  BookOpen, 
  Phone, 
  Mail, 
  Facebook, 
  School,
  X,
  ChevronLeft,
  Building2,
  CalendarDays,
  Search,
  Home,
  Lock,
  Settings,
  Plus,
  FileUp,
  Save,
  Trash2,
  LogOut,
  Upload,
  Type,
  GraduationCap
} from 'lucide-react';
import { STUDENTS as INITIAL_STUDENTS, UNIONS as INITIAL_UNIONS } from './constants';
import { Student } from './types';

// Dedicated Logo Component
const Logo = ({ customLogo }: { customLogo: string | null }) => (
  <div className="bg-white p-1.5 rounded-full shadow-md shrink-0 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 overflow-hidden border border-slate-100">
     <img 
        src={customLogo || "/logo.png"} 
        alt="Forum Logo" 
        className="w-full h-full object-contain"
        onError={(e) => {
          if (!customLogo) {
            e.currentTarget.src = "https://ui-avatars.com/api/?name=CS&background=09b2eb&color=fff";
          }
        }}
     />
  </div>
);

export default function App() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [selectedUnion, setSelectedUnion] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Admin States
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [footerText, setFooterText] = useState("© 2025 Companiganj (Noakhali) Students' Forum, CU");
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  
  // CSV Import States
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Manual Form State
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    gender: 'male',
    union: INITIAL_UNIONS[0],
    name: '',
    department: '',
    session: '',
    mobile: '',
    email: '',
    highSchool: '',
    college: '',
    villageWard: '',
    facebook: ''
  });

  const displayStudents = useMemo(() => {
    let baseList = selectedUnion 
      ? students.filter(s => s.union === selectedUnion) 
      : students;

    if (!searchQuery.trim()) {
      return selectedUnion ? baseList : [];
    }

    const query = searchQuery.toLowerCase().trim();
    return baseList.filter(student => 
      student.name.toLowerCase().includes(query) ||
      student.department.toLowerCase().includes(query) ||
      student.session.toLowerCase().includes(query) ||
      student.villageWard.toLowerCase().includes(query) ||
      student.union.toLowerCase().includes(query)
    );
  }, [selectedUnion, searchQuery, students]);

  const handleLogin = () => {
    if (username === 'csfdata' && password === 'csf2030') {
      setIsAdmin(true);
      setShowLogin(false);
      setUsername('');
      setPassword('');
      setShowAdminPanel(true);
    } else {
      alert('ভুল ইউজারনেম বা পাসওয়ার্ড!');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCustomLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim()));
        const validRows = rows.filter(row => row.length > 1);
        setCsvData(validRows);
        
        // Auto-mapping logic
        if (validRows.length > 0) {
          const headers = validRows[0].map(h => h.toLowerCase().replace(/\s/g, ''));
          const newMapping: Record<string, number> = {};
          const fields = ['name', 'union', 'department', 'session', 'mobile', 'email', 'highschool', 'college', 'villageward', 'facebook', 'gender'];
          
          fields.forEach(field => {
            const index = headers.findIndex(h => h.includes(field));
            if (index !== -1) newMapping[field === 'highschool' ? 'highSchool' : field === 'villageward' ? 'villageWard' : field] = index;
          });
          setMapping(newMapping);
        }
      };
      reader.readAsText(file);
    }
  };

  const applyCsvImport = () => {
    if (csvData.length < 2) return;
    const imported: Student[] = csvData.slice(1).map((row, idx) => ({
      id: Date.now() + idx,
      name: row[mapping.name] || 'Unknown',
      union: row[mapping.union] || INITIAL_UNIONS[0],
      department: row[mapping.department] || 'N/A',
      session: row[mapping.session] || 'N/A',
      mobile: row[mapping.mobile] || '',
      email: row[mapping.email] || '',
      highSchool: row[mapping.highSchool] || '',
      college: row[mapping.college] || '',
      villageWard: row[mapping.villageWard] || '',
      facebook: row[mapping.facebook] || '',
      gender: (row[mapping.gender]?.toLowerCase() === 'female' ? 'female' : 'male') as 'male' | 'female'
    }));
    setStudents([...students, ...imported]);
    setCsvData([]);
    setMapping({});
    alert(`${imported.length} জন ছাত্রছাত্রী যোগ করা হয়েছে!`);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.union) return;
    const studentToAdd = {
      ...newStudent,
      id: Date.now()
    } as Student;
    setStudents([studentToAdd, ...students]);
    setShowManualForm(false);
    setNewStudent({ gender: 'male', union: INITIAL_UNIONS[0], name: '', department: '', session: '', mobile: '', email: '', highSchool: '', college: '', villageWard: '', facebook: '' });
    alert('নতুন ছাত্র যোগ করা হয়েছে!');
  };

  const closeModal = () => setSelectedStudent(null);
  const handleBackToUnions = () => { setSelectedUnion(null); setSelectedStudent(null); setSearchQuery(''); };
  const handleUnionSelect = (union: string) => { setSelectedUnion(union); setSearchQuery(''); };

  if (showAdminPanel && isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-12">
        <header className="bg-brand-primary text-white p-4 shadow-md sticky top-0 z-30">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="font-bold flex items-center gap-2 text-xl">
              <Settings className="w-6 h-6" /> Admin Panel
            </h1>
            <div className="flex gap-2">
              <button onClick={() => setShowAdminPanel(false)} className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 font-bold transition-all text-sm">ভিউ অ্যাপ</button>
              <button onClick={() => setIsAdmin(false)} className="bg-red-500/80 px-4 py-2 rounded-lg hover:bg-red-600 font-bold transition-all flex items-center gap-2 text-sm"><LogOut className="w-4 h-4" /> লগআউট</button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
          {/* Logo & Footer Setting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-700">
                <Upload className="w-5 h-5 text-brand-primary" /> লোগো আপডেট
              </h2>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full border-2 border-brand-light flex items-center justify-center overflow-hidden bg-slate-50">
                  <img src={customLogo || "/logo.png"} alt="Preview" className="w-full h-full object-contain" onError={(e) => e.currentTarget.src = "https://ui-avatars.com/api/?name=Logo"} />
                </div>
                <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                <button onClick={() => logoInputRef.current?.click()} className="bg-brand-primary text-white px-5 py-2 rounded-xl font-bold text-sm">ছবি পরিবর্তন</button>
              </div>
            </section>

            <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-700">
                <Type className="w-5 h-5 text-brand-primary" /> ফুটার টেক্সট আপডেট
              </h2>
              <textarea 
                className="w-full p-3 border-2 border-slate-100 rounded-xl bg-slate-50 text-brand-primary font-bold focus:border-brand-primary focus:ring-0 outline-none"
                rows={2}
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="ফুটার টেক্সট লিখুন..."
              />
            </section>
          </div>

          {/* CSV Import */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-700">
                <FileUp className="w-5 h-5 text-brand-primary" /> CSV ফাইল থেকে আপলোড
              </h2>
              <p className="text-xs text-slate-400 mt-1">কলামের টাইটেল অবশ্যই ইংরেজি হতে হবে (যেমন: name, union, department, session, mobile, email, villageWard, highSchool, college, facebook, gender)</p>
            </div>
            <div className="flex flex-col gap-4">
              <input type="file" ref={fileInputRef} onChange={handleCsvUpload} className="hidden" accept=".csv" />
              {!csvData.length ? (
                <button onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 py-8 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-brand-primary hover:text-brand-primary transition-all">
                  <FileUp className="w-10 h-10 mb-2" />
                  <span className="font-bold">CSV ফাইল সিলেক্ট করুন</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['name', 'union', 'department', 'session', 'mobile', 'email', 'highSchool', 'college', 'villageWard', 'facebook', 'gender'].map(field => (
                      <div key={field} className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400">{field}</label>
                        <select 
                          className="w-full p-2 border-2 border-slate-100 rounded-lg bg-slate-50 text-brand-primary font-bold text-xs outline-none focus:border-brand-primary"
                          value={mapping[field] ?? ""}
                          onChange={(e) => setMapping({...mapping, [field]: parseInt(e.target.value)})}
                        >
                          <option value="">সিলেক্ট করুন</option>
                          {csvData[0].map((header, i) => <option key={i} value={i}>{header}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={applyCsvImport} className="flex-1 bg-brand-primary text-white py-3 rounded-xl font-bold">ইম্পোর্ট শুরু করুন</button>
                    <button onClick={() => setCsvData([])} className="px-6 py-3 bg-slate-200 rounded-xl font-bold">বাতিল</button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* List Management */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-700">
                  <Users className="w-5 h-5 text-brand-primary" /> মেম্বার লিস্ট ম্যানেজমেন্ট
                </h2>
                <button 
                  onClick={() => setShowManualForm(true)} 
                  className="bg-brand-primary text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-brand-primary/20"
                >
                  <Plus className="w-4 h-4" /> নতুন মেম্বার যোগ
                </button>
             </div>
             <div className="overflow-x-auto rounded-2xl border border-slate-100">
               <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black">
                   <tr>
                     <th className="px-4 py-4">নাম</th>
                     <th className="px-4 py-4">বিভাগ</th>
                     <th className="px-4 py-4">ইউনিয়ন</th>
                     <th className="px-4 py-4 text-right">অ্যাকশন</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {students.slice(0, 30).map(s => (
                     <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-4 py-3 font-bold text-slate-700">{s.name}</td>
                       <td className="px-4 py-3 text-slate-500">{s.department}</td>
                       <td className="px-4 py-3 text-slate-500">{s.union}</td>
                       <td className="px-4 py-3 text-right">
                         <button onClick={() => setStudents(students.filter(item => item.id !== s.id))} className="text-red-400 hover:text-red-600 p-2 transition-colors"><Trash2 className="w-4 h-4" /></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {students.length === 0 && <p className="text-center py-10 text-slate-400 italic">লিস্টে কোন ডাটা নেই</p>}
               {students.length > 30 && <p className="text-center py-4 text-xs text-slate-400">আরও {students.length - 30} জন ডাটাবেজে আছেন</p>}
             </div>
          </section>
        </main>

        {/* Manual Add Form Modal */}
        {showManualForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-800">নতুন ছাত্র যোগ করুন</h3>
                <button onClick={() => setShowManualForm(false)} className="bg-slate-100 p-2 rounded-full text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <div className="space-y-1 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">পূর্ণ নাম *</label>
                  <input placeholder="Ex: Md. Rahim" className="w-full p-3 border-2 border-slate-100 rounded-xl bg-slate-50 text-brand-primary font-bold outline-none focus:border-brand-primary" required onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                </div>
                <div className="space-y-1 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">ইউনিয়ন *</label>
                  <select className="w-full p-3 border-2 border-slate-100 rounded-xl bg-slate-50 text-brand-primary font-bold outline-none focus:border-brand-primary" value={newStudent.union} onChange={e => setNewStudent({...newStudent, union: e.target.value})}>
                    {INITIAL_UNIONS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">বিভাগ</label>
                  <input placeholder="Ex: Physics" className="w-full p-3 border-2 border-slate-100 rounded-xl bg-slate-50 text-brand-primary font-bold outline-none focus:border-brand-primary" onChange={e => setNewStudent({...newStudent, department: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">সেশন</label>
                  <input placeholder="Ex: 20-21" className="w-full p-3 border-2 border-slate-100 rounded-xl bg-slate-50 text-brand-primary font-bold outline-none focus:border-brand-primary" onChange={e => setNewStudent({...newStudent, session: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">মোবাইল নম্বর</label>
                  <input placeholder="017xxxxxxxx" className="w-full p-3 border-2 border-slate-100 rounded-xl bg-slate-50 text-brand-primary font-bold outline-none focus:border-brand-primary" onChange={e => setNewStudent({...newStudent, mobile: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">ইমেইল</label>
                  <input type="email" placeholder="example@gmail.com" className="w-full p-3 border-2 border-slate-100 rounded-xl bg-slate-50 text-brand-primary font-bold outline-none focus:border-brand-primary" onChange={e => setNewStudent({...newStudent, email: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">গ্রাম ও ওয়ার্ড নং</label>
                  <input placeholder="Ex: চরকাঁকড়া ৮ নং ওয়ার্ড" className="w-full p-3 border-2 border-slate-100 rounded-xl bg-slate-50 text-brand-primary font-bold outline-none focus:border-brand-primary" onChange={e => setNewStudent({...newStudent, villageWard: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">জেন্ডার</label>
                  <select className="w-full p-3 border-2 border-slate-100 rounded-xl bg-slate-50 text-brand-primary font-bold outline-none focus:border-brand-primary" value={newStudent.gender} onChange={e => setNewStudent({...newStudent, gender: e.target.value as 'male' | 'female'})}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">স্কুলের নাম</label>
                  <input placeholder="উচ্চ বিদ্যালয়" className="w-full p-3 border-2 border-slate-100 rounded-xl bg-slate-50 text-brand-primary font-bold outline-none focus:border-brand-primary" onChange={e => setNewStudent({...newStudent, highSchool: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">কলেজের নাম</label>
                  <input placeholder="কলেজ" className="w-full p-3 border-2 border-slate-100 rounded-xl bg-slate-50 text-brand-primary font-bold outline-none focus:border-brand-primary" onChange={e => setNewStudent({...newStudent, college: e.target.value})} />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">ফেসবুক প্রোফাইল লিংক</label>
                  <input placeholder="facebook.com/username" className="w-full p-3 border-2 border-slate-100 rounded-xl bg-slate-50 text-brand-primary font-bold outline-none focus:border-brand-primary" onChange={e => setNewStudent({...newStudent, facebook: e.target.value})} />
                </div>
                <div className="col-span-2 flex gap-3 mt-4">
                  <button type="submit" className="flex-1 bg-brand-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all">সংরক্ষণ করুন</button>
                  <button type="button" onClick={() => setShowManualForm(false)} className="px-8 py-4 bg-slate-100 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 transition-all">বাতিল</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12 transition-colors duration-300">
      {/* Admin Toggle */}
      {!isAdmin ? (
        <button onClick={() => setShowLogin(true)} className="fixed bottom-6 right-6 z-40 bg-white shadow-xl border p-3 rounded-full text-slate-300 hover:text-brand-primary transition-all shadow-brand-primary/10">
          <Lock className="w-5 h-5" />
        </button>
      ) : (
        <button onClick={() => setShowAdminPanel(true)} className="fixed bottom-6 right-6 z-40 bg-brand-primary shadow-xl p-4 rounded-full text-white animate-bounce shadow-brand-primary/30">
          <Settings className="w-6 h-6" />
        </button>
      )}

      {/* Header */}
      <header className="bg-brand-primary text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Logo customLogo={customLogo} />
            <div>
              <h1 className="text-lg sm:text-xl font-bold leading-tight">Companiganj (Noakhali) Students' Forum, CU</h1>
              <p className="text-sm opacity-90 italic">জ্ঞানের পথে চলি একসাথে</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-6">
        {!selectedUnion ? (
          <div className="animate-in fade-in duration-500">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-brand-primary">এলাকা নির্বাচন করুন</h2>
              <p className="text-slate-500">ছাত্রছাত্রীদের দেখতে নিচে ক্লিক করুন</p>
            </div>

            <div className="mb-8 relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-brand-primary" />
              </div>
              <input
                type="text"
                placeholder="নাম, বিভাগ বা ইউনিয়ন দিয়ে খুঁজুন..."
                className="block w-full pl-10 pr-10 py-3.5 border rounded-2xl bg-white outline-none shadow-sm focus:ring-2 focus:ring-brand-primary/20 transition-all text-brand-primary font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3"><X className="h-6 w-6 text-slate-400" /></button>}
            </div>

            {searchQuery ? (
              <div className="space-y-3">
                {displayStudents.map((s) => <StudentListItem key={s.id} student={s} onSelect={() => setSelectedStudent(s)} />)}
                {displayStudents.length === 0 && <EmptyState query={searchQuery} />}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INITIAL_UNIONS.map((union, i) => (
                  <button key={i} onClick={() => handleUnionSelect(union)} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-brand-primary hover:shadow-md flex items-center justify-between transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="bg-brand-light p-3 rounded-xl text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors"><MapPin className="w-6 h-6" /></div>
                      <span className="font-bold text-lg text-slate-700">{union}</span>
                    </div>
                    <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in slide-in-from-right duration-300">
            <button onClick={handleBackToUnions} className="flex items-center text-slate-500 mb-6 font-bold hover:text-brand-primary transition-colors"><ChevronLeft className="mr-1" /> ফিরে যান</button>
            <div className="bg-brand-primary rounded-2xl p-6 text-white mb-6 flex justify-between items-center shadow-lg">
              <div>
                <h2 className="text-3xl font-black">{selectedUnion}</h2>
                <p className="opacity-80 font-medium">মোট ছাত্রছাত্রী: {displayStudents.length} জন</p>
              </div>
              <Users className="w-12 h-12 opacity-20" />
            </div>
            <div className="space-y-3">
              {displayStudents.map((s) => <StudentListItem key={s.id} student={s} onSelect={() => setSelectedStudent(s)} />)}
              {displayStudents.length === 0 && <p className="text-center py-12 text-slate-400">এই ইউনিয়নে কোন মেম্বার নেই</p>}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-16 text-center text-slate-400 text-sm pb-8 border-t border-slate-200 pt-8 mx-4">
        <p className="text-brand-primary font-bold">{footerText}</p>
        <p className="mt-2">Developed by: <a href="https://www.facebook.com/itsmdalamin" target="_blank" rel="noopener noreferrer" className="text-brand-primary font-bold underline">Md Al Amin</a></p>
      </footer>

      {/* Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="bg-brand-primary p-6 flex justify-between text-white shrink-0">
              <h3 className="font-bold text-xl flex items-center gap-2"><Users className="w-5 h-5" /> প্রোফাইল</h3>
              <button onClick={closeModal} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <div className="text-center mb-6">
                 <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&background=e6f7fd&color=09b2eb&bold=true&size=128`} alt="" className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg -mt-20 bg-white" />
                 <h2 className="text-2xl font-black text-slate-800 mt-4">{selectedStudent.name}</h2>
                 <p className="text-brand-primary font-bold bg-brand-light inline-block px-4 py-1 rounded-full text-sm mt-1">{selectedStudent.department} ({selectedStudent.session})</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="bg-white p-2.5 rounded-xl text-brand-primary shadow-sm mt-1"><Phone className="w-5 h-5" /></div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">মোবাইল নম্বর</p>
                      <p className="font-bold text-slate-700">{selectedStudent.gender === 'female' ? "017XXXXXXXX (Private)" : selectedStudent.mobile}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="bg-white p-2.5 rounded-xl text-brand-primary shadow-sm mt-1"><Mail className="w-5 h-5" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">ইমেইল</p>
                      <p className="font-bold text-slate-700 truncate">{selectedStudent.email || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="bg-white p-2.5 rounded-xl text-brand-primary shadow-sm mt-1"><Home className="w-5 h-5" /></div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">গ্রাম ও ওয়ার্ড</p>
                      <p className="font-bold text-slate-700">{selectedStudent.villageWard || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="bg-white p-2.5 rounded-xl text-brand-primary shadow-sm mt-1"><School className="w-5 h-5" /></div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">স্কুল</p>
                      <p className="font-bold text-slate-700">{selectedStudent.highSchool || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="bg-white p-2.5 rounded-xl text-brand-primary shadow-sm mt-1"><GraduationCap className="w-5 h-5" /></div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">কলেজ</p>
                      <p className="font-bold text-slate-700">{selectedStudent.college || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="bg-white p-2.5 rounded-xl text-[#1877F2] shadow-sm mt-1"><Facebook className="w-5 h-5" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">ফেসবুক</p>
                      {selectedStudent.facebook ? (
                        <a href={selectedStudent.facebook.startsWith('http') ? selectedStudent.facebook : `https://${selectedStudent.facebook}`} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-primary hover:underline break-all">Social Profile</a>
                      ) : (
                        <p className="font-bold text-slate-400">N/A</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={closeModal} className="w-full mt-8 bg-brand-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-primary/20 active:scale-95 transition-all">বন্ধ করুন</button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
           <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95">
              <div className="bg-brand-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary"><Lock className="w-8 h-8" /></div>
              <h3 className="text-2xl font-black text-center mb-6 text-slate-800">অ্যাডমিন লগইন</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="ইউজারনেম" 
                  className="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-brand-primary transition-all text-brand-primary font-bold placeholder:text-slate-400"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                  type="password" 
                  placeholder="পাসওয়ার্ড" 
                  className="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-brand-primary transition-all text-brand-primary font-bold placeholder:text-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
              <button onClick={handleLogin} className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold mt-6 shadow-lg shadow-brand-primary/20 active:scale-95 transition-all">প্রবেশ করুন</button>
              <button onClick={() => setShowLogin(false)} className="w-full mt-4 text-slate-400 font-bold text-sm">বাতিল</button>
           </div>
        </div>
      )}
    </div>
  );
}

const StudentListItem = ({ student, onSelect }: { student: Student; onSelect: () => void }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center justify-between gap-4 transition-all hover:shadow-md hover:border-brand-primary/30">
    <div className="flex items-center gap-4">
      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=e6f7fd&color=09b2eb&bold=true`} alt="" className="w-14 h-14 rounded-2xl object-cover border border-slate-50" />
      <div className="min-w-0">
        <h3 className="font-bold text-lg text-slate-800 leading-tight truncate">{student.name}</h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{student.department} | সেশন: {student.session}</p>
      </div>
    </div>
    <button onClick={onSelect} className="shrink-0 px-5 py-2.5 bg-brand-light text-brand-primary rounded-xl font-bold text-sm hover:bg-brand-primary hover:text-white transition-all shadow-sm">বিস্তারিত</button>
  </div>
);

const EmptyState = ({ query }: { query: string }) => (
  <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
    <Search className="w-12 h-12 text-slate-200 mx-auto mb-3" />
    <p className="text-slate-500 font-bold">কোন ফলাফল পাওয়া যায়নি</p>
    <p className="text-xs text-slate-400 px-8 mt-1">"{query}" এর সাথে মেলে এমন কেউ আমাদের লিস্টে নেই।</p>
  </div>
);
