import { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "pack-smarter-for-long-haul-flights",
    title: "How to Pack Smarter for Long-Haul Flights",
    excerpt:
      "A few small changes to how you pack can save you time at check-in and make a 20-hour journey feel a lot shorter.",
    content: [
      "Long-haul travel rewards preparation. The single biggest time-saver at the airport is knowing exactly what's in your hand baggage before you reach security, so keep electronics and liquids in an easily accessible pouch.",
      "Roll rather than fold your clothing. It reduces wrinkles and typically frees up 20-30% more space in a cabin bag, which matters when most of our fares include only one piece of hand luggage.",
      "Finally, split valuables and a change of clothes between your hold and hand baggage. If a bag is ever delayed, you'll still have what you need until it catches up with you.",
    ],
    image: "/images/blog-1.jpg",
    author: "SkyRoute Editorial",
    date: "April 2, 2026",
    category: "Travel Tips",
  },
  {
    id: "2",
    slug: "choosing-economy-business-or-first",
    title: "Economy, Business, or First: How to Choose",
    excerpt:
      "Each cabin is built around a different kind of trip. Here's how to match the fare to the flight, not just the budget.",
    content: [
      "Economy makes sense for most short and medium-haul trips, especially under six hours, where the difference in comfort matters less than the difference in price.",
      "Business class earns its premium on overnight long-haul sectors, where a flat or near-flat seat directly affects how you perform on arrival.",
      "First class is about space and privacy more than speed. If you need to work uninterrupted or simply want the cabin to feel like an extension of a hotel suite, it's worth the upgrade.",
    ],
    image: "/images/blog-2.jpg",
    author: "SkyRoute Editorial",
    date: "March 18, 2026",
    category: "Booking Guide",
  },
  {
    id: "3",
    slug: "getting-the-most-from-flying-returns",
    title: "Getting the Most From Your Flying Returns Miles",
    excerpt:
      "Miles are worth more when they're spent deliberately. A short guide to redemptions that actually pay off.",
    content: [
      "Award seats on long-haul Business routes typically return the highest value per mile, often two to three times what you'd get redeeming for a short Economy hop.",
      "Booking redemptions early in the schedule release window — usually 10 to 11 months out — gives you access to the lowest mile pricing tiers before they're gone.",
      "Pooling miles with a partner or family member before a big trip is usually more efficient than letting a small balance expire unused.",
    ],
    image: "/images/blog-3.jpg",
    author: "SkyRoute Editorial",
    date: "February 27, 2026",
    category: "Loyalty",
  },
];

export function findBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
