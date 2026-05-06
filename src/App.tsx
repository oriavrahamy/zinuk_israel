import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, User } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Admin Edit In Place Component
function EditableText({ initialText, className, tag: Tag = "span", onSave }: { initialText: string, className?: string, tag?: any, onSave?: (text: string) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onSave) onSave(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && Tag !== "p" && Tag !== "div") {
      setIsEditing(false);
      if (onSave) onSave(text);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setText(initialText);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn("bg-white/90 border border-brand-purple-start rounded px-2 py-1 outline-none text-black", className)}
      />
    );
  }

  return (
    <Tag 
      onContextMenu={handleContextMenu} 
      className={cn("cursor-context-menu hover:outline-dashed hover:outline-1 hover:outline-black/30 transition-all rounded px-1 -ml-1 inline-block", className)}
      title="לחיצה ימנית לעריכה (מנהל)"
    >
      {text}
    </Tag>
  );
}

const CIRCLE_SUBJECTS = [
  { name: "מתמטיקה", color: "bg-[#0084ff]" }, // Blue
  { name: "היסטוריה", color: "bg-[#ffb320]" }, // Orange/Yellow
  { name: "פיזיקה", color: "bg-[#ff3b30]" }, // Red
  { name: "אנגלית", color: "bg-[#00c7b5]" }, // Teal
  { name: "לשון", color: "bg-[#34c759]" }, // Green
  { name: "אזרחות", color: "bg-[#af52de]" }, // Purple
];

interface Post {
  id: string;
  author: string;
  content: string;
  subject: string;
  timestamp: Date;
}

