
import React from 'react';

export const ConstellationBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Fluid wave background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/80">
        {/* Organic gradient blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/10 rounded-full blur-3xl animate-float opacity-40" 
             style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-bl from-accent/15 to-primary/5 rounded-full blur-3xl animate-float opacity-50" 
             style={{ animationDuration: '12s', animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-tr from-primary/10 to-accent/20 rounded-full blur-3xl animate-float opacity-30" 
             style={{ animationDuration: '10s', animationDelay: '4s' }} />
        
        {/* Subtle flowing particles */}
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          >
            <div 
              className="w-3 h-3 bg-gradient-to-r from-primary/40 to-accent/40 rounded-full blur-sm"
              style={{
                transform: `scale(${0.5 + Math.random() * 0.5})`,
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Flowing wave patterns */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d="M0,20 Q25,10 50,20 T100,20 L100,100 L0,100 Z"
          fill="url(#waveGradient)"
          className="animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <path
          d="M0,40 Q25,30 50,40 T100,40 L100,100 L0,100 Z"
          fill="url(#waveGradient)"
          opacity="0.5"
          className="animate-pulse"
          style={{ animationDuration: '6s', animationDelay: '1s' }}
        />
      </svg>
    </div>
  );
};
