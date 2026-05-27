"use client";
import React, { useState, useEffect, useRef } from "react";

interface AIAssistantRobotProps {
  userName?: string;
}

export default function AIAssistantRobot({ userName = "Arjun" }: AIAssistantRobotProps) {
  const [isFlying, setIsFlying] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // References for hardware-accelerated SVG elements
  const robotRef = useRef<HTMLDivElement>(null);
  const leftArmRef = useRef<SVGGElement>(null);
  const rightArmRef = useRef<SVGGElement>(null);
  const shadowRef = useRef<SVGEllipseElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const fireBoostRef = useRef<SVGGElement>(null);
  const flightStartTimeRef = useRef<number | null>(null);

  const isWavingRef = useRef(isWaving);
  useEffect(() => {
    isWavingRef.current = isWaving;
  }, [isWaving]);

  const isFlyingRef = useRef(isFlying);
  useEffect(() => {
    isFlyingRef.current = isFlying;
  }, [isFlying]);

  const isMobileRef = useRef(isMobile);
  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  // Detect and track screen size for mobile responsiveness
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle onboarding mount trigger automatically whenever the page is loaded
  useEffect(() => {
    const initTimer = setTimeout(() => {
      triggerOnboardingSequence();
    }, 1500);

    // Periodic hand-waving idle animation (every 5 seconds, shake hands for 1.2s)
    const waveInterval = setInterval(() => {
      if (!isFlyingRef.current && !isWavingRef.current) {
        setIsWaving(true);
        setTimeout(() => {
          setIsWaving(false);
        }, 1200);
      }
    }, 5000);

    return () => {
      clearTimeout(initTimer);
      clearInterval(waveInterval);
    };
  }, []);

  const triggerOnboardingSequence = () => {
    if (isFlying || isWaving) return;
    setIsWaving(true);
    setShowSpeechBubble(true);

    // Wave greeting gesture for exactly 4 seconds in the bottom-right corner
    setTimeout(() => {
      setIsWaving(false);
      setShowSpeechBubble(false);
      setIsFlying(true);

      // Roundup/Orbit dashboard perimeter for exactly 5 seconds, then land back safely
      setTimeout(() => {
        setIsFlying(false);
      }, 5000);
    }, 4000);
  };

  const handleRobotClick = () => {
    if (isFlying || isWaving) return;
    window.location.href = "/dashboard/student/doubts";
  };

  // Dedicated Render Loop for hardware-accelerated perimeter orbit flight
  useEffect(() => {
    const startTime = performance.now();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) / 1000;

      // Handle window sizing dynamically inside loop
      const w = window.innerWidth || 1920;
      const h = window.innerHeight || 1080;

      // Scale robot size based on screen width
      const mobile = w < 768;
      const robotSize = mobile ? 80 : 120; // px
      const halfRobot = robotSize / 2;

      // Resting position: bottom-right corner
      const margin = mobile ? 12 : 20;
      const startX = w - halfRobot - margin;
      const startY = h - halfRobot - margin;

      // Positioning, Scale, and Rotations logic for orbital flight path
      let targetX = startX;
      let targetY = startY;
      let targetRotZ = 0;
      let targetScale = 1.0;

      let flightTime = 0;
      if (isFlyingRef.current) {
        if (flightStartTimeRef.current === null) {
          flightStartTimeRef.current = elapsedTime;
        }
        flightTime = elapsedTime - flightStartTimeRef.current;
      } else {
        flightStartTimeRef.current = null;
      }

      if (isWavingRef.current) {
        targetX = startX;
        targetY = startY;
      } else if (isFlyingRef.current) {
        const flightDuration = 4.5; // 4.5 seconds circular flight trajectory
        const p = Math.min(1.0, flightTime / flightDuration);

        // Orbit radius - smaller on mobile
        const R = mobile ? 35 : 50;

        // Center of circular loop near bottom-right corner
        const cX = startX - (mobile ? 50 : 70);
        const cY = startY - (mobile ? 60 : 90);

        // Match start of circle at theta0
        const dx = (startX - halfRobot * 0.5) - cX;
        const dy = (startY - halfRobot) - cY;
        const theta0 = Math.atan2(dy, dx); // start angle

        if (p < 0.15) {
          // 1. Takeoff/Ascent phase into the circle (0% to 15%)
          const ratio = p / 0.15;
          const targetCircleStartX = cX + R * Math.cos(theta0);
          const targetCircleStartY = cY + R * Math.sin(theta0);

          targetX = startX + (targetCircleStartX - startX) * ratio;
          targetY = startY + (targetCircleStartY - startY) * ratio;

          targetRotZ = -0.2 * Math.sin(ratio * Math.PI);
          targetScale = 1.0 - 0.05 * ratio;
        } else if (p < 0.85) {
          // 2. Circular loop phase (15% to 85%) - single clockwise loop
          const ratio = (p - 0.15) / 0.70;
          const theta = theta0 - ratio * 2 * Math.PI * 1;

          targetX = cX + R * Math.cos(theta);
          targetY = cY + R * Math.sin(theta);

          targetRotZ = -0.25 * Math.cos(theta);
          targetScale = 0.95;
        } else {
          // 3. Landing descent back to base (85% to 100%)
          const ratio = (p - 0.85) / 0.15;
          const targetCircleEndX = cX + R * Math.cos(theta0);
          const targetCircleEndY = cY + R * Math.sin(theta0);

          targetX = targetCircleEndX + (startX - targetCircleEndX) * ratio;
          targetY = targetCircleEndY + (startY - targetCircleEndY) * ratio;

          if (ratio < 0.5) {
            const r = ratio / 0.5;
            targetY = targetY + 6 * r;
            targetScale = 0.95 + 0.07 * r;
          } else {
            const r = (ratio - 0.5) / 0.5;
            targetY = targetY + 6 - 6 * r;
            targetScale = 1.02 - 0.02 * r;
          }
          targetRotZ = 0;
        }
      }

      // Calculate organic bobbing and breathing scales
      const bobbing = Math.sin(elapsedTime * 2.5) * (mobile ? 2.5 : 4); // Pixels bobbing
      const breathing = targetScale * (1.0 + Math.sin(elapsedTime * 1.5) * 0.015);

      // Fast wiggling/bobbing excitement when waving
      const currentBobbing = isWavingRef.current ? Math.sin(elapsedTime * 12) * (mobile ? 4 : 6) : bobbing;
      const finalY = isFlyingRef.current ? targetY : targetY + currentBobbing;

      // Apply spatial transforms to main robot Ref
      if (robotRef.current) {
        robotRef.current.style.transform = `translate3d(${targetX - halfRobot}px, ${finalY - halfRobot}px, 0px) scale(${breathing}) rotate(${targetRotZ}rad)`;
        // Keep robot size in sync with screen size
        robotRef.current.style.width = `${robotSize}px`;
        robotRef.current.style.height = `${robotSize}px`;
      }

      // Flame flicker animation logic
      if (fireBoostRef.current) {
        if (isFlyingRef.current) {
          const flickerY = 0.85 + Math.sin(elapsedTime * 45) * 0.15 + Math.random() * 0.1;
          const flickerX = 0.95 + Math.cos(elapsedTime * 35) * 0.05;
          fireBoostRef.current.style.transform = `scaleY(${flickerY}) scaleX(${flickerX})`;
          fireBoostRef.current.style.opacity = "1";
        } else {
          fireBoostRef.current.style.transform = "scaleY(0)";
          fireBoostRef.current.style.opacity = "0";
        }
      }

      // Animate levitation landing shadow size and opacity
      if (shadowRef.current) {
        const shadowScale = isFlyingRef.current ? 0.3 : 1.0 - (bobbing / 4) * 0.15;
        const shadowOpacity = isFlyingRef.current ? 0 : 0.6 + (bobbing / 4) * 0.15;
        shadowRef.current.style.transform = `scale(${shadowScale})`;
        shadowRef.current.style.opacity = `${shadowOpacity}`;
      }

      // Organic Arm levitation and waving logic
      if (leftArmRef.current) {
        if (isWavingRef.current) {
          const waveAngle = 45 - Math.sin(elapsedTime * 18) * 25;
          leftArmRef.current.style.transform = `rotate(${waveAngle}deg)`;
        } else {
          const leftArmAngle = -Math.sin(elapsedTime * 2.5) * 5;
          leftArmRef.current.style.transform = `rotate(${leftArmAngle}deg)`;
        }
      }

      if (rightArmRef.current) {
        if (isWavingRef.current) {
          const waveAngle = -45 + Math.sin(elapsedTime * 18) * 25;
          rightArmRef.current.style.transform = `rotate(${waveAngle}deg)`;
        } else {
          const rightArmAngle = Math.sin(elapsedTime * 2.5) * 5;
          rightArmRef.current.style.transform = `rotate(${rightArmAngle}deg)`;
        }
      }

      // Playful body rotation tilt during waving
      if (bodyRef.current) {
        const bodyTilt = isWavingRef.current ? Math.sin(elapsedTime * 10) * 2.5 : 0;
        bodyRef.current.style.transform = `rotate(${bodyTilt}deg)`;
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  // Click target size: smaller on mobile
  const clickW = isMobile ? "w-10 h-14" : "w-14 h-20";
  const clickBottom = isMobile ? "bottom-3 right-3" : "bottom-4 right-5";
  const bubbleBottom = isMobile ? "bottom-[100px] right-[12px]" : "bottom-[140px] right-[24px]";

  return (
    <>
      {/* Hardware-accelerated Native SVG Container rendering the exact 3D-effect orange toy robot design */}
      <div
        ref={robotRef}
        className="fixed pointer-events-none z-[9999]"
        style={{
          width: isMobile ? "80px" : "120px",
          height: isMobile ? "80px" : "120px",
          left: 0,
          top: 0,
          transform: "translate3d(0px, 0px, 0px)",
          willChange: "transform"
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Core Vector Gradients matching the 3D Amber Toy Robot */}
            <linearGradient id="orangeGrad" x1="50" y1="20" x2="150" y2="142" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffe587" />
              <stop offset="30%" stopColor="#FFAE42" />
              <stop offset="100%" stopColor="#c97300" />
            </linearGradient>

            <linearGradient id="orangeHighlight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff4d0" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFAE42" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="visorGrad" x1="64" y1="30" x2="136" y2="78" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0b1329" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            <linearGradient id="blackGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="silverGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            <linearGradient id="yellowGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="fireInnerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="fireOuterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="70%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
            </linearGradient>

            {/* Glowing Neon Visor Filters */}
            <filter id="eyeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="visorGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Dynamic Floating Shadow */}
          <ellipse
            ref={shadowRef}
            cx="100"
            cy="182"
            rx="26"
            ry="4.5"
            fill="url(#shadowGrad)"
            style={{ transformOrigin: "100px 182px", transition: "transform 0.1s ease, opacity 0.1s ease" }}
          />

          {/* Main Robot bobbing group */}
          <g ref={bodyRef} style={{ transformOrigin: "100px 100px", transition: "transform 0.1s ease" }}>

            {/* Left Articulated Robotic Arm */}
            <g ref={leftArmRef} style={{ transformOrigin: "64px 108px", transition: "transform 0.1s ease" }}>
              <rect x="58" y="104" width="12" height="8" rx="2" fill="url(#silverGrad)" stroke="#475569" strokeWidth="0.5" transform="rotate(-25, 64, 108)" />
              <rect x="44" y="110" width="16" height="8" rx="2" fill="url(#silverGrad)" stroke="#475569" strokeWidth="0.5" transform="rotate(-35, 52, 114)" />
              <circle cx="38" cy="120" r="8" fill="url(#blackGrad)" stroke="#0f172a" strokeWidth="0.5" />
              <circle cx="38" cy="120" r="4" fill="url(#yellowGrad)" />
              <path d="M 28,114 Q 22,118 24,126 Q 28,130 32,124" fill="none" stroke="url(#silverGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 38,126 Q 38,132 32,134 Q 28,132 32,124" fill="none" stroke="url(#silverGrad)" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Right Articulated Robotic Arm */}
            <g ref={rightArmRef} style={{ transformOrigin: "136px 108px", transition: "transform 0.1s ease" }}>
              <rect x="130" y="104" width="12" height="8" rx="2" fill="url(#silverGrad)" stroke="#475569" strokeWidth="0.5" transform="rotate(25, 136, 108)" />
              <rect x="140" y="110" width="16" height="8" rx="2" fill="url(#silverGrad)" stroke="#475569" strokeWidth="0.5" transform="rotate(35, 148, 114)" />
              <circle cx="162" cy="120" r="8" fill="url(#blackGrad)" stroke="#0f172a" strokeWidth="0.5" />
              <circle cx="162" cy="120" r="4" fill="url(#yellowGrad)" />
              <path d="M 172,114 Q 178,118 176,126 Q 172,130 168,124" fill="none" stroke="url(#silverGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 162,126 Q 162,132 168,134 Q 172,132 168,124" fill="none" stroke="url(#silverGrad)" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Black cylindrical neck joint */}
            <rect x="91" y="80" width="18" height="10" rx="2" fill="url(#blackGrad)" stroke="#1e293b" strokeWidth="0.5" />

            {/* Fire Boost Thruster Flame */}
            <g ref={fireBoostRef} style={{ transformOrigin: "100px 136px", opacity: 0, transition: "opacity 0.2s ease", willChange: "transform, opacity" }}>
              <path d="M 82,136 Q 100,185 118,136" fill="url(#fireOuterGrad)" />
              <path d="M 90,136 Q 100,165 110,136" fill="url(#fireInnerGrad)" />
            </g>

            {/* Torso Body (Orange) */}
            <g>
              <rect x="73" y="88" width="54" height="48" rx="16" fill="url(#orangeGrad)" stroke="#b86900" strokeWidth="1.2" />
              <path d="M 77,95 C 77,95 86,91 100,91" stroke="url(#orangeHighlight)" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" fill="none" />
            </g>

            {/* Antenna socket (Black) */}
            <rect x="91" y="15" width="18" height="5" rx="1" fill="url(#blackGrad)" stroke="#0f172a" strokeWidth="0.5" />
            {/* Antenna thin rod (Black) */}
            <rect x="98" y="7" width="4" height="10" fill="url(#blackGrad)" />
            {/* Antenna glossy yellow sphere tip */}
            <circle cx="100" cy="4" r="8" fill="url(#yellowGrad)" stroke="#b86900" strokeWidth="0.5" />

            {/* Ears (Black side cylinder caps) */}
            <rect x="44" y="42" width="8" height="24" rx="3.5" fill="url(#blackGrad)" stroke="#0f172a" strokeWidth="0.5" />
            <rect x="148" y="42" width="8" height="24" rx="3.5" fill="url(#blackGrad)" stroke="#0f172a" strokeWidth="0.5" />

            {/* Rounded capsule head (Orange) */}
            <g>
              <rect x="50" y="18" width="100" height="68" rx="24" fill="url(#orangeGrad)" stroke="#b86900" strokeWidth="1.2" />
              <path d="M 55,30 C 55,22 75,21 100,21" stroke="url(#orangeHighlight)" strokeWidth="3" strokeLinecap="round" opacity="0.5" fill="none" />

              {/* Visor Screen (Black) */}
              <rect x="64" y="28" width="72" height="48" rx="14" fill="url(#visorGrad)" stroke="#1e293b" strokeWidth="1.5" filter="url(#visorGlow)" />
              <path d="M 68,36 C 68,31 76,30 92,30" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.1" fill="none" />

              {/* Happy eyes ^ ^ when greeting/flying, regular circular eyes when idle */}
              {isWaving || isFlying ? (
                <>
                  {/* Left Happy Eye */}
                  <path d="M 73,56 Q 82,42 91,56" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" filter="url(#eyeGlow)" />
                  <path d="M 73,56 Q 82,42 91,56" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Right Happy Eye */}
                  <path d="M 109,56 Q 118,42 127,56" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" filter="url(#eyeGlow)" />
                  <path d="M 109,56 Q 118,42 127,56" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  {/* Large Glowing Circular Left Eye */}
                  <circle cx="82" cy="52" r="9" fill="url(#silverGrad)" stroke="#38bdf8" strokeWidth="1" />
                  <circle cx="82" cy="52" r="8.5" fill="#ffffff" filter="url(#eyeGlow)" />
                  <circle cx="82" cy="52" r="7" fill="#ffffff" />

                  {/* Large Glowing Circular Right Eye */}
                  <circle cx="118" cy="52" r="9" fill="url(#silverGrad)" stroke="#38bdf8" strokeWidth="1" />
                  <circle cx="118" cy="52" r="8.5" fill="#ffffff" filter="url(#eyeGlow)" />
                  <circle cx="118" cy="52" r="7" fill="#ffffff" />
                </>
              )}
            </g>
          </g>
        </svg>
      </div>

      {/* Speech Bubble box shown ONLY during onboarding first waving */}
      {showSpeechBubble && (
        <div
          className={`fixed z-[10001] bg-slate-900/85 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300 select-none ${isMobile ? "max-w-[200px]" : "max-w-xs"} ${bubbleBottom}`}
          style={{
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
            transformOrigin: "bottom right"
          }}
        >
          <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-base shrink-0 shadow-inner">
            🤖
          </div>
          <div>
            <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest leading-none mb-0.5">AI Assistant</p>
            <p className={`font-extrabold text-white leading-tight ${isMobile ? "text-xs" : "text-sm"}`}>Welcome back, {userName}! 🥳✨</p>
          </div>
          {/* Tail pointing down to the robot */}
          <div className="absolute bottom-[-6px] right-[40px] w-3 h-3 bg-slate-900/85 border-r border-b border-white/10 rotate-45" />
        </div>
      )}

      {/* Floating click target (rendered directly over resting 3D robot location) */}
      {!isFlying && (
        <div
          onClick={handleRobotClick}
          className={`fixed pointer-events-auto cursor-pointer z-[10000] rounded-full ${clickW} ${clickBottom}`}
          title={isWaving ? "Waving to greet you!" : "Need help? Click me for Doubt Assistance!"}
        />
      )}
    </>
  );
}