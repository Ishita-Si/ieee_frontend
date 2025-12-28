"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { 
  Calendar, 
  Zap, 
  Users, 
  Code, 
  Trophy, 
  Target, 
  Clock, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  X as XIcon, 
  Sparkles, 
  Search,
  Filter,
  Share2,
  ExternalLink
} from 'lucide-react';
// import Link from 'next/link'; // Using <a> for standalone compatibility

// --- Dummy Data with Images ---
export const EVENTS_DATA = [
  {
    id: '1',
    category: 'Competitions',
    date: 'Nov 03, 2025',
    time: '10:00 AM',
    location: 'Computer Lab',
    difficulty: 'Advanced',
    title: 'CODEQUEST 2025',
    description: 'Gear up with your coding skills for CODEQUEST 2025. Compete for IIT Bombay TECHFEST spots.',
    fullDescription: 'CODEQUEST 2025 is a premier coding competition designed to test your algorithmic thinking and programming skills. Participants will solve challenging problems on HackerRank platform. Top performers will get direct entry to IIT Bombay TECHFEST.',
    language: 'C++',
    seatsLimited: true,
    totalSeats: 150,
    registeredSeats: 142,
    image: '/images/posters/10.png',
    requirements: ['HackerRank Account', 'Laptop', 'C++ Knowledge'],
    prizes: ['₹10,000 First Prize', 'TechFest Entry', 'Certificates']
  },
  {
    id: '2',
    category: 'Hackathons',
    date: 'Nov 12-13, 2025',
    time: '48 Hours',
    location: 'Auditorium',
    difficulty: 'Intermediate',
    title: 'Hack RGIPT 2025',
    description: 'Flagship hackathon under Urjotsav. Build innovative solutions in 48 hours of non-stop coding.',
    fullDescription: 'Hack RGIPT 2025 is a 48-hour hackathon where teams of 2-4 members will build innovative solutions to real-world problems. Includes mentorship, food, and swag.',
    language: 'Any',
    seatsLimited: true,
    totalSeats: 200,
    registeredSeats: 134,
    image: '/images/posters/13.png',
    requirements: ['Team (2-4)', 'Laptop', 'GitHub'],
    prizes: ['₹25,000 Winner', 'Internship Opps', 'Swag Kits']
  },
  {
    id: '3',
    category: 'Series',
    date: 'Oct 24-27, 2025',
    time: '2:00 PM',
    location: 'Robotics Lab',
    difficulty: 'Beginner',
    title: 'RoboQuest Series',
    description: 'Hands-on robotics challenge featuring Line Follower & Obstacle Avoidance bots.',
    fullDescription: 'A 4-day robotics bootcamp taking you from Arduino basics to PID control. Build your own bot from scratch with provided kits.',
    language: 'Arduino',
    seatsLimited: false,
    totalSeats: 100,
    registeredSeats: 45,
    image: '/images/posters/14.png',
    requirements: ['None'],
    prizes: ['Best Bot Award', 'Certificates']
  },
  {
    id: '4',
    category: 'Workshops',
    date: 'Oct 15, 2025',
    time: '10:00 AM',
    location: 'Seminar Hall',
    difficulty: 'Beginner',
    title: 'Full Stack Workshop',
    description: 'Learn modern web development with React and TypeScript. Build your first app.',
    fullDescription: 'Comprehensive workshop covering React, Node.js, and MongoDB. By the end of the day, you will have a deployed application.',
    language: 'JS/TS',
    seatsLimited: true,
    totalSeats: 50,
    registeredSeats: 50,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
    requirements: ['VS Code', 'Node.js'],
    prizes: ['Best Project', 'Udemy Coupons']
  },
  {
    id: '5',
    category: 'Workshops',
    date: 'Oct 20, 2025',
    time: '2:00 PM',
    location: 'Lab 3',
    difficulty: 'Intermediate',
    title: 'ML Bootcamp',
    description: 'Deep dive into ML algorithms, neural networks, and practical applications.',
    fullDescription: 'Master the basics of Machine Learning with Python. We will cover SciKit-Learn, Pandas, and an intro to PyTorch.',
    language: 'Python',
    seatsLimited: true,
    totalSeats: 40,
    registeredSeats: 28,
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop',
    requirements: ['Python Basics', 'Laptop'],
    prizes: ['Best Model', 'Certificates']
  },
  {
    id: '6',
    category: 'Competitions',
    date: 'Nov 05, 2025',
    time: '11:00 AM',
    location: 'Online',
    difficulty: 'Intermediate',
    title: 'CodeChef Monthly',
    description: 'Monthly coding contest. Solve algorithmic challenges and improve your rating.',
    fullDescription: 'Standard competitive programming contest. 5 problems, 3 hours. Great practice for ICPC.',
    language: 'Any',
    seatsLimited: false,
    totalSeats: 500,
    registeredSeats: 234,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
    requirements: ['CodeChef Account'],
    prizes: ['Global Ranking', 'Rating Points']
  },
  {
    id: '7',
    category: 'Competitions',
    date: 'Jan 01-09, 2025',
    time: '10:00 AM',
    location: 'Online',
    difficulty: 'Intermediate',
    title: 'Data Visualisation Challenge 2.0',
    description: 'A theme-anchored, case-driven data visualization challenge. Navigate real-world datasets across healthcare, agriculture, and urban infrastructure.',
    fullDescription: 'Data Visualisation Challenge 2.0 is a competition where participants analyze datasets and create innovative, insightful visualizations. Use tools like Tableau, Power BI, Python (Matplotlib/Seaborn), or D3.js to tell compelling data stories. Winners will be judged on creativity, clarity, and impact.',
    language: 'Any',
    seatsLimited: true,
    totalSeats: 100,
    registeredSeats: 23,
    expectedParticipants: 77,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    requirements: ['Data Analysis Tool', 'Laptop', 'Basic Data Skills'],
    prizes: ['₹15,000 First Prize', 'Certificates', 'Portfolio Showcase'],
    route: '/events/data-visualization-challenge-2'
  }
];

