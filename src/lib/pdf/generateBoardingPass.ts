import jsPDF from "jspdf";
import { BoardingPassData } from "@/types";
import { findCity } from "@/lib/data/cities";

export function generateBoardingPassPdf(pass: BoardingPassData) {
  // Landscape — wide boarding pass matching the UI card ratio
  const W = 780;
  const H = 310;
  const doc = new jsPDF({ unit: "pt", format: [W, H], orientation: "landscape" });

  // ── Exact UI colours ────────────────────────────────────────────────────────
  const NAVY:    [number,number,number] = [13, 30, 70];    // from-navy-900
  const NAVY_MID:[number,number,number] = [18, 45, 100];   // via-navy-800
  const SKY:     [number,number,number] = [46, 107, 255];  // sky-500 #2e6bff
  const AMBER:   [number,number,number] = [245, 165, 36];  // amber-500 #f5a524
  const WHITE:   [number,number,number] = [255, 255, 255];
  const GHOST:   [number,number,number] = [150, 175, 215]; // white/50 on navy
  const SLATE50: [number,number,number] = [248, 250, 252]; // bg of right stub
  const SLATE400:[number,number,number] = [148, 163, 184]; // label colour
  const NAVY900: [number,number,number] = [11, 37, 69];    // value colour in stub

  const STUB  = 200;          // right white stub width
  const LEFT  = W - STUB;    // left navy panel width
  const PAD   = 36;           // horizontal padding inside panels

  const fromCity = findCity(pass.fromCode);
  const toCity   = findCity(pass.toCode);

  // ═══════════════════════════════════════════════════════════════════════════
  // 1.  LEFT NAVY PANEL
  // ═══════════════════════════════════════════════════════════════════════════

  // Base fill — full rounded rect then square off right side
  doc.setFillColor(...NAVY);
  doc.roundedRect(0, 0, LEFT + 16, H, 16, 16, "F");
  doc.setFillColor(...NAVY);
  doc.rect(LEFT - 4, 0, 20, H, "F"); // flatten right edge

  // ── Top gradient accent bar ─────────────────────────────────────────────────
  // Sky blue portion (~55 %)
  doc.setFillColor(...SKY);
  doc.roundedRect(0, 0, LEFT * 0.55, 6, 8, 0, "F");
  doc.rect(8, 0, LEFT * 0.55 - 8, 6, "F"); // fill the non-rounded part
  // Amber portion (~45 %)
  doc.setFillColor(...AMBER);
  doc.rect(LEFT * 0.55, 0, LEFT * 0.45, 6, "F");

  // ── SKYROUTE / AIRLINES (top-left) ─────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...WHITE);
  doc.text("SKYROUTE", PAD, 38);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...GHOST);
  doc.text("AIRLINES", PAD, 51);

  // ── BOARDING PASS label (top-right of navy panel) ──────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...AMBER);
  doc.text("BOARDING PASS", LEFT - PAD, 38, { align: "right" });

  // ── Route: AMD ──── ✈ ──── EWR ──────────────────────────────────────────────
  const routeY = 140;

  // FROM
  doc.setFont("helvetica", "bold");
  doc.setFontSize(68);
  doc.setTextColor(...WHITE);
  doc.text(pass.fromCode, PAD, routeY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GHOST);
  doc.text((fromCity?.name ?? pass.fromCode).toUpperCase(), PAD, routeY + 17);

  // Flight path line
  const lineY  = routeY - 26;
  const lx1    = PAD + 120;
  const lx2    = LEFT - PAD - 135;
  const midX   = (lx1 + lx2) / 2;

  doc.setDrawColor(...GHOST);
  doc.setLineWidth(0.8);
  doc.line(lx1, lineY, midX - 18, lineY);
  doc.line(midX + 18, lineY, lx2, lineY);

  // ✈ icon
  doc.setFont("helvetica", "normal");
  doc.setFontSize(17);
  doc.setTextColor(...SKY);
  doc.text("✈", midX - 8, lineY + 6);

  // NON-STOP caption
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...GHOST);
  doc.text("NON-STOP", midX, lineY + 18, { align: "center" });

  // TO
  doc.setFont("helvetica", "bold");
  doc.setFontSize(68);
  doc.setTextColor(...WHITE);
  doc.text(pass.toCode, LEFT - PAD, routeY, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GHOST);
  doc.text(
    (toCity?.name ?? pass.toCode).toUpperCase(),
    LEFT - PAD,
    routeY + 17,
    { align: "right" }
  );

  // ── Info row divider ────────────────────────────────────────────────────────
  doc.setDrawColor(...NAVY_MID);
  doc.setLineWidth(0.5);
  doc.line(PAD, routeY + 32, LEFT - PAD, routeY + 32);

  // ── Passenger info columns ──────────────────────────────────────────────────
  const infoY = routeY + 58;
  const fields: [string, string][] = [
    ["PASSENGER", pass.passengerName.toUpperCase()],
    ["PNR",       pass.pnr],
    ["FLIGHT",    pass.flightId],
    ["CLASS",     pass.travelClass],
    ["DEPARTS",   pass.departTime],
  ];

  const usableW = LEFT - PAD * 2;
  const colW    = usableW / fields.length;

  fields.forEach(([label, value], i) => {
    const x = PAD + i * colW;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...GHOST);
    doc.text(label, x, infoY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...WHITE);
    doc.text(value, x, infoY + 16);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 2.  PERFORATION
  // ═══════════════════════════════════════════════════════════════════════════
  doc.setDrawColor(...SLATE400);
  doc.setLineWidth(0.6);
  doc.setLineDashPattern([5, 5], 0);
  doc.line(LEFT, 14, LEFT, H - 14);
  doc.setLineDashPattern([], 0);

  // Semicircle cutouts
  doc.setFillColor(...WHITE);
  doc.circle(LEFT, 14, 6, "F");
  doc.circle(LEFT, H - 14, 6, "F");

  // ═══════════════════════════════════════════════════════════════════════════
  // 3.  RIGHT WHITE STUB
  // ═══════════════════════════════════════════════════════════════════════════
  doc.setFillColor(...SLATE50);
  doc.roundedRect(LEFT - 4, 0, STUB + 4, H, 0, 16, "F");
  doc.rect(LEFT - 4, 0, 16, H, "F"); // flatten left edge of stub

  const sx  = LEFT + 22;   // left edge of stub content
  const sx2 = W - 18;      // right edge for alignment

  // ── SEAT ───────────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...SLATE400);
  doc.text("SEAT", sx, 36);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.setTextColor(...AMBER);
  doc.text(pass.seatLabel, sx, 72);

  // Divider
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(sx, 82, sx2, 82);

  // ── GATE ───────────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...SLATE400);
  doc.text("GATE", sx, 100);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...NAVY900);
  doc.text(pass.gate, sx, 120);

  // ── BOARDING ────────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...SLATE400);
  doc.text("BOARDING", sx, 143);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...NAVY900);
  doc.text(pass.boardingTime, sx, 161);

  // ── SEQ ─────────────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...SLATE400);
  doc.text("SEQ", sx, 184);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...NAVY900);
  doc.text(String(pass.seq).padStart(3, "0"), sx, 202);

  // ── Mini QR placeholder ─────────────────────────────────────────────────────
  const qrX  = sx;
  const qrY  = 215;
  const cell = 6;
  const gap  = 0.8;
  const qr   = [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,0,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1],
  ];
  qr.forEach((row, ri) =>
    row.forEach((on, ci) => {
      doc.setFillColor(...(on ? NAVY900 : SLATE50) as [number,number,number]);
      doc.rect(qrX + ci*(cell+gap), qrY + ri*(cell+gap), cell, cell, "F");
    })
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(...SLATE400);
  doc.text("SCAN AT GATE", qrX, qrY + 7*(cell+gap) + 10);

  // ── Save ────────────────────────────────────────────────────────────────────
  doc.save(`SkyRoute-BoardingPass-${pass.pnr}-${pass.seatLabel}.pdf`);
}