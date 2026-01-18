
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
  Upload
} from 'lucide-center';
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
            e.currentTarget.src = "https://scontent.fcgp3-2.fna.fbcdn.net/v/t39.30808-6/472265008_1033168891946375_7161103710877360556_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=L6xBDzBakFgQ7kNvwE8beO9&_nc_oc=AdnqPVw4oZ0oMpj0XoJWhZ_RQ71y9MZ8t02F5GPP321ejBfdZpXcXbvHuanErizTym8&_nc_zt=23&_nc_ht=scontent.fcgp3-2.fna&_nc_gid=Z4u4ZPfTzsuJmDpHe7npkw&oh=00_Aflvc-nGnPM7fTOPFyma3Q8tMbd04V2zUjOqW8o6aaGWZg&oe=69505ACA";
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
  const [password, setPassword] = useState('');
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // CSV Import States
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

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
    if (password === 'admin123') { // Simple demo password
      setIsAdmin(true);
      setShowLogin(false);
      setPassword('');
      setShowAdminPanel(true);
    } else {
      alert('ভুল পাসওয়ার্ড!');
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
        setCsvData(rows.filter(row => row.length > 1));
      };
      reader.readAsText(file);
    }
  };

  const applyCsvImport = () => {
    if (csvData.length < 2) return;
    const imported: Student[] = csvData.slice(1).map((row, idx) => ({
      id: Date.now() + idx,
      name: row[mapping.name] || 'Unknown',
      union: row[mapping.union] || 'অন্যান্য',
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

  const closeModal = () => setSelectedStudent(null);
  const handleBackToUnions = () => { setSelectedUnion(null); setSelectedStudent(null); setSearchQuery(''); };

  // Fix: Added missing handleUnionSelect function
  const handleUnionSelect = (union: string) => {
    setSelectedUnion(union);
    setSearchQuery('');
  };

  if (showAdminPanel && isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-12">
        <header className="bg-brand-primary text-white p-4 shadow-md sticky top-0 z-30">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="font-bold flex items-center gap-2 text-xl">
              <Settings className="w-6 h-6" /> Admin Panel
            </h1>
            <div className="flex gap-2">
              <button onClick={() => setShowAdminPanel(false)} className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 font-bold transition-all">ভিউ অ্যাপ</button>
              <button onClick={() => setIsAdmin(false)} className="bg-red-500/80 px-4 py-2 rounded-lg hover:bg-red-600 font-bold transition-all flex items-center gap-2"><LogOut className="w-4 h-4" /> লগআউট</button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
          {/* Logo Setting */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-700">
              <Upload className="w-5 h-5 text-brand-primary" /> লোগো আপডেট করুন
            </h2>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full border-2 border-brand-light flex items-center justify-center overflow-hidden bg-slate-50">
                <img src={customLogo || "/logo.png"} alt="Preview" className="w-full h-full object-contain" />
              </div>
              <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
              <button onClick={() => logoInputRef.current?.click()} className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20">ছবি নির্বাচন করুন</button>
            </div>
          </section>

          {/* CSV Import */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-700">
              <FileUp className="w-5 h-5 text-brand-primary" /> CSV ফাইল থেকে নতুন লিস্ট আপলোড
            </h2>
            <div className="flex flex-col gap-4">
              <input type="file" ref={fileInputRef} onChange={handleCsvUpload} className="hidden" accept=".csv" />
              {!csvData.length ? (
                <button onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 py-10 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-brand-primary hover:text-brand-primary transition-all">
                  <FileUp className="w-12 h-12 mb-2" />
                  <span className="font-bold">ক্লিক করে CSV ফাইল সিলেক্ট করুন</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <p className="font-bold text-slate-600">ফিল্ড ম্যাপিং করুন (Field Mapping):</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['name', 'union', 'department', 'session', 'mobile', 'email', 'highSchool', 'college', 'villageWard', 'facebook', 'gender'].map(field => (
                      <div key={field} className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-400">{field}</label>
                        <select 
                          className="w-full p-2 border rounded-lg bg-slate-50 text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                          onChange={(e) => setMapping({...mapping, [field]: parseInt(e.target.value)})}
                          defaultValue=""
                        >
                          <option value="" disabled>কলাম বেছে নিন</option>
                          {csvData[0].map((header, i) => <option key={i} value={i}>{header}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={applyCsvImport} className="flex-1 bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-brand-secondary shadow-lg shadow-brand-primary/20 transition-all">ডাটা ইম্পোর্ট করুন</button>
                    <button onClick={() => setCsvData([])} className="px-6 py-3 bg-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-300">বাতিল</button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Manual Student Addition */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-700">
                  <Users className="w-5 h-5 text-brand-primary" /> বর্তমান লিস্ট ম্যানেজমেন্ট
                </h2>
                <button 
                  onClick={() => alert('ম্যানুয়াল ফরম এখানে যোগ করা যাবে...')} 
                  className="bg-brand-light text-brand-primary px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-brand-primary hover:text-white transition-all"
                >
                  <Plus className="w-4 h-4" /> ম্যানুয়ালি যোগ করুন
                </button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                   <tr>
                     <th className="px-4 py-3">নাম</th>
                     <th className="px-4 py-3">বিভাগ</th>
                     <th className="px-4 py-3">ইউনিয়ন</th>
                     <th className="px-4 py-3 text-right">অ্যাকশন</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {students.slice(0, 10).map(s => (
                     <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                       <td className="px-4 py-3 font-bold text-slate-700">{s.name}</td>
                       <td className="px-4 py-3 text-slate-500">{s.department}</td>
                       <td className="px-4 py-3 text-slate-500">{s.union}</td>
                       <td className="px-4 py-3 text-right">
                         <button onClick={() => setStudents(students.filter(item => item.id !== s.id))} className="text-red-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {students.length > 10 && <p className="text-center py-4 text-xs text-slate-400">আরও {students.length - 10} জন ছাত্রছাত্রী আছে...</p>}
             </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12 transition-colors duration-300">
      {/* Admin Floating Button */}
      {!isAdmin && (
        <button 
          onClick={() => setShowLogin(true)}
          className="fixed bottom-6 right-6 z-40 bg-white/80 backdrop-blur shadow-xl border border-slate-200 p-3 rounded-full text-slate-400 hover:text-brand-primary hover:scale-110 transition-all active:scale-95"
          title="Admin Login"
        >
          <Lock className="w-5 h-5" />
        </button>
      )}

      {isAdmin && (
        <button 
          onClick={() => setShowAdminPanel(true)}
          className="fixed bottom-6 right-6 z-40 bg-brand-primary shadow-xl border border-white/20 p-4 rounded-full text-white hover:scale-110 transition-all active:scale-95 animate-bounce"
          title="Go to Admin Panel"
        >
          <Settings className="w-6 h-6" />
        </button>
      )}

      {/* Header */}
      <header className="bg-brand-primary text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Logo customLogo={customLogo} />
            <div>
              <h1 className="text-lg sm:text-xl font-bold leading-tight drop-shadow-sm">
                Companiganj (Noakhali) Students' Forum, University of Chittagong
              </h1>
              <p className="text-sm opacity-90 text-slate-100 font-medium mt-1 italic">
                জ্ঞানের পথে চলি একসাথে
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-6">
        {!selectedUnion ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-brand-primary mb-2">এলাকা নির্বাচন করুন</h2>
              <p className="text-slate-500">আপনার ইউনিয়নের ছাত্রছাত্রীদের দেখতে নিচে ক্লিক করুন</p>
            </div>

            <div className="mb-8 relative group max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-brand-primary group-focus-within:scale-110 transition-transform" />
              </div>
              <input
                type="text"
                placeholder="নাম, বিভাগ, গ্রাম বা ইউনিয়ন দিয়ে খুঁজুন..."
                className="block w-full pl-10 pr-10 py-3.5 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary shadow-sm transition-all text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                 <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-brand-primary">
                    <X className="h-6 w-6" />
                 </button>
              )}
            </div>

            {searchQuery ? (
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-slate-700 mb-4 px-1 flex items-center gap-2">
                  <Search className="w-5 h-5 text-brand-primary" />
                  খুঁজে পাওয়া গেছে: {displayStudents.length} জন
                </h2>
                {displayStudents.length > 0 ? (
                  displayStudents.map((student) => <StudentListItem key={student.id} student={student} onSelect={() => setSelectedStudent(student)} />)
                ) : (
                  <EmptyState query={searchQuery} />
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INITIAL_UNIONS.map((union, index) => (
                  <button key={index} onClick={() => handleUnionSelect(union)} className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-brand-primary hover:shadow-xl transition-all duration-300 text-left flex items-center justify-between">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-4 z-10">
                      <div className="bg-brand-light p-3 rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-colors">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="font-bold text-lg text-slate-700 group-hover:text-brand-primary transition-colors block">{union}</span>
                        <span className="text-xs text-slate-400 font-medium">বিস্তারিত দেখতে ট্যাপ করুন</span>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-brand-primary group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <button onClick={handleBackToUnions} className="flex items-center text-slate-500 hover:text-brand-primary mb-4 font-bold group">
              <ChevronLeft className="w-6 h-6 mr-1 group-hover:-translate-x-1 transition-transform" /> ইউনিয়ন লিস্টে ফিরে যান
            </button>
            <div className="bg-brand-primary rounded-2xl p-8 text-white mb-6 shadow-xl relative overflow-hidden border-b-4 border-brand-secondary">
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4"><Users className="w-40 h-40" /></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-brand-light/80 font-bold uppercase tracking-wider text-xs"><MapPin className="w-3.5 h-3.5" /> Location</div>
                <h2 className="text-3xl font-bold mb-2">{selectedUnion}</h2>
                <div className="flex items-center gap-2 bg-black/10 w-fit px-3 py-1 rounded-full text-sm font-medium border border-white/10">
                  <Users className="w-4 h-4" /> মোট ছাত্র-ছাত্রী: {displayStudents.length} জন
                </div>
              </div>
            </div>
            <div className="mb-6 sticky top-[100px] z-10 bg-slate-50/80 backdrop-blur-md py-2 px-1 rounded-xl">
               <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-brand-primary" /></div>
                  <input type="text" placeholder="এই ইউনিয়নের ভেতর খুঁজুন..." className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-2xl bg-white focus:ring-4 focus:ring-brand-primary/10 outline-none text-lg" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
               </div>
            </div>
            <div className="space-y-3">
              {displayStudents.map((student) => <StudentListItem key={student.id} student={student} onSelect={() => setSelectedStudent(student)} />)}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-16 text-center text-slate-400 text-sm pb-8 border-t border-slate-200 pt-8 mx-4">
        <p className="flex items-center justify-center gap-2 flex-wrap">
          <span>© 2025 Companiganj (Noakhali) Students' Forum, CU</span>
          <span className="hidden sm:inline">|</span>
          <span>Developed by: <a href="https://www.facebook.com/itsmdalamin" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline font-bold">Md Al Amin</a></span>
        </p>
      </footer>

      {/* Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-brand-primary p-5 flex justify-between items-start text-white">
              <h3 className="font-bold text-xl">ছাত্র বিস্তারিত (Profile)</h3>
              <button onClick={closeModal} className="bg-white/20 rounded-full p-2"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              <div className="text-center mb-8">
                 <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&size=128&background=e6f7fd&color=09b2eb&bold=true`} alt={selectedStudent.name} className="w-28 h-28 rounded-full mx-auto border-4 border-white shadow-xl -mt-16 bg-white object-cover" />
                 <h2 className="text-2xl font-black text-slate-800 mt-4">{selectedStudent.name}</h2>
                 <p className="text-brand-primary font-bold text-sm bg-brand-light px-3 py-1 rounded-full inline-block mt-1">{selectedStudent.department} ({selectedStudent.session})</p>
              </div>
              <div className="space-y-5">
                <div className="flex gap-4 items-start p-1">
                   <div className="bg-brand-light p-3 rounded-2xl text-brand-primary"><Building2 className="w-6 h-6" /></div>
                   <div className="flex-1 border-b border-slate-100 pb-2"><p className="text-[10px] text-slate-400 uppercase font-black mb-1">Union Name</p><p className="text-slate-800 font-bold text-lg">{selectedStudent.union}</p></div>
                </div>
                <div className="flex gap-4 items-start p-1">
                   <div className="bg-amber-50 p-3 rounded-2xl text-amber-500"><Home className="w-6 h-6" /></div>
                   <div className="flex-1 border-b border-slate-100 pb-2"><p className="text-[10px] text-slate-400 uppercase font-black mb-1">গ্রাম + ওয়ার্ড নং</p><p className="text-slate-800 font-bold text-lg">{selectedStudent.villageWard || 'তথ্য নেই'}</p></div>
                </div>
                <div className="flex gap-4 items-start p-1">
                   <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-500"><School className="w-6 h-6" /></div>
                   <div className="flex-1 border-b border-slate-100 pb-2"><p className="text-[10px] text-slate-400 uppercase font-black mb-1">Education</p>
                    <p className="text-slate-700 text-sm leading-snug"><span className="font-bold text-slate-900">স্কুল:</span> {selectedStudent.highSchool}</p>
                    <p className="text-slate-700 text-sm leading-snug"><span className="font-bold text-slate-900">কলেজ:</span> {selectedStudent.college}</p>
                   </div>
                </div>
                <div className="pt-4 space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                        <a href={selectedStudent.gender === 'female' ? undefined : `tel:${selectedStudent.mobile}`} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selectedStudent.gender === 'female' ? 'bg-slate-50 border-slate-100' : 'border-slate-100 hover:border-brand-primary hover:bg-brand-light'}`} onClick={(e) => selectedStudent.gender === 'female' && e.preventDefault()}>
                            <Phone className="w-5 h-5 text-brand-primary" />
                            <p className="text-slate-800 font-bold">{selectedStudent.gender === 'female' ? "017XXXXXXXX (Privacy)" : selectedStudent.mobile}</p>
                        </a>
                        <a href={`mailto:${selectedStudent.email}`} className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-brand-primary hover:bg-brand-light transition-all"><Mail className="w-5 h-5 text-brand-primary" /><p className="text-slate-800 font-bold truncate">{selectedStudent.email}</p></a>
                        <a href={selectedStudent.facebook.startsWith('http') ? selectedStudent.facebook : `https://${selectedStudent.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all"><Facebook className="w-5 h-5 text-blue-600" /><p className="text-slate-800 font-bold">Social Link</p></a>
                    </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-5 border-t border-slate-100 flex justify-center"><button onClick={closeModal} className="px-10 py-3 bg-brand-primary text-white font-bold rounded-2xl shadow-lg">বন্ধ করুন</button></div>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowLogin(false)}></div>
           <div className="relative bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center mb-6">
                 <div className="bg-brand-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary"><Lock className="w-8 h-8" /></div>
                 <h3 className="text-2xl font-black text-slate-800">অ্যাডমিন প্যানেল</h3>
                 <p className="text-slate-400">পাসওয়ার্ড প্রদান করে প্রবেশ করুন</p>
              </div>
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full px-6 py-4 bg-slate-100 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-2xl outline-none transition-all mb-4 text-lg text-center"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button onClick={handleLogin} className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-brand-primary/30 active:scale-95 transition-all">লগইন করুন</button>
              <button onClick={() => setShowLogin(false)} className="w-full text-slate-400 mt-4 text-sm font-bold">বাতিল করুন</button>
           </div>
        </div>
      )}
    </div>
  );
}

// Fix: Destructure 'key' out of props if passed or just use it in the map loop externally. 
// In React, components don't receive 'key' as a prop.
const StudentListItem = ({ student, onSelect }: { student: Student; onSelect: () => void }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-lg hover:border-brand-primary/30 group">
    <div className="flex items-center gap-4">
      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=e6f7fd&color=09b2eb&bold=true`} alt={student.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-light transition-transform group-hover:scale-105" />
      <div>
        <h3 className="font-bold text-lg text-slate-800 group-hover:text-brand-primary transition-colors">{student.name}</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-slate-500">
          <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100"><BookOpen className="w-3 h-3 text-brand-primary" /> {student.department}</span>
          <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> সেশন: {student.session}</span>
        </div>
        <p className="text-[10px] mt-1 text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {student.union}</p>
      </div>
    </div>
    <button onClick={onSelect} className="w-full sm:w-auto px-6 py-2.5 bg-brand-light text-brand-primary font-bold rounded-xl border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all text-sm flex items-center justify-center gap-2">বিস্তারিত <ChevronRight className="w-4 h-4" /></button>
  </div>
);

const EmptyState = ({ query }: { query: string }) => (
  <div className="text-center py-16 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"><Search className="w-10 h-10 opacity-20" /></div>
    <p className="text-lg font-medium text-slate-600">কোন ফলাফল পাওয়া যায়নি!</p>
    <p className="text-sm px-10">"{query}" এর সাথে মেলে এমন কোন তথ্য নেই।</p>
  </div>
);
