"use client";

import React from "react";
import { motion } from "framer-motion";
import { Linkedin, Github, Mail, Instagram } from "lucide-react";
import Link from "next/link";
import teamImagesMap from "@/data/team-images-map.json";

const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getDynamicGradient = (name) => {
  const gradients = [
    "from-pink-500 via-rose-500 to-orange-500",
    "from-blue-500 via-cyan-500 to-teal-500",
    "from-fuchsia-500 via-purple-500 to-indigo-500",
    "from-violet-500 via-purple-500 to-fuchsia-500",
    "from-emerald-500 via-teal-500 to-cyan-500",
    "from-yellow-400 via-orange-500 to-red-500",
  ];
  const index = name ? name.length % gradients.length : 0;
  return gradients[index];
};

export const TeamCard = ({ member }) => {
  // Resolve link to profile or LinkedIn
  const profileUrl = member.slug ? `/team/${member.slug}` : (member.linkedin || null);
  
  // Resolve member image
  const staticImage = teamImagesMap[member.name] || teamImagesMap[member.name.split(" ")[0]];
  const imageSource = member.image || staticImage || `https://ui-avatars.com/api/?background=111827&color=fff&size=256&name=${encodeURIComponent(member.name)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      className="w-full aspect-[3/4] max-w-sm mx-auto relative w-full h-full overflow-hidden rounded-[2.5rem] bg-neutral-900 border border-white/10 hover:border-white/30 group transform-gpu transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(236,72,153,0.3)]"
    >
      {/* Stretched Link for the entire card (acting as the main click target without nesting other links) */}
      {profileUrl && (
        <Link 
          href={profileUrl} 
          className="absolute inset-0 z-10" 
          aria-label={`View profile of ${member.name}`} 
        />
      )}

      {/* Subtle colorful background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getDynamicGradient(member.name)} opacity-10 transition-opacity duration-500 group-hover:opacity-30 pointer-events-none`} />
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[40px] pointer-events-none" />

      {/* Circular Avatar */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-white/10 to-white/30 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-transform duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110 group-hover:-translate-y-2">
          <img
            src={imageSource}
            alt={member.name}
            className="w-full h-full rounded-full object-cover border-[6px] border-neutral-900"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      </div>

      {/* Floating Glassmorphic Info Panel (Island Design) */}
      <div className="absolute bottom-3 left-3 right-3 p-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] translate-y-4 group-hover:translate-y-0 pointer-events-none">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl p-5 w-full pointer-events-auto">
          {/* Subtle colorful shine effect on glass */}
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-1">
            <h3 className="text-xl md:text-2xl font-medium text-white tracking-tight">
              {member.name}
            </h3>
            <p className="text-sm font-normal text-white/60 tracking-wide uppercase">
              {member.position}
            </p>
            {member.team && (
              <span className="text-[10px] font-medium text-white/40 tracking-widest uppercase mt-1">
                {member.team}
              </span>
            )}

            {/* Hidden Social Links - Revealed on Hover */}
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] w-full">
              <div className="overflow-hidden">
                <div className="flex items-center justify-center gap-4 pt-5 mt-2 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="relative z-20 text-white/50 hover:text-white transition-colors"
                      title="Email"
                    >
                      <Mail className="w-5 h-5" strokeWidth={1.5} />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="relative z-20 text-white/50 hover:text-white transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" strokeWidth={1.5} />
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="relative z-20 text-white/50 hover:text-white transition-colors"
                      title="GitHub"
                    >
                      <Github className="w-5 h-5" strokeWidth={1.5} />
                    </a>
                  )}
                  {member.instagram && (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="relative z-20 text-white/50 hover:text-white transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="w-5 h-5" strokeWidth={1.5} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCard;
