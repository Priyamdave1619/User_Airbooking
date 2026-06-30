# SkyRoute Airlines — Next.js Conversion

This is a full conversion of the original **Airbooking** Java/JSP flight‑booking
website into a modern **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**
application, rebuilt with a component-based architecture.

## What changed

- **Stack**: Java EE / JSP / raw JDBC → Next.js App Router, React 19, TypeScript, Tailwind CSS v4.
- **Data**: All MySQL queries (`SELECT * FROM city`, login/registration tables) were
  replaced with typed mock data in `src/lib/data/*.ts`, since this conversion uses
  **mock/static data only** (no backend wired up).
- **Auth**: Login/Registration/Logout are simulated client-side via `AuthContext`
  (`src/context/AuthContext.tsx`), persisted to `localStorage` for demo continuity.
  There is no real password hashing or server-side session — wire up a real auth
  provider (NextAuth, Clerk, your own API) before using this in production.
- **Design**: The original inline-styled, ad-hoc red/blue/pink markup was replaced
  with a consistent navy/sky-blue/amber brand system, defined as Tailwind theme
  tokens in `src/app/globals.css`. The signature element is the elevated
  `.brand-card` (gradient-topped card) used for the booking search, auth forms,
  and feature panels throughout the site.
- **Fonts**: The original brief specified Google's "Poppins" font, but this sandbox
  has no network access to `fonts.googleapis.com`, so the build uses system font
  stacks instead (`--font-display` / `--font-sans` in `globals.css`). To restore
  Poppins + Inter in an environment with internet access, swap these for
  `next/font/google` imports in `src/app/layout.tsx`.

## Pages (all 20 original JSP/HTML pages converted)

| Route | Replaces |
|---|---|
| `/` | `index.jsp` |
| `/login` | `login.jsp` |
| `/register` | `Registration.jsp` |
| `/forgot-password` | `Forgot-password.jsp`, `email_Forgotpassword.jsp` |
| `/logout` | `Logout.jsp` |
| `/search-results` | `booking1.jsp` |
| `/passenger-details` | `passenger_details.jsp` (+ `phone-number country_code.jsp`) |
| `/contact` | `contact.jsp` |
| `/offers` | `offers.jsp` |
| `/travel-info` | `travel info.jsp` |
| `/flying-returns` | `Flying return.jsp` |
| `/manage` | `Manage.jsp` |
| `/economy-class` | `Economy class.jsp` |
| `/newsletter-signup` | `Newsletter Signup.jsp` |
| `/blog`, `/blog/[slug]` | `blog.html`, `single.html` |
| `/destinations` | `destination.html` |
| `/packages` | `package.html` |
| `/testimonials` | `testimonial.html` |

`footer.jsp` became the shared `Footer` component; the repeated navbar markup
became the shared `Navbar` component.

Screen shots:

<img width="1454" height="753" alt="Screenshot 2026-06-30 at 8 04 45 PM" src="https://github.com/user-attachments/assets/5d07fd31-9691-44f6-b6f3-b47e838b6a0f" />
<img width="1454" height="755" alt="Screenshot 2026-06-30 at 8 05 57 PM" src="https://github.com/user-attachments/assets/60b8dac9-b42b-4ce3-9b8b-f9db670a1e3b" />
<img width="1455" height="756" alt="Screenshot 2026-06-30 at 8 06 23 PM" src="https://github.com/user-attachments/assets/1992c3c6-7797-4c31-a205-5b0c036e9d1a" />
<img width="1452" height="757" alt="Screenshot 2026-06-30 at 8 07 29 PM" src="https://github.com/user-attachments/assets/1820f286-d201-4e35-9307-c81042d16e76" />
<img width="1453" height="713" alt="Screenshot 2026-06-30 at 8 11 27 PM" src="https://github.com/user-attachments/assets/363888d6-b6c0-4744-985f-12ccbd98785c" />


## Component architecture

```
src/
  app/                  routes (one folder per page)
  components/
    layout/             Navbar, Footer, BackToTop, PageShell
    home/                HeroCarousel, FeatureGrid, TrustStats, AboutSection, DestinationGrid
    booking/             BookingSearchCard, FlightResultCard, PassengerRow, TripTypeToggle
    auth/                AuthCard, TextField, PasswordField
    ui/                  Button, Select, Container, SectionHeading, Badge, PageHeader
  context/
    AuthContext.tsx      mock auth state
  lib/
    data/                mock data replacing SQL queries
    utils.ts
  types/                 shared TypeScript interfaces
```

## Notable behavior changes / simplifications

- **Economy Class page** (`/economy-class`) now reuses the same `FlightResultCard`
  component as `/search-results`, filtered to Economy fares, instead of duplicating
  near-identical markup as the original `Economy class.jsp` did.
