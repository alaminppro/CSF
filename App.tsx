import React, { useState, useMemo } from 'react';
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
  Home
} from 'lucide-react';
import { STUDENTS, UNIONS } from './constants';
import { Student } from './types';

// Dedicated Logo Component
const Logo = () => (
  <div className="bg-white p-1.5 rounded-full shadow-md shrink-0 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 overflow-hidden border border-slate-100">
     <img 
        src="/logo.png" 
        alt="Forum Logo" 
        className="w-full h-full object-contain"
        onError={(e) => {
          // If local logo.png is missing, fallback to the blue theme placeholder
          e.currentTarget.src = "https://scontent.fcgp3-2.fna.fbcdn.net/v/t39.30808-1/472265008_1033168891946375_7161103710877360556_n.jpg?stp=c0.0.1250.1250a_dst-jpg_s200x200_tt6&_nc_cat=101&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=eIY5igmmmzwQ7kNvwF_67k8&_nc_oc=Adn_qhvwU_3lQqc-Qt2gY8Hdrek8gUyObaeEX_ORddgFPiQQOuDOjTES71MUSEEFes8&_nc_zt=24&_nc_ht=scontent.fcgp3-2.fna&_nc_gid=EwsRRq6z-Um5S3CTRyTDGg&oh=00_Afn-63pBGKRcuHEp9_j6N7-yzTZ2VEfFX55K7KkwKXqOEw&oe=69498B4C";
        }}
     />
  </div>
);

