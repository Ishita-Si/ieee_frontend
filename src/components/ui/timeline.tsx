"use client";
import {
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  variant?: "light" | "dark";
}

export const Timeline = ({
  data,
  title,
  description,
  className = "",
  variant = "light",
}: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  const isDark = variant === "dark";

  const containerClasses = [
    "w-full font-sans md:px-10",
    isDark ? "bg-transparent text-white" : "bg-white dark:bg-neutral-950",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const headingClass = isDark
    ? "text-white"
    : "text-black dark:text-white";

  const descriptionClass = isDark
    ? "text-white/70"
    : "text-neutral-700 dark:text-neutral-300";

  const stickyDotShell = isDark
    ? "bg-black/80 border border-white/10"
    : "bg-white dark:bg-black";

  const innerDot = isDark
    ? "bg-white/50 border-white/30"
    : "bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700";

  const timelineRail = isDark
    ? "via-white/20 dark:via-white/30"
    : "via-neutral-200 dark:via-neutral-700";

  return (
    <div
      className={containerClasses}
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        {title && (
          <h2 className={`text-lg md:text-4xl mb-4 max-w-4xl ${headingClass}`}>
            {title}
          </h2>
        )}
        {description && (
          <p className={`text-sm md:text-base max-w-sm ${descriptionClass}`}>
            {description}
          </p>
        )}
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div
                className={`h-10 absolute left-3 md:left-3 w-10 rounded-full flex items-center justify-center ${stickyDotShell}`}
              >
                <div
                  className={`h-4 w-4 rounded-full border p-2 ${innerDot}`}
                />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>
              {item.content}{""}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className={`absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] ${timelineRail} to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]`}
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
