"use client";

import React, { useState, useRef, useEffect } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "What is the best time to visit Ladakh?",
  "Must-try vegetarian street foods in Varanasi?",
  "Cultural etiquette when visiting Hindu temples in India?",
  "How to travel affordably across Rajasthan?",
];

export default function GrokAssistantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Namaste! 🙏 I am your Go-Bharat AI travel companion powered by Grok. Ask me anything about destinations, culture, etiquette, hidden gems, or local food across India!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", content: textToSend.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/grok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend.trim(),
          history: messages.slice(-4),
        }),
      });

      const data = await res.json();

      if (!res.ok && !data.message) {
        setError(data.error || "Unable to reach Grok AI. Please try again.");
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message || "I didn't receive an answer. Please ask again.",
          },
        ]);
      }
    } catch (err: any) {
      setError("Network timeout or connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-500/30 transition hover:scale-105 active:scale-95"
        >
          <span className="text-lg">✨</span>
          <span>Ask Grok AI Guide</span>
        </button>
      </div>

      {/* CHAT MODAL DIALOG */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative flex h-[620px] w-full max-w-xl flex-col rounded-3xl border border-gray-100 bg-white shadow-2xl overflow-hidden">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-xl backdrop-blur-md">
                  🇮🇳
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    Go-Bharat AI Guide
                  </h3>
                  <p className="text-xs text-orange-100">
                    Secure Server-Side xAI Grok Proxy
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/15 text-lg font-bold transition hover:bg-black/30"
              >
                ✕
              </button>
            </div>

            {/* MESSAGE LIST */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-orange-500 text-white rounded-br-none shadow-md shadow-orange-500/10"
                        : "bg-white text-gray-800 border border-gray-200/80 rounded-bl-none shadow-sm whitespace-pre-wrap"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-500 shadow-sm">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:0.2s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:0.4s]" />
                    <span className="ml-1 text-xs">Grok is thinking...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                  ⚠️ {error}
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* QUICK SUGGESTIONS */}
            {messages.length < 3 && (
              <div className="border-t border-gray-100 bg-white px-4 py-2 flex gap-2 overflow-x-auto scrollbar-none">
                {QUICK_PROMPTS.map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(promptText)}
                    className="shrink-0 rounded-full border border-orange-200 bg-orange-50/80 px-3 py-1.5 text-xs text-orange-800 transition hover:bg-orange-100"
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            )}

            {/* INPUT FOOTER */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 border-t border-gray-100 bg-white p-3.5"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about places, food, weather, or tips in India..."
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
