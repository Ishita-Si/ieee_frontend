"use client"
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import PillNav from "@/components/ui/PillNav";
import Loader from "@/components/ui/Loader";
import { Linkedin, ArrowLeft, Mail, Award, Code, Users, Building2, Github, Instagram } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { TEAM_STRUCTURE } from "@/data/team-structure";
import teamImagesMap from "@/data/team-images-map.json";

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "#chapters" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      if (!params?.slug) {
        setLoading(false);
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/dashboard/team-members/${params.slug}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.member) {
            setMember(data.member);
            setLoading(false);
            return;
          }
        }
        
        throw new Error("Backend response not ok or member not found in backend");
      } catch (err) {
        console.warn('Backend unavailable, falling back to static data:', err);
        
        // STATIC DATA FALLBACK
        const memberSlug = params.slug;
        let foundMember = null;
        let memberTeam = "";
        let memberPos = "";

        // Helper to check if slug matches
        const checkMatch = (person, teamName, pos) => {
          if (!person) return false;
          // Simple slug generator for comparison
          const slug = person.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          // In team-data.js, officers might have '-cs' etc appended, but let's just do a basic match first
          // Actually, if we just check if the slug matches the person name loosely:
          if (slug === memberSlug || memberSlug.startsWith(slug)) {
            foundMember = person;
            memberTeam = teamName;
            memberPos = person.position || pos;
            return true;
          }
          return false;
        };

        // Search executive officers
        if (TEAM_STRUCTURE.executive_officers) {
          for (const exec of TEAM_STRUCTURE.executive_officers) {
            if (checkMatch(exec, "Leaders", exec.position)) break;
          }
        }

        // Search teams
        if (!foundMember && TEAM_STRUCTURE.teams) {
          for (const [teamKey, teamData] of Object.entries(TEAM_STRUCTURE.teams)) {
            if (foundMember) break;
            
            // check officers
            if (teamData.officers) {
              for (const off of teamData.officers) {
                if (checkMatch(off, teamKey, off.position)) break;
              }
            }
            if (foundMember) break;
            
            // check head
            if (teamData.heads_and_coheads?.head) {
              if (checkMatch(teamData.heads_and_coheads.head, teamKey, "Head")) break;
            }
            if (foundMember) break;
            
            // check coheads
            if (teamData.heads_and_coheads?.co_heads) {
              for (const cohead of teamData.heads_and_coheads.co_heads) {
                if (checkMatch(cohead, teamKey, "Co-Head")) break;
              }
            }
          }
        }

        if (foundMember) {
          const staticImage = teamImagesMap[foundMember.name] || teamImagesMap[foundMember.name.split(" ")[0]];
          
          setMember({
            ...foundMember,
            team: memberTeam,
            position: memberPos,
            image: staticImage || null,
            bio: "IEEE Student Branch RGIPT Core Team Member.",
            achievements: "Driving excellence and innovation in our student chapter.",
          });
        } else {
          setError('Member not found');
          setTimeout(() => router.push('/team'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [params, router]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black relative flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader size="default" />
          <p className="text-white/50 text-sm">Loading member profile...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="w-full min-h-screen bg-black relative flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">{error || 'Member not found'}</p>
          <Link href="/team" className="text-purple-400 hover:text-purple-300">
            Return to Team
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-white relative overflow-x-hidden">
      <div className="relative z-10 w-full bg-black">
        <PillNav items={navItems} />
        <div className="relative min-h-screen py-24 md:py-28 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link
              href="/team"
              className="inline-flex items-center gap-2 mb-8 text-white/70 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Team</span>
            </Link>

            {/* Member Card */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 md:p-8 lg:p-10 backdrop-blur-md">
              {/* Enlarged Avatar Section - Centered */}
              <div className="flex justify-center mb-8 md:mb-12">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px] rounded-2xl overflow-hidden border-2 border-white/20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 shadow-[0_0_40px_rgba(147,51,234,0.3)]">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (e.target) {
                          e.target.style.display = 'none';
                        }
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 flex items-center justify-center text-white font-bold text-6xl md:text-7xl lg:text-8xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 ${member.image ? 'opacity-0' : 'opacity-100'}`}>
                    {getInitials(member.name)}
                  </div>
                </div>
              </div>

              {/* Info Section - Below Image */}
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  {member.name}
                </h1>
                <div className="inline-block px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold mb-8 text-lg md:text-xl">
                  {member.position}
                </div>
                
                {/* Social Links */}
                <div className="flex items-center justify-center gap-4 mt-8 mb-12 flex-wrap">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:scale-110 hover:border-purple-400/50 cursor-pointer transition-all"
                      title={`Email: ${member.email}`}
                    >
                      <Mail className="w-7 h-7 text-purple-400" />
                    </a>
                  )}
                  <a
                    href={member.linkedin || '#'}
                    target={member.linkedin ? "_blank" : undefined}
                    rel={member.linkedin ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      if (!member.linkedin) {
                        e.preventDefault();
                      }
                    }}
                    className={`p-4 rounded-xl border border-white/10 transition-all ${
                      member.linkedin 
                        ? 'bg-white/5 hover:bg-white/10 hover:scale-110 hover:border-blue-400/50 cursor-pointer' 
                        : 'bg-white/5 opacity-50 cursor-not-allowed'
                    }`}
                    title={member.linkedin ? "LinkedIn" : "LinkedIn (Not available)"}
                  >
                    <Linkedin className={`w-7 h-7 ${member.linkedin ? 'text-blue-400' : 'text-white/50'}`} />
                  </a>
                  <a
                    href={member.github || '#'}
                    target={member.github ? "_blank" : undefined}
                    rel={member.github ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      if (!member.github) {
                        e.preventDefault();
                      }
                    }}
                    className={`p-4 rounded-xl border border-white/10 transition-all ${
                      member.github 
                        ? 'bg-white/5 hover:bg-white/10 hover:scale-110 hover:border-gray-400/50 cursor-pointer' 
                        : 'bg-white/5 opacity-50 cursor-not-allowed'
                    }`}
                    title={member.github ? "GitHub" : "GitHub (Not available)"}
                  >
                    <Github className={`w-7 h-7 ${member.github ? 'text-white' : 'text-white/50'}`} />
                  </a>
                  <a
                    href={member.instagram || '#'}
                    target={member.instagram ? "_blank" : undefined}
                    rel={member.instagram ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      if (!member.instagram) {
                        e.preventDefault();
                      }
                    }}
                    className={`p-4 rounded-xl border border-white/10 transition-all ${
                      member.instagram 
                        ? 'bg-white/5 hover:bg-white/10 hover:scale-110 hover:border-pink-400/50 cursor-pointer' 
                        : 'bg-white/5 opacity-50 cursor-not-allowed'
                    }`}
                    title={member.instagram ? "Instagram" : "Instagram (Not available)"}
                  >
                    <Instagram className={`w-7 h-7 ${member.instagram ? 'text-pink-400' : 'text-white/50'}`} />
                  </a>
                </div>
              </div>

              {/* Bio Section */}
              {member.bio && (
                <div className="mt-8 pt-8 border-t border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6 text-purple-400" />
                    About
                  </h2>
                  <p className="text-white/80 leading-relaxed text-lg">
                    {member.bio}
                  </p>
                </div>
              )}

              {/* Achievements Section */}
              {member.achievements && (
                <div className="mt-8 pt-8 border-t border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-yellow-400" />
                    Achievements
                  </h2>
                  <p className="text-white/80 leading-relaxed text-lg">
                    {member.achievements}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
