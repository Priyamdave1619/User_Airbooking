"use client";

import { Suspense, FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthCard } from "@/components/auth/AuthCard";
import { TextField } from "@/components/auth/TextField";
import { Button } from "@/components/ui/Button";

function NewsletterForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  }

  if (subscribed) {
    return (
      <AuthCard title="You're subscribed!" subtitle={`We'll send fare alerts and travel news to ${email}.`}>
        <Link href="/">
          <Button size="lg" className="w-full">
            Back to home
          </Button>
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Newsletter Signup"
      subtitle="Get fare drops, route launches, and Flying Returns offers in your inbox."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <TextField
          id="email"
          label="Email address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" size="lg" className="w-full">
          Sign Up
        </Button>
      </form>
    </AuthCard>
  );
}

export default function NewsletterSignupPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <NewsletterForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
