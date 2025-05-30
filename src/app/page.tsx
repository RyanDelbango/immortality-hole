"use client";

import { useState, useEffect } from "react";
import ClientButton from "@/components/ClientButton";
import ContentCard from "@/components/ContentCard";
import SpookyText from "@/components/SpookyText";
import TextInputBox from "@/components/TextInputBox";
import TextAreaBox from "@/components/TextAreaBox";

export default function Home() {
  const [showButton, setShowButton] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"message" | "offering" | null>(null);
  const [submittedOffering, setSubmittedOffering] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  
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
      // Show text input at the same time as the card
      setShowTextInput(true);
    } else {
      // Hide text input and card simultaneously
      setShowTextInput(false);
      // When hiding card, delay removing it from DOM until animation completes
      const timer = setTimeout(() => {
        setCardVisible(false);
      }, 300); // Match the duration-300 in ContentCard
      return () => clearTimeout(timer);
    }
  }, [showCard]);
  
  const handleMessageButtonClick = () => {
    setSelectedOption("message");
    setShowButton(false);
    setTimeout(() => {
      setShowCard(true);
    }, 500); // Small delay to ensure buttons fade out first
  };
  
  const handleOfferingButtonClick = () => {
    setSelectedOption("offering");
    setSubmittedOffering("");
    setShowButton(false);
    setTimeout(() => {
      setShowCard(true);
    }, 500); // Small delay to ensure buttons fade out first
  };
  
  const handleArrowClick = () => {
    setShowCard(false);
    setTimeout(() => {
      setShowButton(true);
      setSelectedOption(null);
      setSubmittedOffering("");
      // Don't clear messages when going back, so they persist across sessions
    }, 500); // Small delay to ensure card fades out first
  };
  
  const handleMessageSubmit = (message: string) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();
    const timestampedMessage = `[${formattedDate} ${formattedTime}] ${message}`;
    console.log("Message submitted:", message);
    setMessages(prev => [timestampedMessage, ...prev]);
  };
  
  const handleOfferingSubmit = (offering: string) => {
    console.log("Offering submitted:", offering);
    setSubmittedOffering(offering);
  };
  
  return (
    <div 
      className="min-h-screen w-full bg-black"
    >
      <div 
        className="flex items-center justify-center min-h-screen bg-no-repeat bg-center"
        style={{ 
          backgroundImage: "url('/hole.png')",
          backgroundSize: "contain", // Show entire image
          backgroundPosition: "center",
          height: "100vh", // Force full height
        }}
      >
        <div className="relative w-full flex flex-col items-center justify-center p-4">
          <SpookyText 
            isVisible={showButton}
            text={
              <>
                YOU PEER INTO THE HOLE.
                <br />
                THE BOTTOM ISN&apos;T VISIBLE.
                <br />
                WHAT WILL YOU DO?
              </>
            } 
          />
          
          {/* Buttons container - always in DOM but with opacity transition */}
          <div 
            className={`w-full max-w-md flex flex-wrap justify-around gap-4 transition-opacity ${showButton ? 'duration-1000' : 'duration-300'} ease-in
              ${showButton ? 'opacity-80 z-20' : 'opacity-0 z-0'} 
              ${!showButton ? 'pointer-events-none' : ''}`}
          >
            <ClientButton onClick={handleOfferingButtonClick}>
              Make an Offering
            </ClientButton>
            <ClientButton onClick={handleMessageButtonClick}>
              Leave a Message
            </ClientButton>
          </div>
          
          {/* Card or TextArea component - stays in DOM during transition */}
          {cardVisible && (
            <div className={`absolute ${showCard ? 'z-20' : 'z-0'}`}>
              {selectedOption === "message" ? (
                <>
                  <ContentCard 
                    onArrowClick={handleArrowClick} 
                    isVisible={showCard} 
                    messages={messages}
                  />
                  {/* Text input box below the card */}
                  <TextInputBox 
                    onSubmit={handleMessageSubmit} 
                    isVisible={showTextInput} 
                    placeholder="Write your message to the void..." 
                  />
                </>
              ) : selectedOption === "offering" && submittedOffering === "" ? (
                <TextAreaBox 
                  onSubmit={handleOfferingSubmit} 
                  onArrowClick={handleArrowClick}
                  isVisible={showTextInput} 
                  placeholder="Describe your offering to the void..." 
                />
              ) : selectedOption === "offering" && submittedOffering !== "" ? (
                <ContentCard
                  onArrowClick={handleArrowClick} 
                  isVisible={showCard}
                  content={`Your offering has been accepted:\n"${submittedOffering}"`}
                />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
