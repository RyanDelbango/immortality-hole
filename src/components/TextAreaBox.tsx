"use client";

import { useState } from "react";

interface TextAreaBoxProps {
  onSubmit: (text: string) => void;
  onArrowClick: () => void;
  isVisible: boolean;
  placeholder?: string;
}

export default function TextAreaBox({ 
  onSubmit,
  onArrowClick, 
  isVisible,
  placeholder = "Type your offering here..."
}: TextAreaBoxProps) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSubmit(inputText);
      setInputText("");
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto mt-4 transition-opacity fixed-width-container
      ${isVisible ? 'duration-1000 opacity-80' : 'duration-300 opacity-0'} 
      ${!isVisible ? 'pointer-events-none' : ''}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col bg-base-200 bg-opacity-70 rounded-lg overflow-hidden">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="textarea textarea-bordered w-full h-32 resize-none bg-transparent border-none focus:outline-none font-helvetica font-light p-4"
          placeholder={placeholder}
          aria-label="Offering input"
        />
        <div className="flex justify-between p-2">
          <button 
            type="button"
            onClick={onArrowClick}
            className="btn btn-ghost btn-circle"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <button 
            type="submit" 
            className="btn btn-ghost btn-circle"
            disabled={!inputText.trim()}
            aria-label="Submit offering"
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
        </div>
      </form>
      
      <style jsx>{`
        .fixed-width-container {
          width: 100%;
          max-width: 28rem; /* equivalent to max-w-md (448px) */
        }
      `}</style>
    </div>
  );
} 