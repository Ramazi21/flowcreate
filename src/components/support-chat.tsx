"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: number;
}

const STORAGE_KEY = "flow-support-chat-history";

export function SupportChat() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || "Гость";

  // Загрузка истории из LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load chat history", e);
      }
    } else {
      // Начальное приветствие
      setMessages([
        {
          id: "welcome",
          text: `Здравствуйте, ${userName}! Чем мы можем вам помочь?`,
          sender: "support",
          timestamp: Date.now(),
        },
      ]);
    }
  }, [userName]);

  // Сохранение в LocalStorage при изменении сообщений
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
    // Автопрокрутка вниз
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Имитация ответа поддержки
    setTimeout(() => {
      const supportReply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Спасибо за ваше сообщение! Наш специалист свяжется с вами в ближайшее время.",
        sender: "support",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, supportReply]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Кнопка открытия/закрытия */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-charcoal text-white shadow-2xl transition-transform hover:scale-110 active:scale-95"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-7 w-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        )}
      </button>

      {/* Окно чата */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex h-[450px] w-[320px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 md:w-[380px]">
          {/* Шапка чата */}
          <div className="bg-charcoal p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full bg-slate-200 p-1">
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-charcoal bg-green-500" title="Онлайн"></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-full w-full text-charcoal/50">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold">Поддержка Flow</h4>
                <p className="text-[10px] text-white/60">Всегда онлайн • Ответим сразу</p>
              </div>
            </div>
          </div>

          {/* Список сообщений */}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-charcoal text-white rounded-br-none"
                      : "bg-white text-charcoal rounded-bl-none"
                  }`}
                >
                  {msg.text}
                  <div className={`mt-1 text-[9px] ${msg.sender === "user" ? "text-white/50" : "text-charcoal/40"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Форма отправки */}
          <form onSubmit={handleSend} className="border-t bg-white p-3 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Напишите сообщение..."
              className="flex-1 rounded-full border bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal text-white transition-opacity disabled:opacity-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 rotate-90">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
