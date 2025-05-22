"use client";

import { useRef, useEffect } from "react";

interface ContentCardProps {
  onArrowClick: () => void;
  isVisible: boolean;
  content?: string;
  messages?: string[];
}

export default function ContentCard({ 
  onArrowClick, 
  isVisible, 
  content,
  messages = []
}: ContentCardProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className={`w-full max-w-md mx-auto transition-opacity fixed-width-container
      ${isVisible ? 'duration-1000 opacity-80' : 'duration-300 opacity-0'} 
      ${!isVisible ? 'pointer-events-none' : ''}`}>
      <div className="card w-full bg-base-100 bg-opacity-70 shadow-xl">
        <div className="card-body items-center text-center p-6 h-[300px] relative">
          <button 
            className="btn btn-ghost btn-circle absolute top-2 left-2" 
            onClick={onArrowClick}
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="pt-8 w-full h-full overflow-hidden">
            {messages && messages.length > 0 ? (
              <div className="w-full h-full flex flex-col">
                <div className="w-full flex-grow overflow-y-auto text-left font-mono text-sm">
                  <div className="space-y-2 px-2">
                    {messages.map((msg, index) => (
                      <div key={index} className="whitespace-pre-wrap break-words">{msg}</div>
                    ))}
                  </div>
                </div>
              </div>
            ) : content ? (
              <p className="text-center break-words">{content}</p>
            ) : null}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .fixed-width-container {
          width: 100%;
          max-width: 28rem; /* equivalent to max-w-md (448px) */
        }
      `}</style>
    </div>
  );
} 