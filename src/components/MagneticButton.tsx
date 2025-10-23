import { useRef, useState, MouseEvent, ReactNode, forwardRef } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const MagneticButton = forwardRef<
  HTMLButtonElement,
  MagneticButtonProps
>(({ children, className = "", strength = 0.3, onClick, style }, ref) => {
  const internalRef = useRef<HTMLButtonElement>(null);
  const buttonRef = (ref as React.RefObject<HTMLButtonElement>) || internalRef;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
    setIsPressed(false);
  };

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  return (
    <button
      ref={buttonRef}
      className={`magnetic-button ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick}
      style={{
        ...style,
        transform: `
          translate(${position.x}px, ${position.y}px) 
          perspective(1000px) 
          translateZ(${isHovered ? "10px" : "0px"})
          scale(${isPressed ? "0.95" : "1"})
        `,
        transition:
          "transform 0.2s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease-out",
        transformStyle: "preserve-3d",
        boxShadow: isHovered
          ? `${style?.boxShadow || ""}, 0 20px 40px rgba(0, 0, 0, 0.3)`
          : style?.boxShadow || "",
      }}
    >
      {/* 3D Depth Layer */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          transform: "translateZ(-8px)",
          background: "rgba(0, 0, 0, 0.4)",
          filter: "blur(8px)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease-out",
        }}
      />

      {/* Content Layer */}
      <div
        style={{
          transform: "translateZ(5px)",
          position: "relative",
        }}
      >
        {children}
      </div>

      {/* Shine Effect on Hover */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease-out",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)",
            transform: `translateX(${isHovered ? "100%" : "-100%"})`,
            transition: "transform 0.6s ease-out",
          }}
        />
      </div>
    </button>
  );
});

MagneticButton.displayName = "MagneticButton";

export default MagneticButton;
