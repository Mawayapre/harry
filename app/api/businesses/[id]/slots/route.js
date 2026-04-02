import connectDB from "@/db/connectDB";
import Business from "@/model/businessModel";
import Availability from "@/model/availabilityModel";
import Booking from "@/model/bookingModel";
import { NextResponse } from "next/server";
import { generateSlots } from "@/lib/booking";

const isSameDate = (a, b) => {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getUTCFullYear() === db.getUTCFullYear() &&
    da.getUTCMonth() === db.getUTCMonth() &&
    da.getUTCDate() === db.getUTCDate()
  );
};

export async function GET(request, { params }) {
  try {
    await connectDB();

    const businessId = params.id;
    const url = new URL(request.url);
    const dateParam = url.searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json(
        { error: "Query parameter `date` is required (YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    const queryDate = new Date(dateParam);
    if (Number.isNaN(queryDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    const availability = await Availability.findOne({ businessId });
    if (!availability) {
      return NextResponse.json({ message: "No availability configured", slots: [] });
    }

    const dayOfWeek = queryDate.getDay() === 0 ? 7 : queryDate.getDay();
    if (!availability.workingDays.includes(dayOfWeek)) {
      return NextResponse.json({ message: "Business is closed on this date", slots: [] });
    }

    if ((availability.offDates || []).some((offDate) => isSameDate(offDate, queryDate))) {
      return NextResponse.json({ message: "No slots available due to an off day", slots: [] });
    }

    const allSlots = generateSlots({
      start: availability.start,
      end: availability.end,
      break: availability.break || { start: "12:00", end: "13:00" },
      slotDuration: availability.slotDuration
    });

    const bookings = await Booking.find({ businessId, date: queryDate });
    const bookedSlots = bookings.map((b) => b.slot);

    const freeSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

    return NextResponse.json({ slots: freeSlots, message: freeSlots.length === 0 ? "No available slots" : "Slots available" });
  } catch (error) {
    console.error("Error fetching slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch slots", details: error.message },
      { status: 500 }
    );
  }
}
