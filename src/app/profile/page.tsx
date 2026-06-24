"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { User } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/Toast";
import {
  User as UserIcon, Mail, Phone, Calendar, Globe, CreditCard,
  MapPin, Camera, Save, Edit3, Shield, CheckCircle,
} from "lucide-react";
import Image from "next/image";

const NATIONALITIES = [
  "Indian", "American", "British", "Canadian", "Australian",
  "German", "French", "Japanese", "Chinese", "Brazilian", "Other",
];

const GENDERS = ["Male", "Female", "Other", "Prefer not to say"] as const;

function InputField({
  label, icon: Icon, value, onChange, disabled, type = "text", placeholder, required,
}: {
  label: string; icon: React.ElementType; value: string; onChange: (v: string) => void;
  disabled: boolean; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Icon size={12} />
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400
          focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100
          disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed transition"
      />
    </div>
  );
}

function SelectField({
  label, icon: Icon, value, onChange, disabled, options,
}: {
  label: string; icon: React.ElementType; value: string; onChange: (v: string) => void;
  disabled: boolean; options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Icon size={12} />
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900
          focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100
          disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed transition"
      >
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    passportNumber: "",
    passportExpiry: "",
    passportCountry: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    setForm({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      gender: user.gender ?? "",
      dateOfBirth: user.dateOfBirth ?? "",
      nationality: user.nationality ?? "",
      passportNumber: user.passportNumber ?? "",
      passportExpiry: user.passportExpiry ?? "",
      passportCountry: user.passportCountry ?? "",
      addressLine1: user.addressLine1 ?? "",
      addressLine2: user.addressLine2 ?? "",
      city: user.city ?? "",
      state: user.state ?? "",
      postalCode: user.postalCode ?? "",
      country: user.country ?? "",
      avatarUrl: user.avatarUrl ?? "",
    });
  }, [user, router]);

  function setField(key: keyof typeof form) {
    return (v: string) => setForm((prev) => ({ ...prev, [key]: v }));
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setForm((prev) => ({ ...prev, avatarUrl: url }));
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!form.firstName.trim() || !form.email.trim()) {
      toast.error("First name and email are required.");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      updateProfile({ ...form, gender: form.gender as User["gender"] });
      setIsSaving(false);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    }, 800);
  }

  function handleCancel() {
    if (!user) return;
    setForm({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      gender: user.gender ?? "",
      dateOfBirth: user.dateOfBirth ?? "",
      nationality: user.nationality ?? "",
      passportNumber: user.passportNumber ?? "",
      passportExpiry: user.passportExpiry ?? "",
      passportCountry: user.passportCountry ?? "",
      addressLine1: user.addressLine1 ?? "",
      addressLine2: user.addressLine2 ?? "",
      city: user.city ?? "",
      state: user.state ?? "",
      postalCode: user.postalCode ?? "",
      country: user.country ?? "",
      avatarUrl: user.avatarUrl ?? "",
    });
    setIsEditing(false);
  }

  const completionFields = [
    form.firstName, form.phone, form.gender, form.dateOfBirth,
    form.nationality, form.passportNumber, form.addressLine1,
  ];
  const completionPct = Math.round(
    (completionFields.filter(Boolean).length / completionFields.length) * 100
  );

  if (!user) return null;

  return (
    <PageShell>
      <div className="bg-slate-50 py-10">
        <Container>
          {/* Page Header */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">Account</p>
              <h1 className="text-2xl font-bold text-navy-900">My Profile</h1>
              <p className="text-sm text-slate-500">Manage your personal information and preferences</p>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="primary" size="sm">
                <Edit3 size={14} />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button onClick={handleCancel} variant="outline" size="sm" disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleSave} variant="primary" size="sm" disabled={isSaving}>
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving…
                    </span>
                  ) : (
                    <>
                      <Save size={14} />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              {/* Avatar Card */}
              <div className="brand-card p-6 text-center">
                <div className="relative mx-auto mb-4 h-24 w-24">
                  {form.avatarUrl ? (
                    <Image
                      src={form.avatarUrl}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="h-24 w-24 rounded-full object-cover ring-4 ring-sky-100"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-sky-600 text-3xl font-bold text-white ring-4 ring-sky-100">
                      {(form.firstName?.[0] ?? "U").toUpperCase()}
                    </div>
                  )}
                  {isEditing && (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-white shadow-md hover:bg-sky-600 transition"
                    >
                      <Camera size={13} />
                    </button>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <p className="font-bold text-navy-900">
                  {form.firstName} {form.lastName}
                </p>
                <p className="text-xs text-slate-500">{form.email}</p>
                {user.createdAt && (
                  <p className="mt-1 text-xs text-slate-400">
                    Member since {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                  </p>
                )}
              </div>

              {/* Profile Completion */}
              <div className="brand-card p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-navy-900">Profile Completion</p>
                  <span className="text-sm font-bold text-sky-600">{completionPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-500"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
                {completionPct < 100 && (
                  <p className="mt-2 text-xs text-slate-400">
                    Complete your profile for a better booking experience.
                  </p>
                )}
                {completionPct === 100 && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                    <CheckCircle size={12} /> Profile is complete!
                  </p>
                )}
              </div>

              {/* Quick Links */}
              <div className="brand-card p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Quick Links</p>
                {[
                  { href: "/my-bookings", label: "My Bookings" },
                  { href: "/payment-history", label: "Payment History" },
                  { href: "/change-password", label: "Change Password" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between py-2 text-sm text-slate-700 hover:text-sky-600 border-b border-slate-100 last:border-0"
                  >
                    {link.label}
                    <span className="text-slate-300">→</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Main Form */}
            <div className="flex flex-col gap-6">
              {/* Personal Info */}
              <div className="brand-card p-6">
                <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-navy-900">
                  <UserIcon size={16} className="text-sky-500" />
                  Personal Information
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField label="First Name" icon={UserIcon} value={form.firstName} onChange={setField("firstName")} disabled={!isEditing} placeholder="John" required />
                  <InputField label="Last Name" icon={UserIcon} value={form.lastName} onChange={setField("lastName")} disabled={!isEditing} placeholder="Doe" />
                  <InputField label="Email Address" icon={Mail} value={form.email} onChange={setField("email")} disabled={!isEditing} type="email" placeholder="john@example.com" required />
                  <InputField label="Mobile Number" icon={Phone} value={form.phone} onChange={setField("phone")} disabled={!isEditing} type="tel" placeholder="+91 9876543210" />
                  <SelectField label="Gender" icon={UserIcon} value={form.gender} onChange={setField("gender")} disabled={!isEditing} options={[...GENDERS]} />
                  <InputField label="Date of Birth" icon={Calendar} value={form.dateOfBirth} onChange={setField("dateOfBirth")} disabled={!isEditing} type="date" />
                  <SelectField label="Nationality" icon={Globe} value={form.nationality} onChange={setField("nationality")} disabled={!isEditing} options={NATIONALITIES} />
                </div>
              </div>

              {/* Passport Info */}
              <div className="brand-card p-6">
                <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-navy-900">
                  <Shield size={16} className="text-sky-500" />
                  Passport & Travel Document
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField label="Passport Number" icon={CreditCard} value={form.passportNumber} onChange={setField("passportNumber")} disabled={!isEditing} placeholder="A1234567" />
                  <InputField label="Passport Expiry Date" icon={Calendar} value={form.passportExpiry} onChange={setField("passportExpiry")} disabled={!isEditing} type="date" />
                  <SelectField label="Issuing Country" icon={Globe} value={form.passportCountry} onChange={setField("passportCountry")} disabled={!isEditing} options={NATIONALITIES} />
                </div>
              </div>

              {/* Address */}
              <div className="brand-card p-6">
                <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-navy-900">
                  <MapPin size={16} className="text-sky-500" />
                  Address
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <InputField label="Address Line 1" icon={MapPin} value={form.addressLine1} onChange={setField("addressLine1")} disabled={!isEditing} placeholder="123 Main Street" />
                  </div>
                  <div className="sm:col-span-2">
                    <InputField label="Address Line 2" icon={MapPin} value={form.addressLine2} onChange={setField("addressLine2")} disabled={!isEditing} placeholder="Apartment, suite, etc." />
                  </div>
                  <InputField label="City" icon={MapPin} value={form.city} onChange={setField("city")} disabled={!isEditing} placeholder="Mumbai" />
                  <InputField label="State / Province" icon={MapPin} value={form.state} onChange={setField("state")} disabled={!isEditing} placeholder="Maharashtra" />
                  <InputField label="Postal Code" icon={MapPin} value={form.postalCode} onChange={setField("postalCode")} disabled={!isEditing} placeholder="400001" />
                  <SelectField label="Country" icon={Globe} value={form.country} onChange={setField("country")} disabled={!isEditing} options={["India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan", "China", "Brazil", "Other"]} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </PageShell>
  );
}