export default function App() {
  const [selectedUnion, setSelectedUnion] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Logic to determine which students to show
  const displayStudents = useMemo(() => {
    let baseList = selectedUnion 
      ? STUDENTS.filter(s => s.union === selectedUnion) 
      : STUDENTS;

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
  }, [selectedUnion, searchQuery]);

  const closeModal = () => setSelectedStudent(null);

  const handleBackToUnions = () => {
    setSelectedUnion(null);
    setSelectedStudent(null);
    setSearchQuery('');
  };

  const handleUnionSelect = (union: string) => {
    setSelectedUnion(union);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12 transition-colors duration-300">
      {/* Header */}
      <header className="bg-brand-primary text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Logo />
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
        
        {/* Universal Search Bar - Always visible except when viewing detail modal */}
        <div className="mb-6 sticky top-[100px] z-10 bg-slate-50/80 backdrop-blur-md py-2 px-1 rounded-xl">
           <div className="relative group">
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
                 <button 
                  onClick={() => setSearchQuery('')} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-brand-primary transition-colors"
                 >
                    <X className="h-6 w-6" />
                 </button>
              )}
           </div>
           {searchQuery && !selectedUnion && (
             <p className="mt-2 text-sm text-brand-primary font-medium animate-pulse">
                সার্চ রেজাল্ট দেখানো হচ্ছে...
             </p>
           )}
        </div>

        {/* View 1: Union Selector or Search Results (when no union selected) */}
        {!selectedUnion ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {searchQuery ? (
              /* Global Search Results */
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-slate-700 mb-4 px-1 flex items-center gap-2">
                  <Search className="w-5 h-5 text-brand-primary" />
                  খুঁজে পাওয়া গেছে: {displayStudents.length} জন
                </h2>
                {displayStudents.length > 0 ? (
                  displayStudents.map((student) => (
                    <StudentListItem key={student.id} student={student} onSelect={() => setSelectedStudent(student)} />
                  ))
                ) : (
                  <EmptyState query={searchQuery} />
                )}
              </div>
            ) : (
              /* Union Grid */
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-brand-primary mb-2">ইউনিয়ন নির্বাচন করুন</h2>
                  <p className="text-slate-500">আপনার ইউনিয়নের ছাত্রছাত্রীদের দেখতে নিচে ক্লিক করুন</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {UNIONS.map((union, index) => (
                    <button
                      key={index}
                      onClick={() => handleUnionSelect(union)}
                      className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-brand-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex items-center justify-between overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex items-center gap-4 z-10">
                        <div className="bg-brand-light p-3 rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-colors">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="font-bold text-lg text-slate-700 group-hover:text-brand-primary transition-colors block">
                            {union}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">বিস্তারিত দেখতে ট্যাপ করুন</span>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* View 2: Union Specific List */
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <button 
              onClick={handleBackToUnions}
              className="flex items-center text-slate-500 hover:text-brand-primary mb-4 transition-colors font-bold group"
            >
              <ChevronLeft className="w-6 h-6 mr-1 group-hover:-translate-x-1 transition-transform" />
              ইউনিয়ন লিস্টে ফিরে যান
            </button>

            <div className="bg-brand-primary rounded-2xl p-8 text-white mb-6 shadow-xl relative overflow-hidden border-b-4 border-brand-secondary">
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                 <Users className="w-40 h-40" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-brand-light/80 font-bold uppercase tracking-wider text-xs">
                  <MapPin className="w-3.5 h-3.5" />
                  Location
                </div>
                <h2 className="text-3xl font-bold mb-2">{selectedUnion}</h2>
                <div className="flex items-center gap-2 bg-black/10 w-fit px-3 py-1 rounded-full text-sm font-medium border border-white/10">
                  <Users className="w-4 h-4" />
                  মোট ছাত্র-ছাত্রী: {displayStudents.length} জন
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {displayStudents.length > 0 ? (
                displayStudents.map((student) => (
                  <StudentListItem key={student.id} student={student} onSelect={() => setSelectedStudent(student)} />
                ))
              ) : (
                <EmptyState query={searchQuery} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-slate-400 text-sm pb-8 border-t border-slate-200 pt-8 mx-4">
        <p className="flex items-center justify-center gap-2 flex-wrap">
          <span>© 2025 Companiganj (Noakhali) Students' Forum, CU</span>
          <span className="hidden sm:inline">|</span>
          <span>Developed by: <a href="https://www.facebook.com/itsmdalamin" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline font-bold">Md Al Amin</a></span>
        </p>
      </footer>

      {/* View 3: Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity" onClick={closeModal}></div>
          
          <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-brand-primary p-5 flex justify-between items-start text-white relative">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
              <h3 className="font-bold text-xl relative z-10">ছাত্র বিস্তারিত (Profile)</h3>
              <button 
                onClick={closeModal}
                className="bg-white/20 hover:bg-white/40 rounded-full p-2 transition-all active:scale-90 relative z-10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="text-center mb-8">
                 <div className="relative inline-block">
                    <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&size=128&background=e6f7fd&color=09b2eb&bold=true`} 
                        alt={selectedStudent.name}
                        className="w-28 h-28 rounded-full mx-auto border-4 border-white shadow-xl -mt-16 bg-white object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-brand-primary border-2 border-white w-6 h-6 rounded-full flex items-center justify-center">
                       <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                 </div>
                 <h2 className="text-2xl font-black text-slate-800 mt-4">{selectedStudent.name}</h2>
                 <p className="text-brand-primary font-bold text-sm bg-brand-light px-3 py-1 rounded-full inline-block mt-1">
                    {selectedStudent.department} ({selectedStudent.session})
                 </p>
              </div>

              <div className="space-y-5">
                {/* Info Card: Location */}
                <div className="flex gap-4 items-start p-1">
                   <div className="bg-brand-light p-3 rounded-2xl text-brand-primary">
                     <Building2 className="w-6 h-6" />
                   </div>
                   <div className="flex-1 border-b border-slate-100 pb-2">
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Union Name</p>
                      <p className="text-slate-800 font-bold text-lg">{selectedStudent.union}</p>
                   </div>
                </div>

                {/* Info Card: Village + Ward */}
                <div className="flex gap-4 items-start p-1">
                   <div className="bg-amber-50 p-3 rounded-2xl text-amber-500">
                     <Home className="w-6 h-6" />
                   </div>
                   <div className="flex-1 border-b border-slate-100 pb-2">
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">গ্রাম + ওয়ার্ড নং</p>
                      <p className="text-slate-800 font-bold text-lg">{selectedStudent.villageWard || 'তথ্য নেই'}</p>
                   </div>
                </div>

                {/* Info Card: Education */}
                <div className="flex gap-4 items-start p-1">
                   <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-500">
                     <School className="w-6 h-6" />
                   </div>
                   <div className="flex-1 border-b border-slate-100 pb-2">
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Education Background</p>
                      <div className="space-y-1 mt-1">
                        <p className="text-slate-700 text-sm leading-snug"><span className="font-bold text-slate-900">স্কুল:</span> {selectedStudent.highSchool}</p>
                        <p className="text-slate-700 text-sm leading-snug"><span className="font-bold text-slate-900">কলেজ:</span> {selectedStudent.college}</p>
                      </div>
                   </div>
                </div>
                
                {/* Contact Actions */}
                <div className="pt-4 space-y-3">
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest ml-1">Connect with {selectedStudent.name.split(' ')[0]}</p>
                    <div className="grid grid-cols-1 gap-3">
                        <a 
                          href={selectedStudent.gender === 'female' ? undefined : `tel:${selectedStudent.mobile}`} 
                          className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all active:scale-95 group ${selectedStudent.gender === 'female' ? 'bg-slate-50 border-slate-100 cursor-not-allowed' : 'border-slate-100 hover:border-brand-primary hover:bg-brand-light'}`}
                          onClick={(e) => selectedStudent.gender === 'female' && e.preventDefault()}
                        >
                            <div className={`p-2 rounded-xl bg-white shadow-sm ${selectedStudent.gender === 'female' ? 'text-slate-300' : 'text-brand-primary'}`}>
                               <Phone className="w-5 h-5" />
                            </div>
                            <div className="overflow-hidden">
                               <p className="text-xs text-slate-400 font-bold uppercase">Call Student</p>
                               <p className="text-slate-800 font-bold">
                                  {selectedStudent.gender === 'female' ? "017XXXXXXXX (Privacy)" : selectedStudent.mobile}
                               </p>
                            </div>
                        </a>

                        <a 
                          href={`mailto:${selectedStudent.email}`} 
                          className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-brand-primary hover:bg-brand-light transition-all active:scale-95 group"
                        >
                            <div className="p-2 rounded-xl bg-white shadow-sm text-brand-primary">
                               <Mail className="w-5 h-5" />
                            </div>
                            <div className="overflow-hidden">
                               <p className="text-xs text-slate-400 font-bold uppercase">Email Address</p>
                               <p className="text-slate-800 font-bold truncate">{selectedStudent.email}</p>
                            </div>
                        </a>

                        <a 
                          href={selectedStudent.facebook.startsWith('http') ? selectedStudent.facebook : `https://${selectedStudent.facebook}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all active:scale-95 group"
                        >
                            <div className="p-2 rounded-xl bg-white shadow-sm text-blue-600">
                               <Facebook className="w-5 h-5" />
                            </div>
                            <div className="overflow-hidden">
                               <p className="text-xs text-slate-400 font-bold uppercase">Facebook Profile</p>
                               <p className="text-slate-800 font-bold">Social Link</p>
                            </div>
                        </a>
                    </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="bg-slate-50 p-5 border-t border-slate-100 flex justify-center">
                <button 
                  onClick={closeModal}
                  className="px-10 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-brand-primary/20 active:scale-95"
                >
                  বন্ধ করুন
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component for student list items to keep code clean
const StudentListItem = ({ student, onSelect }: { student: Student; onSelect: () => void }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-lg hover:border-brand-primary/30 group">
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 relative">
         <img 
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=e6f7fd&color=09b2eb&bold=true`} 
          alt={student.name}
          className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-light group-hover:scale-105 transition-transform"
         />
      </div>
      <div>
        <h3 className="font-bold text-lg text-slate-800 group-hover:text-brand-primary transition-colors">{student.name}</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-slate-500">
          <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
            <BookOpen className="w-3 h-3 text-brand-primary" /> {student.department}
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3" /> সেশন: {student.session}
          </span>
        </div>
        <p className="text-[10px] mt-1 text-slate-400 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {student.union}
        </p>
      </div>
    </div>
    <button 
      onClick={onSelect} 
      className="w-full sm:w-auto px-6 py-2.5 bg-brand-light text-brand-primary font-bold rounded-xl border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all text-sm flex items-center justify-center gap-2 group/btn"
    >
      বিস্তারিত
      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
    </button>
  </div>
);

// Sub-component for empty states
const EmptyState = ({ query }: { query: string }) => (
  <div className="text-center py-16 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200 shadow-inner">
    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
      <Search className="w-10 h-10 opacity-20" />
    </div>
    <p className="text-lg font-medium text-slate-600">কোন ফলাফল পাওয়া যায়নি!</p>
    <p className="text-sm px-10">"{query}" এর সাথে মেলে এমন কোন তথ্য আমাদের ডাটাবেজে নেই।</p>
  </div>
);