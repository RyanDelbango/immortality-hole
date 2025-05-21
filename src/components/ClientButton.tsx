"use client";

interface ButtonProps {
  className?: string;
  children: React.ReactNode;
  message?: string;
}

export default function ClientButton({ className, children, message }: ButtonProps) {
  const handleClick = () => {
    if (message) {
      alert(message);
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
} 