import { Link } from 'react-router-dom';

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || "";

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    if (!GOOGLE_SCRIPT_URL) {
      // Fallback to local mock data if no Google Sheet connected yet
      setPosts([
        {
          id: "1",
          author: "אורי (מנהל)",
          content: "האתר מוכן! ברגע שתחבר את ה-Google Sheet שלך, הפוסטים האמיתיים יופיעו כאן.",
          subject: "כללי",
          timestamp: new Date()
        }
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();
      const loadedPosts = data.map((item: any) => ({
        id: item.id,
        author: item.author,
        subject: item.subject,
        content: item.content,
        timestamp: new Date(item.timestamp)
      }));
      setPosts(loadedPosts);
    } catch (err) {
      console.error("שגיאה בטעינת נתונים:", err);
    }
    setIsLoading(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostSubject, setNewPostSubject] = useState("מתמטיקה");
  const [errorMsg, setErrorMsg] = useState("");

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    // Placeholder Logic: Basic moderation
    const badWords = ["קללה", "טיפש", "מטומטם"];
    const hasBadWords = badWords.some(word => newPostContent.includes(word));
    
    if (hasBadWords) {
      setErrorMsg("הפוסט מכיל מילים שאינן עומדות בכללי הקהילה שלנו.");
      return;
    }

    if (newPostContent.trim() === "") {
      setErrorMsg("אנא כתוב תוכן לפוסט.");
      return;
    }

    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      author: "אורי",
      content: newPostContent,
      subject: newPostSubject,
      timestamp: new Date()
    };

    if (GOOGLE_SCRIPT_URL) {
      // Send to Google Sheets
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          // We don't set Content-Type to application/json to avoid CORS preflight errors
          body: JSON.stringify({
            author: newPost.author,
            subject: newPost.subject,
            content: newPost.content
          })
        });
        fetchPosts(); // Refresh from DB
      } catch (err) {
        console.error("שגיאה בשמירת הפוסט:", err);
      }
    } else {
      // Local State Update
      setPosts([newPost, ...posts]);
    }

    setNewPostContent("");
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#d9d9d9] font-sans selection:bg-brand-purple-start selection:text-white relative pb-20">
      
      {/* Top Header */}
      <header className="w-full bg-brand-purple-end py-6 flex flex-col items-center justify-center relative shadow-md">
        {/* Profile Link */}
        <Link to="/profile" className="absolute top-6 left-6 text-white hover:text-[#FFB20F] transition-colors flex items-center gap-2" title="פרופיל אישי">
          <User size={28} />
          <span className="font-semibold text-sm hidden md:inline">פרופיל אישי</span>
        </Link>
        
        <div className="relative">
           {/* Small sparkles/stars icon simulation */}
           <div className="absolute -top-4 -right-6 text-brand-green text-2xl font-bold rotate-12">✦</div>
           <div className="absolute top-2 -right-10 text-brand-green text-lg font-bold rotate-45">✦</div>
           
           <h1 className="text-6xl font-bold tracking-tight text-[#FFB20F]" style={{ fontFamily: 'system-ui, sans-serif' }}>
             <EditableText initialText="זינוק" />
           </h1>
        </div>
        <div className="text-brand-pink-start text-xl font-bold -mt-1 ml-16 transform -rotate-2">
          <EditableText initialText="כחול-לבן" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pt-10 pb-8 flex flex-col items-center">
        
        {/* Greeting */}
        <h2 className="text-4xl md:text-5xl font-medium text-black mb-8 text-center flex items-center justify-center gap-3">
          <EditableText initialText="מה קורה אורי" />
          <span className="text-4xl inline-block animate-wave transform origin-bottom-right">👋</span> 
          <EditableText initialText="מה תרצה ללמוד היום?" />
        </h2>

        {/* Subjects Circles */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-12 relative flex-row-reverse">
          {/* flex-row-reverse in RTL means it will render LTR visually */}
          {CIRCLE_SUBJECTS.map((subject, idx) => (
            <div 
              key={idx} 
              className={cn(
                "w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-black font-semibold text-lg md:text-xl shadow-sm transition-transform hover:scale-105 cursor-pointer relative",
                subject.color
              )}
            >
              <EditableText initialText={subject.name} />
              
              {/* "עוד" (More) overlapping button on the Purple circle */}
              {subject.color === "bg-[#af52de]" && (
                <div className="absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#a3a3a3] text-black px-2 py-1 text-sm font-medium cursor-pointer hover:bg-gray-500 transition-colors z-10 opacity-90 shadow-sm">
                  <EditableText initialText="עוד" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Grid Layout (Posts and Notice Board) */}
        <div className="w-full flex flex-col lg:flex-row gap-6 mt-4">
          
          {/* Right Column (Notice Board) - visually on the Right */}
          <div className="bg-[#FFB20F] p-6 lg:w-1/3 min-h-[400px] shadow-sm flex flex-col items-center order-1 lg:order-1">
            <h3 className="text-black font-bold text-xl mb-6">
              <EditableText initialText="לוח מודעות" />
            </h3>
            
            {/* Notice Board Items */}
            <div className="w-full space-y-4">
              <div className="w-full bg-[#e5e5e5] shadow-inner p-4 rounded-md">
                <EditableText tag="div" className="font-semibold text-black" initialText="תזכורת: בגרות במתמטיקה" />
                <EditableText tag="div" className="text-sm text-gray-700 mt-1" initialText="הבגרות תתקיים ב-25.5, בהצלחה לכולם!" />
              </div>
              <div className="w-full bg-[#e5e5e5] shadow-inner p-4 rounded-md">
                <EditableText tag="div" className="font-semibold text-black" initialText="שעות פעילות צוות האתר" />
                <EditableText tag="div" className="text-sm text-gray-700 mt-1" initialText="ימים א'-ה', 08:00 - 20:00" />
              </div>
            </div>
          </div>

          {/* Left Column (Recent Posts) - visually on the Left */}
          <div className="bg-[#25FF10] p-6 lg:w-2/3 min-h-[400px] shadow-sm relative order-2 lg:order-2 flex flex-col">
            <h3 className="text-black font-bold text-xl mb-4 text-right">
              <EditableText initialText="פוסטים אחרונים" />
            </h3>
            
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              {isLoading ? (
                <div className="text-center text-black/60 mt-10 animate-pulse">טוען נתונים...</div>
              ) : (
                <>
                  {posts.map(post => (
                    <div key={post.id} className="bg-white/90 p-4 rounded-xl shadow-sm text-black group relative">
                      <div className="flex items-center justify-between mb-2 border-b border-gray-200 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-200 p-1.5 rounded-full"><User size={16} /></div>
                          <span className="font-semibold text-sm">{post.author}</span>
                          <span className="text-xs text-gray-500 mr-2">• {post.subject}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {post.timestamp.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <EditableText tag="p" initialText={post.content} className="text-gray-800" />
                      
                      {/* Report Button */}
                      <button className="text-xs text-red-500 absolute left-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        דווח על תוכן
                      </button>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <div className="text-center text-black/60 mt-10">אין פוסטים להצגה. היה הראשון לשתף!</div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#FF00EF] rounded-full flex items-center justify-center text-black shadow-lg hover:scale-110 transition-transform active:scale-95 z-40"
      >
        <Plus size={32} strokeWidth={2.5} />
      </button>

      {/* New Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-black w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 left-4 text-gray-500 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-bold mb-6 text-right text-brand-purple-start">יצירת פוסט חדש</h3>
            
            <form onSubmit={handleCreatePost} className="space-y-4" dir="rtl">
              <div>
                <label className="block text-sm font-medium mb-1">נושא</label>
                <select 
                  value={newPostSubject}
                  onChange={(e) => setNewPostSubject(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-purple-start focus:border-brand-purple-start outline-none"
                >
                  {CIRCLE_SUBJECTS.map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                  <option value="כללי">כללי</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">תוכן הפוסט</label>
                <textarea 
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:ring-2 focus:ring-brand-purple-start focus:border-brand-purple-start outline-none"
                  placeholder="מה תרצה לשתף עם הקהילה?"
                />
              </div>

              {errorMsg && (
                <div className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded">
                  {errorMsg}
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-gradient-purple text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                פרסם פוסט
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