// --- New Past Events Data ---
const PAST_EVENTS = [
  {
    id: 'p1',
    title: 'KodeCurrent',
    category: 'Hackathon',
    date: 'Sept 2024',
    description: 'A 24-hour hackathon solving campus problems.',
    image: 'https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'p2',
    title: 'RoboQuest',
    category: 'Competition',
    date: 'Aug 2024',
    description: 'Line follower and maze solver robotics championship.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'p3',
    title: 'CS Workshop',
    category: 'Workshop',
    date: 'July 2024',
    description: 'Hands-on session on Git, GitHub and Open Source.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'p4',
    title: 'GATE Series',
    category: 'Seminar',
    date: 'June 2024',
    description: 'Expert guidance on cracking GATE CSE/ECE exams.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'p5',
    title: 'CodeQuest',
    category: 'Competition',
    date: 'May 2024',
    description: 'Competitive programming contest on HackerRank.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'p6',
    title: 'Webinars',
    category: 'Webinar',
    date: 'April 2024',
    description: 'Series of webinars on AI, Blockchain and Cloud Computing.',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop'
  }
];

const CATEGORIES = [
  { name: 'All', icon: Sparkles },
  { name: 'Competitions', icon: Trophy },
  { name: 'Hackathons', icon: Code },
  { name: 'Workshops', icon: Users },
  { name: 'Series', icon: Target }
];

