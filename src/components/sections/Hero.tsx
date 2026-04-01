"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { HERO } from "@/lib/constants";
import Button from "@/components/ui/Button";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section className="pt-[calc(70px+2rem)] pb-12 md:pt-[calc(70px+4rem)] md:pb-20 bg-gradient-to-br from-gray-50 to-offwhite">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="font-heading text-3xl md:text-5xl font-bold text-firefly leading-tight mb-6"
              variants={fadeUp}
            >
              {HERO.headline.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed"
              variants={fadeUp}
            >
              Tribes<sup className="text-xs align-super">™</sup> makes it simple to connect with neighbors, share resources and skills, and build thriving communities.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-8"
              variants={fadeUp}
            >
              <Button href="#final-cta" size="large">
                {HERO.cta}
              </Button>
            </motion.div>

            <motion.p className="text-sm text-gray-500" variants={fadeUp}>
              {HERO.trust.prefix}{" "}
              <span className="font-bold text-firefly">{HERO.trust.number}</span>{" "}
              {HERO.trust.suffix}
            </motion.p>
          </motion.div>

          {/* Demo Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative rounded-2xl overflow-hidden shadow-xl"
          >
            <video
              ref={videoRef}
              className="block w-full"
              src="https://assets.cdn.filesafe.space/U5e1EQQhkA9AaPpvfXQt/media/69a7752eb701feefe371653d.mp4"
              playsInline
              muted
              autoPlay
              loop
              preload="metadata"
              aria-label="Tribes platform demo video"
              onClick={togglePlay}
              style={{ cursor: "pointer" }}
            />

            {/* Floating controls */}
            <div className="absolute bottom-2 right-2 flex gap-1 z-10">
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                aria-label={isPlaying ? "Pause video" : "Play video"}
                className="flex items-center justify-center w-9 h-9 md:w-9 md:h-9 rounded-full bg-black/50 backdrop-blur-sm text-white transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-casablanca focus-visible:outline-offset-2"
              >
                {isPlaying ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
                className="flex items-center justify-center w-9 h-9 md:w-9 md:h-9 rounded-full bg-black/50 backdrop-blur-sm text-white transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-casablanca focus-visible:outline-offset-2"
              >
                {isMuted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
