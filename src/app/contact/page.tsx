"use client";

import { FormEvent, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <PageShell>
      <PageHeader title="Contact" />

      <Container className="py-16">
        <SectionHeading
          eyebrow="Contact"
          title="Contact us for any query"
          description="Feedback, complaints, or questions about an upcoming trip — we read every message."
        />

        <div className="mx-auto mt-10 grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                <MapPin size={20} />
              </div>
              <div>
                <p className="font-semibold text-navy-900">Office</p>
                <p className="text-sm text-slate-600">Adajan, Surat, Gujarat, India</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                <Phone size={20} />
              </div>
              <div>
                <p className="font-semibold text-navy-900">Phone</p>
                <p className="text-sm text-slate-600">+91 982-407-897</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                <Mail size={20} />
              </div>
              <div>
                <p className="font-semibold text-navy-900">Email</p>
                <p className="text-sm text-slate-600">airlinesflightcontact@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="brand-card p-6 sm:p-8">
            {submitted ? (
              <div className="py-10 text-center">
                <h3 className="text-xl font-bold text-navy-900">Message sent</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Thanks for reaching out — our team typically replies within one
                  business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    required
                    placeholder="Your name"
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Your email"
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <input
                  required
                  placeholder="Subject"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
                <textarea
                  required
                  rows={5}
                  placeholder="Message"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
                <Button type="submit" size="lg" className="self-center">
                  Send message
                </Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </PageShell>
  );
}
