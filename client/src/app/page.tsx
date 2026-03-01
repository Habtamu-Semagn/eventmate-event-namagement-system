'use client';

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import EventCard from '@/components/EventCard';
import EventFilter from '@/components/EventFilter';
import CreateEventForm from '@/components/CreateEventForm';
import AdminDashboard from '@/components/AdminDashboard';
import { fetchEvents, fetchRegistrations } from '@/lib/api';
import { Event, EventFilters, Registration } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CATEGORIES = [
  { id: 'cultural', name: 'Cultural', icon: '🎭' },
  { id: 'educational', name: 'Educational', icon: '📚' },
  { id: 'social', name: 'Social', icon: '🎉' },
];

const HERO_CATEGORIES = [
  {
    id: 'music',
    name: 'Music & Concert',
    icon: '🎵',
    events: 245,
    color: '#AC1212'
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: '⚽',
    events: 189,
    color: '#1a1a1a'
  },
  {
    id: 'workshop',
    name: 'Workshop & Training',
    icon: '🎓',
    events: 156,
    color: '#EEB42C'
  },
];

const STATS = [
  { number: '1200+', label: 'Events' },
  { number: '5000+', label: 'Happy Attendees' },
  { number: '300+', label: 'Organizers' },
  { number: '50+', label: 'Cities' },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Johnson',
    role: 'Event Organizer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    text: 'EventMate has transformed how I manage my events. The platform is intuitive and the support team is fantastic!'
  },
  {
    name: 'Michael Chen',
    role: 'Regular Attendee',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    text: 'I have discovered so many amazing events through EventMate. It has become my go-to for planning my social calendar.'
  },
  {
    name: 'Emily Rodriguez',
    role: 'First-time User',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    text: 'The booking process was seamless and the events I attended exceeded my expectations. Highly recommend!'
  }
];

type ViewType = 'home' | 'discover' | 'organizer' | 'admin';

