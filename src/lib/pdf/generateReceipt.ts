import jsPDF from "jspdf";
import { Booking, FlightOffer, Transaction } from "@/types";
import { findCity } from "@/lib/data/cities";

export function generateReceiptPdf(
  booking: Booking,
  flight: FlightOffer,
  transaction: Transaction
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const fromCity = findCity(flight.fromCode);
  const toCity = findCity(flight.toCode);

  const navy: [number, number, number] = [11, 37, 69];
  const sky: [number, number, number] = [46, 107, 255];
  const slate: [number, number, number] = [100, 116, 139];

  // Header band
  doc.setFillColor(...navy);
  doc.rect(0, 0, 595, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("SkyRoute Airlines", 40, 45);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Payment Receipt", 40, 65);

  doc.setTextColor(...slate);
  doc.setFontSize(10);
  doc.text(`Issued ${new Date(transaction.createdAt).toLocaleString("en-IN")}`, 595 - 40, 65, {
    align: "right",
  });

  let y = 130;
  doc.setTextColor(...navy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Booking details", 40, y);
  doc.setDrawColor(226, 232, 240);
  doc.line(40, y + 6, 555, y + 6);

  y += 30;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);

  const rows: [string, string][] = [
    ["PNR", booking.pnr],
    ["Flight", flight.id],
    ["Route", `${fromCity?.name ?? flight.fromCode} (${flight.fromCode}) -> ${toCity?.name ?? flight.toCode} (${flight.toCode})`],
    ["Travel class", flight.travelClass],
    ["Passengers", String(booking.passengers.length)],
    ["Departure", `${flight.departTime} -> ${flight.arriveTime} (${flight.duration})`],
  ];

  for (const [label, value] of rows) {
    doc.setTextColor(...slate);
    doc.text(label, 40, y);
    doc.setTextColor(30, 41, 59);
    doc.text(value, 220, y);
    y += 22;
  }

  y += 15;
  doc.setTextColor(...navy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Payment details", 40, y);
  doc.line(40, y + 6, 555, y + 6);

  y += 30;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const paymentRows: [string, string][] = [
    ["Payment method", transaction.methodLabel],
    ["Transaction reference", transaction.referenceId],
    ["Status", transaction.status === "success" ? "Paid" : "Failed"],
  ];

  for (const [label, value] of paymentRows) {
    doc.setTextColor(...slate);
    doc.text(label, 40, y);
    doc.setTextColor(30, 41, 59);
    doc.text(value, 220, y);
    y += 22;
  }

  y += 20;
  doc.setFillColor(...sky);
  doc.roundedRect(40, y, 515, 50, 8, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Amount paid", 60, y + 31);
  doc.setFontSize(16);
  doc.text(`INR ${transaction.amount.toLocaleString("en-IN")}`, 535, y + 31, { align: "right" });

  y += 90;
  doc.setTextColor(...slate);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    "This is a system-generated receipt and does not require a signature.",
    40,
    y
  );
  doc.text("SkyRoute Airlines · airlinesflightcontact@gmail.com · +91 982-407-897", 40, y + 14);

  doc.save(`SkyRoute-Receipt-${booking.pnr}.pdf`);
}
