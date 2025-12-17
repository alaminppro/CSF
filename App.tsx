import React, { useState, useMemo } from 'react';
import { 
  Users, 
  MapPin, 
  ChevronRight, 
  BookOpen, 
  Phone, 
  Mail, 
  Facebook, 
  GraduationCap, 
  School,
  X,
  ChevronLeft,
  Building2,
  CalendarDays,
  Search
} from 'lucide-react';
import { STUDENTS, UNIONS } from './constants';
import { Student } from './types';

export default function App() {
  const [selectedUnion, setSelectedUnion] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [logoError, setLogoError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter students based on selected union and search query
  const filteredStudents = useMemo(() => {
    if (!selectedUnion) return [];
    
    let students = STUDENTS.filter(student => student.union === selectedUnion);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      students = students.filter(student => 
        student.name.toLowerCase().includes(query) ||
        student.department.toLowerCase().includes(query) ||
        student.session.toLowerCase().includes(query)
      );
    }

    return students;
  }, [selectedUnion, searchQuery]);

  // Handler for closing modal
  const closeModal = () => setSelectedStudent(null);

  // Handler for back to union list
  const handleBackToUnions = () => {
    setSelectedUnion(null);
    setSelectedStudent(null);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* Header */}
      <header className="bg-brand-green text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="bg-white p-1.5 rounded-full shadow-md shrink-0 overflow-hidden">
               {/* Logo Image: Ensure 'logo.png' is in your public folder */}
               {!logoError ? (
                 <img 
                   src="/logo.png" 
                   alt="Logo" 
                   className="w-16 h-16 object-contain" 
                   onError={(e) => {
                     console.error("Logo load failed. Please ensure 'logo.png' exists in the 'public' folder.");
                     setLogoError(true);
                   }}
                 />
               ) : (
                 <div className="w-16 h-16 flex items-center justify-center bg-slate-100 rounded-full">
                    <GraduationCap className="w-10 h-10 text-brand-green" />
                 </div>
               )}
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Companiganj (Noakhali) Students' Forum, University of Chittagong</h1>
              <p className="text-sm opacity-90 text-slate-100 font-medium mt-1">জ্ঞানের পথে চলি একসাথে</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-6">
        
        {/* View 1: Union Selector */}
        {!selectedUnion ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-brand-green mb-2">ইউনিয়ন নির্বাচন করুন</h2>
              <p className="text-slate-500">বর্তমান ছাত্রছাত্রীদের নামের তালিকা দেখতে নিচে ক্লিক করুন</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {UNIONS.map((union, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedUnion(union)}
                  className="group relative bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-brand-green hover:shadow-md transition-all duration-300 text-left flex items-center justify-between overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-green opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center gap-3 z-10">
                    <div className="bg-brand-light p-2 rounded-lg group-hover:bg-brand-green group-hover:text-white transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-lg text-slate-700 group-hover:text-brand-green transition-colors">
                      {union}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-brand-green group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* View 2: Student List */
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            
            {/* Nav Back */}
            <button 
              onClick={handleBackToUnions}
              className="flex items-center text-slate-500 hover:text-brand-green mb-4 transition-colors font-medium"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              পেছনে যান (Back)
            </button>

            {/* List Header */}
            <div className="bg-brand-green rounded-xl p-6 text-white mb-6 shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                 <Users className="w-32 h-32" />
              </div>
              <h2 className="text-2xl font-bold mb-1">{selectedUnion}</h2>
              <p className="opacity-90 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                মোট ছাত্র-ছাত্রী: {filteredStudents.length} জন
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="খুঁজুন (নাম, বিভাগ বা সেশন)..."
                className="block w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent shadow-sm transition-shadow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                 <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                 >
                    <X className="h-5 w-5" />
                 </button>
              )}
            </div>

            {/* List Items */}
            <div className="space-y-3">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div 
                    key={student.id}
                    className="bg-white rounded-lg shadow-sm border border-slate-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                         {/* Avatar Placeholder */}
                         <img 
                          src={`https://picsum.photos/seed/${student.id}/100/100`} 
                          alt={student.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-slate-100"
                         />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{student.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> {student.department}
                          </span>
                          <span className="hidden sm:inline text-slate-300">•</span>
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" /> {student.session}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedStudent(student)}
                      className="w-full sm:w-auto px-5 py-2 bg-slate-50 hover:bg-brand-green hover:text-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:border-brand-green transition-all text-sm flex items-center justify-center gap-2"
                    >
                      বিস্তারিত দেখুন
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>
                    {searchQuery 
                      ? "কোন ফলাফল পাওয়া যায়নি।" 
                      : "এই ইউনিয়নের জন্য কোন তথ্য পাওয়া যায়নি।"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-slate-400 text-sm pb-8">
        <p>
          © 2025 Companiganj (Noakhali) Students' Forum, CU | Developed by: {' '}
          <a 
            href="https://www.facebook.com/itsmdalamin" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-brand-green hover:underline font-medium"
          >
            Md Al Amin
          </a>
        </p>
      </footer>

      {/* View 3: Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>
          
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-brand-green p-4 flex justify-between items-start text-white">
              <h3 className="font-bold text-lg pr-8">ছাত্র বিস্তারিত (Student Details)</h3>
              <button 
                onClick={closeModal}
                className="bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="text-center mb-6">
                 <img 
                    src={`https://picsum.photos/seed/${selectedStudent.id}/150/150`} 
                    alt={selectedStudent.name}
                    className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg -mt-12 bg-white"
                 />
                 <h2 className="text-2xl font-bold text-brand-green mt-3">{selectedStudent.name}</h2>
                 <p className="text-slate-500 font-medium">{selectedStudent.department} (Session: {selectedStudent.session})</p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3">
                   <div className="bg-white p-2 rounded-full shadow-sm text-brand-red">
                     <Building2 className="w-5 h-5" />
                   </div>
                   <div className="overflow-hidden">
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Union</p>
                      <p className="text-slate-800 font-medium truncate">{selectedStudent.union}</p>
                   </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3">
                   <div className="bg-white p-2 rounded-full shadow-sm text-blue-500">
                     <School className="w-5 h-5" />
                   </div>
                   <div className="overflow-hidden">
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Education</p>
                      <p className="text-slate-800 text-sm"><span className="font-semibold">High School:</span> {selectedStudent.highSchool}</p>
                      <p className="text-slate-800 text-sm"><span className="font-semibold">Primary:</span> {selectedStudent.primarySchool}</p>
                   </div>
                </div>
                
                <div className="pt-2">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Contact Info</p>
                    <div className="grid grid-cols-1 gap-2">
                        <a 
                          href={selectedStudent.gender === 'female' ? undefined : `tel:${selectedStudent.mobile}`} 
                          className={`flex items-center gap-3 p-3 rounded-lg border border-slate-200 transition-all group ${
                            selectedStudent.gender === 'female' 
                              ? 'bg-slate-50 cursor-default' 
                              : 'hover:border-brand-green hover:bg-brand-light'
                          }`}
                          onClick={(e) => selectedStudent.gender === 'female' && e.preventDefault()}
                        >
                            <Phone className={`w-5 h-5 text-slate-400 ${selectedStudent.gender !== 'female' && 'group-hover:text-brand-green'}`} />
                            {selectedStudent.gender === 'female' ? (
                               <span className="text-slate-400 font-medium blur-sm select-none">017XXXXXXXX</span>
                            ) : (
                               <span className="text-slate-700 font-medium">{selectedStudent.mobile}</span>
                            )}
                        </a>
                        <a href={`mailto:${selectedStudent.email}`} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-brand-green hover:bg-brand-light transition-all group">
                            <Mail className="w-5 h-5 text-slate-400 group-hover:text-brand-green" />
                            <span className="text-slate-700 font-medium">{selectedStudent.email}</span>
                        </a>
                        <a 
                            href={`https://${selectedStudent.facebook}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                        >
                            <Facebook className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                            <span className="text-slate-700 font-medium group-hover:text-blue-700">Facebook Profile</span>
                        </a>
                    </div>
                </div>

              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-center">
                <button 
                  onClick={closeModal}
                  className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-full transition-colors"
                >
                  বন্ধ করুন (Close)
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}