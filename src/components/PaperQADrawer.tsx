import React, { useState } from 'react';
import { PaperAnalysisResult } from '../utils/paperAnalysis';
import { X, Send, MessageSquare, Bot, User, Loader2, Sparkles } from 'lucide-react';

interface PaperQADrawerProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: PaperAnalysisResult;
  paperText: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const PaperQADrawer: React.FC<PaperQADrawerProps> = ({
  isOpen,
  onClose,
  analysis,
  paperText
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `I have analyzed "${analysis.title}". You can ask me any specific question about the architecture, benchmark numbers, assumptions, or implementation details!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    'What was the primary baseline compared against?',
    'What are the compute and hardware requirements?',
    'What failure modes should I watch out for in production?'
  ];

  const handleSend = async (queryText: string) => {
    const q = queryText.trim();
    if (!q || isAsking) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setIsAsking(true);

    try {
      const res = await fetch('/api/ask-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paperTitle: analysis.title,
          paperText: paperText,
          question: q,
          analysisContext: {
            step1: analysis.step1CoreProblem,
            step2: analysis.step2Architecture,
            step3: analysis.step3Results,
            step4: analysis.step4Limitations,
            step5: analysis.step5Takeaways
          }
        })
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        role: 'assistant',
        content: data.answer || 'No answer could be retrieved.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Q&A error:', err);
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: 'Apologies, I encountered a connection issue. Please check the limitations and methodology cards in the main report.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Paper Q&A Agent
              </h2>
              <p className="text-[11px] text-slate-500 truncate max-w-[280px]">
                {analysis.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/60 transition-colors"
            aria-label="Close Q&A Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Suggested Quick Questions */}
        <div className="p-3 bg-indigo-50/50 border-b border-indigo-100 flex flex-col gap-1.5 text-xs">
          <span className="font-semibold text-indigo-900 text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick Inquiries
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((qq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(qq)}
                className="text-[11px] px-2 py-1 bg-white hover:bg-indigo-100/60 border border-indigo-200 text-slate-700 rounded transition-colors text-left"
              >
                {qq}
              </button>
            ))}
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <span
                    className={`block mt-1 text-[10px] ${
                      isUser ? 'text-indigo-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
                {isUser && (
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
          {isAsking && (
            <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>Analyzing paper context...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(question);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about methodology, metrics, limitations..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isAsking || !question.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Send Question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
