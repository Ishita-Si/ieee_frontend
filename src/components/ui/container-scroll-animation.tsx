"use client";
import React from "react";

/**
 * ContainerScroll — lightweight replacement.
 * The original used Framer Motion useScroll + useTransform + rotateX on every
 * scroll event, which caused janky compositing. This version renders the same
 * visual without any scroll listener or motion library dependency.
 */
export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent?: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-center relative p-2 md:p-20 py-10 md:py-20">
      <div className="w-full relative" style={{ perspective: "1000px" }}>
        {titleComponent && (
          <div className="max-w-5xl mx-auto text-center mb-8">
            {titleComponent}
          </div>
        )}
        <div
          className="max-w-5xl mx-auto w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl"
          style={{
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900 md:rounded-2xl md:p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Header = ({ titleComponent }: any) => (
  <div className="max-w-5xl mx-auto text-center">{titleComponent}</div>
);

export const Card = ({ children }: any) => (
  <div className="max-w-5xl mx-auto w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl">
    <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900 md:rounded-2xl md:p-4">
      {children}
    </div>
  </div>
);
