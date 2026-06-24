import { Seat, SeatTier } from "@/types";

interface RowConfig {
  row: number;
  tier: SeatTier;
  priceInr: number;
  isExitRow?: boolean;
  cols: string[];
  aisleAfter: string[]; // columns after which an aisle gap renders
}

interface AircraftLayout {
  aircraft: string;
  rows: RowConfig[];
}

const WIDE_BODY_LAYOUT: AircraftLayout = {
  aircraft: "Boeing 777 / Airbus A380",
  rows: [
    // First class
    { row: 1, tier: "first", priceInr: 45000, cols: ["A", "C", "D", "F"], aisleAfter: ["C"] },
    { row: 2, tier: "first", priceInr: 45000, cols: ["A", "C", "D", "F"], aisleAfter: ["C"] },
    // Business class
    { row: 4, tier: "business", priceInr: 22000, cols: ["A", "C", "D", "F", "H", "K"], aisleAfter: ["C", "F"] },
    { row: 5, tier: "business", priceInr: 22000, cols: ["A", "C", "D", "F", "H", "K"], aisleAfter: ["C", "F"] },
    { row: 6, tier: "business", priceInr: 22000, cols: ["A", "C", "D", "F", "H", "K"], aisleAfter: ["C", "F"] },
    // Premium economy / exit row
    {
      row: 10,
      tier: "premium",
      priceInr: 8500,
      isExitRow: true,
      cols: ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"],
      aisleAfter: ["C", "F"],
    },
    { row: 11, tier: "premium", priceInr: 6500, cols: ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"], aisleAfter: ["C", "F"] },
    // Economy rows
    ...Array.from({ length: 14 }, (_, i) => ({
      row: 14 + i,
      tier: "economy" as SeatTier,
      priceInr: 0,
      cols: ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"],
      aisleAfter: ["C", "F"],
    })),
    // Rear exit row
    {
      row: 28,
      tier: "economy",
      priceInr: 1500,
      isExitRow: true,
      cols: ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"],
      aisleAfter: ["C", "F"],
    },
  ],
};

const NARROW_BODY_LAYOUT: AircraftLayout = {
  aircraft: "Airbus A330 / A320",
  rows: [
    { row: 1, tier: "business", priceInr: 18000, cols: ["A", "C", "D", "F"], aisleAfter: ["C"] },
    { row: 2, tier: "business", priceInr: 18000, cols: ["A", "C", "D", "F"], aisleAfter: ["C"] },
    {
      row: 5,
      tier: "premium",
      priceInr: 5000,
      isExitRow: true,
      cols: ["A", "B", "C", "D", "E", "F"],
      aisleAfter: ["C"],
    },
    ...Array.from({ length: 16 }, (_, i) => ({
      row: 6 + i,
      tier: "economy" as SeatTier,
      priceInr: 0,
      cols: ["A", "B", "C", "D", "E", "F"],
      aisleAfter: ["C"],
    })),
    {
      row: 22,
      tier: "economy",
      priceInr: 1200,
      isExitRow: true,
      cols: ["A", "B", "C", "D", "E", "F"],
      aisleAfter: ["C"],
    },
  ],
};

function pickLayout(aircraft: string): AircraftLayout {
  return /777|a380/i.test(aircraft) ? WIDE_BODY_LAYOUT : NARROW_BODY_LAYOUT;
}

function isWindowCol(cols: string[], col: string) {
  return col === cols[0] || col === cols[cols.length - 1];
}

function isAisleCol(cols: string[], col: string, aisleAfter: string[]) {
  return aisleAfter.includes(col);
}

/** Deterministic pseudo-random generator seeded by flight id so the same
 * flight always produces the same layout, but different flights vary. */
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return () => {
    h = (h * 9301 + 49297) % 233280;
    return Math.abs(h) / 233280;
  };
}

export function buildSeatMap(flightId: string, aircraft: string): Seat[] {
  const layout = pickLayout(aircraft);
  const rand = seededRandom(flightId);
  const seats: Seat[] = [];

  for (const rowConfig of layout.rows) {
    for (const col of rowConfig.cols) {
      const label = `${rowConfig.row}${col}`;
      // Sprinkle in some pre-occupied seats so the map feels alive.
      const preOccupiedChance = rowConfig.tier === "economy" ? 0.28 : 0.15;
      const seedOccupied = rand() < preOccupiedChance;

      seats.push({
        id: label,
        row: rowConfig.row,
        col,
        label,
        tier: rowConfig.tier,
        priceInr: rowConfig.priceInr,
        isExitRow: Boolean(rowConfig.isExitRow),
        isWindow: isWindowCol(rowConfig.cols, col),
        isAisle: isAisleCol(rowConfig.cols, col, rowConfig.aisleAfter),
        status: seedOccupied ? "occupied" : "available",
      });
    }
  }

  return seats;
}

export function getAircraftLabel(aircraft: string): string {
  return pickLayout(aircraft).aircraft;
}

export function getRowLayout(aircraft: string): RowConfig[] {
  return pickLayout(aircraft).rows;
}
