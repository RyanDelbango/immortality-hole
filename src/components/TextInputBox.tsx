"use client";

import { useState } from "react";

interface TextInputBoxProps {
  onSubmit: (text: string) => void;
  isVisible: boolean;
  placeholder?: string;
}

export default function TextInputBox({ 
  onSubmit, 
  isVisible,
  placeholder = "Type your message here..."
}: TextInputBoxProps) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSubmit(inputText);
      setInputText("");
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto mt-4 transition-opacity ${isVisible ? 'duration-1000' : 'duration-300'} ease-in
      ${isVisible ? 'opacity-80' : 'opacity-0'} 
      ${!isVisible ? 'pointer-events-none' : ''}`}
    >
      <form onSubmit={handleSubmit} className="flex items-center bg-base-200 rounded-lg overflow-hidden">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="input input-bordered flex-grow bg-transparent border-none focus:outline-none font-helvetica font-light px-4"
          placeholder={placeholder}
          aria-label="Message input"
        />
        <button 
          type="submit" 
          className="btn btn-ghost btn-circle"
          disabled={!inputText.trim()}
          aria-label="Submit message"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14 5l7 7m0 0l-7 7m7-7H3" 
            />
          </svg>
        </button>
      </form>
    </div>
  );
} 