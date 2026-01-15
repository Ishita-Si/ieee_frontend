
"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Users, Code, Cpu, Bot, Sparkles, Radio, Wrench, FileText, Palette, Shield, PenTool, Calendar, Network } from 'lucide-react';
import { teamData, generateSlug } from '@/data/team-data';
import { TEAM_STRUCTURE } from '@/data/team-structure';
import ChromaGrid from '@/components/ui/ChromaGrid';

const highlightPalette = [
  { border: '#4F46E5', gradient: 'linear-gradient(145deg,#4F46E5,#000)' },
  { border: '#10B981', gradient: 'linear-gradient(210deg,#10B981,#000)' },
  { border: '#F59E0B', gradient: 'linear-gradient(165deg,#F59E0B,#000)' },
  { border: '#EF4444', gradient: 'linear-gradient(195deg,#EF4444,#000)' },
  { border: '#8B5CF6', gradient: 'linear-gradient(225deg,#8B5CF6,#000)' },
  { border: '#06B6D4', gradient: 'linear-gradient(135deg,#06B6D4,#000)' },
  { border: '#F472B6', gradient: 'linear-gradient(160deg,#F472B6,#000)' },
  { border: '#34D399', gradient: 'linear-gradient(205deg,#34D399,#000)' }
];

const getHandleFromUrl = (url) => {
  if (!url) return null;
  try {
    const host = url
      .replace(/^https?:\/\//, '')
      .replace('www.', '')
      .split('/')[0];
    return `@${host.split('.')[0]}`;
  } catch (error) {
    return null;
  }
};

const buildChromaItems = (
  members = [],
  offset = 0,
  fallbackLocation = 'IEEE RGIPT',
  options = {}
) => {
  return members
    .filter(Boolean)
    .map((member, idx) => {
      const palette = highlightPalette[(offset + idx) % highlightPalette.length];
      const fallbackImg = `https://ui-avatars.com/api/?background=111827&color=fff&name=${encodeURIComponent(
        member.name || ''
      )}`;

      const slug =
        options.slugResolver?.(member) ||
        (member?.name ? generateSlug(member.name) : null);

      // For backend members, use team and role info
      // If member has a specific position (like "CS Secretary"), use that
      // Otherwise, use role - team format (like "Head - CS")
      let position = member.position;
      if (member.role && member.team && !member.position) {
        position = `${member.role} - ${member.team}`;
      } else if (member.position && member.team && !member.position.includes(member.team)) {
        // If position doesn't include team name, add it for context
        position = member.position;
      }
      const location = member.is_ieee_member ? `IEEE Member - ${member.team || fallbackLocation}` : (member.team || member.chapter || member.society || member.section || fallbackLocation);

      return {
        image: member.image || fallbackImg,
        title: member.name,
        subtitle: position, // Shows "Head - CS" or "Cohead - Design"
        handle: getHandleFromUrl(member.linkedin),
        location: location, // Shows team name
        borderColor: palette.border,
        gradient: palette.gradient,
        url: slug ? `/team/${slug}` : member.linkedin || null
      };
    });
};

const defaultSlugResolver = (member) => (member?.name ? generateSlug(member.name) : null);

const webTeamSlugResolver = (member) => {
  if (!member?.name) return null;
  const base = generateSlug(member.name);
  if (member.name === 'Aditya Bhattacharya' && member.position === 'Web Master') {
    return `${base}-webmaster`;
  }
  return base;
};

const csSlugResolver = (member) => {
  if (!member?.name) return null;
  return `${generateSlug(member.name)}-cs`;
};

const SectionGrid = ({ title, description, icon: Icon, items, columns = 3, radius = 320 }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  if (!items || items.length === 0) return null;

  const rows = Math.max(1, Math.ceil(items.length / columns));

  return (
    <section ref={sectionRef} className="mb-20 md:mb-28">
      <div
        className={`mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="flex items-center gap-4 mb-4">
          {Icon && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <Icon className="w-6 h-6 text-purple-300" />
            </div>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
        </div>
        {description && (
          <p className="text-white/65 text-base md:text-lg max-w-3xl">
            {description}
          </p>
        )}
      </div>

      <ChromaGrid
        items={items}
        columns={columns}
        rows={rows}
        radius={radius}
        className="bg-white/5 border border-white/10 rounded-3xl p-4 sm:p-6"
      />
    </section>
  );
};

const TeamPage = () => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [newDesignationMembers, setNewDesignationMembers] = useState({});
  const [memberDataMap, setMemberDataMap] = useState({}); // Map email to member data from backend
  const [loadingMembers, setLoadingMembers] = useState(true);
  const headerRef = useRef(null);

  // Fetch team members from backend grouped by team
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        // Fetch all members at once
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/dashboard/team-members`);
        
        if (response.ok) {
          const data = await response.json();
          const membersByTeam = data.membersByTeam || {};
          const allMembers = data.members || [];
          
          // Create a map of email to member data for easy lookup
          const emailToMemberMap = {};
          allMembers.forEach(member => {
            if (member.email) {
              emailToMemberMap[member.email.toLowerCase()] = member;
            }
          });
          setMemberDataMap(emailToMemberMap);
          
          // Store members grouped by team (already sorted: heads first, then coheads)
          setNewDesignationMembers(membersByTeam);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchTeamMembers();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsHeaderVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);

  let paletteOffset = 0;

  // Build executive officers from new team structure
  // This will re-render when memberDataMap updates with backend data
  // When IEEE members register and upload their photo, it's automatically saved to profile_image_url
  // and will appear here once they're verified and their data is fetched from the backend
  const executiveMembers = TEAM_STRUCTURE.executive_officers.map(officer => {
    // Try to get member data from backend if available (matches by email)
    // Backend returns profile_image_url as 'image' field
    const backendData = memberDataMap[officer.email.toLowerCase()];
    return {
      name: officer.name,
      position: officer.position,
      email: officer.email,
      // Use profile_image_url from backend if available (uploaded during registration)
      // If null, buildChromaItems will use a fallback avatar
      image: backendData?.image || backendData?.profile_image_url || null,
      linkedin: backendData?.linkedin || backendData?.linkedin_url || '',
      github: backendData?.github || backendData?.github_url || '',
      instagram: backendData?.instagram || backendData?.instagram_url || '',
      bio: backendData?.bio || '',
      achievements: backendData?.achievements || '',
      is_ieee_member: true
    };
  });
  const executiveItems = buildChromaItems(executiveMembers, paletteOffset, 'Leaders');
  paletteOffset += executiveItems.length;

  // Build team sections from TEAM_STRUCTURE
  // This includes all officers, heads, and coheads from the structure
  // If they've registered, their uploaded photos will be shown, otherwise fallback avatars
  const buildTeamMembersFromStructure = (teamKey, team) => {
    const members = [];
    
    // Add officers if they exist (officers come first)
    if (team.officers) {
      team.officers.forEach(officer => {
        const backendData = memberDataMap[officer.email.toLowerCase()];
        members.push({
          name: officer.name,
          position: officer.position, // e.g., "CS Secretary", "COMSOC Secretary"
          email: officer.email,
          image: backendData?.image || backendData?.profile_image_url || null,
          linkedin: backendData?.linkedin || backendData?.linkedin_url || '',
          github: backendData?.github || backendData?.github_url || '',
          instagram: backendData?.instagram || backendData?.instagram_url || '',
          bio: backendData?.bio || '',
          achievements: backendData?.achievements || '',
          is_ieee_member: true,
          team: teamKey,
          role: 'Officer'
        });
      });
    }
    
    // Add head if exists (heads come after officers)
    if (team.heads_and_coheads?.head) {
      const head = team.heads_and_coheads.head;
      const backendData = memberDataMap[head.email.toLowerCase()];
      members.push({
        name: head.name,
        position: `Head - ${teamKey}`, // e.g., "Head - CS"
        email: head.email,
        image: backendData?.image || backendData?.profile_image_url || null,
        linkedin: backendData?.linkedin || backendData?.linkedin_url || '',
        github: backendData?.github || backendData?.github_url || '',
        instagram: backendData?.instagram || backendData?.instagram_url || '',
        bio: backendData?.bio || '',
        achievements: backendData?.achievements || '',
        is_ieee_member: true,
        team: teamKey,
        role: 'Head',
        isHead: true
      });
    }
    
    // Add coheads if they exist (coheads come after heads)
    if (team.heads_and_coheads?.co_heads) {
      team.heads_and_coheads.co_heads.forEach(cohead => {
        const backendData = memberDataMap[cohead.email.toLowerCase()];
        members.push({
          name: cohead.name,
          position: `Cohead - ${teamKey}`, // e.g., "Cohead - CS"
          email: cohead.email,
          image: backendData?.image || backendData?.profile_image_url || null,
          linkedin: backendData?.linkedin || backendData?.linkedin_url || '',
          github: backendData?.github || backendData?.github_url || '',
          instagram: backendData?.instagram || backendData?.instagram_url || '',
          bio: backendData?.bio || '',
          achievements: backendData?.achievements || '',
          is_ieee_member: true,
          team: teamKey,
          role: 'Cohead',
          isHead: false
        });
      });
    }
    
    return members;
  };
  
  // Calculate palette offset for team sections
  let teamSectionsPaletteOffset = paletteOffset;
  
  // Team configuration with icons and descriptions
  const teamConfig = {
    'CS': { icon: Cpu, title: 'Computer Society', description: 'IEEE members driving CS initiatives, workshops, and coding culture. Head leads the team with coheads supporting.' },
    'COMSOC': { icon: Radio, title: 'Communications Society', description: 'IEEE members exploring communication systems and networks.' },
    'WIE': { icon: Sparkles, title: 'Women in Engineering', description: 'IEEE members championing inclusion, mentorship, and leadership.' },
    'RAS': { icon: Bot, title: 'Robotics & Automation Society', description: 'IEEE members building innovative robotics and automation experiences.' },
    'Joint_Secretary': { icon: Users, title: 'Joint Secretaries', description: 'IEEE members supporting branch operations and coordination.' },
    'Design': { icon: Palette, title: 'Design', description: 'IEEE members creating visual identity and design assets.' },
    'Audit': { icon: Shield, title: 'Audit', description: 'IEEE members ensuring transparency and accountability.' },
    'Editorial': { icon: PenTool, title: 'Editorial', description: 'IEEE members crafting content and communications.' },
    'EVENT': { icon: Calendar, title: 'Event Management', description: 'IEEE members organizing and managing branch events.' },
    'CNM': { icon: Network, title: 'CNM', description: 'IEEE members exploring computational intelligence and network systems.' }
  };
  
  // Build team sections from TEAM_STRUCTURE (shows ALL members, not just registered ones)
  const teamSections = [];
  Object.keys(TEAM_STRUCTURE.teams).forEach(teamKey => {
    const team = TEAM_STRUCTURE.teams[teamKey];
    const members = buildTeamMembersFromStructure(teamKey, team);
    
    if (members.length > 0) {
      const config = teamConfig[teamKey] || { icon: Users, title: teamKey, description: `${teamKey} team members.` };
      teamSections.push({
        title: config.title,
        icon: config.icon,
        description: config.description,
        items: buildChromaItems(members, teamSectionsPaletteOffset, teamKey),
        offset: teamSectionsPaletteOffset
      });
      teamSectionsPaletteOffset += members.length;
    }
  });
  
  // Also include members from backend that might not be in structure (for backward compatibility)
  const backendTeamSections = [];
  const teamOrder = ['Joint Secretaries', 'Design', 'Audit', 'Editorial', 'WIE', 'ComSoc', 'RAS', 'CS', 'Event', 'CNM', 'General'];
  
  teamOrder.forEach(teamName => {
    const teamMembers = newDesignationMembers[teamName];
    if (teamMembers && teamMembers.length > 0) {
      // Check if this team is already covered by structure-based sections
      const isAlreadyCovered = teamSections.some(section => {
        const mapping = {
          'Joint Secretaries': 'Joint_Secretary',
          'ComSoc': 'COMSOC',
          'Event': 'EVENT'
        };
        return section.title === teamConfig[mapping[teamName] || teamName]?.title;
      });
      
      if (!isAlreadyCovered) {
        const config = teamConfig[teamName] || { icon: Users, description: `${teamName} team members.` };
        backendTeamSections.push({
          title: teamName === 'CS' ? 'Computer Society' : teamName === 'Event' ? 'Event Management' : teamName,
          icon: config.icon,
          description: config.description,
          items: buildChromaItems(teamMembers, teamSectionsPaletteOffset, teamName),
          offset: teamSectionsPaletteOffset
        });
        teamSectionsPaletteOffset += teamMembers.length;
      }
    }
  });

  return (
    <div className="relative min-h-screen py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-16 md:mb-24 transition-all duration-1000 ${
            isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Users className="w-5 h-5 text-purple-300" />
            <span className="text-purple-300 text-sm font-semibold">Our Team</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Meet Our Team
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            The passionate IEEE members driving innovation and excellence at IEEE Student Branch, RGIPT
          </p>
        </div>

        {/* Leaders (formerly Executive Committee) */}
        {executiveItems.length > 0 && (
          <SectionGrid
            title="Leaders"
            icon={Users}
            description="Guiding the branch with strategic leadership and operational excellence."
            items={executiveItems}
          />
        )}

        {/* Team Sections from TEAM_STRUCTURE - Shows ALL members (officers, heads, coheads) */}
        {teamSections.map((section) => (
          <SectionGrid
            key={section.title}
            title={`Members - ${section.title}`}
            icon={section.icon}
            description={section.description}
            items={section.items}
            columns={section.items.length >= 4 ? 4 : section.items.length >= 3 ? 3 : 2}
          />
        ))}

        {/* Additional members from backend (for any registered members not in structure) */}
        {!loadingMembers && backendTeamSections.map((section) => (
          <SectionGrid
            key={section.title}
            title={`Members - ${section.title}`}
            icon={section.icon}
            description={section.description}
            items={section.items}
            columns={section.items.length >= 4 ? 4 : section.items.length >= 3 ? 3 : 2}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
