import { Offer } from "@/types";

export const offers: Offer[] = [
  {
    id: "1",
    title: "Early Bird Economy",
    description: "Book your Economy fare 60 days ahead on any international route and save.",
    discount: "Up to 20% off",
    validTill: "July 31, 2026",
    code: "EARLY20",
  },
  {
    id: "2",
    title: "Business Class Stopover",
    description: "Add a free 24-hour stopover in Dubai on Business class tickets to the UK or Europe.",
    discount: "Free stopover",
    validTill: "August 15, 2026",
    code: "STOPOVER",
  },
  {
    id: "3",
    title: "Family Bundle",
    description: "Travel with 2 or more children and get reduced fares plus free seat selection.",
    discount: "15% off + free seats",
    validTill: "September 30, 2026",
    code: "FAMILY15",
  },
  {
    id: "4",
    title: "Flying Returns Double Miles",
    description: "Earn double Flying Returns miles on all Business and First class bookings.",
    discount: "2x miles",
    validTill: "July 10, 2026",
    code: "DOUBLEMILES",
  },
];
