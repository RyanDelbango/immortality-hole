"use client";

interface SpookyTextProps {
  isVisible: boolean;
}

export default function SpookyText({ isVisible }: SpookyTextProps) {
  return (
    <div 
      className={`w-full text-center mb-8 transition-opacity ${isVisible ? 'duration-1000' : 'duration-300'} ease-in
        ${isVisible ? 'opacity-80' : 'opacity-0'} 
        ${!isVisible ? 'pointer-events-none' : ''}`}
    >
      <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-mono tracking-widest leading-relaxed px-4 glitch-text">
        YOU PEER INTO THE HOLE.
        <br/>
        THE BOTTOM ISN&apos;T VISIBLE.
      </h1>

      <style jsx>{`
        .glitch-text {
          text-shadow: 
            0.05em 0 0 rgba(255,0,0,.75),
            -0.025em -0.05em 0 rgba(0,255,0,.75),
            0.025em 0.05em 0 rgba(0,0,255,.75);
          animation: glitch 2s infinite;
        }
        
        @keyframes glitch {
          0% {
            text-shadow: 
              0.05em 0 0 rgba(255,0,0,.75),
              -0.05em -0.025em 0 rgba(0,255,0,.75),
              0.025em 0.05em 0 rgba(0,0,255,.75);
          }
          14% {
            text-shadow: 
              0.05em 0 0 rgba(255,0,0,.75),
              -0.05em -0.025em 0 rgba(0,255,0,.75),
              0.025em 0.05em 0 rgba(0,0,255,.75);
          }
          15% {
            text-shadow: 
              -0.05em -0.025em 0 rgba(255,0,0,.75),
              0.025em 0.025em 0 rgba(0,255,0,.75),
              -0.05em -0.05em 0 rgba(0,0,255,.75);
          }
          49% {
            text-shadow: 
              -0.05em -0.025em 0 rgba(255,0,0,.75),
              0.025em 0.025em 0 rgba(0,255,0,.75),
              -0.05em -0.05em 0 rgba(0,0,255,.75);
          }
          50% {
            text-shadow: 
              0.025em 0.05em 0 rgba(255,0,0,.75),
              0.05em 0 0 rgba(0,255,0,.75),
              0 -0.05em 0 rgba(0,0,255,.75);
          }
          99% {
            text-shadow: 
              0.025em 0.05em 0 rgba(255,0,0,.75),
              0.05em 0 0 rgba(0,255,0,.75),
              0 -0.05em 0 rgba(0,0,255,.75);
          }
          100% {
            text-shadow: 
              -0.025em 0 0 rgba(255,0,0,.75),
              -0.025em -0.025em 0 rgba(0,255,0,.75),
              -0.025em -0.05em 0 rgba(0,0,255,.75);
          }
        }
      `}</style>
    </div>
  );
} 