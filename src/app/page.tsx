"use client";

import { useState, useEffect } from "react";
import ClientButton from "@/components/ClientButton";
import ContentCard from "@/components/ContentCard";
import SpookyText from "@/components/SpookyText";
import TextInputBox from "@/components/TextInputBox";
import TextAreaBox from "@/components/TextAreaBox";

interface BlogPostData {
  id: string;
  title: string;
  image: string;
  link: string;
  text: string;
}

const ViewState = {
  INITIAL: 'INITIAL',
  PEERING: 'PEERING',
  MESSAGING: 'MESSAGING',
  OFFERING: 'OFFERING',
  SUBMITTED: 'SUBMITTED',
} as const;

type ViewStateValue = typeof ViewState[keyof typeof ViewState];

export default function Home() {
  const [view, setView] = useState<ViewStateValue>(ViewState.INITIAL);
  const [messages, setMessages] = useState<string[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostData[]>([]);
  
  // Fade in the initial text and options
  useEffect(() => {
    const timer = setTimeout(() => setView(ViewState.PEERING), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch all content once on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (!response.ok) throw new Error('Failed to fetch content');
        const { messages, blogs } = await response.json();
        
        const formattedMessages = messages.map((msg: { message: string, timestamp: string }) => {
          const date = new Date(msg.timestamp);
          return `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] ${msg.message}`;
        });
        setMessages(formattedMessages);
        setBlogPosts(blogs);
      } catch (error) {
        console.error('Failed to fetch content:', error);
      }
    };

    fetchContent();
  }, []);

  const handleMessageButtonClick = () => setView(ViewState.MESSAGING);
  const handleOfferingButtonClick = () => setView(ViewState.OFFERING);
  const handleArrowClick = () => setView(ViewState.PEERING);

  const handleMessageSubmit = async (message: string) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error('Failed to submit message');
      const newMessage: { message: string, timestamp: string } = await response.json();
      const date = new Date(newMessage.timestamp);
      const timestampedMessage = `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] ${newMessage.message}`;
      setMessages(prev => [timestampedMessage, ...prev]);
    } catch (error) {
      console.error("Message submission failed:", error);
    }
  };
  
  const handleOfferingSubmit = async (offering: string) => {
    setView(ViewState.SUBMITTED);
    fetch('/api/offerings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offering }),
    }).catch(error => {
      console.error("Offering submission failed:", error);
      // Optionally handle the error in the UI, e.g., show a notification
    });
  };
  
  const isPeering = view === ViewState.PEERING;
  const showCard = view === ViewState.MESSAGING || view === ViewState.OFFERING || view === ViewState.SUBMITTED;

  return (
    <div className="min-h-screen w-full bg-black">
      <div 
        className="flex items-center justify-center min-h-screen bg-no-repeat bg-center"
        style={{ 
          backgroundImage: "url('/hole.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        <div className="relative w-full flex flex-col items-center justify-center p-4">
          <SpookyText 
            isVisible={isPeering}
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
          
          <div 
            className={`w-full max-w-md flex flex-wrap justify-around gap-4 transition-opacity duration-500 ease-in
              ${isPeering ? 'opacity-80' : 'opacity-0 pointer-events-none'}`}
          >
            <ClientButton onClick={handleOfferingButtonClick}>Make an Offering</ClientButton>
            <ClientButton onClick={handleMessageButtonClick}>Leave a Message</ClientButton>
          </div>
          
          <div className={`absolute transition-opacity duration-500 ${showCard ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {view === ViewState.MESSAGING && (
              <>
                <ContentCard 
                  onArrowClick={handleArrowClick} 
                  isVisible={true} 
                  messages={messages}
                />
                <TextInputBox 
                  onSubmit={handleMessageSubmit} 
                  isVisible={true} 
                  placeholder="Write your message to the void..." 
                />
              </>
            )}
            {view === ViewState.OFFERING && (
              <TextAreaBox 
                onSubmit={handleOfferingSubmit} 
                onArrowClick={handleArrowClick}
                isVisible={true} 
                placeholder="Describe your offering to the void..." 
              />
            )}
            {view === ViewState.SUBMITTED && (
              <ContentCard
                onArrowClick={handleArrowClick} 
                isVisible={true}
                blogPosts={blogPosts}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
