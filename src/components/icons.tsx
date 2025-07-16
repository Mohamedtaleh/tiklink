import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg 
      width="150" 
      height="40" 
      viewBox="0 0 150 60" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      role="img" 
      aria-label="Tiklink Logo"
      {...props}
    >
      <title>Tiklink - TikTok Video Downloader Logo</title>
      <desc>Modern logo for Tiklink, featuring a gradient link icon</desc>
      <defs>
        <linearGradient id="tiklinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--accent))" />
          <stop offset="100%" stopColor="hsl(var(--primary))" />
        </linearGradient>
      </defs>

      <g>
        <rect x="0" y="5" rx="12" ry="12" width="50" height="50" fill="url(#tiklinkGradient)" />
        
        <path d="M20.6 34.4a1 1 0 0 1 1.4 0l3.6 3.6a3 3 0 0 0 4.2 0l4.6-4.6a3 3 0 0 0 0-4.2l-3.6-3.6a1 1 0 0 1 1.4-1.4l3.6 3.6a5 5 0 0 1 0 7.1l-4.6 4.6a5 5 0 0 1-7.1 0l-3.6-3.6a1 1 0 0 1 0-1.4zM29.4 25.6a1 1 0 0 1-1.4 0l-3.6-3.6a3 3 0 0 0-4.2 0l-4.6 4.6a3 3 0 0 0 0 4.2l3.6 3.6a1 1 0 1 1-1.4 1.4l-3.6-3.6a5 5 0 0 1 0-7.1l4.6-4.6a5 5 0 0 1 7.1 0l3.6 3.6a1 1 0 0 1 0 1.4z"
              fill="white"/>
      </g>

      <text x="60" y="42"
            fontSize="30"
            fontWeight="900"
            fontFamily="'Poppins', 'Segoe UI', sans-serif"
            fill="hsl(var(--foreground))"
            direction="ltr">
        Tik<tspan fontWeight="500">link</tspan>
      </text>
    </svg>
  ),
};
