"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Users, Code, Cpu, Bot, Sparkles, Radio, Wrench, 
  FileText, Palette, Shield, PenTool, Calendar, Network, 
  Search, SlidersHorizontal, Award
} from "lucide-react";
import { TEAM_STRUCTURE } from "@/data/team-structure";
import { generateSlug } from "@/data/team-data";
import TeamCard from "./team-card";
import { motion, AnimatePresence } from "framer-motion";

// Configuration mapping for teams with icons and descriptions
const teamConfig = {
  CS: { icon: Cpu, title: "Computer Society", description: "IEEE members driving CS initiatives, workshops, and coding culture. Head leads the team with coheads supporting." },
  COMSOC: { icon: Radio, title: "Communications Society", description: "IEEE members exploring communication systems and networks." },
  WIE: { icon: Sparkles, title: "Women in Engineering", description: "IEEE members championing inclusion, mentorship, and leadership." },
  RAS: { icon: Bot, title: "Robotics & Automation Society", description: "IEEE members building innovative robotics and automation experiences." },
  CNM: { icon: Network, title: "CNM", description: "IEEE members exploring computational intelligence and network systems." },
  Joint_Secretary: { icon: Users, title: "Joint Secretaries", description: "IEEE members supporting branch operations and coordination." },
  Design: { icon: Palette, title: "Design Team", description: "IEEE members creating visual identity and design assets." },
  Audit: { icon: Shield, title: "Audit Team", description: "IEEE members ensuring transparency and accountability." },
  Editorial: { icon: PenTool, title: "Editorial", description: "IEEE members crafting content and communications." },
  EVENT: { icon: Calendar, title: "Event Management", description: "IEEE members organizing and managing branch events." }
};

