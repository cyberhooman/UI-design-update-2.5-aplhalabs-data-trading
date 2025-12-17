import React, { useState, useEffect } from 'react';
import { Send, Sparkles, Trash2, CheckCircle2, StickyNote } from 'lucide-react';
import { Note } from '../types';

const QuickNoteBlock: React.FC = () => {
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem('alphalabs_notes');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('alphalabs_notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    
    const newNote: Note = {
      id: Date.now().toString(),
      content: noteText,
      type: 'note',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setNotes([newNote, ...notes]);
    setNoteText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddNote();
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="bg-notion-overlay backdrop-blur-xl border border-notion-border rounded-2xl p-4 h-full flex flex-col shadow-xl transition-colors duration-300">
       <div className="flex items-center gap-2 mb-3 shrink-0">
        <Sparkles size={14} className="text-yellow-500" />
        <h3 className="text-sm font-display font-semibold text-notion-text tracking-wide">Scratchpad</h3>
        <span className="text-[10px] text-notion-muted ml-auto font-mono bg-notion-block/50 px-1.5 py-0.5 rounded border border-notion-border">{notes.length}</span>
      </div>

      <div className="flex-1 bg-notion-block/40 border border-notion-border inner-shadow rounded-xl p-2 mb-3 overflow-y-auto custom-scrollbar relative">
         {notes.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
                <StickyNote size={24} className="mb-2 text-notion-muted" />
                <p className="text-[10px] font-mono text-notion-muted italic text-center"> // System ready for input</p>
                <p className="text-[9px] text-notion-muted/50 mt-1">Local storage active</p>
            </div>
         ) : (
             <div className="space-y-1">
                 {notes.map(note => (
                     <div key={note.id} className="group flex items-start gap-2 p-2 rounded-lg hover:bg-notion-hover/80 transition-all border border-transparent hover:border-notion-border/50 text-xs text-notion-text animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <button 
                            className="mt-0.5 text-notion-muted/50 hover:text-green-500 transition-colors cursor-pointer shrink-0" 
                            onClick={() => deleteNote(note.id)}
                            title="Complete/Archive"
                         >
                             <CheckCircle2 size={14} /> 
                         </button>
                         <div className="flex-1 break-words leading-relaxed font-mono text-[11px]">
                             {note.content}
                         </div>
                         <div className="flex flex-col items-end gap-1 shrink-0">
                             <span className="text-[9px] text-notion-muted opacity-40 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                 {note.createdAt}
                             </span>
                             <button 
                                onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                                className="opacity-0 group-hover:opacity-100 text-notion-muted hover:text-red-500 transition-colors"
                             >
                                 <Trash2 size={12} />
                             </button>
                         </div>
                     </div>
                 ))}
             </div>
         )}
      </div>

      <div className="flex gap-2 shrink-0 relative">
          <input 
            type="text" 
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Quick capture..."
            className="flex-1 bg-notion-block/50 border border-notion-border rounded-lg px-3 py-2 text-xs text-notion-text placeholder-notion-muted font-mono focus:outline-none focus:border-blue-500/50 focus:bg-notion-hover transition-all pr-8"
          />
          <button 
            onClick={handleAddNote}
            className="absolute right-1.5 top-1.5 p-1 bg-blue-500 hover:bg-blue-400 text-white rounded-md transition-all shadow-lg shadow-blue-500/20"
          >
              <Send size={12} />
          </button>
      </div>
    </div>
  );
};

export default QuickNoteBlock;