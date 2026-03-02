'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Ticket, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-red-50 to-white dark:from-red-950/20 dark:to-background py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
                Discover & Manage{' '}
                <span className="text-[#AC1212]">Amazing Events</span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground">
                EventMate brings together event organizers and attendees in one seamless platform.
                Create, discover, and join events that matter to you.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="bg-[#AC1212] hover:bg-[#8a0f0f]">
                  <Link href="/events">
                    Explore Events
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/register">Create an Event</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground">Why Choose EventMate?</h2>
              <p className="text-muted-foreground">Everything you need to manage and attend events</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#AC1212]/10">
                  <Calendar className="h-8 w-8 text-[#AC1212]" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Easy Event Creation</h3>
                <p className="text-muted-foreground">
                  Create and manage events with our intuitive tools. Set dates, locations, tickets, and more.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#AC1212]/10">
                  <Users className="h-8 w-8 text-[#AC1212]" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Connect with Attendees</h3>
                <p className="text-muted-foreground">
                  Build your audience and engage with attendees before, during, and after events.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#AC1212]/10">
                  <Ticket className="h-8 w-8 text-[#AC1212]" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Seamless Ticketing</h3>
                <p className="text-muted-foreground">
                  Sell tickets effortlessly with secure payment processing and real-time attendance tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* App Description / How It Works */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground">How It Works</h2>
              <p className="text-muted-foreground">Get started in three simple steps</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="relative rounded-lg border bg-background p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#AC1212] text-lg font-bold text-white">
                  1
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Sign Up</h3>
                <p className="text-muted-foreground">
                  Create your free account in seconds. Choose to be an event organizer or attendee.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative rounded-lg border bg-background p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#AC1212] text-lg font-bold text-white">
                  2
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Discover Events</h3>
                <p className="text-muted-foreground">
                  Browse thousands of events across different categories. Find what interests you.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative rounded-lg border bg-background p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#AC1212] text-lg font-bold text-white">
                  3
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Join & Enjoy</h3>
                <p className="text-muted-foreground">
                  Register for events, save your favorites, and get notified about updates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials / Stats */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-[#AC1212]">10K+</div>
                <div className="text-muted-foreground">Events Created</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-[#AC1212]">50K+</div>
                <div className="text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-[#AC1212]">100K+</div>
                <div className="text-muted-foreground">Tickets Sold</div>
              </div>
              <div className="text-center">
                <div className="mb-2 flex justify-center">
                  <div className="flex text-[#AC1212]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#AC1212] py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Ready to Get Started?</h2>
            <p className="mb-8 text-white/80">Join thousands of event organizers and attendees today</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-[#AC1212] hover:bg-white/90">
                <Link href="/register">Sign Up Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