export const TeamPage = () => {
  const [memberDataMap, setMemberDataMap] = useState({});
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'leadership' | 'technical' | 'committees'
  const [newDesignationMembers, setNewDesignationMembers] = useState({});

  // Fetch team members from backend grouped by team
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${apiUrl}/dashboard/team-members`);
        
        if (response.ok) {
          const data = await response.json();
          const allMembers = data.members || [];
          
          // Map email to backend details (uploaded photos, socials, etc.)
          const emailToMemberMap = {};
          const designationMap = {};
          allMembers.forEach(member => {
            if (member.email) {
              emailToMemberMap[member.email.toLowerCase()] = member;
            }
            if (member.team) {
              if (!designationMap[member.team]) designationMap[member.team] = [];
              designationMap[member.team].push(member);
            }
          });
          setMemberDataMap(emailToMemberMap);
          setNewDesignationMembers(designationMap);
        }
      } catch (error) {
        console.warn("Backend API unreachable. Falling back to static team structure.");
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // Construct structured data with category tags
  const structuredMembers = useMemo(() => {
    const list = [];

    // 1. Executive Officers (Leadership)
    TEAM_STRUCTURE.executive_officers.forEach(officer => {
      const backendData = memberDataMap[officer.email.toLowerCase()];
      list.push({
        name: officer.name,
        position: officer.position,
        email: officer.email,
        image: backendData?.image || backendData?.profile_image_url || null,
        linkedin: backendData?.linkedin || backendData?.linkedin_url || "",
        github: backendData?.github || backendData?.github_url || "",
        instagram: backendData?.instagram || backendData?.instagram_url || "",
        bio: backendData?.bio || "",
        achievements: backendData?.achievements || "",
        team: "Leaders",
        category: "leadership",
        slug: backendData?.slug || (officer.name ? generateSlug(officer.name) : null),
        order: 1
      });
    });

    // 2. Society and Committee Teams
    Object.keys(TEAM_STRUCTURE.teams).forEach(teamKey => {
      const team = TEAM_STRUCTURE.teams[teamKey];
      const isTech = ["CS", "COMSOC", "WIE", "RAS", "CNM"].includes(teamKey);
      const category = isTech ? "technical" : "committees";
      
      const config = teamConfig[teamKey] || { title: teamKey };
      const displayTeamName = config.title;

      // Add officers (like Chapter Secretaries)
      if (team.officers) {
        team.officers.forEach(officer => {
          const backendData = memberDataMap[officer.email.toLowerCase()];
          list.push({
            name: officer.name,
            position: officer.position,
            email: officer.email,
            image: backendData?.image || backendData?.profile_image_url || null,
            linkedin: backendData?.linkedin || backendData?.linkedin_url || "",
            github: backendData?.github || backendData?.github_url || "",
            instagram: backendData?.instagram || backendData?.instagram_url || "",
            bio: backendData?.bio || "",
            achievements: backendData?.achievements || "",
            team: displayTeamName,
            category: category,
            slug: backendData?.slug || (officer.name ? generateSlug(officer.name) : null),
            order: 2
          });
        });
      }

      // Add head
      if (team.heads_and_coheads?.head) {
        const head = team.heads_and_coheads.head;
        const backendData = memberDataMap[head.email.toLowerCase()];
        list.push({
          name: head.name,
          position: `Head - ${teamKey}`,
          email: head.email,
          image: backendData?.image || backendData?.profile_image_url || null,
          linkedin: backendData?.linkedin || backendData?.linkedin_url || "",
          github: backendData?.github || backendData?.github_url || "",
          instagram: backendData?.instagram || backendData?.instagram_url || "",
          bio: backendData?.bio || "",
          achievements: backendData?.achievements || "",
          team: displayTeamName,
          category: category,
          slug: backendData?.slug || (head.name ? generateSlug(head.name) : null),
          order: 3
        });
      }

      // Add coheads
      if (team.heads_and_coheads?.co_heads) {
        team.heads_and_coheads.co_heads.forEach(cohead => {
          const backendData = memberDataMap[cohead.email.toLowerCase()];
          list.push({
            name: cohead.name,
            position: `Cohead - ${teamKey}`,
            email: cohead.email,
            image: backendData?.image || backendData?.profile_image_url || null,
            linkedin: backendData?.linkedin || backendData?.linkedin_url || "",
            github: backendData?.github || backendData?.github_url || "",
            instagram: backendData?.instagram || backendData?.instagram_url || "",
            bio: backendData?.bio || "",
            achievements: backendData?.achievements || "",
            team: displayTeamName,
            category: category,
            slug: backendData?.slug || (cohead.name ? generateSlug(cohead.name) : null),
            order: 4
          });
        });
      }
    });

    // 3. Add any dynamic backend teams not covered in TEAM_STRUCTURE
    const teamOrder = ['Joint Secretaries', 'Design', 'Audit', 'Editorial', 'WIE', 'ComSoc', 'RAS', 'CS', 'Event', 'CNM', 'General'];
    teamOrder.forEach(teamName => {
      const teamMembers = newDesignationMembers[teamName];
      if (teamMembers && teamMembers.length > 0) {
        const mapping = {
          'Joint Secretaries': 'Joint_Secretary',
          'ComSoc': 'COMSOC',
          'Event': 'EVENT'
        };
        const mappedKey = mapping[teamName] || teamName;
        // Check if covered
        if (!TEAM_STRUCTURE.teams[mappedKey]) {
          const displayTeamName = teamName === 'CS' ? 'Computer Society' : teamName === 'Event' ? 'Event Management' : teamName;
          teamMembers.forEach(member => {
            list.push({
              name: member.name,
              position: member.position || member.role || "Member",
              email: member.email,
              image: member.image || member.profile_image_url || null,
              linkedin: member.linkedin || member.linkedin_url || "",
              github: member.github || member.github_url || "",
              instagram: member.instagram || member.instagram_url || "",
              bio: member.bio || "",
              achievements: member.achievements || "",
              team: displayTeamName,
              category: "committees",
              slug: member.slug || (member.name ? generateSlug(member.name) : null),
              order: 5
            });
          });
        }
      }
    });

    return list;
  }, [memberDataMap, newDesignationMembers]);

  // Filter members by tab and search query
  const filteredMembersByTeam = useMemo(() => {
    // Apply search query first
    let list = structuredMembers;
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        m => 
          m.name.toLowerCase().includes(query) ||
          m.position.toLowerCase().includes(query) ||
          m.team.toLowerCase().includes(query)
      );
    }

    // Apply tab category filter
    if (activeTab !== "all") {
      list = list.filter(m => m.category === activeTab);
    }

    // Group the results by team name
    const grouped = {};
    list.forEach(member => {
      const teamName = member.team;
      if (!grouped[teamName]) {
        grouped[teamName] = [];
      }
      grouped[teamName].push(member);
    });

    return grouped;
  }, [structuredMembers, searchQuery, activeTab]);

  return (
    <div className="relative min-h-screen pt-40 pb-24 md:pt-48 md:pb-32 lg:pt-56 lg:pb-40 bg-black overflow-hidden">
      {/* Immersive background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md"
          >
            <Users className="w-5 h-5 text-indigo-400" />
            <span className="text-indigo-200 text-sm font-semibold">Our Team</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-indigo-400 mb-6 tracking-tight"
          >
            Meet our Team
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            The dedicated team of IEEE Student Branch, RGIPT driving technological innovation, learning, and collaborative leadership.
          </motion.p>
        </div>

        {/* Filter Controls Row */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-xl">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {[
              { id: "all", label: "All Members" },
              { id: "leadership", label: "Leadership" },
              { id: "technical", label: "Societies" },
              { id: "committees", label: "Committees" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                    : "text-neutral-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4.5 w-4.5 text-neutral-500" />
            </span>
            <input
              type="text"
              placeholder="Search by name, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 transition-colors focus:ring-1 focus:ring-white/30 backdrop-blur-md"
            />
          </div>
        </div>

        {/* Members Grid by Team Section */}
        {Object.keys(filteredMembersByTeam).length > 0 ? (
          <div className="space-y-20">
            {Object.keys(filteredMembersByTeam).map((teamName) => {
              // Find the configuration matching the current team
              const isExec = teamName === "Leaders";
              const key = Object.keys(teamConfig).find(k => teamConfig[k].title === teamName) || teamName;
              const config = teamConfig[key] || {
                icon: Users,
                title: teamName,
                description: isExec ? "Guiding the branch with strategic leadership and operational excellence." : "Branch working committee."
              };
              const IconComponent = config.icon;

              return (
                <div key={teamName} className="space-y-6">
                  {/* Section Title */}
                  <div className="mb-12 transition-all duration-1000">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <IconComponent className="w-6 h-6 text-purple-300" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        {config.title}
                      </h2>
                    </div>
                    {config.description && (
                      <p className="text-white/65 text-base md:text-lg max-w-3xl">
                        {config.description}
                      </p>
                    )}
                  </div>

                  {/* Members Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredMembersByTeam[teamName]
                      .sort((a, b) => a.order - b.order)
                      .map((member) => (
                        <TeamCard key={member.email} member={member} />
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/10 rounded-3xl">
            <Users className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No members found</h3>
            <p className="text-neutral-400 text-sm">
              Try adjusting your search criteria or changing the filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;
