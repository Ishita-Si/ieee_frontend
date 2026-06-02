const ABOUT_IMAGE_DIR = "/about-page";
const IMAGE_COUNT = 16;

const ALT_TEXT = [
  "IEEE RGIPT Computer Society workshop poster",
  "IEEE RGIPT branch event",
  "IEEE RGIPT technical session",
  "IEEE RGIPT community event",
  "IEEE RGIPT workshop activity",
  "IEEE RGIPT hands-on learning",
  "IEEE RGIPT student workshop",
  "Students at an IEEE RGIPT technical workshop",
  "IEEE RGIPT collaborative project session",
  "IEEE RGIPT event highlight",
  "IEEE RGIPT workshop in the lecture hall",
  "IEEE RGIPT branch gathering",
  "IEEE RGIPT outreach event",
  "IEEE RGIPT students with a robotics project",
  "IEEE RGIPT team at an event",
  "IEEE RGIPT branch meetup",
];

export function eventPath(index) {
  const num = String(index).padStart(2, "0");
  return `${ABOUT_IMAGE_DIR}/event-${num}.png`;
}

export const ABOUT_GALLERY = Array.from({ length: IMAGE_COUNT }, (_, i) => ({
  src: eventPath(i + 1),
  alt: ALT_TEXT[i] ?? "IEEE RGIPT event photo",
}));

const HERO_EVENT_NUMBERS = [8, 11, 12, 9];

export const HERO_GALLERY = HERO_EVENT_NUMBERS.map((num) => ({
  src: eventPath(num),
  alt: ALT_TEXT[num - 1] ?? "IEEE RGIPT event photo",
}));

export const MARQUEE_GALLERY = ABOUT_GALLERY;

export const HERO = {
  eyebrow: "IEEE Student Branch | RGIPT",
  title: "Engineering the future, together.",
  subtitle:
    "A collective of innovators, builders, and leaders at Rajiv Gandhi Institute of Petroleum Technology - advancing technology for humanity since 2010.",
  primaryCta: { label: "Join IEEE RGIPT", href: "/membership" },
  secondaryCta: { label: "Meet the Team", href: "/team" },
  stats: [
    { value: "300+", label: "Members" },
    { value: "75+", label: "Events" },
    { value: "15+", label: "Years Active" },
  ],
};

export const MISSION = {
  label: "WHAT WE STAND FOR",
  title: "Our Mission",
  description:
    "To foster a culture of technical excellence and professional growth. We provide the resources, mentorship, and platform for students to transform theoretical knowledge into impactful reality.",
  pillars: [
    {
      title: "Innovation",
      description: "Pushing boundaries with cutting-edge solutions.",
      accent: "bg-blue-500",
      glow: "group-hover:shadow-blue-500/25",
      badge: "from-blue-500 to-cyan-400",
      ring: "group-hover:ring-blue-500/30",
    },
    {
      title: "Collaboration",
      description: "Building a community of shared knowledge.",
      accent: "bg-teal-500",
      glow: "group-hover:shadow-teal-500/25",
      badge: "from-teal-500 to-emerald-400",
      ring: "group-hover:ring-teal-500/30",
    },
    {
      title: "Excellence",
      description: "Striving for the highest technical standards.",
      accent: "bg-amber-500",
      glow: "group-hover:shadow-amber-500/25",
      badge: "from-amber-500 to-orange-400",
      ring: "group-hover:ring-amber-500/30",
    },
    {
      title: "Leadership",
      description: "Forging the next generation of tech leaders.",
      accent: "bg-purple-500",
      glow: "group-hover:shadow-purple-500/25",
      badge: "from-purple-500 to-pink-500",
      ring: "group-hover:ring-purple-500/30",
    },
  ],
};

export const OFFERINGS = {
  label: "WHAT WE OFFER",
  title: "Programs & Activities",
  programs: [
    {
      title: "Technical Workshops",
      description:
        "Hands-on sessions on modern stacks, tools, and industry practices.",
      tag: "Hands-on",
      stripe: "from-blue-500 via-cyan-400 to-blue-600",
      tint: "from-blue-500/10 to-transparent",
    },
    {
      title: "Guest Lectures",
      description:
        "Insights and mentorship from industry veterans and researchers.",
      tag: "Industry",
      stripe: "from-violet-500 via-purple-400 to-fuchsia-500",
      tint: "from-violet-500/10 to-transparent",
    },
    {
      title: "Hackathons",
      description:
        "Build solutions to real problems, compete, and grow with your team.",
      tag: "Compete",
      stripe: "from-pink-500 via-rose-400 to-orange-500",
      tint: "from-pink-500/10 to-transparent",
    },
    {
      title: "Research",
      description:
        "Contribute to papers, projects, and IEEE-aligned innovation.",
      tag: "Publish",
      stripe: "from-emerald-500 via-teal-400 to-cyan-500",
      tint: "from-emerald-500/10 to-transparent",
    },
    {
      title: "Networking",
      description:
        "Connect with peers, alumni, and professionals across domains.",
      tag: "Community",
      stripe: "from-amber-500 via-yellow-400 to-orange-400",
      tint: "from-amber-500/10 to-transparent",
    },
    {
      title: "Certifications",
      description:
        "Validate skills through IEEE-aligned learning pathways.",
      tag: "Credentials",
      stripe: "from-indigo-500 via-purple-400 to-blue-500",
      tint: "from-indigo-500/10 to-transparent",
    },
  ],
};

export const TIMELINE = {
  label: "LEGACY OF SUCCESS",
  title: "Our Milestones",
  entries: [
    {
      year: "2025",
      title: "National Hackathon Winner",
      description:
        "First place in All-India Code Fest among 500+ teams.",
    },
    {
      year: "2024",
      title: "Best Student Branch Award",
      description:
        "Recognised for outstanding activity and member engagement.",
    },
    {
      year: "2022",
      title: "Research Excellence",
      description:
        "Published 15+ papers at IEEE international conferences.",
    },
  ],
};

export const CTA = {
  label: "READY?",
  title: "Shape the future with us",
  description:
    "Join a community that values innovation and impact. Your journey with IEEE RGIPT starts here.",
  primaryCta: { label: "Join IEEE RGIPT", href: "/membership" },
  secondaryCta: { label: "Meet the Team", href: "/team" },
};
