'use client';

import { motion } from 'motion/react';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const events = [
  {
    title: 'Echoes of Crimson',
    category: 'Music Festival',
    date: 'Aug 12, 2024',
    location: 'Central Park Arena',
    image: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=800',
    accent: 'border-crimson',
  },
  {
    title: 'Future Minds Summit',
    category: 'Tech & Education',
    date: 'Sep 05, 2024',
    location: 'Innovation Hub',
    image: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=800',
    accent: 'border-slate-800',
  },
];

const FeaturedEvents = () => {
  const router = useRouter();

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold font-display mb-4">Featured <span className="text-crimson">Showcases</span></h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            A glimpse into the diverse range of events we've brought to life recently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-none overflow-hidden shadow-xl border-b-8 transition-all duration-500 hover:-translate-y-2"
              style={{ borderBottomColor: index === 0 ? '#DC143C' : '#1e293b' }}
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6">
                  <span className={`px-4 py-2 rounded-none text-xs font-bold uppercase tracking-widest bg-white/90 backdrop-blur-sm ${index === 0 ? 'text-crimson' : 'text-slate-800'}`}>
                    {event.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-2xl font-bold font-display mb-2">{event.title}</h4>
                    <div className="flex flex-col gap-2 text-slate-500 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-crimson" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-crimson" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                  <button className="w-12 h-12 rounded-none bg-slate-100 flex items-center justify-center group-hover:bg-crimson group-hover:text-white transition-colors duration-300">
                    <ArrowUpRight size={20} />
                  </button>
                </div>
                
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tickets Available</span>
                  <button className="px-6 py-2 bg-crimson text-white text-xs font-bold uppercase tracking-widest hover:bg-crimson-dark transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button 
            onClick={() => router.push('/register')}
            className="px-10 py-4 rounded-none border-2 border-slate-200 font-bold hover:border-crimson hover:text-crimson transition-all duration-300 cursor-pointer"
          >
            View All Events
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
