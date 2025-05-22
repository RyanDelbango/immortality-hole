"use client";

interface ButtonProps {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

export default function ClientButton({
    className = "btn btn-lg opacity-80 max-w-sm w-full sm:w-auto bg-gradient-to-b from-green-500 to-green-800 border-none shadow-none text-white font-helvetica font-light",
    children,
    onClick
}: ButtonProps) {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <button onClick={handleClick} className={className}>
            {children}
        </button>
    );
} 