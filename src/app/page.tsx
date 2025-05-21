"use client";

import { useState, useEffect } from "react";
import ClientButton from "@/components/ClientButton";
import ContentCard from "@/components/ContentCard";

export default function Home() {
  const [showButton, setShowButton] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Monitor showCard changes to handle DOM visibility
  useEffect(() => {
    if (showCard) {
      setCardVisible(true);
    } else {
      // When hiding card, delay removing it from DOM until animation completes
      const timer = setTimeout(() => {
        setCardVisible(false);
      }, 300); // Match the duration-300 in ContentCard
      return () => clearTimeout(timer);
    }
  }, [showCard]);
  
  const handleButtonClick = () => {
    setShowButton(false);
    setTimeout(() => {
      setShowCard(true);
    }, 500); // Small delay to ensure buttons fade out first
  };
  
  const handleArrowClick = () => {
    setShowCard(false);
    setTimeout(() => {
      setShowButton(true);
    }, 500); // Small delay to ensure card fades out first
  };
  
  return (
    <div 
      className="min-h-screen w-full overflow-x-auto bg-black"
    >
      <div 
        className="flex items-center justify-center h-screen bg-no-repeat bg-center"
        style={{ 
          backgroundImage: "url('/hole.png')",
          backgroundSize: "auto 100%", 
          minWidth: "100%",
        }}
      >
        <div className="relative w-full flex items-center justify-center">
          {/* Buttons container - always in DOM but with opacity transition */}
          <div 
            className={`w-1/2 flex justify-around transition-opacity ${showButton ? 'duration-1000' : 'duration-300'} ease-in
              ${showButton ? 'opacity-100 z-20' : 'opacity-0 z-0'} 
              ${!showButton ? 'pointer-events-none' : ''}`}
          >
            <ClientButton className="btn btn-soft" onClick={handleButtonClick}>
              Primary
            </ClientButton>
            <ClientButton className="btn btn-soft" onClick={handleButtonClick}>
              Secondary
            </ClientButton>
          </div>
          
          {/* Card component - stays in DOM during transition */}
          {cardVisible && (
            <div className={`absolute ${showCard ? 'z-20' : 'z-0'}`}>
              <ContentCard onArrowClick={handleArrowClick} isVisible={showCard} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