- **Flying Returns** (`/flying-returns`) is rebuilt as a loyalty-program page
  (tiers + a miles-estimate tool) rather than duplicating the home page's flight
  search form, which is what the original page did almost verbatim.
- **"Brand partner" marquee** on the homepage (originally pulling unrelated
  `debounce.io` logos like Siemens/Samsung from an external CDN) was replaced with
  a relevant "trusted by travelers" stats strip.
- Generic Bootstrap-template lorem-ipsum copy (blog posts, testimonials, travel
  packages) was replaced with original airline-relevant copy.

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # run the production build
```

## Next steps if you want this production-ready

1. Replace `AuthContext` with real authentication (NextAuth.js, Clerk, or a custom
   API + database).
2. Replace `src/lib/data/*.ts` with real API calls / a database (Postgres + Prisma
   is a common pairing with Next.js).
3. Re-enable Google Fonts (Poppins/Inter) via `next/font/google` once deployed
   somewhere with normal internet access.
4. Add real payment processing to the passenger-details → booking confirmation flow.

## Account & Booking Management Module (Payment, Seat Map, Web Check-In)

This adds a full booking lifecycle on top of the original page conversion:

```
Search results → Seat selection → Passenger details → Payment → Check-in → Boarding pass
```

### New routes

| Route | Purpose |
|---|---|
| `/seat-selection` | Interactive aircraft seat map, real-time seat holds |
| `/payment` | Card / UPI / Net Banking / Wallet payment portal |
| `/check-in` | PNR lookup → verify → seat change → boarding pass |

### "Real-time" shared store

Since there's still no real backend, `src/lib/store/db.ts` implements a small
localStorage-backed store that behaves like a shared database:

- **Bookings** are keyed by PNR and persist across refreshes.
- **Seat locks** have a 5-minute TTL, the same way a real airline reservation
  hold expires if you abandon checkout.
- Writes broadcast a `CustomEvent` (same tab) and rely on the native
  `storage` event (other tabs/windows) so **two browser tabs on the same
  flight see each other's seat selections live** — open `/seat-selection`
  for the same flight in two tabs to see a seat go from available → held by
  another passenger without refreshing.
- `src/hooks/useSessionId.ts` gives each tab a separate `sessionStorage`
  identity so the app can tell "seats I'm holding" apart from "seats someone
  else just grabbed," which is what prevents double-booking.

### Payment Portal (`/payment`)

- Card, UPI, Net Banking, and Wallet tabs, each with their own
  validation rules.
- A 2.2s simulated processing delay with a full-screen loading overlay
  (`ProcessingOverlay`) — closing/refreshing mid-payment is discouraged the
  same way a real gateway would.
- **Demo trick**: enter a card number ending in `0000` to see the failure
  screen and retry flow; any other valid-looking card succeeds.
- On success, a `Transaction` record is saved and the `Booking` status flips
  to `confirmed`. A real PDF receipt can be downloaded via `jsPDF`
  (`src/lib/pdf/generateReceipt.ts`).

### Seat Map (`src/components/seatmap/`)

- `buildSeatMap()` (`src/lib/store/seatMapGenerator.ts`) generates a
  deterministic, per-flight aircraft layout (wide-body 777/A380 vs.
  narrow-body A320/A330) with First/Business/Premium/Economy sections and
  exit rows, seeded so the same flight ID always produces the same layout.
- Seat status colors: available (white), selected (sky blue), occupied
  (grey), held by another passenger (pulsing amber) — see `SeatLegend`.
- Reused in both the booking flow (`/seat-selection`) and web check-in
  (`/check-in`, seat-change step) — one component, two contexts.

### Web Check-In (`/check-in`)

- Look up by PNR + last name (`PnrLookupForm`).
- Verifies the booking is paid (`confirmed`/`checked_in`, not
  `pending_payment`) before allowing check-in.
- Lets each passenger pick/change a seat using the same live `SeatMap`.
- On confirmation, generates one boarding pass per passenger
  (`BoardingPassCard`) with a real downloadable PDF
  (`src/lib/pdf/generateBoardingPass.ts`).

### Known simplifications (mock-backend constraints)

- No real card/UPI/bank network calls — payments are simulated client-side.
- "Other passengers" occupying seats are seeded once per flight
  (`ensureSeedData`) so the seat map doesn't look artificially empty; this
  isn't a live multi-user backend, just localStorage shared across tabs in
  *your* browser.
- Seat locks expire after 5 minutes (`SEAT_LOCK_TTL_MS` in `db.ts`) — tune
  this if you want a longer/shorter hold window.
