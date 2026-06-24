import { City } from "@/types";

export const cities: City[] = [
  { code: "AMD", name: "Ahmedabad", country: "India" },
  { code: "BOM", name: "Mumbai", country: "India" },
  { code: "DEL", name: "Delhi", country: "India" },
  { code: "BLR", name: "Bengaluru", country: "India" },
  { code: "MAA", name: "Chennai", country: "India" },
  { code: "CCU", name: "Kolkata", country: "India" },
  { code: "HYD", name: "Hyderabad", country: "India" },
  { code: "GOI", name: "Goa", country: "India" },
  { code: "DXB", name: "Dubai", country: "UAE" },
  { code: "LHR", name: "London", country: "United Kingdom" },
  { code: "JFK", name: "New York", country: "United States" },
  { code: "EWR", name: "Newark", country: "United States" },
  { code: "SIN", name: "Singapore", country: "Singapore" },
  { code: "SYD", name: "Sydney", country: "Australia" },
  { code: "HKG", name: "Hong Kong", country: "Hong Kong" },
  { code: "CPT", name: "Cape Town", country: "South Africa" },
  { code: "CDG", name: "Paris", country: "France" },
];

export function findCity(code: string): City | undefined {
  return cities.find((c) => c.code === code);
}
