export interface City {
  code: string;
  name: string;
  country: string;
}

export type TravelClass = "Economy" | "Business" | "First";

export interface FlightSegment {
  airlineCode: string;
  flightNumber: string;
  aircraft: string;
}

export interface FlightOffer {
  id: string;
  fromCode: string;
  toCode: string;
  duration: string;
  departTime: string;
  arriveTime: string;
  stops: number;
  stopLabel: string;
  segments: FlightSegment[];
  travelClass: TravelClass;
  fareName: string;
  priceInr: number;
  baggage: string;
  handBaggage: string;
  seatSelection: string;
  upgradeToFirst: string;
  changeFee: string;
  refundFee: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  cityCount: number;
  image: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  image: string;
  author: string;
  date: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  quote: string;
}

export interface TravelPackage {
  id: string;
  title: string;
  location: string;
  image: string;
  priceInr: number;
  nights: number;
  rating: number;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  validTill: string;
  code: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  // Extended profile fields
  phone?: string;
  gender?: "Male" | "Female" | "Other" | "Prefer not to say";
  dateOfBirth?: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiry?: string;
  passportCountry?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  avatarUrl?: string;
  // Password (hashed in real app, plain for demo)
  passwordHash?: string;
  createdAt?: number;
}

/* ---------------- Seat Map ---------------- */

export type SeatStatus = "available" | "occupied" | "selected" | "locked";
export type SeatTier = "economy" | "premium" | "business" | "first";

export interface Seat {
  id: string;
  row: number;
  col: string;
  label: string;
  tier: SeatTier;
  priceInr: number;
  isExitRow: boolean;
  isWindow: boolean;
  isAisle: boolean;
  status: SeatStatus;
  lockedAt?: number;
  lockedBy?: string;
  occupiedBy?: string;
}

export interface SeatLock {
  flightId: string;
  seatId: string;
  lockedBy: string;
  lockedAt: number;
}

/* ---------------- Booking ---------------- */

export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "checked_in"
  | "cancelled";

export interface BookingPassenger {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  seniorCitizen: boolean;
  seatId: string | null;
  checkedIn: boolean;
}

export interface Booking {
  pnr: string;
  flightId: string;
  passengers: BookingPassenger[];
  status: BookingStatus;
  contactEmail: string;
  contactPhone: string;
  createdAt: number;
  totalAmount: number;
  transactionId: string | null;
}

/* ---------------- Payment ---------------- */

export type PaymentMethod = "card" | "upi" | "netbanking" | "wallet";
export type PaymentStatus = "idle" | "processing" | "success" | "failed";

export interface Transaction {
  id: string;
  pnr: string;
  method: PaymentMethod;
  amount: number;
  status: "success" | "failed";
  createdAt: number;
  methodLabel: string;
  referenceId: string;
}

/* ---------------- Check-in / Boarding Pass ---------------- */

export interface BoardingPassData {
  pnr: string;
  passengerName: string;
  flightId: string;
  fromCode: string;
  toCode: string;
  seatLabel: string;
  travelClass: TravelClass;
  gate: string;
  boardingTime: string;
  departTime: string;
  seq: number;
}

/* ---------------- OTP ---------------- */

export type OtpPurpose =
  | "registration"
  | "password_reset"
  | "email_verification"
  | "mobile_verification";

export interface OtpRecord {
  code: string;
  purpose: OtpPurpose;
  target: string; // email or phone
  createdAt: number;
  attempts: number;
  verified: boolean;
}
