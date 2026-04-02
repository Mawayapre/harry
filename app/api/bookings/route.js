import connectDB from "@/db/connectDB";
import Business from "@/model/businessModel";
import Service from "@/model/serviceModel";
import Booking from "@/model/bookingModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { businessId, date, slot, serviceId, customerName } = body;

    if (!businessId || !date || !slot || !serviceId || !customerName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return NextResponse.json({ error: "Business does not exist" }, { status: 404 });
    }

    const service = await Service.findById(serviceId);
    if (!service || service.business.toString() !== businessId.toString()) {
      return NextResponse.json({ error: "Service not found for this business" }, { status: 404 });
    }

    const bookingDate = new Date(date);
    if (Number.isNaN(bookingDate.getTime())) {
      return NextResponse.json({ error: "Invalid booking date" }, { status: 400 });
    }

    const existingBooking = await Booking.findOne({
      businessId,
      date: bookingDate,
      slot
    });

    if (existingBooking) {
      return NextResponse.json({ error: "Slot is already booked" }, { status: 400 });
    }

    const newBooking = await Booking.create({
      businessId,
      serviceId,
      date: bookingDate,
      slot,
      customerName
    });

    return NextResponse.json({ message: "Booking successful", booking: newBooking }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Booking failed", details: error.message },
      { status: 500 }
    );
  }
}
