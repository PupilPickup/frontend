import React, { ReactNode, useState } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = "top" }) => {
  const [visible, setVisible] = useState(false);

  let positionClasses = "bottom-full left-1/2 -translate-x-1/2 mb-2";
  if (position === "bottom") positionClasses = "top-full left-1/2 -translate-x-1/2 mt-2";
  if (position === "left") positionClasses = "right-full top-1/2 -translate-y-1/2 mr-2";
  if (position === "right") positionClasses = "left-full top-0 ml-2";

  return (
    <span className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      tabIndex={0}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          className={`absolute z-50 px-2 py-1 w-80 sm:w-96 md:w-112 bg-[#2C3E50] text-white text-sm sm:text-base rounded shadow-lg whitespace-pre-line pointer-events-none ${positionClasses}`}
        >
          {content}
        </span>
      )}
    </span>
  );
};

export default Tooltip;