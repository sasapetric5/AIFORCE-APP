import React from 'react';

export const SplashScreen: React.FC = () => {
  const text = "AI FORCE";

  return (
    <>
      <div className="splash-screen">
        <div className="stars-background">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="shooting-star"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${-20 + Math.random() * 40}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
        <div className="splash-content">
          <div className="splash-top-content">
            <div className="logo-container">
              {text.split('').map((char, index) => (
                <span
                  key={index}
                  className="logo-char"
                  style={{ animationDelay: `${index * 0.15}s, ${text.length * 0.15 + 2}s` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
            <div className="loading-bar-container">
              <div className="loading-bar"></div>
            </div>
          </div>

          <div className="splash-diamond-container">
            <div className="diamond">
              <div className="face face1">AI<br/>FORCE</div>
              <div className="face face2">AI<br/>FORCE</div>
              <div className="face face3"><span></span></div>
              <div className="face face4">AI<br/>FORCE</div>
              <div className="face face5"></div>
              <div className="face face6"></div>
            </div>
          </div>

        </div>
      </div>
      <style>{`
        .splash-screen {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background-color: #020617; /* slate-950 */
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          animation: fadeOut 1s ease-in-out forwards;
          animation-delay: 9s; /* 9s + 1s = 10s total */
        }

        .splash-content {
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4rem;
        }

        .splash-top-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stars-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: rotateZ(20deg);
          overflow: hidden;
        }

        .shooting-star {
          position: absolute;
          height: 2px;
          background: linear-gradient(-45deg, #7C3AED, rgba(255, 255, 255, 0));
          border-radius: 999px;
          filter: drop-shadow(0 0 6px #7C3AED);
          animation: tail ease-in-out infinite, shooting ease-in-out infinite;
          opacity: 0;
        }

        @keyframes tail {
          0% { width: 0; opacity: 0; }
          20% { opacity: 1; }
          30% { width: 100px; }
          80% { opacity: 1; }
          100% { width: 0; opacity: 0; }
        }

        @keyframes shooting {
          0% { transform: translateX(0); }
          100% { transform: translateX(300vw); }
        }

        .logo-container {
          perspective: 1000px;
          display: flex;
        }

        .logo-char {
          font-family: 'Inter', sans-serif;
          font-size: 4rem;
          font-weight: 800;
          display: inline-block;
          color: #fff;
          opacity: 0;
          transform-style: preserve-3d;
          animation:
            fly-in 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards,
            glow 2.5s ease-in-out infinite alternate;
          text-shadow:
            0 0 5px #fff,
            0 0 10px #fff,
            0 0 20px #4F46E5, /* brand-primary */
            0 0 30px #4F46E5,
            0 0 40px #4F46E5,
            0 0 50px #7C3AED; /* brand-secondary */
        }
        
        @media (min-width: 640px) {
          .logo-char {
            font-size: 5rem;
          }
        }

        @media (min-width: 1024px) {
          .logo-char {
            font-size: 6rem;
          }
        }
        
        .loading-bar-container {
            margin-top: 2rem;
            width: 250px;
            height: 4px;
            background-color: rgba(79, 70, 229, 0.2);
            border-radius: 2px;
            overflow: hidden;
        }

        .loading-bar {
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, #4F46E5, #7C3AED, #4F46E5);
            background-size: 200% 200%;
            border-radius: 2px;
            animation: loading-progress 10s linear forwards, loading-glow 1.5s ease-in-out infinite alternate;
        }


        @keyframes fly-in {
          0% {
            opacity: 0;
            transform: translateZ(-1000px) rotateY(90deg);
          }
          70% {
            opacity: 1;
            transform: translateZ(50px) rotateY(0deg);
          }
          100% {
            opacity: 1;
            transform: translateZ(0) rotateY(0deg);
          }
        }

        @keyframes glow {
          from {
            text-shadow:
              0 0 5px #fff,
              0 0 10px #fff,
              0 0 20px #4F46E5,
              0 0 30px #4F46E5,
              0 0 40px #4F46E5,
              0 0 50px #7C3AED;
          }
          to {
            text-shadow:
              0 0 10px #fff,
              0 0 20px #fff,
              0 0 30px #6366F1,
              0 0 40px #6366F1,
              0 0 50px #6366F1,
              0 0 60px #8B5CF6;
          }
        }
        
        @keyframes loading-progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0%); }
        }

        @keyframes loading-glow {
            from { box-shadow: 0 0 10px #4F46E5; }
            to { box-shadow: 0 0 20px #7C3AED; }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
            visibility: hidden;
          }
        }
      `}</style>
    </>
  );
};