import { Layout } from "@/components/Layout";
import { motion, useInView } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Clock,
  Heart,
  Link2,
  Share2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// ── Reading progress bar ────────────────────────────────────────────────────
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-gray-200">
      <div
        className="h-full bg-gray-900 transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
