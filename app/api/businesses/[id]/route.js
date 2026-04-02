import connectDB from "@/db/connectDB";
import Business from "@/model/businessModel";
import Service from "@/model/serviceModel";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const businessId = params.id;

    const business = await Business.findById(businessId);
    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    const services = await Service.find({ business: businessId });

    return NextResponse.json({ business, services });
  } catch (error) {
    console.error("Error fetching business details:", error);
    return NextResponse.json(
      { error: "Failed to fetch business details", details: error.message },
      { status: 500 }
    );
  }
}
