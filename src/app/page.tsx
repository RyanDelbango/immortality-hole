"use client";

import { useState, useEffect } from "react";
import ClientButton from "@/components/ClientButton";

export default function Home() {
  const [showButton, setShowButton] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
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
        <div className={`w-1/2 mx-auto flex justify-around transition-opacity duration-1000 ease-in ${showButton ? 'opacity-100' : 'opacity-0'}`}>
          <ClientButton message="Primary" className="btn btn-soft">
            Primary
          </ClientButton>
          <ClientButton message="Secondary" className="btn btn-soft">
            Secondary
          </ClientButton>
        </div>
      </div>
    </div>
  );
}