const EventCard = ({ event, onClick, index }) => {
  const isFull = event.seatsLimited && event.registeredSeats >= event.totalSeats;
  const percentage = Math.round((event.registeredSeats / event.totalSeats) * 100);

  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col h-full bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/30"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-black/50 backdrop-blur-md border border-white/10 rounded-md">
            {event.category}
          </span>
        </div>
        
        <div className="absolute top-3 right-3 z-20">
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md border ${
            event.difficulty === 'Advanced' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
            event.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
            'bg-green-500/20 text-green-300 border-green-500/30'
          }`}>
            {event.difficulty}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-5 relative z-20">
        <div className="flex items-center justify-between mb-3 text-xs font-medium text-white/50">
          <div className="flex items-center gap-1.5 text-purple-300">
            <Calendar className="w-3.5 h-3.5" />
            {event.date}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {event.time}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
          {event.title}
        </h3>

        <p className="text-sm text-white/60 line-clamp-2 mb-6 flex-grow">
          {event.description}
        </p>

        {/* Stats / Footer */}
        <div className="mt-auto space-y-4">
          {event.seatsLimited && (
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/40">
                  {isFull ? 'Registration Closed' : 'Seats Filling Fast'}
                </span>
                <span className={isFull ? 'text-red-400' : 'text-purple-300'}>
                  {event.registeredSeats}/{event.totalSeats}
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${isFull ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex -space-x-2">
              {[1,2,3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-white/10 border border-black flex items-center justify-center text-[8px] text-white">
                  <Users className="w-3 h-3" />
                </div>
              ))}
              <div className="w-6 h-6 rounded-full bg-[#1a1a1a] border border-black flex items-center justify-center text-[8px] text-white font-bold">
                +{event.expectedParticipants}
              </div>
            </div>
            
            <button className="p-2 rounded-full bg-white text-black hover:bg-purple-400 hover:text-white transition-all transform group-hover:rotate-45">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventModal = ({ event, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`} 
        onClick={handleClose}
      />
      
      <div className={`relative w-full max-w-4xl bg-[#090909] border border-white/10 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        
        {/* Modal Content */}
        <div className="grid md:grid-cols-5 h-[85vh] md:h-auto overflow-y-auto md:overflow-hidden">
          
          {/* Visual Side */}
          <div className="md:col-span-2 relative h-64 md:h-auto">
            <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/40 to-transparent" />
            
            <button 
              onClick={handleClose}
              className="absolute top-4 left-4 p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all"
            >
              <XIcon className="w-5 h-5" />
            </button>

            <div className="absolute bottom-6 left-6 right-6">
              <span className="px-3 py-1 text-xs font-bold bg-purple-500 text-white rounded-full mb-3 inline-block">
                {event.category}
              </span>
              <h2 className="text-3xl font-bold text-white leading-tight mb-2">{event.title}</h2>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <MapPin className="w-4 h-4 text-purple-400" />
                {event.location}
              </div>
            </div>
          </div>

          {/* Information Side */}
          <div className="md:col-span-3 p-6 md:p-8 flex flex-col h-full overflow-y-auto bg-[#090909]">
            <div className="space-y-8">
              
              {/* Key Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 text-purple-300 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Date</span>
                  </div>
                  <p className="text-white font-medium">{event.date}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 text-blue-300 mb-1">
                    <Code className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Language</span>
                  </div>
                  <p className="text-white font-medium">{event.language}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  About Event
                </h3>
                <p className="text-white/60 leading-relaxed text-sm">
                  {event.fullDescription}
                </p>
              </div>

              {/* Requirements List */}
              {event.requirements && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Requirements</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.requirements.map((req, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Prizes */}
              {event.prizes && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    Prizes & Perks
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                    {event.prizes.map((prize, idx) => (
                      <li key={idx} className="text-sm text-purple-200/80 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        {prize}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sticky Footer Action */}
            <div className="mt-8 pt-6 border-t border-white/10 flex gap-4">
              <button 
                className="flex-1 py-3.5 rounded-xl bg-white text-black font-bold hover:bg-purple-400 hover:text-white transition-colors flex items-center justify-center gap-2 group"
                onClick={() => {
                  if (!authService.isAuthenticated()) {
                    router.push(`/signin?redirect=${selectedEvent.route || `/events#${selectedEvent.id}`}`);
                    return;
                  }
                  if (selectedEvent.route) {
                    router.push(selectedEvent.route);
                  } else {
                    alert("Registration Logic Here");
                  }
                }}
              >
                Register Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-4 py-3.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventsPage = ({ isOpen, onClose, isFullPage = false }) => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const filteredEvents = EVENTS_DATA.filter(event => {
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEventClick = (event) => {
    if (!authService.isAuthenticated()) {
      router.push(`/signin?redirect=${event.route || '/events'}`);
      return;
    }
    if (event.route) {
      router.push(event.route);
    } else {
      setSelectedEvent(event);
    }
  };

  if (!isFullPage && !isOpen) return null;

  return (
    <div className={`${isFullPage ? 'min-h-screen' : 'fixed inset-0 z-[50] overflow-y-auto'} bg-black text-white font-sans selection:bg-purple-500/30`}>
      
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-purple-900/20 blur-[120px] opacity-50" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/20 blur-[120px] opacity-30" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        
        {/* Header Section */}
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-[1px] bg-purple-500"></span>
              <span className="text-purple-400 text-sm font-bold tracking-widest uppercase">IEEE Student Branch</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-4">
              Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Events</span>
            </h1>
            <p className="text-white/50 max-w-xl text-lg">
              Discover workshops, hackathons, and competitions designed to level up your technical prowess.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-purple-500/50 transition-all"
              />
            </div>
            {onClose && !isFullPage && (
              <button 
                onClick={onClose}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            )}
            {isFullPage && (
              <a 
                href="/"
                className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-purple-400 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </a>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105' 
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </button>
            )
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredEvents.map((event, index) => (
            <EventCard 
              key={event.id} 
              event={event} 
              index={index}
              onClick={() => handleEventClick(event)} 
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="py-32 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
            {/* ... existing empty state content ... */}
          </div>
        )}

        {/* --- PAST EVENTS SECTION --- */}
        <div className="mt-32 border-t border-white/10 pt-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Past Highlights</h2>
              <p className="text-white/50">A glimpse into our previous successful events.</p>
            </div>
            <button className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 text-sm font-medium transition-colors">
              View All Archives
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PAST_EVENTS.map((event, idx) => (
              <div 
                key={event.id}
                className="group relative bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300"
              >
                <div className="relative h-40 overflow-hidden">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-500 z-10" />
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 z-20">
                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur border border-white/10 rounded text-white/80">
                      {event.date}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xs font-medium text-purple-400 mb-1">{event.category}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                  <p className="text-sm text-white/50 line-clamp-2">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Detail Modal */}
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />

    </div>
  );
};

export default EventsPage;