import connectDB from "@/db/connectDB";
import Availability from "@/model/availabilityModel";
import Business from "@/model/businessModel";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    await connectDB();

    const body = await request.json();

    const businessId = body.businessId;
    const workingDays = body.workingDays || [1, 2, 3, 4, 5];
    const start = body.start;
    const end = body.end;
    const breakData = body.break || {
      start: "12:00",
      end: "13:00"
    };
    const slotDuration = body.slotDuration || 30;
    const offDates = body.offDates || [];

    if (!businessId || !start || !end) {
      return NextResponse.json(
        { error: "businessId, start, and end are required" },
        { status: 400 }
      );
    }

    const businessExists = await Business.findById(businessId);

    if (!businessExists) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    const existingAvailability = await Availability.findOne({ businessId });

    if (existingAvailability) {
      return NextResponse.json(
        { error: "Availability already exists for this business" },
        { status: 400 }
      );
    }

    const newAvailability = await Availability.create({
      businessId,
      workingDays,
      start,
      end,
      break: breakData,
      slotDuration,
      offDates
    });

    return NextResponse.json(
      {
        message: "Availability created successfully",
        availability: newAvailability
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error creating availability:", error);
    return NextResponse.json(
      {
        error: "Failed to create availability",
        details: error.message
      },
      { status: 500 }
    );
  }
};