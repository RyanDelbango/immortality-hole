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

  useEffect(() => {
    const fetchMessages = async () => {
        if (selectedOption === 'message') {
            try {
                const response = await fetch('/api/messages');
                if (!response.ok) {
                    throw new Error('Failed to fetch messages');
                }
                const fetchedMessages: { message: string, timestamp: string }[] = await response.json();
                const formattedMessages = fetchedMessages.map(msg => {
                    const date = new Date(msg.timestamp);
                    return `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] ${msg.message}`;
                });
                setMessages(formattedMessages);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        }
    };

    fetchMessages();
  }, [selectedOption]);
  
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
  
  const handleMessageSubmit = async (message: string) => {
    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error('Failed to submit message');
        }

        const newMessage: { message: string, timestamp: string } = await response.json();
        const date = new Date(newMessage.timestamp);
        const timestampedMessage = `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] ${newMessage.message}`;
        setMessages(prev => [timestampedMessage, ...prev]);
    } catch (error) {
        console.error("Message submission failed:", error);
    }
  };
  
  const handleOfferingSubmit = (offering: string) => {
    // Optimistically update the UI for an instant response.
    // A client-side timestamp is used for immediate feedback.
    const date = new Date();
    const timestampedOffering = `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] ${offering}`;
    setSubmittedOffering(timestampedOffering);

    // Send the actual request to the server in the background.
    fetch('/api/offerings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offering }),
    }).catch(error => {
      // If the background request fails, log the error.
      // Optionally, we could inform the user or revert the UI change here.
      console.error("Offering submission failed in the background:", error);
    });
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
