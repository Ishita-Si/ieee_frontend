
"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Users, Code, Cpu, Bot, Sparkles, Radio, Wrench, FileText, Palette, Shield, PenTool, Calendar, Network } from 'lucide-react';
import { teamData, generateSlug } from '@/data/team-data';
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
      const position = member.role ? `${member.role} - ${member.team}` : member.position;
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

  const executiveMembers = [
    teamData.executive?.chair,
    teamData.executive?.viceChair,
    ...(teamData.executive?.secretaries || []),
    teamData.executive?.treasurer
  ].filter(Boolean);
  const executiveItems = buildChromaItems(executiveMembers, paletteOffset, 'Executive Committee');
  paletteOffset += executiveItems.length;

  const webDesignMembers = [...(teamData.webDesignTeam?.webmasters || [])].filter(Boolean);
  const webDesignItems = buildChromaItems(
    webDesignMembers,
    paletteOffset,
    'Web & Design Team',
    { slugResolver: webTeamSlugResolver }
  );
  paletteOffset += webDesignItems.length;

  const technicalSections = [
    {
      title: 'Computer Society',
      description: 'Driving CS initiatives, workshops, and coding culture.',
      icon: Cpu,
      members: [
        teamData.technicalTeam?.csSecretary,
        ...(teamData.technicalTeam?.csViceSecretaries || [])
      ].filter(Boolean),
      slugResolver: csSlugResolver
    },
    {
      title: 'Robotics & Automation Society',
      description: 'Building innovative robotics and automation experiences.',
      icon: Bot,
      members: [
        teamData.technicalTeam?.rasSecretary,
        ...(teamData.technicalTeam?.rasViceSecretaries || [])
      ].filter(Boolean)
    },
    {
      title: 'Women in Engineering',
      description: 'Championing inclusion, mentorship, and leadership.',
      icon: Sparkles,
      members: [
        teamData.technicalTeam?.wieSecretary,
        ...(teamData.technicalTeam?.wieViceSecretaries || [])
      ].filter(Boolean)
    },
    {
      title: 'Communications Society',
      description: 'Exploring communication systems and networks.',
      icon: Radio,
      members: [
        teamData.technicalTeam?.comsocSecretary,
        ...(teamData.technicalTeam?.comsocViceSecretaries || [])
      ].filter(Boolean)
    }
  ].map((section) => {
    const items = buildChromaItems(
      section.members,
      paletteOffset,
      section.title,
      { slugResolver: section.slugResolver }
    );
    paletteOffset += items.length;
    return { ...section, items };
  });

  const generalItems = buildChromaItems(teamData.generalMembers || [], paletteOffset, 'IEEE RGIPT');
  
  // Calculate palette offset for new designations
  let newDesignationPaletteOffset = paletteOffset + generalItems.length;
  
  // Team configuration with icons and descriptions
  const teamConfig = {
    'Joint Secretaries': { icon: Users, description: 'IEEE members supporting branch operations and coordination.' },
    'Design': { icon: Palette, description: 'IEEE members creating visual identity and design assets.' },
    'Audit': { icon: Shield, description: 'IEEE members ensuring transparency and accountability.' },
    'Editorial': { icon: PenTool, description: 'IEEE members crafting content and communications.' },
    'WIE': { icon: Sparkles, description: 'IEEE members championing inclusion, mentorship, and leadership.' },
    'ComSoc': { icon: Radio, description: 'IEEE members exploring communication systems and networks.' },
    'RAS': { icon: Bot, description: 'IEEE members building innovative robotics and automation experiences.' },
    'CS': { icon: Cpu, description: 'IEEE members driving CS initiatives, workshops, and coding culture. Head leads the team with coheads supporting.' },
    'Event': { icon: Calendar, description: 'IEEE members organizing and managing branch events.' },
    'CNM': { icon: Network, description: 'IEEE members exploring computational intelligence and network systems.' },
    'General': { icon: Wrench, description: 'IEEE member volunteers and contributors powering IEEE Student Branch initiatives.' }
  };
  
  // Build items for new designations grouped by team
  const newDesignationSections = [];
  const teamOrder = ['Joint Secretaries', 'Design', 'Audit', 'Editorial', 'WIE', 'ComSoc', 'RAS', 'CS', 'Event', 'CNM', 'General'];
  
  teamOrder.forEach(teamName => {
    const teamMembers = newDesignationMembers[teamName];
    if (teamMembers && teamMembers.length > 0) {
      const config = teamConfig[teamName] || { icon: Users, description: `${teamName} team members.` };
      newDesignationSections.push({
        title: teamName === 'CS' ? 'Computer Society' : teamName === 'Event' ? 'Event Management' : teamName,
        icon: config.icon,
        description: config.description,
        items: buildChromaItems(teamMembers, newDesignationPaletteOffset, teamName),
        offset: newDesignationPaletteOffset
      });
      newDesignationPaletteOffset += teamMembers.length;
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

        {/* Web & Design */}
        {webDesignItems.length > 0 && (
          <SectionGrid
            title="Members - Web & Design Team"
            icon={Code}
            description="Designing, developing, and maintaining our digital footprint."
            items={webDesignItems}
            columns={3}
          />
        )}

        {/* Technical Societies */}
        {technicalSections.map((section) =>
          section.items.length > 0 ? (
            <SectionGrid
              key={section.title}
              title={`Members - ${section.title}`}
              icon={section.icon}
              description={section.description}
              items={section.items}
              columns={section.items.length >= 4 ? 4 : 3}
            />
          ) : null
        )}

        {/* Members grouped by team from Backend */}
        {!loadingMembers && newDesignationSections.map((section) => (
          <SectionGrid
            key={section.title}
            title={`Members - ${section.title}`}
            icon={section.icon}
            description={section.description}
            items={section.items}
            columns={section.items.length >= 4 ? 4 : section.items.length >= 3 ? 3 : 2}
          />
        ))}

        {/* General Members (from static data) */}
        {generalItems.length > 0 && (
          <SectionGrid
            title="Members - General"
            icon={Wrench}
            description="Volunteers and contributors powering IEEE Student Branch initiatives."
            items={generalItems}
            columns={4}
          />
        )}
      </div>
    </div>
  );
};

export default TeamPage;
