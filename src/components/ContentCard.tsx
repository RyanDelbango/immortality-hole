"use client";

interface ContentCardProps {
  onArrowClick: () => void;
  isVisible: boolean;
}

export default function ContentCard({ onArrowClick, isVisible }: ContentCardProps) {
  return (
    <div className={`transition-opacity ${isVisible ? 'duration-1000' : 'duration-300'} ease-in ${isVisible ? 'opacity-80' : 'opacity-0'} ${!isVisible ? 'pointer-events-none' : ''}`}>
      <div className="card w-full max-w-2xl mx-auto bg-base-100 shadow-xl">
        <div className="card-body items-center text-center p-6 sm:p-8 min-h-[12rem] relative">
          <button 
            className="btn btn-ghost btn-circle absolute top-2 left-2" 
            onClick={onArrowClick}
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="pt-8 w-full">
            <h2 className="card-title text-xl sm:text-2xl mb-4 justify-center">Testing Content Will Appear Here</h2>
          </div>
        </div>
      </div>
    </div>
  );
} 