function MainApp() {
  const { user, userData, loading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [filters, setFilters] = useState<EventFilters>({ search: '', category: '', location: '' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (user) {
      loadRegistrations();
    }
  }, [user]);

  const loadEvents = async () => {
    try {
      const data = await fetchEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  const loadRegistrations = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const data = await fetchRegistrations(token);
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleFilterChange = (newFilters: EventFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchQuery });
  };

  const handleCategoryClick = (categoryId: string) => {
    setFilters({ ...filters, category: categoryId });
    setCurrentView('discover');
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = !filters.search ||
      event.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.description?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = !filters.category ||
      event.category?.toLowerCase() === filters.category.toLowerCase();
    const matchesLocation = !filters.location ||
      event.location?.city?.toLowerCase().includes(filters.location.toLowerCase());
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const isRegistered = (eventId: string): boolean => {
    return registrations.some(r => r.eventId === eventId && r.status !== 'cancelled');
  };

  const handleRSVP = (eventId: string) => {
    loadRegistrations();
    loadEvents();
  };

  const handleEventCreated = () => {
    loadEvents();
    setCurrentView('organizer');
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-[#180404] to-[#4A0202]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#EEB42C]"></div>
        <p className="mt-4 text-white">Loading Eventmate...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={setCurrentView} />

      <main className="min-h-screen">
        {currentView === 'home' && (
          <div className="animate-fade-in">
            {/* Hero Section with Categories Sidebar */}
            <section className="relative flex min-h-[600px] bg-gradient-to-br from-gray-900 via-gray-800 to-red-900">
              {/* Background Image */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80')] bg-cover bg-center opacity-15"></div>

              <div className="relative z-10 flex w-full">
                {/* Left Side - Hero Content */}
                <div className="flex flex-1 flex-col justify-center px-6 py-16 md:px-12 lg:px-20">
                  <div className="max-w-2xl">
                    <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl">
                      EXPLORE. <span className="text-[#AC1212]">CONNECT.</span> EXPERIENCE.
                    </h1>
                    <p className="mb-8 text-xl text-gray-300 md:text-2xl">
                      Your gateway to unforgettable events
                    </p>

                    {/* Search Box */}
                    <form
                      className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-2xl md:flex-row"
                      onSubmit={handleSearch}
                    >
                      <Input
                        type="text"
                        placeholder="Search events, categories, or locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 rounded-xl border-gray-200 py-6 text-base"
                      />
                      <Button
                        type="submit"
                        className="rounded-xl bg-[#AC1212] px-8 py-6 text-lg font-semibold text-white hover:bg-[#8a0f0f]"
                      >
                        Search
                      </Button>
                    </form>
                  </div>
                </div>

                {/* Right Side - Category Cards */}
                <div className="hidden w-[380px] flex-col justify-center pr-6 lg:flex xl:pr-12">
                  <div className="space-y-4">
                    {HERO_CATEGORIES.map((category) => (
                      <div
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className="group flex cursor-pointer items-center gap-5 rounded-2xl bg-white/10 backdrop-blur-sm p-5 transition-all hover:bg-white/20 hover:scale-[1.02]"
                      >
                        <div
                          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white group-hover:text-[#EEB42C] transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-300">
                            <span className="font-semibold text-white">{category.events}</span> upcoming events
                          </p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-transform group-hover:translate-x-1">
                          →
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Mobile Category Cards - Below Hero */}
            <section className="bg-gray-900 py-8 lg:hidden">
              <div className="mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {HERO_CATEGORIES.map((category) => (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className="group flex cursor-pointer items-center gap-4 rounded-xl bg-white/10 p-4 transition-all hover:bg-white/20"
                    >
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white group-hover:text-[#EEB42C] transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-300">
                          <span className="font-semibold text-white">{category.events}</span> events
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Categories Section */}
            <section className="bg-gray-50 py-16">
              <div className="mx-auto max-w-6xl px-4">
                <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">Browse by Category</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {CATEGORIES.map(cat => (
                    <div
                      key={cat.id}
                      className="group cursor-pointer rounded-2xl bg-white p-8 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                      onClick={() => handleCategoryClick(cat.id)}
                    >
                      <div className="mb-4 text-5xl">{cat.icon}</div>
                      <h3 className="text-xl font-semibold text-gray-900">{cat.name}</h3>
                      <p className="mt-2 text-gray-500">Discover amazing {cat.name.toLowerCase()} events near you</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Featured Events Section */}
            <section className="bg-white py-16">
              <div className="mx-auto max-w-6xl px-4">
                <div className="mb-12 flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
                  <Button
                    variant="outline"
                    className="border-[#AC1212] text-[#AC1212] hover:bg-[#AC1212] hover:text-white"
                    onClick={() => setCurrentView('discover')}
                  >
                    View All
                  </Button>
                </div>

                {loadingEvents ? (
                  <div className="py-8 text-center text-gray-500">Loading events...</div>
                ) : filteredEvents.length === 0 ? (
                  <div className="py-16 text-center text-gray-500">
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">No events found</h3>
                    <p>Be the first to create an event!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredEvents.slice(0, 6).map(event => (
                      <EventCard
                        key={event.id}
                        event={event}
                        isRegistered={isRegistered(event.id)}
                        onRSVP={handleRSVP}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Statistics Section */}
            <section className="bg-[#AC1212] py-16">
              <div className="mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                  {STATS.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="mb-2 text-4xl font-bold text-white md:text-5xl">{stat.number}</div>
                      <div className="text-lg text-white/80">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-gray-50 py-16">
              <div className="mx-auto max-w-6xl px-4">
                <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">What Our Users Say</h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {TESTIMONIALS.map((testimonial, index) => (
                    <div key={index} className="rounded-2xl bg-white p-6 shadow-md">
                      <p className="mb-6 text-gray-600">"{testimonial.text}"</p>
                      <div className="flex items-center gap-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{testimonial.name}</div>
                          <div className="text-sm text-gray-500">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Newsletter Section */}
            <section className="bg-gray-900 py-16">
              <div className="mx-auto max-w-2xl px-4 text-center">
                <h2 className="mb-4 text-3xl font-bold text-white">Stay Updated</h2>
                <p className="mb-8 text-gray-400">Subscribe to our newsletter for the latest events and updates</p>
                <form className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 rounded-xl border-gray-700 bg-gray-800 py-6 text-white placeholder:text-gray-500"
                  />
                  <Button
                    className="rounded-xl bg-[#AC1212] px-8 py-6 text-lg font-semibold text-white hover:bg-[#8a0f0f]"
                  >
                    Subscribe
                  </Button>
                </form>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-950 py-12">
              <div className="mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                  <div>
                    <h3 className="mb-4 text-2xl font-bold text-white">Event<span className="text-[#AC1212]">Mate</span></h3>
                    <p className="text-gray-400">Your gateway to unforgettable events. Connect with people who share your passion.</p>
                  </div>
                  <div>
                    <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="#" className="hover:text-[#AC1212]">Home</a></li>
                      <li><a href="#" className="hover:text-[#AC1212]">Discover</a></li>
                      <li><a href="#" className="hover:text-[#AC1212]">About Us</a></li>
                      <li><a href="#" className="hover:text-[#AC1212]">Contact</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-4 font-semibold text-white">Contact</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li>📍 123 Event Street, NY</li>
                      <li>📧 info@eventmate.com</li>
                      <li>📞 +1 (555) 123-4567</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-4 font-semibold text-white">Follow Us</h4>
                    <div className="flex gap-4">
                      <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-white hover:bg-[#AC1212]">f</a>
                      <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-white hover:bg-[#AC1212]">in</a>
                      <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-white hover:bg-[#AC1212]">X</a>
                    </div>
                  </div>
                </div>
                <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-500">
                  © 2024 EventMate. All rights reserved.
                </div>
              </div>
            </footer>
          </div>
        )}

        {currentView === 'discover' && (
          <div className="animate-fade-in">
            <EventFilter onFilterChange={handleFilterChange} />

            {loadingEvents ? (
              <div className="py-8 text-center text-gray-500">Loading events...</div>
            ) : filteredEvents.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">No events found</h3>
                <p>Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isRegistered={isRegistered(event.id)}
                    onRSVP={handleRSVP}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'organizer' && (
          <div className="animate-fade-in bg-gray-50 py-12 px-8">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">Organizer Dashboard</h2>
            <CreateEventForm onEventCreated={handleEventCreated} />
          </div>
        )}

        {currentView === 'admin' && (
          <div className="animate-fade-in bg-gray-50 py-12 px-8">
            <AdminDashboard />
          </div>
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
