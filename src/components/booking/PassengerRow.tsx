"use client";

import { Trash2 } from "lucide-react";
import { Select } from "@/components/ui/Select";

export interface PassengerData {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  seniorCitizen: boolean;
}

interface PassengerRowProps {
  index: number;
  passenger: PassengerData;
  onChange: (id: string, patch: Partial<PassengerData>) => void;
  onRemove: (id: string) => void;
  removable: boolean;
}

export function PassengerRow({
  index,
  passenger,
  onChange,
  onRemove,
  removable,
}: PassengerRowProps) {
  return (
    <div className="grid gap-4 rounded-2xl border border-slate-200 p-5 sm:grid-cols-2 lg:grid-cols-6 lg:items-end">
      <div className="lg:col-span-6 flex items-center justify-between">
        <p className="text-sm font-bold text-sky-700">Passenger {index + 1}</p>
        {removable && (
          <button
            type="button"
            onClick={() => onRemove(passenger.id)}
            aria-label="Remove passenger"
            className="text-slate-400 hover:text-red-500"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5 lg:col-span-2">
        <label className="text-sm font-semibold text-slate-700">Full name</label>
        <input
          required
          placeholder="Full name"
          value={passenger.fullName}
          onChange={(e) => onChange(passenger.id, { fullName: e.target.value })}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700">Phone number</label>
        <input
          required
          type="tel"
          placeholder="+91 98xxxxxxxx"
          value={passenger.phone}
          onChange={(e) => onChange(passenger.id, { phone: e.target.value })}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700">Email</label>
        <input
          required
          type="email"
          placeholder="Email address"
          value={passenger.email}
          onChange={(e) => onChange(passenger.id, { email: e.target.value })}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
        />
      </div>

      <Select
        label="Age"
        value={passenger.age}
        onChange={(e) => onChange(passenger.id, { age: e.target.value })}
      >
        <option value="">Age</option>
        {Array.from({ length: 100 }, (_, i) => i + 1).map((age) => (
          <option key={age} value={age}>
            {age}
          </option>
        ))}
      </Select>

      <div className="flex items-end gap-4">
        <Select
          label="Gender"
          value={passenger.gender}
          onChange={(e) => onChange(passenger.id, { gender: e.target.value })}
        >
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Child</option>
        </Select>
        <label className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-600">
          <input
            type="checkbox"
            checked={passenger.seniorCitizen}
            onChange={(e) => onChange(passenger.id, { seniorCitizen: e.target.checked })}
            className="h-4 w-4 accent-sky-500"
          />
          Senior
        </label>
      </div>
    </div>
  );
}
