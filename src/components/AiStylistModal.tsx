import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface AiStylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (p: Product) => void;
}

interface Message {
  role: 'assistant' | 'user';
  text: string;
}

export const AiStylistModal: React.FC<AiStylistModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [prompt, setPrompt] = useState('');
  const [childAge, setChildAge] = useState('3-4 Years');
  const [occasion, setOccasion] = useState('Birthday Party / Photoshoot');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hello from Rare by KidsPro! ✨ I am your personal Kids Fashion & Sizing Stylist. Whether you need outfit combinations for a birthday photoshoot, sibling matching sets, or advice on the perfect size for your child, ask me anything!',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || prompt;
    if (!textToSend.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', text: textToSend }];
    setMessages(newMessages);
    setPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          childAge,
          occasion,
          currentItems: products.map((p) => ({ name: p.name, category: p.category, price: p.price })),
        }),
      });

      const data = await res.json();
      setMessages([
        ...newMessages,
        { role: 'assistant', text: data.reply || 'Check out our signature Waffle Sets and Twirl Party Dresses!' },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: `For a ${childAge} child attending a ${occasion}, our top recommendations from @rare.bykidspro are the Royale Tulle & Silk Party Twirl Dress or the Luxe Waffle-Knit Resort Set with breathable retro sneakers!`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'What should my 4-year-old wear for an outdoor birthday shoot?',
    'What size should I buy for a 2-year-old toddler weighing 14kg?',
    'Do you have matching sets for a boy and baby girl?',
    'Which fabric is best for kids with sensitive eczema-prone skin?',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="ai-stylist-modal-container"
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col border border-neutral-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 via-neutral-900 to-neutral-900 text-white px-6 py-4 flex items-center justify-between border-b border-amber-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm font-display flex items-center gap-1.5">
                <span>Rare AI Kids Stylist & Size Advisor</span>
                <span className="text-[10px] font-bold bg-amber-400 text-neutral-950 px-1.5 py-0.2 rounded-full">
                  Gemini
                </span>
              </h3>
              <p className="text-[11px] text-amber-200/80">
                Grounded on @rare.bykidspro collections & sizing specs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Context Filter Pills */}
        <div className="bg-amber-50/80 px-6 py-2.5 border-b border-amber-100 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-neutral-700">Child Age:</span>
            <select
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
              className="bg-white border border-neutral-300 rounded-lg px-2 py-1 text-xs font-semibold"
            >
              <option value="0-6 Months">0-6 Months</option>
              <option value="6-12 Months">6-12 Months</option>
              <option value="1-2 Years">1-2 Years</option>
              <option value="3-4 Years">3-4 Years</option>
              <option value="5-6 Years">5-6 Years</option>
              <option value="7-8 Years">7-8 Years</option>
              <option value="9-12 Years">9-12 Years</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-neutral-700">Occasion:</span>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="bg-white border border-neutral-300 rounded-lg px-2 py-1 text-xs font-semibold"
            >
              <option value="Birthday Party / Photoshoot">Birthday Party / Photoshoot</option>
              <option value="Casual Play & Resort Vacation">Casual Play & Resort Vacation</option>
              <option value="Wedding / Family Milestone">Wedding / Family Milestone</option>
              <option value="Everyday School & Park Play">Everyday School & Park Play</option>
            </select>
          </div>
        </div>

        {/* Chat History Box */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[45vh]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 text-xs ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-neutral-900 text-white rounded-tr-none'
                    : 'bg-neutral-100 text-neutral-800 rounded-tl-none border border-neutral-200/80 shadow-2xs'
                }`}
              >
                {m.text}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-neutral-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 text-xs items-center">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-neutral-100 text-neutral-500 p-3 rounded-2xl rounded-tl-none border border-neutral-200 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-200" />
                <span className="text-[11px] font-semibold text-neutral-600">Selecting best kid styles...</span>
              </div>
            </div>
          )}
        </div>

        {/* Sample Prompt Starters */}
        <div className="px-6 py-2 bg-neutral-50 border-t border-neutral-100">
          <div className="text-[11px] font-bold text-neutral-500 mb-1.5">Suggestions:</div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {sampleQuestions.map((q, qIdx) => (
              <button
                key={qIdx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 bg-white hover:bg-amber-50 text-neutral-700 hover:text-amber-900 border border-neutral-200 hover:border-amber-300 rounded-lg text-[11px] whitespace-nowrap transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-neutral-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask about outfit ideas, birthday styles, or size conversions..."
              className="flex-1 text-xs p-3 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-200"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="px-4 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
