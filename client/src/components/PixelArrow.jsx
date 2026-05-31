import React from 'react';

/**
 * PixelArrow - Exact Zamp Careers dithered retro-arrow SVG icon component.
 * Uses Tailwind text colors via 'fill="currentColor"'.
 */
export function PixelArrow({ className = "w-[13px] h-[11px]", direction = "right" }) {
  const rotationClass = {
    right: "",
    left: "rotate-180",
    up: "-rotate-90",
    down: "rotate-90"
  }[direction];

  return (
    <svg 
      className={`inline-block shrink-0 transition-transform duration-200 ${rotationClass} ${className}`}
      width="13" 
      height="11" 
      viewBox="0 0 13 11" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect y="4.33398" width="8.66475" height="2.16619" fill="currentColor" />
      <rect x="8.66797" y="4.33398" width="2.16619" height="2.16619" fill="currentColor" />
      <rect x="8.66797" y="2.16602" width="2.16619" height="2.16619" fill="currentColor" />
      <rect x="6.5" width="2.16619" height="2.16619" fill="currentColor" />
      <rect x="8.66797" y="6.5" width="2.16619" height="2.16619" fill="currentColor" />
      <rect x="10.832" y="4.33203" width="2.16619" height="2.16619" fill="currentColor" />
      <rect x="6.5" y="8.66797" width="2.16619" height="2.16619" fill="currentColor" />
    </svg>
  );
}
