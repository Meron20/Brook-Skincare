"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";

const videos = [
  {
    id: "1",
    title: "What is Melasma and What Causes It?",
    views: "12K views",
    duration: "8:24",
    category: "Melasma",
    videoId: "YOUTUBE_VIDEO_ID_1",
  },
  {
    id: "2",
    title: "Why SPF is Non-Negotiable for Dark Skin",
    views: "9.4K views",
    duration: "6:12",
    category: "SPF",
    videoId: "YOUTUBE_VIDEO_ID_2",
  },
  {
    id: "3",
    title: "The Truth About Bleaching Creams",
    views: "18K views",
    duration: "11:05",
    category: "Ingredients",
    videoId: "YOUTUBE_VIDEO_ID_3",
  },
  {
    id: "4",
    title: "How to Build a Routine for Hyperpigmentation",
    views: "14K views",
    duration: "9:33",
    category: "Routines",
    videoId: "YOUTUBE_VIDEO_ID_4",
  },
  {
    id: "5",
    title: "Ingredients That Actually Fade Dark Spots",
    views: "21K views",
    duration: "13:17",
    category: "Ingredients",
    videoId: "YOUTUBE_VIDEO_ID_5",
  },
];

export default function YouTubeSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 overflow-hidden"
      style={{ backgroundColor: "#F0F7F2" }}
    >
      <div className="max-w-6xl mx-auto px-6">

       
        <div
          className="text-center mb-14"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease",
          }}
        >
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-3 block"
            style={{ color: "#9A7A2E" }}
          >
            Watch & Learn
          </span>
          <h2
            className="font-light mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "#0A1F14",
            }}
          >
            Brook on{" "}
            <strong className="font-semibold" style={{ color: "#FF0000" }}>
              YouTube
            </strong>
          </h2>
          <p
            className="text-sm max-w-xl mx-auto"
            style={{ color: "rgba(10,31,20,0.55)", lineHeight: 1.8 }}
          >
            45,000+ subscribers trust Brook for honest, science-based skincare
            education made specifically for Ethiopian and African skin.
          </p>
        </div>

  
        <div
          className="flex items-end justify-center gap-4"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.8s ease 0.2s",
          }}
        >
          {videos.map((video, i) => {
            const isCenter = i === 2;
            const isHovered = hoveredCard === video.id;
            const distFromCenter = Math.abs(i - 2);


            const height = isCenter ? 380 : distFromCenter === 1 ? 320 : 270;
            const width = isCenter ? 200 : distFromCenter === 1 ? 170 : 148;

            return (
                <a
              
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredCard(video.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative flex flex-col items-center justify-between transition-all duration-500 flex-shrink-0"
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  borderRadius: "40px",
                  background: isHovered
                    ? "linear-gradient(180deg, #1A3D2B, #0A1F14)"
                    : "linear-gradient(180deg, #e8e8e8, #d0d0d0)",
                  border: isHovered
                    ? "1.5px solid rgba(201,168,76,0.4)"
                    : "1px solid rgba(0,0,0,0.06)",
                  boxShadow: isCenter
                    ? "0 20px 60px rgba(10,31,20,0.15)"
                    : isHovered
                    ? "0 12px 40px rgba(10,31,20,0.2)"
                    : "0 4px 20px rgba(0,0,0,0.08)",
                  transform: isHovered
                    ? "translateY(-8px)"
                    : isCenter
                    ? "translateY(0)"
                    : `translateY(${distFromCenter * 20}px)`,
                  padding: "24px 20px",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
               
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isHovered
                      ? "rgba(201,168,76,0.2)"
                      : "rgba(0,0,0,0.1)",
                    color: isHovered ? "#C9A84C" : "rgba(0,0,0,0.5)",
                  }}
                >
                  {video.category}
                </span>

             
                <div
                  className="flex items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    width: isCenter ? "64px" : "52px",
                    height: isCenter ? "64px" : "52px",
                    backgroundColor: isHovered ? "#FF0000" : "rgba(0,0,0,0.8)",
                    boxShadow: isHovered
                      ? "0 8px 24px rgba(255,0,0,0.4)"
                      : "0 4px 12px rgba(0,0,0,0.2)",
                    transform: isHovered ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  <svg
                    width={isCenter ? "22" : "18"}
                    height={isCenter ? "22" : "18"}
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                  </svg>
                </div>

                {/* Title + stats — bottom */}
                <div className="w-full text-center">
                  <p
                    className="font-medium line-clamp-2 mb-2 transition-colors duration-300"
                    style={{
                      fontSize: isCenter ? "13px" : "11px",
                      color: isHovered ? "white" : "rgba(0,0,0,0.7)",
                      lineHeight: 1.4,
                    }}
                  >
                    {video.title}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Clock
                      size={10}
                      style={{ color: isHovered ? "rgba(201,168,76,0.7)" : "rgba(0,0,0,0.4)" }}
                    />
                    <span
                      className="text-xs transition-colors duration-300"
                      style={{ color: isHovered ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" }}
                    >
                      {video.duration}
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Channel CTA */}
        <div
          className="text-center mt-14"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.8s ease 0.4s",
          }}
        >
            <a
          
            href="https://www.youtube.com/channel/UCQqGytMj-iIbDnqlyTfn7vw"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor: "#FF0000",
              color: "white",
              boxShadow: "0 4px 20px rgba(255,0,0,0.3)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58a2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
              <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="red" />
            </svg>
             View All Videos on YouTube
          </a>
          <p
            className="text-xs mt-3"
            style={{ color: "rgba(10,31,20,0.3)" }}
          >
            * Real video links will be added when Brook shares them
          </p>
        </div>
      </div>
    </section>
  );
}