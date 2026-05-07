import { User, Settings, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';


export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#d9d9d9] font-sans text-black" dir="rtl">
      
      {/* Top Header */}
      <header className="w-full bg-brand-purple-end py-4 px-6 flex items-center justify-between shadow-md text-white sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <ArrowRight size={24} />
          <span className="font-semibold text-lg">חזרה לראשי</span>
        </Link>
        <div className="font-bold text-xl text-[#FFB20F] tracking-wide">
          זינוק <span className="text-brand-pink-start">כחול-לבן</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start mb-12 border-t-4 border-brand-purple-start relative">
          <button className="absolute top-4 left-4 text-gray-400 hover:text-black transition-colors">
            <Settings size={24} />
          </button>

          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-[#25FF10] shadow-lg">
              <User size={64} className="text-gray-400" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">אורי</h1>
              <p className="text-brand-purple-start font-medium">מנהל פלטפורמה</p>
            </div>
          </div>

          <div className="flex-1 w-full space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <BookOpen size={20} className="text-[#FF00EF]" />
                תחומי עניין עיקריים
              </h3>
              <div className="flex gap-2">
                <span className="bg-[#0084ff] text-white px-3 py-1 rounded-full text-sm font-medium">מתמטיקה</span>
                <span className="bg-[#ff3b30] text-white px-3 py-1 rounded-full text-sm font-medium">פיזיקה</span>
                <span className="bg-[#00c7b5] text-white px-3 py-1 rounded-full text-sm font-medium">מדעי המחשב</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Clock size={20} className="text-[#FFB20F]" />
                פעילות אחרונה
              </h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                פרסמת פוסט חדש בנושא "כללי" לפני כשעתיים.
              </p>
            </div>
          </div>
        </div>


      </main>
    </div>
  );
}
