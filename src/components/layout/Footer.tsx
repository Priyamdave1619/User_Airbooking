"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";

const socialLinks = [
  { label: "X (Twitter)", initials: "X" },
  { label: "Facebook", initials: "f" },
  { label: "LinkedIn", initials: "in" },
  { label: "Instagram", initials: "ig" },
];

const services = [
  { href: "/", label: "About" },
  { href: "/destinations", label: "Destination" },
  { href: "/travel-info", label: "Travel Info" },
  { href: "/packages", label: "Packages" },
  { href: "/blog", label: "Guides" },
  { href: "/testimonials", label: "Testimonial" },
];

const usefulLinks = [
  { href: "/offers", label: "Offers" },
  { href: "/flying-returns", label: "Flying Returns" },
  { href: "/manage", label: "Manage Booking" },
  { href: "/economy-class", label: "Economy Class" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    window.location.href = `/newsletter-signup?email=${encodeURIComponent(email)}`;
  }

  return (
    <footer className="bg-navy-950 text-slate-300">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/original-logo.png"
              alt="SkyRoute Airlines"
              width={44}
              height={44}
              className="h-11 w-11 rounded-md bg-white object-contain p-1"
            />
            <span className="font-display text-lg font-bold text-white">SkyRoute</span>
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            Compare fares, manage trips, and earn Flying Returns miles on every journey.
          </p>
          <h6 className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-white">
            Follow Us
          </h6>
          <div className="mt-3 flex gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-xs font-bold text-slate-300 transition-colors hover:border-sky-500 hover:text-sky-400"
              >
                {social.initials}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-[0.3em] text-white">
            Our Services
          </h5>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {services.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-sky-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-[0.3em] text-white">
            Useful Links
          </h5>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {usefulLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-sky-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-[0.3em] text-white">
            Contact Us
          </h5>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-sky-400" /> Adajan, Surat, India
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-sky-400" /> +91 982-407-897
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-sky-400" /> airlinesflightcontact@gmail.com
            </li>
          </ul>
          <h6 className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-white">
            Newsletter
          </h6>
          <form onSubmit={handleSubmit} className="mt-3 flex overflow-hidden rounded-full border border-slate-700">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="whitespace-nowrap bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
            >
              Sign Up
            </button>
          </form>
        </div>
      </Container>

      <div className="border-t border-slate-800">
        <Container className="flex flex-col gap-3 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} SkyRoute Airlines. All rights reserved.</p>
          <p>Designed by Priyam Dave</p>
        </Container>
      </div>
    </footer>
  );
}
