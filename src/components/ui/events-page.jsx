"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { eventService } from '@/lib/events';
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

// Helper function to check if an event is upcoming or currently happening
// Returns true if event is upcoming or currently ongoing (not completely ended)
export const isEventUpcoming = (dateString) => {
  if (!dateString) return true; // If no date, show it as upcoming
  
  // Parse date string like "Jan 01-09, 2025" or "Nov 03, 2025" or "Dec 2025"
  const parts = dateString.split(',');
  if (parts.length < 2) {
    // Handle format like "Dec 2025" (month and year only)
    const monthYearParts = dateString.trim().split(' ');
    if (monthYearParts.length === 2) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames.indexOf(monthYearParts[0]);
      const year = parseInt(monthYearParts[1]);
      if (month === -1 || isNaN(year)) return true;
      // Get last day of that month - event is upcoming if we haven't passed the last day
      const lastDayOfMonth = new Date(year, month + 1, 0, 23, 59, 59);
      return lastDayOfMonth >= new Date();
    }
    return true;
  }
  
  const year = parseInt(parts[1].trim());
  const monthDay = parts[0].trim();
  
  // Extract month
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let month = -1;
  for (let i = 0; i < monthNames.length; i++) {
    if (monthDay.includes(monthNames[i])) {
      month = i;
      break;
    }
  }
  
  if (month === -1 || isNaN(year)) return true;
  
  // Get the last day of the event (if range, use the end date)
  let day = 1;
  if (monthDay.includes('-')) {
    const dayParts = monthDay.split('-');
    const lastDayPart = dayParts[dayParts.length - 1].trim();
    const dayMatch = lastDayPart.match(/\d+/);
    if (dayMatch) day = parseInt(dayMatch[0]);
  } else {
    const dayMatch = monthDay.match(/\d+/);
    if (dayMatch) day = parseInt(dayMatch[0]);
  }
  
  // Use end of day for comparison (event ends at 23:59:59)
  const eventEndDate = new Date(year, month, day, 23, 59, 59);
  const now = new Date();
  
  // Event is upcoming if it hasn't completely ended (includes currently happening events)
  return eventEndDate >= now;
};

// Helper function to check if timeline date has passed (for backward compatibility)
// Returns true only if the event has completely ended
const isTimelinePast = (dateString) => {
  return !isEventUpcoming(dateString);
};

// --- Events Data (Current & Upcoming) ---
export const EVENTS_DATA = [
  // Bootcamp events are shown via the /events/[slug] dynamic route
  // Add upcoming events here when registration opens
];

// --- Past Events Data ---
const PAST_EVENTS = [
  {
    id: 'codeforher',
    title: 'CodeForHer Hackathon 2025',
    category: 'Hackathon',
    date: 'Jan 2025',
    description: 'An empowering women-in-tech hackathon. Teams built innovative solutions addressing real-world challenges with cash prizes and internship opportunities.',
    image: '/images/posters/6.png'
  },
  {
    id: 'dataviz',
    title: 'Data Visualisation Challenge 2.0',
    category: 'Competition',
    date: 'Jan 2025',
    description: 'A theme-anchored, case-driven data visualization challenge. Navigate real-world datasets across healthcare, agriculture, and urban infrastructure.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop'
  },
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

const EventCard = ({ event, onClick, index, isRegistered = false }) => {
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
            <div className="flex items-center gap-2 text-xs">
              {isRegistered ? (
                <span className="text-green-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Registered
                </span>
              ) : (
                <span className="text-white/40 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  Registration Open
                </span>
              )}
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
  const router = useRouter();
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
                  try {
                    if (event.route) {
                      router.push(event.route);
                    } else {
                      alert("Registration Logic Here");
                    }
                  } catch (error) {
                    console.error('Error in registration click:', error);
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
  const [myRegistrations, setMyRegistrations] = useState([]);

  useEffect(() => {
    setIsLoaded(true);
    fetchMyRegistrations();
  }, []);

  const fetchMyRegistrations = async () => {
    if (!authService.isAuthenticated()) return;
    
    try {
      const result = await eventService.getMyRegistrations();
      if (result.success) {
        setMyRegistrations(result.registrations || []);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  // Check if user is registered for an event
  const isRegisteredForEvent = (eventId, eventRoute, eventSlug) => {
    if (!myRegistrations.length) return false;
    
    // Match by event_slug (most reliable)
    if (eventSlug) {
      return myRegistrations.some(reg => reg.event_slug === eventSlug && reg.status !== 'cancelled');
    }
    
    // Fallback: try to match by route or id
    const slugFromRoute = eventRoute?.split('/').pop();
    return myRegistrations.some(reg => {
      return reg.event_slug === slugFromRoute || 
             reg.event_slug === eventId ||
             (reg.event_name && eventId && reg.event_name.toLowerCase().includes(eventId.toLowerCase()));
    });
  };

  const filteredEvents = EVENTS_DATA.filter(event => {
    // Show all events with open registrations (current and upcoming events)
    // Registration status takes priority over date filtering
    if (!event.registrationOpen) return false;
    
    // Apply category and search filters
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleEventClick = (event) => {
    try {
      if (event.route) {
        router.push(event.route);
      } else {
        setSelectedEvent(event);
      }
    } catch (error) {
      console.error('Error handling event click:', error);
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
          {filteredEvents.map((event, index) => {
            const registered = isRegisteredForEvent(event.id, event.route, event.event_slug);
            return (
              <EventCard 
                key={event.id} 
                event={event} 
                index={index}
                isRegistered={registered}
                onClick={() => handleEventClick(event)} 
              />
            );
          })}
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